import { Card } from '@/components/tortuga'

interface ProductCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  index: number
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

// One article in a list, as a Tortuga card.
// `index` sets the ART number; pass `totalCount` to count down from the total.
export function ProductCard({ slug, title, date, excerpt, index, totalCount }: ProductCardProps) {
  const number =
    typeof totalCount === 'number'
      ? String(totalCount - index).padStart(2, '0')
      : String(index + 1).padStart(2, '0')

  return (
    <Card
      href={`/blog/${slug}`}
      eyebrow={`Art ${number}`}
      title={title}
      desc={excerpt}
      meta={formatDateLabel(date)}
    />
  )
}
