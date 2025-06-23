import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds (for Vercel deployment)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds if needed
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
