import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionLabel, SectionRibbon } from '@/components/SectionLabel'
import { course } from '@/lib/course'

export const metadata: Metadata = {
  title: 'Programa de Claude Code',
  description:
    'Un recorrido completo en español por Claude Code: prework, fundamentos, configuración profesional, agentes avanzados, producción y proyectos capstone.',
  alternates: { canonical: 'https://lahabitaciontortuga.com/blog/claude-code' },
}

export default function ClaudeCodeIndex() {
  return (
    <div>
      {/* Header */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-16 md:py-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 ed-meta text-muted mb-12">
            <Link href="/" className="hover:text-link">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-link">Archivo</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">Claude Code</span>
          </nav>

          <SectionLabel>Programa</SectionLabel>
          <h1 className="ed-display-xl mt-6 max-w-[18ch]">
            {course.title}.
          </h1>
          <p className="ed-deck mt-8 max-w-2xl text-ink/80">
            {course.summary}
          </p>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 pt-6 border-t border-ink">
            <span className="ed-meta text-ink">{course.stats.guides} guías</span>
            <span className="ed-meta text-muted">{course.stats.blocks} bloques</span>
            <span className="ed-meta text-muted">{course.stats.updated}</span>
          </div>
        </div>
      </section>

      {/* Jump to block — sticky quick nav */}
      <nav
        aria-label="Saltar a bloque"
        className="sticky top-[89px] bg-paper z-30 ed-rule-b"
      >
        <div className="ed-container">
          <div className="flex items-center gap-x-8 gap-y-0 overflow-x-auto py-3 -mx-4 px-4 md:mx-0 md:px-0">
            <span className="shrink-0 ed-ribbon-label text-muted hidden md:inline">
              Bloques
            </span>
            {course.blocks.map((block) => (
              <a
                key={block.id}
                href={`#${block.id}`}
                className="shrink-0 ed-btn-label uppercase tracking-[0.3px] py-2 px-1 border-b-2 border-transparent text-muted hover:text-ink hover:border-ink transition-colors"
              >
                {block.kicker}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Blocks */}
      {course.blocks.map((block, bi) => {
        const prev = course.blocks[bi - 1]
        const next = course.blocks[bi + 1]
        return (
          <section
            key={block.id}
            id={block.id}
            className="ed-rule-b-soft scroll-mt-[140px]"
          >
            <div className="ed-container py-16 md:py-20">
              <SectionRibbon>{block.kicker} · {block.title}</SectionRibbon>

              {block.description && (
                <p className="ed-deck mt-8 max-w-2xl text-ink/80">{block.description}</p>
              )}
              {block.connection && (
                <p className="ed-body mt-4 max-w-2xl text-muted italic">
                  Conexión: {block.connection}
                </p>
              )}

              <ol className="mt-12 border-t border-ink">
                {block.guides.map((g) => (
                  <li key={g.slug} className="border-b border-[color:var(--color-hairline)]">
                    <Link
                      href={`/blog/claude-code/${g.slug}`}
                      className="group grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 py-6 hover:bg-black/[0.02] px-1 transition-colors"
                    >
                      <span className="ed-kicker text-muted tabular-nums">
                        {String(g.order).padStart(2, '0')}
                      </span>
                      <span className="font-[var(--font-display)] text-[1.25rem] md:text-[1.5rem] leading-[1.15] tracking-[-0.3px] text-ink group-hover:text-link transition-colors">
                        {g.title}
                      </span>
                      <span className="ed-meta text-muted justify-self-end">
                        {g.kicker}
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>

              {/* Block jump: prev/next block */}
              {(prev || next) && (
                <div className="mt-10 pt-6 border-t border-[color:var(--color-hairline)] grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prev ? (
                    <a href={`#${prev.id}`} className="ed-link-ui text-muted hover:text-link">
                      ← Bloque anterior: {prev.kicker} · {prev.title}
                    </a>
                  ) : <div />}
                  {next ? (
                    <a href={`#${next.id}`} className="ed-link-ui text-muted hover:text-link md:text-right">
                      Bloque siguiente: {next.kicker} · {next.title} →
                    </a>
                  ) : <div />}
                </div>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
