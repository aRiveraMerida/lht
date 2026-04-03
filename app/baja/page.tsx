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
      setMessage('Te has dado de baja correctamente. Lamentamos verte marchar.')
    } else {
      setStatus('error')
      setMessage(result.error || 'Ha ocurrido un error.')
    }
  }

  return (
    <div className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto max-w-lg">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-text md:text-4xl">
          Darse de baja
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-text-muted">
          Introduce el email con el que te suscribiste y te eliminaremos de la lista.
          Sin preguntas, sin trucos.
        </p>

        {status === 'success' ? (
          <div className="mt-8 rounded-[16px] border border-border bg-surface p-6">
            <p className="text-base font-semibold text-text">{message}</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-text-muted underline transition-colors hover:text-text"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <form action={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                name="email"
                required
                placeholder="Tu email"
                className="w-full rounded-full border border-border bg-bg px-5 py-3 text-sm text-text outline-none placeholder:text-text-muted focus:border-brown"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="whitespace-nowrap rounded-full border border-border bg-bg px-5 py-3 text-[12px] font-medium text-text transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60"
              >
                {status === 'loading' ? 'Procesando...' : 'Darme de baja'}
              </button>
            </div>
            {status === 'error' && (
              <p className="mt-3 text-sm text-red-600">{message}</p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
