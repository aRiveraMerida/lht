import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { BlogGrid } from './blog-grid';

export const metadata: Metadata = {
  title: 'Archivo',
  description: 'Todo lo publicado en La Habitación Tortuga. Artículos y laboratorios sobre IA. Sin prisas, sin FOMO.',
};

export default function BlogPage() {
  const posts = getAllPosts().map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
  }));

  return (
    <Suspense>
      <BlogGrid posts={posts} />
    </Suspense>
  );
}
