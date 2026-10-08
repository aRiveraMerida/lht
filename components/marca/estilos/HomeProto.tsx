import Link from 'next/link'
import { Fraunces, Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'
import { getAuthor } from '@/lib/authors'
import { labList } from '@/lib/labs'
import { getAllPosts } from '@/lib/posts'
import { PaletteDock } from './PaletteDock'
import { ProtoBehaviour } from './ProtoBehaviour'
import palettes from './palettes.json'
import './proto.css'

const instrument = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-instrument', display: 'swap' })
const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' })
// The site loads Fraunces without italics; the mixed skin needs the real italic for its accent word.
const fraunces = Fraunces({ subsets: ['latin'], style: ['normal', 'italic'], axes: ['SOFT', 'opsz'], variable: '--font-fraunces-proto', display: 'swap' })

export type Skin = 'noir' | 'mezcla'

export const PALETTE_IDS = palettes.map((p) => p.id)
export const DEFAULT_PALETTE = 'papel'

const CHAPTERS = [
  { id: 'inicio', n: '00', label: 'Inicio' },
  { id: 'articulos', n: '01', label: 'Artículos' },
  { id: 'laboratorios', n: '02', label: 'Laboratorios' },
  { id: 'habitacion', n: '03', label: 'La habitación' },
]

// The site's own sentence, split into the three outcomes it promises.
const OUTCOMES = [
  { k: '01', label: 'Lo que funciona' },
  { k: '02', label: 'Lo que no' },
  { k: '03', label: 'Lo que todavía no sabemos' },
]

// Orientation labels for the hero, one per recent article topic.
const TOPICS = ['AI Act', 'Claude Code', 'WebMCP', 'Jupyter', 'Data Lake', 'Burbuja IA']

const RESIDENTS = [
  { name: 'Alberto Rivera', href: 'https://www.linkedin.com/in/albertoriveramerida' },
  { name: 'Javier Carreira', href: 'https://www.linkedin.com/in/javier-carreira-c/' },
]

const fmt = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '')

const words = (s: string) => s.split(' ')

export function HomeProto({ skin, palette }: { skin: Skin; palette?: string }) {
  const posts = getAllPosts()
  const [latest, ...rest] = posts
  const chaptersTotal = labList.reduce((n, l) => n + l.stats.guides, 0)
  const rootId = `proto-${skin}`
  const byline = (slugs: string[]) => slugs.map((s) => getAuthor(s)?.name ?? s).join(' y ')

  return (
    <div
      id={rootId}
      className={`proto ${instrument.variable} ${geist.variable} ${geistMono.variable} ${fraunces.variable}`}
      data-skin={skin}
      data-palette={skin === 'mezcla' ? palette ?? DEFAULT_PALETTE : undefined}
    >
      <a className="skip" href="#articulos">Saltar al contenido</a>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />

      {skin === 'mezcla' ? (
        // The original LHT header, as on the live site, wearing the prototype's palette.
        <header className="ph">
          <div className="wrap ph-inner">
            <a href="#inicio" className="ph-brand">
              <span className="ph-name">La Habitación Tortuga</span>
              <span className="ph-tag">Laboratorio de IA · Sin prisas</span>
            </a>
            <nav className="ph-nav" aria-label="Principal">
              <Link href="/blog">Archivo</Link>
              <a href="#contacto">Contacto</a>
              <button type="button" className="ph-toggle" data-theme-toggle aria-label="Cambiar tema">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              </button>
            </nav>
          </div>
          <div className="progress" aria-hidden="true"><i /></div>
        </header>
      ) : (
        <header className="topbar">
          <a href="#inicio" className="brandmark"><b>La Habitación Tortuga</b><span className="hidden sm:inline">· Laboratorio de IA</span></a>
          <p className="now" data-now aria-live="polite"><span>00</span> Inicio</p>
          <div className="tb-actions">
            <p className="kbd"><kbd>J</kbd><kbd>K</kbd>capítulos</p>
            <button type="button" className="icon-btn" data-theme-toggle aria-label="Cambiar tema">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </button>
          </div>
          <div className="progress" aria-hidden="true"><i /></div>
        </header>
      )}

      <nav className="rail" aria-label="Capítulos">
        <ol>
          {CHAPTERS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}><span className="n">{c.n}</span><span className="l">{c.label}</span></a>
            </li>
          ))}
        </ol>
      </nav>

      <main>
        {/* ── 00 · Inicio ── */}
        <section id="inicio" data-chapter="Inicio" data-n="00" className="wrap hero" aria-labelledby="p-title">
          <div>
            <span className="pill"><span className="dot" />Laboratorio de IA · Sin prisas</span>
            <h1 id="p-title" className="display">
              {words('La IA,').map((w, i) => (
                <span key={w} className="w" style={{ ['--i' as string]: i }}>{w}&nbsp;</span>
              ))}
              <br />
              <em className="w" style={{ ['--i' as string]: 2 }}>despacio.</em>
            </h1>
            <p className="lede" data-reveal style={{ ['--i' as string]: 4 }}>
              Un laboratorio para probar IA <strong>con las manos</strong>, sin humo y sin FOMO. Una
              habitación donde se piensa antes de opinar.
            </p>
            <div className="cta" data-reveal style={{ ['--i' as string]: 5 }}>
              <a className="btn btn-primary" href="#articulos">
                Leer lo último
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
              </a>
              <a className="btn btn-ghost" href="#laboratorios">Ir a los laboratorios</a>
            </div>
          </div>

          <figure className="panel hv" data-reveal style={{ ['--i' as string]: 3, margin: 0 }} aria-label="Cómo trabaja la habitación">
            <div className="hv-label"><span>Temas · {posts.length} artículos</span><span>Entran</span></div>
            <div className="chips">{TOPICS.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            <div className="wire" aria-hidden="true"><i /></div>
            <div className="engine"><b>Probamos</b><small>con las manos</small></div>
            <div className="wire" aria-hidden="true"><i /></div>
            <div className="seam">
              <b>antes de opinar</b>
              <small>Sin humo, sin FOMO.</small>
            </div>
            <div className="wire" aria-hidden="true"><i /></div>
            <div className="hv-label"><span>Lo que sale</span><span>Y lo contamos</span></div>
            <div className="outs">
              {OUTCOMES.map((o, i) => (
                <div key={o.k} className={`out${i === 0 ? ' active' : ''}`}><span>{o.label}</span><span className="k">{o.k}</span></div>
              ))}
            </div>
            <figcaption className="hv-foot">Aquí no hay hot takes. Ni hilos virales.</figcaption>
          </figure>
        </section>

        {/* ── 01 · Artículos ── */}
        <section id="articulos" data-chapter="Artículos" data-n="01" className="wrap chapter" aria-labelledby="h-art">
          <header className="ch-head" data-reveal>
            <p className="ch-num"><b>01</b> Artículos</p>
            <h2 id="h-art" className="display">Lo último, <em>sin prisa</em></h2>
            <p>{posts.length} artículos. Lo que funciona, lo que no, y lo que todavía no sabemos.</p>
          </header>

          {latest && (
            <Link className="panel feature" href={`/blog/${latest.slug}`} data-reveal>
              <div>
                <span className="tag">Último · {fmt(latest.date)}</span>
                <h3 className="display">{latest.title}</h3>
              </div>
              <div>
                <p>{latest.excerpt || latest.description}</p>
                <p className="meta">{byline(latest.authors)} · {latest.readingTime}</p>
              </div>
            </Link>
          )}

          <ul className="posts">
            {rest.slice(0, 6).map((p, i) => (
              <li key={p.slug} className="post" data-reveal style={{ ['--i' as string]: i }}>
                <Link href={`/blog/${p.slug}`}>
                  <span className="date">{fmt(p.date)}</span>
                  <span>
                    <h3 className="display">{p.title}</h3>
                    <p>{p.excerpt || p.description}</p>
                  </span>
                  <span className="rt">{p.readingTime}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="cta" data-reveal>
            <Link className="btn btn-ghost" href="/blog">Ver los {posts.length} artículos</Link>
          </p>
        </section>

        {/* ── 02 · Laboratorios ── */}
        <section id="laboratorios" data-chapter="Laboratorios" data-n="02" className="wrap chapter" aria-labelledby="h-lab">
          <header className="ch-head" data-reveal>
            <p className="ch-num"><b>02</b> Laboratorios</p>
            <h2 id="h-lab" className="display">Una herramienta entera, <em>capítulo a capítulo</em></h2>
            <p>{labList.length} laboratorios y {chaptersTotal} capítulos, en orden. Cada uno se recorre como un curso, a tu ritmo.</p>
          </header>

          <div className="labs">
            {labList.map((lab) => {
              const stages = lab.blocks.filter((b) => b.guides.length > 0)
              const connection = stages.find((b) => b.connection)?.connection
              return (
                <article key={lab.slug} className="panel lab" data-reveal>
                  <div className="lab-head">
                    <h3 className="display"><Link href={lab.urlBase} style={{ textDecoration: 'none' }}>{lab.title}</Link></h3>
                    <span className="stat">{lab.stats.guides} capítulos · {stages.length} {stages.length === 1 ? 'bloque' : 'bloques'} · {lab.stats.updated}</span>
                  </div>
                  <p>{lab.summary}</p>
                  <ol className="pipe" style={{ ['--n' as string]: stages.length, listStyle: 'none', margin: 0, padding: 0 }} aria-label={`Bloques de ${lab.title}`}>
                    {stages.map((b) => (
                      <li key={b.id} className="stage">
                        <span className="k">{b.kicker}</span>
                        <b>{b.title}</b>
                        <small>{b.guides.length} cap.</small>
                      </li>
                    ))}
                  </ol>
                  {connection && <p className="lab-foot">{connection}</p>}
                </article>
              )
            })}
          </div>
        </section>

        {/* ── 03 · La habitación ── */}
        <section id="habitacion" data-chapter="La habitación" data-n="03" className="wrap chapter" aria-labelledby="h-room">
          <header className="ch-head" data-reveal>
            <p className="ch-num"><b>03</b> La habitación</p>
            <h2 id="h-room" className="display">Despacio. Con foco. <em>Con criterio.</em></h2>
          </header>

          <div className="rules">
            <article className="panel rule" data-reveal style={{ ['--i' as string]: 0 }}>
              <span className="rn" aria-hidden="true">i</span>
              <span className="tag">Qué es</span>
              <h3 className="display">Un sitio donde la IA se piensa antes de venderse.</h3>
              <p>Aquí no hay hot takes. Ni hilos virales. Hay laboratorios abiertos, casos prácticos y preguntas honestas. Lo que funciona, lo que no, y lo que todavía no sabemos.</p>
            </article>
            <article className="panel rule" data-reveal style={{ ['--i' as string]: 1 }}>
              <span className="rn" aria-hidden="true">ii</span>
              <span className="tag">Quién escribe</span>
              <h3 className="display">Solo escribe el equipo de ThePower.</h3>
              <p>Esto no es un blog corporativo. Es el mismo equipo que se ve todos los días en el trabajo, pero sin la chaqueta del cliente ni la prisa del trimestre.</p>
              <div className="stats">
                <span><b>+20.000</b><span>profesionales formados</span></span>
                <span><b>+150</b><span>empresas acompañadas</span></span>
              </div>
            </article>
            <article id="contacto" className="panel rule" data-reveal style={{ ['--i' as string]: 2 }}>
              <span className="rn" aria-hidden="true">iii</span>
              <span className="tag">Escríbenos</span>
              <a className="mail" href="mailto:hola@lahabitaciontortuga.com">hola@<wbr />lahabitaciontortuga.com</a>
              <p>Sin prisas. Leemos todo.</p>
              <div className="people">
                {RESIDENTS.map((r) => <a key={r.name} href={r.href} target="_blank" rel="noopener noreferrer">{r.name}</a>)}
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="p-foot">
        <div className="wrap">
          <span>© 2026 La Habitación Tortuga</span>
          <span>Prototipo de estilo · {skin === 'noir' ? 'Noir' : 'Mezcla'} · no publicado</span>
        </div>
      </footer>

      {skin === 'mezcla' && <PaletteDock rootId={rootId} palettes={palettes.map(({ id, name, swatches }) => ({ id, name, dots: [swatches.light.signal, swatches.light.second, swatches.light.third] }))} initial={palette ?? DEFAULT_PALETTE} />}
      <ProtoBehaviour rootId={rootId} />
    </div>
  )
}
