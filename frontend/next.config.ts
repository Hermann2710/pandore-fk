import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable the built-in image optimizer for all images.
    // This sidesteps the private-IP restriction in dev while keeping
    // the next/image API (lazy loading, fill, etc.) intact.
    // In production, swap this for a real CDN remotePattern instead.
    unoptimized: true,
  },
};

export default nextConfig;
