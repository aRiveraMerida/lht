import Link from 'next/link'

export interface PostSummary {
  slug: string
  title: string
  date: string
  excerpt: string
  readingTime?: string
}

const DATE_FORMAT = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })

function formatDate(date: string) {
  const d = new Date(date)
  return Number.isNaN(d.getTime()) ? '' : DATE_FORMAT.format(d).replace('.', '')
}

/**
 * Articles as a blog lists them: date, title, a line of excerpt, a hairline.
 * `wide` puts the date in its own column on large screens.
 */
export function PostList({ posts, wide = false }: { posts: PostSummary[]; wide?: boolean }) {
  return (
    <ul className={`post-list${wide ? ' post-list--wide' : ''}`}>
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="post-item">
            <p className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.readingTime && <> · {post.readingTime}</>}
            </p>
            <h3 className="post-title">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            {post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}
          </article>
        </li>
      ))}
    </ul>
  )
}
