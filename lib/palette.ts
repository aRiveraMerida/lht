export const categories = [
  'Todos',
  'Laboratorios',
  'Sin Filtro',
  'Adopción IA',
  'Estrategia',
  'Guías',
] as const

// Solid accent per category — the ONLY color allowed in chrome outside the hero gradient.
// Used as an 8px dot inside the <fg-cat-tag /> pill.
export const categoryAccents: Record<string, string> = {
  Todos: '#000000',
  Laboratorios: '#00D26A',
  'Sin Filtro': '#FFE55C',
  'Adopción IA': '#00A3FF',
  Estrategia: '#8B5CF6',
  'Guías': '#FF4DA6',
}

export function getCategoryAccent(category: string): string {
  return categoryAccents[category] ?? '#000000'
}
