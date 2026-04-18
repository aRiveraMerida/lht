import { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga.',
};

export default function PoliticaCookies() {
  return (
    <div className="fg-container py-24 md:py-32">
      <div className="max-w-2xl">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="fg-section-heading mt-6">Política de Cookies</h1>
        <p className="fg-mono-label mt-4 text-ink/55">Última actualización: abril 2026</p>

        <div className="fg-reading mt-16 max-w-none">
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
