'use server'

import { Resend } from 'resend'

export async function unsubscribe(formData: FormData) {
  const email = formData.get('email') as string

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email)) {
    return { error: 'Por favor, introduce un email válido.' }
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_AUDIENCE_ID) {
    console.error('Resend env vars not configured')
    return { error: 'El servicio no está disponible en este momento.' }
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.contacts.remove({
      email: email.toLowerCase(),
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })
    return { success: true }
  } catch (error: unknown) {
    console.error('Error dando de baja:', error)
    return { error: 'No hemos encontrado ese email o ya estaba dado de baja.' }
  }
}
