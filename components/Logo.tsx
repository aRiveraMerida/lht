interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M10 35C10 20 20 10 30 10C40 10 50 20 50 35" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <path d="M10 35H50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="55" cy="35" r="4" fill="currentColor"/>
    <path d="M15 35V45M45 35V45" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);
