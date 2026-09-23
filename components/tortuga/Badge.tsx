import { Check, Lock } from 'lucide-react'

type Status = 'done' | 'progress' | 'locked'

/**
 * Status badge. "Done" and "locked" are history and live in the 30;
 * only "in progress" — the one lesson you are on — takes the accent.
 */
export function Badge({ status, children }: { status: Status; children: React.ReactNode }) {
  return (
    <span className={`badge badge--${status}`}>
      {status === 'done' && <Check strokeWidth={2.4} aria-hidden="true" />}
      {status === 'locked' && <Lock strokeWidth={2} aria-hidden="true" />}
      {children}
    </span>
  )
}
