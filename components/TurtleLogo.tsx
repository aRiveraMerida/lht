export function TurtleLogo({ className = "", strokeWidth = 4 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={className} aria-hidden="true">
      <path d="M10 35C10 20 20 10 30 10C40 10 50 20 50 35"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <path d="M10 35H50"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <circle cx="55" cy="35" r="4" fill="currentColor" />
      <path d="M15 35V45M45 35V45"
        stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}
