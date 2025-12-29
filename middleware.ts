import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware to handle asset requests with Cloudinary fallback
 * Intercepts requests to /api/assets/* and handles Cloudinary/local fallback
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle asset API routes
  if (pathname.startsWith('/api/assets/')) {
    // The actual logic is handled in the API route
    // This middleware can be extended for additional processing
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/assets/:path*',
    '/api/newsletter/:path*',
    // Add other paths if needed
  ],
};

