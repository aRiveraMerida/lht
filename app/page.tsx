import Link from 'next/link';
import { SectionLabel } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getAllPosts } from '@/lib/posts';
import { categories } from '@/lib/palette';

export default function Home() {
  const posts = getAllPosts();

  return (
    <div>
      {/* ─── HERO — signature vibrant gradient ─── */}
      <section className="on-dark fg-hero-gradient">
        <div className="fg-container py-24 md:py-32">
          <div className="fg-mono-label-lg text-white/80">
            Apertura
          </div>

          <h1 className="fg-display mt-8 max-w-[16ch] text-white">
            la habitación tortuga [lht].
          </h1>

          <p className="fg-body-lg mt-8 max-w-xl text-white/85">
            Dos profesionales de IA que paran a pensar. Probamos. Reflexionamos.
            Y lanzamos laboratorios. Sin prisa. Sin FOMO. Con criterio.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/blog" className="fg-btn fg-btn-invert">
              Ver archivo
            </Link>
            <a href="#suscribete" className="fg-btn fg-btn-glass-light">
              Unirme a la comunidad
            </a>
          </div>
        </div>
      </section>

      {/* ─── MISIÓN / ACTITUD ─── */}
      <section className="hairline-b">
        <div className="fg-container py-24 md:py-32">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <SectionLabel>Misión</SectionLabel>
              <p className="fg-section-heading mt-8 max-w-xl">
                Un sitio donde la IA no va a 200 por hora.
              </p>
              <p className="fg-body-lg mt-6 max-w-lg text-ink/65">
                Probamos de verdad. Pensamos despacio. Compartimos sin filtro.
              </p>
            </div>

            <div>
              <SectionLabel>Actitud</SectionLabel>
              <div className="fg-display mt-8 text-[clamp(3rem,6vw,64px)]">
                Despacio.<br />Con foco.<br />Con criterio.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEMAS ─── */}
      <section className="hairline-b">
        <div className="fg-container py-14">
          <div className="flex items-center justify-between gap-4">
            <SectionLabel>Temas</SectionLabel>
            <span className="fg-mono-label text-ink/50 hidden md:block">
              elige tu incomodidad
            </span>
          </div>
          <div className="mt-6 flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat, i) => (
              <Link
                key={cat}
                href={i === 0 ? '/blog' : `/blog?category=${encodeURIComponent(cat)}`}
                className="shrink-0"
              >
                <TopicChip active={i === 0}>{cat}</TopicChip>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STORIES ─── */}
      <section id="stories" className="hairline-b">
        <div className="fg-container py-24 md:py-28">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>Últimas publicaciones</SectionLabel>
              <h2 className="fg-section-heading mt-6">
                Lo más reciente.
              </h2>
            </div>
            <p className="fg-body-lg max-w-sm text-ink/65">
              Estrategia, experimentos y reflexiones sobre IA escritas desde la práctica.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ProductCard
                key={post.slug}
                slug={post.slug}
                category={post.category}
                title={post.title}
                date={post.date}
                authorSlugs={post.authors}
                excerpt={post.excerpt}
                variant={getPreviewVariant(index)}
                index={index}
                featured={post.featured}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── RESIDENTES ─── */}
      <section id="residentes" className="hairline-b">
        <div className="fg-container py-24 md:py-28">
          <SectionLabel>Los residentes</SectionLabel>
          <div className="mt-10 grid grid-cols-1 gap-16 md:grid-cols-[1fr_1fr]">
            <div>
              <h2 className="fg-section-heading max-w-lg">
                Dos profesionales. Una misma frustración.
              </h2>
              <p className="fg-body-lg mt-6 max-w-lg text-ink/65">
                Demasiado ruido, demasiado FOMO, poca conversación honesta sobre lo que
                está pasando. La Habitación Tortuga es nuestra forma de arreglarlo.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <article className="fg-card p-7 hairline-t hairline-b">
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white fg-mono-label"
                  style={{ background: '#8B5CF6' }}
                >
                  AR
                </div>
                <h3 className="fg-feature-title mt-4">Alberto Rivera</h3>
                <p className="fg-body mt-2 text-ink/65">
                  Director de IA en ThePower. +150 empresas. +10.000 profesionales formados.
                  Clientes como KPMG, EY, L&apos;Oréal o Estrella Galicia. Obsesión: que la
                  IA se use de verdad.
                </p>
                <a
                  href="https://www.linkedin.com/in/albertoriveramerida"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fg-body mt-4 inline-block underline underline-offset-2"
                >
                  LinkedIn →
                </a>
              </article>

              <article className="fg-card p-7 hairline-t hairline-b">
                <div
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white fg-mono-label"
                  style={{ background: '#00A3FF' }}
                >
                  DD
                </div>
                <h3 className="fg-feature-title mt-4">David Dix Hidalgo</h3>
                <p className="fg-body mt-2 text-ink/65">
                  Especialista en IA en ThePower. Implementa antes de divulgar. Lleva
                  herramientas al terreno real: workflows, automatizaciones, casos de uso
                  que funcionan el lunes por la mañana.
                </p>
                <a
                  href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fg-body mt-4 inline-block underline underline-offset-2"
                >
                  LinkedIn →
                </a>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="suscribete">
        <div className="fg-container py-24 md:py-28">
          <div className="max-w-2xl">
            <SectionLabel>Newsletter</SectionLabel>
            <h2 className="fg-section-heading mt-8">
              Comunidad tortuga.
            </h2>
            <p className="fg-body-lg mt-6 text-ink/65">
              Una newsletter sin calendario fijo. Publicamos cada semana como mínimo,
              pero solo cuando hay algo que merece tu tiempo. Sin spam. Sin FOMO.
              Sin envíos vacíos.
            </p>
            <ul className="fg-body-lg mt-6 space-y-2 text-ink/75">
              <li>— Lo que hemos probado y aprendido</li>
              <li>— Reflexiones que no caben en LinkedIn</li>
              <li>— Aviso de nuevos laboratorios</li>
            </ul>
            <div className="mt-10">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
