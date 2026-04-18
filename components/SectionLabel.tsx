export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="ed-kicker-bold text-ink">{children}</div>
}

// Full-bleed black ribbon variant — use for major section markers (e.g. "MOST POPULAR").
export function SectionRibbon({ children }: { children: React.ReactNode }) {
  return (
    <div className="ed-ribbon">
      <span className="ed-ribbon-label text-paper">{children}</span>
    </div>
  )
}
