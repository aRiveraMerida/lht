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
      setMessage('Te has dado de baja correctamente.')
    } else {
      setStatus('error')
      setMessage(result.error || 'Ha ocurrido un error.')
    }
  }

  return (
    <div className="fg-container py-24 md:py-32">
      <div className="max-w-xl">
        <SectionLabel>Darse de baja</SectionLabel>
        <h1 className="fg-section-heading mt-6">Darse de baja</h1>
        <p className="fg-body-lg mt-6 text-ink/65">
          Introduce el email con el que te suscribiste. Sin preguntas, sin trucos.
        </p>

        {status === 'success' ? (
          <div className="mt-12 rounded-lg bg-black/5 p-8">
            <p className="fg-feature-title">{message}</p>
            <Link
              href="/"
              className="fg-body mt-4 inline-block underline underline-offset-2"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                name="email"
                required
                placeholder="tu@email.com"
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
            {status === 'error' && (
              <p className="fg-body mt-3 text-[#FF4DA6]">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
