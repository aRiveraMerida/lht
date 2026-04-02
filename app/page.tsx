import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { TurtleLogo } from '@/components/TurtleLogo';
import { NewsletterForm } from '@/components/NewsletterForm';
import { getAllPosts } from '@/lib/posts';
import { categoryColors } from '@/lib/palette';

const categories = [
  'Todos', 'Laboratorios', 'Estrategia', 'Automatizaciones',
  'Sin filtro', 'Adopción IA', 'Personas', 'Notas de campo',
];

function getCategoryColor(category: string): string {
  return categoryColors[category] || '#9DB7A7';
}

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="pt-20 md:pt-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left column */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <SectionLabel>Historia destacada</SectionLabel>

            <div className="flex flex-wrap gap-2 mt-6 mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bark/70">Insights</span>
              <span className="text-bark/30">·</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bark/70">Estrategia</span>
              <span className="text-bark/30">·</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bark/70">Thought leadership</span>
            </div>

            <h1 className="font-serif text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.92] tracking-[-0.04em] text-ink mb-6">
              Un laboratorio abierto<br />
              sobre inteligencia artificial.<br />
              <span className="text-bark/60">Sin filtro. Sin teoría.</span>
            </h1>

            <p className="text-lg text-ink/70 leading-relaxed mb-8 max-w-xl">
              Aquí compartimos lo que probamos, lo que funciona y lo que no.
              Dos profesionales de campo. Experimentos reales.
              Y las preguntas que nadie se atreve a hacer.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-bark px-6 py-3 text-sm font-semibold text-cream hover:-translate-y-1 transition-transform"
              >
                Entrar al laboratorio <ArrowRight size={16} />
              </Link>
              <a
                href="#residentes"
                className="inline-flex items-center gap-2 rounded-full border border-bark bg-cream px-6 py-3 text-sm font-semibold text-ink hover:-translate-y-1 transition-transform"
              >
                Quiénes somos
              </a>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-olive p-6 md:p-8">
              <div className="rounded-2xl border border-bark bg-cream p-6 shadow-[8px_8px_0_0_#5A4632]">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-bark/60 mb-4">
                  From inside the shell
                </div>
                <TurtleLogo className="w-12 h-12 text-bark mb-4" />
                <p className="font-serif text-2xl font-bold text-ink leading-tight">
                  Quiet, warm,<br />deliberate.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <div className="h-12 flex-1 rounded-xl bg-sand" />
                <div className="h-12 flex-1 rounded-xl bg-pond" />
                <div className="h-12 flex-1 rounded-xl bg-shell" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic chips */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <TopicChip key={cat} active={i === 0}>{cat}</TopicChip>
          ))}
        </div>
      </section>

      {/* Articles grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <SectionLabel>Descubre piezas para pensar</SectionLabel>
        <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-[0.95] tracking-[-0.04em] text-ink mt-6 mb-12">
          Piezas para pensar.<br />
          <span className="text-bark/60">Escritas desde el campo.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="rounded-3xl border border-bark bg-cream overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#5A4632]">
                {/* Color header */}
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
                  <h3 className="font-serif text-xl font-bold text-ink mt-2 mb-3 leading-tight">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
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
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Quiénes somos */}
      <section id="residentes" className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left card */}
          <div className="rounded-3xl border border-bark bg-cream p-8 md:p-10">
            <SectionLabel>Los residentes</SectionLabel>
            <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-[0.95] tracking-[-0.04em] text-ink mt-6 mb-6">
              Dos profesionales.<br />
              Un laboratorio compartido.
            </h2>
            <p className="text-ink/70 leading-relaxed">
              La Habitación Tortuga es un espacio donde compartimos lo que aprendemos
              trabajando con inteligencia artificial en el mundo real. Sin slides bonitos.
              Sin teoría. Solo lo que probamos, lo que funciona y lo que no.
            </p>
          </div>

          {/* Right: person cards */}
          <div className="flex flex-col gap-6">
            {/* Alberto */}
            <div className="rounded-3xl border border-bark bg-cream p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-bark text-cream flex items-center justify-center font-serif font-bold text-lg">
                  AR
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">Alberto Rivera</h3>
                  <a
                    href="https://www.linkedin.com/in/albertoriveramerida"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-bark hover:text-moss transition-colors"
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">
                Trabajo ayudando a empresas a adoptar inteligencia artificial de verdad.
                +150 organizaciones. +10.000 profesionales formados.
                En este laboratorio comparto las decisiones, los errores
                y lo que he aprendido en la trinchera de la adopción de IA.
              </p>
            </div>

            {/* David */}
            <div className="rounded-3xl border border-bark bg-cream p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-bark text-cream flex items-center justify-center font-serif font-bold text-lg">
                  DD
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-ink">David Dix Hidalgo</h3>
                  <a
                    href="https://www.linkedin.com/in/daviddixhidalgo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-semibold uppercase tracking-[0.1em] text-bark hover:text-moss transition-colors"
                  >
                    LinkedIn →
                  </a>
                </div>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">
                Experto en IA aplicada, automatizaciones y soluciones creativas.
                El que convierte las ideas en sistemas que funcionan.
                Aquí comparto los experimentos, las herramientas
                y los atajos que de verdad ahorran tiempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="suscribete" className="bg-bark">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left */}
            <div className="lg:col-span-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cream/50 mb-4">
                newsletter / club
              </div>
              <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] font-bold leading-[0.95] tracking-[-0.04em] text-cream mb-6">
                Entra en la sala.
              </h2>
              <p className="text-cream/70 leading-relaxed">
                Cada semana compartimos un experimento, un aprendizaje o una herramienta
                que hemos probado en campo. Sin spam. Sin humo.
              </p>
            </div>

            {/* Right */}
            <div className="lg:col-span-7">
              <NewsletterForm />
              <div className="flex flex-wrap gap-2 mt-6">
                {['experimentos', 'estrategia', 'automatización', 'sin filtro'].map(tag => (
                  <span key={tag} className="rounded-full border border-cream/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-cream/50">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
