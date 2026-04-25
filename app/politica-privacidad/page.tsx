import { Metadata } from 'next';
import { SectionHeader } from '@/components/SectionLabel';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad de La Habitación Tortuga.',
};

export default function PoliticaPrivacidad() {
  return (
    <div className="ed-container" style={{ paddingTop: 130, paddingBottom: 100 }}>
      <div className="max-w-2xl">
        <SectionHeader idx="Legal" tag="Política de privacidad" />
        <h1 className="ed-display mt-12">Política de Privacidad</h1>
        <p className="ed-meta mt-4 opacity-60">Última actualización: abril 2026</p>

        <div className="ed-reading mt-14 max-w-none">
          <h2>1. Responsable</h2>
          <p>The Power Education — hola@lahabitaciontortuga.com</p>

          <h2>2. Datos recogidos</h2>
          <p>Dirección de email.</p>

          <h2>3. Finalidad</h2>
          <p>Envío de newsletter «La Habitación Tortuga».</p>

          <h2>4. Base jurídica</h2>
          <p>Consentimiento explícito (Art. 6.1.a RGPD).</p>

          <h2>5. Conservación</h2>
          <p>Mientras dure la suscripción. Tras baja, eliminación en 30 días.</p>

          <h2>6. Destinatarios</h2>
          <p>
            Resend Inc. (envío de emails). Transferencia internacional con Cláusulas
            Contractuales Tipo (Art. 46 RGPD). Vercel Analytics (analítica web, sin
            datos personales, sin cookies).
          </p>

          <h2>7. Derechos</h2>
          <p>Acceso, rectificación, supresión, oposición, portabilidad, limitación.</p>
          <p>Contacto: hola@lahabitaciontortuga.com</p>
          <p>
            Reclamación ante AEPD:{' '}
            <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
              https://www.aepd.es
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
