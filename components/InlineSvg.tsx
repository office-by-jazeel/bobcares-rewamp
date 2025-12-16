'use client';

import { useEffect, useRef, useState } from 'react';

interface InlineSvgProps {
  src: string;
  className?: string;
  ariaLabel?: string;
  /**
   * Hover behavior for SVG internal elements.
   * - single: only the element under the cursor is forced to white
   * - cluster: the nearest N elements around the cursor are forced to white
   */
  hoverMode?: 'single' | 'cluster';
  /** Number of nearby elements to light up in cluster mode (default: 12) */
  clusterCount?: number;
  /** Optional max radius (in SVG units) for cluster mode. When omitted, uses nearest-N only. */
  clusterRadius?: number;
}

/**
 * Inlines an SVG from the public/ folder so internal elements can be hovered/styled.
 * This is required because SVGs rendered via <img> / next/image don't expose
 * their internal <path> elements for hover interactions.
 */
export default function InlineSvg({
  src,
  className,
  ariaLabel,
  hoverMode = 'single',
  clusterCount = 12,
  clusterRadius,
}: InlineSvgProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const res = await fetch(src);
      const text = await res.text();
      if (cancelled) return;

      // Ensure the root <svg> is responsive and can receive the provided className.
      const responsiveStyle = 'width:100%;height:auto;display:block;';
      const patched = text.replace(/<svg\b([^>]*)>/i, (_match, attrs: string) => {
        let nextAttrs = attrs;

        // Merge/append style
        if (/\sstyle=/.test(nextAttrs)) {
          nextAttrs = nextAttrs.replace(/\sstyle=(["'])(.*?)\1/i, (_m, q: string, val: string) => {
            const merged = val.includes(responsiveStyle) ? val : `${val};${responsiveStyle}`;
            return ` style=${q}${merged}${q}`;
          });
        } else {
          nextAttrs = `${nextAttrs} style="${responsiveStyle}"`;
        }

        // Merge/append className
        if (className) {
          if (/\sclass=/.test(nextAttrs)) {
            nextAttrs = nextAttrs.replace(/\sclass=(["'])(.*?)\1/i, (_m, q: string, val: string) => {
              return ` class=${q}${val} ${className}${q}`;
            });
          } else {
            nextAttrs = `${nextAttrs} class="${className}"`;
          }
        }

        // Add an aria-label if requested
        if (ariaLabel && !/\saria-label=/.test(nextAttrs)) {
          nextAttrs = `${nextAttrs} aria-label="${ariaLabel}"`;
        }

        return `<svg${nextAttrs}>`;
      });

      setSvgMarkup(patched);
    }

    load().catch(() => {
      if (!cancelled) setSvgMarkup('');
    });

    return () => {
      cancelled = true;
    };
  }, [src, className, ariaLabel]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgMarkup) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    const selector = 'path,polygon,rect,circle,ellipse';

    // Default: highlight only the element under cursor
    if (hoverMode === 'single') {
      const onMouseOver = (e: Event) => {
        const el = e.target as Element | null;
        if (!el || !(el instanceof SVGElement)) return;
        if (!el.matches(selector)) return;
        el.style.setProperty('fill', '#ffffff', 'important');
      };

      const onMouseOut = (e: Event) => {
        const el = e.target as Element | null;
        if (!el || !(el instanceof SVGElement)) return;
        if (!el.matches(selector)) return;
        el.style.removeProperty('fill');
      };

      svg.addEventListener('mouseover', onMouseOver);
      svg.addEventListener('mouseout', onMouseOut);

      return () => {
        svg.removeEventListener('mouseover', onMouseOver);
        svg.removeEventListener('mouseout', onMouseOut);
      };
    }

    // Cluster mode: highlight the nearest N elements around the cursor
    const svgEl = svg as SVGSVGElement;
    const elements = Array.from(svgEl.querySelectorAll(selector)).filter(
      (n): n is SVGGraphicsElement => n instanceof SVGGraphicsElement,
    );

    const items: Array<{ el: SVGGraphicsElement; cx: number; cy: number }> = [];
    for (const el of elements) {
      try {
        const bb = el.getBBox();
        // Skip degenerate boxes
        if (!Number.isFinite(bb.x) || !Number.isFinite(bb.y) || bb.width === 0 || bb.height === 0) continue;
        // IMPORTANT: This SVG uses nested <g transform="..."> (Inkscape export),
        // so bbox centers must be converted into the root SVG viewport coordinates.
        const ctm = el.getCTM();
        if (!ctm) continue;
        const pt = svgEl.createSVGPoint();
        pt.x = bb.x + bb.width / 2;
        pt.y = bb.y + bb.height / 2;
        const p2 = pt.matrixTransform(ctm);
        items.push({ el, cx: p2.x, cy: p2.y });
      } catch {
        // Some SVG elements may not support getBBox depending on state
      }
    }

    const active = new Set<SVGGraphicsElement>();
    let rafId: number | null = null;
    let lastPoint: { x: number; y: number } | null = null;
    const radius2 = typeof clusterRadius === 'number' ? clusterRadius * clusterRadius : null;

    const clientToSvgPoint = (clientX: number, clientY: number) => {
      const ctm = svgEl.getScreenCTM();
      if (!ctm) return null;
      const pt = svgEl.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    };

    const updateCluster = () => {
      rafId = null;
      if (!lastPoint) return;
      const { x, y } = lastPoint;

      const best: Array<{ el: SVGGraphicsElement; d2: number }> = [];
      for (const it of items) {
        const dx = it.cx - x;
        const dy = it.cy - y;
        const d2 = dx * dx + dy * dy;
        if (radius2 !== null && d2 > radius2) continue;

        if (best.length < clusterCount) {
          best.push({ el: it.el, d2 });
          if (best.length === clusterCount) best.sort((a, b) => b.d2 - a.d2); // worst first
          continue;
        }

        // Replace current worst if better
        if (d2 < best[0].d2) {
          best[0] = { el: it.el, d2 };
          best.sort((a, b) => b.d2 - a.d2);
        }
      }

      const next = new Set(best.map((b) => b.el));

      for (const el of active) {
        if (!next.has(el)) el.style.removeProperty('fill');
      }
      for (const el of next) {
        if (!active.has(el)) el.style.setProperty('fill', '#ffffff', 'important');
      }

      active.clear();
      for (const el of next) active.add(el);
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = clientToSvgPoint(e.clientX, e.clientY);
      if (!p) return;
      lastPoint = p;
      if (rafId == null) rafId = window.requestAnimationFrame(updateCluster);
    };

    const clear = () => {
      lastPoint = null;
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
        rafId = null;
      }
      for (const el of active) el.style.removeProperty('fill');
      active.clear();
    };

    svgEl.addEventListener('pointermove', onPointerMove);
    svgEl.addEventListener('pointerleave', clear);

    return () => {
      svgEl.removeEventListener('pointermove', onPointerMove);
      svgEl.removeEventListener('pointerleave', clear);
      clear();
    };
  }, [svgMarkup, hoverMode, clusterCount, clusterRadius]);

  if (!svgMarkup) return null;

  // eslint-disable-next-line react/no-danger
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
}


