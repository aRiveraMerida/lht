'use client'

import { Circle } from 'lucide-react'
import { TurtleLogo } from './TurtleLogo'

const p = {
  border: "#D4CCC0",
  brown: "#4A372C",
  green: "#5F7A4D",
  blue: "#3E6F85",
  text: "#171412",
  textMuted: "#5E564F",
  surface: "#F7F4EF",
  bg: "#FFFFFF",
}

export type PreviewVariant = 'cover' | 'window' | 'shell'

export function PreviewAsset({ variant, tone }: { variant: PreviewVariant; tone: string }) {
  if (variant === 'cover') {
    return (
      <div className="aspect-[16/10] border-b p-5" style={{ background: tone, borderColor: p.border }}>
        <div className="flex h-full flex-col justify-between">
          <div className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: p.brown }}>
            La Habitación Tortuga
          </div>
          <div className="max-w-[13rem] text-[28px] font-semibold leading-[0.96] tracking-[-0.04em]" style={{ color: p.text }}>
            No corras.<br />Mira mejor.
          </div>
          <TurtleLogo className="h-10 w-10 text-brown" />
        </div>
      </div>
    )
  }

  if (variant === 'window') {
    return (
      <div className="aspect-[16/10] border-b p-5" style={{ background: tone, borderColor: p.border }}>
        <div className="overflow-hidden rounded-[18px] border bg-white" style={{ borderColor: p.brown }}>
          <div className="flex items-center gap-2 border-b p-3" style={{ borderColor: p.brown }}>
            <Circle className="h-3 w-3" style={{ fill: p.brown, color: p.brown }} />
            <Circle className="h-3 w-3" style={{ fill: p.green, color: p.green }} />
            <Circle className="h-3 w-3" style={{ fill: p.blue, color: p.blue }} />
          </div>
          <div className="p-4">
            <div className="h-16 rounded-[12px] border md:h-18" style={{ borderColor: p.brown, background: p.blue }} />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="h-10 rounded-[10px] border" style={{ borderColor: p.brown, background: p.surface }} />
              <div className="h-10 rounded-[10px] border" style={{ borderColor: p.brown, background: p.green }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // shell
  const shellPattern = {
    backgroundImage:
      'radial-gradient(circle at 25% 25%, rgba(95,122,77,0.10) 0, rgba(95,122,77,0.10) 16%, transparent 17%), radial-gradient(circle at 75% 25%, rgba(74,55,44,0.07) 0, rgba(74,55,44,0.07) 16%, transparent 17%), radial-gradient(circle at 50% 72%, rgba(62,111,133,0.07) 0, rgba(62,111,133,0.07) 18%, transparent 19%)',
    backgroundSize: '160px 140px',
  }

  return (
    <div className="aspect-[16/10] border-b p-5" style={{ ...shellPattern, backgroundColor: tone, borderColor: p.border }}>
      <div className="flex h-full flex-col justify-between">
        <div className="text-[11px] font-medium uppercase tracking-[0.16em]" style={{ color: p.brown }}>
          Inside LHT
        </div>
        <div className="text-[28px] font-semibold leading-[0.96] tracking-[-0.04em]" style={{ color: p.text }}>
          Think<br />slow
        </div>
        <div className="text-[14px]" style={{ color: p.textMuted }}>
          Better questions.
        </div>
      </div>
    </div>
  )
}
