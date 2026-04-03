import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-lht-line bg-lht-paper">
      <div className="lht-container py-8">
        <div className="grid grid-cols-1 gap-6 border-b-2 border-lht-line pb-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="lht-kicker">La Habitación Tortuga</div>
            <div className="lht-title mt-4 max-w-2xl">
              IA sin FOMO.
            </div>
            <p className="mt-4 max-w-2xl text-[15px] leading-7">
              No tenemos todas las respuestas. Pero preferimos pensar despacio y acertar
              que correr y tropezar con lo mismo que todos. Si eso te suena, ya eres tortuga. 🐢
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          <div>
            <div className="lht-kicker">Navegación</div>
            <div className="mt-4 grid gap-2 text-[14px] font-bold uppercase tracking-[0.12em]">
              <Link href="/" className="hover:text-lht-blue">Inicio</Link>
              <Link href="/blog" className="hover:text-lht-blue">Blog</Link>
              <Link href="/#suscribete" className="hover:text-lht-blue">Suscríbete</Link>
              <Link href="/baja" className="hover:text-lht-blue">Darse de baja</Link>
            </div>
          </div>

          <div>
            <div className="lht-kicker">Legal</div>
            <div className="mt-4 grid gap-2 text-[14px] font-bold uppercase tracking-[0.12em]">
              <Link href="/aviso-legal" className="hover:text-lht-blue">Aviso Legal</Link>
              <Link href="/politica-privacidad" className="hover:text-lht-blue">Privacidad</Link>
              <Link href="/politica-cookies" className="hover:text-lht-blue">Cookies</Link>
            </div>
          </div>

          <div>
            <div className="lht-kicker">Contacto</div>
            <div className="mt-4 grid gap-2 text-[14px] leading-7">
              <a href="https://www.linkedin.com/in/albertoriveramerida" target="_blank" rel="noopener noreferrer" className="hover:text-lht-blue">LinkedIn · Alberto Rivera</a>
              <a href="https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b" target="_blank" rel="noopener noreferrer" className="hover:text-lht-blue">LinkedIn · David Dix Hidalgo</a>
              <span>hola@lahabitaciontortuga.com</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t-2 border-lht-line pt-4 text-[11px] text-lht-muted">
          © 2025 La Habitación Tortuga · Alberto Rivera · David Dix Hidalgo
        </div>
      </div>
    </footer>
  );
};
