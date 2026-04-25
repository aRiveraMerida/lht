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
      className={`ed-btn-label py-2 px-1 transition-colors border-b-2 ${
        active
          ? 'text-ink border-[color:var(--color-don-red)]'
          : 'text-[color:var(--color-muted)] border-transparent hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}
