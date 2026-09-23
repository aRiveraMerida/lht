import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies de La Habitación Tortuga.',
};

export default function PoliticaCookies() {
  return (
    <div className="page-width pb-16">
      <PageHeader eyebrow="Legal" title="Política de cookies" meta={<span>Última actualización: abril 2026</span>} />
      <div className="mt-10">
        <div className="lesson-body">
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
