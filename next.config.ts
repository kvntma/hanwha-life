import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'pouchpal-store.lovable.app',
      },
      {
        protocol: 'https',
        hostname: 'onocbmjbsbuxfetpeljo.supabase.co',
      },
    ],
  },
};

export default nextConfig;
