import Link from 'next/link';
import { TurtleLogo } from './TurtleLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="on-dark bg-ink text-paper mt-20">
      {/* Top ribbon marker */}
      <div className="border-b border-paper/15">
        <div className="ed-container py-4 flex items-center justify-between">
          <div className="ed-ribbon-label text-paper">La Habitación Tortuga [LHT]</div>
          <div className="ed-meta text-paper/60 hidden sm:block">Un archivo abierto sobre IA</div>
        </div>
      </div>

      <div className="ed-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <TurtleLogo className="h-8 w-8 text-paper" />
              <span className="ed-display text-[22px] leading-none text-paper">
                La Habitación Tortuga
              </span>
            </Link>

            <p className="ed-display-mid mt-8 max-w-sm text-paper">
              IA sin FOMO.
            </p>
            <p className="ed-body mt-4 max-w-sm text-paper/70">
              No tenemos todas las respuestas. Preferimos pensar despacio y acertar
              que correr y tropezar con lo mismo que todos. Si eso te suena, este
              también es tu sitio.
            </p>
          </div>

          <div>
            <div className="ed-ribbon-label text-paper/60">Navegación</div>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/" className="ed-link-ui text-paper hover:text-link">Inicio</Link>
              <Link href="/blog" className="ed-link-ui text-paper hover:text-link">Lecturas</Link>
              <Link href="/#suscribete" className="ed-link-ui text-paper hover:text-link">Comunidad</Link>
              <Link href="/baja" className="ed-link-ui text-paper hover:text-link">Darse de baja</Link>
            </div>
          </div>

          <div>
            <div className="ed-ribbon-label text-paper/60">Legal</div>
            <div className="mt-5 flex flex-col gap-3">
              <Link href="/aviso-legal" className="ed-link-ui text-paper hover:text-link">Aviso legal</Link>
              <Link href="/politica-privacidad" className="ed-link-ui text-paper hover:text-link">Privacidad</Link>
              <Link href="/politica-cookies" className="ed-link-ui text-paper hover:text-link">Cookies</Link>
            </div>
          </div>

          <div>
            <div className="ed-ribbon-label text-paper/60">Contacto</div>
            <div className="mt-5 flex flex-col gap-3">
              <a
                href="https://www.linkedin.com/in/albertoriveramerida"
                target="_blank"
                rel="noopener noreferrer"
                className="ed-link-ui text-paper hover:text-link"
              >
                Alberto Rivera
              </a>
              <a
                href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b"
                target="_blank"
                rel="noopener noreferrer"
                className="ed-link-ui text-paper hover:text-link"
              >
                David Dix Hidalgo
              </a>
              <a
                href="mailto:hola@lahabitaciontortuga.com"
                className="ed-link-ui text-paper hover:text-link break-all"
              >
                hola@lahabitaciontortuga.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-paper/15 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="ed-meta text-paper/50">
            © 2026 LHT · Equipo IA de ThePower Education
          </p>
          <p className="ed-meta text-paper/50">
            lahabitaciontortuga.com
          </p>
        </div>
      </div>
    </footer>
  );
};
