import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getPostBySlug, getPostSlugs } from '@/lib/posts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getPostSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post no encontrado',
    };
  }

  return {
    title: `${post.title} - M3D Web`,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="pt-40 pb-20 px-6 md:px-10 max-w-[1200px] mx-auto min-h-screen">
      <Link 
        href="/blog"
        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest mb-12 hover:translate-x-[-4px] transition-transform"
      >
        <ArrowLeft size={16} /> Volver al Blog
      </Link>

      <article>
        <header className="mb-12 pb-12 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-6 text-xs uppercase tracking-widest flex-wrap">
            <span className="font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            {post.readingTime && (
              <>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={14} />
                  {post.readingTime}
                </div>
              </>
            )}
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-2 text-gray-500">
              <User size={14} />
              {post.author}
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        <div className="prose prose-lg prose-gray max-w-none
          prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tight
          prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
          prose-p:leading-relaxed prose-p:text-gray-700
          prose-a:text-black prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-black prose-strong:font-bold
          prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-black prose-pre:text-white prose-pre:p-6 prose-pre:rounded-lg
          prose-ul:list-disc prose-ul:ml-6
          prose-ol:list-decimal prose-ol:ml-6
          prose-li:text-gray-700
          prose-blockquote:border-l-4 prose-blockquote:border-black prose-blockquote:pl-6 prose-blockquote:italic
          prose-img:rounded-lg prose-img:shadow-lg
        ">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <div className="mt-20 pt-12 border-t border-gray-100">
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Ver todos los artículos
        </Link>
      </div>
    </div>
  );
}
