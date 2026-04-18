export type GuideKind = 'prework' | 'module' | 'capstone' | 'reference' | 'cert'

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

const prework: Guide[] = [
  {
    slug: 'prework-checklist',
    title: 'Checklist general de prework',
    kicker: 'Prework · 00',
    blockId: 'prework',
    kind: 'prework',
    order: 1,
    lines: 500,
  },
  {
    slug: 'prework-terminal',
    title: 'Terminal / CLI',
    kicker: 'Prework · 01',
    blockId: 'prework',
    kind: 'prework',
    order: 2,
    mandatory: true,
    lines: 275,
  },
  {
    slug: 'prework-git',
    title: 'Git',
    kicker: 'Prework · 02',
    blockId: 'prework',
    kind: 'prework',
    order: 3,
    mandatory: true,
    lines: 322,
  },
  {
    slug: 'prework-nodejs-npm',
    title: 'Node.js y npm',
    kicker: 'Prework · 03',
    blockId: 'prework',
    kind: 'prework',
    order: 4,
    mandatory: true,
    lines: 430,
  },
  {
    slug: 'prework-javascript',
    title: 'JavaScript básico',
    kicker: 'Prework · 04',
    blockId: 'prework',
    kind: 'prework',
    order: 5,
    mandatory: true,
    lines: 451,
  },
  {
    slug: 'prework-api-rest',
    title: 'API REST (conceptos)',
    kicker: 'Prework · 05',
    blockId: 'prework',
    kind: 'prework',
    order: 6,
    mandatory: true,
    lines: 411,
  },
  {
    slug: 'prework-github-cli',
    title: 'GitHub y GitHub CLI',
    kicker: 'Prework · 06',
    blockId: 'prework',
    kind: 'prework',
    order: 7,
    mandatory: true,
    lines: 141,
  },
  {
    slug: 'prework-editor',
    title: 'Editor de código',
    kicker: 'Prework · 07',
    blockId: 'prework',
    kind: 'prework',
    order: 8,
    mandatory: true,
    lines: 82,
  },
  {
    slug: 'prework-claude-code',
    title: 'Claude Code (instalación)',
    kicker: 'Prework · 08',
    blockId: 'prework',
    kind: 'prework',
    order: 9,
    mandatory: true,
    lines: 110,
  },
  {
    slug: 'prework-primer-contacto',
    title: 'Primer contacto con el agente',
    kicker: 'Prework · 09',
    blockId: 'prework',
    kind: 'prework',
    order: 10,
    mandatory: true,
    lines: 316,
  },
  {
    slug: 'prework-opcionales',
    title: 'Python + SQL (opcionales)',
    kicker: 'Prework · 10–11',
    blockId: 'prework',
    kind: 'prework',
    order: 11,
    mandatory: false,
    lines: 190,
  },
]

const bloqueI: Guide[] = [
  {
    slug: 'modelo-mental',
    title: 'Modelo mental y primera configuración',
    kicker: 'M1 · Fundamentos',
    blockId: 'fundamentos',
    kind: 'module',
    order: 12,
    duration: '4-5h',
    lines: 975,
  },
  {
    slug: 'workflow',
    title: 'Workflow EXPLORE → PLAN → CODE → COMMIT',
    kicker: 'M2 · Fundamentos',
    blockId: 'fundamentos',
    kind: 'module',
    order: 13,
    duration: '5-6h',
    lines: 1346,
  },
  {
    slug: 'tdd',
    title: 'TDD con Claude Code',
    kicker: 'M3 · Fundamentos',
    blockId: 'fundamentos',
    kind: 'module',
    order: 14,
    duration: '5-6h',
    lines: 1495,
  },
]

const bloqueII: Guide[] = [
  {
    slug: 'arquitectura',
    title: 'Arquitectura de CLAUDE.md profesional',
    kicker: 'M4 · Configuración',
    blockId: 'configuracion',
    kind: 'module',
    order: 15,
    duration: '5-6h',
    lines: 1154,
  },
  {
    slug: 'skills-plugins',
    title: 'Skills, plugins y ecosistema extensible',
    kicker: 'M5 · Configuración',
    blockId: 'configuracion',
    kind: 'module',
    order: 16,
    duration: '5-6h',
    lines: 940,
  },
  {
    slug: 'slash-commands-hooks',
    title: 'Slash commands y hooks personalizados',
    kicker: 'M6 · Configuración',
    blockId: 'configuracion',
    kind: 'module',
    order: 17,
    duration: '5-6h',
    lines: 1046,
  },
]

const bloqueIII: Guide[] = [
  {
    slug: 'ralph-wiggum',
    title: 'Metodología Ralph Wiggum',
    kicker: 'M7 · Agentes',
    blockId: 'agentes',
    kind: 'module',
    order: 18,
    duration: '6-7h',
    lines: 1139,
  },
  {
    slug: 'multi-claude',
    title: 'Multi-Claude workflows y Agent Teams',
    kicker: 'M8 · Agentes',
    blockId: 'agentes',
    kind: 'module',
    order: 19,
    duration: '5-6h',
    lines: 773,
  },
  {
    slug: 'subagentes',
    title: 'Subagentes y Agent SDK',
    kicker: 'M9 · Agentes',
    blockId: 'agentes',
    kind: 'module',
    order: 20,
    duration: '5-6h',
    lines: 790,
  },
]

const bloqueIV: Guide[] = [
  {
    slug: 'harnesses',
    title: 'Harnesses de larga duración',
    kicker: 'M10 · Producción',
    blockId: 'produccion',
    kind: 'module',
    order: 21,
    duration: '5-6h',
    lines: 856,
  },
  {
    slug: 'evals',
    title: 'Sistema de evaluaciones (Evals)',
    kicker: 'M11 · Producción',
    blockId: 'produccion',
    kind: 'module',
    order: 22,
    duration: '5-6h',
    lines: 742,
  },
  {
    slug: 'cicd',
    title: 'Operacionalización: RTK y CI/CD',
    kicker: 'M12 · Producción',
    blockId: 'produccion',
    kind: 'module',
    order: 23,
    duration: '5-6h',
    lines: 765,
  },
  {
    slug: 'cicd-avanzado',
    title: 'CI/CD avanzado y producción',
    kicker: 'M13 · Producción',
    blockId: 'produccion',
    kind: 'module',
    order: 24,
    duration: '5-6h',
    lines: 754,
  },
]

const capstone: Guide[] = [
  {
    slug: 'proyectos-capstone',
    title: 'Proyectos capstone (P1–P5)',
    kicker: 'Capstone',
    blockId: 'capstone',
    kind: 'capstone',
    order: 25,
    lines: 1010,
  },
]

const complementarios: Guide[] = [
  {
    slug: 'glosario',
    title: 'Glosario',
    kicker: 'Referencia · 15',
    blockId: 'referencia',
    kind: 'reference',
    order: 26,
  },
  {
    slug: 'guia-alumno',
    title: 'Guía del alumno',
    kicker: 'Referencia · 16',
    blockId: 'referencia',
    kind: 'reference',
    order: 27,
  },
  {
    slug: 'quick-reference',
    title: 'Quick reference',
    kicker: 'Referencia · 17',
    blockId: 'referencia',
    kind: 'reference',
    order: 28,
  },
]

const certificacion: Guide[] = [
  {
    slug: 'cert-overview',
    title: 'Preparación para Claude Certified Architect',
    kicker: 'Cert · 18',
    blockId: 'certificacion',
    kind: 'cert',
    order: 29,
  },
  {
    slug: 'cert-agentic-architecture',
    title: 'C1 · Agentic Architecture',
    kicker: 'Cert · D1',
    blockId: 'certificacion',
    kind: 'cert',
    order: 30,
    lines: 558,
  },
  {
    slug: 'cert-tool-design-mcp',
    title: 'C2 · Tool Design & MCP',
    kicker: 'Cert · D2',
    blockId: 'certificacion',
    kind: 'cert',
    order: 31,
    lines: 429,
  },
  {
    slug: 'cert-claude-code-config',
    title: 'C3 · Claude Code Config',
    kicker: 'Cert · D3',
    blockId: 'certificacion',
    kind: 'cert',
    order: 32,
    lines: 323,
  },
  {
    slug: 'cert-prompt-engineering',
    title: 'C4 · Prompt Engineering',
    kicker: 'Cert · D4',
    blockId: 'certificacion',
    kind: 'cert',
    order: 33,
    lines: 331,
  },
  {
    slug: 'cert-context-reliability',
    title: 'C5 · Context & Reliability',
    kicker: 'Cert · D5',
    blockId: 'certificacion',
    kind: 'cert',
    order: 34,
    lines: 312,
  },
  {
    slug: 'cert-scenarios',
    title: 'C6 · Scenarios walkthroughs',
    kicker: 'Cert · D6',
    blockId: 'certificacion',
    kind: 'cert',
    order: 35,
    lines: 330,
  },
  {
    slug: 'cert-exam-simulator',
    title: 'C7 · Simulacro 1 (50 preguntas)',
    kicker: 'Cert · Sim 1',
    blockId: 'certificacion',
    kind: 'cert',
    order: 36,
    lines: 501,
  },
  {
    slug: 'cert-strategy-simulator',
    title: 'C8 · Estrategia + Simulacro 2',
    kicker: 'Cert · Sim 2',
    blockId: 'certificacion',
    kind: 'cert',
    order: 37,
    lines: 515,
  },
]

export const blocks: Block[] = [
  {
    id: 'prework',
    kicker: 'Prework',
    title: 'Preparación',
    description: '11 áreas de base (terminal, git, Node, JS, API, GitHub, editor, Claude Code). 1–9 obligatorias, 10–11 opcionales.',
    guides: prework,
  },
  {
    id: 'fundamentos',
    kicker: 'Bloque I',
    title: 'Fundamentos',
    description: 'Del modelo mental al TDD. La cimentación del curso.',
    connection: 'M1 modelo mental → M2 workflow aplicado → M3 auto-verificación como TDD',
    guides: bloqueI,
  },
  {
    id: 'configuracion',
    kicker: 'Bloque II',
    title: 'Configuración profesional',
    description: 'CLAUDE.md, skills, plugins, slash commands y hooks.',
    connection: 'M4 organiza contexto → M5 extiende capacidades → M6 automatiza acciones',
    guides: bloqueII,
  },
  {
    id: 'agentes',
    kicker: 'Bloque III',
    title: 'Agentes avanzados',
    description: 'Loops autónomos, workflows paralelos y control programático.',
    connection: 'M7 loops autónomos → M8 paralelismo → M9 control programático por agente',
    guides: bloqueIII,
  },
  {
    id: 'produccion',
    kicker: 'Bloque IV',
    title: 'Producción',
    description: 'Harnesses, evals, CI/CD y operacionalización.',
    connection: 'M10 agentes multi-día → M11 mide calidad → M12 optimiza costos + CI → M13 producción',
    guides: bloqueIV,
  },
  {
    id: 'capstone',
    kicker: 'Bloque V',
    title: 'Proyectos capstone',
    description: 'Cinco proyectos aplicados: TaskFlow, PriceWatch, NoteHub, TeamPulse, FeedbackLoop.',
    guides: capstone,
  },
  {
    id: 'referencia',
    kicker: 'Referencia',
    title: 'Documentos complementarios',
    description: 'Glosario, guía del alumno y quick reference.',
    guides: complementarios,
  },
  {
    id: 'certificacion',
    kicker: 'Bloque VI',
    title: 'Preparación de certificación',
    description: 'Claude Certified Architect: 5 dominios + simulacros.',
    guides: certificacion,
  },
]

// Flattened global sequence (reading order) — used for prev/next navigation.
export const sequence: Guide[] = blocks.flatMap((b) => b.guides)

export const course = {
  slug: 'claude-code',
  title: 'Claude Code Console',
  subtitle: 'De cero a experto',
  summary:
    'Un curso en español sobre Claude Code: prework, 13 módulos, 5 proyectos capstone y preparación para la certificación Claude Certified Architect.',
  stats: {
    lines: '~17.000',
    updated: 'Marzo 2026',
    blocks: blocks.length,
    guides: sequence.length,
  },
  blocks,
  sequence,
}

export function getGuide(slug: string): Guide | null {
  return sequence.find((g) => g.slug === slug) ?? null
}

export function getAdjacent(slug: string): { prev: Guide | null; next: Guide | null } {
  const idx = sequence.findIndex((g) => g.slug === slug)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? sequence[idx - 1] : null,
    next: idx < sequence.length - 1 ? sequence[idx + 1] : null,
  }
}

export function getBlockOf(slug: string): Block | null {
  for (const b of blocks) {
    if (b.guides.some((g) => g.slug === slug)) return b
  }
  return null
}
