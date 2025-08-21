/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true,
    },
    images: {
        domains: ['ipfs.io', 'gateway.pinata.cloud', 'cloudflare-ipfs.com'],
    },
    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
        NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            'pino-pretty': false,
            'supports-color': false,
        };
        return config;
    },
}

module.exports = nextConfig