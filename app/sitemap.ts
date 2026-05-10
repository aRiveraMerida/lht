import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { labList } from '@/lib/labs';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const baseUrl = 'https://lahabitaciontortuga.com';

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const labIndexEntries: MetadataRoute.Sitemap = labList.map((lab) => ({
    url: `${baseUrl}${lab.urlBase}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const labGuideEntries: MetadataRoute.Sitemap = labList.flatMap((lab) =>
    lab.sequence.map((g) => ({
      url: `${baseUrl}${lab.urlBase}/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...labIndexEntries,
    ...postEntries,
    ...labGuideEntries,
    {
      url: `${baseUrl}/aviso-legal`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politica-cookies`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
