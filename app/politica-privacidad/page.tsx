import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de La Habitación Tortuga.',
};

export default function PoliticaPrivacidad() {
  return (
    <div className="lht-container py-16 md:py-20">
      <div className="max-w-[700px]">
        <h1 className="lht-title text-[32px] md:text-[40px]">Política de Privacidad</h1>
        <p className="mt-2 text-[11px] font-black uppercase tracking-[0.18em] text-lht-muted">Última actualización: abril 2026</p>

        <div className="mt-10 space-y-8 text-[15px] leading-7 text-lht-muted">
          <div>
            <h2 className="lht-title text-[20px]">1. Responsable</h2>
            <p className="mt-2">Alberto Rivera Mérida — hola@lahabitaciontortuga.com</p>
          </div>
          <div><h2 className="lht-title text-[20px]">2. Datos recogidos</h2><p className="mt-2">Dirección de email.</p></div>
          <div><h2 className="lht-title text-[20px]">3. Finalidad</h2><p className="mt-2">Envío de newsletter «La Habitación Tortuga».</p></div>
          <div><h2 className="lht-title text-[20px]">4. Base jurídica</h2><p className="mt-2">Consentimiento explícito (Art. 6.1.a RGPD).</p></div>
          <div><h2 className="lht-title text-[20px]">5. Conservación</h2><p className="mt-2">Mientras dure la suscripción. Tras baja, eliminación en 30 días.</p></div>
          <div><h2 className="lht-title text-[20px]">6. Destinatarios</h2><p className="mt-2">Resend Inc. (envío de emails). Transferencia internacional con Cláusulas Contractuales Tipo (Art. 46 RGPD). Vercel Analytics (analítica web, sin datos personales, sin cookies).</p></div>
          <div>
            <h2 className="lht-title text-[20px]">7. Derechos</h2>
            <p className="mt-2">Acceso, rectificación, supresión, oposición, portabilidad, limitación.</p>
            <p className="mt-2">Contacto: hola@lahabitaciontortuga.com</p>
            <p className="mt-2">Reclamación ante AEPD: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-lht-blue underline hover:text-lht-ink">https://www.aepd.es</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
