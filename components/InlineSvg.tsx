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
   * - dots: highlights nearby small path elements (dots) when hovering on any SVG element
   */
  hoverMode?: 'single' | 'cluster' | 'dots';
  /** Number of nearby elements to light up in cluster mode (default: 12) */
  clusterCount?: number;
  /** Optional max radius (in SVG units) for cluster mode. When omitted, uses nearest-N only. */
  clusterRadius?: number;
  /** Maximum bounding box area (width * height) to consider an element a "dot" (default: 2500 SVG units²) */
  dotMaxSize?: number;
  /** Number of nearby dots to highlight in dots mode (default: 8) */
  dotHighlightCount?: number;
  /** Maximum distance to search for dots (in SVG units). When omitted, calculated based on SVG viewBox. */
  dotMaxDistance?: number;
  /** Callback fired when SVG is loaded and rendered */
  onLoad?: () => void;
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
  dotMaxSize = 2500,
  dotHighlightCount = 8,
  dotMaxDistance,
  onLoad,
}: InlineSvgProps) {
  const [svgMarkup, setSvgMarkup] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const onLoadCalledRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    onLoadCalledRef.current = false; // Reset when src changes

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
  }, [src, className, ariaLabel, onLoad]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !svgMarkup) return;

    const svg = container.querySelector('svg');
    if (!svg) return;

    // Call onLoad when SVG is rendered in DOM (only once)
    if (onLoad && !onLoadCalledRef.current) {
      onLoadCalledRef.current = true;
      // Use requestAnimationFrame to ensure SVG is fully rendered
      requestAnimationFrame(() => {
        onLoad();
      });
    }

    const selector = 'path,polygon,rect,circle,ellipse';

    // Dots mode: identify small path elements and highlight nearby dots on hover
    if (hoverMode === 'dots') {
      const svgEl = svg as SVGSVGElement;
      const allElements = Array.from(svgEl.querySelectorAll(selector)).filter(
        (n): n is SVGGraphicsElement => n instanceof SVGGraphicsElement,
      );

      // Pre-process: identify dots (small path elements) and store their positions
      const dots: Array<{ el: SVGGraphicsElement; cx: number; cy: number }> = [];
      const regions: SVGGraphicsElement[] = [];

      for (const el of allElements) {
        try {
          const bb = el.getBBox();
          // Skip degenerate boxes
          if (!Number.isFinite(bb.x) || !Number.isFinite(bb.y) || bb.width === 0 || bb.height === 0) continue;

          // Calculate bounding box area
          const area = bb.width * bb.height;

          // Convert center to root SVG viewport coordinates
          const ctm = el.getCTM();
          if (!ctm) continue;
          const pt = svgEl.createSVGPoint();
          pt.x = bb.x + bb.width / 2;
          pt.y = bb.y + bb.height / 2;
          const p2 = pt.matrixTransform(ctm);

          // Classify as dot if area is below threshold
          if (area < dotMaxSize) {
            // Ensure smooth transitions for dots
            el.style.setProperty('transition', 'fill 200ms ease-in-out', 'important');
            dots.push({ el, cx: p2.x, cy: p2.y });
          } else {
            regions.push(el);
          }
        } catch {
          // Some SVG elements may not support getBBox depending on state
        }
      }

      // Calculate default max distance if not provided (10% of SVG diagonal)
      const viewBox = svgEl.viewBox.baseVal;
      const svgWidth = viewBox.width || svgEl.clientWidth;
      const svgHeight = viewBox.height || svgEl.clientHeight;
      const defaultMaxDistance = Math.sqrt(svgWidth * svgWidth + svgHeight * svgHeight) * 0.1;
      const maxDistance = dotMaxDistance ?? defaultMaxDistance;
      const maxDistance2 = maxDistance * maxDistance;

      const activeDots = new Set<SVGGraphicsElement>();
      let rafId: number | null = null;
      let lastHoveredElement: SVGGraphicsElement | null = null;

      const clientToSvgPoint = (clientX: number, clientY: number) => {
        const ctm = svgEl.getScreenCTM();
        if (!ctm) return null;
        const pt = svgEl.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const transformed = pt.matrixTransform(ctm.inverse());
        return { x: transformed.x, y: transformed.y };
      };

      const getElementCenter = (el: SVGGraphicsElement) => {
        try {
          const bb = el.getBBox();
          const ctm = el.getCTM();
          if (!ctm) return null;
          const pt = svgEl.createSVGPoint();
          pt.x = bb.x + bb.width / 2;
          pt.y = bb.y + bb.height / 2;
          const p2 = pt.matrixTransform(ctm);
          return { x: p2.x, y: p2.y };
        } catch {
          return null;
        }
      };

      const updateDotsHighlight = () => {
        rafId = null;
        if (!lastHoveredElement) {
          // Clear all highlights
          for (const dot of activeDots) {
            dot.style.removeProperty('fill');
          }
          activeDots.clear();
          return;
        }

        const hoverCenter = getElementCenter(lastHoveredElement);
        if (!hoverCenter) return;

        const { x, y } = hoverCenter;

        // Find nearest dots within max distance
        const candidates: Array<{ el: SVGGraphicsElement; d2: number }> = [];
        for (const dot of dots) {
          const dx = dot.cx - x;
          const dy = dot.cy - y;
          const d2 = dx * dx + dy * dy;
          if (d2 <= maxDistance2) {
            candidates.push({ el: dot.el, d2 });
          }
        }

        // Sort by distance and select nearest N
        candidates.sort((a, b) => a.d2 - b.d2);
        const toHighlight = candidates.slice(0, dotHighlightCount).map((c) => c.el);
        const nextActive = new Set(toHighlight);

        // Remove highlight from dots no longer active (with smooth transition)
        for (const dot of activeDots) {
          if (!nextActive.has(dot)) {
            // Ensure transition is set before removing fill for smooth fade-out
            dot.style.setProperty('transition', 'fill 200ms ease-in-out', 'important');
            dot.style.removeProperty('fill');
          }
        }

        // Add highlight to newly active dots (with smooth transition)
        for (const dot of nextActive) {
          if (!activeDots.has(dot)) {
            // Ensure transition is set before setting fill for smooth fade-in
            dot.style.setProperty('transition', 'fill 200ms ease-in-out', 'important');
            dot.style.setProperty('fill', '#ffffff', 'important');
          }
        }

        activeDots.clear();
        for (const dot of nextActive) activeDots.add(dot);
      };

      const onPointerMove = (e: PointerEvent) => {
        const target = e.target;
        if (!target || !(target instanceof SVGGraphicsElement)) return;
        if (!target.matches(selector)) return;

        // Process hover on any SVG element to highlight nearby dots
        lastHoveredElement = target;
        if (rafId == null) rafId = window.requestAnimationFrame(updateDotsHighlight);
      };

      const onPointerLeave = () => {
        lastHoveredElement = null;
        if (rafId != null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
        updateDotsHighlight();
      };

      svgEl.addEventListener('pointermove', onPointerMove);
      svgEl.addEventListener('pointerleave', onPointerLeave);

      return () => {
        svgEl.removeEventListener('pointermove', onPointerMove);
        svgEl.removeEventListener('pointerleave', onPointerLeave);
        if (rafId != null) {
          window.cancelAnimationFrame(rafId);
        }
        for (const dot of activeDots) {
          dot.style.removeProperty('fill');
        }
        activeDots.clear();
      };
    }

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
  }, [svgMarkup, hoverMode, clusterCount, clusterRadius, dotMaxSize, dotHighlightCount, dotMaxDistance, onLoad]);

  if (!svgMarkup) return null;

  // eslint-disable-next-line react/no-danger
  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svgMarkup }} />;
}


