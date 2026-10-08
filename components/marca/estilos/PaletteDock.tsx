'use client'

import { useState } from 'react'

interface Option {
  id: string
  name: string
  dots: string[]
}

/** Prototype-only switcher: swaps data-palette live and keeps it in the URL (?paleta=). */
export function PaletteDock({ rootId, palettes, initial }: { rootId: string; palettes: Option[]; initial: string }) {
  const [current, setCurrent] = useState(initial)

  const choose = (id: string) => {
    document.getElementById(rootId)?.setAttribute('data-palette', id)
    const url = new URL(window.location.href)
    url.searchParams.set('paleta', id)
    window.history.replaceState(null, '', url)
    setCurrent(id)
  }

  return (
    <div className="dock" role="group" aria-label="Paleta del prototipo">
      <span className="dock-label">Paleta</span>
      {palettes.map((p) => (
        <button key={p.id} type="button" aria-pressed={current === p.id} aria-label={p.name} title={p.name} onClick={() => choose(p.id)}>
          <span aria-hidden="true" style={{ display: 'inline-flex', gap: 2, padding: 0 }}>
            {p.dots.map((c, i) => <i key={i} style={{ background: c }} />)}
          </span>
          <span className="dock-name" aria-hidden="true">{p.name}</span>
        </button>
      ))}
    </div>
  )
}
