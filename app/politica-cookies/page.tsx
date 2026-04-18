import { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga.',
};

export default function PoliticaCookies() {
  return (
    <div className="ed-container py-20 md:py-28">
      <div className="max-w-2xl">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="ed-display mt-5">Política de Cookies</h1>
        <p className="ed-meta mt-4 text-muted">Última actualización: abril 2026</p>

        <div className="ed-reading mt-14 max-w-none">
          <p>
            Este sitio no usa cookies de análisis, publicidad ni seguimiento. Solo
            cookies técnicas necesarias para su funcionamiento.
          </p>
          <p>
            La analítica se realiza con Vercel Analytics (sin cookies, sin datos
            personales).
          </p>
          <p>Contacto: hola@lahabitaciontortuga.com</p>
        </div>
      </div>
    </div>
  );
}
