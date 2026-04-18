'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AssetPreview } from './AssetPreview'
import type { PreviewVariant } from '@/lib/assets'
import { getCategoryAccent } from '@/lib/palette'

interface ProductCardProps {
  slug: string
  category: string
  title: string
  meta: string
  excerpt: string
  variant: PreviewVariant
  index: number
}

export function ProductCard({ slug, category, title, meta, excerpt, variant, index }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="fg-card"
    >
      <Link href={`/blog/${slug}`} className="block">
        <AssetPreview variant={variant} index={index} />

        <div className="p-6 md:p-7">
          <span
            className="fg-cat-tag"
            style={{ ['--tag-color' as string]: getCategoryAccent(category) }}
          >
            {category}
          </span>

          <h3 className="fg-feature-title mt-4">
            {title}
          </h3>

          <p className="fg-body mt-3 text-ink/70">
            {excerpt}
          </p>

          <p className="fg-mono-label mt-5 text-ink/50">
            {meta}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
