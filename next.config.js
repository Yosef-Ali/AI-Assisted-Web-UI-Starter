/** @type {import('next').NextConfig} */
const nextConfig = {
    // App Router is now stable in Next.js 15, no experimental flags needed

    // Disable ESLint during builds (for performance audit - will fix linting separately)
    eslint: {
        ignoreDuringBuilds: true,
    },

    // Performance optimizations - swcMinify is now default in Next.js 15
    // swcMinify: true, // Removed as it's deprecated

    // Bundle analysis and optimization
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Optimize chunks
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                        priority: 10,
                    },
                    recharts: {
                        test: /[\\/]node_modules[\\/]recharts[\\/]/,
                        name: 'recharts',
                        chunks: 'all',
                        priority: 20,
                    },
                    tanstack: {
                        test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
                        name: 'tanstack',
                        chunks: 'all',
                        priority: 20,
                    },
                    ui: {
                        test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
                        name: 'ui-components',
                        chunks: 'all',
                        priority: 15,
                    },
                },
            },
        };

        return config;
    },

    // Image optimization
    images: {
        formats: ['image/webp', 'image/avif'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // Compression
    compress: true,

    // Headers for performance
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
                    },
                ],
            },
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },

    // Experimental features for performance
    experimental: {
        // optimizeCss: true, // Disabled due to critters dependency issue
        scrollRestoration: true,
        webVitalsAttribution: ['CLS', 'LCP'],
    },

    // Environment variables
    env: {
        BUILD_TIME: new Date().toISOString(),
    },
};

module.exports = nextConfig;