/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["your-supabase-domain.supabase.co", "randomuser.me"],
  },
};

module.exports = nextConfig;
