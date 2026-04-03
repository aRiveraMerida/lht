import Link from 'next/link';
import { SectionLabel } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { TurtleLogo } from '@/components/TurtleLogo';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getAllPosts } from '@/lib/posts';
import { categories } from '@/lib/palette';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="border-b-2 border-lht-line">
        <div className="lht-container py-6 md:py-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="lht-panel">
              <SectionLabel number="01">Apertura</SectionLabel>

              <h1 className="lht-display mt-6 max-w-5xl text-hero">
                la habitación<br />
                tortuga<br />
                [lht] 🐢
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-[1.9] md:text-xl">
                Dos profesionales de IA que paran a pensar. Probamos. Reflexionamos.
                Y lanzamos laboratorios. Sin prisa. Sin FOMO. Con criterio.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/blog" className="lht-btn lht-btn-primary">Ver archivo →</Link>
                <a href="#suscribete" className="lht-btn lht-btn-secondary">Unirme a la comunidad 🐢</a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="border-2 border-lht-line bg-lht-blue p-5 text-lht-paper md:p-6">
                <div className="text-[11px] font-black uppercase tracking-[0.18em]">Misión</div>
                <p className="mt-3 text-sm leading-7 text-white/90">
                  Un sitio donde la IA no va a 200 por hora. Probamos de verdad.
                  Pensamos despacio. Compartimos sin filtro.
                </p>
              </div>

              <div className="border-2 border-lht-line bg-lht-yellow p-5 text-lht-ink md:p-6">
                <div className="text-[11px] font-black uppercase tracking-[0.18em]">Actitud</div>
                <div className="lht-title mt-4 text-[32px]">
                  Despacio.<br />Con foco.<br />Con criterio.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOPICS ─── */}
      <section className="border-b-2 border-lht-line">
        <div className="lht-container py-4">
          <div className="flex items-center justify-between gap-4">
            <SectionLabel number="02">Temas</SectionLabel>
            <div className="hidden text-[11px] font-black uppercase tracking-[0.18em] text-lht-muted md:block">
              elige tu incomodidad
            </div>
          </div>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {categories.map((cat, i) => (
              <Link key={cat} href={i === 0 ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}>
                <TopicChip active={i === 0}>{cat}</TopicChip>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORIES ─── */}
      <section id="stories">
        <div className="lht-container py-8 md:py-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel number="03">Últimas publicaciones</SectionLabel>
              <h2 className="lht-display mt-4 text-display">
                Lo más reciente.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-lht-muted">
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
                meta={`${new Date(post.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()} · ${post.author.toUpperCase()}`}
                excerpt={post.excerpt}
                variant={getPreviewVariant(index)}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUIÉNES SOMOS ─── */}
      <section id="residentes" className="border-y-2 border-lht-line">
        <div className="lht-container py-8 md:py-10">
          <SectionLabel number="04">Los residentes</SectionLabel>
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="lht-panel">
              <h2 className="lht-display text-display">
                Dos profesionales.<br />Una misma frustración.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-lht-muted">
                Demasiado ruido, demasiado FOMO, poca conversación honesta sobre lo que está pasando.
                La Habitación Tortuga es nuestra forma de arreglarlo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="lht-panel">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-lht-line bg-lht-red text-[11px] font-black text-lht-paper">AR</div>
                  <div>
                    <div className="text-sm font-black uppercase">Alberto Rivera</div>
                    <a href="https://www.linkedin.com/in/albertoriveramerida" target="_blank" rel="noopener noreferrer" className="text-[11px] text-lht-muted hover:text-lht-blue">LinkedIn →</a>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-lht-muted">
                  Director de IA en ThePower. +150 empresas. +10.000 profesionales formados.
                  Clientes como KPMG, EY, L'Oréal o Estrella Galicia. Obsesión: que la IA se use de verdad.
                </p>
              </div>
              <div className="lht-panel">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-lht-line bg-lht-blue text-[11px] font-black text-lht-paper">DD</div>
                  <div>
                    <div className="text-sm font-black uppercase">David Dix Hidalgo</div>
                    <a href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b" target="_blank" rel="noopener noreferrer" className="text-[11px] text-lht-muted hover:text-lht-blue">LinkedIn →</a>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-lht-muted">
                  Especialista en IA en ThePower. Implementa antes de divulgar.
                  Lleva herramientas al terreno real: workflows, automatizaciones, casos de uso que funcionan el lunes por la mañana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="suscribete">
        <div className="lht-container py-8 md:py-10">
          <SectionLabel number="05">Newsletter</SectionLabel>
          <div className="mt-6 max-w-2xl lht-panel">
            <h2 className="lht-title text-[28px] md:text-[36px]">
              Comunidad tortuga 🐢
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-lht-muted">
              Una newsletter sin calendario fijo. Publicamos cada semana como mínimo,
              pero solo cuando hay algo que merece tu tiempo. Sin spam. Sin FOMO. Sin envíos vacíos.
            </p>
            <div className="mt-4 text-[15px] leading-7 text-lht-muted">
              — Lo que hemos probado y aprendido<br />
              — Reflexiones que no caben en LinkedIn<br />
              — Aviso de nuevos laboratorios
            </div>
            <div className="mt-5">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
