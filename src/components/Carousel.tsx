import { useState, useEffect } from 'react'

export interface CarouselImage {
  src: string
  alt: string
  caption: string
}

interface CarouselProps {
  images: CarouselImage[]
  interval?: number
  autoPlayOnLoad?: boolean
}

export function Carousel({ images, interval = 2000, autoPlayOnLoad = false }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlayOnLoad)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return

    const id = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(id)
  }, [isAutoPlaying, images.length, interval])

  // Close lightbox on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) setIsLightboxOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isLightboxOpen])

  // Prevent body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = isLightboxOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isLightboxOpen])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false)
  }

  const openLightbox = () => {
    setIsLightboxOpen(true)
    setIsAutoPlaying(false)
  }

  const closeLightbox = () => setIsLightboxOpen(false)

  return (
    <>
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
            onClick={(e) => { e.stopPropagation(); goToPrevious() }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => { e.stopPropagation(); goToNext() }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
