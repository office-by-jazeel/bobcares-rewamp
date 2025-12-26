import { NextRequest, NextResponse } from 'next/server';
import { getAssetUrlWithFallback, getVideoUrl, isCloudinaryConfigured } from '@/lib/cloudinary';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * API route to serve assets with Cloudinary fallback
 * Routes all assets (images, SVGs, videos) through this endpoint
 * Usage: /api/assets/icons/logo.svg?cloudinaryId=bobcares/logo
 *        /api/assets/videos/cta.mp4?cloudinaryId=bobcares/cta
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const path = pathArray.join('/');
    const { searchParams } = new URL(request.url);

    const cloudinaryId = searchParams.get('cloudinaryId');
    const width = searchParams.get('width') ? parseInt(searchParams.get('width')!) : undefined;
    const height = searchParams.get('height') ? parseInt(searchParams.get('height')!) : undefined;
    const qualityParam = searchParams.get('quality');
    const quality = qualityParam && qualityParam !== 'auto' ? parseInt(qualityParam) : undefined;
    const format = searchParams.get('format') || 'auto';

    // Construct local path
    const localPath = `/${path}`;

    // Check if this is a video file
    const isVideo = /\.(mp4|webm|mov|avi|m3u8)$/i.test(localPath);

    let assetUrl: string;

    if (isVideo) {
      // For videos, use getVideoUrl (doesn't support width/height/quality)
      assetUrl = getVideoUrl(cloudinaryId, localPath, {
        format,
      });
    } else {
      // For images/SVGs, use getAssetUrlWithFallback
      assetUrl = await getAssetUrlWithFallback(cloudinaryId, localPath, {
        width,
        height,
        quality,
        format,
      });
    }

    // If it's a Cloudinary URL, redirect to it
    if (assetUrl.startsWith('http://') || assetUrl.startsWith('https://')) {
      return NextResponse.redirect(assetUrl);
    }

    // If it's a local path, serve the file from public directory
    // This ensures Next.js Image optimization can fetch the file
    const publicPath = join(process.cwd(), 'public', assetUrl);

    if (existsSync(publicPath)) {
      const fileBuffer = await readFile(publicPath);
      const contentType = getContentType(assetUrl);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Fallback: redirect to the public path (Next.js will serve it)
    return NextResponse.redirect(new URL(assetUrl, request.url));
  } catch (error) {
    console.error('Error serving asset:', error);
    return NextResponse.json(
      { error: 'Failed to serve asset' },
      { status: 500 }
    );
  }
}

/**
 * Get content type based on file extension
 */
function getContentType(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    mp4: 'video/mp4',
    webm: 'video/webm',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
  };
  return contentTypes[ext || ''] || 'application/octet-stream';
}

