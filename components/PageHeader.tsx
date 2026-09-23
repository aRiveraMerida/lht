import Link from 'next/link'

interface Crumb {
  href?: string
  label: string
}

interface Props {
  crumbs?: Crumb[]
  eyebrow?: React.ReactNode
  title: React.ReactNode
  deck?: React.ReactNode
  /** Meta row: authors, dates, counts. */
  meta?: React.ReactNode
  /** Anything under the meta row (a progress bar, a search field). */
  children?: React.ReactNode
}

// The specimen's masthead: the page's one display title, a muted lead,
// a hairline below. Breadcrumb and eyebrow above when the page has a place.
export function PageHeader({ crumbs, eyebrow, title, deck, meta, children }: Props) {
  return (
    <header className="masthead">
      {crumbs && crumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="breadcrumb">
          {crumbs.map((c, i) => (
            <span key={`${c.label}-${i}`} className="inline-flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
      )}

      {eyebrow && <div className="eyebrow mb-3">{eyebrow}</div>}
      <h1 className="max-w-[24ch]">{title}</h1>
      {deck && <p className="lead">{deck}</p>}
      {meta && <div className="masthead-meta">{meta}</div>}
      {children && <div className="mt-8">{children}</div>}
    </header>
  )
}
