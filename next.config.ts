import type { NextConfig } from "next";

const campaignHubRedirects = [
  { source: '/blog/campaign-hub-introduccion', destination: '/blog/campaign-hub/introduccion' },
  { source: '/blog/campaign-hub-conceptos', destination: '/blog/campaign-hub/conceptos' },
  { source: '/blog/campaign-hub-preparar-google', destination: '/blog/campaign-hub/preparar-google' },
  { source: '/blog/campaign-hub-apps-script-agentes', destination: '/blog/campaign-hub/apps-script-agentes' },
  { source: '/blog/campaign-hub-claude-code-skill', destination: '/blog/campaign-hub/claude-code-skill' },
  { source: '/blog/campaign-hub-probar-end-to-end', destination: '/blog/campaign-hub/probar-end-to-end' },
  { source: '/blog/campaign-hub-customizar-casos', destination: '/blog/campaign-hub/customizar-casos' },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async redirects() {
    return campaignHubRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
