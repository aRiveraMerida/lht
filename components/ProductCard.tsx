'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { AssetPreview } from './AssetPreview'
import type { PreviewVariant } from '@/lib/assets'

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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="lht-card"
    >
      <Link href={`/blog/${slug}`}>
        <AssetPreview variant={variant} index={index} />

        <div className="p-5 md:p-6">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.16em]">
            <span>{category}</span>
            <span>+</span>
          </div>

          <h3 className="lht-title mt-4">
            {title}
          </h3>

          <p className="mt-4 text-[11px] font-black uppercase tracking-[0.16em] text-lht-muted">
            {meta}
          </p>

          <p className="mt-4 text-[15px] leading-7">
            {excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
