'use client'

import { useState } from 'react'
import palettes from './palettes.json'

type Mode = 'light' | 'dark'
type Section = 'portada' | 'articulos' | 'laboratorios'

const ROLES: { key: keyof (typeof palettes)[number]['swatches']['light']; label: string }[] = [
  { key: 'bg', label: 'Fondo' },
  { key: 'surface', label: 'Superficie' },
  { key: 'ink', label: 'Tinta' },
  { key: 'muted', label: 'Texto 2' },
  { key: 'signal', label: 'Señal' },
  { key: 'second', label: 'Casa' },
  { key: 'third', label: 'Resalte' },
  { key: 'seam', label: 'Iluminado' },
]

function Seg<T extends string>({ label, value, set, options }: { label: string; value: T; set: (v: T) => void; options: { id: T; name: string }[] }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1 min-w-[5.5rem]">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => set(o.id)}
          className="btn btn--secondary !min-h-9 !px-3 !text-[0.8125rem]"
          style={value === o.id ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent-2)', boxShadow: 'inset 0 0 0 1px var(--color-accent)' } : undefined}
        >
          {o.name}
        </button>
      ))}
    </div>
  )
}

/** Lowest ratio among the text pairs, and whether every pair clears its WCAG minimum. */
function worst(c: Record<string, number[]>) {
  const pairs = Object.entries(c)
  const min = pairs.reduce((m, [, [r]]) => Math.min(m, r), Infinity)
  const ok = pairs.every(([, [r, need]]) => r >= need)
  return { min, ok }
}

export function PaletteCompare() {
  const [mode, setMode] = useState<Mode>('light')
  const [section, setSection] = useState<Section>('portada')

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Seg label="Tema" value={mode} set={setMode} options={[{ id: 'light', name: 'Claro' }, { id: 'dark', name: 'Oscuro' }]} />
        <Seg label="Sección" value={section} set={setSection} options={[{ id: 'portada', name: 'Portada' }, { id: 'articulos', name: 'Artículos' }, { id: 'laboratorios', name: 'Laboratorios' }]} />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {palettes.map((p) => {
          const sw = p.swatches[mode]
          const c = worst(p.contrast[mode] as Record<string, number[]>)
          return (
            <article key={p.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                <h3 className="type-lg">{p.name}</h3>
                <a className="type-sm" href={`/marca/estilos/mezcla?paleta=${p.id}`} target="_blank" rel="noopener noreferrer">Abrir viva ↗</a>
              </div>
              <a
                href={`/marca/estilos/mezcla?paleta=${p.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex overflow-hidden rounded-[var(--radius-md)] border border-rule"
                style={{ aspectRatio: '1440 / 900' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size captures */}
                <img
                  src={`/marca/estilos/paleta/${p.id}-${mode}-${section}.jpg`}
                  alt={`Mezcla con la paleta ${p.name}, ${section}, tema ${mode === 'dark' ? 'oscuro' : 'claro'}`}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              </a>
              <ul className="m-0 grid list-none grid-cols-4 gap-2 p-0 sm:grid-cols-8" aria-label={`Muestras de ${p.name}`}>
                {ROLES.map((r) => (
                  <li key={r.key} className="flex flex-col gap-1">
                    <span className="h-10 rounded-[var(--radius-sm)] border border-rule" style={{ background: sw[r.key] }} />
                    <span className="text-[0.6875rem] leading-tight text-muted">{r.label}</span>
                    <code className="text-[0.625rem] text-muted">{sw[r.key]}</code>
                  </li>
                ))}
              </ul>
              <p className="type-sm">
                {p.note}{' '}
                <span className={`badge ${c.ok ? 'badge--progress' : 'badge--locked'}`}>
                  {c.ok ? 'AA en todo el texto' : 'Falla AA'} · mínimo {c.min.toFixed(1)}:1
                </span>
              </p>
            </article>
          )
        })}
      </div>
    </div>
  )
}
