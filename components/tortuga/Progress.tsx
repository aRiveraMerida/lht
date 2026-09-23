export function Progress({ value, max, label }: { value: number; max: number; label: React.ReactNode }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={typeof label === 'string' ? label : undefined}
      >
        <div className="progress-fill" style={{ '--pct': `${pct}%` } as React.CSSProperties} />
      </div>
      <span className="progress-label">{label}</span>
    </div>
  )
}
