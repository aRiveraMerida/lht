'use client'

import { useState } from 'react'
import { unsubscribe } from '@/app/actions/unsubscribe'
import Link from 'next/link'

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
    <div className="lht-container py-16 md:py-20">
      <div className="max-w-lg">
        <h1 className="lht-title text-[32px] md:text-[40px]">Darse de baja</h1>
        <p className="mt-4 text-[15px] leading-7 text-lht-muted">
          Introduce el email con el que te suscribiste. Sin preguntas, sin trucos.
        </p>

        {status === 'success' ? (
          <div className="mt-8 lht-panel">
            <p className="lht-title text-[22px]">{message}</p>
            <Link href="/" className="mt-4 inline-block text-sm text-lht-muted underline hover:text-lht-ink">Volver al inicio</Link>
          </div>
        ) : (
          <form action={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input type="email" name="email" required placeholder="tu@email.com" className="lht-input flex-1" />
              <button type="submit" disabled={status === 'loading'} className="lht-btn lht-btn-secondary disabled:opacity-60">
                {status === 'loading' ? 'Procesando...' : 'Darme de baja'}
              </button>
            </div>
            {status === 'error' && <p className="mt-3 text-sm text-lht-red">{message}</p>}
          </form>
        )}
      </div>
    </div>
  )
}
