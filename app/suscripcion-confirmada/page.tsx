import type { Metadata } from 'next'
import Link from 'next/link'
import { SectionLabel } from '@/components/SectionLabel'

export const metadata: Metadata = {
  title: 'Ya estás dentro',
  description: 'Has confirmado tu suscripción a La Habitación Tortuga.',
  robots: { index: false, follow: false },
}

export default function SuscripcionConfirmada() {
  return (
    <div className="ed-container py-20 md:py-28">
      <div className="max-w-xl">
        <SectionLabel>Dentro</SectionLabel>
        <h1 className="ed-display mt-5">Ya eres parte del espacio.</h1>
        <p className="ed-deck mt-7 text-ink/80">
          Te acabamos de enviar un correo. Si no lo ves, revisa spam — a veces los
          proveedores piensan que somos sospechosos por no mandar basura.
        </p>

        <div className="mt-12 border-t border-ink pt-6">
          <div className="ed-ribbon-label text-ink">Qué esperar</div>
          <ul className="ed-body mt-4 space-y-2 text-ink/85">
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
