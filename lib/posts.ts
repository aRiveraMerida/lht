import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  excerpt: string;
  authors: string[];
  category: string;
  image: string;
  featured?: boolean;
  series?: string;
  seriesOrder?: number;
  seriesTitle?: string;
  content: string;
  readingTime?: string;
}

export interface SeriesContext {
  id: string;
  title: string;
  order: number;
  total: number;
  prev: PostData | null;
  next: PostData | null;
  posts: PostData[];
}

function parseAuthors(data: Record<string, unknown>): string[] {
  if (Array.isArray(data.authors)) {
    return data.authors.filter((a): a is string => typeof a === 'string')
  }
  return []
}

function toPostData(slug: string, data: Record<string, unknown>, content: string): PostData {
  const words = content.split(/\s+/).filter(Boolean).length
  const readingTime = Math.max(1, Math.ceil(words / 200))
  return {
    slug,
    title: (data.title as string) ?? '',
    date: (data.date as string) ?? '',
    description: (data.description as string) || (data.excerpt as string) || '',
    excerpt: (data.excerpt as string) ?? '',
    authors: parseAuthors(data),
    category: (data.category as string) ?? '',
    image: (data.image as string) || '/favicon.svg',
    featured: Boolean(data.featured),
    series: typeof data.series === 'string' ? data.series : undefined,
    seriesOrder: typeof data.seriesOrder === 'number' ? data.seriesOrder : undefined,
    seriesTitle: typeof data.seriesTitle === 'string' ? data.seriesTitle : undefined,
    content,
    readingTime: `${readingTime} min`,
  }
}

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) return []
  const fileNames = fs.readdirSync(postsDirectory)
  const all = fileNames
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '')
      const raw = fs.readFileSync(path.join(postsDirectory, f), 'utf8')
      const { data, content } = matter(raw)
      return toPostData(slug, data, content)
    })
  return all.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): PostData | null {
  try {
    const raw = fs.readFileSync(path.join(postsDirectory, `${slug}.md`), 'utf8')
    const { data, content } = matter(raw)
    return toPostData(slug, data, content)
  } catch {
    return null
  }
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return []
  return fs.readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostData[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit)
}

export function getSeriesContext(post: PostData): SeriesContext | null {
  if (!post.series) return null
  const all = getAllPosts()
    .filter((p) => p.series === post.series)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0))
  const idx = all.findIndex((p) => p.slug === post.slug)
  if (idx === -1) return null
  return {
    id: post.series,
    title: post.seriesTitle ?? post.series,
    order: idx,
    total: all.length,
    prev: idx > 0 ? all[idx - 1] : null,
    next: idx < all.length - 1 ? all[idx + 1] : null,
    posts: all,
  }
}
