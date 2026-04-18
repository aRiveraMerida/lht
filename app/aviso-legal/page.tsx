import { Metadata } from 'next';
import { SectionLabel } from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal de La Habitación Tortuga.',
};

export default function AvisoLegal() {
  return (
    <div className="ed-container py-20 md:py-28">
      <div className="max-w-2xl">
        <SectionLabel>Legal</SectionLabel>
        <h1 className="ed-display mt-5">Aviso Legal</h1>

        <div className="ed-reading mt-14 max-w-none">
          <p>En cumplimiento de la Ley 34/2002 (LSSI-CE):</p>
          <ul>
            <li><strong>Titular:</strong> Alberto Rivera Mérida</li>
            <li><strong>Domicilio:</strong> C/ Costa Rica</li>
            <li><strong>Email:</strong> hola@lahabitaciontortuga.com</li>
          </ul>
          <p>
            <strong>Actividad:</strong> Blog y newsletter sobre inteligencia artificial y
            adopción tecnológica en organizaciones.
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
