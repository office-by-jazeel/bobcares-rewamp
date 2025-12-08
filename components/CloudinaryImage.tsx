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
    // If Cloudinary is configured and we have a cloudinaryId, try to use it
    if (isCloudinaryConfigured() && cloudinaryId && !hasError) {
        console.log('Cloudinary is configured and we have a cloudinaryId', cloudinaryId);
      try {
        console.log('Getting Cloudinary URL for', cloudinaryId);
        const cloudinaryUrl = getAssetUrl(cloudinaryId, src, {
          width,
          height,
          quality,
          format: 'auto',
        });
        setImageSrc(cloudinaryUrl);
      } catch (error) {
        console.log('Failed to generate Cloudinary URL, using local:', error);
        console.warn('Failed to generate Cloudinary URL, using local:', error);
        setImageSrc(src);
      }
    } else {
        console.log('Cloudinary is not configured or we have no cloudinaryId or we have an error', cloudinaryId, hasError);
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

