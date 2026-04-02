export function TopicChip({ children, active = false, onClick }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`whitespace-nowrap rounded-full border border-bark
        px-4 py-2 text-[11px] font-semibold tracking-[0.04em]
        transition-transform duration-150 hover:-translate-y-1 md:text-xs
        ${active ? 'bg-bark text-cream' : 'bg-cream text-ink'}`}
    >
      {children}
    </button>
  )
}
