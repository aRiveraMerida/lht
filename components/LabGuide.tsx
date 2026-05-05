import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { getLabAdjacent, getLabBlockOf, getLabGuide } from '@/lib/labs'
import type { Lab } from '@/lib/labs'
import { getGuideContent } from '@/lib/guides'
import { SectionHeader } from '@/components/SectionLabel'

interface Props {
  lab: Lab
  slug: string
  breadcrumbLabel: string
}

export function LabGuide({ lab, slug, breadcrumbLabel }: Props) {
  const guide = getLabGuide(lab.slug, slug)
  if (!guide) notFound()

  const block = getLabBlockOf(lab.slug, slug)
  const { prev, next } = getLabAdjacent(lab.slug, slug)
  const content = getGuideContent(lab.slug, slug)

  const prevCrossesBlock = prev && block && prev.blockId !== block.id
  const nextCrossesBlock = next && block && next.blockId !== block.id

  return (
    <div>
      {/* Header */}
      <section className="ed-container" style={{ paddingTop: 130, paddingBottom: 50 }}>
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 ed-meta opacity-60 mb-10"
        >
          <Link href="/" className="hover:text-[color:var(--color-don-red)] transition-colors">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-[color:var(--color-don-red)] transition-colors">Archivo</Link>
          <span aria-hidden="true">/</span>
          <Link href={lab.urlBase} className="hover:text-[color:var(--color-don-red)] transition-colors">{breadcrumbLabel}</Link>
          {block && lab.blocks.length > 1 && (
            <>
              <span aria-hidden="true">/</span>
              <Link
                href={`${lab.urlBase}#${block.id}`}
                className="hover:text-[color:var(--color-don-red)] transition-colors"
              >
                {block.title}
              </Link>
            </>
          )}
        </nav>

        <SectionHeader
          idx={`Capítulo ${String(guide.order).padStart(2, '0')} / ${lab.sequence.length}`}
          tag={guide.kicker}
        />

        <h1 className="ed-display mt-10 max-w-[22ch]">{guide.title}</h1>

        <div
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 pt-5"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          {block && lab.blocks.length > 1 && (
            <Link
              href={`${lab.urlBase}#${block.id}`}
              className="ed-meta opacity-75 hover:opacity-100 hover:text-[color:var(--color-don-red)] transition-colors"
            >
              {block.kicker} · {block.title}
            </Link>
          )}
          {content && (
            <span className="ed-meta opacity-60">{content.readingTime} lectura</span>
          )}
        </div>
      </section>

      {/* Within-block quick nav */}
      {block && (
        <nav
          aria-label="Navegación del laboratorio"
          className="sticky top-[80px] z-30 backdrop-blur"
          style={{
            background: 'rgba(0,0,0,0.85)',
            borderTop: '1px solid rgba(246,246,246,0.14)',
            borderBottom: '1px solid rgba(246,246,246,0.14)',
          }}
        >
          <div className="ed-container">
            {/* Block selector row (only when multiple blocks) */}
            {lab.blocks.length > 1 && (
              <div
                className="flex items-center gap-x-1 overflow-x-auto pt-3 pb-1"
                style={{ borderBottom: '1px solid rgba(246,246,246,0.1)' }}
              >
                {lab.blocks.map((b) => {
                  const activeBlock = b.id === block.id
                  return (
                    <Link
                      key={b.id}
                      href={`${lab.urlBase}/${b.guides[0].slug}`}
                      aria-current={activeBlock ? 'true' : undefined}
                      className={`shrink-0 ed-ribbon-label py-1.5 px-3 transition-colors ${
                        activeBlock
                          ? 'text-ink'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                      style={
                        activeBlock
                          ? { background: 'var(--color-don-red)' }
                          : undefined
                      }
                    >
                      {b.kicker}
                    </Link>
                  )
                })}
              </div>
            )}
            {/* Lesson selector row */}
            {block.guides.length > 1 && (
              <div className="flex items-center gap-x-6 overflow-x-auto py-3">
                <span className="shrink-0 ed-ribbon-label opacity-60 hidden md:inline">
                  {block.kicker}
                </span>
                {block.guides.map((g) => {
                  const active = g.slug === slug
                  return (
                    <Link
                      key={g.slug}
                      href={`${lab.urlBase}/${g.slug}`}
                      aria-current={active ? 'page' : undefined}
                      className={`shrink-0 ed-meta py-2 px-1 border-b-2 transition-colors ${
                        active
                          ? 'text-ink border-[color:var(--color-don-red)]'
                          : 'opacity-60 border-transparent hover:opacity-100'
                      }`}
                    >
                      <span className="tabular-nums mr-2">
                        {String(g.order).padStart(2, '0')}
                      </span>
                      {g.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      )}

      {/* Body */}
      <section className="ed-container py-12 md:py-16">
        <article className="ed-reading">
          {content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
            >
              {content.content}
            </ReactMarkdown>
          ) : (
            <p className="ed-deck opacity-80">
              Contenido en preparación. Vuelve pronto o sigue con el siguiente capítulo
              de la secuencia.
            </p>
          )}
        </article>
      </section>

      {/* End-of-block banner */}
      {nextCrossesBlock && next && block && (
        <section
          className="ed-container py-10 md:py-12"
          style={{
            borderTop: '1px solid rgba(246,246,246,0.18)',
            borderBottom: '1px solid rgba(246,246,246,0.18)',
            background: 'rgba(193, 16, 18, 0.08)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-baseline gap-x-8 gap-y-4">
            <div className="ed-ribbon-label" style={{ color: 'var(--color-don-red)' }}>
              Fin del {block.kicker}
            </div>
            <div>
              <div className="ed-meta opacity-80 mb-1">
                Empieza el siguiente bloque
              </div>
              <div className="ed-ui-heading">
                {next.kicker.split(' · ').slice(-1)[0] === block.title
                  ? next.title
                  : next.kicker}
              </div>
            </div>
            <Link
              href={`${lab.urlBase}/${next.slug}`}
              className="ed-btn ed-btn-invert self-center"
            >
              Ir <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {/* Prev / Next */}
      <section
        className="ed-container py-12 md:py-16"
        style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {prev ? (
            <Link href={`${lab.urlBase}/${prev.slug}`} className="group block">
              <div className="ed-meta opacity-60 mb-3 flex items-center gap-2">
                <ArrowLeft size={14} aria-hidden="true" /> Anterior
                {prevCrossesBlock && (
                  <span style={{ color: 'var(--color-don-red)' }}>· Bloque anterior</span>
                )}
              </div>
              <div className="ed-kicker-bold group-hover:text-[color:var(--color-don-red)] transition-colors">
                {prev.kicker}
              </div>
              <div className="ed-ui-heading mt-3 group-hover:text-[color:var(--color-don-red)] transition-colors">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`${lab.urlBase}/${next.slug}`}
              className="group block md:text-right md:border-l md:border-[color:var(--color-hairline)] md:pl-10"
            >
              <div className="ed-meta opacity-60 mb-3 flex items-center gap-2 md:justify-end">
                {nextCrossesBlock && (
                  <span style={{ color: 'var(--color-don-red)' }}>Bloque siguiente ·</span>
                )}
                Siguiente <ArrowRight size={14} aria-hidden="true" />
              </div>
              <div className="ed-kicker-bold group-hover:text-[color:var(--color-don-red)] transition-colors">
                {next.kicker}
              </div>
              <div className="ed-ui-heading mt-3 group-hover:text-[color:var(--color-don-red)] transition-colors">
                {next.title}
              </div>
            </Link>
          ) : (
            <div className="md:text-right">
              <div className="ed-kicker-bold">Fin del laboratorio</div>
              <p className="ed-body mt-3 opacity-80">
                Has llegado al final de la secuencia. Vuelve al{' '}
                <Link href={lab.urlBase} className="ed-link">
                  índice del laboratorio
                </Link>
                {' '}o al{' '}
                <Link href="/blog" className="ed-link">
                  archivo completo
                </Link>.
              </p>
            </div>
          )}
        </div>

        <div
          className="mt-12 pt-8 flex flex-wrap gap-4"
          style={{ borderTop: '1px solid rgba(246,246,246,0.14)' }}
        >
          <Link href={lab.urlBase} className="ed-btn">
            Ver laboratorio completo
          </Link>
          <Link href="/blog" className="ed-btn">
            <ArrowLeft size={14} aria-hidden="true" /> Archivo
          </Link>
        </div>
      </section>
    </div>
  )
}
