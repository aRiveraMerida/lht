'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PreviewAsset } from './AssetPreview'
import type { PreviewVariant } from '@/lib/assets'

interface ProductCardProps {
  slug: string
  category: string
  title: string
  author: string
  meta: string
  excerpt: string
  tone: string
  variant: PreviewVariant
  index: number
}

export function ProductCard({ slug, category, title, author, meta, excerpt, tone, variant, index }: ProductCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="overflow-hidden rounded-[18px] border border-border bg-bg"
    >
      <Link href={`/blog/${slug}`}>
        <PreviewAsset variant={variant} tone={tone} />

        <div className="p-4 md:p-5">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-brown">
            {category}
          </div>
          <h3 className="mt-3 text-[26px] font-semibold leading-[1] tracking-[-0.04em] text-text">
            {title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            {meta}
          </p>
          <p className="mt-3 text-[15px] leading-7 text-text">
            {excerpt}
          </p>
        </div>
      </Link>
    </motion.article>
  )
}
