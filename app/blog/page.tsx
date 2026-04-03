import { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { categories, categoryTones } from '@/lib/palette';
import { getPreviewVariant } from '@/lib/assets';
import { BlogGrid } from './blog-grid';

export const metadata: Metadata = {
  title: 'Archivo — La Habitación Tortuga',
  description: 'Todos los artículos del laboratorio. Estrategia, automatizaciones, experimentos y reflexiones sobre IA.',
  openGraph: {
    title: 'Archivo — La Habitación Tortuga',
    description: 'Todos los artículos del laboratorio sobre inteligencia artificial.',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  const postsWithMeta = posts.map((post, index) => ({
    slug: post.slug,
    category: post.category,
    title: post.title,
    author: post.author,
    meta: `${new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} · ${post.author}`,
    excerpt: post.excerpt,
    tone: categoryTones[post.category] || '#EEE7DC',
    variant: getPreviewVariant(index),
    index,
  }));

  return (
    <Suspense>
      <BlogGrid posts={postsWithMeta} categories={[...categories]} />
    </Suspense>
  );
}
