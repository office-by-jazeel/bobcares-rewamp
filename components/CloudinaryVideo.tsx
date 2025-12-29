'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { getVideoUrl, isCloudinaryConfigured } from '@/lib/cloudinary';

interface CloudinaryVideoProps {
  src: string; // Local path
  cloudinaryId?: string | null; // Cloudinary public ID
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  onError?: () => void;
}

/**
 * Video component with Cloudinary support and automatic fallback
 */
export default function CloudinaryVideo({
  src,
  cloudinaryId,
  className,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls = false,
  onError,
}: CloudinaryVideoProps) {
  const [hasError, setHasError] = useState(false);
  const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasAttemptedFallbackRef = useRef(false);

  // Reset fallback state when src or cloudinaryId changes
  useEffect(() => {
    hasAttemptedFallbackRef.current = false;
    setHasError(false);
    setFallbackSrc(null);
  }, [src, cloudinaryId]);

  // Compute the video source from props
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
          return getVideoUrl(cloudinaryId, src);
        } catch {
          return src;
        }
      }
    }
    return src;
  }, [cloudinaryId, src, hasError, fallbackSrc]);

  const handleError = useCallback(() => {
    // Prevent multiple error handler calls
    if (hasAttemptedFallbackRef.current || hasError) {
      return;
    }

    // If Cloudinary video fails, fallback to local
    // Only attempt fallback if we have a cloudinaryId (meaning we tried Cloudinary first)
    if (cloudinaryId && !fallbackSrc) {
      hasAttemptedFallbackRef.current = true;
      setHasError(true);
      setFallbackSrc(src);
      onError?.();
    }
  }, [src, cloudinaryId, hasError, fallbackSrc, onError]);

  return (
    <video
      ref={videoRef}
      src={computedSrc}
      className={className}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline={playsInline}
      controls={controls}
      onError={handleError}
    />
  );
}

