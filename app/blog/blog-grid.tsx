'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { SectionLabel } from '@/components/SectionLabel'
import { TopicChip } from '@/components/TopicChip'
import { ProductCard } from '@/components/ProductCard'
import type { PreviewVariant } from '@/lib/assets'

interface PostMeta {
  slug: string
  category: string
  title: string
  date: string
  authorSlugs: string[]
  excerpt: string
  variant: PreviewVariant
  index: number
  featured?: boolean
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

  const hasAnyPosts = posts.length > 0
  const filterIsActive = activeCategory !== 'Todos' || searchQuery !== ''

  const gridClass =
    filtered.length >= 3
      ? 'grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'
      : filtered.length === 2
        ? 'grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto'
        : 'grid grid-cols-1 gap-8 max-w-3xl mx-auto'

  return (
    <div>
      {/* Header */}
      <section className="hairline-b">
        <div className="fg-container py-20 md:py-24">
          <SectionLabel>Archivo</SectionLabel>
          <h1 className="fg-display mt-6 max-w-[16ch]">Todo lo publicado.</h1>
          <p className="fg-body-lg mt-6 max-w-2xl text-ink/65">
            Sin orden cronológico obligatorio. Busca por categoría, o deja que algo te
            llame la atención.
          </p>

          <div className="mt-10 flex max-w-xl items-center gap-3 rounded-full bg-black/5 px-5 py-3.5">
            <Search className="h-4 w-4 shrink-0 text-ink/50" aria-hidden="true" />
            <input
              type="text"
              placeholder="Buscar por título…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent fg-body text-ink outline-none placeholder:text-ink/45"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="shrink-0 text-ink/50 hover:text-ink transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Topics (pill tab bar) */}
      <section className="hairline-b sticky top-[65px] bg-paper/90 backdrop-blur-md z-40">
        <div className="fg-container py-4">
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
            {categories.map((cat) => (
              <div key={cat} className="shrink-0">
                <TopicChip
                  active={activeCategory === cat}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </TopicChip>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="fg-container py-16 md:py-20">
          {filtered.length === 0 ? (
            <div className="mx-auto max-w-xl text-center py-16 md:py-24">
              <h2 className="fg-section-heading">
                {filterIsActive ? 'Aquí todavía no hay nada.' : 'Aquí todavía no hay nada.'}
              </h2>
              <p className="fg-body-lg mt-6 text-ink/65">
                Publicamos cuando hay algo que probar, no antes.
                {hasAnyPosts && filterIsActive
                  ? ' Prueba otra categoría o vuelve al archivo completo.'
                  : ' Vuelve o apúntate a la newsletter si quieres que te avisemos.'}
              </p>
              <div className="mt-8 flex justify-center gap-3 flex-wrap">
                {filterIsActive && (
                  <button
                    onClick={() => { setActiveCategory('Todos'); setSearchQuery('') }}
                    className="fg-btn fg-btn-primary"
                  >
                    Ir al archivo completo
                  </button>
                )}
                <Link href="/#suscribete" className="fg-btn fg-btn-glass-dark">
                  Apuntarme a la newsletter
                </Link>
              </div>
            </div>
          ) : (
            <div className={gridClass}>
              {filtered.map((post, i) => (
                <ProductCard
                  key={post.slug}
                  slug={post.slug}
                  category={post.category}
                  title={post.title}
                  date={post.date}
                  authorSlugs={post.authorSlugs}
                  excerpt={post.excerpt}
                  variant={post.variant}
                  index={i}
                  featured={filtered.length === 1 && post.featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
