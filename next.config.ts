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
