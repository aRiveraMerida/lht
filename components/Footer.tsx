import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="page-width py-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 type-sm">
        <div>© 2026 La Habitación Tortuga</div>
        <div>
          Un laboratorio del equipo de{' '}
          <a
            href="https://www.thepower.education"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            The Power
          </a>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/aviso-legal" className="hover:text-ink transition-colors">Aviso legal</Link>
          <Link href="/politica-cookies" className="hover:text-ink transition-colors">Cookies</Link>
        </div>
      </div>
    </footer>
  );
};
