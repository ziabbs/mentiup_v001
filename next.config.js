/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'adtaxvfoevccsbgxkrpn.supabase.co', // Supabase storage
    ],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
