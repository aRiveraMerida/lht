'use client'

import { useId, useState } from 'react'
import { Search, X } from 'lucide-react'
import { SectionHeader } from '@/components/SectionLabel'
import { PageHeader } from '@/components/PageHeader'
import { ProductCard } from '@/components/ProductCard'
import { Button, Card } from '@/components/tortuga'
import { LabStatus } from '@/components/lab/LabProgress'
import { labList } from '@/lib/labs'

interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  index: number
}

function countLabel(shown: number, total: number, filtering: boolean) {
  const noun = total === 1 ? 'artículo' : 'artículos'
  return filtering ? `${shown} de ${total} ${noun}` : `${total} ${noun}`
}

export function BlogGrid({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('')
  const helpId = useId()

  const filtering = query.trim() !== ''
  const filtered = filtering
    ? posts.filter((post) => post.title.toLowerCase().includes(query.trim().toLowerCase()))
    : posts
  const total = posts.length

  return (
    <div className="page-width">
      <PageHeader
        crumbs={[{ href: '/', label: 'Inicio' }, { label: 'Archivo' }]}
        eyebrow="Artículos y laboratorios"
        title="Todo lo publicado."
        deck="Sin orden cronológico obligatorio. Busca por título, o deja que algo te llame la atención."
      >
        <div className="field" role="search">
          <label htmlFor="blog-search" className="field-label">
            Buscar por título
          </label>
          <div className="input-wrap">
            <Search className="input-glyph input-glyph--lead" aria-hidden="true" />
            <input
              id="blog-search"
              type="search"
              placeholder="Por ejemplo, harness"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') setQuery('') }}
              aria-describedby={helpId}
              className="input input--lead"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} className="input-clear" aria-label="Limpiar búsqueda">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <p id={helpId} className="field-help" aria-live="polite">
            {countLabel(filtered.length, total, filtering)}
          </p>
        </div>
      </PageHeader>

      {/* Laboratorios */}
      {!filtering && labList.length > 0 && (
        <section className="section">
          <SectionHeader
            idx="Laboratorios"
            tag={`${labList.length} ${labList.length === 1 ? 'recorrido completo' : 'recorridos completos'}`}
          />
          <div className="stack">
            {labList.map((lab) => (
              <Card
                key={lab.slug}
                href={lab.urlBase}
                eyebrow="Laboratorio"
                aside={<LabStatus lab={lab.slug} total={lab.sequence.length} />}
                title={lab.title}
                desc={lab.summary}
                meta={`${lab.stats.guides} ${lab.stats.guides === 1 ? 'capítulo' : 'capítulos'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Artículos */}
      <section className="section">
        <SectionHeader idx="Artículos" tag="Del más reciente al primero" />
        {filtered.length === 0 ? (
          <Card
            title="Aquí todavía no hay nada."
            desc="Publicamos cuando hay algo que probar, no antes. Prueba con otro término o vuelve a todo el archivo."
          >
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setQuery('')}>
                Ver todo el archivo
              </Button>
              <Button href="/#contacto">Escribirnos</Button>
            </div>
          </Card>
        ) : (
          <div className="stack">
            {filtered.map((post) => (
              <ProductCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                excerpt={post.excerpt}
                index={post.index}
                totalCount={total}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
