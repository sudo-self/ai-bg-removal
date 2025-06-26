/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolveAlias: {
        '@/Components': ['./app/Components'],
      }
    }
  }
};

export default nextConfig;
