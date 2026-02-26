/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['ipfs.io', 'cloudflare-ipfs.com', 'gateway.pinata.cloud'],
  },
  env: {
    NEXT_PUBLIC_CLAWFUNDME_ADDRESS: process.env.NEXT_PUBLIC_CLAWFUNDME_ADDRESS,
    NEXT_PUBLIC_USDC_ADDRESS: process.env.NEXT_PUBLIC_USDC_ADDRESS,
    NEXT_PUBLIC_CDP_API_KEY: process.env.NEXT_PUBLIC_CDP_API_KEY,
  },
}

module.exports = nextConfig
