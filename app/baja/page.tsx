'use client'

import { useState } from 'react'
import { unsubscribe } from '@/app/actions/unsubscribe'
import Link from 'next/link'
import { SectionLabel } from '@/components/SectionLabel'

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
      <div className="fg-container py-24 md:py-32">
        <div className="max-w-xl">
          <SectionLabel>Baja</SectionLabel>
          <h1 className="fg-section-heading mt-6">Hecho.</h1>
          <p className="fg-body-lg mt-6 text-ink/65">
            Ya no recibirás más correos. El archivo sigue abierto si quieres volver sin
            compromiso.
          </p>
          <div className="mt-10">
            <Link href="/blog" className="fg-btn fg-btn-primary">
              Ir al archivo
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fg-container py-24 md:py-32">
      <div className="max-w-xl">
        <SectionLabel>Baja</SectionLabel>
        <h1 className="fg-section-heading mt-6">Darte de baja.</h1>
        <p className="fg-body-lg mt-6 text-ink/65">
          Sin rencor. Si el contenido no te aporta, no tiene sentido que esté en tu
          bandeja.
        </p>

        <form action={handleSubmit} className="mt-10 flex flex-col gap-3">
          <label htmlFor="baja-email" className="fg-mono-label text-ink/70">
            Email con el que te suscribiste
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="baja-email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="tu@correo.com"
              className="fg-input flex-1"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="fg-btn fg-btn-primary disabled:opacity-60"
            >
              {status === 'loading' ? 'Procesando…' : 'Darme de baja'}
            </button>
          </div>
        </form>
        {status === 'error' && (
          <p role="alert" className="fg-body mt-3 text-[#FF4DA6]">{message}</p>
        )}
      </div>
    </div>
  )
}
