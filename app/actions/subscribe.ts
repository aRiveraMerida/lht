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
      subject: 'Bienvenido/a a la comunidad tortuga',
      text: `Hola,

Somos Alberto y David. Esto es La Habitación Tortuga.

No somos una newsletter más sobre IA. Somos dos profesionales que trabajan con inteligencia artificial todos los días y necesitaban un sitio para pensar despacio.

Esto es lo que vas a recibir:

— Lo que probamos cada semana y lo que aprendemos de verdad
— Reflexiones sobre adopción, estrategia y el factor humano de la IA
— Laboratorios: experimentos en profundidad con herramientas reales

Publicamos cada semana como mínimo. Pero si una semana no tenemos nada que valga la pena, no te mandamos nada. Preferimos respetarte el tiempo.

Mientras tanto, puedes echar un vistazo a lo que ya hemos escrito:
→ https://lahabitaciontortuga.com/blog

Bienvenido/a al caparazón.

Alberto y David
La Habitación Tortuga [LHT]`,
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
