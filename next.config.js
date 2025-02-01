/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'adtaxvfoevccsbgxkrpn.supabase.co', // Supabase storage
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
}

module.exports = nextConfig
