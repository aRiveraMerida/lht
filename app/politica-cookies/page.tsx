import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga. Este sitio no usa cookies de seguimiento.',
};

export default function PoliticaCookies() {
  return (
    <div className="px-4 py-16 md:px-8 md:py-20 max-w-[700px] mx-auto">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text mb-4 md:text-4xl">Política de Cookies</h1>
      <p className="text-sm text-text-muted mb-10">Última actualización: abril 2026</p>

      <div className="space-y-8 text-[15px] text-text/80 leading-7">
        <p>
          Este sitio no usa cookies de análisis, publicidad ni seguimiento.
          Solo cookies técnicas necesarias para su funcionamiento.
        </p>

        <p>
          La analítica se realiza con Vercel Analytics (sin cookies, sin datos personales).
        </p>

        <p>
          Contacto: hola@lahabitaciontortuga.com
        </p>
      </div>
    </div>
  );
}
