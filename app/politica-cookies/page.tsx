import { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga.',
};

export default function PoliticaCookies() {
  return (
    <div className="ed-container" style={{ paddingTop: 130, paddingBottom: 100 }}>
      <div className="max-w-2xl">
        <SectionHeader idx="Legal" tag="Política de cookies" />
        <h1 className="ed-display mt-12">Política de Cookies</h1>
        <p className="ed-meta mt-4 opacity-60">Última actualización: abril 2026</p>

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
