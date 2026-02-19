import type { AnchorHTMLAttributes, ReactNode } from 'react'

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The destination URL (required). */
  href: string
  /** Link content. */
  children: ReactNode
  /**
   * Shorthand for opening in a new tab with safe rel attributes.
   * Sets target="_blank" and rel="noopener noreferrer" automatically.
   */
  external?: boolean
}

/**
 * Link component wrapping a native <a> element.
 *
 * All standard anchor attributes are forwarded as-is.
 * When `external` is true (or `target="_blank"` is set), `rel` is
 * automatically extended with "noopener noreferrer" for security unless
 * you provide an explicit `rel` override.
 */
export function Link({
  href,
  children,
  external = false,
  target,
  rel,
  ...rest
}: LinkProps) {
  const resolvedTarget = external ? '_blank' : target

  let resolvedRel = rel
  if ((external || resolvedTarget === '_blank') && rel === undefined) {
    resolvedRel = 'noopener noreferrer'
  }

  return (
    <a href={href} target={resolvedTarget} rel={resolvedRel} {...rest}>
      {children}
    </a>
  )
}
