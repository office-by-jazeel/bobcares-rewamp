/**
 * Cloudinary asset management with local fallback
 */

interface CloudinaryConfig {
  cloudName: string;
  apiKey?: string;
  apiSecret?: string;
}

/**
 * Get Cloudinary configuration from environment variables
 */
export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    return null;
  }

  return {
    cloudName,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  };
}

/**
 * Check if Cloudinary is configured
 */
export function isCloudinaryConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
}

/**
 * Generate Cloudinary URL for an image
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    transformation?: string;
  } = {}
): string {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error('Cloudinary not configured');
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    transformation = '',
  } = options;

  let url = `https://res.cloudinary.com/${config.cloudName}/image/upload`;

  // Add transformations
  const transformations: string[] = [];
  
  if (width || height) {
    transformations.push(`w_${width || 'auto'},h_${height || 'auto'}`);
  }
  
  if (quality) {
    transformations.push(`q_${quality}`);
  }
  
  if (format) {
    transformations.push(`f_${format}`);
  }
  
  if (transformation) {
    transformations.push(transformation);
  }

  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`;
  }

  url += `/${publicId}`;

  return url;
}

/**
 * Generate Cloudinary URL for a video
 */
export function getCloudinaryVideoUrl(
  publicId: string,
  options: {
    format?: string;
    transformation?: string;
  } = {}
): string {
  const config = getCloudinaryConfig();
  if (!config) {
    throw new Error('Cloudinary not configured');
  }

  const {
    format = 'auto',
    transformation = '',
  } = options;

  let url = `https://res.cloudinary.com/${config.cloudName}/video/upload`;

  // Add transformations
  const transformations: string[] = [];
  
  if (format) {
    transformations.push(`f_${format}`);
  }
  
  if (transformation) {
    transformations.push(transformation);
  }

  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`;
  }

  url += `/${publicId}`;

  return url;
}

/**
 * Get asset URL with Cloudinary fallback to local
 * @param cloudinaryId - Cloudinary public ID (e.g., "bobcares/hero-bg")
 * @param localPath - Local path (e.g., "/_next/images/hero-bg.jpg")
 * @param options - Cloudinary transformation options
 * @returns URL string
 */
export function getAssetUrl(
  cloudinaryId: string | null | undefined,
  localPath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    transformation?: string;
  } = {}
): string {
  // If Cloudinary is not configured or no cloudinaryId provided, use local
  if (!isCloudinaryConfigured() || !cloudinaryId) {
    return localPath;
  }

  try {
    return getCloudinaryUrl(cloudinaryId, options);
  } catch (error) {
    console.warn('Failed to generate Cloudinary URL, using local:', error);
    return localPath;
  }
}

/**
 * Get video URL with Cloudinary fallback to local
 */
export function getVideoUrl(
  cloudinaryId: string | null | undefined,
  localPath: string,
  options: {
    format?: string;
    transformation?: string;
  } = {}
): string {
  // If Cloudinary is not configured or no cloudinaryId provided, use local
  if (!isCloudinaryConfigured() || !cloudinaryId) {
    return localPath;
  }

  try {
    return getCloudinaryVideoUrl(cloudinaryId, options);
  } catch (error) {
    console.warn('Failed to generate Cloudinary video URL, using local:', error);
    return localPath;
  }
}

/**
 * Check if an image exists at a URL (for fallback logic)
 */
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get asset URL with automatic fallback checking
 * This will try Cloudinary first, then fallback to local if it fails
 */
export async function getAssetUrlWithFallback(
  cloudinaryId: string | null | undefined,
  localPath: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
    transformation?: string;
  } = {}
): Promise<string> {
  // If Cloudinary is not configured or no cloudinaryId, use local
  if (!isCloudinaryConfigured() || !cloudinaryId) {
    return localPath;
  }

  try {
    const cloudinaryUrl = getCloudinaryUrl(cloudinaryId, options);
    
    // Check if image exists on Cloudinary
    const exists = await checkImageExists(cloudinaryUrl);
    
    if (exists) {
      return cloudinaryUrl;
    } else {
      console.warn(`Cloudinary image not found: ${cloudinaryId}, using local: ${localPath}`);
      return localPath;
    }
  } catch (error) {
    console.warn('Error checking Cloudinary, using local:', error);
    return localPath;
  }
}

