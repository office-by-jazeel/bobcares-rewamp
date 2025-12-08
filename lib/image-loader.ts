import { getAssetUrl, isCloudinaryConfigured } from './cloudinary';

/**
 * Custom image loader for Next.js Image component
 * Supports Cloudinary with local fallback
 */
export function cloudinaryLoader({
  src,
  width,
  quality = 75,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Check if src is already a full URL (Cloudinary or external)
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Check if src contains cloudinaryId in query params or hash
  const url = new URL(src, 'http://localhost');
  const cloudinaryId = url.searchParams.get('cloudinaryId') || url.hash.slice(1);

  // Extract local path (remove query params and hash)
  const localPath = src.split('?')[0].split('#')[0];

  // If Cloudinary is configured and we have a cloudinaryId, use it
  if (isCloudinaryConfigured() && cloudinaryId) {
    try {
      return getAssetUrl(cloudinaryId, localPath, {
        width,
        quality,
        format: 'auto',
      });
    } catch (error) {
      console.warn('Failed to generate Cloudinary URL, using local:', error);
    }
  }

  // Fallback to local path
  return localPath;
}

/**
 * Helper function to create image src with Cloudinary support
 * @param localPath - Local path to the image (e.g., "/images/hero-bg.jpg")
 * @param cloudinaryId - Optional Cloudinary public ID (e.g., "bobcares/hero-bg")
 * @returns Image src string
 */
export function createImageSrc(
  localPath: string,
  cloudinaryId?: string | null
): string {
  if (cloudinaryId && isCloudinaryConfigured()) {
    // Use query param to pass cloudinaryId to the loader
    return `${localPath}?cloudinaryId=${cloudinaryId}`;
  }
  return localPath;
}

