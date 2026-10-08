import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/tortuga'
import { Construction, Note } from '@/components/marca/Construction'
import { Brand, CONCEPTS, HEX_CONCEPTS, ROUTES, U1b, U3b, C1b, M1, X, type Concept, type Mark } from '@/components/marca/marks'
import { Playground } from '@/components/marca/Playground'
import { LOCKUPS, Lockup, Part, Tile, type Tone } from '@/components/marca/shared'

const FINALISTS: {
  id: string
  name: string
  Mark: Mark
  says: string
  scores: [number, number, number, number, number, number]
  guides: React.ReactNode
}[] = [
  {
    id: 'U1',
    name: 'Umbral',
    Mark: U1b,
    says: 'Un arco de puerta cerrado a ras de suelo, y alguien dentro que no tiene prisa.',
    scores: [3, 3, 1, 3, 2, 3],
    guides: (
      <>
        <path d="M0 36H48M10 0V48M38 0V48" />
        <circle cx="24" cy="22" r="14" />
        <circle cx="24" cy="31" r="3.5" />
        <Note x={1} y={41}>suelo · y 36</Note>
        <Note x={24} y={5.4} anchor="middle">arco · r 14</Note>
        <Note x={47} y={41} anchor="end">punto · Ø 7</Note>
      </>
    ),
  },
  {
    id: 'U3',
    name: 'Puerta entornada',
    Mark: U3b,
    says: 'El mismo arco con un muro más corto: el punto sale, despacio, por el lado abierto.',
    scores: [2, 3, 1, 3, 2, 2],
    guides: (
      <>
        <path d="M0 36H48M10 0V48M38 0V48M38 26H48" />
        <circle cx="24" cy="22" r="14" />
        <circle cx="41.5" cy="31" r="3" />
        <Note x={1} y={41}>suelo · y 36</Note>
        <Note x={24} y={5.4} anchor="middle">arco · r 14</Note>
        <Note x={47} y={41} anchor="end">hueco · y 26→36</Note>
      </>
    ),
  },
  {
    id: 'C1',
    name: 'Caparazón',
    Mark: C1b,
    says: 'La tortuga sin adornos: tres escudos, patas en los extremos y una cabeza pegada que es el punto.',
    scores: [2, 3, 3, 1, 2, 2],
    guides: (
      <>
        <path d="M0 34H48M0 39H48M13 0V48M29 0V48" />
        <circle cx="21" cy="34" r="16" />
        <circle cx="41.5" cy="31.5" r="3.5" />
        <Note x={1} y={44.6}>base · y 34 · patas · y 39</Note>
        <Note x={21} y={13} anchor="middle">cúpula · r 16</Note>
      </>
    ),
  },
  {
    id: 'M1',
    name: 'H-habitación',
    Mark: M1,
    says: 'Dos muros y un suelo bajo: es la H de Habitación y es un lugar. El punto descansa en la barra.',
    scores: [3, 3, 1, 2, 2, 3],
    guides: (
      <>
        <path d="M12 0V48M36 0V48M0 30H48" />
        <circle cx="24" cy="25" r="3.5" />
        <Note x={13.4} y={7}>muro · x 12</Note>
        <Note x={13.6} y={34}>suelo · y 30</Note>
        <Note x={24} y={40.4} anchor="middle">luz · 24</Note>
      </>
    ),
  },
]

const HEX_FINALISTS: typeof FINALISTS = [
  {
    id: 'H13',
    name: 'Placa',
    Mark: X.placa,
    says: 'La cúpula del caparazón con su placa hexagonal central, cuatro juntas hasta el borde, patas en los extremos y la cabeza como punto. La marca principal.',
    scores: [2, 3, 3, 1, 3, 2],
    guides: (
      <>
        <path d="M0 35H48M0 40H48M20 0V48" />
        <circle cx="20" cy="35" r="18" />
        <circle cx="20" cy="27.5" r="7.5" />
        <circle cx="43.5" cy="32" r="3.5" />
        <Note x={1} y={45.4}>base y 35 · patas y 40</Note>
        <Note x={20} y={13.2} anchor="middle">cúpula · r 18</Note>
        <Note x={47} y={22} anchor="end">placa · r 7,5</Note>
      </>
    ),
  },
  {
    id: 'H12',
    name: 'Placa pequeña',
    Mark: X.placaPequena,
    says: 'La misma placa sin patas y un punto más de radio, para 24 px o menos: favicon, avatar, pestaña. Es la misma marca en otro tamaño óptico, no otra marca.',
    scores: [3, 3, 2, 1, 2, 3],
    guides: (
      <>
        <path d="M0 37H48M21 0V48" />
        <circle cx="21" cy="37" r="18.5" />
        <circle cx="21" cy="29" r="8" />
        <circle cx="44.5" cy="34" r="3" />
        <Note x={1} y={41}>base · y 37</Note>
        <Note x={21} y={14.6} anchor="middle">cúpula · r 18,5</Note>
        <Note x={47} y={41} anchor="end">≤ 24 px</Note>
      </>
    ),
  },
  {
    id: 'H14',
    name: 'Panal',
    Mark: X.panal,
    says: 'Tres placas en panal recortadas por la cúpula. La más hexagonal y con más carácter; a tamaño pequeño se vuelve una textura.',
    scores: [1, 3, 3, 1, 3, 1],
    guides: (
      <>
        <path d="M0 36H48M0 41H48M21 0V48" />
        <circle cx="21" cy="36" r="18.5" />
        <circle cx="21" cy="22.5" r="6.5" />
        <circle cx="14.9" cy="33" r="6.5" />
        <circle cx="27.1" cy="33" r="6.5" />
        <Note x={1} y={46}>base y 36 · patas y 41</Note>
        <Note x={21} y={13.6} anchor="middle">cúpula · r 18,5</Note>
        <Note x={47} y={22} anchor="end">placa · r 6,5</Note>
      </>
    ),
  },
  FINALISTS[0],
]

const CRITERIA = ['Legible a 16 px', 'Funciona en una tinta', 'Cuenta «tortuga»', 'Cuenta «habitación»', 'Distintiva', 'Fácil de dibujar']

const dots = (n: number) => '●'.repeat(n) + '○'.repeat(3 - n)

const STRESS: { tone: Tone; name: string }[] = [
  { tone: 'paper', name: 'Papel' },
  { tone: 'ink', name: 'Tinta' },
  { tone: 'moss', name: 'Musgo' },
  { tone: 'clay', name: 'Arcilla' },
]

function Finalists({ items }: { items: typeof FINALISTS }) {
  return (
    <>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {items.map((f) => (
            <article key={f.id} className="card !gap-4">
              <div className="flex items-baseline justify-between">
                <h3 className="type-lg">{f.name}</h3>
                <span className="eyebrow">{f.id}</span>
              </div>
              <Construction Mark={f.Mark} guides={f.guides} label={`Construcción de ${f.name}`} />
              <p>{f.says}</p>
            </article>
          ))}
        </div>

        <h3 className="type-lg mt-14">Pruebas de estrés</h3>
        <p className="mt-2 max-w-[62ch] text-ink-2">
          Cada finalista a 64, 32, 24 y 16 px sobre los cuatro fondos de la casa, y con la prueba de
          entrecerrar los ojos: la marca desenfocada tiene que seguir diciendo lo mismo.
        </p>
        <div className="mt-6 flex flex-col gap-6">
          {items.map((f) => (
            <div key={f.id} className="grid grid-cols-1 items-center gap-3 md:grid-cols-[8rem_1fr]">
              <p className="font-display text-[var(--text-md)]">{f.name}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {STRESS.map((s) => (
                  <Tile key={s.tone} tone={s.tone} className="h-20 gap-3" label={`${f.name} sobre ${s.name}`}>
                    <f.Mark className="h-10 w-10" />
                    <f.Mark className="h-6 w-6" />
                    <f.Mark className="h-4 w-4" />
                  </Tile>
                ))}
                <Tile tone="paper" className="h-20" label={`${f.name} desenfocado`}>
                  <f.Mark className="h-12 w-12" accent />
                  <span className="absolute inset-0" style={{ backdropFilter: 'blur(1.6px)' }} />
                </Tile>
              </div>
            </div>
          ))}
        </div>
        <p className="type-sm mt-3">De izquierda a derecha: papel, tinta, musgo, arcilla y desenfoque.</p>
    </>
  )
}

export default function LogoPage() {
  const survivors = CONCEPTS.filter((c) => c.verdict === 'sigue').length
  return (
    <div className="page-width">
      <PageHeader
        eyebrow="Apartado 02 · En validación"
        title="El logo, con método"
        deck={
          <>
            {CONCEPTS.length + HEX_CONCEPTS.length} ideas en tres rondas, una construcción común y una
            propuesta: el caparazón hexagonal. Se decide con la misma vara: <strong>¿se lee a 16 píxeles, en una tinta, sin
            explicación?</strong>
          </>
        }
      />

      <Part
        id="regla"
        n="01 · Regla"
        title="Una habitación y un animal"
        lead="Todos los candidatos comparten construcción para poder compararlos sin que decida el dibujo más vistoso. Si una idea necesita romper la regla para funcionar, cae."
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card">
            <h3 className="type-md">Una retícula</h3>
            <p className="mt-2">48 × 48, unidad de 4, suelo en y = 36. Todo cae en un múltiplo de 2.</p>
          </div>
          <div className="card">
            <h3 className="type-md">Un trazo</h3>
            <p className="mt-2">Grosor 3, extremos y uniones redondos. Nada relleno salvo el punto.</p>
          </div>
          <div className="card">
            <h3 className="type-md">Un punto</h3>
            <p className="mt-2">Es la tortuga y el único acento (el 10 del 60·30·10). Sin él, la marca sigue funcionando en una tinta.</p>
          </div>
        </div>
      </Part>

      <Part
        id="ronda-1"
        n="02 · Ronda 1"
        title={`${CONCEPTS.length} ideas, cinco rutas`}
        lead="Cada ruta es una manera distinta de decir «habitación tortuga». Se enseñan todas, también las que caen y por qué: una exploración que solo muestra lo que ganó no enseña nada."
      >
        <div className="flex flex-col gap-12">
          {ROUTES.map((r) => (
            <div key={r.key}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rule pb-2">
                <h3 className="type-lg">{r.name}</h3>
                <p className="type-sm">{r.idea}</p>
              </div>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {CONCEPTS.filter((c) => c.route === r.key).map(({ id, name, verdict, why, Mark }) => (
                  <li key={id} className="card !gap-3 !p-4">
                    <div className="flex items-center justify-between">
                      <span className="eyebrow">{id}</span>
                      <Badge status={verdict === 'sigue' ? 'progress' : 'locked'}>{verdict === 'sigue' ? 'Sigue' : 'Cae'}</Badge>
                    </div>
                    <Tile tone="paper" className="aspect-square" label={`${id} · ${name}`}>
                      <Mark className="h-2/3 w-2/3" />
                    </Tile>
                    <Tile tone="paper" className="h-12 gap-4" label={`${id} a 24 y 16 píxeles`}>
                      <Mark className="h-6 w-6" />
                      <Mark className="h-4 w-4" />
                    </Tile>
                    <div>
                      <p className="font-display text-[var(--text-md)]">{name}</p>
                      <p className="type-sm mt-1">{why}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Part>

      <Part
        id="ronda-2"
        n="03 · Ronda 2"
        title={`${survivors} finalistas de la primera vuelta`}
        lead="Cada finalista sobre su retícula, con las medidas que lo fijan. Si no se puede dibujar de memoria con estas cifras, no es un sistema, es un dibujo."
      >
        <Finalists items={FINALISTS} />
      </Part>

      <Part
        id="ronda-3"
        n="04 · Ronda 3"
        title="El caparazón, con hexágonos"
        lead="Decisión de dirección: que se vea el caparazón, con sus placas hexagonales. Catorce ideas nuevas con la misma regla, desde el hexágono solo hasta la cúpula teselada. Tres siguen."
      >
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HEX_CONCEPTS.map(({ id, name, verdict, why, Mark }: Concept) => (
            <li key={id} className="card !gap-3 !p-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow">{id}</span>
                <Badge status={verdict === 'sigue' ? 'progress' : 'locked'}>{verdict === 'sigue' ? 'Sigue' : 'Cae'}</Badge>
              </div>
              <Tile tone="paper" className="aspect-square" label={`${id} · ${name}`}>
                <Mark className="h-2/3 w-2/3" />
              </Tile>
              <Tile tone="paper" className="h-12 gap-4" label={`${id} a 24 y 16 píxeles`}>
                <Mark className="h-6 w-6" />
                <Mark className="h-4 w-4" />
              </Tile>
              <div>
                <p className="font-display text-[var(--text-md)]">{name}</p>
                <p className="type-sm mt-1">{why}</p>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="type-lg mt-14">Los tres que siguen, y Umbral como referencia</h3>
        <p className="mt-2 max-w-[62ch] text-ink-2">
          Construcción sobre la retícula y las mismas pruebas de estrés. La placa pequeña no es otra
          marca: es el mismo caparazón en otro tamaño óptico, como hace la tipografía.
        </p>
        <div className="mt-8"><Finalists items={HEX_FINALISTS} /></div>
      </Part>

      <Part
        id="banco"
        n="Banco de pruebas"
        title="Pruébalo tú"
        lead="Cambia la marca, el fondo, el tamaño y el nombre. Es la manera más rápida de ver si algo se rompe: arrastra el tamaño hasta 16."
      >
        <Playground />
      </Part>

      <Part
        id="nombre"
        n="05 · Ronda 4"
        title="El nombre al lado"
        lead="Sobre el caparazón de la ronda 3, seis maneras de escribir el nombre con Fraunces, la voz del sitio. La marca y el texto tienen que respirar juntos, no competir."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {LOCKUPS.map((l) => (
            <article key={l.id} className="card !gap-3">
              <div className="flex items-baseline justify-between">
                <h3 className="type-md">{l.name}</h3>
                <span className="eyebrow">{l.id}</span>
              </div>
              <Tile tone="paper" className="min-h-40 px-4 py-8">
                <Lockup Mark={Brand} variant={l.id} />
              </Tile>
              <Tile tone="ink" className="min-h-40 px-4 py-8">
                <Lockup Mark={Brand} variant={l.id} />
              </Tile>
              <p className="type-sm">{l.note}</p>
            </article>
          ))}
        </div>
      </Part>

      <Part
        id="propuesta"
        n="06 · Propuesta"
        title="El caparazón hexagonal, en dos tamaños"
        lead="Es la propuesta, no la decisión: cambia la marca de Alberto y de Javi y del equipo IA de ThePower Education, y la tienen que ver ellos."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Comparativa de los finalistas por criterio</caption>
            <thead>
              <tr className="border-b border-rule">
                <th scope="col" className="py-2 pr-4 eyebrow">Criterio</th>
                {HEX_FINALISTS.map((f) => (
                  <th key={f.id} scope="col" className="py-2 pr-4 font-display text-[var(--text-md)]">{f.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((c, i) => (
                <tr key={c} className="border-b border-rule">
                  <th scope="row" className="py-2 pr-4 font-normal">{c}</th>
                  {HEX_FINALISTS.map((f) => (
                    <td key={f.id} className="py-2 pr-4 font-mono tracking-widest" aria-label={`${f.scores[i]} de 3`}>
                      {dots(f.scores[i])}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-2 pr-4 font-normal"><strong>Total</strong></th>
                {HEX_FINALISTS.map((f) => (
                  <td key={f.id} className="py-2 pr-4 font-mono"><strong>{f.scores.reduce((a, b) => a + b, 0)} / 18</strong></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-4">
            <p>
              <strong>Por puntos, Umbral sigue por delante (15 frente a 14); por identidad gana el
              caparazón.</strong> Umbral aguanta mejor a 16 px, pero solo dice «habitación». La marca se
              llama Tortuga: la placa hexagonal es lo único de todo el proceso que se reconoce como
              tortuga y como marca propia a la vez.
            </p>
            <p>
              Por eso la propuesta es la <strong>Placa</strong> como marca principal y la
              <strong> Placa pequeña</strong> por debajo de 24 px. El <strong>Panal</strong> queda como
              ilustración grande, y <strong>Umbral</strong> como símbolo secundario para la idea de
              «habitación». Es una decisión de dirección tuya; los números dicen que es un empate
              técnico.
            </p>
          </div>
          <Tile tone="paper" className="min-h-48 p-6">
            <Lockup Mark={Brand} variant="apilado" />
          </Tile>
        </div>
      </Part>
    </div>
  )
}
