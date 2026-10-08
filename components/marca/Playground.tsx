'use client'

import { useState } from 'react'
import { M1, U1b, X, type Mark } from './marks'
import { Lockup, Tile, type Tone } from './shared'

const MARKS: { id: string; name: string; Mark: Mark; file: string }[] = [
  { id: 'placa', name: 'Placa', Mark: X.placa, file: 'caparazon' },
  { id: 'pequena', name: 'Placa pequeña', Mark: X.placaPequena, file: 'caparazon-pequeno' },
  { id: 'panal', name: 'Panal', Mark: X.panal, file: 'panal' },
  { id: 'umbral', name: 'Umbral', Mark: U1b, file: 'umbral' },
  { id: 'h', name: 'H-habitación', Mark: M1, file: 'h-habitacion' },
]

const TONE_LIST: { id: Tone; name: string }[] = [
  { id: 'paper', name: 'Papel' },
  { id: 'paper2', name: 'Superficie' },
  { id: 'ink', name: 'Tinta' },
  { id: 'moss', name: 'Musgo' },
  { id: 'clay', name: 'Arcilla' },
]

function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { id: T; name: string }[]
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="eyebrow mb-1">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className="btn btn--secondary !min-h-9 !px-3 !text-[0.8125rem]"
            data-active={value === o.id ? 'true' : undefined}
            style={value === o.id ? { borderColor: 'var(--color-accent)', color: 'var(--color-accent-2)', boxShadow: 'inset 0 0 0 1px var(--color-accent)' } : undefined}
          >
            {o.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

/** Live bench: pick a mark, a background and a size, with or without the name. */
export function Playground() {
  const [markId, setMarkId] = useState('placa')
  const [tone, setTone] = useState<Tone>('paper')
  const [size, setSize] = useState(96)
  const [withName, setWithName] = useState<'simbolo' | 'linea' | 'apilado'>('simbolo')
  const current = MARKS.find((m) => m.id === markId) ?? MARKS[0]
  const M = current.Mark

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <Tile tone={tone} className="min-h-[22rem] p-8" label={`${current.name} sobre ${tone}`}>
        <div key={`${markId}-${tone}-${withName}`} className="mk-arrive inline-flex">
          {withName === 'simbolo' ? (
            <span className="inline-flex" style={{ width: size, height: size }}>
              <M className="h-full w-full" />
            </span>
          ) : (
            <span className="inline-flex" style={{ zoom: size / 96 }}>
              <Lockup Mark={M} variant={withName === 'linea' ? 'linea' : 'apilado'} markClass="h-10 w-10" />
            </span>
          )}
        </div>
      </Tile>
      <div className="flex flex-col gap-5">
        <Segmented label="Marca" value={markId} onChange={setMarkId} options={MARKS.map((m) => ({ id: m.id, name: m.name }))} />
        <Segmented label="Fondo" value={tone} onChange={setTone} options={TONE_LIST} />
        <Segmented
          label="Con nombre"
          value={withName}
          onChange={setWithName}
          options={[
            { id: 'simbolo', name: 'Solo símbolo' },
            { id: 'linea', name: 'En línea' },
            { id: 'apilado', name: 'Apilado' },
          ]}
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="size" className="eyebrow">Tamaño · {size} px</label>
          <input
            id="size"
            type="range"
            min={16}
            max={200}
            step={4}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full accent-[var(--color-accent)]"
          />
          <div className="flex gap-2 text-[0.75rem]">
            {[16, 24, 32, 64, 128].map((n) => (
              <button key={n} type="button" onClick={() => setSize(n)} className="underline decoration-rule underline-offset-2 hover:decoration-accent">
                {n}
              </button>
            ))}
          </div>
        </div>
        {current.file && (
          <a href={`/marca/${current.file}.svg`} download className="btn btn--secondary self-start">Descargar SVG</a>
        )}
      </div>
    </div>
  )
}
