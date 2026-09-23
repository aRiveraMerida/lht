import Link from 'next/link'
import { SectionHeader } from '@/components/SectionLabel'
import { PageHeader } from '@/components/PageHeader'
import { LabResume, LessonStatus } from '@/components/lab/LabProgress'
import type { Lab } from '@/lib/labs'

interface Props {
  lab: Lab
  breadcrumbLabel: string
}

export function LabIndex({ lab, breadcrumbLabel }: Props) {
  const { guides, blocks, updated } = lab.stats
  const sequence = lab.sequence.map(({ slug, title, order }) => ({ slug, title, order }))

  return (
    <div className="page-width">
      <PageHeader
        crumbs={[{ href: '/', label: 'Inicio' }, { href: '/blog', label: 'Archivo' }, { label: breadcrumbLabel }]}
        eyebrow="Laboratorio"
        title={`${lab.title}.`}
        deck={lab.summary}
        meta={
          <>
            <span>{guides} {guides === 1 ? 'capítulo' : 'capítulos'}</span>
            <span>{blocks} {blocks === 1 ? 'bloque' : 'bloques'}</span>
            <span>Actualizado: {updated}</span>
          </>
        }
      >
        <LabResume lab={lab.slug} urlBase={lab.urlBase} sequence={sequence} />
      </PageHeader>

      {/* Jump to block */}
      {lab.blocks.length > 1 && (
        <nav aria-label="Saltar a bloque" className="subnav">
          <div className="tabs">
            {lab.blocks.map((block) => (
              <a key={block.id} href={`#${block.id}`} className="tab">
                {block.kicker}
              </a>
            ))}
          </div>
        </nav>
      )}

      {lab.blocks.map((block) => (
        <section
          key={block.id}
          id={block.id}
          className="section"
          style={{ scrollMarginTop: 'calc(var(--header-height) + var(--control-height))' }}
          aria-labelledby={`${block.id}-title`}
        >
          <SectionHeader id={`${block.id}-title`} idx={block.kicker} tag={block.title} />

          <div>
            {block.description && <p className="text-muted">{block.description}</p>}
            {block.connection && <p className="type-sm mt-2">Conexión: {block.connection}</p>}

            <ol className="lesson-list mt-6">
              {block.guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`${lab.urlBase}/${g.slug}`} className="lesson-row">
                    <span className="lesson-row-num">{String(g.order).padStart(2, '0')}</span>
                    <span className="type-md">{g.title}</span>
                    <span className="lesson-row-aside">
                      <LessonStatus lab={lab.slug} slug={g.slug} />
                      <span className="type-sm hidden md:inline">{g.kicker}</span>
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
