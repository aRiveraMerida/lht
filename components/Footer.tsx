import Link from 'next/link';
import { TurtleLogo } from './TurtleLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="on-dark bg-ink text-paper mt-16">
      <div className="fg-container py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <TurtleLogo className="h-7 w-7 text-paper" />
              <span className="fg-body fw-540">La Habitación Tortuga</span>
            </Link>
            <p className="fg-feature-title mt-6 max-w-sm">
              IA sin FOMO.
            </p>
            <p className="fg-body-light mt-4 max-w-sm text-white/70">
              No tenemos todas las respuestas. Preferimos pensar despacio y acertar
              que correr y tropezar con lo mismo que todos. Si eso te suena, este
              también es tu sitio.
            </p>
          </div>

          <div>
            <div className="fg-mono-label text-white/60">Navegación</div>
            <div className="mt-4 flex flex-col gap-2.5 fg-body">
              <Link href="/" className="hover:text-white/70 transition-colors">Inicio</Link>
              <Link href="/blog" className="hover:text-white/70 transition-colors">Archivo</Link>
              <Link href="/#suscribete" className="hover:text-white/70 transition-colors">Suscribirse</Link>
              <Link href="/baja" className="hover:text-white/70 transition-colors">Darse de baja</Link>
            </div>
          </div>

          <div>
            <div className="fg-mono-label text-white/60">Legal</div>
            <div className="mt-4 flex flex-col gap-2.5 fg-body">
              <Link href="/aviso-legal" className="hover:text-white/70 transition-colors">Aviso legal</Link>
              <Link href="/politica-privacidad" className="hover:text-white/70 transition-colors">Privacidad</Link>
              <Link href="/politica-cookies" className="hover:text-white/70 transition-colors">Cookies</Link>
            </div>
          </div>

          <div>
            <div className="fg-mono-label text-white/60">Contacto</div>
            <div className="mt-4 flex flex-col gap-2.5 fg-body">
              <a
                href="https://www.linkedin.com/in/albertoriveramerida"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                Alberto Rivera
              </a>
              <a
                href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/70 transition-colors"
              >
                David Dix Hidalgo
              </a>
              <a href="mailto:hola@lahabitaciontortuga.com" className="hover:text-white/70 transition-colors">
                hola@lahabitaciontortuga.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="fg-mono-label text-white/50">
            © 2026 LHT · Equipo IA de ThePower Education
          </p>
          <p className="fg-mono-label text-white/50">
            Un archivo abierto sobre IA
          </p>
        </div>
      </div>
    </footer>
  );
};
