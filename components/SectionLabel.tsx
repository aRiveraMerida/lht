export function SectionLabel({ number, children }: { number?: string; children: React.ReactNode }) {
  return (
    <div className="lht-label-row">
      {number && <span>{number}</span>}
      {number && <span className="lht-label-line" />}
      <span>{children}</span>
    </div>
  )
}
