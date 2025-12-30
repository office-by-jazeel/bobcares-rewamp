/**
 * Image preloader utility for critical images
 * Helps reduce initial load failures by preloading images before they're needed
 */

import { getAssetUrl, isCloudinaryConfigured } from './cloudinary';

interface PreloadImageOptions {
    cloudinaryId?: string | null;
    localPath: string;
    width?: number;
    height?: number;
    quality?: number;
}

/**
 * Preload a single image
 * @param options - Image options including cloudinaryId and localPath
 * @returns Promise that resolves when image is loaded or fails
 */
export function preloadImage(options: PreloadImageOptions): Promise<void> {
    const { cloudinaryId, localPath, width, height, quality } = options;

    return new Promise((resolve, reject) => {
        let imageSrc = localPath;

        // Try to get Cloudinary URL if available
        if (cloudinaryId && isCloudinaryConfigured()) {
            try {
                imageSrc = getAssetUrl(cloudinaryId, localPath, {
                    width,
                    height,
                    quality,
                    format: 'auto',
                });
            } catch (error) {
                console.warn('Failed to generate Cloudinary URL for preload, using local:', error);
            }
        }

        const img = new Image();

        img.onload = () => {
            resolve();
        };

        img.onerror = () => {
            // If Cloudinary failed, try local fallback
            if (cloudinaryId && imageSrc !== localPath) {
                const fallbackImg = new Image();
                fallbackImg.onload = () => resolve();
                fallbackImg.onerror = () => reject(new Error(`Failed to preload image: ${localPath}`));
                fallbackImg.src = localPath;
            } else {
                reject(new Error(`Failed to preload image: ${localPath}`));
            }
        };

        img.src = imageSrc;
    });
}

/**
 * Preload multiple images in parallel
 * @param images - Array of image options to preload
 * @returns Promise that resolves when all images are loaded (or failed)
 */
export function preloadImages(images: PreloadImageOptions[]): Promise<void[]> {
    return Promise.allSettled(
        images.map((image) => preloadImage(image))
    ).then((results) => {
        const errors = results
            .filter((result) => result.status === 'rejected')
            .map((result) => (result as PromiseRejectedResult).reason);

        if (errors.length > 0) {
            console.warn('Some images failed to preload:', errors);
        }

        return Promise.resolve();
    }) as Promise<void[]>;
}

/**
 * Preload critical above-the-fold images
 * Call this early in your app lifecycle (e.g., in _app.tsx or layout.tsx)
 * @param criticalImages - Array of critical image options
 */
export function preloadCriticalImages(criticalImages: PreloadImageOptions[]): void {
    // Use requestIdleCallback if available, otherwise setTimeout
    if (typeof window !== 'undefined') {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                preloadImages(criticalImages).catch((error) => {
                    console.warn('Failed to preload critical images:', error);
                });
            });
        } else {
            setTimeout(() => {
                preloadImages(criticalImages).catch((error) => {
                    console.warn('Failed to preload critical images:', error);
                });
            }, 100);
        }
    }
}

