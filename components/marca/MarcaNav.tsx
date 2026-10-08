'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ITEMS = [
  { href: '/marca', label: 'Hub' },
  { href: '/marca/logo', label: 'Logo' },
  { href: '/marca/sistema', label: 'Color y tipo' },
  { href: '/marca/identidad', label: 'Identidad' },
  { href: '/marca/movimiento', label: 'Movimiento' },
  { href: '/marca/estilos', label: 'Estilos' },
]

export function MarcaNav() {
  const path = usePathname()
  return (
    <nav aria-label="Laboratorio de marca" className="marca-nav">
      <span className="marca-nav-title">Laboratorio de marca</span>
      <ul>
        {ITEMS.map((i) => (
          <li key={i.href}>
            <Link href={i.href} aria-current={path === i.href ? 'page' : undefined}>{i.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
