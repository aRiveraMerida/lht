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
      <div className="rounded-[16px] border border-border bg-bg p-5">
        <p className="text-base font-semibold text-text">{message}</p>
        <p className="mt-2 text-sm text-text-muted">Bienvenido al archivo. Nos leemos pronto.</p>
      </div>
    )
  }

  return (
    <div>
      <form action={handleSubmit} className="flex max-w-xl flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="tu@email.com"
          className="w-full rounded-full border border-border bg-bg px-5 py-3 text-sm text-text outline-none placeholder:text-text-muted focus:border-brown"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="whitespace-nowrap rounded-full border border-button bg-button px-5 py-3 text-[12px] font-medium text-button-text transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === 'loading' ? 'Enviando...' : 'Suscribirme'}
        </button>
      </form>
      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600">{message}</p>
      )}
      <p className="mt-3 text-[12px] leading-5 text-text-muted">
        Puedes{' '}
        <Link href="/baja" className="underline transition-colors hover:text-text">darte de baja</Link>
        {' '}en cualquier momento.{' '}
        <Link href="/politica-privacidad" className="underline transition-colors hover:text-text">Política de privacidad</Link>.
      </p>
    </div>
  )
}
