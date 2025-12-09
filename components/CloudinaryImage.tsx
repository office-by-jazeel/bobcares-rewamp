'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
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
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // If we have a cloudinaryId, check if it's a full URL or a Cloudinary public ID
    if (cloudinaryId && !hasError) {
      // Check if cloudinaryId is a full URL (starts with http:// or https://)
      const isFullUrl = cloudinaryId.startsWith('http://') || cloudinaryId.startsWith('https://');
      
      if (isFullUrl) {
        // Use the URL directly
        setImageSrc(cloudinaryId);
      } else if (isCloudinaryConfigured()) {
        // It's a Cloudinary public ID, generate the URL
        try {
          const cloudinaryUrl = getAssetUrl(cloudinaryId, src, {
            width,
            height,
            quality,
            format: 'auto',
          });
          setImageSrc(cloudinaryUrl);
        } catch (error) {
          console.warn('Failed to generate Cloudinary URL, using local:', error);
          setImageSrc(src);
        }
      } else {
        // Cloudinary not configured, use local
        setImageSrc(src);
      }
    } else {
      // No cloudinaryId, use local
      setImageSrc(src);
    }
  }, [cloudinaryId, src, width, height, quality, hasError]);

  const handleError = () => {
    // If Cloudinary image fails, fallback to local
    if (imageSrc !== src && !hasError) {
      setHasError(true);
      setImageSrc(src);
      onError?.();
    }
  };

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
      src={imageSrc}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      onError={handleError}
      {...imageProps}
    />
  );
}

