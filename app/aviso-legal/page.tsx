import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal de La Habitación Tortuga.',
};

export default function AvisoLegal() {
  return (
    <div className="page-width pb-16">
      <PageHeader eyebrow="Legal" title="Aviso legal" />
      <div className="mt-10">
        <div className="lesson-body">
          <p>En cumplimiento de la Ley 34/2002 (LSSI-CE):</p>
          <ul>
            <li><strong>Titular:</strong> Alberto Rivera Mérida</li>
            <li><strong>Domicilio:</strong> C/ Costa Rica</li>
            <li><strong>Email:</strong> hola@lahabitaciontortuga.com</li>
          </ul>
          <p>
            <strong>Actividad:</strong> Laboratorio sobre inteligencia artificial
            y adopción tecnológica en organizaciones.
          </p>
          <h2>Propiedad Intelectual</h2>
          <p>
            Todos los contenidos — textos, imágenes, diseño gráfico y código fuente — son
            propiedad de sus autores salvo indicación expresa. Queda prohibida su
            reproducción total o parcial sin autorización.
          </p>
        </div>
      </div>
    </div>
  );
}
