import Link from 'next/link';
import { Button } from '@/components/tortuga';
import { HomeMotion } from '@/components/home/HomeMotion';
import { LabCardProgress, LabStatus } from '@/components/lab/LabProgress';
import { getAuthor } from '@/lib/authors';
import { labList } from '@/lib/labs';
import { getAllPosts } from '@/lib/posts';

const RESIDENTS = [
  { name: 'Alberto Rivera', href: 'https://www.linkedin.com/in/albertoriveramerida' },
  { name: 'Javier Carreira', href: 'https://www.linkedin.com/in/javier-carreira-c/' },
];

const CHAPTERS = [
  { id: 'inicio', n: '00', label: 'Inicio' },
  { id: 'articulos', n: '01', label: 'Artículos' },
  { id: 'laboratorios', n: '02', label: 'Laboratorios' },
  { id: 'habitacion', n: '03', label: 'La habitación' },
];

// The site's own promise, split into the three outcomes it names.
const OUTCOMES = ['Lo que funciona', 'Lo que no', 'Lo que todavía no sabemos'];

// Orientation labels for the hero: one per recent article topic.
const TOPICS = ['AI Act', 'Claude Code', 'WebMCP', 'Jupyter', 'Data Lake', 'Burbuja IA'];

// Latest article as the lit slab, then this many below it.
const LIST = 6;

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');

const delay = (i: number) => ({ ['--i' as string]: i });

export default function Home() {
  const posts = getAllPosts();
  const [latest, ...rest] = posts;
  const chaptersTotal = labList.reduce((n, l) => n + l.stats.guides, 0);
  const byline = (slugs: string[]) => slugs.map((s) => getAuthor(s)?.name ?? s).join(' y ');

  return (
    <div id="home" className="home">
      <div className="home-bg" aria-hidden="true" />
      <div className="home-progress" aria-hidden="true"><i /></div>

      <nav className="home-rail" aria-label="Capítulos de la portada">
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}><span className="n">{c.n}</span><span className="l">{c.label}</span></a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ─── 00 · INICIO ─── */}
      <section id="inicio" data-chapter className="page-width home-hero" aria-labelledby="home-title">
        <div>
          <span className="home-pill"><i />Laboratorio de IA · Sin prisas</span>
          <h1 id="home-title" className="home-display">
            <span className="w" style={delay(0)}>La</span> <span className="w" style={delay(1)}>IA,</span>
            <br />
            <em className="w" style={delay(2)}>despacio.</em>
          </h1>
          <p className="home-lede" data-reveal style={delay(4)}>
            Un laboratorio para probar IA <strong>con las manos</strong>, sin humo y sin FOMO. Una
            habitación donde se piensa antes de opinar.
          </p>
          <div className="home-cta" data-reveal style={delay(5)}>
            <Button variant="primary" href="#articulos">Leer lo último</Button>
            <Button href="#laboratorios">Ir a los laboratorios</Button>
          </div>
        </div>

        <figure className="home-panel home-hv" data-reveal style={delay(3)} aria-label="Cómo trabaja la habitación">
          <div className="home-label"><span>Temas · {posts.length} artículos</span><span>Entran</span></div>
          <ul className="home-chips">{TOPICS.map((t) => <li key={t}>{t}</li>)}</ul>
          <div className="home-wire" aria-hidden="true"><i /></div>
          <div className="home-engine"><b>Probamos</b><small>con las manos</small></div>
          <div className="home-wire" aria-hidden="true"><i /></div>
          <div className="home-seam">
            <b>antes de opinar</b>
            <small>Sin humo, sin FOMO.</small>
          </div>
          <div className="home-wire" aria-hidden="true"><i /></div>
          <div className="home-label"><span>Lo que sale</span><span>Y lo contamos</span></div>
          <ol className="home-outs">
            {OUTCOMES.map((o, i) => (
              <li key={o} className={i === 0 ? 'active' : undefined}><span>{o}</span><span>0{i + 1}</span></li>
            ))}
          </ol>
          <figcaption>Aquí no hay hot takes. Ni hilos virales.</figcaption>
        </figure>
      </section>

      {/* ─── 01 · ARTÍCULOS ─── */}
      <section id="articulos" data-chapter className="page-width home-chapter" aria-labelledby="h-articulos">
        <header className="home-head" data-reveal>
          <p className="home-num"><b>01</b> Artículos</p>
          <h2 id="h-articulos" className="home-display">Lo último, <em>sin prisa</em></h2>
          <p>{posts.length} artículos. Lo que funciona, lo que no, y lo que todavía no sabemos.</p>
        </header>

        {latest && (
          <Link className="home-feature" href={`/blog/${latest.slug}`} data-reveal>
            <div>
              <span className="tag">Último · {fmt(latest.date)}</span>
              <h3 className="home-display">{latest.title}</h3>
            </div>
            <div>
              <p>{latest.excerpt || latest.description}</p>
              <p className="meta">{byline(latest.authors)} · {latest.readingTime}</p>
            </div>
          </Link>
        )}

        <ul className="home-posts">
          {rest.slice(0, LIST).map((p, i) => (
            <li key={p.slug} data-reveal style={delay(i)}>
              <Link href={`/blog/${p.slug}`}>
                <time dateTime={p.date}>{fmt(p.date)}</time>
                <span>
                  <h3 className="home-display">{p.title}</h3>
                  <p>{p.excerpt || p.description}</p>
                </span>
                <span className="rt">{p.readingTime}</span>
              </Link>
            </li>
          ))}
        </ul>
        {posts.length > LIST + 1 && (
          <Button href="/blog" className="mt-8">Ver los {posts.length} artículos</Button>
        )}
      </section>

      {/* ─── 02 · LABORATORIOS ─── */}
      <section id="laboratorios" data-chapter className="page-width home-chapter" aria-labelledby="h-laboratorios">
        <header className="home-head" data-reveal>
          <p className="home-num"><b>02</b> Laboratorios</p>
          <h2 id="h-laboratorios" className="home-display">Una herramienta entera, <em>capítulo a capítulo</em></h2>
          <p>{labList.length} laboratorios y {chaptersTotal} capítulos, en orden. Cada uno se recorre como un curso, a tu ritmo.</p>
        </header>

        <div className="home-labs">
          {labList.map((lab) => {
            const stages = lab.blocks.filter((b) => b.guides.length > 0);
            const connection = stages.find((b) => b.connection)?.connection;
            return (
              <article key={lab.slug} className="home-panel home-lab" data-reveal>
                <div className="home-lab-head">
                  <h3 className="home-display"><Link href={lab.urlBase}>{lab.title}</Link></h3>
                  <span className="stat">
                    {lab.stats.guides} capítulos · {stages.length} {stages.length === 1 ? 'bloque' : 'bloques'} · {lab.stats.updated}
                  </span>
                </div>
                <p>{lab.summary}</p>
                <ol className="home-pipe" style={{ ['--n' as string]: stages.length }} aria-label={`Bloques de ${lab.title}`}>
                  {stages.map((b) => (
                    <li key={b.id} className="home-stage">
                      <span className="k">{b.kicker}</span>
                      <b>{b.title}</b>
                      <small>{b.guides.length} cap.</small>
                    </li>
                  ))}
                </ol>
                <LabCardProgress lab={lab.slug} total={lab.sequence.length} />
                <div className="home-lab-foot">
                  <span>{connection ?? `${lab.stats.guides} capítulos en orden`}</span>
                  <LabStatus lab={lab.slug} total={lab.sequence.length} />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── 03 · LA HABITACIÓN ─── */}
      <section id="habitacion" data-chapter className="page-width home-chapter pb-24" aria-labelledby="h-habitacion">
        <header className="home-head" data-reveal>
          <p className="home-num"><b>03</b> La habitación</p>
          <h2 id="h-habitacion" className="home-display">Despacio. Con foco. <em>Con criterio.</em></h2>
        </header>

        <div id="residentes" className="home-rules">
          <article className="home-panel home-rule" data-reveal style={delay(0)}>
            <span className="rn" aria-hidden="true">i</span>
            <span className="tag">Qué es</span>
            <h3 className="home-display">Un sitio donde la IA se piensa antes de venderse.</h3>
            <p>Aquí no hay hot takes. Ni hilos virales. Hay laboratorios abiertos, casos prácticos y preguntas honestas. Lo que funciona, lo que no, y lo que todavía no sabemos.</p>
          </article>
          <article className="home-panel home-rule" data-reveal style={delay(1)}>
            <span className="rn" aria-hidden="true">ii</span>
            <span className="tag">Quién escribe</span>
            <h3 className="home-display">Solo escribe el equipo de ThePower.</h3>
            <p>
              Esto no es un blog corporativo. Es un sitio diferente: el mismo equipo que se ve todos los
              días en el trabajo, pero sin la chaqueta del cliente ni la prisa del trimestre.
            </p>
            <div className="stats">
              <span><b>+20.000</b><span>profesionales formados</span></span>
              <span><b>+150</b><span>empresas acompañadas</span></span>
            </div>
            <p className="type-sm">
              Dirigimos el programa B2B de IA y Tecnología de ThePower Education. Clientes como KPMG, EY,
              Estrella Galicia o El Corte Inglés.
            </p>
          </article>
          <article id="contacto" className="home-panel home-rule" data-reveal style={delay(2)}>
            <span className="rn" aria-hidden="true">iii</span>
            <span className="tag">Escríbenos</span>
            <a className="mail" href="mailto:hola@lahabitaciontortuga.com">hola@<wbr />lahabitaciontortuga.com</a>
            <p>Sin prisas. Leemos todo.</p>
            <div className="people">
              {RESIDENTS.map((r) => (
                <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer">{r.name}</a>
              ))}
            </div>
          </article>
        </div>
      </section>

      <HomeMotion rootId="home" />
    </div>
  );
}
