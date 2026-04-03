import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { categories } from '@/lib/palette';
import { getPreviewVariant } from '@/lib/assets';
import { BlogGrid } from './blog-grid';

export const metadata: Metadata = {
  title: 'Archivo — La Habitación Tortuga',
  description: 'Todos los artículos del laboratorio. Estrategia, automatizaciones, experimentos y reflexiones sobre IA.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  const postsWithMeta = posts.map((post, index) => ({
    slug: post.slug,
    category: post.category,
    title: post.title,
    meta: `${new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} · ${post.author.toUpperCase()}`,
    excerpt: post.excerpt,
    variant: getPreviewVariant(index),
    index,
  }));

  return (
    <Suspense>
      <BlogGrid posts={postsWithMeta} categories={[...categories]} />
    </Suspense>
  );
}
