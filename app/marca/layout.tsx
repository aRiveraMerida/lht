import type { Metadata } from 'next'
import { MarcaNav } from '@/components/marca/MarcaNav'

// Internal working area: not indexed, not in the sitemap, not linked from the site nav.
export const metadata: Metadata = {
  title: 'Laboratorio de marca',
  robots: { index: false, follow: false },
}

export default function MarcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="page-width"><MarcaNav /></div>
      {children}
    </>
  )
}
