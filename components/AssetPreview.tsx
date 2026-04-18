'use client'

export type PreviewVariant = 'cover' | 'window' | 'shell'

// WIRED editorial: image rectangles are square-cornered placeholders until
// real art direction ships. Gray wash + oversize issue number, nothing more.
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
      <div className="absolute top-4 left-5 ed-kicker text-ink/70">
        LHT · Nº {label}
      </div>
      <div
        aria-hidden="true"
        className="absolute bottom-3 right-5 font-[var(--font-display)] text-[clamp(6rem,12vw,10rem)] leading-none text-ink/10 select-none"
      >
        {label}
      </div>
    </div>
  )
}
