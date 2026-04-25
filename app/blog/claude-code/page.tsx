import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionHeader } from '@/components/SectionLabel'
import { course } from '@/lib/course'

export const metadata: Metadata = {
  title: 'Laboratorio largo · Claude Code',
  description:
    'Un recorrido completo en español por Claude Code: prework, fundamentos, configuración profesional, agentes avanzados, producción y proyectos capstone. Sin prisas.',
  alternates: { canonical: 'https://lahabitaciontortuga.com/blog/claude-code' },
}

export default function ClaudeCodeIndex() {
  return (
    <div>
      {/* Header */}
      <section className="ed-container" style={{ paddingTop: 130, paddingBottom: 60 }}>
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 ed-meta opacity-60 mb-12"
        >
          <Link href="/" className="hover:text-[color:var(--color-don-red)] transition-colors">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-[color:var(--color-don-red)] transition-colors">Archivo</Link>
          <span aria-hidden="true">/</span>
          <span style={{ opacity: 0.85 }}>Claude Code</span>
        </nav>

        <SectionHeader
          idx="Laboratorio largo"
          tag={`${course.stats.guides} guías · ${course.stats.blocks} bloques`}
        />

        <h1 className="ed-display-xl mt-10 max-w-[18ch]">
          {course.title}.
        </h1>
        <p className="ed-deck mt-8 max-w-2xl opacity-80">
          {course.summary}
        </p>

        <div
          className="mt-12 flex flex-wrap gap-x-10 gap-y-3 pt-6"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <span className="ed-meta">
            <span style={{ color: 'var(--color-don-red)' }}>●</span> {course.stats.guides} guías
          </span>
          <span className="ed-meta opacity-60">{course.stats.blocks} bloques</span>
          <span className="ed-meta opacity-60">{course.stats.updated}</span>
        </div>
      </section>

      {/* Jump to block */}
      <nav
        aria-label="Saltar a bloque"
        className="sticky top-[80px] z-30 backdrop-blur"
        style={{
          background: 'rgba(0,0,0,0.85)',
          borderTop: '1px solid rgba(246,246,246,0.14)',
          borderBottom: '1px solid rgba(246,246,246,0.14)',
        }}
      >
        <div className="ed-container">
          <div className="flex items-center gap-x-8 overflow-x-auto py-3">
            <span className="shrink-0 ed-ribbon-label opacity-60 hidden md:inline">
              Bloques
            </span>
            {course.blocks.map((block) => (
              <a
                key={block.id}
                href={`#${block.id}`}
                className="shrink-0 ed-btn-label py-2 px-1 border-b-2 border-transparent opacity-60 hover:opacity-100 hover:border-[color:var(--color-don-red)] transition-all"
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
            className="ed-container py-16 md:py-20 scroll-mt-[140px]"
            style={{ borderTop: '1px solid rgba(246,246,246,0.14)' }}
          >
            <SectionHeader idx={block.kicker} tag={block.title} />

            {block.description && (
              <p className="ed-deck mt-10 max-w-2xl opacity-80">{block.description}</p>
            )}
            {block.connection && (
              <p className="ed-body mt-4 max-w-2xl opacity-60 italic">
                Conexión: {block.connection}
              </p>
            )}

            <ol
              className="mt-10"
              style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
            >
              {block.guides.map((g) => (
                <li
                  key={g.slug}
                  style={{ borderBottom: '1px solid rgba(246,246,246,0.14)' }}
                >
                  <Link
                    href={`/blog/claude-code/${g.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 gap-y-2 py-6 px-1 transition-colors hover:bg-[rgba(246,246,246,0.04)]"
                  >
                    <span className="ed-kicker tabular-nums">
                      {String(g.order).padStart(2, '0')}
                    </span>
                    <span className="ed-ui-heading group-hover:text-[color:var(--color-don-red)] transition-colors">
                      {g.title}
                    </span>
                    <span className="ed-meta opacity-60 justify-self-end hidden md:inline">
                      {g.kicker}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>

            {(prev || next) && (
              <div
                className="mt-10 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
                style={{ borderTop: '1px solid rgba(246,246,246,0.14)' }}
              >
                {prev ? (
                  <a href={`#${prev.id}`} className="ed-link-ui opacity-60 hover:opacity-100 transition-opacity">
                    ← Bloque anterior: {prev.kicker} · {prev.title}
                  </a>
                ) : <div />}
                {next ? (
                  <a href={`#${next.id}`} className="ed-link-ui opacity-60 hover:opacity-100 md:text-right transition-opacity">
                    Bloque siguiente: {next.kicker} · {next.title} →
                  </a>
                ) : <div />}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
