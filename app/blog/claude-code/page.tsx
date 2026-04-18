import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionLabel, SectionRibbon } from '@/components/SectionLabel'
import { course } from '@/lib/course'

export const metadata: Metadata = {
  title: 'Claude Code Console — De cero a experto',
  description:
    'Curso completo en español sobre Claude Code: prework, 13 módulos, 5 proyectos capstone y preparación para la certificación Claude Certified Architect.',
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

          <SectionLabel>Curso</SectionLabel>
          <h1 className="ed-display-xl mt-6 max-w-[18ch]">
            {course.title}.
          </h1>
          <p className="ed-deck mt-8 max-w-2xl text-ink/80">
            {course.subtitle}. {course.summary}
          </p>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-3 pt-6 border-t border-ink">
            <span className="ed-meta text-ink">{course.stats.guides} guías</span>
            <span className="ed-meta text-muted">{course.stats.blocks} bloques</span>
            <span className="ed-meta text-muted">{course.stats.lines} líneas</span>
            <span className="ed-meta text-muted">{course.stats.updated}</span>
          </div>
        </div>
      </section>

      {/* Recommended progression */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-14 md:py-16">
          <SectionLabel>Progresión recomendada</SectionLabel>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-10 ed-body text-ink/85">
            <p>
              <span className="ed-kicker-bold block mb-1">Solo módulos</span>
              6 semanas · 70h
            </p>
            <p>
              <span className="ed-kicker-bold block mb-1">+ Proyectos mínimos</span>
              10 semanas · 120h (P1 + P3 + P5)
            </p>
            <p>
              <span className="ed-kicker-bold block mb-1">+ Certificación</span>
              14 semanas · 200h
            </p>
          </div>
        </div>
      </section>

      {/* Blocks */}
      {course.blocks.map((block) => (
        <section key={block.id} className="ed-rule-b-soft">
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
                    className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto_auto] items-baseline gap-x-6 gap-y-2 py-6 hover:bg-black/[0.02] px-1 transition-colors"
                  >
                    <span className="ed-kicker text-muted tabular-nums">
                      {String(g.order).padStart(2, '0')}
                    </span>
                    <span className="font-[var(--font-display)] text-[1.25rem] md:text-[1.5rem] leading-[1.15] tracking-[-0.3px] text-ink group-hover:text-link">
                      {g.title}
                    </span>
                    <span className="ed-meta text-muted hidden md:inline">
                      {g.kicker}
                    </span>
                    <span className="ed-meta text-muted justify-self-end">
                      {g.duration ?? (g.lines ? `${g.lines} líneas` : g.mandatory ? 'Obligatorio' : 'Opcional')}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      ))}
    </div>
  )
}
