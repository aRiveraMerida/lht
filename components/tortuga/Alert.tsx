import { CircleCheck, CircleX, TriangleAlert, Info } from 'lucide-react'

export type AlertTone = 'note' | 'success' | 'warning' | 'error'

const GLYPH = { note: Info, success: CircleCheck, warning: TriangleAlert, error: CircleX }

/**
 * Hairline all round, glyph carries the meaning — never colour alone.
 * Success, warning and error are the specimen's; "note" is a neutral
 * aside for content, kept in the 30 because it does not signal.
 */
export function Alert({
  tone,
  title,
  children,
}: {
  tone: AlertTone
  title?: React.ReactNode
  children?: React.ReactNode
}) {
  const Glyph = GLYPH[tone]
  return (
    <div className={`alert alert--${tone}`} role={tone === 'error' || tone === 'warning' ? 'alert' : 'note'}>
      <Glyph aria-hidden="true" />
      <div className="alert-body">
        {title && <strong className="alert-title">{title}</strong>}
        {children}
      </div>
    </div>
  )
}
