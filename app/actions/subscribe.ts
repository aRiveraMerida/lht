'use server'

import { Resend } from 'resend'

export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return { error: 'Por favor, introduce un email válido.' }
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured')
    return { error: 'El servicio de suscripción no está disponible en este momento.' }
  }

  if (!process.env.RESEND_AUDIENCE_ID) {
    console.error('RESEND_AUDIENCE_ID is not configured')
    return { error: 'El servicio de suscripción no está disponible en este momento.' }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const normalizedEmail = email.toLowerCase()

    await resend.contacts.create({
      email: normalizedEmail,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    // Send welcome email
    await resend.emails.send({
      from: 'La Habitación Tortuga <onboarding@resend.dev>',
      to: normalizedEmail,
      subject: 'Bienvenido/a a la comunidad tortuga 🐢',
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

Bienvenido/a al caparazón. 🐢

Alberto y David
La Habitación Tortuga [LHT]`,
    }).catch((err) => {
      // Don't fail the subscription if the welcome email fails
      console.error('Welcome email failed:', err)
    })

    return { success: true }
  } catch (error: unknown) {
    const resendError = error as { statusCode?: number }
    if (resendError?.statusCode === 409) {
      return { error: 'Ya estás suscrito al laboratorio.' }
    }
    console.error('Error suscribiendo:', error)
    return { error: 'Ha ocurrido un error. Inténtalo de nuevo.' }
  }
}
