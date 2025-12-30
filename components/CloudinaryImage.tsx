'use client';

import Image from 'next/image';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { getAssetUrl, isCloudinaryConfigured } from '@/lib/cloudinary';

interface CloudinaryImageProps {
  src: string; // Local path
  cloudinaryId?: string | null; // Cloudinary public ID
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onError?: () => void;
}

/**
 * Image component with Cloudinary support and automatic fallback
 */
export default function CloudinaryImage({
  src,
  cloudinaryId,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 75,
  sizes,
  onError,
}: CloudinaryImageProps) {
  const [hasError, setHasError] = useState(false);
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const hasAttemptedFallbackRef = useRef(false);

  // Reset fallback state when src or cloudinaryId changes
  useEffect(() => {
    hasAttemptedFallbackRef.current = false;
    setHasError(false);
    setFallbackSrc(null);
  }, [src, cloudinaryId]);

  // Compute the image source from props
  const computedSrc = useMemo(() => {
    if (fallbackSrc) {
      return fallbackSrc;
    }
    if (hasError) {
      return src;
    }
    if (cloudinaryId) {
      const isFullUrl = cloudinaryId.startsWith('http://') || cloudinaryId.startsWith('https://');
      if (isFullUrl) {
        return cloudinaryId;
      }
      if (isCloudinaryConfigured()) {
        try {
          return getAssetUrl(cloudinaryId, src, {
            width,
            height,
            quality,
            format: 'auto',
          });
        } catch {
          return src;
        }
      }
    }
    return src;
  }, [cloudinaryId, src, width, height, quality, hasError, fallbackSrc]);

  const handleError = useCallback(() => {
    // Prevent multiple error handler calls
    if (hasAttemptedFallbackRef.current || hasError) {
      return;
    }

    // If Cloudinary image fails, fallback to local
    // Only attempt fallback if we have a cloudinaryId (meaning we tried Cloudinary first)
    if (cloudinaryId && !fallbackSrc) {
      hasAttemptedFallbackRef.current = true;
      setHasError(true);
      setFallbackSrc(src);
      onError?.();
    }
  }, [src, cloudinaryId, hasError, fallbackSrc, onError]);

  const imageProps = fill
    ? {
      fill: true,
      sizes: sizes || '100vw',
    }
    : {
      width: width || 800,
      height: height || 600,
    };

  return (
    <Image
      src={computedSrc}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      onError={handleError}
      {...imageProps}
    />
  );
}

