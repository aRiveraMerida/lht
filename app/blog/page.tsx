import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';
import { SectionLabel } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { TurtleLogo } from '@/components/TurtleLogo';
import { categoryColors } from '@/lib/palette';

export const metadata: Metadata = {
  title: 'Archivo — La Habitación Tortuga',
  description: 'Todos los artículos del laboratorio. Estrategia, automatizaciones, experimentos y reflexiones sobre IA.',
  openGraph: {
    title: 'Archivo — La Habitación Tortuga',
    description: 'Todos los artículos del laboratorio sobre inteligencia artificial.',
  },
};

const categories = [
  'Todos', 'Laboratorios', 'Estrategia', 'Automatizaciones',
  'Sin filtro', 'Adopción IA', 'Personas', 'Notas de campo',
];

function getCategoryColor(category: string): string {
  return categoryColors[category] || '#9DB7A7';
}

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <SectionLabel>Archivo</SectionLabel>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-ink mt-6 mb-4">
            Archivo
          </h1>
          <p className="text-lg text-ink/60 max-w-2xl">
            Todos los artículos del laboratorio. Estrategia, automatizaciones, experimentos
            y las preguntas que nadie se atreve a hacer.
          </p>
        </div>

        {/* Topic chips */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-12">
          {categories.map((cat, i) => (
            <TopicChip key={cat} active={i === 0}>{cat}</TopicChip>
          ))}
        </div>

        {/* Posts grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-ink/50 text-lg">No hay publicaciones disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                <article className="rounded-3xl border border-bark bg-cream overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#5A4632]">
                  <div
                    className="h-32 flex items-center justify-center"
                    style={{ backgroundColor: getCategoryColor(post.category) }}
                  >
                    <TurtleLogo className="w-14 h-14 text-white/40" />
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bark/70">
                      {post.category}
                    </span>
                    <h2 className="font-serif text-xl font-bold text-ink mt-2 mb-3 leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-sm text-ink/60 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-bark text-cream flex items-center justify-center text-[10px] font-bold">
                          {post.author?.split(' ').map(n => n[0]).join('') || 'AR'}
                        </div>
                        <div className="text-[11px] text-ink/60">
                          {post.author} · {post.readingTime}
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.04em] text-bark group-hover:gap-2 transition-all">
                        Leer <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
