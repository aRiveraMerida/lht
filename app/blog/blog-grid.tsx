'use client'

import { useId, useState } from 'react'
import { Search, X } from 'lucide-react'
import { PageHeader } from '@/components/PageHeader'
import { PostList, type PostSummary } from '@/components/PostList'
import { Button, Card } from '@/components/tortuga'
import { LabCardProgress, LabStatus } from '@/components/lab/LabProgress'
import { labList } from '@/lib/labs'

function countLabel(shown: number, total: number, filtering: boolean) {
  const noun = total === 1 ? 'artículo' : 'artículos'
  return filtering ? `${shown} de ${total} ${noun}` : `${total} ${noun}`
}

export function BlogGrid({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState('')
  const helpId = useId()

  const filtering = query.trim() !== ''
  const filtered = filtering
    ? posts.filter((post) => post.title.toLowerCase().includes(query.trim().toLowerCase()))
    : posts

  return (
    <div className="page-width">
      <PageHeader
        crumbs={[{ href: '/', label: 'Inicio' }, { label: 'Archivo' }]}
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
            {countLabel(filtered.length, posts.length, filtering)}
          </p>
        </div>
      </PageHeader>

      {/* Artículos */}
      <section className="pt-4 pb-12" aria-labelledby="articulos">
        <h2 id="articulos" className="sr-only">Artículos</h2>
        {filtered.length === 0 ? (
          <div className="py-12 max-w-[var(--measure)]">
            <h3>Aquí todavía no hay nada.</h3>
            <p className="mt-3 text-ink-2">
              Publicamos cuando hay algo que probar, no antes. Prueba con otro término o
              vuelve a todo el archivo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => setQuery('')}>
                Ver todo el archivo
              </Button>
              <Button href="/#contacto">Escribirnos</Button>
            </div>
          </div>
        ) : (
          <PostList posts={filtered} wide />
        )}
      </section>

      {/* Laboratorios */}
      {!filtering && labList.length > 0 && (
        <section className="block" aria-labelledby="laboratorios">
          <div className="block-head">
            <h2 id="laboratorios">Laboratorios</h2>
            <p>
              {labList.length} {labList.length === 1 ? 'recorrido completo' : 'recorridos completos'}
            </p>
          </div>
          <div className="grid">
            {labList.map((lab) => (
              <Card
                key={lab.slug}
                href={lab.urlBase}
                aside={<LabStatus lab={lab.slug} total={lab.sequence.length} />}
                title={lab.title}
                desc={lab.summary}
                meta={`${lab.stats.guides} ${lab.stats.guides === 1 ? 'capítulo' : 'capítulos'}`}
              >
                <LabCardProgress lab={lab.slug} total={lab.sequence.length} />
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
