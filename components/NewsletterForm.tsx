'use client'

import { useState } from 'react'
import { subscribe } from '@/app/actions/subscribe'
import Link from 'next/link'

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(formData: FormData) {
    setStatus('loading')
    const result = await subscribe(formData)
    if (result.success) {
      setStatus('success')
      setMessage('¡Bienvenido al laboratorio! Revisa tu email.')
    } else {
      setStatus('error')
      setMessage(result.error || 'Ha ocurrido un error.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-2xl border border-bark/30 bg-cream p-6 ${compact ? '' : 'md:p-8'}`}>
        <p className="font-serif text-xl font-bold text-bark">
          {message}
        </p>
      </div>
    )
  }

  return (
    <div className={compact ? '' : ''}>
      <form action={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="flex-1 rounded-full border border-bark bg-cream px-5 py-3 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:border-bark focus:ring-1 focus:ring-bark"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-olive px-6 py-3 text-sm font-semibold text-cream hover:-translate-y-0.5 transition-transform disabled:opacity-60 whitespace-nowrap"
        >
          {status === 'loading' ? 'Enviando...' : 'Unirme al laboratorio'}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-sm text-red-700 mb-3">{message}</p>
      )}
      <p className="text-[10px] text-cream/60 leading-relaxed">
        Al suscribirte, aceptas nuestra{' '}
        <Link href="/politica-privacidad" className="underline hover:text-cream">
          política de privacidad
        </Link>
        . Puedes darte de baja en cualquier momento. Responsable: Alberto Rivera Mérida. Finalidad: envío de newsletter. Base jurídica: tu consentimiento.
      </p>
    </div>
  )
}
