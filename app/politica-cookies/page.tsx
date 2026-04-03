import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga.',
};

export default function PoliticaCookies() {
  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-[700px] mx-auto ">
      <h1 className="text-4xl font-bold text-text mb-4">Política de Cookies</h1>
      <p className="text-sm text-text/50 mb-10">Última actualización: enero 2025</p>

      <div className="space-y-8 text-text/80 leading-relaxed">
        <p>
          Este sitio no usa cookies de análisis, publicidad ni seguimiento.
          Solo cookies técnicas necesarias para su funcionamiento.
        </p>

        <p>
          La analítica se realiza con Vercel Analytics (sin cookies, sin datos personales).
        </p>

        <p>
          Contacto: [COMPLETAR EMAIL]
        </p>
      </div>
    </div>
  );
}
