'use client'

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

  return (
    <div>
      {/* Header */}
      <section className="hairline-b">
        <div className="fg-container py-20 md:py-24">
          <SectionLabel>Archivo</SectionLabel>
          <h1 className="fg-display mt-6 max-w-[14ch]">
            Archivo.
          </h1>
          <p className="fg-body-lg mt-6 max-w-2xl text-ink/65">
            Dos profesionales de IA pensando despacio. Estrategia, adopción,
            laboratorios y lo que no se dice.
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

      {/* Transition banner */}
      <section className="hairline-b">
        <div className="fg-container py-8">
          <div className="flex items-start gap-3 rounded-lg bg-black/5 p-5 md:p-6">
            <span
              className="shrink-0 mt-1.5 h-2 w-2 rounded-full"
              style={{ background: '#FFE55C' }}
              aria-hidden="true"
            />
            <p className="fg-body text-ink/80">
              Los primeros artículos de La Habitación Tortuga son de Alberto.
              A partir de aquí, escribimos los dos. Los posts generales van firmados
              por LHT. Los específicos, por quien los escribe.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="fg-container py-16 md:py-20">
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <p className="fg-feature-title">
                {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay artículos aquí.'}
              </p>
              <button
                onClick={() => { setActiveCategory('Todos'); setSearchQuery('') }}
                className="fg-btn fg-btn-glass-dark mt-6"
              >
                Ver todos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
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
                  featured={post.featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
