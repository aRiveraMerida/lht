import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getLabAdjacent, getLabBlockOf, getLabGuide } from '@/lib/labs'
import type { Lab } from '@/lib/labs'
import { getGuideContent } from '@/lib/guides'
import { PageHeader } from '@/components/PageHeader'
import { Markdown } from '@/components/Markdown'
import { Button, Card } from '@/components/tortuga'
import { ChapterProgress, SeenMark } from '@/components/lab/LabProgress'

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

  const prevCrossesBlock = Boolean(prev && block && prev.blockId !== block.id)
  const nextCrossesBlock = Boolean(next && block && next.blockId !== block.id)
  const multiBlock = Boolean(block && lab.blocks.length > 1)

  const crumbs = [
    { href: '/', label: 'Inicio' },
    { href: '/blog', label: 'Archivo' },
    { href: lab.urlBase, label: breadcrumbLabel },
    ...(block && multiBlock ? [{ href: `${lab.urlBase}#${block.id}`, label: block.title }] : []),
  ]

  return (
    <div className="page-width">
      <div className="read-col">
        <PageHeader
          crumbs={crumbs}
          eyebrow={`Capítulo ${String(guide.order).padStart(2, '0')} de ${lab.sequence.length} · ${guide.kicker}`}
          title={guide.title}
          meta={content && <span>{content.readingTime} de lectura</span>}
        />
      </div>

      {/* Where you are in the lab: blocks, then the lessons of this block */}
      {block && (
        <nav aria-label="Navegación del laboratorio" className="subnav">
          <div className="read-col">
            {multiBlock && (
              <div className="tabs">
                {lab.blocks.map((b) => (
                  <Link
                    key={b.id}
                    href={`${lab.urlBase}/${b.guides[0].slug}`}
                    aria-current={b.id === block.id ? 'true' : undefined}
                    className="tab"
                  >
                    {b.kicker}
                  </Link>
                ))}
              </div>
            )}
            {block.guides.length > 1 && (
              <div className="tabs tabs--sm">
                {block.guides.map((g) => (
                  <Link
                    key={g.slug}
                    href={`${lab.urlBase}/${g.slug}`}
                    aria-current={g.slug === slug ? 'page' : undefined}
                    className="tab"
                  >
                    <span className="tab-num">{String(g.order).padStart(2, '0')}</span>
                    {g.title}
                    <SeenMark lab={lab.slug} slug={g.slug} />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      )}

      <div className="read-col">
        <article className="py-10">
          {content ? (
            <Markdown>{content.content}</Markdown>
          ) : (
            <p className="text-ink-2">
              Contenido en preparación. Vuelve pronto o sigue con el siguiente capítulo
              de la secuencia.
            </p>
          )}
        </article>

        <ChapterProgress lab={lab.slug} slug={slug} />
      </div>

      {/* Prev / Next */}
      <section className="read-col block mt-12" aria-labelledby="seguir">
        <div className="block-head">
          <h2 id="seguir">Seguir</h2>
          <p>{nextCrossesBlock && block ? `Fin del ${block.kicker}` : 'En orden, sin prisa'}</p>
        </div>
        <div>
          <div className="grid">
            {prev && (
              <Card
                href={`${lab.urlBase}/${prev.slug}`}
                eyebrow={prevCrossesBlock ? 'Anterior · bloque anterior' : 'Anterior'}
                title={prev.title}
                meta={prev.kicker}
              />
            )}
            {next ? (
              <Card
                href={`${lab.urlBase}/${next.slug}`}
                eyebrow={nextCrossesBlock ? 'Siguiente · empieza otro bloque' : 'Siguiente'}
                title={next.title}
                meta={next.kicker}
              >
                <Button variant="primary" href={`${lab.urlBase}/${next.slug}`}>
                  Siguiente capítulo <ArrowRight aria-hidden="true" />
                </Button>
              </Card>
            ) : (
              <Card
                eyebrow="Fin del laboratorio"
                title="Has llegado al final de la secuencia."
                desc="Vuelve al índice para repasar lo que te falte, o al archivo para otra cosa."
              >
                <Button variant="primary" href={lab.urlBase}>
                  Volver al índice
                </Button>
              </Card>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={lab.urlBase}>Ver laboratorio completo</Button>
            <Button variant="ghost" href="/blog">
              <ArrowLeft aria-hidden="true" /> Archivo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
