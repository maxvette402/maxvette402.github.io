import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Carousel } from './Carousel'
import type { CarouselImage } from './Carousel'

const IMAGES: CarouselImage[] = [
  { src: '/images/apple.jpg',  alt: 'Apple',  caption: 'Apple'  },
  { src: '/images/banana.jpg', alt: 'Banana', caption: 'Banana' },
  { src: '/images/cherry.jpg', alt: 'Cherry', caption: 'Cherry' },
]

const ONE_IMAGE: CarouselImage[] = [
  { src: '/images/solo.jpg', alt: 'Solo', caption: 'Solo' },
]

afterEach(() => {
  vi.useRealTimers()
  document.body.style.overflow = ''
})

// ─── Rendering ────────────────────────────────────────────────────────────────

describe('rendering', () => {
  it('shows the first image on mount', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Apple')
    expect(screen.getByRole('img')).toHaveAttribute('src', '/images/apple.jpg')
  })

  it('shows the caption for the first image', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })

  it('shows the image count', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.getByText('1 / 3 images')).toBeInTheDocument()
  })

  it('renders one indicator button per image', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.getAllByRole('button', { name: /Go to image/ })).toHaveLength(3)
  })

  it('renders the Previous and Next buttons', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.getByRole('button', { name: 'Previous image' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next image' })).toBeInTheDocument()
  })

  it('marks the first indicator as active on mount', () => {
    render(<Carousel images={IMAGES} />)
    const indicators = screen.getAllByRole('button', { name: /Go to image/ })
    expect(indicators[0]).toHaveClass('active')
    expect(indicators[1]).not.toHaveClass('active')
    expect(indicators[2]).not.toHaveClass('active')
  })

  it('does not show the lightbox on mount', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.queryByRole('button', { name: 'Close lightbox' })).not.toBeInTheDocument()
  })

  it('works with a single image', () => {
    render(<Carousel images={ONE_IMAGE} />)
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Solo')
    expect(screen.getByText('1 / 1 images')).toBeInTheDocument()
  })
})

// ─── Navigation ───────────────────────────────────────────────────────────────

describe('navigation', () => {
  it('advances to the next image when Next is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Banana')
    expect(screen.getByText('2 / 3 images')).toBeInTheDocument()
  })

  it('goes back to the previous image when Previous is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    await userEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Apple')
    expect(screen.getByText('1 / 3 images')).toBeInTheDocument()
  })

  it('wraps to the last image when Previous is clicked on the first slide', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Cherry')
    expect(screen.getByText('3 / 3 images')).toBeInTheDocument()
  })

  it('wraps to the first image when Next is clicked on the last slide', async () => {
    render(<Carousel images={IMAGES} />)
    for (let i = 0; i < 3; i++) {
      await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    }
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Apple')
    expect(screen.getByText('1 / 3 images')).toBeInTheDocument()
  })

  it('jumps to a specific slide when its indicator is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Go to image 3' }))
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Cherry')
    expect(screen.getByText('3 / 3 images')).toBeInTheDocument()
  })

  it('moves the active indicator class when navigating', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    const indicators = screen.getAllByRole('button', { name: /Go to image/ })
    expect(indicators[0]).not.toHaveClass('active')
    expect(indicators[1]).toHaveClass('active')
    expect(indicators[2]).not.toHaveClass('active')
  })

  it('updates the caption when navigating', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByText('Banana')).toBeInTheDocument()
  })
})

// ─── Play / pause ─────────────────────────────────────────────────────────────

describe('play/pause', () => {
  it('shows "Play Slideshow" when autoPlayOnLoad is false (default)', () => {
    render(<Carousel images={IMAGES} />)
    expect(screen.getByRole('button', { name: /Play Slideshow/ })).toBeInTheDocument()
  })

  it('shows "Pause Slideshow" when autoPlayOnLoad is true', () => {
    render(<Carousel images={IMAGES} autoPlayOnLoad />)
    expect(screen.getByRole('button', { name: /Pause Slideshow/ })).toBeInTheDocument()
  })

  it('toggles to "Pause Slideshow" after clicking Play', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: /Play Slideshow/ }))
    expect(screen.getByRole('button', { name: /Pause Slideshow/ })).toBeInTheDocument()
  })

  it('toggles back to "Play Slideshow" after clicking Pause', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: /Play Slideshow/ }))
    await userEvent.click(screen.getByRole('button', { name: /Pause Slideshow/ }))
    expect(screen.getByRole('button', { name: /Play Slideshow/ })).toBeInTheDocument()
  })

  it('advances the slide automatically using the interval prop', () => {
    vi.useFakeTimers()
    render(<Carousel images={IMAGES} interval={500} />)
    act(() => { fireEvent.click(screen.getByRole('button', { name: /Play Slideshow/ })) })
    act(() => { vi.advanceTimersByTime(500) })
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Banana')
  })

  it('does not advance before the interval elapses', () => {
    vi.useFakeTimers()
    render(<Carousel images={IMAGES} interval={500} />)
    act(() => { fireEvent.click(screen.getByRole('button', { name: /Play Slideshow/ })) })
    act(() => { vi.advanceTimersByTime(499) })
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Apple')
  })

  it('stops advancing when paused', () => {
    vi.useFakeTimers()
    render(<Carousel images={IMAGES} interval={500} />)
    act(() => { fireEvent.click(screen.getByRole('button', { name: /Play Slideshow/ })) })
    act(() => { fireEvent.click(screen.getByRole('button', { name: /Pause Slideshow/ })) })
    act(() => { vi.advanceTimersByTime(2000) })
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Apple')
  })

  it('stops auto-play when Next is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: /Play Slideshow/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    expect(screen.getByRole('button', { name: /Play Slideshow/ })).toBeInTheDocument()
  })

  it('stops auto-play when Previous is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: /Play Slideshow/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Previous image' }))
    expect(screen.getByRole('button', { name: /Play Slideshow/ })).toBeInTheDocument()
  })

  it('stops auto-play when an indicator is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: /Play Slideshow/ }))
    await userEvent.click(screen.getByRole('button', { name: 'Go to image 2' }))
    expect(screen.getByRole('button', { name: /Play Slideshow/ })).toBeInTheDocument()
  })
})

// ─── Lightbox ─────────────────────────────────────────────────────────────────

describe('lightbox', () => {
  it('opens when the carousel image is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    expect(screen.getByRole('button', { name: 'Close lightbox' })).toBeInTheDocument()
  })

  it('shows the current image and caption inside the lightbox', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    const lightboxImg = screen.getAllByRole('img').find(img => img.classList.contains('lightbox-image'))
    expect(lightboxImg).toHaveAttribute('alt', 'Apple')
    expect(lightboxImg).toHaveAttribute('src', '/images/apple.jpg')
  })

  it('closes when the close button is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    await userEvent.click(screen.getByRole('button', { name: 'Close lightbox' }))
    expect(screen.queryByRole('button', { name: 'Close lightbox' })).not.toBeInTheDocument()
  })

  it('closes when the overlay backdrop is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(document.querySelector('.lightbox-overlay')!)
    expect(screen.queryByRole('button', { name: 'Close lightbox' })).not.toBeInTheDocument()
  })

  it('does not close when the content area is clicked', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await userEvent.click(document.querySelector('.lightbox-content')!)
    expect(screen.getByRole('button', { name: 'Close lightbox' })).toBeInTheDocument()
  })

  it('closes when the Escape key is pressed', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: 'Close lightbox' })).not.toBeInTheDocument()
  })

  it('sets body overflow to hidden when open', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('restores body overflow to "unset" when closed', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    await userEvent.click(screen.getByRole('button', { name: 'Close lightbox' }))
    expect(document.body.style.overflow).toBe('unset')
  })

  it('stops auto-play when the lightbox is opened', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: /Play Slideshow/ }))
    await userEvent.click(screen.getByRole('img'))
    await userEvent.click(screen.getByRole('button', { name: 'Close lightbox' }))
    expect(screen.getByRole('button', { name: /Play Slideshow/ })).toBeInTheDocument()
  })

  it('navigates to the next image with the lightbox Next button', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('img'))
    const nextBtns = screen.getAllByRole('button', { name: 'Next image' })
    await userEvent.click(nextBtns[nextBtns.length - 1])
    const lightboxImg = screen.getAllByRole('img').find(img => img.classList.contains('lightbox-image'))
    expect(lightboxImg).toHaveAttribute('alt', 'Banana')
  })

  it('navigates to the previous image with the lightbox Previous button', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next image' }))
    await userEvent.click(screen.getByRole('img'))
    const prevBtns = screen.getAllByRole('button', { name: 'Previous image' })
    await userEvent.click(prevBtns[prevBtns.length - 1])
    const lightboxImg = screen.getAllByRole('img').find(img => img.classList.contains('lightbox-image'))
    expect(lightboxImg).toHaveAttribute('alt', 'Apple')
  })

  it('syncs the lightbox image with the slide selected by indicator', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.click(screen.getByRole('button', { name: 'Go to image 2' }))
    await userEvent.click(screen.getByRole('img'))
    const lightboxImg = screen.getAllByRole('img').find(img => img.classList.contains('lightbox-image'))
    expect(lightboxImg).toHaveAttribute('alt', 'Banana')
  })

  it('Escape does not close lightbox when it is already closed', async () => {
    render(<Carousel images={IMAGES} />)
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('button', { name: 'Close lightbox' })).not.toBeInTheDocument()
  })
})
