'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import { SectionLabel } from '@/components/SectionLabel'
import { TopicChip } from '@/components/TopicChip'
import { ProductCard } from '@/components/ProductCard'
import type { PreviewVariant } from '@/lib/assets'

interface PostMeta {
  slug: string
  category: string
  title: string
  author: string
  meta: string
  excerpt: string
  tone: string
  variant: PreviewVariant
  index: number
}

export function BlogGrid({ posts, categories }: { posts: PostMeta[]; categories: string[] }) {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || 'Todos'

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = posts.filter((post) => {
    const matchesCategory = activeCategory === 'Todos' || post.category === activeCategory
    const matchesSearch = searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      {/* Header */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8">
          <SectionLabel>Archivo</SectionLabel>
          <h1 className="mt-3 text-[clamp(2.2rem,6vw,4.2rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-text">
            Archivo
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-text-muted">
            Todos los artículos del laboratorio. Estrategia, automatizaciones, experimentos
            y las preguntas que nadie se atreve a hacer.
          </p>

          {/* Search */}
          <div className="mt-5 flex w-full max-w-xl items-center gap-3 rounded-full border border-border bg-bg px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-text-muted" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="shrink-0 text-[11px] font-medium text-text-muted hover:text-text">
                Limpiar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 md:px-6 lg:px-8">
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <TopicChip key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                {cat}
              </TopicChip>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8 lg:px-8">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-text-muted">
                {searchQuery ? `No hay resultados para "${searchQuery}"` : 'No hay artículos en esta categoría.'}
              </p>
              <button
                onClick={() => { setActiveCategory('Todos'); setSearchQuery(''); }}
                className="mt-4 rounded-full border border-border bg-bg px-4 py-2 text-[12px] font-medium text-text transition-transform hover:-translate-y-0.5"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((post, i) => (
                <ProductCard
                  key={post.slug}
                  slug={post.slug}
                  category={post.category}
                  title={post.title}
                  author={post.author}
                  meta={post.meta}
                  excerpt={post.excerpt}
                  tone={post.tone}
                  variant={post.variant}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
