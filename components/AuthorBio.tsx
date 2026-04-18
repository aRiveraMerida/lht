import { getAuthors, getAuthorInitials } from '@/lib/authors'

// Accent colors cycled for avatar backgrounds.
const avatarColors = ['#8B5CF6', '#00A3FF', '#00D26A', '#FF4DA6']

export function AuthorBio({ authorSlugs }: { authorSlugs: string[] }) {
  const authors = getAuthors(authorSlugs)
  if (authors.length === 0) return null

  return (
    <div className="fg-reading">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {authors.map((author, i) => (
          <article key={author.slug} className="fg-card p-6 hairline-t hairline-b">
            <div className="flex items-center gap-3">
              <div
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white fg-mono-label"
                style={{ background: avatarColors[i % avatarColors.length] }}
                aria-hidden="true"
              >
                {getAuthorInitials(author)}
              </div>
              <div>
                <div className="fg-body fw-540">{author.name}</div>
                <div className="fg-mono-label text-ink/55 mt-1">{author.role}</div>
              </div>
            </div>
            <p className="fg-body mt-4 text-ink/70">{author.bio}</p>
            <a
              href={author.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="fg-body mt-4 inline-block underline underline-offset-2"
            >
              LinkedIn →
            </a>
          </article>
        ))}
      </div>
    </div>
  )
}

