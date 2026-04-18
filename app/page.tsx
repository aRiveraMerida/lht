import Link from 'next/link';
import { SectionLabel } from '@/components/SectionLabel';
import { TopicChip } from '@/components/TopicChip';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getAllPosts } from '@/lib/posts';
import { categories } from '@/lib/palette';
import { authors, getAuthorInitials } from '@/lib/authors';

// Avatar accent cycles through hero gradient stops, in author insertion order.
const avatarColors = ['#8B5CF6', '#00A3FF', '#00D26A', '#FF4DA6', '#FFE55C']

export default function Home() {
  const posts = getAllPosts();
  const residents = Object.values(authors);

  const onlyOne = posts.length === 1;

  const storiesTitle = onlyOne ? 'Para empezar.' : 'Lo más reciente.';
  const storiesSubtitle = onlyOne
    ? 'Lo primero que publicamos aquí. Cuenta qué queremos que pase en este sitio.'
    : 'Estrategia, experimentos y reflexiones sobre IA escritas desde la práctica.';

  const gridClass =
    posts.length >= 3
      ? 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'
      : posts.length === 2
        ? 'grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto'
        : 'grid grid-cols-1 gap-8 max-w-3xl mx-auto';

  return (
    <div>
      {/* ─── HERO — signature vibrant gradient ─── */}
      <section className="on-dark fg-hero-gradient">
        <div className="fg-container py-24 md:py-32">
          <div className="fg-mono-label-lg text-white/80">Apertura</div>

          <h1 className="fg-display mt-8 max-w-[16ch] text-white">
            la habitación tortuga [lht].
          </h1>

          <p className="fg-body-lg mt-8 max-w-xl text-white/85">
            Un espacio colectivo para pensar la IA con criterio. Probamos,
            documentamos y conversamos sobre lo que está pasando de verdad.
            Sin prisa. Sin FOMO. Sin ruido.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/blog" className="fg-btn fg-btn-invert">
              Ver archivo
            </Link>
            <a href="#suscribete" className="fg-btn fg-btn-glass-light">
              Entrar al espacio
            </a>
          </div>
        </div>
      </section>

      {/* ─── MISIÓN + ACTITUD ─── */}
      <section className="hairline-b">
        <div className="fg-container py-24 md:py-32">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <SectionLabel>Misión</SectionLabel>
              <h2 className="fg-section-heading mt-8 max-w-xl">
                Un lugar donde la IA se piensa antes de venderse.
              </h2>
              <p className="fg-body-lg mt-6 max-w-lg text-ink/65">
                Aquí no hay newsletter diaria. Ni hot takes. Ni hilos virales. Hay
                laboratorios abiertos, casos prácticos y preguntas honestas. Lo que
                funciona, lo que no, y lo que todavía no sabemos.
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

      {/* ─── QUÉ PASA AQUÍ ─── */}
      <section className="hairline-b">
        <div className="fg-container py-24 md:py-28">
          <SectionLabel>Qué pasa aquí</SectionLabel>
          <h2 className="fg-section-heading mt-8 max-w-2xl">
            Tres cosas. Ninguna urgente.
          </h2>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
            <article className="fg-card p-7 hairline-t hairline-b">
              <span
                className="fg-cat-tag"
                style={{ ['--tag-color' as string]: '#00D26A' }}
              >
                01 · Laboratorios
              </span>
              <h3 className="fg-feature-title mt-5">Experimentos reales con herramientas reales.</h3>
              <p className="fg-body mt-3 text-ink/65">
                Documentados con el proceso entero, no solo el resultado.
              </p>
            </article>

            <article className="fg-card p-7 hairline-t hairline-b">
              <span
                className="fg-cat-tag"
                style={{ ['--tag-color' as string]: '#00A3FF' }}
              >
                02 · Casos prácticos
              </span>
              <h3 className="fg-feature-title mt-5">Lo que funciona el lunes por la mañana.</h3>
              <p className="fg-body mt-3 text-ink/65">
                En organizaciones de verdad. Sin demo bonita.
              </p>
            </article>

            <article className="fg-card p-7 hairline-t hairline-b">
              <span
                className="fg-cat-tag"
                style={{ ['--tag-color' as string]: '#FFE55C' }}
              >
                03 · Reflexiones
              </span>
              <h3 className="fg-feature-title mt-5">Lo que pensamos en voz alta.</h3>
              <p className="fg-body mt-3 text-ink/65">
                Lo que todavía no sabemos. Lo que no nos atrevemos a decir en otros sitios.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ─── TEMAS ─── */}
      <section className="hairline-b">
        <div className="fg-container py-24 md:py-28">
          <div className="max-w-2xl">
            <SectionLabel>Temas</SectionLabel>
            <h2 className="fg-section-heading mt-8">Por dónde empezar.</h2>
            <p className="fg-body-lg mt-6 text-ink/65">
              Categorías para navegar el archivo según lo que busques.
            </p>
          </div>
          <div className="mt-10 flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
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

      {/* ─── ÚLTIMAS PUBLICACIONES (adaptativo) ─── */}
      {posts.length > 0 && (
        <section id="stories" className="hairline-b">
          <div className="fg-container py-24 md:py-28">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <SectionLabel>Últimas publicaciones</SectionLabel>
                <h2 className="fg-section-heading mt-6">{storiesTitle}</h2>
              </div>
              <p className="fg-body-lg max-w-sm text-ink/65">{storiesSubtitle}</p>
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
      <section id="residentes" className="hairline-b">
        <div className="fg-container py-24 md:py-28">
          <SectionLabel>Quién escribe aquí</SectionLabel>

          <h2 className="fg-section-heading mt-8 max-w-3xl">
            Equipo IA de ThePower Education.
          </h2>
          <p className="fg-body-lg mt-6 max-w-2xl text-ink/65">
            Este no es un blog corporativo. Es un espacio diferente: el mismo equipo
            que se ve todos los días en el trabajo, pero sin la chaqueta del cliente
            ni la prisa del trimestre.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="fg-card p-7 hairline-t hairline-b">
              <div className="fg-mono-label text-ink/55">Lo que hacemos fuera</div>
              <p className="fg-body-lg mt-4 text-ink/80">
                +20.000 profesionales formados. +150 empresas acompañadas. Dirigimos
                el programa B2B de IA y Tecnología de ThePower Education. Clientes
                como KPMG, EY, Estrella Galicia o El Corte Inglés.
              </p>
            </div>
            <div className="fg-card p-7 hairline-t hairline-b">
              <div className="fg-mono-label text-ink/55">Lo que pasa aquí</div>
              <p className="fg-body-lg mt-4 text-ink/80">
                Dudamos de todo lo que está pasando. Probamos antes de opinar.
                Publicamos con nombre y apellidos.
              </p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {residents.map((author, i) => (
              <article key={author.slug} className="fg-card p-7 hairline-t hairline-b">
                <div className="flex items-center gap-3">
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white fg-mono-label"
                    style={{ background: avatarColors[i % avatarColors.length] }}
                    aria-hidden="true"
                  >
                    {getAuthorInitials(author)}
                  </div>
                  <div>
                    <div className="fg-body fw-540">{author.name}</div>
                    <div className="fg-mono-label text-ink/55 mt-1">
                      {author.role} · {author.company}
                    </div>
                  </div>
                </div>
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fg-body mt-5 inline-block underline underline-offset-2"
                >
                  LinkedIn →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="suscribete">
        <div className="fg-container py-24 md:py-28">
          <div className="max-w-2xl">
            <SectionLabel>Entrar al espacio</SectionLabel>
            <h2 className="fg-section-heading mt-8">Newsletter tortuga.</h2>
            <p className="fg-body-lg mt-6 text-ink/65">
              Un correo cada semana como mucho. A veces menos. Solo cuando hay
              algo que merece tu tiempo.
            </p>
            <ul className="fg-body-lg mt-6 space-y-2 text-ink/75">
              <li>— Lo que hemos probado y lo que nos ha salido mal</li>
              <li>— Laboratorios nuevos antes de hacerse públicos</li>
              <li>— Lecturas y conversaciones que nos están removiendo</li>
            </ul>
            <p className="fg-body-lg mt-6 text-ink/65">
              No hay plan de contenidos. Hay criterio.
            </p>
            <div className="mt-10">
              <NewsletterForm />
            </div>
            <p className="fg-body mt-6 text-ink/80 fw-450">
              Respondes a cualquier correo y leemos. Esa es la parte &quot;comunidad&quot;.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
