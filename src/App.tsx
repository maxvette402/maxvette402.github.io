import { useState, useEffect } from 'react'
import './App.css'

// Dynamically import all images from public/images folder
// Vite will discover these at build time
const imageModules = import.meta.glob('/public/images/*.{jpg,jpeg,png,gif,webp}', {
  eager: true,
  query: '?url',
  import: 'default'
})

// Transform the imported modules into our image structure
const images = Object.entries(imageModules).map(([path, url]) => {
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
}).sort((a, b) => a.caption.localeCompare(b.caption))

function App() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying || images.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

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

          <div className="carousel-content">
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
    </div>
  )
}

export default App
