import type { CSSProperties, ReactNode } from 'react'
import type { Mark } from './marks'

// Tortuga tokens, frozen per tone so light and dark sit side by side whatever
// theme the reader has on. Values mirror app/globals.css.
export const TONES = {
  paper: { bg: 'oklch(95.5% 0.016 118)', fg: 'oklch(26% 0.03 139)', accent: 'oklch(49% 0.082 135)', rule: 'oklch(66% 0.03 130)' },
  paper2: { bg: 'oklch(92% 0.018 120)', fg: 'oklch(26% 0.03 139)', accent: 'oklch(49% 0.082 135)', rule: 'oklch(66% 0.03 130)' },
  ink: { bg: 'oklch(17% 0.012 135)', fg: 'oklch(94% 0.012 120)', accent: 'oklch(72% 0.09 135)', rule: 'oklch(44% 0.03 135)' },
  moss: { bg: 'oklch(41% 0.08 135)', fg: 'oklch(95.5% 0.016 118)', accent: 'oklch(95.5% 0.016 118)', rule: 'oklch(55% 0.06 135)' },
  clay: { bg: 'oklch(92.5% 0.024 70)', fg: 'oklch(26% 0.03 139)', accent: 'oklch(46% 0.09 48)', rule: 'oklch(78% 0.045 62)' },
} as const

export type Tone = keyof typeof TONES

export function toneStyle(tone: Tone): CSSProperties {
  const t = TONES[tone]
  return { background: t.bg, color: t.fg, ['--logo-accent' as string]: t.accent, ['--tone-rule' as string]: t.rule }
}

/** A fixed-tone tile: the mark's "paper". */
export function Tile({
  tone = 'paper',
  className = '',
  children,
  label,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
  label?: string
}) {
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label}
      className={`relative flex items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-rule ${className}`}
      style={toneStyle(tone)}
    >
      {children}
    </div>
  )
}

export type LockupVariant = 'linea' | 'apilado' | 'suave' | 'minuscula' | 'siglas' | 'nombre'

export const LOCKUPS: { id: LockupVariant; name: string; note: string }[] = [
  { id: 'linea', name: 'Línea', note: 'Marca a la izquierda, nombre y lema en dos líneas. El de cabecera.' },
  { id: 'nombre', name: 'Solo nombre', note: 'Sin lema, para espacios estrechos.' },
  { id: 'apilado', name: 'Apilado', note: 'Marca arriba, centrado. Portadas y OG.' },
  { id: 'suave', name: 'Fraunces suave', note: 'Eje SOFT al máximo: redondea los remates y sigue al trazo.' },
  { id: 'minuscula', name: 'Minúsculas', note: 'Más cercano, pero pierde la tilde con mayúscula. Descartado por serio.' },
  { id: 'siglas', name: 'Siglas', note: 'LHT en mono, para avatar, favicon ampliado y sellos.' },
]

const NAME = 'La Habitación Tortuga'

/** Mark + wordmark. Never uses Tailwind's `block`: the site has its own `.block`. */
export function Lockup({
  Mark,
  variant = 'linea',
  className = '',
  markClass = 'h-10 w-10',
}: {
  Mark: Mark
  variant?: LockupVariant
  className?: string
  markClass?: string
}) {
  const display = (extra = ''): CSSProperties => ({
    fontVariationSettings: `"opsz" 36${extra}`,
  })

  if (variant === 'siglas') {
    return (
      <span className={`inline-flex items-center gap-3 ${className}`}>
        <Mark className={`${markClass} shrink-0`} />
        <span className="font-mono text-[1.5rem] font-semibold tracking-[0.18em]">LHT</span>
      </span>
    )
  }

  if (variant === 'apilado') {
    return (
      <span className={`inline-flex flex-col items-center gap-3 text-center ${className}`}>
        <Mark className="h-16 w-16" />
        <span className="font-display text-[1.75rem] font-medium leading-none tracking-tight" style={display()}>{NAME}</span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] opacity-70">La IA, despacio</span>
      </span>
    )
  }

  const nameClass = 'whitespace-nowrap font-display text-[1.375rem] font-medium leading-none tracking-tight'
  const text =
    variant === 'minuscula' ? 'la habitación tortuga' : NAME
  const style = variant === 'suave' ? display(', "SOFT" 100, "WONK" 1') : display()

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Mark className={`${markClass} shrink-0`} />
      <span className="flex flex-col gap-1.5">
        <span className={nameClass} style={style}>{text}</span>
        {variant !== 'nombre' && (
          <span className="font-mono text-[0.6875rem] uppercase leading-none tracking-[0.14em] opacity-70">
            LHT · La IA, despacio
          </span>
        )}
      </span>
    </span>
  )
}

/** Section wrapper for /marca pages: id for anchors, a numbered eyebrow, a rule above. */
export function Part({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string
  n: string
  title: string
  lead?: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 border-t border-rule py-12">
      <div className="eyebrow">{n}</div>
      <h2 id={`${id}-h`} className="type-xl mt-2">{title}</h2>
      {lead && <p className="mt-3 max-w-[62ch] text-ink-2">{lead}</p>}
      <div className="mt-8">{children}</div>
    </section>
  )
}
