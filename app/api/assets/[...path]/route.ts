import { NextRequest, NextResponse } from 'next/server';
import { getAssetUrlWithFallback } from '@/lib/cloudinary';

/**
 * API route to serve assets with Cloudinary fallback
 * Usage: /api/assets/images/hero-bg.jpg?cloudinaryId=bobcares/hero-bg
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

    // Get asset URL with fallback
    const assetUrl = await getAssetUrlWithFallback(cloudinaryId, localPath, {
      width,
      height,
      quality,
      format,
    });

    // If it's a Cloudinary URL, redirect to it
    if (assetUrl.startsWith('http')) {
      return NextResponse.redirect(assetUrl);
    }

    // If it's a local path, try to serve it
    // In production, Next.js will handle static files automatically
    // This is mainly for the API route pattern
    return NextResponse.redirect(new URL(assetUrl, request.url));
  } catch (error) {
    console.error('Error serving asset:', error);
    return NextResponse.json(
      { error: 'Failed to serve asset' },
      { status: 500 }
    );
  }
}

