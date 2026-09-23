import Link from 'next/link'

interface Props {
  href?: string
  eyebrow?: React.ReactNode
  /** Top-right slot, usually a Badge. */
  aside?: React.ReactNode
  title: React.ReactNode
  desc?: React.ReactNode
  meta?: React.ReactNode
  /** Extra content under the description (a button, a progress bar). */
  children?: React.ReactNode
  as?: 'h2' | 'h3'
  /** `clay`: the house tone, for labs. */
  tone?: 'clay'
}

/**
 * Tortuga card. With `href`, the whole card is the target: the title's link
 * stretches over it (card-title a::after), so there is one link per card and
 * any button inside still gets its own click.
 */
export function Card({ href, eyebrow, aside, title, desc, meta, children, as: Heading = 'h3', tone }: Props) {
  return (
    <article className={`card${href ? ' card--link' : ''}${tone ? ` card--${tone}` : ''}`}>
      {(eyebrow || aside) && (
        <div className="card-head">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : <span />}
          {aside}
        </div>
      )}
      <Heading className="card-title">
        {href ? <Link href={href}>{title}</Link> : title}
      </Heading>
      {desc && <p className="card-desc">{desc}</p>}
      {meta && <p className="card-meta">{meta}</p>}
      {children}
    </article>
  )
}
