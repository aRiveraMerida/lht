import type { Metadata } from 'next'
import { HomeProto, PALETTE_IDS } from '@/components/marca/estilos/HomeProto'

export const metadata: Metadata = { title: 'Prototipo · Mezcla' }

export default async function MezclaPage({ searchParams }: { searchParams: Promise<{ paleta?: string }> }) {
  const { paleta } = await searchParams
  return <HomeProto skin="mezcla" palette={paleta && PALETTE_IDS.includes(paleta) ? paleta : undefined} />
}
