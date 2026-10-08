'use client'

import { useState } from 'react'

// Static captures, not iframes: the site sends X-Frame-Options: DENY on every
// route, and that header is production security, not ours to relax for a test.
// Captured from the dev server with reduced motion so every reveal is visible.
export const STYLES = [
  { id: 'tortuga', name: 'Tortuga', href: '/', note: 'El sitio antes de Papel blanco (captura del 8-oct).' },
  { id: 'noir', name: 'Noir', href: '/marca/estilos/noir', note: 'La presentación de referencia, aplicada a LHT.' },
  { id: 'mezcla', name: 'Mezcla', href: '/marca/estilos/mezcla', note: 'La maquetación de Noir con la identidad de Tortuga.' },
] as const

type StyleId = (typeof STYLES)[number]['id']
type Mode = 'dark' | 'light'
type Device = 'escritorio' | 'movil'
type Section = 'portada' | 'articulos'
type Layout = 'una' | 'tres'

function Seg<T extends string>({ label, value, set, options }: { label: string; value: T; set: (v: T) => void; options: { id: T; name: string; disabled?: boolean }[] }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap items-center gap-2">
      <span className="eyebrow mr-1 min-w-[5.5rem]">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          disabled={o.disabled}
          onClick={() => set(o.id)}
          className="btn btn--secondary !min-h-9 !px-3 !text-[0.8125rem] disabled:opacity-40"
          style={value === o.id ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent-2)', boxShadow: 'inset 0 0 0 1px var(--color-accent)' } : undefined}
        >
          {o.name}
        </button>
      ))}
    </div>
  )
}

export function StyleCompare() {
  const [layout, setLayout] = useState<Layout>('tres')
  const [current, setCurrent] = useState<StyleId>('mezcla')
  const [mode, setMode] = useState<Mode>('dark')
  const [device, setDevice] = useState<Device>('escritorio')
  const [section, setSection] = useState<Section>('portada')
  const shown = layout === 'una' ? STYLES.filter((s) => s.id === current) : STYLES
  // Only the desktop has an articles capture.
  const sec: Section = device === 'movil' ? 'portada' : section
  const ratio = device === 'movil' ? '390 / 844' : '1440 / 900'

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Seg label="Vista" value={layout} set={setLayout} options={[{ id: 'tres', name: 'Las tres' }, { id: 'una', name: 'Una a una' }]} />
        {layout === 'una' && <Seg label="Estilo" value={current} set={setCurrent} options={STYLES.map((s) => ({ id: s.id, name: s.name }))} />}
        <Seg label="Tema" value={mode} set={setMode} options={[{ id: 'dark', name: 'Oscuro' }, { id: 'light', name: 'Claro' }]} />
        <Seg label="Pantalla" value={device} set={setDevice} options={[{ id: 'escritorio', name: 'Escritorio · 1440' }, { id: 'movil', name: 'Móvil · 390' }]} />
        <Seg
          label="Sección"
          value={sec}
          set={setSection}
          options={[{ id: 'portada', name: 'Portada' }, { id: 'articulos', name: 'Artículos', disabled: device === 'movil' }]}
        />
      </div>

      <div
        className={
          layout === 'una'
            ? 'grid grid-cols-1'
            : device === 'movil'
              ? 'grid grid-cols-1 gap-6 sm:grid-cols-3'
              : 'grid grid-cols-1 gap-6 xl:grid-cols-3'
        }
      >
        {shown.map((s) => (
          <figure key={s.id} className="m-0 flex flex-col gap-2" style={device === 'movil' && layout === 'una' ? { maxWidth: 390, marginInline: 'auto', width: '100%' } : undefined}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="flex overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper-2" style={{ aspectRatio: ratio }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed-size captures, no optimisation wanted */}
              <img
                src={`/marca/estilos/${s.id}-${device}-${mode}-${sec}.jpg`}
                alt={`${s.name}, ${sec === 'portada' ? 'portada' : 'artículos'}, ${device === 'movil' ? 'móvil' : 'escritorio'}, tema ${mode === 'dark' ? 'oscuro' : 'claro'}`}
                className="h-full w-full object-cover object-top"
                loading="lazy"
              />
            </a>
            <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4">
              <span className="font-display text-[var(--text-md)]">{s.name}</span>
              <span className="type-sm">
                {s.note}{' '}
                <a href={s.href} target="_blank" rel="noopener noreferrer">Abrir la página viva ↗</a>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="type-sm">
        Son capturas de las páginas reales con movimiento reducido. Para ver el movimiento, el cambio
        de tema y la navegación con <kbd>J</kbd> y <kbd>K</kbd>, abre la página viva.
      </p>
    </div>
  )
}
