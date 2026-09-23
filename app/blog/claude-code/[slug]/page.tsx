import type { Metadata } from 'next'
import { labs, getLabGuide } from '@/lib/labs'
import { getGuideContent } from '@/lib/guides'
import { LabGuide } from '@/components/LabGuide'

const lab = labs['claude-code']

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return lab.sequence.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getLabGuide(lab.slug, slug)
  if (!guide) return { title: 'Capítulo no encontrado' }

  const url = `https://lahabitaciontortuga.com${lab.urlBase}/${slug}`
  const content = getGuideContent(lab.slug, slug)
  const description =
    content?.excerpt ??
    `${guide.kicker} — ${guide.title}. Parte del laboratorio de Claude Code en La Habitación Tortuga.`

  return {
    title: guide.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description,
      type: 'article',
      url,
      siteName: 'La Habitación Tortuga [LHT]',
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.title,
      description,
    },
  }
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  return <LabGuide lab={lab} slug={slug} breadcrumbLabel="Claude Code" />
}
