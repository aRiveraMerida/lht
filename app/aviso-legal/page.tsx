import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Aviso legal de La Habitación Tortuga.',
};

export default function AvisoLegal() {
  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-[700px] mx-auto min-h-screen">
      <h1 className="font-serif text-4xl font-bold text-ink mb-10">Aviso Legal</h1>

      <div className="space-y-8 text-ink/80 leading-relaxed">
        <p>
          En cumplimiento de la Ley 34/2002 (LSSI-CE):
        </p>

        <div className="space-y-2">
          <p><strong>Titular:</strong> Alberto Rivera Mérida</p>
          <p><strong>NIF:</strong> [COMPLETAR]</p>
          <p><strong>Domicilio:</strong> [COMPLETAR]</p>
          <p><strong>Email:</strong> [COMPLETAR]</p>
        </div>

        <p>
          <strong>Actividad:</strong> Blog y newsletter sobre inteligencia artificial
          y adopción tecnológica en organizaciones.
        </p>

        <h2 className="font-serif text-2xl font-bold text-ink pt-4">Propiedad Intelectual</h2>
        <p>
          Todos los contenidos — textos, imágenes, diseño gráfico y código fuente —
          son propiedad de sus autores salvo indicación expresa. Queda prohibida
          su reproducción total o parcial sin autorización.
        </p>
      </div>
    </div>
  );
}
