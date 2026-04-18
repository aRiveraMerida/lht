import { getAllPosts } from '@/lib/posts';
import { getAuthors } from '@/lib/authors';

export async function GET() {
  const posts = getAllPosts();
  const siteUrl = 'https://lahabitaciontortuga.com';

  const items = posts
    .map((post) => {
      const authorNames = getAuthors(post.authors).map((a) => a.name).join(', ');
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${authorNames}</author>
      <category>${post.category}</category>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>La Habitación Tortuga [LHT]</title>
    <link>${siteUrl}</link>
    <description>Un laboratorio abierto sobre inteligencia artificial. Sin filtro. Sin teoría.</description>
    <language>es-ES</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
