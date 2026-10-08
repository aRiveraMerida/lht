'use client'

import { useState } from 'react'
import { Brand, CONCEPTS, HEX_CONCEPTS } from './marks'
import { TONES, toneStyle, type Tone } from './shared'

const CHOICES: { id: Tone; name: string }[] = [
  { id: 'paper', name: 'Papel' },
  { id: 'ink', name: 'Tinta' },
  { id: 'moss', name: 'Musgo' },
  { id: 'clay', name: 'Arcilla' },
]

/** The hub's opening: the proposed mark, large, on a background the reader can change. */
export function HeroStage() {
  const [tone, setTone] = useState<Tone>('ink')
  const t = TONES[tone]
  const soft = `color-mix(in oklch, ${t.fg} 72%, ${t.bg})`
  const lines = Array.from({ length: 13 }, (_, i) => i * 4)

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden rounded-[var(--radius-md)] border border-rule transition-colors duration-700"
      style={toneStyle(tone)}
    >
      <svg viewBox="0 0 48 48" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {lines.map((n) => (
          <g key={n} stroke={t.rule} strokeWidth={0.035}>
            <path d={`M${n} 0V48`} />
            <path d={`M0 ${n}H48`} />
          </g>
        ))}
      </svg>

      <div className="relative grid items-center gap-10 px-6 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:px-12 md:py-16">
        <div key={tone} className="mk-arrive mx-auto w-full max-w-[16rem] md:max-w-[22rem]">
          <Brand className="h-auto w-full" />
        </div>

        <div>
          <p className="font-mono text-[0.75rem] uppercase tracking-[0.16em]" style={{ color: soft }}>
            Interno · sin publicar · 29-sep-2026
          </p>
          <h1
            id="hero-title"
            className="mt-4 font-display text-[clamp(2.25rem,5vw,4rem)] font-medium leading-[1.02] tracking-tight"
            style={{ fontVariationSettings: '"opsz" 120' }}
          >
            La casa a cuestas,
            <br />
            <span style={{ color: soft }}>sin prisa.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] text-[1.0625rem] leading-relaxed" style={{ color: soft }}>
            {CONCEPTS.length + HEX_CONCEPTS.length} ideas de logo, una propuesta: <strong>el caparazón hexagonal</strong>. Todo con
            el mismo método, medido a 16 píxeles y en una sola tinta.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div role="group" aria-label="Fondo de la marca" className="flex gap-2">
              {CHOICES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={tone === c.id}
                  onClick={() => setTone(c.id)}
                  className="rounded-full border px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-widest transition-colors"
                  style={{
                    borderColor: tone === c.id ? t.fg : t.rule,
                    background: tone === c.id ? t.fg : 'transparent',
                    color: tone === c.id ? t.bg : t.fg,
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
            <a href="/marca/logo" className="font-medium underline underline-offset-4" style={{ color: 'inherit' }}>
              Ver el proceso →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
