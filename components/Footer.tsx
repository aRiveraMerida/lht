import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="ed-rule mt-24">
      <div className="ed-container py-10 flex flex-wrap items-center justify-between gap-4">
        <div className="ed-meta opacity-65">
          © 2026 La Habitación Tortuga
        </div>
        <div className="ed-meta opacity-65">
          Un laboratorio del equipo de{' '}
          <a
            href="https://www.thepower.education"
            target="_blank"
            rel="noopener noreferrer"
            className="ed-link"
          >
            The Power
          </a>
        </div>
        <div
          className="ed-meta flex flex-wrap gap-x-5 gap-y-2"
          style={{ opacity: 0.6 }}
        >
          <Link href="/aviso-legal" className="hover:text-link transition-colors">Aviso legal</Link>
          <Link href="/politica-cookies" className="hover:text-link transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
