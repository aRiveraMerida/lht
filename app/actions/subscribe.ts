'use server'

import { Resend } from 'resend'

export type SubscribeErrorKind = 'validation' | 'already' | 'server'

export type SubscribeResult =
  | { success: true }
  | { success: false; kind: SubscribeErrorKind }

export async function subscribe(formData: FormData): Promise<SubscribeResult> {
  const email = formData.get('email') as string

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return { success: false, kind: 'validation' }
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error('Resend env vars not configured')
    return { success: false, kind: 'server' }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const normalizedEmail = email.toLowerCase()

    await resend.contacts.create({
      email: normalizedEmail,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    // Send welcome email (non-blocking: subscription succeeds even if email fails)
    await resend.emails.send({
      from: 'La Habitación Tortuga <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Bienvenido a la habitación',
      text: `Hola,

Ya estás en la newsletter de La Habitación Tortuga.

Publicamos cada semana como mucho, a veces menos. Siempre que haya algo probado y pensado — nunca por obligación de calendario.

Tres cosas antes de empezar:

1. Puedes responder a cualquier correo. Lo leemos.
2. Si en algún momento no te aporta, te das de baja sin dramas.
3. Si hay alguien que debería estar aquí, reenvíaselo.

Despacio, con foco, con criterio.

— Equipo de IA de The Power Education
La Habitación Tortuga · lahabitaciontortuga.com`,
    }).catch((err) => {
      console.error('Welcome email failed:', err)
    })

    return { success: true }
  } catch (error: unknown) {
    const resendError = error as { statusCode?: number }
    if (resendError?.statusCode === 409) {
      return { success: false, kind: 'already' }
    }
    console.error('Error suscribiendo:', error)
    return { success: false, kind: 'server' }
  }
}
