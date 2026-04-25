'use client'

import { useState } from 'react'
import { unsubscribe } from '@/app/actions/unsubscribe'
import Link from 'next/link'
import { SectionHeader } from '@/components/SectionLabel'

export default function BajaPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    const result = await unsubscribe(formData)
    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setMessage(result.error || 'Ha ocurrido un error.')
    }
  }

  if (status === 'success') {
    return (
      <div className="ed-container" style={{ paddingTop: 130, paddingBottom: 100 }}>
        <div className="max-w-xl">
          <SectionHeader idx="Baja" tag="Hecho · sin rencor" />
          <h1 className="ed-display mt-12">Hecho.</h1>
          <p className="ed-deck mt-7 opacity-80">
            Ya no recibirás más correos. El archivo sigue abierto si quieres volver
            sin compromiso.
          </p>
          <div className="mt-10">
            <Link href="/blog" className="ed-btn ed-btn-invert">
              Ir al archivo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ed-container" style={{ paddingTop: 130, paddingBottom: 100 }}>
      <div className="max-w-xl">
        <SectionHeader idx="Baja" tag="Sin rencor" />
        <h1 className="ed-display mt-12">Darte de baja.</h1>
        <p className="ed-deck mt-7 opacity-80">
          Sin rencor. Si el contenido no te aporta, no tiene sentido que esté en tu
          bandeja.
        </p>

        <form action={handleSubmit} className="mt-12 flex flex-col gap-3">
          <label htmlFor="baja-email" className="ed-ribbon-label">
            Email con el que te suscribiste
          </label>
          <div className="flex flex-col gap-0 sm:flex-row">
            <input
              id="baja-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="ed-input flex-1 sm:border-r-0"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="ed-btn ed-btn-invert disabled:opacity-60"
            >
              {status === 'loading' ? 'Procesando…' : 'Darme de baja'}
            </button>
          </div>
        </form>
        {status === 'error' && (
          <p role="alert" className="ed-body mt-3 text-[color:var(--color-error)]">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
