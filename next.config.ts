import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Unsplash CDN rejects server-side optimizer requests (UA filtering).
    // unoptimized lets next/image pass the src URL through directly so the
    // browser fetches from Unsplash's own CDN (which already serves WebP/AVIF).
    // Cloudinary images are still processed by Cloudinary's own transform pipeline.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
}

export default nextConfig
