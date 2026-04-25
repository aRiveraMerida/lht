export interface Author {
  slug: string
  name: string
  role: string
  company: string
  linkedin: string
  bio: string
}

// Orden de inserción = orden de renderizado en la home.
export const authors: Record<string, Author> = {
  'alberto-rivera': {
    slug: 'alberto-rivera',
    name: 'Alberto Rivera',
    role: 'Partner de IA y Tecnología',
    company: 'The Power Education',
    linkedin: 'https://www.linkedin.com/in/albertoriveramerida',
    bio: 'Partner de IA y Tecnología en The Power Education. Dirige programas B2B de adopción de IA en organizaciones.',
  },
  'david-dix': {
    slug: 'david-dix',
    name: 'David Dix Hidalgo',
    role: 'Especialista en IA',
    company: 'The Power Education',
    linkedin: 'https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b',
    bio: 'Especialista en IA en The Power Education. Implementa antes de divulgar.',
  },
  'javier-carreira': {
    slug: 'javier-carreira',
    name: 'Javier Carreira',
    role: 'AI Engineer',
    company: 'The Power Education',
    linkedin: 'https://www.linkedin.com/in/javier-carreira-c/',
    bio: 'AI Engineer en The Power Education. Convierte tecnología en productos que las empresas adoptan.',
  },
}

export function getAuthor(slug: string): Author | null {
  return authors[slug] ?? null
}

export function getAuthors(slugs: string[]): Author[] {
  return slugs.map((s) => authors[s]).filter((a): a is Author => Boolean(a))
}
