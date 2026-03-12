import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // In production, type errors should be caught during CI/CD
    ignoreBuildErrors: process.env.NODE_ENV !== 'production',
  },
  images: {
    // Enable image optimization in production
    unoptimized: process.env.NODE_ENV !== 'production',
  },
  turbopack: {
    root: __dirname,
  },
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      // Allow embedding for the chat widget
      {
        source: '/api/widget/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ]
  },
  // Redirect rules
  async redirects() {
    return [
      {
        source: '/',
        destination: '/agent-setup',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
