/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://lahabitaciontortuga.com',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/_next/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Twitterbot', allow: '/' },
      { userAgent: 'facebookexternalhit', allow: '/' },
      { userAgent: 'LinkedInBot', allow: '/' },
    ],
  },
  // /marca is an internal brand lab: noindex, and never in the public sitemap.
  exclude: ['/api/*', '/marca', '/marca/*'],
}
