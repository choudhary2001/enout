/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@enout/ui", "@enout/shared"],
  experimental: {
    serverActions: true,
  },
  output: 'standalone',
};

module.exports = nextConfig;
