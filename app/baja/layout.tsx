import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Darte de baja',
  description: 'Darte de baja de la newsletter de La Habitación Tortuga.',
  robots: { index: false, follow: false },
}

export default function BajaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
