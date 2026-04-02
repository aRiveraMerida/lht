'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function subscribe(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { error: 'Por favor, introduce un email válido.' }
  }

  try {
    await resend.contacts.create({
      email: email.toLowerCase(),
      audienceId: process.env.RESEND_AUDIENCE_ID!,
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
