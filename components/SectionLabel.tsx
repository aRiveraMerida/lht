// Section label = idx + tag with hairline rule below.
// Use SectionLabel for the kicker alone (e.g. "ARCHIVO"),
// or SectionHeader to render the full header band with right-aligned tag.

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="ed-kicker-bold">{children}</div>
}

export function SectionHeader({
  idx,
  tag,
}: {
  idx: React.ReactNode
  tag?: React.ReactNode
}) {
  return (
    <div className="ed-section-header">
      <span className="ed-section-idx">{idx}</span>
      {tag ? <span className="ed-section-tag">{tag}</span> : null}
    </div>
  )
}

// Inline red ribbon for accent counts / markers (e.g. "5 LABORATORIOS").
export function SectionRibbon({ children }: { children: React.ReactNode }) {
  return (
    <div className="ed-ribbon">
      <span className="ed-ribbon-label">{children}</span>
    </div>
  )
}
