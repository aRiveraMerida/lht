import type { ReactNode } from 'react'
import type { Mark } from './marks'

// A mark over its 48×48 grid, with guides on top. Guides use the clay tone so
// they read as annotation, never as part of the mark.
export function Construction({ Mark, guides, label }: { Mark: Mark; guides: ReactNode; label: string }) {
  const lines = Array.from({ length: 13 }, (_, i) => i * 4)
  return (
    <div
      role="img"
      aria-label={label}
      className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper text-ink"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {lines.map((n) => (
          <g key={n} stroke="var(--color-rule)" strokeWidth={n % 12 === 0 ? 0.22 : 0.12}>
            <path d={`M${n} 0V48`} />
            <path d={`M0 ${n}H48`} />
          </g>
        ))}
      </svg>
      <Mark className="absolute inset-0 h-full w-full" />
      <svg
        viewBox="0 0 48 48"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        fill="none"
        stroke="var(--color-clay)"
        strokeWidth={0.35}
        strokeDasharray="1 0.8"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        {guides}
      </svg>
    </div>
  )
}

export const Note = ({ x, y, children, anchor = 'start' }: { x: number; y: number; children: ReactNode; anchor?: 'start' | 'end' | 'middle' }) => (
  <text x={x} y={y} fontSize={1.9} fill="var(--color-clay-2)" stroke="none" textAnchor={anchor}>
    {children}
  </text>
)
