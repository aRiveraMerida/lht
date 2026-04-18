export function TopicChip({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`ed-btn-label uppercase tracking-[0.3px] py-2 px-1 transition-colors ${
        active
          ? 'text-ink border-b-2 border-ink'
          : 'text-muted border-b-2 border-transparent hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
