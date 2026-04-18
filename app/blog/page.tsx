import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { categories } from '@/lib/palette';
import { getPreviewVariant } from '@/lib/assets';
import { BlogGrid } from './blog-grid';

export const metadata: Metadata = {
  title: 'Archivo — La Habitación Tortuga',
  description: 'Todo lo publicado sobre IA desde la práctica. Laboratorios, casos prácticos, estrategia y preguntas honestas.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  const postsWithMeta = posts.map((post, index) => ({
    slug: post.slug,
    category: post.category,
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
      <BlogGrid posts={postsWithMeta} categories={[...categories]} />
    </Suspense>
  );
}
