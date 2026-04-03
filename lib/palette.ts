export const palette = {
  bg: "#FFFFFF",
  surface: "#F7F4EF",
  surface2: "#F1ECE4",
  border: "#D4CCC0",
  text: "#171412",
  textMuted: "#5E564F",
  brown: "#4A372C",
  green: "#5F7A4D",
  blue: "#3E6F85",
  button: "#171412",
  buttonText: "#FFFFFF",
} as const

export type PaletteColor = keyof typeof palette

export const categories = [
  'Todos',
  'Laboratorios',
  'Estrategia',
  'Automatizaciones',
  'Sin filtro',
  'Adopción IA',
  'Personas',
  'Notas de campo',
] as const

export const categoryTones: Record<string, string> = {
  "Laboratorios": "#EEE7DC",
  "Estrategia": "#E5ECEE",
  "Automatizaciones": "#E4E9E0",
  "Sin filtro": "#EEE7DC",
  "Adopción IA": "#E5ECEE",
  "Personas": "#E4E9E0",
  "Notas de campo": "#EEE7DC",
}
