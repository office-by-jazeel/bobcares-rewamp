import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    qualities: [70, 75, 90],
    // Optimize device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Optimize image sizes for different use cases
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable minimum cache time for Cloudinary images
    minimumCacheTTL: 60,
    // Disable static image optimization for Cloudinary (handled by Cloudinary)
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: '/_next/icons/:path*',
        destination: '/icons/:path*',
      },
      {
        source: '/_next/images/:path*',
        destination: '/images/:path*',
      },
      {
        source: '/_next/videos/:path*',
        destination: '/videos/:path*',
      },
      {
        source: '/_next/api/newsletter',
        destination: '/api/newsletter',
      },
    ];
  },
};

export default nextConfig;
