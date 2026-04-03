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
      <div className="border-2 border-lht-line bg-lht-paper p-5">
        <p className="lht-title text-[22px]">{message}</p>
        <p className="mt-2 text-sm text-lht-muted">Bienvenido al archivo. Nos leemos pronto.</p>
      </div>
    )
  }

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="lht-input flex-1"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="lht-btn lht-btn-primary disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando...' : 'Me apunto'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-3 text-sm text-lht-red">{message}</p>
      )}
      <p className="mt-3 text-[12px] leading-5 text-lht-muted">
        Puedes{' '}
        <Link href="/baja" className="underline hover:text-lht-ink">darte de baja</Link>
        {' '}en cualquier momento.{' '}
        <Link href="/politica-privacidad" className="underline hover:text-lht-ink">Política de privacidad</Link>.
      </p>
    </div>
  )
}
