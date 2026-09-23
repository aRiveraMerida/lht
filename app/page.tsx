import { SectionHeader } from '@/components/SectionLabel';
import { ProductCard } from '@/components/ProductCard';
import { PageHeader } from '@/components/PageHeader';
import { Button, Card } from '@/components/tortuga';
import { getAllPosts } from '@/lib/posts';

const FACTS = [
  { label: 'Qué es', lines: ['Un laboratorio', 'de experimentos con IA.'] },
  { label: 'Quién', lines: ['El equipo de IA', 'de ThePower'] },
  { label: 'Dónde', lines: ['lahabitaciontortuga.com', 'est. 2024'] },
];

const RESIDENTS = [
  { name: 'Alberto Rivera', href: 'https://www.linkedin.com/in/albertoriveramerida' },
  { name: 'Javier Carreira', href: 'https://www.linkedin.com/in/javier-carreira-c/' },
];

export default function Home() {
  const posts = getAllPosts();
  const recent = posts.slice(0, 5);
  const totalCount = posts.length;

  return (
    <div className="page-width">
      <PageHeader
        title="La IA, despacio"
        deck={
          <>
            Un laboratorio para probar IA <strong>con las manos</strong>, sin humo y sin FOMO.
            <br />
            Una habitación donde se piensa antes de opinar.
          </>
        }
      >
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {FACTS.map((fact) => (
            <div key={fact.label}>
              <dt className="eyebrow mb-1">{fact.label}</dt>
              <dd className="type-sm">
                <span className="text-ink">{fact.lines[0]}</span>
                <br />
                {fact.lines[1]}
              </dd>
            </div>
          ))}
        </dl>
      </PageHeader>

      {/* ─── MISIÓN + ACTITUD ─── */}
      <section className="section">
        <SectionHeader idx="Manifiesto" tag="Por qué este sitio existe" />
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          <div>
            <p className="type-xl">Un sitio donde la IA se piensa antes de venderse.</p>
            <p className="mt-4 text-muted">
              Aquí no hay hot takes. Ni hilos virales.
              Hay laboratorios abiertos, casos prácticos y preguntas honestas.
              Lo que funciona, lo que no, y lo que todavía no sabemos.
            </p>
          </div>

          <div className="lg:border-l lg:border-rule lg:pl-12">
            <div className="eyebrow">Actitud</div>
            <p className="type-xl mt-3">
              Despacio.
              <br />
              Con foco.
              <br />
              Con criterio.
            </p>
          </div>
        </div>
      </section>

      {/* ─── QUÉ PASA AQUÍ ─── */}
      <section className="section">
        <SectionHeader idx="Qué pasa aquí" tag="Dos cosas. Ninguna urgente." />
        <div className="grid">
          <Card
            eyebrow="01 · Artículos"
            title="Una pieza, una idea."
            desc="Notas de campo, casos sueltos y reflexiones honestas. Con el proceso entero, no solo el resultado."
          />
          <Card
            eyebrow="02 · Laboratorios"
            title="Una herramienta entera, capítulo a capítulo."
            desc="Experimentos completos por Claude Code, Campaign Hub y los stacks que toque. Para usarlos bien, no para sacarles la primera demo."
          />
        </div>
      </section>

      {/* ─── ARCHIVO RECIENTE ─── */}
      {recent.length > 0 && (
        <section id="archivo" className="section">
          <SectionHeader idx="Archivo" tag="Últimos artículos · cronológico" />
          <div>
            <div className="stack">
              {recent.map((post, index) => (
                <ProductCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  index={index}
                  totalCount={totalCount}
                />
              ))}
            </div>

            {posts.length > recent.length && (
              <Button href="/blog" className="mt-6">
                Ver archivo completo
              </Button>
            )}
          </div>
        </section>
      )}

      {/* ─── QUIÉN ESCRIBE AQUÍ ─── */}
      <section id="residentes" className="section">
        <SectionHeader idx="Residentes" tag="Quién escribe aquí" />
        <div>
          <p className="type-xl">Solo escribe el equipo de ThePower.</p>
          <p className="mt-4 text-muted">
            Esto no es un blog corporativo. Es un sitio diferente: el mismo equipo
            que se ve todos los días en el trabajo, pero sin la chaqueta del cliente
            ni la prisa del trimestre.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <div className="eyebrow">Lo que hacemos fuera</div>
              <p className="type-sm mt-2">
                +20.000 profesionales formados. +150 empresas acompañadas. Dirigimos
                el programa B2B de IA y Tecnología de ThePower Education. Clientes
                como KPMG, EY, Estrella Galicia o El Corte Inglés.
              </p>
            </div>
            <div>
              <div className="eyebrow">Lo que pasa aquí</div>
              <p className="type-sm mt-2">
                Dudamos de todo lo que está pasando. Probamos antes de opinar.
                Publicamos con criterio, no con prisa.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACTO ─── */}
      <section id="contacto" className="section">
        <SectionHeader idx="Contacto" tag="Respondemos con calma" />
        <div>
          <p className="type-xl">Escríbenos.</p>
          <p className="mt-4">
            <a href="mailto:hola@lahabitaciontortuga.com" className="link font-semibold">
              hola@lahabitaciontortuga.com
            </a>
          </p>
          <p className="type-sm mt-1">Sin prisas. Leemos todo.</p>
          <div className="mt-4 flex flex-wrap gap-x-4">
            {RESIDENTS.map((person) => (
              <Button key={person.name} variant="ghost" href={person.href} external>
                {person.name}
              </Button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
