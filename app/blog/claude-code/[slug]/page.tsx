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
    `${guide.kicker} — ${guide.title}. Parte del curso Claude Code Console en La Habitación Tortuga.`

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

  return (
    <div>
      {/* Header */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 ed-meta text-muted mb-12">
            <Link href="/" className="hover:text-link">Inicio</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="hover:text-link">Archivo</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog/claude-code" className="hover:text-link">Claude Code</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{guide.title}</span>
          </nav>

          <div className="ed-kicker-bold text-ink">{guide.kicker}</div>

          <h1 className="ed-display mt-5 max-w-[22ch]">{guide.title}</h1>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 pt-6 border-t border-ink">
            <span className="ed-meta text-ink">
              Guía {String(guide.order).padStart(2, '0')} / {sequence.length}
            </span>
            {block && (
              <Link
                href="/blog/claude-code"
                className="ed-meta text-muted hover:text-link"
              >
                {block.kicker} · {block.title}
              </Link>
            )}
            {guide.duration && <span className="ed-meta text-muted">{guide.duration}</span>}
            {guide.lines && <span className="ed-meta text-muted">{guide.lines} líneas</span>}
            {guide.kind === 'prework' && (
              <span className="ed-meta text-muted">
                {guide.mandatory ? 'Obligatoria' : 'Opcional'}
              </span>
            )}
            {content && (
              <span className="ed-meta text-muted">{content.readingTime} lectura</span>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <section>
        <div className="ed-container py-14 md:py-20">
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

      {/* Prev / Next */}
      <section className="ed-rule-t border-t border-ink bg-[color:var(--color-hairline)]/30">
        <div className="ed-container py-14 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {prev ? (
              <Link href={`/blog/claude-code/${prev.slug}`} className="group block">
                <div className="ed-meta text-muted mb-3 flex items-center gap-2">
                  <ArrowLeft size={14} aria-hidden="true" /> Anterior
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
                <SectionLabel>Fin del curso</SectionLabel>
                <p className="ed-body mt-3 text-ink/80">
                  Has llegado al final de la secuencia. Vuelve al{' '}
                  <Link href="/blog/claude-code" className="ed-link">
                    índice del curso
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
              Ver índice del curso
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
