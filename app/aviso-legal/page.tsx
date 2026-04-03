import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal de La Habitación Tortuga. Información sobre el titular, actividad y propiedad intelectual.',
};

export default function AvisoLegal() {
  return (
    <div className="px-4 py-16 md:px-8 md:py-20 max-w-[700px] mx-auto">
      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text mb-10 md:text-4xl">Aviso Legal</h1>

      <div className="space-y-8 text-[15px] text-text/80 leading-7">
        <p>En cumplimiento de la Ley 34/2002 (LSSI-CE):</p>

        <div className="space-y-2">
          <p><strong className="text-text">Titular:</strong> Alberto Rivera Mérida</p>
          <p><strong className="text-text">Domicilio:</strong> C/ Costa Rica</p>
          <p><strong className="text-text">Email:</strong> hola@lahabitaciontortuga.com</p>
        </div>

        <p>
          <strong className="text-text">Actividad:</strong> Blog y newsletter sobre inteligencia artificial
          y adopción tecnológica en organizaciones.
        </p>

        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-text pt-4">Propiedad Intelectual</h2>
        <p>
          Todos los contenidos — textos, imágenes, diseño gráfico y código fuente —
          son propiedad de sus autores salvo indicación expresa. Queda prohibida
          su reproducción total o parcial sin autorización.
        </p>
      </div>
    </div>
  );
}
