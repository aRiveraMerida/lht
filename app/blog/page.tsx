import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { getPreviewVariant } from '@/lib/assets';
import { BlogGrid } from './blog-grid';

export const metadata: Metadata = {
  title: 'Archivo',
  description: 'Todo lo publicado en La Habitación Tortuga. Artículos y laboratorios sobre IA. Sin prisas, sin FOMO.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  const postsWithMeta = posts.map((post, index) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    authorSlugs: post.authors,
    excerpt: post.excerpt,
    variant: getPreviewVariant(index),
    index,
    featured: Boolean(post.featured),
  }));

  return (
    <Suspense>
      <BlogGrid posts={postsWithMeta} />
    </Suspense>
  );
}
