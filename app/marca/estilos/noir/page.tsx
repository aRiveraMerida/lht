import type { Metadata } from 'next'
import { HomeProto } from '@/components/marca/estilos/HomeProto'

export const metadata: Metadata = { title: 'Prototipo · Noir' }

export default function NoirPage() {
  return <HomeProto skin="noir" />
}
