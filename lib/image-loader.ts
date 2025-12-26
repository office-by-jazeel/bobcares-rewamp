import { getAssetUrl, isCloudinaryConfigured } from './cloudinary';

/**
 * Custom image loader for Next.js Image component
 * Routes all images (including SVGs) through /_next/image
 * Supports Cloudinary with local fallback via /api/assets
 * 
 * This is the default export required by Next.js loaderFile
 */
export default function cloudinaryLoader({
  src,
  width,
  quality = 75,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Check if src is already a full URL (Cloudinary or external)
  // These will be passed through as-is to /_next/image
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Check if src contains cloudinaryId in query params
  const url = new URL(src, 'http://localhost');
  const cloudinaryId = url.searchParams.get('cloudinaryId');

  // Extract local path (remove query params and hash)
  const localPath = src.split('?')[0].split('#')[0];

  // Route through /api/assets for centralized asset handling
  // This ensures all assets (including SVGs) go through the API route
  // which can then handle Cloudinary fallback
  const apiPath = `/api/assets${localPath}`;
  const params = new URLSearchParams();

  if (cloudinaryId) {
    params.set('cloudinaryId', cloudinaryId);
  }
  if (width) {
    params.set('width', width.toString());
  }
  if (quality && quality !== 75) {
    params.set('quality', quality.toString());
  }

  const queryString = params.toString();
  return queryString ? `${apiPath}?${queryString}` : apiPath;
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

