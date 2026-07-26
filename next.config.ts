import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  basePath: '/children-programming',
  assetPrefix: '/children-programming',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
