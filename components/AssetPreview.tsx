'use client'

export type PreviewVariant = 'cover' | 'window' | 'shell'

// Dark editorial: image rectangles are minimal placeholders.
// LHT label + oversized condensed issue number, nothing more.
export function AssetPreview({
  variant,
  index = 0,
}: {
  variant?: PreviewVariant
  index?: number
}) {
  void variant
  const label = String(index + 1).padStart(2, '0')

  return (
    <div className="ed-cover">
      <div className="absolute top-4 left-5 ed-kicker">
        LHT · LAB {label}
      </div>
      <div
        aria-hidden="true"
        className="absolute -bottom-2 right-4 font-[var(--font-display)] leading-none select-none"
        style={{
          fontWeight: 800,
          fontStretch: 'condensed',
          fontSize: 'clamp(6rem, 14vw, 10rem)',
          color: 'rgba(246, 246, 246, 0.08)',
          letterSpacing: '-0.02em',
        }}
      >
        {label}
      </div>
    </div>
  )
}
