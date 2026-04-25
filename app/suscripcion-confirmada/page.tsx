import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionHeader } from '@/components/SectionLabel'

export const metadata: Metadata = {
  title: 'Ya estás dentro',
  description: 'Has confirmado tu suscripción a La Habitación Tortuga.',
  robots: { index: false, follow: false },
}

export default function SuscripcionConfirmada() {
  return (
    <div className="ed-container" style={{ paddingTop: 130, paddingBottom: 100 }}>
      <div className="max-w-xl">
        <SectionHeader idx="Dentro" tag="Confirmación recibida" />
        <h1 className="ed-display mt-12">Ya eres parte del laboratorio.</h1>
        <p className="ed-deck mt-7 opacity-80">
          Te acabamos de enviar un correo. Si no lo ves, revisa spam — a veces los
          proveedores piensan que somos sospechosos por no mandar basura.
        </p>

        <div
          className="mt-12 pt-6"
          style={{ borderTop: '1px solid rgba(246,246,246,0.18)' }}
        >
          <div className="ed-ribbon-label">Qué esperar</div>
          <ul className="ed-body mt-4 space-y-2 opacity-85">
            <li>— Un correo esta semana o la que viene</li>
            <li>— Nunca más de uno por semana</li>
            <li>— Puedes responder siempre. Lo leemos.</li>
          </ul>
        </div>

        <div className="mt-12">
          <Link href="/blog" className="ed-btn ed-btn-invert">
            Volver al archivo
          </Link>
        </div>
      </div>
    </div>
  )
}
