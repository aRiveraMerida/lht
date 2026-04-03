import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author: string;
  category: string;
  content: string;
  readingTime?: string;
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

      // Calculate reading time (approx 200 words per minute)
      const words = content.split(/\s+/).length;
      const readingTime = Math.ceil(words / 200);

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        author: data.author,
        category: data.category,
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
      excerpt: data.excerpt,
      author: data.author,
      category: data.category,
      content,
      readingTime: `${readingTime} min`,
    };
  } catch (error) {
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
