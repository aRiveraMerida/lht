import Link from 'next/link';
import { TurtleLogo } from './TurtleLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-bark text-cream">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 mb-12">
          <div className="flex items-center gap-3">
            <TurtleLogo className="w-10 h-10 text-cream" />
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.16em]">
                La Habitación Tortuga <span className="text-cream/50">[LHT]</span>
              </div>
              <div className="text-[10px] text-cream/50 mt-1">
                © 2025 · Alberto Rivera · David Dix Hidalgo
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-3 text-[11px] font-semibold uppercase tracking-[0.1em]">
            <Link href="/" className="hover:text-sand transition-colors">Inicio</Link>
            <Link href="/blog" className="hover:text-sand transition-colors">Blog</Link>
            <a href="#suscribete" className="hover:text-sand transition-colors">Suscríbete</a>
            <Link href="/aviso-legal" className="hover:text-sand transition-colors">Aviso Legal</Link>
            <Link href="/politica-privacidad" className="hover:text-sand transition-colors">Privacidad</Link>
            <Link href="/politica-cookies" className="hover:text-sand transition-colors">Cookies</Link>
          </nav>
        </div>

        <div className="border-t border-cream/20 pt-8 flex flex-wrap gap-4 text-[10px] text-cream/50">
          <a
            href="https://www.linkedin.com/in/albertoriveramerida"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream transition-colors"
          >
            LinkedIn · Alberto Rivera
          </a>
          <a
            href="https://www.linkedin.com/in/daviddixhidalgo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cream transition-colors"
          >
            LinkedIn · David Dix Hidalgo
          </a>
        </div>
      </div>
    </footer>
  );
};
