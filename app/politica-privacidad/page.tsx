import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de La Habitación Tortuga.',
};

export default function PoliticaPrivacidad() {
  return (
    <div className="pt-28 pb-20 px-4 md:px-8 max-w-[700px] mx-auto min-h-screen">
      <h1 className="font-serif text-4xl font-bold text-ink mb-4">Política de Privacidad</h1>
      <p className="text-sm text-ink/50 mb-10">Última actualización: enero 2025</p>

      <div className="space-y-8 text-ink/80 leading-relaxed">
        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">1. Responsable</h2>
          <p>Alberto Rivera Mérida — [COMPLETAR EMAIL]</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">2. Datos recogidos</h2>
          <p>Dirección de email.</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">3. Finalidad</h2>
          <p>Envío de newsletter &ldquo;La Habitación Tortuga&rdquo;.</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">4. Base jurídica</h2>
          <p>Consentimiento explícito (Art. 6.1.a RGPD).</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">5. Conservación</h2>
          <p>Mientras dure la suscripción. Tras baja, eliminación en 30 días.</p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">6. Destinatarios</h2>
          <p>
            Resend Inc. (envío de emails). Transferencia internacional con Cláusulas
            Contractuales Tipo (Art. 46 RGPD). Vercel Analytics (analítica web, sin
            datos personales, sin cookies).
          </p>
        </div>

        <div>
          <h2 className="font-serif text-xl font-bold text-ink mb-2">7. Derechos</h2>
          <p>
            Acceso, rectificación, supresión, oposición, portabilidad, limitación.
          </p>
          <p className="mt-2">Contacto: [COMPLETAR EMAIL]</p>
          <p className="mt-2">
            Reclamación ante AEPD:{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer"
              className="text-bark underline hover:text-moss">
              https://www.aepd.es
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
