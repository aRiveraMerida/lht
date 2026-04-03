import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga.',
};

export default function PoliticaCookies() {
  return (
    <div className="lht-container py-16 md:py-20">
      <div className="max-w-[700px]">
        <h1 className="lht-title text-[32px] md:text-[40px]">Política de Cookies</h1>
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-lht-muted">Última actualización: abril 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-lht-muted">
          <p>Este sitio no usa cookies de análisis, publicidad ni seguimiento. Solo cookies técnicas necesarias para su funcionamiento.</p>
          <p>La analítica se realiza con Vercel Analytics (sin cookies, sin datos personales).</p>
          <p>Contacto: hola@lahabitaciontortuga.com</p>
        </div>
      </div>
    </div>
  );
}
