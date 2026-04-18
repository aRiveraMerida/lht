'use client'

import { TurtleLogo } from './TurtleLogo'

export type PreviewVariant = 'cover' | 'window' | 'shell'

// Each card cover is a slice of the signature hero gradient, offset by index
// so consecutive cards don't look identical.
const gradientSlices = [
  'linear-gradient(135deg, #00D26A 0%, #FFE55C 60%, #8B5CF6 100%)',
  'linear-gradient(135deg, #FFE55C 0%, #8B5CF6 60%, #FF4DA6 100%)',
  'linear-gradient(135deg, #8B5CF6 0%, #FF4DA6 55%, #FFE55C 100%)',
  'linear-gradient(135deg, #FF4DA6 0%, #FFE55C 55%, #00D26A 100%)',
  'linear-gradient(135deg, #00D26A 0%, #8B5CF6 55%, #FF4DA6 100%)',
  'linear-gradient(135deg, #FFE55C 0%, #FF4DA6 55%, #8B5CF6 100%)',
]

export function AssetPreview({ variant, index = 0 }: { variant: PreviewVariant; index?: number }) {
  const background = gradientSlices[index % gradientSlices.length]

  if (variant === 'cover') {
    return (
      <div
        className="aspect-[4/3] p-6 md:p-7 text-white"
        style={{ background }}
      >
        <div className="flex h-full flex-col justify-between">
          <div className="fg-mono-label">LHT · Field essay</div>
          <div className="max-w-[14rem] text-[34px] md:text-[38px] fw-400 leading-[0.95] tracking-[-0.68px]">
            No corras.<br />Mira mejor.
          </div>
          <div className="flex items-center justify-between">
            <span className="fg-btn fg-btn-glass-light text-[13px] px-4 py-1.5">
              criterio primero
            </span>
            <TurtleLogo className="h-8 w-8 text-white/50" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'window') {
    return (
      <div
        className="aspect-[4/3] p-6 md:p-7 text-white"
        style={{ background }}
      >
        <div className="flex h-full flex-col justify-center">
          <div className="rounded-lg bg-white/95 overflow-hidden shadow-xl">
            <div className="flex items-center gap-1.5 px-3 py-2 border-b border-black/5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/20" />
            </div>
            <div className="p-3 space-y-2">
              <div className="h-10 rounded bg-black/5" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-6 rounded bg-black/5" />
                <div className="h-6 rounded bg-black/10" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // shell
  return (
    <div
      className="aspect-[4/3] p-6 md:p-7 text-white"
      style={{ background }}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="fg-mono-label">Inside LHT</div>
        <div className="text-[38px] md:text-[44px] fw-400 leading-[0.95] tracking-[-0.88px]">
          Think<br />harder.
        </div>
        <div className="fg-body-light text-white/75">Better questions.</div>
      </div>
    </div>
  )
}
