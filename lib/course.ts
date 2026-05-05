// Retro-compat: el contenido vivía aquí cuando sólo había un laboratorio
// (Claude Code). Ahora el registro está en lib/labs.ts.
import { labs } from './labs'

export type { Guide, Block, GuideKind } from './labs'

export const course = labs['claude-code']
export const blocks = course.blocks
export const sequence = course.sequence

export function getGuide(slug: string) {
  return sequence.find((g) => g.slug === slug) ?? null
}

export function getAdjacent(slug: string) {
  const idx = sequence.findIndex((g) => g.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? sequence[idx - 1] : null,
    next: idx < sequence.length - 1 ? sequence[idx + 1] : null,
  }
}

export function getBlockOf(slug: string) {
  for (const b of blocks) {
    if (b.guides.some((g) => g.slug === slug)) return b
  }
  return null
}
