export function TopicChip({ children, active = false, onClick }: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="whitespace-nowrap rounded-full border px-4 py-2 text-[12px] font-medium transition-colors duration-150"
      style={{
        borderColor: active ? '#171412' : '#D4CCC0',
        background: active ? '#171412' : '#FFFFFF',
        color: active ? '#FFFFFF' : '#171412',
      }}
    >
      {children}
    </button>
  )
}
