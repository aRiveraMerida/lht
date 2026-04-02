import { Circle } from 'lucide-react'

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-bark
      bg-cream px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.18em]
      text-bark md:text-[11px]">
      <Circle className="h-3 w-3 fill-current" />
      {children}
    </div>
  )
}
