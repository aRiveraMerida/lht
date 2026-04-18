export function TopicChip({ children, active = false, onClick }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`fg-pill ${active ? 'fg-pill-active' : ''}`}
      type="button"
    >
      {children}
    </button>
  )
}
