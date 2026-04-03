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
  meta: string
  excerpt: string
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
      <section className="border-b-2 border-lht-line">
        <div className="lht-container py-8 md:py-10">
          <SectionLabel>Archivo</SectionLabel>
          <h1 className="lht-display mt-4 text-display">Archivo</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-7 text-lht-muted">
            Dos profesionales de IA pensando despacio. Estrategia, adopción, laboratorios y lo que no se dice.
          </p>

          <div className="mt-5 flex max-w-xl items-center gap-3 border-2 border-lht-line bg-lht-paper px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-lht-muted" />
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-lht-ink outline-none placeholder:text-lht-muted"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="shrink-0 text-[11px] font-black uppercase tracking-[0.18em] text-lht-muted hover:text-lht-ink">
                Limpiar
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="border-b-2 border-lht-line">
        <div className="lht-container py-4">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <TopicChip key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>
                {cat}
              </TopicChip>
            ))}
          </div>
        </div>
      </section>

      {/* Transition banner */}
      <section className="border-b-2 border-lht-line">
        <div className="lht-container py-4">
          <div className="lht-panel bg-lht-yellow">
            <p className="text-sm leading-6 text-lht-ink">
              Los primeros artículos de La Habitación Tortuga son de Alberto. A partir de aquí, escribimos los dos.
              Los posts generales van firmados por LHT. Los específicos, por quien los escribe.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="lht-container py-8 md:py-10">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="lht-title">
                {searchQuery ? `Sin resultados para "${searchQuery}"` : 'No hay artículos aquí.'}
              </p>
              <button
                onClick={() => { setActiveCategory('Todos'); setSearchQuery(''); }}
                className="lht-btn lht-btn-secondary mt-4"
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
                  meta={post.meta}
                  excerpt={post.excerpt}
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
