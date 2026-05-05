import type { Metadata } from 'next'
import { LabIndex } from '@/components/LabIndex'
import { labs } from '@/lib/labs'

export const metadata: Metadata = {
  title: 'Laboratorio · Campaign Hub',
  description:
    'Laboratorio práctico de 7 partes para montar un sistema que automatiza el ciclo completo de producción de campañas con Google Sheets + Apps Script + Claude Code. ~4h la primera vez.',
  alternates: { canonical: 'https://lahabitaciontortuga.com/blog/campaign-hub' },
}

export default function CampaignHubIndex() {
  return <LabIndex lab={labs['campaign-hub']} breadcrumbLabel="Campaign Hub" />
}
