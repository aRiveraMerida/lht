import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { TurtleLogo } from '@/components/TurtleLogo';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getAllPosts } from '@/lib/posts';
import { categories, categoryTones } from '@/lib/palette';

function getTone(category: string): string {
  return categoryTones[category] || '#EEE7DC';
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[20px] border border-border bg-bg p-5 md:p-7 lg:p-8">
              <SectionLabel>Archivo editorial</SectionLabel>
              <h1 className="mt-4 max-w-4xl text-[clamp(2.2rem,6vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-text">
                Un lugar para pensar antes de hacer.
              </h1>
              <p className="mt-4 max-w-2xl text-[16px] leading-8 text-text-muted md:text-[18px]">
                Escribimos sobre inteligencia artificial, estrategia y trabajo real.
                Sin prisas, sin humo. Solo lo que hemos probado, lo que funciona
                y lo que todavía estamos aprendiendo.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full border border-button bg-button px-4 py-2.5 text-[12px] font-medium text-button-text transition-transform duration-150 hover:-translate-y-0.5"
                >
                  Explorar artículos <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#suscribete"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-[12px] font-medium text-text transition-transform duration-150 hover:-translate-y-0.5"
                >
                  Recibir por email
                </a>
              </div>
            </div>

            <div className="rounded-[20px] border border-border bg-surface p-5 md:p-6 lg:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SectionLabel>La Habitación Tortuga</SectionLabel>
                  <p className="mt-2 text-sm leading-6 text-text-muted">
                    Dos personas pensando despacio sobre lo que cambia demasiado rápido.
                  </p>
                </div>
                <TurtleLogo className="h-10 w-10 shrink-0 text-brown" />
              </div>
              <div className="mt-6 rounded-[16px] border border-border bg-bg p-4 md:p-5">
                <div className="text-[26px] font-semibold leading-[1] tracking-[-0.04em] text-text md:text-[30px]">
                  Quiet.<br />Focused.<br />Intentional.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOPICS ─── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 lg:px-8">
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {categories.map((cat, i) => (
              <Link key={cat} href={i === 0 ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}>
                <TopicChip active={i === 0}>{cat}</TopicChip>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ARTICLES ─── */}
      <section id="latest">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Últimas publicaciones</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-text">
                Lo más reciente del archivo.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-text-muted">
              Estrategia, experimentos y reflexiones sobre IA escritas desde la práctica.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ProductCard
                key={post.slug}
                slug={post.slug}
                category={post.category}
                title={post.title}
                author={post.author}
                meta={`${new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} · ${post.author}`}
                excerpt={post.excerpt}
                tone={getTone(post.category)}
                variant={getPreviewVariant(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESIDENTES ─── */}
      <section id="residentes" className="border-y border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-[20px] border border-border bg-bg p-5 md:p-7">
              <SectionLabel>Quiénes somos</SectionLabel>
              <h2 className="mt-3 text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-[0.96] tracking-[-0.04em] text-text">
                Dos profesionales. Un laboratorio compartido.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-text-muted">
                No somos teóricos. Trabajamos cada día con IA en empresas reales.
                Aquí compartimos lo que aprendemos: las decisiones difíciles,
                los errores útiles y los atajos que funcionan de verdad.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[20px] border border-border bg-bg p-5 md:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-brown">AR</div>
                  <div>
                    <h3 className="text-base font-semibold text-text">Alberto Rivera</h3>
                    <a href="https://www.linkedin.com/in/albertoriveramerida" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted transition-colors hover:text-text">LinkedIn →</a>
                  </div>
                </div>
                <p className="text-sm leading-6 text-text-muted">
                  Ayudo a empresas a adoptar IA con criterio. +150 organizaciones, +10.000 profesionales formados. Escribo sobre las decisiones que importan y los errores que enseñan.
                </p>
              </div>
              <div className="rounded-[20px] border border-border bg-bg p-5 md:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-brown">DD</div>
                  <div>
                    <h3 className="text-base font-semibold text-text">David Dix Hidalgo</h3>
                    <a href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b" target="_blank" rel="noopener noreferrer" className="text-[11px] text-text-muted transition-colors hover:text-text">LinkedIn →</a>
                  </div>
                </div>
                <p className="text-sm leading-6 text-text-muted">
                  Especialista en automatizaciones, chatbots y agentes IA. Desarrollo soluciones adaptadas a cada cliente para potenciar sus recursos y optimizar procesos. Aquí comparto los proyectos que aportan valor de verdad.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="suscribete" className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
          <div className="max-w-2xl rounded-[20px] border border-border bg-surface2 p-5 md:p-6">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-text">
              Ideas que merecen tiempo de lectura.
            </h2>
            <p className="mt-2 text-[15px] leading-7 text-text-muted">
              Una vez a la semana. Un artículo, un aprendizaje o una herramienta que hemos probado. Sin spam, sin urgencia.
            </p>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
