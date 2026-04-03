'use client'

import { TurtleLogo } from './TurtleLogo'

export type PreviewVariant = 'cover' | 'window' | 'shell'

const colors = ['bg-lht-red', 'bg-lht-blue', 'bg-lht-green']

export function AssetPreview({ variant, index = 0 }: { variant: PreviewVariant; index?: number }) {
  const bg = colors[index % colors.length]

  if (variant === 'cover') {
    return (
      <div className={`lht-asset ${bg} text-lht-paper`}>
        <div className="flex h-full flex-col justify-between">
          <div className="text-[10px] font-black uppercase tracking-[0.18em]">LHT / Field essay</div>
          <div className="max-w-[12rem] font-[var(--font-display)] text-[28px] font-black uppercase leading-[0.92] tracking-[-0.04em] md:text-[34px]">
            No corras.<br />Mira mejor.
          </div>
          <div className="flex items-center justify-between">
            <div className="border-2 border-white/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]">
              criterio primero
            </div>
            <TurtleLogo className="h-8 w-8 text-white/40" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'window') {
    return (
      <div className={`lht-asset ${bg} text-lht-paper`}>
        <div className="overflow-hidden border-2 border-white/40 bg-lht-paper">
          <div className="flex items-center gap-2 border-b-2 border-lht-line p-2">
            <div className="h-3 w-3 rounded-full bg-lht-red" />
            <div className="h-3 w-3 rounded-full bg-lht-yellow" />
            <div className="h-3 w-3 rounded-full bg-lht-green" />
          </div>
          <div className="p-3">
            <div className="h-12 border-2 border-lht-line bg-lht-grey" />
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="h-8 border-2 border-lht-line bg-lht-paper" />
              <div className="h-8 border-2 border-lht-line bg-lht-yellow" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // shell
  return (
    <div className={`lht-asset ${bg} text-lht-paper`}>
      <div className="flex h-full flex-col justify-between">
        <div className="text-[10px] font-black uppercase tracking-[0.18em]">Inside LHT</div>
        <div className="font-[var(--font-display)] text-[28px] font-black uppercase leading-[0.92] tracking-[-0.04em]">
          Think<br />harder.
        </div>
        <div className="text-[14px] text-white/70">Better questions.</div>
      </div>
    </div>
  )
}
