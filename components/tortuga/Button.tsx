import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'ghost'
type State = 'loading' | 'error' | 'success'

type CommonProps = {
  variant?: Variant
  state?: State
  className?: string
  children: React.ReactNode
}

type AsLink = CommonProps & { href: string; external?: boolean }
type AsButton = CommonProps & { href?: undefined } & React.ButtonHTMLAttributes<HTMLButtonElement>

const classes = (variant: Variant, className?: string) =>
  `btn btn--${variant}${className ? ` ${className}` : ''}`

/**
 * Tortuga button. Primary is the ONE filled call to action of a view;
 * secondary is the default; ghost is text that only turns moss on hover.
 */
export function Button(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { href, external, variant = 'secondary', state, className, children } = props
    const cls = classes(variant, className)
    if (external || href.startsWith('mailto:')) {
      const target = external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
      return <a href={href} className={cls} data-state={state} {...target}>{children}</a>
    }
    return <Link href={href} className={cls} data-state={state}>{children}</Link>
  }

  const { variant = 'secondary', state, className, children, ...rest } = props
  return (
    <button
      type="button"
      {...rest}
      className={classes(variant, className)}
      data-state={state}
      aria-busy={state === 'loading' || undefined}
    >
      {children}
    </button>
  )
}
