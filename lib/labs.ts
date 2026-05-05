export type GuideKind =
  | 'prework'
  | 'module'
  | 'capstone'
  | 'reference'
  | 'cert'
  | 'part'

export interface Guide {
  slug: string
  title: string
  kicker: string
  blockId: string
  kind: GuideKind
  order: number
  mandatory?: boolean
  duration?: string
  lines?: number
}

export interface Block {
  id: string
  kicker: string
  title: string
  description?: string
  connection?: string
  guides: Guide[]
}

export interface Lab {
  slug: string
  title: string
  summary: string
  urlBase: string
  stats: {
    updated: string
    blocks: number
    guides: number
  }
  blocks: Block[]
  sequence: Guide[]
}

// ─── Claude Code ────────────────────────────────────────────────────────────

const ccPrework: Guide[] = [
  { slug: 'prework-checklist', title: 'Checklist general de prework', kicker: 'Prework · 00', blockId: 'prework', kind: 'prework', order: 1, lines: 500 },
  { slug: 'prework-terminal', title: 'Terminal / CLI', kicker: 'Prework · 01', blockId: 'prework', kind: 'prework', order: 2, mandatory: true, lines: 275 },
  { slug: 'prework-git', title: 'Git', kicker: 'Prework · 02', blockId: 'prework', kind: 'prework', order: 3, mandatory: true, lines: 322 },
  { slug: 'prework-nodejs-npm', title: 'Node.js y npm', kicker: 'Prework · 03', blockId: 'prework', kind: 'prework', order: 4, mandatory: true, lines: 430 },
  { slug: 'prework-javascript', title: 'JavaScript básico', kicker: 'Prework · 04', blockId: 'prework', kind: 'prework', order: 5, mandatory: true, lines: 451 },
  { slug: 'prework-api-rest', title: 'API REST (conceptos)', kicker: 'Prework · 05', blockId: 'prework', kind: 'prework', order: 6, mandatory: true, lines: 411 },
  { slug: 'prework-github-cli', title: 'GitHub y GitHub CLI', kicker: 'Prework · 06', blockId: 'prework', kind: 'prework', order: 7, mandatory: true, lines: 141 },
  { slug: 'prework-editor', title: 'Editor de código', kicker: 'Prework · 07', blockId: 'prework', kind: 'prework', order: 8, mandatory: true, lines: 82 },
  { slug: 'prework-claude-code', title: 'Claude Code (instalación)', kicker: 'Prework · 08', blockId: 'prework', kind: 'prework', order: 9, mandatory: true, lines: 110 },
  { slug: 'prework-primer-contacto', title: 'Primer contacto con el agente', kicker: 'Prework · 09', blockId: 'prework', kind: 'prework', order: 10, mandatory: true, lines: 316 },
  { slug: 'prework-opcionales', title: 'Python + SQL (opcionales)', kicker: 'Prework · 10–11', blockId: 'prework', kind: 'prework', order: 11, mandatory: false, lines: 190 },
]

const ccBloqueI: Guide[] = [
  { slug: 'modelo-mental', title: 'Modelo mental y primera configuración', kicker: 'M1 · Fundamentos', blockId: 'fundamentos', kind: 'module', order: 12, duration: '4-5h', lines: 975 },
  { slug: 'workflow', title: 'Workflow EXPLORE → PLAN → CODE → COMMIT', kicker: 'M2 · Fundamentos', blockId: 'fundamentos', kind: 'module', order: 13, duration: '5-6h', lines: 1346 },
  { slug: 'tdd', title: 'TDD con Claude Code', kicker: 'M3 · Fundamentos', blockId: 'fundamentos', kind: 'module', order: 14, duration: '5-6h', lines: 1495 },
]

const ccBloqueII: Guide[] = [
  { slug: 'arquitectura', title: 'Arquitectura de CLAUDE.md profesional', kicker: 'M4 · Configuración', blockId: 'configuracion', kind: 'module', order: 15, duration: '5-6h', lines: 1154 },
  { slug: 'skills-plugins', title: 'Skills, plugins y ecosistema extensible', kicker: 'M5 · Configuración', blockId: 'configuracion', kind: 'module', order: 16, duration: '5-6h', lines: 940 },
  { slug: 'slash-commands-hooks', title: 'Slash commands y hooks personalizados', kicker: 'M6 · Configuración', blockId: 'configuracion', kind: 'module', order: 17, duration: '5-6h', lines: 1046 },
]

const ccBloqueIII: Guide[] = [
  { slug: 'ralph-wiggum', title: 'Metodología Ralph Wiggum', kicker: 'M7 · Agentes', blockId: 'agentes', kind: 'module', order: 18, duration: '6-7h', lines: 1139 },
  { slug: 'multi-claude', title: 'Multi-Claude workflows y Agent Teams', kicker: 'M8 · Agentes', blockId: 'agentes', kind: 'module', order: 19, duration: '5-6h', lines: 773 },
  { slug: 'subagentes', title: 'Subagentes y Agent SDK', kicker: 'M9 · Agentes', blockId: 'agentes', kind: 'module', order: 20, duration: '5-6h', lines: 790 },
]

const ccBloqueIV: Guide[] = [
  { slug: 'harnesses', title: 'Harnesses de larga duración', kicker: 'M10 · Producción', blockId: 'produccion', kind: 'module', order: 21, duration: '5-6h', lines: 856 },
  { slug: 'evals', title: 'Sistema de evaluaciones (Evals)', kicker: 'M11 · Producción', blockId: 'produccion', kind: 'module', order: 22, duration: '5-6h', lines: 742 },
  { slug: 'cicd', title: 'Operacionalización: RTK y CI/CD', kicker: 'M12 · Producción', blockId: 'produccion', kind: 'module', order: 23, duration: '5-6h', lines: 765 },
  { slug: 'cicd-avanzado', title: 'CI/CD avanzado y producción', kicker: 'M13 · Producción', blockId: 'produccion', kind: 'module', order: 24, duration: '5-6h', lines: 754 },
]

const ccCapstone: Guide[] = [
  { slug: 'proyectos-capstone', title: 'Proyectos capstone (P1–P5)', kicker: 'Capstone', blockId: 'capstone', kind: 'capstone', order: 25, lines: 1010 },
]

const ccComplementarios: Guide[] = [
  { slug: 'glosario', title: 'Glosario', kicker: 'Referencia', blockId: 'referencia', kind: 'reference', order: 26 },
  { slug: 'quick-reference', title: 'Quick reference', kicker: 'Referencia', blockId: 'referencia', kind: 'reference', order: 27 },
]

const ccBlocks: Block[] = [
  { id: 'prework', kicker: 'Prework', title: 'Preparación', description: '11 áreas de base (terminal, git, Node, JS, API, GitHub, editor, Claude Code). 1–9 obligatorias, 10–11 opcionales.', guides: ccPrework },
  { id: 'fundamentos', kicker: 'Bloque I', title: 'Fundamentos', description: 'Del modelo mental al TDD. La cimentación del laboratorio.', connection: 'M1 modelo mental → M2 workflow aplicado → M3 auto-verificación como TDD', guides: ccBloqueI },
  { id: 'configuracion', kicker: 'Bloque II', title: 'Configuración profesional', description: 'CLAUDE.md, skills, plugins, slash commands y hooks.', connection: 'M4 organiza contexto → M5 extiende capacidades → M6 automatiza acciones', guides: ccBloqueII },
  { id: 'agentes', kicker: 'Bloque III', title: 'Agentes avanzados', description: 'Loops autónomos, workflows paralelos y control programático.', connection: 'M7 loops autónomos → M8 paralelismo → M9 control programático por agente', guides: ccBloqueIII },
  { id: 'produccion', kicker: 'Bloque IV', title: 'Producción', description: 'Harnesses, evals, CI/CD y operacionalización.', connection: 'M10 agentes multi-día → M11 mide calidad → M12 optimiza costos + CI → M13 producción', guides: ccBloqueIV },
  { id: 'capstone', kicker: 'Bloque V', title: 'Proyectos capstone', description: 'Cinco proyectos aplicados: TaskFlow, PriceWatch, NoteHub, TeamPulse, FeedbackLoop.', guides: ccCapstone },
  { id: 'referencia', kicker: 'Referencia', title: 'Documentos complementarios', description: 'Glosario y quick reference.', guides: ccComplementarios },
]

const ccSequence = ccBlocks.flatMap((b) => b.guides)
ccSequence.forEach((g, i) => { g.order = i + 1 })

// ─── Campaign Hub ───────────────────────────────────────────────────────────

const chParts: Guide[] = [
  { slug: 'introduccion', title: 'Introducción', kicker: 'Parte 0', blockId: 'campaign-hub', kind: 'part', order: 1, duration: '10 min lectura' },
  { slug: 'conceptos', title: 'Conceptos y vocabulario', kicker: 'Parte 1', blockId: 'campaign-hub', kind: 'part', order: 2, duration: '15 min lectura' },
  { slug: 'preparar-google', title: 'Preparar Google', kicker: 'Parte 2', blockId: 'campaign-hub', kind: 'part', order: 3, duration: '30 min práctica' },
  { slug: 'apps-script-agentes', title: 'Los 4 agentes en Apps Script', kicker: 'Parte 3', blockId: 'campaign-hub', kind: 'part', order: 4, duration: '45 min práctica' },
  { slug: 'claude-code-skill', title: 'Claude Code y la skill', kicker: 'Parte 4', blockId: 'campaign-hub', kind: 'part', order: 5, duration: '45 min práctica' },
  { slug: 'probar-end-to-end', title: 'Probar end-to-end', kicker: 'Parte 5', blockId: 'campaign-hub', kind: 'part', order: 6, duration: '30 min práctica' },
  { slug: 'customizar-casos', title: 'Customizar a otros casos', kicker: 'Parte 6', blockId: 'campaign-hub', kind: 'part', order: 7, duration: '30-60 min práctica' },
]

const chBlocks: Block[] = [
  {
    id: 'campaign-hub',
    kicker: 'Las 7 partes',
    title: 'Recorrido completo',
    description:
      'De cero a un sistema funcionando: Google Sheets + Apps Script + Claude Code automatizando el ciclo entero de producción de campañas.',
    guides: chParts,
  },
]

const chSequence = chBlocks.flatMap((b) => b.guides)

// ─── Registro ───────────────────────────────────────────────────────────────

export const labs: Record<string, Lab> = {
  'claude-code': {
    slug: 'claude-code',
    title: 'Laboratorio de Claude Code',
    summary:
      'Un recorrido completo en español por Claude Code: prework, 4 bloques temáticos (fundamentos, configuración, agentes y producción) y proyectos capstone.',
    urlBase: '/blog/claude-code',
    stats: {
      updated: 'Abril 2026',
      blocks: ccBlocks.length,
      guides: ccSequence.length,
    },
    blocks: ccBlocks,
    sequence: ccSequence,
  },
  'campaign-hub': {
    slug: 'campaign-hub',
    title: 'Laboratorio Campaign Hub — Google + Claude Code',
    summary:
      'Un laboratorio práctico de 7 partes para montar un sistema que automatiza el ciclo completo de producción de campañas con Google Sheets + Apps Script + Claude Code. Caso ficticio, código copiable, ~4h la primera vez.',
    urlBase: '/blog/campaign-hub',
    stats: {
      updated: 'Abril 2026',
      blocks: chBlocks.length,
      guides: chSequence.length,
    },
    blocks: chBlocks,
    sequence: chSequence,
  },
}

export const labList: Lab[] = Object.values(labs)

export function getLab(slug: string): Lab | null {
  return labs[slug] ?? null
}

export function getLabGuide(labSlug: string, guideSlug: string): Guide | null {
  const lab = getLab(labSlug)
  if (!lab) return null
  return lab.sequence.find((g) => g.slug === guideSlug) ?? null
}

export function getLabAdjacent(
  labSlug: string,
  guideSlug: string,
): { prev: Guide | null; next: Guide | null } {
  const lab = getLab(labSlug)
  if (!lab) return { prev: null, next: null }
  const idx = lab.sequence.findIndex((g) => g.slug === guideSlug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? lab.sequence[idx - 1] : null,
    next: idx < lab.sequence.length - 1 ? lab.sequence[idx + 1] : null,
  }
}

export function getLabBlockOf(labSlug: string, guideSlug: string): Block | null {
  const lab = getLab(labSlug)
  if (!lab) return null
  for (const b of lab.blocks) {
    if (b.guides.some((g) => g.slug === guideSlug)) return b
  }
  return null
}
