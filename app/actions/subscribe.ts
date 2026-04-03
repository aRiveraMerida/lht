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

    await resend.contacts.create({
      email: email.toLowerCase(),
      audienceId: process.env.RESEND_AUDIENCE_ID,
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
