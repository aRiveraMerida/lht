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
      setMessage('Hecho. Revisa tu bandeja de entrada.')
    } else {
      setStatus('error')
      setMessage(result.error || 'Ha ocurrido un error.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-ink text-paper p-6">
        <p className="fg-feature-title">{message}</p>
        <p className="fg-body mt-2 text-white/70">
          Bienvenido al archivo. Nos leemos pronto.
        </p>
      </div>
    )
  }

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className={`fg-input ${compact ? 'sm:flex-1' : 'flex-1'}`}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="fg-btn fg-btn-primary disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando…' : 'Me apunto'}
        </button>
      </form>
      {status === 'error' && (
        <p className="fg-body mt-3 text-[#FF4DA6]">{message}</p>
      )}
      <p className="fg-body mt-3 text-ink/55 text-[13px]">
        Puedes{' '}
        <Link href="/baja" className="underline underline-offset-2 hover:text-ink">
          darte de baja
        </Link>{' '}
        en cualquier momento.{' '}
        <Link href="/politica-privacidad" className="underline underline-offset-2 hover:text-ink">
          Política de privacidad
        </Link>.
      </p>
    </div>
  )
}
