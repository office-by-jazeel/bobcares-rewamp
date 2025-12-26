/**
 * Helper to generate video URLs that route through /api/assets
 * This ensures all videos go through the centralized asset route
 */

/**
 * Generate a video URL that routes through /api/assets
 * @param localPath - Local path to the video (e.g., "/videos/cta.mp4")
 * @param cloudinaryId - Optional Cloudinary public ID (e.g., "bobcares/cta")
 * @returns Video URL string that routes through /api/assets
 */
export function createVideoUrl(
    localPath: string,
    cloudinaryId?: string | null
): string {
    const apiPath = `/api/assets${localPath}`;

    if (cloudinaryId) {
        const params = new URLSearchParams();
        params.set('cloudinaryId', cloudinaryId);
        return `${apiPath}?${params.toString()}`;
    }

    return apiPath;
}

