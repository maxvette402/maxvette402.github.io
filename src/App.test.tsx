import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import App from './App'

function mockManifest(files: string[]) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ json: () => Promise.resolve(files) })
  )
}

function mockManifestFailure() {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))
}

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ─── Empty state ──────────────────────────────────────────────────────────

  describe('empty state', () => {
    it('shows the hero heading before images load', () => {
      mockManifest([])
      render(<App />)
      expect(screen.getByRole('heading', { name: 'Bitcoin is Freedom' })).toBeInTheDocument()
    })

    it('shows "No Images Found" when fetch fails', async () => {
      mockManifestFailure()
      render(<App />)
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'No Images Found' })).toBeInTheDocument()
      )
    })

    it('shows "No Images Found" when the manifest is empty', async () => {
      mockManifest([])
      render(<App />)
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'No Images Found' })).toBeInTheDocument()
      )
    })

    it('shows instructions for adding images in the empty state', async () => {
      mockManifest([])
      render(<App />)
      await waitFor(() =>
        expect(screen.getByText(/Add image files/)).toBeInTheDocument()
      )
    })

    it('does not render the carousel in the empty state', async () => {
      mockManifest([])
      render(<App />)
      await waitFor(() => screen.getByText('No Images Found'))
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })
  })

  // ─── Loaded state (App-level concerns) ────────────────────────────────────

  describe('loaded state', () => {
    const FILES = ['apple.jpg', 'banana.png', 'cherry.gif']

    beforeEach(() => mockManifest(FILES))

    it('renders the carousel image after images load', async () => {
      render(<App />)
      await waitFor(() => expect(screen.getByRole('img')).toBeInTheDocument())
    })

    it('sorts images alphabetically and shows the first one', async () => {
      render(<App />)
      await waitFor(() =>
        expect(screen.getByRole('img')).toHaveAttribute('alt', 'Apple')
      )
    })

    it('builds the image src with the /images/ prefix', async () => {
      render(<App />)
      await waitFor(() =>
        expect(screen.getByRole('img')).toHaveAttribute('src', '/images/apple.jpg')
      )
    })

    it('renders the About Bitcoin section', async () => {
      render(<App />)
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'About Bitcoin' })).toBeInTheDocument()
      )
    })

    it('renders the Lightning Network section', async () => {
      render(<App />)
      await waitFor(() =>
        expect(screen.getByRole('heading', { name: 'Lightning Network' })).toBeInTheDocument()
      )
    })
  })

  // ─── filenameToCaption ────────────────────────────────────────────────────

  describe('filenameToCaption', () => {
    it('converts hyphen-separated filenames to Title Case', async () => {
      mockManifest(['bitcoin-coins.jpg'])
      render(<App />)
      await waitFor(() =>
        expect(screen.getByText('Bitcoin Coins')).toBeInTheDocument()
      )
    })

    it('converts underscore-separated filenames to Title Case', async () => {
      mockManifest(['my_image.png'])
      render(<App />)
      await waitFor(() =>
        expect(screen.getByText('My Image')).toBeInTheDocument()
      )
    })

    it('strips the file extension from the caption', async () => {
      mockManifest(['freedom.webp'])
      render(<App />)
      await waitFor(() => {
        expect(screen.getByText('Freedom')).toBeInTheDocument()
        expect(screen.queryByText(/\.webp/i)).not.toBeInTheDocument()
      })
    })

    it('strips all supported extensions: jpg, jpeg, png, gif, webp', async () => {
      mockManifest(['a.jpg', 'b.jpeg', 'c.png', 'd.gif', 'e.webp'])
      render(<App />)
      await waitFor(() => screen.getByRole('img'))
      ;['jpg', 'jpeg', 'png', 'gif', 'webp'].forEach(ext => {
        expect(screen.queryByText(new RegExp(`\\.${ext}`, 'i'))).not.toBeInTheDocument()
      })
    })

    it('capitalises each word', async () => {
      mockManifest(['hello-world-foo.jpg'])
      render(<App />)
      await waitFor(() =>
        expect(screen.getByText('Hello World Foo')).toBeInTheDocument()
      )
    })
  })
})
