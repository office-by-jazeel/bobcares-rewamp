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

const MAX_RETRIES = 2;
const RETRY_DELAYS = [1000, 2000]; // Exponential backoff: 1s, 2s
const CLOUDINARY_TIMEOUT = 12000; // 12 seconds timeout for Cloudinary requests

/**
 * Image component with Cloudinary support, retry logic, and automatic fallback
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
  const [retryCount, setRetryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0); // Key to force re-render on retry
  const hasAttemptedFallbackRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset all states when src or cloudinaryId changes
  useEffect(() => {
    // Clear any pending timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    // Reset states
    hasAttemptedFallbackRef.current = false;
    setHasError(false);
    setFallbackSrc(null);
    setRetryCount(0);
    setIsLoading(true);
    setImageKey(0);
  }, [src, cloudinaryId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // Compute the image source from props
  const computedSrc = useMemo(() => {
    if (fallbackSrc) {
      return fallbackSrc;
    }
    if (hasError && retryCount >= MAX_RETRIES) {
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
  }, [cloudinaryId, src, width, height, quality, hasError, fallbackSrc, retryCount]);

  // Set up timeout for Cloudinary images
  useEffect(() => {
    if (!cloudinaryId || fallbackSrc || !isLoading) {
      return;
    }

    // Only set timeout for Cloudinary images (not local fallback)
    if (computedSrc.startsWith('https://res.cloudinary.com')) {
      loadTimeoutRef.current = setTimeout(() => {
        // Check conditions again in timeout callback
        if (retryCount < MAX_RETRIES && cloudinaryId && !fallbackSrc) {
          const nextRetryCount = retryCount + 1;
          const delay = RETRY_DELAYS[nextRetryCount - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
          
          setHasError(false);
          setIsLoading(true);
          
          retryTimeoutRef.current = setTimeout(() => {
            setRetryCount(nextRetryCount);
            setImageKey((prev) => prev + 1);
          }, delay);
        }
      }, CLOUDINARY_TIMEOUT);
    }

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [computedSrc, isLoading, retryCount, cloudinaryId, fallbackSrc]);

  const handleRetry = useCallback(() => {
    if (retryCount >= MAX_RETRIES || !cloudinaryId || fallbackSrc) {
      return;
    }

    const nextRetryCount = retryCount + 1;
    const delay = RETRY_DELAYS[nextRetryCount - 1] || RETRY_DELAYS[RETRY_DELAYS.length - 1];

    // Clear existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    // Reset error state and retry
    setHasError(false);
    setIsLoading(true);
    
    retryTimeoutRef.current = setTimeout(() => {
      setRetryCount(nextRetryCount);
      // Force image reload by updating the key to trigger re-render
      setImageKey((prev) => prev + 1);
    }, delay);
  }, [retryCount, cloudinaryId, fallbackSrc]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    setRetryCount(0);
    
    // Clear timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);

    // Clear load timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    // Prevent multiple error handler calls
    if (hasAttemptedFallbackRef.current && retryCount >= MAX_RETRIES) {
      return;
    }

    // If Cloudinary image fails, try retrying before falling back to local
    if (cloudinaryId && !fallbackSrc) {
      if (retryCount < MAX_RETRIES) {
        // Retry Cloudinary with exponential backoff
        handleRetry();
      } else {
        // All retries exhausted, fallback to local
        hasAttemptedFallbackRef.current = true;
        setHasError(true);
        setFallbackSrc(src);
        onError?.();
      }
    } else if (!cloudinaryId) {
      // No cloudinaryId, just call onError
      onError?.();
    }
  }, [src, cloudinaryId, hasError, fallbackSrc, onError, retryCount, handleRetry]);

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
      key={`${computedSrc}-${imageKey}`}
      src={computedSrc}
      alt={alt}
      className={className}
      priority={priority}
      quality={quality}
      onLoad={handleLoad}
      onError={handleError}
      {...imageProps}
    />
  );
}

