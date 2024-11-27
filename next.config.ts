import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
      ignoreDuringBuilds: true,
  },
  transpilePackages: ['mui-chips-input'],
  output: 'export'
};

export default nextConfig;
