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
  content: string;
  readingTime?: string;
}

function parseAuthors(data: Record<string, unknown>): string[] {
  // New schema: authors as string[] of author slugs.
  if (Array.isArray(data.authors)) {
    return data.authors.filter((a): a is string => typeof a === 'string')
  }
  return []
}

export function getAllPosts(): PostData[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      const words = content.split(/\s+/).length;
      const readingTime = Math.ceil(words / 200);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description || data.excerpt,
        excerpt: data.excerpt,
        authors: parseAuthors(data),
        category: data.category,
        image: data.image || '/favicon.svg',
        featured: Boolean(data.featured),
        content,
        readingTime: `${readingTime} min`,
      } as PostData;
    });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const words = content.split(/\s+/).length;
    const readingTime = Math.ceil(words / 200);

    return {
      slug,
      title: data.title,
      date: data.date,
      description: data.description || data.excerpt,
      excerpt: data.excerpt,
      authors: parseAuthors(data),
      category: data.category,
      image: data.image || '/favicon.svg',
      featured: Boolean(data.featured),
      content,
      readingTime: `${readingTime} min`,
    };
  } catch {
    return null;
  }
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.filter((fileName) => fileName.endsWith('.md')).map((fileName) => fileName.replace(/\.md$/, ''));
}

export function getRelatedPosts(currentSlug: string, category: string, limit = 3): PostData[] {
  return getAllPosts()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}
