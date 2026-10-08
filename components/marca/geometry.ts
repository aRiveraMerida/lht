// Single source of truth for the mark geometry (48×48 grid, stroke 3).
// Read by components/marca/marks.tsx and by the SVG export script, so the site
// and the downloadable files cannot drift apart.

export interface Spec {
  /** Stroked paths, drawn on top. */
  outer: string
  /** Stroked paths clipped to `clip` (tessellations). */
  inner?: string
  clip?: string
  /** The dot: cx, cy, r. */
  dot: [number, number, number]
  /** Draw the dot as a filled hexagon. */
  dotHex?: boolean
}

const f = (n: number) => +n.toFixed(2)

/** Pointy-top hexagon outline. */
export const hex = (cx: number, cy: number, r: number) =>
  'M' +
  Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180
    return `${f(cx + r * Math.cos(a))} ${f(cy + r * Math.sin(a))}`
  }).join('L') +
  'Z'

/** Half disc standing on `base`. */
export const dome = (cx: number, base: number, R: number) => `M${cx - R} ${base}a${R} ${R} 0 0 1 ${2 * R} 0Z`

/** Pointy-top honeycomb rows rising from `base`. */
export function tile(cx: number, base: number, r: number, oy = 0) {
  const w = Math.sqrt(3) * r
  const h = 1.5 * r
  let s = ''
  for (let row = -1; row < 4; row++) {
    const y = base - row * h - oy
    for (let col = -3; col <= 3; col++) s += hex(cx + col * w + (row % 2 ? w / 2 : 0), y, r)
  }
  return s
}

// Central plate + four joints reaching the dome (R 18, centre 20,35; hex r 7.5).
const joints = 'M13.5 23.75L11 19.4M13.5 31.25L4.4 26M26.5 23.75L29 19.4M26.5 31.25L35.6 26'
const legs = 'M9 35v5M31 35v5'

export const SPECS = {
  // ── Ronda 3 · exploración ────────────────────────────────────────────────
  hexSolo: { outer: hex(24, 24, 17), dot: [24, 24, 4] },
  panalCenital: { outer: hex(24, 17, 8) + hex(17.07, 29, 8) + hex(30.93, 29, 8), dot: [24, 25, 3.2] },
  cupulaRadios: { outer: dome(21, 36, 18) + hex(21, 28, 6.5) + 'M21 21.5V18M26.6 24.75L30.2 20M15.4 24.75L11.8 20', dot: [43.5, 33.5, 3.5] },
  trapecio: { outer: 'M3 36L12 19H30L39 36ZM16.5 19L14 36M25.5 19L28 36', dot: [43.5, 33, 3.5] },
  hexDoble: { outer: hex(24, 24, 17) + hex(24, 24, 7), dot: [24, 24, 2.2] },
  iglu: { outer: 'M3 36a18 18 0 0 1 36 0Z' + 'M12 36L15.5 24.5M30 36L26.5 24.5M15.5 24.5H26.5M15.5 24.5L21.5 18.2M26.5 24.5L21.5 18.2', dot: [43.5, 33.5, 3.5] },
  cupulaTallo: { outer: dome(21, 36, 18) + hex(21, 30, 5.5) + 'M21 24.5V18.5', dot: [43.5, 33.5, 3.5] },
  arcoHexDot: { outer: 'M10 36V22a14 14 0 0 1 28 0v14Z', dot: [24, 31, 4.6], dotHex: true },
  tesela10: { clip: dome(20, 37, 19), inner: tile(20, 37, 10, 2), outer: dome(20, 37, 19), dot: [44, 34, 3.5] },
  tesela12: { clip: dome(20, 37, 19), inner: tile(20, 37, 12, 4), outer: dome(20, 37, 19), dot: [44, 34, 3.5] },
  teselaPatas: { clip: dome(20, 35, 18), inner: tile(20, 35, 9, 1), outer: dome(20, 35, 18) + legs, dot: [43.5, 32, 3.5] },

  // ── Finalistas ───────────────────────────────────────────────────────────
  /** Placa: the shell with its central hexagonal plate, and legs. The main mark. */
  placa: { outer: dome(20, 35, 18) + hex(20, 27.5, 7.5) + joints + legs, dot: [43.5, 32, 3.5] },
  /** Placa, small: no legs, for 24 px and under. */
  placaPequena: { outer: dome(21, 37, 18.5) + hex(21, 29, 8) + 'M14.07 25L11.75 20.98M14.07 33L4.97 27.75M27.93 25L30.25 20.98M27.93 33L37.03 27.75', dot: [44.5, 34, 3] },
  /** Panal: three hexagonal plates inside the dome, and legs. */
  panal: { clip: dome(21, 36, 18.5), inner: hex(21, 22.5, 6.5) + hex(14.9, 33, 6.5) + hex(27.1, 33, 6.5), outer: dome(21, 36, 18.5) + 'M10 36v5M32 36v5', dot: [44.5, 33, 3.2] },
} satisfies Record<string, Spec>

export type SpecKey = keyof typeof SPECS
