import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal de La Habitación Tortuga.',
};

export default function AvisoLegal() {
  return (
    <div className="lht-container py-16 md:py-20">
      <div className="max-w-[700px]">
        <h1 className="lht-title text-[32px] md:text-[40px]">Aviso Legal</h1>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-lht-muted">
          <p>En cumplimiento de la Ley 34/2002 (LSSI-CE):</p>
          <div className="space-y-2">
            <p><strong className="text-lht-ink">Titular:</strong> Alberto Rivera Mérida</p>
            <p><strong className="text-lht-ink">Domicilio:</strong> C/ Costa Rica</p>
            <p><strong className="text-lht-ink">Email:</strong> hola@lahabitaciontortuga.com</p>
          </div>
          <p><strong className="text-lht-ink">Actividad:</strong> Blog y newsletter sobre inteligencia artificial y adopción tecnológica en organizaciones.</p>
          <h2 className="lht-title text-[24px] pt-4">Propiedad Intelectual</h2>
          <p>Todos los contenidos — textos, imágenes, diseño gráfico y código fuente — son propiedad de sus autores salvo indicación expresa. Queda prohibida su reproducción total o parcial sin autorización.</p>
        </div>
      </div>
    </div>
  );
}
