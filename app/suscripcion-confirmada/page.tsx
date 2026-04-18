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
    <div className="fg-container py-24 md:py-32">
      <div className="max-w-xl">
        <SectionLabel>Dentro</SectionLabel>
        <h1 className="fg-section-heading mt-6">Ya eres parte del espacio.</h1>
        <p className="fg-body-lg mt-6 text-ink/65">
          Te acabamos de enviar un correo. Si no lo ves, revisa spam — a veces los
          proveedores piensan que somos sospechosos por no mandar basura.
        </p>

        <div className="mt-10">
          <div className="fg-mono-label text-ink/55">Qué esperar</div>
          <ul className="fg-body-lg mt-4 space-y-2 text-ink/80">
            <li>— Un correo esta semana o la que viene</li>
            <li>— Nunca más de uno por semana</li>
            <li>— Puedes responder siempre. Lo leemos.</li>
          </ul>
        </div>

        <div className="mt-12">
          <Link href="/blog" className="fg-btn fg-btn-primary">
            Volver al archivo
          </Link>
        </div>
      </div>
    </div>
  )
}
