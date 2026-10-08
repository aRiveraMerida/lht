import Link from 'next/link'
import { HeroStage } from '@/components/marca/HeroStage'
import { Badge } from '@/components/tortuga'
import { Brand, BrandSmall, CONCEPTS, HEX_CONCEPTS } from '@/components/marca/marks'
import { Lockup, Part, Tile } from '@/components/marca/shared'

type Status = 'done' | 'progress' | 'locked'

const PHASES: { n: string; label: string; status: Status; state: string; href?: string; note: string }[] = [
  { n: '01', label: 'Concepto', status: 'progress', state: 'En validación', href: '/marca', note: 'Una habitación y un animal. Lentitud como criterio, no como estética.' },
  { n: '02', label: 'Logo', status: 'progress', state: 'Falta tu sí', href: '/marca/logo', note: '34 ideas en tres rondas y una propuesta: el caparazón hexagonal.' },
  { n: '03', label: 'Color y tipo', status: 'done', state: 'Decidido', href: '/marca/sistema', note: 'Tortuga: papel, tinta y musgo. La arcilla, pendiente de Alberto.' },
  { n: '04', label: 'Identidad', status: 'progress', state: 'En construcción', href: '/marca/identidad', note: 'Espacio de respeto, usos incorrectos, aplicaciones y SVG.' },
  { n: '05', label: 'Movimiento', status: 'progress', state: 'En construcción', href: '/marca/movimiento', note: 'Despacio, una vez y quietud.' },
  { n: '06', label: 'En el sitio', status: 'locked', state: 'Pendiente', note: 'Sustituir TurtleLogo.tsx y el favicon. Solo tras el sí de Alberto.' },
]

const DECISIONS: { q: string; a: string; status: Status; state: string }[] = [
  { q: '¿La marca dice «tortuga» o dice «habitación»?', a: 'Tortuga, con su caparazón hexagonal. La «habitación» queda en Umbral, como símbolo secundario.', status: 'progress', state: 'Propuesto' },
  { q: '¿Cuántos colores?', a: 'Uno que señala. Papel y tinta dominan, el musgo solo marca.', status: 'done', state: 'Decidido' },
  { q: '¿Con nombre o sin él?', a: 'Símbolo solo en favicon y avatar; con nombre en cabecera y documentos.', status: 'progress', state: 'Propuesto' },
  { q: '¿Un símbolo o dos tamaños?', a: 'Uno: la Placa, con una versión pequeña sin patas para 24 px o menos. Mismo dibujo, otro tamaño óptico.', status: 'progress', state: 'Propuesto' },
]

export default function MarcaHub() {
  return (
    <div className="page-width">
      <div className="pt-8"><HeroStage /></div>

      <section aria-labelledby="ruta" className="py-10">
        <h2 id="ruta" className="sr-only">Ruta</h2>
        <ol className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-6">
          {PHASES.map((p) => (
            <li key={p.n} className="flex flex-col gap-2 border-t border-rule pt-3">
              <span className="eyebrow">{p.n}</span>
              <p className="font-display text-[var(--text-md)] leading-tight">
                {p.href ? (
                  <Link href={p.href} className="no-underline hover:underline">{p.label}</Link>
                ) : (
                  p.label
                )}
              </p>
              <Badge status={p.status}>{p.state}</Badge>
              <p className="type-sm">{p.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <Part
        id="propuesta"
        n="Propuesta actual"
        title="Caparazón hexagonal"
        lead="Un caparazón con su placa central y las juntas hasta el borde, patas y una cabeza que es el punto. En dos tamaños ópticos: con patas y sin ellas."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.3fr_1fr]">
          <Tile tone="paper" className="min-h-72 p-8">
            <Lockup Mark={Brand} variant="apilado" />
          </Tile>
          <div className="grid grid-cols-2 gap-4">
            <Tile tone="ink" className="aspect-square"><Brand className="h-2/3 w-2/3" /></Tile>
            <Tile tone="moss" className="aspect-square"><Brand className="h-2/3 w-2/3" accent={false} /></Tile>
            <Tile tone="clay" className="aspect-square"><Brand className="h-2/3 w-2/3" /></Tile>
            <Tile tone="paper2" className="aspect-square gap-3">
              <BrandSmall className="h-8 w-8" />
              <BrandSmall className="h-4 w-4" />
            </Tile>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          <Link href="/marca/logo" className="font-medium">Ver las {CONCEPTS.length + HEX_CONCEPTS.length} ideas y los finalistas →</Link>
          <Link href="/marca/identidad" className="font-medium">Ver aplicaciones →</Link>
        </div>
      </Part>

      <Part id="decisiones" n="Decisiones" title="Lo que hay que fijar">
        <ul className="divide-y divide-rule border-y border-rule">
          {DECISIONS.map((d) => (
            <li key={d.q} className="grid grid-cols-1 items-baseline gap-2 py-4 md:grid-cols-[1fr_1.4fr_auto]">
              <strong>{d.q}</strong>
              <span className="text-ink-2">{d.a}</span>
              <Badge status={d.status}>{d.state}</Badge>
            </li>
          ))}
        </ul>
      </Part>

      <Part id="nota" n="Antes de publicar" title="No es una decisión técnica">
        <p className="max-w-[62ch] text-ink-2">
          Este repo es de Alberto y la marca es de Alberto y de Javi, y del equipo IA de ThePower
          Education, que es de quien el sitio dice ser. Por eso esta página no está enlazada, no se
          indexa y no toca <code>TurtleLogo.tsx</code> ni el favicon. Se propone; se decide entre los dos.
        </p>
      </Part>
    </div>
  )
}
