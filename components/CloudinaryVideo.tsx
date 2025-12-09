'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [videoSrc, setVideoSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // If Cloudinary is configured and we have a cloudinaryId, try to use it
    if (isCloudinaryConfigured() && cloudinaryId && !hasError) {
      try {
        const cloudinaryVideoUrl = getVideoUrl(cloudinaryId, src);
        setVideoSrc(cloudinaryVideoUrl);
      } catch (error) {
        console.warn('Failed to generate Cloudinary video URL, using local:', error);
        setVideoSrc(src);
      }
    } else {
      setVideoSrc(src);
    }
  }, [cloudinaryId, src, hasError]);

  const handleError = () => {
    // If Cloudinary video fails, fallback to local
    if (videoSrc !== src && !hasError) {
      setHasError(true);
      setVideoSrc(src);
      onError?.();
    }
  };

  return (
    <video
      ref={videoRef}
      src={videoSrc}
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

