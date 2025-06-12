/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';

const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Add more aggressive update settings
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60 // 24 hours
        },
      },
    },
  ],
  buildExcludes: [/middleware-manifest\.json$/],
  // Force service worker to update more frequently
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
})({
  // SEO optimizations
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
  
  // Image optimization for better SEO
  images: {
    domains: ['lingentoo.com'],
    formats: ['image/webp', 'image/avif'],
  },  
  // Compression for better performance
  compress: true,
  
  // Headers for SEO and security
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
          },          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
      {
        // Service worker should never be cached
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      {
        // Workbox service worker should never be cached
        source: '/workbox-:hash.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
    // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      // Force HTTPS redirect for any HTTP requests
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://lingentoo.com/$1',
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
