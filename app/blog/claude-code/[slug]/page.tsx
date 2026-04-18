import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import { sequence, getGuide, getAdjacent, getBlockOf } from '@/lib/course'
import { getGuideContent } from '@/lib/guides'
import { SectionLabel } from '@/components/SectionLabel'
import 'highlight.js/styles/github-dark.css'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return sequence.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return { title: 'Guía no encontrada' }

  const url = `https://lahabitaciontortuga.com/blog/claude-code/${slug}`
  const content = getGuideContent(slug)
  const description =
    content?.excerpt ??
    `${guide.kicker} — ${guide.title}. Parte del Programa de Claude Code en La Habitación Tortuga.`

  return {
    title: guide.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description,
      type: 'article',
      url,
      siteName: 'La Habitación Tortuga [LHT]',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description,
    },
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const block = getBlockOf(slug)
  const { prev, next } = getAdjacent(slug)
  const content = getGuideContent(slug)

  const prevCrossesBlock = prev && block && prev.blockId !== block.id
  const nextCrossesBlock = next && block && next.blockId !== block.id

  return (
    <div>
      {/* Header */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-12 md:py-16">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 ed-meta text-muted mb-10">
            <Link href="/" className="hover:text-link">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-link">Archivo</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog/claude-code" className="hover:text-link">Claude Code</Link>
            {block && (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  href={`/blog/claude-code#${block.id}`}
                  className="hover:text-link"
                >
                  {block.title}
                </Link>
              </>
            )}
          </nav>

          <div className="ed-kicker-bold text-ink">{guide.kicker}</div>

          <h1 className="ed-display mt-5 max-w-[22ch]">{guide.title}</h1>

          {/* Minimal metadata row */}
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 pt-5 border-t border-ink">
            <span className="ed-meta text-ink">
              Guía {String(guide.order).padStart(2, '0')} / {sequence.length}
            </span>
            {block && (
              <Link
                href={`/blog/claude-code#${block.id}`}
                className="ed-meta text-muted hover:text-link"
              >
                {block.kicker} · {block.title}
              </Link>
            )}
            {content && (
              <span className="ed-meta text-muted">{content.readingTime} lectura</span>
            )}
          </div>
        </div>
      </section>

      {/* Within-block quick nav */}
      {block && block.guides.length > 1 && (
        <nav
          aria-label={`Guías del bloque ${block.title}`}
          className="sticky top-[89px] bg-paper z-30 ed-rule-b"
        >
          <div className="ed-container">
            <div className="flex items-center gap-x-6 gap-y-0 overflow-x-auto py-3 -mx-4 px-4 md:mx-0 md:px-0">
              <span className="shrink-0 ed-ribbon-label text-muted hidden md:inline">
                {block.kicker}
              </span>
              {block.guides.map((g) => {
                const active = g.slug === slug
                return (
                  <Link
                    key={g.slug}
                    href={`/blog/claude-code/${g.slug}`}
                    aria-current={active ? 'page' : undefined}
                    className={`shrink-0 ed-meta py-2 px-1 border-b-2 transition-colors ${
                      active
                        ? 'text-ink border-ink'
                        : 'text-muted border-transparent hover:text-ink'
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
          </div>
        </nav>
      )}

      {/* Body */}
      <section>
        <div className="ed-container py-12 md:py-16">
          <article className="ed-reading">
            {content ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {content.content}
              </ReactMarkdown>
            ) : (
              <p className="ed-deck text-ink/80">
                Contenido en preparación. Vuelve pronto o sigue con la siguiente guía
                de la secuencia.
              </p>
            )}
          </article>
        </div>
      </section>

      {/* End-of-block banner when crossing */}
      {nextCrossesBlock && next && block && (
        <section className="on-dark bg-ink text-paper">
          <div className="ed-container py-10 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-baseline gap-x-8 gap-y-4">
              <div className="ed-ribbon-label text-paper/60 uppercase">
                Fin del {block.kicker}
              </div>
              <div>
                <div className="ed-meta text-paper/80 mb-1">
                  Empieza el siguiente bloque
                </div>
                <div className="font-[var(--font-display)] text-[1.5rem] md:text-[1.875rem] leading-[1.15] tracking-[-0.3px] text-paper">
                  {next.kicker.split(' · ').slice(-1)[0] === block.title
                    ? next.title
                    : next.kicker}
                </div>
              </div>
              <Link
                href={`/blog/claude-code/${next.slug}`}
                className="ed-btn ed-btn-on-dark self-center"
              >
                Ir <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Prev / Next (global sequence) */}
      <section className="ed-rule-t border-t border-ink bg-[color:var(--color-hairline)]/30">
        <div className="ed-container py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {prev ? (
              <Link href={`/blog/claude-code/${prev.slug}`} className="group block">
                <div className="ed-meta text-muted mb-3 flex items-center gap-2">
                  <ArrowLeft size={14} aria-hidden="true" /> Anterior
                  {prevCrossesBlock && (
                    <span className="text-ink">· Bloque anterior</span>
                  )}
                </div>
                <div className="ed-kicker-bold text-ink group-hover:text-link">
                  {prev.kicker}
                </div>
                <div className="font-[var(--font-display)] text-[1.5rem] leading-[1.18] tracking-[-0.3px] mt-3 group-hover:text-link">
                  {prev.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={`/blog/claude-code/${next.slug}`}
                className="group block md:text-right md:border-l md:border-ink/15 md:pl-10"
              >
                <div className="ed-meta text-muted mb-3 flex items-center gap-2 md:justify-end">
                  {nextCrossesBlock && (
                    <span className="text-ink">Bloque siguiente ·</span>
                  )}
                  Siguiente <ArrowRight size={14} aria-hidden="true" />
                </div>
                <div className="ed-kicker-bold text-ink group-hover:text-link">
                  {next.kicker}
                </div>
                <div className="font-[var(--font-display)] text-[1.5rem] leading-[1.18] tracking-[-0.3px] mt-3 group-hover:text-link">
                  {next.title}
                </div>
              </Link>
            ) : (
              <div className="md:text-right">
                <SectionLabel>Fin del programa</SectionLabel>
                <p className="ed-body mt-3 text-ink/80">
                  Has llegado al final de la secuencia. Vuelve al{' '}
                  <Link href="/blog/claude-code" className="ed-link">
                    índice del programa
                  </Link>
                  {' '}o al{' '}
                  <Link href="/blog" className="ed-link">
                    archivo completo
                  </Link>.
                </p>
              </div>
            )}
          </div>

          <div className="mt-12 border-t border-ink/15 pt-8 flex flex-wrap gap-4">
            <Link href="/blog/claude-code" className="ed-btn">
              Ver programa completo
            </Link>
            <Link href="/blog" className="ed-btn">
              <ArrowLeft size={14} aria-hidden="true" /> Archivo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
