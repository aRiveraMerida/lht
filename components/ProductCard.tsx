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

// Renders an editorial story tile (was a card in the previous system).
// No shadow, no rounded corners, no colored covers. Hairline rule at the
// bottom separates it from the next tile.
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className={`ed-tile ${featured ? 'md:col-span-2 xl:col-span-3' : ''}`}
    >
      <Link href={`/blog/${slug}`} className="group block">
        <AssetPreview variant={variant} index={index} />

        <div className="pt-5">
          <span className="ed-kicker text-ink">{category}</span>

          <h3
            className={`ed-tile-headline mt-3 ${
              featured
                ? 'ed-display max-w-3xl'
                : 'font-[var(--font-display)] text-[1.5rem] leading-[1.18] tracking-[-0.3px]'
            }`}
          >
            {title}
          </h3>

          <p
            className={`mt-3 text-ink/80 ${
              featured ? 'ed-deck max-w-2xl' : 'ed-body'
            }`}
          >
            {excerpt}
          </p>

          <p className="ed-meta mt-5 text-muted">
            {dateLabel}{authorLabel ? ` · ${authorLabel}` : ''}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
