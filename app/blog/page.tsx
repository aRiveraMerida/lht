import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Blog - M3D Web',
  description: 'Artículos sobre diseño minimalista, desarrollo web con Next.js, Tailwind CSS y mejores prácticas de SEO.',
  openGraph: {
    title: 'Blog - M3D Web',
    description: 'Artículos sobre diseño minimalista y desarrollo web moderno',
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-40 pb-20 px-6 md:px-10 max-w-[1800px] mx-auto min-h-screen">
      <div className="mb-20">
        <div className="text-xs font-medium tracking-widest text-gray-400 uppercase mb-6">/ BLOG</div>
        <h1 className="text-4xl md:text-7xl font-medium uppercase tracking-tight mb-6">
          Artículos y Recursos
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl">
          Explora nuestros artículos sobre diseño minimalista, desarrollo web moderno y las mejores prácticas para crear experiencias digitales excepcionales.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No hay publicaciones disponibles aún.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {posts.map((post, index) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group"
            >
              <article className="border-t border-gray-100 pt-8 hover:pl-6 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4 text-xs uppercase tracking-widest">
                      <span className="font-bold text-gray-800">{post.category}</span>
                      <span className="text-gray-400">•</span>
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar size={12} />
                        {new Date(post.date).toLocaleDateString('es-ES', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {post.readingTime && (
                        <>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Clock size={12} />
                            {post.readingTime}
                          </div>
                        </>
                      )}
                    </div>
                    
                    <h2 className="text-2xl md:text-4xl font-bold uppercase mb-4 group-hover:translate-x-2 transition-transform duration-300">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                      Leer artículo completo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  <div className="md:w-32 text-xs text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <User size={12} />
                    {post.author}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
