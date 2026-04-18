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

// Solid accent per category — the ONLY color allowed in chrome outside the hero gradient.
// Used as a 8px dot inside the <CategoryTag />.
export const categoryAccents: Record<string, string> = {
  Todos: '#000000',
  Laboratorios: '#00D26A',
  Estrategia: '#8B5CF6',
  Automatizaciones: '#FF4DA6',
  'Sin filtro': '#FFE55C',
  'Adopción IA': '#00A3FF',
  Personas: '#FF6B3D',
  'Notas de campo': '#111111',
}

export function getCategoryAccent(category: string): string {
  return categoryAccents[category] ?? '#000000'
}
