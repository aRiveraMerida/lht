'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { SectionLabel, SectionRibbon } from '@/components/SectionLabel'
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
      ? 'grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-3 md:gap-x-8'
      : filtered.length === 2
        ? 'grid grid-cols-1 gap-10 md:grid-cols-2 max-w-5xl mx-auto md:gap-x-8'
        : 'grid grid-cols-1 gap-10 max-w-4xl mx-auto'

  return (
    <div>
      {/* Header */}
      <section className="ed-rule-b-soft">
        <div className="ed-container py-16 md:py-20">
          <SectionLabel>Archivo</SectionLabel>
          <h1 className="ed-display-xl mt-6 max-w-[14ch]">
            Todo lo publicado.
          </h1>
          <p className="ed-deck mt-8 max-w-2xl text-ink/80">
            Sin orden cronológico obligatorio. Busca por categoría, o deja que algo te
            llame la atención.
          </p>

          <div className="mt-10 max-w-xl">
            <label htmlFor="blog-search" className="ed-ribbon-label text-ink block mb-3">
              Buscar
            </label>
            <div className="flex items-center gap-3 border-2 border-ink px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
              <input
                id="blog-search"
                type="text"
                placeholder="Buscar por título…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent ed-body text-ink outline-none placeholder:text-muted"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="shrink-0 text-muted hover:text-link transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Topics (horizontal rule of filters) */}
      <section className="sticky top-[132px] bg-paper z-40 ed-rule-b">
        <div className="ed-container">
          <div className="flex gap-x-8 gap-y-0 overflow-x-auto py-4 -mx-4 px-4 md:mx-0 md:px-0">
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
        <div className="ed-container py-16 md:py-20">
          {filtered.length === 0 ? (
            <div className="mx-auto max-w-xl py-16 md:py-24">
              <SectionLabel>Sin resultados</SectionLabel>
              <h2 className="ed-display mt-5">Aquí todavía no hay nada.</h2>
              <p className="ed-deck mt-6 text-ink/80">
                Publicamos cuando hay algo que probar, no antes.
                {hasAnyPosts && filterIsActive
                  ? ' Prueba otra categoría o vuelve al archivo completo.'
                  : ' Vuelve o apúntate a la newsletter si quieres que te avisemos.'}
              </p>
              <div className="mt-8 flex gap-3 flex-wrap">
                {filterIsActive && (
                  <button
                    onClick={() => { setActiveCategory('Todos'); setSearchQuery('') }}
                    className="ed-btn ed-btn-invert"
                  >
                    Ir al archivo completo
                  </button>
                )}
                <Link href="/#suscribete" className="ed-btn">
                  Apuntarme a la newsletter
                </Link>
              </div>
            </div>
          ) : (
            <>
              <SectionRibbon>
                {filtered.length} {filtered.length === 1 ? 'Publicación' : 'Publicaciones'}
              </SectionRibbon>
              <div className={`mt-12 ${gridClass}`}>
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
            </>
          )}
        </div>
      </section>
    </div>
  )
}
