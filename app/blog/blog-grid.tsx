'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { SectionHeader } from '@/components/SectionLabel'
import { ProductCard } from '@/components/ProductCard'
import type { PreviewVariant } from '@/lib/assets'
import { labList } from '@/lib/labs'

interface PostMeta {
  slug: string
  title: string
  date: string
  authorSlugs: string[]
  excerpt: string
  variant: PreviewVariant
  index: number
  featured?: boolean
}

function LabRow({ slug, title, summary, urlBase, parts }: { slug: string; title: string; summary: string; urlBase: string; parts: number }) {
  return (
    <Link
      key={slug}
      href={urlBase}
      className="lab-item group block"
      style={{ borderTop: '1px solid rgba(246,246,246,0.14)' }}
    >
      <div
        className="lab-num"
        style={{ color: 'var(--color-don-red)', opacity: 1 }}
      >
        Lab
      </div>
      <div className="lab-body">
        <h3 className="lab-title">{title}</h3>
        <p className="lab-desc">{summary}</p>
      </div>
      <div className="lab-tag">
        <span className="lab-dot">●</span> Laboratorio
      </div>
      <div className="lab-read">
        {parts} {parts === 1 ? 'capítulo' : 'capítulos'} · Entrar
      </div>
    </Link>
  )
}

export function BlogGrid({ posts }: { posts: PostMeta[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = posts.filter((post) => {
    return searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const hasAnyPosts = posts.length > 0
  const filterIsActive = searchQuery !== ''
  const totalPosts = posts.length

  return (
    <div>
      {/* Header */}
      <section className="ed-container" style={{ paddingTop: 130 }}>
        <SectionHeader
          idx="Archivo"
          tag="Artículos y laboratorios · cronológico"
        />

        <h1 className="ed-display-xl mt-10 max-w-[14ch]">
          Todo lo publicado.
        </h1>
        <p className="ed-deck mt-8 max-w-2xl opacity-80">
          Sin orden cronológico obligatorio. Busca por título, o deja que algo
          te llame la atención.
        </p>

        <div className="mt-10 max-w-xl">
          <label htmlFor="blog-search" className="ed-ribbon-label block mb-3">
            Buscar
          </label>
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ border: '1px solid var(--color-ink)' }}
          >
            <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
            <input
              id="blog-search"
              type="text"
              placeholder="Buscar por título…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent ed-body outline-none placeholder:text-[color:var(--color-muted)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="shrink-0 transition-colors hover:text-[color:var(--color-don-red)]"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Laboratorios */}
      {searchQuery === '' && labList.length > 0 && (
        <section className="ed-container py-16 md:py-20">
          <SectionHeader idx="Laboratorios" tag={`${labList.length} ${labList.length === 1 ? 'recorrido completo' : 'recorridos completos'}`} />
          <div className="lab-list mt-10">
            {labList.map((lab) => (
              <LabRow
                key={lab.slug}
                slug={lab.slug}
                title={lab.title}
                summary={lab.summary}
                urlBase={lab.urlBase}
                parts={lab.stats.guides}
              />
            ))}
          </div>
        </section>
      )}

      {/* Artículos */}
      <section className="ed-container py-16 md:py-20" style={{ borderTop: '1px solid rgba(246,246,246,0.14)' }}>
        <SectionHeader idx="Artículos" tag={`${posts.length} ${posts.length === 1 ? 'artículo' : 'artículos'} · cronológico`} />
        {filtered.length === 0 ? (
          <div className="mx-auto max-w-xl py-16 md:py-24">
            <h2 className="ed-display mt-12">Aquí todavía no hay nada.</h2>
            <p className="ed-deck mt-6 opacity-80">
              Publicamos cuando hay algo que probar, no antes.
              {hasAnyPosts && filterIsActive
                ? ' Prueba con otro término o vuelve a todo el archivo.'
                : ' Vuelve cuando quieras.'}
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              {filterIsActive && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="ed-btn ed-btn-invert"
                >
                  Ver todo el archivo
                </button>
              )}
              <Link href="/#contacto" className="ed-btn">
                Escribirnos
              </Link>
            </div>
          </div>
        ) : (
          <div className="lab-list mt-10">
            {filtered.map((post) => (
              <ProductCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                date={post.date}
                authorSlugs={post.authorSlugs}
                excerpt={post.excerpt}
                variant={post.variant}
                index={post.index}
                totalCount={totalPosts}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
