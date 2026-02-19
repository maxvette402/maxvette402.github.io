import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Link } from './Link'

describe('Link', () => {
  describe('basic rendering', () => {
    it('renders an anchor element with the given href', () => {
      render(<Link href="/about">About</Link>)
      const link = screen.getByRole('link', { name: 'About' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/about')
    })

    it('renders as an <a> HTML element', () => {
      render(<Link href="/">Home</Link>)
      expect(screen.getByRole('link').tagName).toBe('A')
    })

    it('renders children content', () => {
      render(<Link href="/">Home</Link>)
      expect(screen.getByText('Home')).toBeInTheDocument()
    })

    it('renders children as JSX nodes', () => {
      render(
        <Link href="/contact">
          <span>Contact us</span>
        </Link>
      )
      expect(screen.getByText('Contact us')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <Link href="/">
          <span>Icon</span>
          <span>Label</span>
        </Link>
      )
      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    it('renders with an absolute URL as href', () => {
      render(<Link href="https://example.com/page">Page</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('href', 'https://example.com/page')
    })

    it('preserves query parameters in href', () => {
      render(<Link href="/search?q=bitcoin&page=1">Search</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('href', '/search?q=bitcoin&page=1')
    })

    it('preserves hash fragment in href', () => {
      render(<Link href="/page#section">Section</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('href', '/page#section')
    })

    it('renders with no extra attributes when only href and children are given', () => {
      render(<Link href="/">Home</Link>)
      const link = screen.getByRole('link')
      expect(link).not.toHaveAttribute('target')
      expect(link).not.toHaveAttribute('rel')
      expect(link).not.toHaveAttribute('class')
      expect(link).not.toHaveAttribute('id')
    })
  })

  describe('standard anchor attributes', () => {
    it('forwards className', () => {
      render(<Link href="/" className="nav-link">Home</Link>)
      expect(screen.getByRole('link')).toHaveClass('nav-link')
    })

    it('forwards multiple class names', () => {
      render(<Link href="/" className="btn btn-primary active">Home</Link>)
      const link = screen.getByRole('link')
      expect(link).toHaveClass('btn')
      expect(link).toHaveClass('btn-primary')
      expect(link).toHaveClass('active')
    })

    it('forwards id', () => {
      render(<Link href="/" id="main-link">Home</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('id', 'main-link')
    })

    it('forwards title', () => {
      render(<Link href="/" title="Go to homepage">Home</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('title', 'Go to homepage')
    })

    it('forwards aria-label', () => {
      render(<Link href="/" aria-label="Homepage">Home</Link>)
      expect(screen.getByRole('link', { name: 'Homepage' })).toBeInTheDocument()
    })

    it('forwards aria-describedby', () => {
      render(<Link href="/" aria-describedby="desc">Home</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('aria-describedby', 'desc')
    })

    it('forwards aria-current', () => {
      render(<Link href="/" aria-current="page">Home</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('aria-current', 'page')
    })

    it('forwards aria-hidden', () => {
      render(<Link href="/" aria-hidden="true">Home</Link>)
      expect(screen.getByRole('link', { hidden: true })).toHaveAttribute('aria-hidden', 'true')
    })

    it('forwards download with a filename value', () => {
      render(<Link href="/file.pdf" download="report.pdf">Download</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('download', 'report.pdf')
    })

    it('forwards download as a boolean (no filename)', () => {
      render(<Link href="/file.pdf" download>Download</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('download')
    })

    it('forwards hreflang', () => {
      render(<Link href="/es/inicio" hrefLang="es">Inicio</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('hreflang', 'es')
    })

    it('forwards type', () => {
      render(<Link href="/feed" type="application/rss+xml">RSS</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('type', 'application/rss+xml')
    })

    it('forwards referrerPolicy', () => {
      render(<Link href="https://example.com" referrerPolicy="no-referrer">Link</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('referrerpolicy', 'no-referrer')
    })

    it('forwards ping', () => {
      render(<Link href="/" ping="https://analytics.example.com/track">Link</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('ping', 'https://analytics.example.com/track')
    })

    it('forwards data-* attributes', () => {
      render(<Link href="/" data-testid="custom-link">Link</Link>)
      expect(screen.getByTestId('custom-link')).toBeInTheDocument()
    })

    it('forwards tabIndex', () => {
      render(<Link href="/" tabIndex={-1}>Link</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('tabindex', '-1')
    })
  })

  describe('target and rel', () => {
    it('does not set target by default', () => {
      render(<Link href="/">Home</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('target')
    })

    it('does not set rel by default', () => {
      render(<Link href="/">Home</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('rel')
    })

    it('forwards an explicit target', () => {
      render(<Link href="/" target="_self">Home</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('target', '_self')
    })

    it('forwards target="_parent" without adding noopener', () => {
      render(<Link href="/" target="_parent">Home</Link>)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_parent')
      expect(link).not.toHaveAttribute('rel')
    })

    it('forwards target="_top" without adding noopener', () => {
      render(<Link href="/" target="_top">Home</Link>)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('target', '_top')
      expect(link).not.toHaveAttribute('rel')
    })

    it('forwards an explicit rel', () => {
      render(<Link href="/" rel="nofollow">Home</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow')
    })

    it('adds noopener noreferrer when target="_blank" without explicit rel', () => {
      render(<Link href="https://example.com" target="_blank">External</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('preserves explicit rel when target="_blank" is set', () => {
      render(
        <Link href="https://example.com" target="_blank" rel="nofollow">
          External
        </Link>
      )
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow')
    })
  })

  describe('external prop', () => {
    it('sets target="_blank" when external is true', () => {
      render(<Link href="https://example.com" external>External</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('target', '_blank')
    })

    it('sets rel="noopener noreferrer" when external is true', () => {
      render(<Link href="https://example.com" external>External</Link>)
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('preserves explicit rel when external is true', () => {
      render(
        <Link href="https://example.com" external rel="nofollow noopener">
          External
        </Link>
      )
      expect(screen.getByRole('link')).toHaveAttribute('rel', 'nofollow noopener')
    })

    it('does not set target when external is false (default)', () => {
      render(<Link href="/">Home</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('target')
    })

    it('does not set target when external={false} is explicit', () => {
      render(<Link href="/" external={false}>Home</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('target')
    })

    it('does not set rel when external={false} is explicit', () => {
      render(<Link href="/" external={false}>Home</Link>)
      expect(screen.getByRole('link')).not.toHaveAttribute('rel')
    })
  })

  describe('event handlers', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = vi.fn()
      render(<Link href="/" onClick={handleClick}>Click me</Link>)
      await userEvent.click(screen.getByRole('link'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('passes the mouse event to onClick', async () => {
      const handleClick = vi.fn()
      render(<Link href="/" onClick={handleClick}>Click me</Link>)
      await userEvent.click(screen.getByRole('link'))
      expect(handleClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }))
    })

    it('calls onMouseEnter and onMouseLeave', async () => {
      const handleEnter = vi.fn()
      const handleLeave = vi.fn()
      render(
        <Link href="/" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
          Hover me
        </Link>
      )
      const link = screen.getByRole('link')
      await userEvent.hover(link)
      expect(handleEnter).toHaveBeenCalledTimes(1)
      await userEvent.unhover(link)
      expect(handleLeave).toHaveBeenCalledTimes(1)
    })

    it('calls onFocus when the link receives focus', async () => {
      const handleFocus = vi.fn()
      render(<Link href="/" onFocus={handleFocus}>Focus me</Link>)
      await userEvent.tab()
      expect(handleFocus).toHaveBeenCalledTimes(1)
    })

    it('calls onBlur when the link loses focus', async () => {
      const handleBlur = vi.fn()
      render(<Link href="/" onBlur={handleBlur}>Blur me</Link>)
      await userEvent.tab()
      await userEvent.tab()
      expect(handleBlur).toHaveBeenCalledTimes(1)
    })

    it('calls onKeyDown when a key is pressed', async () => {
      const handleKeyDown = vi.fn()
      render(<Link href="/" onKeyDown={handleKeyDown}>Press key</Link>)
      screen.getByRole('link').focus()
      await userEvent.keyboard('{Enter}')
      expect(handleKeyDown).toHaveBeenCalledTimes(1)
      expect(handleKeyDown).toHaveBeenCalledWith(expect.objectContaining({ key: 'Enter' }))
    })
  })

  describe('style', () => {
    it('forwards inline style', () => {
      render(<Link href="/" style={{ color: 'red' }}>Styled</Link>)
      expect(screen.getByRole('link')).toHaveStyle({ color: 'rgb(255, 0, 0)' })
    })

    it('forwards multiple style properties', () => {
      render(<Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none' }}>Styled</Link>)
      expect(screen.getByRole('link')).toHaveStyle({
        fontWeight: 'bold',
        textDecoration: 'none',
      })
    })
  })
})
