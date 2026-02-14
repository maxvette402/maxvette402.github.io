import { useState, useEffect } from 'react'
import './App.css'

// ============ SLIDESHOW CONFIGURATION ============
const SLIDESHOW_CONFIG = {
  // Auto-play interval in milliseconds (1000 = 1 second)
  interval: 2000,

  // Start with auto-play enabled
  autoPlayOnLoad: false,

  // Image file extensions to load
  imageExtensions: '*.{jpg,jpeg,png,gif,webp}',

  // Sort images alphabetically by caption
  sortAlphabetically: true
}
// =================================================

// Dynamically import all images from public/images folder
// Vite will discover these at build time
const imageModules = import.meta.glob('/public/images/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
})

// Transform the imported modules into our image structure
const unsortedImages = Object.entries(imageModules).map(([path, url]) => {
  // Extract filename without extension
  const filename = path.split('/').pop()?.replace(/\.(jpg|jpeg|png|gif|webp)$/, '') || ''

  // Convert filename to readable caption (e.g., "bitcoin-coins" -> "Bitcoin Coins")
  const caption = filename
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return {
    src: url as string,
    alt: caption,
    caption: caption
  }
})

// Sort images if configured
const images = SLIDESHOW_CONFIG.sortAlphabetically
  ? unsortedImages.sort((a, b) => a.caption.localeCompare(b.caption))
  : unsortedImages

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(SLIDESHOW_CONFIG.autoPlayOnLoad)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, SLIDESHOW_CONFIG.interval)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // Handle ESC key to close lightbox
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isLightboxOpen])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isLightboxOpen])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setIsAutoPlaying(false)
  }

  const openLightbox = () => {
    setIsLightboxOpen(true)
    setIsAutoPlaying(false)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  // Show message if no images found
  if (images.length === 0) {
    return (
      <div className="app-container">
        <div className="hero">
          <h1>Bitcoin is Freedom</h1>
          <p className="subtitle">Explore the world of Bitcoin and Lightning Network</p>
        </div>
        <div className="content">
          <section className="info-section">
            <h2>No Images Found</h2>
            <p>
              Add image files (.jpg, .jpeg, .png, .gif, .webp) to the <code>public/images/</code> folder
              to see them in the carousel.
            </p>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <div className="hero">
        <h1>Bitcoin is Freedom</h1>
        <p className="subtitle">Explore the world of Bitcoin and Lightning Network</p>
      </div>

      <div className="carousel-container">
        <div className="carousel">
          <button
            className="carousel-button prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className="carousel-content" onClick={openLightbox} style={{ cursor: 'pointer' }}>
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="carousel-image"
            />
            <div className="carousel-caption">
              {images[currentIndex].caption}
            </div>
          </div>

          <button
            className="carousel-button next"
            onClick={goToNext}
            aria-label="Next image"
          >
            ›
          </button>
        </div>

        <div className="carousel-indicators">
          {images.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        <div className="carousel-controls">
          <button
            className="control-button"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? 'Pause' : 'Play'} Slideshow
          </button>
          <p className="image-count">
            {currentIndex + 1} / {images.length} images
          </p>
        </div>
      </div>

      <div className="content">
        <section className="info-section">
          <h2>About Bitcoin</h2>
          <p>
            Bitcoin is a decentralized digital currency that enables peer-to-peer transactions
            without the need for intermediaries. It represents financial freedom and sovereignty.
          </p>
        </section>

        <section className="info-section">
          <h2>Lightning Network</h2>
          <p>
            The Lightning Network is a second-layer payment protocol that operates on top of
            Bitcoin, enabling fast and low-cost transactions.
          </p>
        </section>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button
            className="lightbox-close"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            ×
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              className="lightbox-image"
            />
            <div className="lightbox-caption">
              {images[currentIndex].caption}
            </div>
          </div>
          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default App
