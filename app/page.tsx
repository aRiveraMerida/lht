import Link from 'next/link';
import { SectionHeader } from '@/components/SectionLabel';
import { NewsletterForm } from '@/components/NewsletterForm';
import { ProductCard } from '@/components/ProductCard';
import { getPreviewVariant } from '@/lib/assets';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 5);
  const totalCount = posts.length;

  return (
    <div>
      {/* ─── HERO ─── */}
      <section
        className="ed-container flex flex-col justify-between"
        style={{
          minHeight: '100dvh',
          paddingTop: 110,
          paddingBottom: 28,
        }}
      >
        <div />

        <div className="flex flex-col gap-5 flex-1 justify-center">
          <h1
            className="ed-display-xl"
            style={{ fontSize: '13vw', mixBlendMode: 'difference' }}
          >
            La IA,
            <br />
            <span className="ed-stroke">despacio</span>
            <span className="ed-caret" />
          </h1>

          <p
            className="font-[var(--font-body)] mt-3"
            style={{
              fontSize: 'clamp(13px, 1vw, 16px)',
              lineHeight: 1.6,
              maxWidth: '46ch',
              opacity: 0.85,
              letterSpacing: '0.02em',
              mixBlendMode: 'difference',
            }}
          >
            Un laboratorio para probar IA{' '}
            <strong
              style={{
                fontWeight: 500,
                borderBottom: '1px solid rgba(246,246,246,0.4)',
                paddingBottom: 1,
              }}
            >
              con las manos
            </strong>
            , sin humo y sin FOMO.
            <br />
            Una habitación donde se piensa antes de opinar.
          </p>
        </div>

        <div
          className="flex flex-wrap justify-between items-end gap-4 pt-5 ed-rule"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'max(11px, 0.75vw)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            mixBlendMode: 'difference',
          }}
        >
          <div style={{ lineHeight: 1.55 }}>
            <strong style={{ fontWeight: 500, display: 'block', marginBottom: 4, opacity: 0.6 }}>
              Qué es
            </strong>
            Un newsletter y un laboratorio
            <br />
            de experimentos con IA.
          </div>
          <div style={{ lineHeight: 1.55 }}>
            <strong style={{ fontWeight: 500, display: 'block', marginBottom: 4, opacity: 0.6 }}>
              Quién
            </strong>
            Equipo de IA de
            <br />
            The Power
          </div>
          <div style={{ lineHeight: 1.55, textAlign: 'right' }}>
            <strong style={{ fontWeight: 500, display: 'block', marginBottom: 4, opacity: 0.6 }}>
              Dónde
            </strong>
            lahabitaciontortuga.com
            <br />
            <span style={{ opacity: 0.55 }}>est. 2024</span>
          </div>
        </div>
      </section>

      {/* ─── MISIÓN + ACTITUD ─── */}
      <section className="ed-container py-20 md:py-24">
        <SectionHeader idx="Manifiesto" tag="Por qué este sitio existe" />
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.5fr_1fr] md:gap-20 mt-12">
          <div>
            <h2 className="ed-display max-w-2xl">
              Un sitio donde la IA se piensa antes de venderse.
            </h2>
            <p className="ed-deck mt-7 max-w-xl opacity-80">
              Aquí no hay newsletter diaria. Ni hot takes. Ni hilos virales.
              Hay laboratorios abiertos, casos prácticos y preguntas honestas.
              Lo que funciona, lo que no, y lo que todavía no sabemos.
            </p>
          </div>

          <div className="md:border-l md:border-[color:var(--color-hairline)] md:pl-12">
            <div className="ed-kicker-bold">Actitud</div>
            <div className="ed-display mt-5">
              Despacio.
              <br />
              Con foco.
              <br />
              Con criterio.
            </div>
          </div>
        </div>
      </section>

      {/* ─── QUÉ PASA AQUÍ ─── */}
      <section className="ed-container py-20 md:py-24">
        <SectionHeader idx="Qué pasa aquí" tag="Tres cosas. Ninguna urgente." />

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-x-8">
          <article className="md:border-l md:border-[color:var(--color-hairline)] md:pl-6 first:md:border-l-0 first:md:pl-0">
            <div className="ed-kicker-bold">01 · Laboratorios</div>
            <h3 className="ed-ui-heading mt-4">
              Experimentos reales con herramientas reales.
            </h3>
            <p className="ed-body mt-3 opacity-75">
              Documentados con el proceso entero, no solo el resultado.
            </p>
          </article>

          <article className="md:border-l md:border-[color:var(--color-hairline)] md:pl-6">
            <div className="ed-kicker-bold">02 · Laboratorios largos</div>
            <h3 className="ed-ui-heading mt-4">
              Para exprimir una herramienta entera.
            </h3>
            <p className="ed-body mt-3 opacity-75">
              Recorridos completos por Claude Code, Copilot y los stacks que toque —
              para usarlos bien, no para sacarles la primera demo.
            </p>
          </article>

          <article className="md:border-l md:border-[color:var(--color-hairline)] md:pl-6">
            <div className="ed-kicker-bold">03 · Reflexiones</div>
            <h3 className="ed-ui-heading mt-4">
              Lo que pensamos en voz alta.
            </h3>
            <p className="ed-body mt-3 opacity-75">
              Lo que todavía no sabemos. Lo que no nos atrevemos a decir en otros sitios.
            </p>
          </article>
        </div>
      </section>

      {/* ─── ARCHIVO RECIENTE ─── */}
      {recent.length > 0 && (
        <section id="archivo" className="ed-container py-20 md:py-24">
          <SectionHeader
            idx="Archivo"
            tag="Últimos laboratorios · cronológico"
          />

          <div className="lab-list mt-10">
            {recent.map((post, index) => (
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
                totalCount={totalCount}
              />
            ))}
          </div>

          {posts.length > recent.length && (
            <div className="mt-10 flex">
              <Link href="/blog" className="hover-act">
                <span className="brkt">[</span>
                <span>Ver archivo completo</span>
                <span className="brkt">]</span>
                <span className="underliner" />
              </Link>
            </div>
          )}
        </section>
      )}

      {/* ─── QUIÉN ESCRIBE AQUÍ ─── */}
      <section id="residentes" className="ed-container py-20 md:py-24">
        <SectionHeader idx="Residentes" tag="Quién escribe aquí" />

        <h2 className="ed-display mt-12 max-w-4xl">
          Solo escribe el equipo de ThePower.
        </h2>
        <p className="ed-deck mt-7 max-w-2xl opacity-80">
          Esto no es un blog corporativo. Es un sitio diferente: el mismo equipo
          que se ve todos los días en el trabajo, pero sin la chaqueta del cliente
          ni la prisa del trimestre.
        </p>

        <div
          className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-x-16 pt-10"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <div>
            <div className="ed-kicker-bold">Lo que hacemos fuera</div>
            <p className="ed-deck mt-4 opacity-80">
              +20.000 profesionales formados. +150 empresas acompañadas. Dirigimos
              el programa B2B de IA y Tecnología de ThePower Education. Clientes
              como KPMG, EY, Estrella Galicia o El Corte Inglés.
            </p>
          </div>
          <div>
            <div className="ed-kicker-bold">Lo que pasa aquí</div>
            <p className="ed-deck mt-4 opacity-80">
              Dudamos de todo lo que está pasando. Probamos antes de opinar.
              Publicamos con criterio, no con prisa.
            </p>
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section id="newsletter" className="ed-container py-20 md:py-24">
        <SectionHeader idx="Newsletter" tag="Sin prisas. Sin envíos vacíos." />

        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-12 md:gap-20 mt-12">
          <div>
            <h2 className="ed-display">
              Apúntate<span style={{ color: 'var(--color-don-red)' }}>.</span>
            </h2>
            <p className="ed-deck mt-7 opacity-80">
              Entras y te avisamos cuando hay algo que merece tu tiempo.
              Sin calendario fijo. Sin FOMO. Sin envíos vacíos.
            </p>
            <ul className="ed-body mt-6 space-y-2 opacity-85">
              <li>— Aviso de nuevos laboratorios largos antes de hacerse públicos</li>
              <li>— Experimentos y lo que nos ha salido mal</li>
              <li>— Lecturas y conversaciones que nos están removiendo</li>
            </ul>
            <p className="ed-body mt-6 opacity-75">
              No hay plan de contenidos. Hay criterio.
            </p>
          </div>

          <div className="md:pt-3">
            <NewsletterForm />
            <p className="ed-body mt-6 opacity-70">
              Respondes a cualquier correo y leemos. Esa es la parte de comunidad.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CONTACTO ─── */}
      <section id="contacto" className="ed-container py-20 md:py-24">
        <SectionHeader idx="Contacto" tag="Respondemos con calma" />

        <h2 className="ed-display mt-12">
          Escríbenos<span style={{ color: 'var(--color-don-red)' }}>.</span>
        </h2>

        <div
          className="mt-10 pt-5 flex flex-wrap items-end justify-between gap-7"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <div>
            <a
              href="mailto:hola@lahabitaciontortuga.com"
              className="font-[var(--font-display)] block"
              style={{
                fontWeight: 700,
                fontStretch: 'condensed',
                fontSize: 'clamp(26px, 3vw, 48px)',
                lineHeight: 0.9,
                letterSpacing: '-0.005em',
                textTransform: 'lowercase',
              }}
            >
              hola@lahabitaciontortuga.com
            </a>
            <div
              className="mt-2"
              style={{
                opacity: 0.6,
                textTransform: 'none',
                letterSpacing: '0.04em',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
              }}
            >
              Sin prisas. Leemos todo.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="#newsletter" className="hover-act">
              <span className="brkt">[</span>
              <span>Newsletter</span>
              <span className="brkt">]</span>
              <span className="underliner" />
            </a>
            <a
              href="https://www.linkedin.com/in/albertoriveramerida"
              target="_blank"
              rel="noopener noreferrer"
              className="hover-act"
            >
              <span className="brkt">[</span>
              <span>LinkedIn</span>
              <span className="brkt">]</span>
              <span className="underliner" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
