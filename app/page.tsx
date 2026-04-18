import Link from 'next/link';
import { SectionLabel, SectionRibbon } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getAllPosts } from '@/lib/posts';
import { categories } from '@/lib/palette';

export default function Home() {
  const posts = getAllPosts();
  const onlyOne = posts.length === 1;

  const storiesTitle = onlyOne ? 'Para empezar.' : 'Lo más reciente.';
  const storiesSubtitle = onlyOne
    ? 'Lo primero que publicamos aquí. Cuenta qué queremos que pase en este sitio.'
    : 'Estrategia, experimentos y reflexiones sobre IA escritas desde la práctica.';

  const gridClass =
    posts.length >= 3
      ? 'grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8'
      : posts.length === 2
        ? 'grid grid-cols-1 gap-10 md:grid-cols-2 max-w-5xl mx-auto md:gap-x-8'
        : 'grid grid-cols-1 gap-10 max-w-4xl mx-auto';

  return (
    <div>
      {/* ─── HERO — brand mark, editorial ─── */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-20 md:py-28">
          <SectionLabel>Apertura</SectionLabel>

          <h1 className="ed-display-xl mt-6 max-w-[14ch]">
            La Habitación Tortuga.
          </h1>

          <p className="ed-deck mt-10 max-w-2xl text-ink/80">
            Un espacio colectivo para pensar la IA con criterio. Probamos,
            documentamos y conversamos sobre lo que está pasando de verdad.
            Sin prisa. Sin FOMO. Sin ruido.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/blog" className="ed-btn ed-btn-invert">
              Ver archivo
            </Link>
            <Link href="#suscribete" className="ed-btn">
              Entrar al espacio
            </Link>
          </div>
        </div>
      </section>

      {/* ─── MISIÓN + ACTITUD ─── */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-20 md:py-24">
          <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.5fr_1fr] md:gap-20">
            <div>
              <SectionLabel>Misión</SectionLabel>
              <h2 className="ed-display mt-5 max-w-2xl">
                Un lugar donde la IA se piensa antes de venderse.
              </h2>
              <p className="ed-deck mt-7 max-w-xl text-ink/80">
                Aquí no hay newsletter diaria. Ni hot takes. Ni hilos virales.
                Hay laboratorios abiertos, casos prácticos y preguntas honestas.
                Lo que funciona, lo que no, y lo que todavía no sabemos.
              </p>
            </div>

            <div className="md:border-l md:border-ink/15 md:pl-12">
              <SectionLabel>Actitud</SectionLabel>
              <div className="ed-display mt-5 leading-[1.05]">
                Despacio.<br />Con foco.<br />Con criterio.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUÉ PASA AQUÍ ─── */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-20 md:py-24">
          <SectionRibbon>Qué pasa aquí</SectionRibbon>

          <h2 className="ed-display mt-10 max-w-3xl">
            Tres cosas. Ninguna urgente.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-x-8">
            <article className="md:border-l md:border-ink pl-0 md:pl-6 first:md:border-l-0 first:md:pl-0">
              <div className="ed-kicker-bold">01 · Laboratorios</div>
              <h3 className="font-[var(--font-display)] text-[1.5rem] leading-[1.18] tracking-[-0.3px] mt-4">
                Experimentos reales con herramientas reales.
              </h3>
              <p className="ed-body mt-3 text-ink/75">
                Documentados con el proceso entero, no solo el resultado.
              </p>
            </article>

            <article className="md:border-l md:border-ink pl-0 md:pl-6">
              <div className="ed-kicker-bold">02 · Casos prácticos</div>
              <h3 className="font-[var(--font-display)] text-[1.5rem] leading-[1.18] tracking-[-0.3px] mt-4">
                Lo que funciona el lunes por la mañana.
              </h3>
              <p className="ed-body mt-3 text-ink/75">
                En organizaciones de verdad. Sin demo bonita.
              </p>
            </article>

            <article className="md:border-l md:border-ink pl-0 md:pl-6">
              <div className="ed-kicker-bold">03 · Reflexiones</div>
              <h3 className="font-[var(--font-display)] text-[1.5rem] leading-[1.18] tracking-[-0.3px] mt-4">
                Lo que pensamos en voz alta.
              </h3>
              <p className="ed-body mt-3 text-ink/75">
                Lo que todavía no sabemos. Lo que no nos atrevemos a decir en otros sitios.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── TEMAS ─── */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <SectionLabel>Temas</SectionLabel>
              <h2 className="ed-display-mid mt-4">Por dónde empezar.</h2>
            </div>
            <p className="ed-body text-muted max-w-md">
              Categorías para navegar el archivo según lo que busques.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink pt-6">
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

      {/* ─── ÚLTIMAS PUBLICACIONES ─── */}
      {posts.length > 0 && (
        <section id="stories" className="ed-rule-b-soft">
          <div className="ed-container py-20 md:py-24">
            <SectionRibbon>Últimas publicaciones</SectionRibbon>

            <div className="mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="ed-display">{storiesTitle}</h2>
              <p className="ed-deck text-ink/75 max-w-md">{storiesSubtitle}</p>
            </div>

            <div className={`mt-14 ${gridClass}`}>
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
                  featured={onlyOne}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── QUIÉN ESCRIBE AQUÍ ─── */}
      <section id="residentes" className="ed-rule-b-soft">
        <div className="ed-container py-20 md:py-24">
          <SectionLabel>Quién escribe aquí</SectionLabel>

          <h2 className="ed-display mt-5 max-w-4xl">
            Solo escribe el equipo de ThePower.
          </h2>
          <p className="ed-deck mt-7 max-w-2xl text-ink/80">
            Este no es un blog corporativo. Es un espacio diferente: el mismo equipo
            que se ve todos los días en el trabajo, pero sin la chaqueta del cliente
            ni la prisa del trimestre.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-16 border-t border-ink pt-10">
            <div>
              <div className="ed-kicker-bold">Lo que hacemos fuera</div>
              <p className="ed-deck mt-4 text-ink/80">
                +20.000 profesionales formados. +150 empresas acompañadas. Dirigimos
                el programa B2B de IA y Tecnología de ThePower Education. Clientes
                como KPMG, EY, Estrella Galicia o El Corte Inglés.
              </p>
            </div>
            <div>
              <div className="ed-kicker-bold">Lo que pasa aquí</div>
              <p className="ed-deck mt-4 text-ink/80">
                Dudamos de todo lo que está pasando. Probamos antes de opinar.
                Publicamos con criterio, no con prisa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="suscribete">
        <div className="ed-container py-20 md:py-24">
          <div className="max-w-2xl">
            <SectionLabel>Entrar al espacio</SectionLabel>
            <h2 className="ed-display mt-5">Newsletter tortuga.</h2>
            <p className="ed-deck mt-7 text-ink/80">
              Un correo cada semana como mucho. A veces menos. Solo cuando hay
              algo que merece tu tiempo.
            </p>
            <ul className="ed-body mt-6 space-y-2 text-ink/85">
              <li>— Lo que hemos probado y lo que nos ha salido mal</li>
              <li>— Laboratorios nuevos antes de hacerse públicos</li>
              <li>— Lecturas y conversaciones que nos están removiendo</li>
            </ul>
            <p className="ed-body mt-6 text-ink/75">
              No hay plan de contenidos. Hay criterio.
            </p>

            <div className="mt-10">
              <NewsletterForm />
            </div>

            <p className="ed-body mt-6 text-ink font-medium">
              Respondes a cualquier correo y leemos. Esa es la parte &quot;comunidad&quot;.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
