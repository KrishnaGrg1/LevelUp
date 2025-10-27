import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors. Fix linting issues before deploying!
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type checking is handled separately
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
