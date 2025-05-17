import type { NextConfig } from "next";

const nextConfig: NextConfig= {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['spytech.mgtechbr.com'],
  },
};

export default nextConfig;
