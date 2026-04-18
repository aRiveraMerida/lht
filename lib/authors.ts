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
    company: 'ThePower Education',
    linkedin: 'https://www.linkedin.com/in/albertoriveramerida',
    bio: 'Partner de IA y Tecnología en ThePower Education. Dirige programas B2B de adopción de IA en organizaciones.',
  },
  'david-dix': {
    slug: 'david-dix',
    name: 'David Dix Hidalgo',
    role: 'Especialista en IA',
    company: 'ThePower Education',
    linkedin: 'https://www.linkedin.com/in/david-dix-hidalgo-986a8a32b',
    bio: 'Especialista en IA en ThePower Education. Implementa antes de divulgar.',
  },
}

export function getAuthor(slug: string): Author | null {
  return authors[slug] ?? null
}

export function getAuthors(slugs: string[]): Author[] {
  return slugs.map((s) => authors[s]).filter((a): a is Author => Boolean(a))
}

export function getAuthorInitials(author: Author): string {
  const parts = author.name.split(' ')
  const first = parts[0]?.[0] ?? ''
  const last = parts[parts.length - 1]?.[0] ?? ''
  return (first + last).toUpperCase()
}
