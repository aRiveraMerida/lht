export function TopicChip({ children, active = false, onClick }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`lht-chip ${active ? 'lht-chip-active' : ''}`}
    >
      {children}
    </button>
  )
}
