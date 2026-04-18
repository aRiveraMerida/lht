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
      <div className="on-dark bg-ink text-paper p-6 md:p-8">
        <p className="ed-ribbon-label text-paper/60 mb-3">Confirmación enviada</p>
        <p className="ed-display-mid">Te hemos enviado un correo. Confírmalo.</p>
        <p className="ed-body mt-3 text-paper/75">
          Revisa también spam — a veces los proveedores piensan que somos sospechosos
          por no mandar basura.
        </p>
      </div>
    )
  }

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor={inputId} className="ed-ribbon-label text-ink">
          Email
        </label>
        <div className="flex flex-col gap-0 sm:flex-row">
          <input
            id={inputId}
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="tu@correo.com"
            aria-invalid={status === 'error'}
            aria-describedby={status === 'error' ? `${inputId}-error` : undefined}
            className="ed-input flex-1 sm:border-r-0"
            onChange={() => {
              if (status === 'error') setStatus('idle')
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="ed-btn ed-btn-invert disabled:opacity-60 min-h-12"
          >
            {status === 'loading' ? 'Apuntando…' : 'Me apunto'}
          </button>
        </div>
      </form>

      {status === 'error' && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="ed-body mt-3 text-[color:var(--color-error)]"
        >
          {ERROR_COPY[errorKind]}
        </p>
      )}

      <p className="ed-link-ui mt-4 text-muted">
        Puedes{' '}
        <Link href="/baja" className="ed-link text-muted">
          darte de baja
        </Link>{' '}
        en cualquier momento.{' '}
        <Link href="/politica-privacidad" className="ed-link text-muted">
          Política de privacidad
        </Link>.
      </p>
    </div>
  )
}
