'use client'

import { useState } from 'react'
import { subscribe, type SubscribeErrorKind } from '@/app/actions/subscribe'
import Link from 'next/link'

type Status = 'idle' | 'loading' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ERROR_COPY: Record<SubscribeErrorKind, string> = {
  validation: 'Ese correo no parece correcto.',
  already: 'Ya estás dentro. Gracias por intentarlo otra vez.',
  server:
    'Algo ha fallado. Prueba en un rato o escríbenos a hola@lahabitaciontortuga.com.',
}

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>('idle')
  const [errorKind, setErrorKind] = useState<SubscribeErrorKind>('server')
  const inputId = compact ? 'newsletter-email-compact' : 'newsletter-email'

  async function handleSubmit(formData: FormData) {
    const raw = (formData.get('email') as string | null) ?? ''
    if (!EMAIL_RE.test(raw)) {
      setErrorKind('validation')
      setStatus('error')
      return
    }
    setStatus('loading')
    const result = await subscribe(formData)
    if (result.success) {
      setStatus('success')
    } else {
      setErrorKind(result.kind)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-lg bg-ink text-paper p-6">
        <p className="fg-feature-title">Te hemos enviado un correo. Confírmalo.</p>
        <p className="fg-body mt-2 text-white/70">
          Revisa también spam — a veces los proveedores piensan que somos sospechosos
          por no mandar basura.
        </p>
      </div>
    )
  }

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor={inputId} className="fg-mono-label text-ink/70">
          Email
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id={inputId}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? `${inputId}-error` : undefined}
            className="fg-input flex-1"
            onChange={() => {
              if (status === 'error') setStatus('idle')
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="fg-btn fg-btn-primary disabled:opacity-60"
          >
            {status === 'loading' ? 'Apuntando…' : 'Me apunto'}
          </button>
        </div>
      </form>

      {status === 'error' && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="fg-body mt-3 text-[#FF4DA6]"
        >
          {ERROR_COPY[errorKind]}
        </p>
      )}

      <p className="fg-body mt-3 text-ink/55 text-[13px]">
        Puedes{' '}
        <Link href="/baja" className="underline underline-offset-2 hover:text-ink">
          darte de baja
        </Link>{' '}
        en cualquier momento.{' '}
        <Link
          href="/politica-privacidad"
          className="underline underline-offset-2 hover:text-ink"
        >
          Política de privacidad
        </Link>.
      </p>
    </div>
  )
}
