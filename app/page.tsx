import { PageHeader } from '@/components/PageHeader';
import { PostList } from '@/components/PostList';
import { Button, Card } from '@/components/tortuga';
import { LabCardProgress, LabStatus } from '@/components/lab/LabProgress';
import { getAllPosts } from '@/lib/posts';
import { labList } from '@/lib/labs';

const RESIDENTS = [
  { name: 'Alberto Rivera', href: 'https://www.linkedin.com/in/albertoriveramerida' },
  { name: 'Javier Carreira', href: 'https://www.linkedin.com/in/javier-carreira-c/' },
];

const LATEST = 6;

export default function Home() {
  const posts = getAllPosts();
  const latest = posts.slice(0, LATEST);

  return (
    <div className="page-width">
      <PageHeader
        title="La IA, despacio"
        deck={
          <>
            Un laboratorio para probar IA <strong>con las manos</strong>, sin humo y sin FOMO.
            Una habitación donde se piensa antes de opinar.
          </>
        }
      />

      {/* ─── ARTÍCULOS ─── */}
      <section id="archivo" className="pt-4 pb-12" aria-labelledby="articulos">
        <h2 id="articulos" className="sr-only">Artículos</h2>
        <PostList posts={latest} wide />
        {posts.length > latest.length && (
          <Button href="/blog" className="mt-8">
            Ver los {posts.length} artículos
          </Button>
        )}
      </section>

      {/* ─── LABORATORIOS ─── */}
      <section className="block" aria-labelledby="laboratorios">
        <div className="block-head">
          <h2 id="laboratorios">Laboratorios</h2>
          <p>Una herramienta entera, capítulo a capítulo.</p>
        </div>
        <div className="grid">
          {labList.map((lab) => (
            <Card
              key={lab.slug}
              tone="clay"
              eyebrow="Laboratorio"
              href={lab.urlBase}
              aside={<LabStatus lab={lab.slug} total={lab.sequence.length} />}
              title={lab.title}
              desc={lab.summary}
              meta={`${lab.stats.guides} capítulos`}
            >
              <LabCardProgress lab={lab.slug} total={lab.sequence.length} />
            </Card>
          ))}
        </div>
      </section>

      {/* ─── SOBRE LA HABITACIÓN ─── */}
      <section id="residentes" className="block" aria-labelledby="sobre">
        <div className="block-head">
          <h2 id="sobre">Sobre la habitación</h2>
          <p>Despacio. Con foco. Con criterio.</p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <h3>Un sitio donde la IA se piensa antes de venderse.</h3>
            <p className="mt-3 text-ink-2">
              Aquí no hay hot takes. Ni hilos virales. Hay laboratorios abiertos, casos
              prácticos y preguntas honestas. Lo que funciona, lo que no, y lo que todavía
              no sabemos.
            </p>
          </div>

          <div>
            <h3>Solo escribe el equipo de ThePower.</h3>
            <p className="mt-3 text-ink-2">
              Esto no es un blog corporativo. Es un sitio diferente: el mismo equipo que se ve
              todos los días en el trabajo, pero sin la chaqueta del cliente ni la prisa del trimestre.
            </p>
            <p className="type-sm mt-3">
              +20.000 profesionales formados. +150 empresas acompañadas. Dirigimos el programa
              B2B de IA y Tecnología de ThePower Education. Clientes como KPMG, EY, Estrella
              Galicia o El Corte Inglés.
            </p>
          </div>

          <div id="contacto">
            <h3>Escríbenos.</h3>
            <p className="mt-3">
              <a href="mailto:hola@lahabitaciontortuga.com" className="link">
                hola@lahabitaciontortuga.com
              </a>
            </p>
            <p className="type-sm mt-1">Sin prisas. Leemos todo.</p>
            <div className="mt-3 flex flex-wrap gap-x-4">
              {RESIDENTS.map((person) => (
                <Button key={person.name} variant="ghost" href={person.href} external>
                  {person.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
