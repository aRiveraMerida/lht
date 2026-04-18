'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AssetPreview } from './AssetPreview'
import type { PreviewVariant } from '@/lib/assets'
import { getAuthors } from '@/lib/authors'

interface ProductCardProps {
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

export function ProductCard({
  slug,
  category,
  title,
  date,
  authorSlugs,
  excerpt,
  variant,
  index,
  featured = false,
}: ProductCardProps) {
  const authors = getAuthors(authorSlugs)
  const authorLabel =
    authors.length === 0
      ? ''
      : authors.length === 1
        ? authors[0].name.toUpperCase()
        : `${authors[0].name.toUpperCase()} Y ${authors.length - 1} MÁS`

  const dateLabel = new Date(date)
    .toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase()

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`fg-card ${featured ? 'md:col-span-2 xl:col-span-3' : ''}`}
    >
      <Link href={`/blog/${slug}`} className="block">
        <AssetPreview variant={variant} index={index} />

        <div className={`p-6 md:p-7 ${featured ? 'md:p-10' : ''}`}>
          <span className="ed-kicker text-ink">{category}</span>

          <h3 className={`mt-4 ${featured ? 'fg-section-heading max-w-3xl' : 'fg-feature-title'}`}>
            {title}
          </h3>

          <p className={`mt-3 text-ink/70 ${featured ? 'fg-body-lg max-w-2xl' : 'fg-body'}`}>
            {excerpt}
          </p>

          <p className="fg-mono-label mt-5 text-ink/50">
            {dateLabel}{authorLabel ? ` · ${authorLabel}` : ''}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
