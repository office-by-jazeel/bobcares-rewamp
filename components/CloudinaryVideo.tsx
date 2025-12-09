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
    // If we have a cloudinaryId, check if it's a full URL or a Cloudinary public ID
    if (cloudinaryId && !hasError) {
      // Check if cloudinaryId is a full URL (starts with http:// or https://)
      const isFullUrl = cloudinaryId.startsWith('http://') || cloudinaryId.startsWith('https://');
      
      if (isFullUrl) {
        // Use the URL directly
        setVideoSrc(cloudinaryId);
      } else if (isCloudinaryConfigured()) {
        // It's a Cloudinary public ID, generate the URL
        try {
          const cloudinaryVideoUrl = getVideoUrl(cloudinaryId, src);
          setVideoSrc(cloudinaryVideoUrl);
        } catch (error) {
          console.warn('Failed to generate Cloudinary video URL, using local:', error);
          setVideoSrc(src);
        }
      } else {
        // Cloudinary not configured, use local
        setVideoSrc(src);
      }
    } else {
      // No cloudinaryId, use local
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

