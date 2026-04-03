import Link from 'next/link';
import { TurtleLogo } from './TurtleLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-bg text-brown">
              <TurtleLogo className="h-7 w-7" />
            </Link>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.14em] text-text">
                La Habitación Tortuga
              </div>
              <div className="mt-0.5 text-[11px] text-text-muted">
                © 2025 · Alberto Rivera · David Dix Hidalgo
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-medium text-text-muted">
            <Link href="/" className="transition-colors hover:text-text">Inicio</Link>
            <Link href="/blog" className="transition-colors hover:text-text">Blog</Link>
            <Link href="/#suscribete" className="transition-colors hover:text-text">Suscríbete</Link>
            <Link href="/baja" className="transition-colors hover:text-text">Darse de baja</Link>
            <Link href="/aviso-legal" className="transition-colors hover:text-text">Aviso Legal</Link>
            <Link href="/politica-privacidad" className="transition-colors hover:text-text">Privacidad</Link>
            <Link href="/politica-cookies" className="transition-colors hover:text-text">Cookies</Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-wrap gap-5 border-t border-border pt-6 text-[11px] text-text-muted">
          <a href="https://www.linkedin.com/in/albertoriveramerida" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text">LinkedIn · Alberto Rivera</a>
          <a href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-text">LinkedIn · David Dix Hidalgo</a>
        </div>
      </div>
    </footer>
  );
};
