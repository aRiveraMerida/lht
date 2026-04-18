import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const guidesRoot = path.join(process.cwd(), 'content/guides/claude-code')

export interface GuideContent {
  slug: string
  content: string
  excerpt?: string
  readingTime: string
}

export function getGuideContent(slug: string): GuideContent | null {
  const filePath = path.join(guidesRoot, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const words = content.split(/\s+/).filter(Boolean).length
  const mins = Math.max(1, Math.ceil(words / 200))

  return {
    slug,
    content,
    excerpt: typeof data.excerpt === 'string' ? data.excerpt : undefined,
    readingTime: `${mins} min`,
  }
}

export function hasGuideContent(slug: string): boolean {
  return fs.existsSync(path.join(guidesRoot, `${slug}.md`))
}
