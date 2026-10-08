import type { ReactNode } from 'react'
import { SPECS, hex, type Spec, type SpecKey } from './geometry'

// Shared construction rule for every candidate (documented in /marca/logo):
//   · 48×48 grid, unit 4, floor line at y = 36
//   · one stroke weight (3), round caps and joins, nothing filled but the dot
//   · the dot is the only accent: one turtle, alone, in the room
// Stroke follows `currentColor`; the dot follows `--logo-accent`, which falls
// back to the site's moss accent.

export const STROKE = 3

export interface MarkProps {
  className?: string
  /** Paint the dot in the accent. When false the whole mark is one colour. */
  accent?: boolean
}

export type Mark = (p: MarkProps) => ReactNode

function Frame({ className, accent = true, children }: MarkProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ ['--dot' as string]: accent ? 'var(--logo-accent, var(--color-accent))' : 'currentColor' }}
    >
      <g stroke="currentColor" strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

const Dot = ({ cx, cy, r = 3.5, className }: { cx: number; cy: number; r?: number; className?: string }) => (
  <circle className={className} cx={cx} cy={cy} r={r} fill="var(--dot)" stroke="none" />
)

const make = (body: ReactNode): Mark =>
  function MarkImpl(p) {
    return <Frame {...p}>{body}</Frame>
  }

/* ── Ronda 1 · 5 rutas × 4 ideas ─────────────────────────────────────────── */

// U · Umbral: la habitación como arco de puerta
export const U1 = make(<><path d="M10 36V22a14 14 0 0 1 28 0v14M6 36H42" /><Dot cx={24} cy={31} /></>)
export const U2 = make(<><path d="M10 36V22a14 14 0 0 1 28 0v14" /><Dot cx={24} cy={32} /></>)
export const U3 = make(<><path d="M10 36V22a14 14 0 0 1 28 0v4M6 36H42" /><Dot cx={41} cy={31} r={3} /></>)
export const U4 = make(<><path d="M8 38V22a16 16 0 0 1 32 0v16M17 38V26a7 7 0 0 1 14 0v12" /><Dot cx={24} cy={34} r={2.5} /></>)

// C · Caparazón: la tortuga literal
export const C1 = make(<><path d="M6 36a16 16 0 0 1 32 0ZM14 36V22.1M30 36V22.1" /><Dot cx={43} cy={32.5} r={3} /></>)
export const C2 = make(<><path d="M6 36a16 16 0 0 1 32 0ZM22 20v6M22 26l-8 5v5M22 26l8 5v5" /><Dot cx={43} cy={32.5} r={3} /></>)
export const C3 = make(<><path d="M7 32a15 15 0 0 1 30 0ZM14 32v6M30 32v6" /><Dot cx={42.5} cy={29.5} r={3.5} /></>)
export const C4 = make(<><path d="M6 36a16 16 0 0 1 32 0ZM13 36a9 9 0 0 1 18 0" /><Dot cx={43} cy={32.5} r={3} /></>)

// R · Habitación: el cuarto
export const R1 = make(<><path d="M19 38H10V10h28v28h-9" /><Dot cx={24} cy={38} /></>)
export const R2 = make(<><path d="M10 10v28h28" /><Dot cx={27} cy={32} /></>)
export const R3 = make(<><path d="M10 38V10h28v28M19 38V30a5 5 0 0 1 10 0v8" /><Dot cx={24} cy={34} r={2} /></>)
export const R4 = make(<><rect x="10" y="10" width="28" height="28" rx="6" /><Dot cx={24} cy={31} /></>)

// M · Monograma: la letra como espacio
export const M1 = make(<><path d="M12 10v28M36 10v28M12 30h24" /><Dot cx={24} cy={25} /></>)
export const M2 = make(<><path d="M12 38V22a12 12 0 0 1 24 0v16M12 31h24" /><Dot cx={24} cy={26} /></>)
export const M3 = make(<><path d="M12 10v28M36 10v16M12 31h24" /><Dot cx={36} cy={34} r={3} /></>)
export const M4 = make(<><path d="M8 10h32M24 10v28" /><Dot cx={33} cy={32} /></>)

// P · Paso: la lentitud como ritmo
export const P1 = make(<><path d="M6 36h36" /><circle cx="9" cy="29" r="2" fill="currentColor" stroke="none" /><circle cx="19" cy="29" r="2" fill="currentColor" stroke="none" /><circle cx="27" cy="29" r="2" fill="currentColor" stroke="none" /><Dot cx={39} cy={29} /></>)
export const P2 = make(<><path d="M6 36a18 18 0 0 1 36 0" strokeDasharray="0.1 7" /><Dot cx={42} cy={36} /></>)
export const P3 = make(<><path d="M24 24a4 4 0 1 1 4 4 8 8 0 1 1-8-8 12 12 0 1 1 12 12" /><Dot cx={24} cy={24} r={2.5} /></>)
export const P4 = make(<><path d="M6 38h9v-7h9v-7h9v-7" /><Dot cx={39} cy={12} /></>)

/* ── Ronda 2 · los finalistas, afinados tras verlos dibujados ─────────────── */

// U1 sobre suelo largo se leía como una campana de cocina: el suelo pasa a ras de los muros.
export const U1b = make(<><path d="M10 36V22a14 14 0 0 1 28 0v14Z" /><Dot cx={24} cy={31} /></>)
// U3 con el mismo suelo a ras; el hueco queda a la derecha y el punto sale por él.
export const U3b = make(<><path d="M38 26V22a14 14 0 0 0-28 0v14h28" /><Dot cx={41.5} cy={31} r={3} /></>)
// C1 reconocible como tortuga, pero la cabeza se perdía: se pega al caparazón y se añaden patas en los extremos.
export const C1b = make(<><path d="M5 34a16 16 0 0 1 32 0ZM13 34V20.1M29 34V20.1M9 34v5M33 34v5" /><Dot cx={41.5} cy={31.5} r={3.5} /></>)

export type Verdict = 'sigue' | 'cae'

export interface Concept {
  id: string
  route: 'U' | 'C' | 'R' | 'M' | 'P' | 'H'
  name: string
  verdict: Verdict
  why: string
  Mark: Mark
}

export const ROUTES: { key: Concept['route']; name: string; idea: string }[] = [
  { key: 'U', name: 'Umbral', idea: 'La habitación como arco de puerta, con alguien dentro.' },
  { key: 'C', name: 'Caparazón', idea: 'La tortuga literal, reducida a lo mínimo.' },
  { key: 'R', name: 'Cuarto', idea: 'El espacio en planta o en esquina; la puerta como gesto.' },
  { key: 'M', name: 'Monograma', idea: 'La H de Habitación como dos muros y un suelo.' },
  { key: 'P', name: 'Paso', idea: 'La lentitud como ritmo, no como animal.' },
]

export const CONCEPTS: Concept[] = [
  { id: 'U1', route: 'U', name: 'Arco y suelo', verdict: 'sigue', why: 'Se lee a 16 px y en una tinta. Pero con el suelo largo parece una campana de cocina: hay que afinarlo.', Mark: U1 },
  { id: 'U2', route: 'U', name: 'Arco sin suelo', verdict: 'cae', why: 'Sin suelo el punto flota; se pierde la idea de estar dentro.', Mark: U2 },
  { id: 'U3', route: 'U', name: 'Puerta entornada', verdict: 'sigue', why: 'La única que cuenta movimiento: el punto sale por el lado abierto. Mismo problema de campana que U1.', Mark: U3 },
  { id: 'U4', route: 'U', name: 'Doble arco', verdict: 'cae', why: 'A 16 px los dos arcos se empastan y el punto desaparece.', Mark: U4 },
  { id: 'C1', route: 'C', name: 'Tres escudos', verdict: 'sigue', why: 'De todas, la que más se lee como tortuga. Le falta anclar la cabeza y darle patas.', Mark: C1 },
  { id: 'C2', route: 'C', name: 'Escudos en Y', verdict: 'cae', why: 'Demasiado fino para el grosor del sistema; parece un paraguas.', Mark: C2 },
  { id: 'C3', route: 'C', name: 'Silueta con patas', verdict: 'cae', why: 'Cúpula con dos patas centrales: es una seta. Sin escudos no hay tortuga.', Mark: C3 },
  { id: 'C4', route: 'C', name: 'Anillos', verdict: 'cae', why: 'Un arco dentro de otro: icono de wifi.', Mark: C4 },
  { id: 'R1', route: 'R', name: 'Cuarto abierto', verdict: 'cae', why: 'Limpio pero genérico: podría ser la marca de cualquier producto.', Mark: R1 },
  { id: 'R2', route: 'R', name: 'Esquina', verdict: 'cae', why: 'Una L con un punto; sin contexto no se lee como habitación.', Mark: R2 },
  { id: 'R3', route: 'R', name: 'Cuarto con puerta', verdict: 'cae', why: 'Se parece a una señal de servicios.', Mark: R3 },
  { id: 'R4', route: 'R', name: 'Cuadrado y punto', verdict: 'cae', why: 'Icono de app genérico. No cuenta nada.', Mark: R4 },
  { id: 'M1', route: 'M', name: 'H-habitación', verdict: 'sigue', why: 'Dos muros, un suelo bajo y el punto encima: es letra y es lugar. Lleva la inicial.', Mark: M1 },
  { id: 'M2', route: 'M', name: 'H con arco', verdict: 'cae', why: 'Se lee como una A, no como una H.', Mark: M2 },
  { id: 'M3', route: 'M', name: 'H entornada', verdict: 'cae', why: 'Un muro corto se lee como error de dibujo, no como puerta.', Mark: M3 },
  { id: 'M4', route: 'M', name: 'T sola', verdict: 'cae', why: 'La inicial de Tortuga sin las otras dos no es la marca.', Mark: M4 },
  { id: 'P1', route: 'P', name: 'Puntos que frenan', verdict: 'cae', why: 'Se lee como barra de progreso.', Mark: P1 },
  { id: 'P2', route: 'P', name: 'Trayectoria', verdict: 'cae', why: 'Puntos en arco: parece una señal de radio.', Mark: P2 },
  { id: 'P3', route: 'P', name: 'Espiral', verdict: 'cae', why: 'Es un caracol, no una tortuga.', Mark: P3 },
  { id: 'P4', route: 'P', name: 'Escalones', verdict: 'cae', why: 'Escalera ascendente: crecimiento y hype, justo lo contrario de «despacio».', Mark: P4 },
]

/* ── Ronda 3 · caparazón hexagonal (geometría en geometry.ts) ────────────── */

function fromSpec(key: SpecKey): Mark {
  const s: Spec = SPECS[key]
  const id = `lht-clip-${key}`
  return function SpecMark(p) {
    return (
      <Frame {...p}>
        {s.clip && (
          <clipPath id={id}>
            <path d={s.clip} />
          </clipPath>
        )}
        {s.inner && (
          <g clipPath={`url(#${id})`}>
            <path d={s.inner} />
          </g>
        )}
        <path d={s.outer} />
        {s.dotHex ? <path d={hex(s.dot[0], s.dot[1], s.dot[2])} fill="var(--dot)" stroke="none" /> : <Dot cx={s.dot[0]} cy={s.dot[1]} r={s.dot[2]} />}
      </Frame>
    )
  }
}

export const X = Object.fromEntries((Object.keys(SPECS) as SpecKey[]).map((k) => [k, fromSpec(k)])) as Record<SpecKey, Mark>

/** The mark the lab proposes. Everything that shows "the brand" reads this. */
export const Brand: Mark = X.placa
/** Optical size for 24 px and under: same shell, no legs. */
export const BrandSmall: Mark = X.placaPequena

export const HEX_CONCEPTS: Concept[] = [
  { id: 'H1', route: 'H', name: 'Hexágono y punto', verdict: 'cae', why: 'Una tuerca. Sin cúpula no hay caparazón.', Mark: X.hexSolo },
  { id: 'H2', route: 'H', name: 'Panal de tres', verdict: 'cae', why: 'Se lee bien pequeño, pero es una molécula, no una tortuga.', Mark: X.panalCenital },
  { id: 'H3', route: 'H', name: 'Cúpula con radios', verdict: 'cae', why: 'La placa es buena idea; los radios se empastan.', Mark: X.cupulaRadios },
  { id: 'H4', route: 'H', name: 'Trapecio', verdict: 'cae', why: 'Media placa plana: parece una mesa.', Mark: X.trapecio },
  { id: 'H5', route: 'H', name: 'Hexágono doble', verdict: 'cae', why: 'Diana con forma de tuerca.', Mark: X.hexDoble },
  { id: 'H6', route: 'H', name: 'Cúpula de placas', verdict: 'cae', why: 'Un iglú.', Mark: X.iglu },
  { id: 'H7', route: 'H', name: 'Cúpula con tallo', verdict: 'cae', why: 'El tallo la convierte en un volante.', Mark: X.cupulaTallo },
  { id: 'H8', route: 'H', name: 'Arco con punto hexagonal', verdict: 'cae', why: 'Un punto hexagonal deja de leerse como punto; y la tortuga sigue sin verse.', Mark: X.arcoHexDot },
  { id: 'H9', route: 'H', name: 'Teselado grande', verdict: 'cae', why: 'Una cúpula geodésica.', Mark: X.tesela10 },
  { id: 'H10', route: 'H', name: 'Teselado mayor', verdict: 'cae', why: 'Un paraguas.', Mark: X.tesela12 },
  { id: 'H11', route: 'H', name: 'Teselado con patas', verdict: 'cae', why: 'Un paraguas con patas.', Mark: X.teselaPatas },
  { id: 'H12', route: 'H', name: 'Placa central', verdict: 'sigue', why: 'Placa hexagonal y cuatro juntas: el caparazón real. Sin patas aguanta 16 px.', Mark: X.placaPequena },
  { id: 'H13', route: 'H', name: 'Placa con patas', verdict: 'sigue', why: 'La más tortuga de todas. Las patas piden 24 px o más.', Mark: X.placa },
  { id: 'H14', route: 'H', name: 'Panal en cúpula', verdict: 'sigue', why: 'La más hexagonal y con más carácter; a 16 px es una textura.', Mark: X.panal },
]
