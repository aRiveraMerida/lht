'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { SectionHeader } from '@/components/SectionLabel'
import { TopicChip } from '@/components/TopicChip'
import { ProductCard } from '@/components/ProductCard'
import type { PreviewVariant } from '@/lib/assets'
import { course } from '@/lib/course'

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

// Inline tile that shows the program as a featured archive item.
function ProgramRow() {
  return (
    <Link
      href="/blog/claude-code"
      className="lab-item group block"
      style={{ borderTop: '1px solid rgba(246,246,246,0.14)' }}
    >
      <div
        className="lab-num"
        style={{ color: 'var(--color-don-red)', opacity: 1 }}
      >
        Programa
      </div>
      <div className="lab-body">
        <h3 className="lab-title">{course.title}</h3>
        <p className="lab-desc">{course.summary}</p>
      </div>
      <div className="lab-tag">
        <span className="lab-dot">●</span> Laboratorio largo
      </div>
      <div className="lab-read">
        {course.stats.guides} guías · Leer
      </div>
    </Link>
  )
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

  // Program row shows in 'Todos' and 'Programas', ignoring search text
  const showProgramRow =
    searchQuery === '' &&
    (activeCategory === 'Todos' || activeCategory === 'Programas')

  const hasAnyPosts = posts.length > 0
  const filterIsActive = activeCategory !== 'Todos' || searchQuery !== ''

  const totalRows = filtered.length + (showProgramRow ? 1 : 0)
  const totalPosts = posts.length

  return (
    <div>
      {/* Header */}
      <section className="ed-container" style={{ paddingTop: 130 }}>
        <SectionHeader
          idx="Archivo"
          tag="Todos los laboratorios · cronológico"
        />

        <h1 className="ed-display-xl mt-10 max-w-[14ch]">
          Todo lo publicado.
        </h1>
        <p className="ed-deck mt-8 max-w-2xl opacity-80">
          Sin orden cronológico obligatorio. Busca por categoría, o deja que algo
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

      {/* Category filters */}
      <section
        className="sticky top-[80px] z-30 backdrop-blur"
        style={{
          background: 'rgba(0,0,0,0.85)',
          borderTop: '1px solid rgba(246,246,246,0.14)',
          borderBottom: '1px solid rgba(246,246,246,0.14)',
          marginTop: 60,
        }}
      >
        <div className="ed-container">
          <div className="flex gap-x-8 gap-y-0 overflow-x-auto py-4">
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

      {/* List */}
      <section className="ed-container py-16 md:py-20">
        {totalRows === 0 ? (
          <div className="mx-auto max-w-xl py-16 md:py-24">
            <SectionHeader idx="Sin resultados" tag="Aquí todavía no hay nada" />
            <h2 className="ed-display mt-12">Aquí todavía no hay nada.</h2>
            <p className="ed-deck mt-6 opacity-80">
              Publicamos cuando hay algo que probar, no antes.
              {hasAnyPosts && filterIsActive
                ? ' Prueba otra categoría o vuelve a todo el archivo.'
                : ' Vuelve o entra al newsletter para que te avisemos.'}
            </p>
            <div className="mt-8 flex gap-3 flex-wrap">
              {filterIsActive && (
                <button
                  type="button"
                  onClick={() => { setActiveCategory('Todos'); setSearchQuery('') }}
                  className="ed-btn ed-btn-invert"
                >
                  Ver todo el archivo
                </button>
              )}
              <Link href="/#newsletter" className="ed-btn">
                Apuntarme al newsletter
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="ed-meta opacity-60 mb-8">
              {totalRows} {totalRows === 1 ? 'laboratorio' : 'laboratorios'}
            </div>
            <div className="lab-list">
              {showProgramRow && <ProgramRow />}
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
                  index={post.index}
                  totalCount={totalPosts}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
