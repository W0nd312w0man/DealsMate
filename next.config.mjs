/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove any API-related configuration
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ui-avatars.com'],
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
