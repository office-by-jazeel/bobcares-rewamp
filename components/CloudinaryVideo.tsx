'use client';

import { useState, useMemo, useRef } from 'react';
import { getVideoUrl, isCloudinaryConfigured } from '@/lib/cloudinary';
import { createVideoUrl } from '@/lib/video-url';

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
 * Routes all videos through /api/assets for centralized asset handling
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

  // Compute the video source from props
  // Route through /api/assets for centralized handling
  const computedSrc = useMemo(() => {
    if (fallbackSrc) {
      return fallbackSrc;
    }
    if (hasError) {
      // On error, use direct local path (bypass API route)
      return src;
    }
    if (cloudinaryId) {
      const isFullUrl = cloudinaryId.startsWith('http://') || cloudinaryId.startsWith('https://');
      if (isFullUrl) {
        // Full Cloudinary URL, use directly
        return cloudinaryId;
      }
      // Route through /api/assets with cloudinaryId
      return createVideoUrl(src, cloudinaryId);
    }
    // No cloudinaryId, but still route through /api/assets
    return createVideoUrl(src);
  }, [cloudinaryId, src, hasError, fallbackSrc]);

  const handleError = () => {
    // If Cloudinary video fails, fallback to local
    if (computedSrc !== src && !hasError) {
      setHasError(true);
      setFallbackSrc(src);
      onError?.();
    }
  };

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

