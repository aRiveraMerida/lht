'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { PreviewVariant } from '@/lib/assets'
import { getAuthors } from '@/lib/authors'

interface ProductCardProps {
  slug: string
  category: string
  title: string
  date: string
  authorSlugs: string[]
  excerpt: string
  variant?: PreviewVariant
  index: number
  featured?: boolean
  totalCount?: number
}

const MONTH_SHORT_ES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
]

function formatDateLabel(date: string) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTH_SHORT_ES[d.getMonth()]} ${d.getFullYear()}`
}

// Renders an archive list item — one row in the lab-list.
// `index` controls the LAB number; pass `totalCount` to count from total down.
export function ProductCard({
  slug,
  category,
  title,
  date,
  authorSlugs,
  excerpt,
  index,
  totalCount,
}: ProductCardProps) {
  void getAuthors(authorSlugs)

  // Numbering: most recent = highest LAB number.
  const labNumber =
    typeof totalCount === 'number'
      ? String(totalCount - index).padStart(2, '0')
      : String(index + 1).padStart(2, '0')

  const dateLabel = formatDateLabel(date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.03 }}
    >
      <Link href={`/blog/${slug}`} className="lab-item group block">
        <div className="lab-num">LAB {labNumber}</div>
        <div className="lab-body">
          <h3 className="lab-title">{title}</h3>
          {excerpt && <p className="lab-desc">{excerpt}</p>}
        </div>
        <div className="lab-tag">
          <span className="lab-dot">●</span> {category}
        </div>
        <div className="lab-read">
          {dateLabel}
          {dateLabel ? ' · ' : ''}Leer
        </div>
      </Link>
    </motion.div>
  )
}
