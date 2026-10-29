import { useState, useEffect, useCallback } from 'react'
import foto1 from '@/assets/foto1.jpg'
import foto2 from '@/assets/foto2.jpg'
import foto3 from '@/assets/foto3.jpg'
import foto4 from '@/assets/foto4.jpg'
import foto5 from '@/assets/foto5.jpg'
import foto6 from '@/assets/foto6.jpg'
import foto8 from '@/assets/foto8.jpg'
import foto9 from '@/assets/foto9.jpg'
import foto10 from '@/assets/foto10.jpg'
import foto13 from '@/assets/foto13.jpg'

const photos = [foto1, foto2, foto3, foto4, foto5, foto6, foto8, foto9, foto10, foto13]

function PhotoStackGallery() {
  const [expanded, setExpanded] = useState(false)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoIndex, setAutoIndex] = useState(0)

  // Auto-play cycles through photos in stack mode
  useEffect(() => {
    if (!isAutoPlaying || expanded) return
    const interval = setInterval(() => {
      setAutoIndex((prev) => (prev + 1) % photos.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [isAutoPlaying, expanded])

  const handleStackClick = useCallback(() => {
    setIsAutoPlaying(false)
    setFeaturedIndex(autoIndex)
    setExpanded(true)
  }, [autoIndex])

  const handleStripClick = useCallback((index) => {
    setFeaturedIndex(index)
  }, [])

  const handleClose = useCallback(() => {
    setExpanded(false)
    setAutoIndex(featuredIndex)
  }, [featuredIndex])

  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-video flex items-center justify-center overflow-hidden">
      {/* Featured / Stack area */}
      <div className="relative flex items-center justify-center w-full h-full">
        {/* Strip photos */}
        {photos.map((photo, index) => {
          const isFeatured = index === featuredIndex

          if (expanded) {
            // Strip layout: horizontal strip on the right
            const stripOffset = index - featuredIndex
            const absOffset = Math.abs(stripOffset)
            const isVisible = absOffset <= 4
            const opacity = isVisible ? Math.max(0, 1 - absOffset * 0.18) : 0
            const scale = 1 - absOffset * 0.07
            const translateX = stripOffset * 130
            const translateY = absOffset * 8
            const rotate = stripOffset * 2
            const zIndex = photos.length - absOffset

            return (
              <div
                key={index}
                onClick={() => handleStripClick(index)}
                className="absolute cursor-pointer transition-all duration-700 ease-out"
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  width: '120px',
                  height: '160px',
                }}
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl shadow-lg border-2 border-white/80"
                />
              </div>
            )
          } else {
            // Stack layout: stacked photos in center
            const stackOffset = index - autoIndex
            const normalizedOffset = ((stackOffset + photos.length) % photos.length)
            const isBehind = normalizedOffset > 0 && normalizedOffset <= 3
            const isHidden = normalizedOffset > 3

            if (isHidden) {
              return null
            }

            const rotation = isBehind ? (normalizedOffset - 1) * 4 - 5 : 0
            const translateX = isBehind ? normalizedOffset * 8 - 8 : 0
            const translateY = isBehind ? normalizedOffset * 5 : 0
            const scale = isBehind ? 1 - normalizedOffset * 0.05 : 1
            const zIndex = isBehind ? photos.length - normalizedOffset : photos.length
            const opacity = isBehind ? 1 - normalizedOffset * 0.1 : 1

            return (
              <div
                key={index}
                onClick={handleStackClick}
                className="absolute cursor-pointer transition-all duration-500 ease-out"
                style={{
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  width: '200px',
                  height: '260px',
                }}
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover rounded-xl shadow-xl border-2 border-white/80"
                />
              </div>
            )
          }
        })}

        {/* Featured large photo when expanded */}
        {expanded && (
          <div
            className="absolute transition-all duration-700 ease-out"
            style={{
              width: '280px',
              height: '370px',
              zIndex: photos.length + 10,
            }}
          >
            <img
              src={photos[featuredIndex]}
              alt={`Foto ${featuredIndex + 1}`}
              className="w-full h-full object-cover rounded-2xl shadow-2xl border-2 border-white/80"
            />
          </div>
        )}
      </div>

      {/* Close button */}
      {expanded && (
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Cerrar galería"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4l8 8M12 4l-8 8" />
          </svg>
        </button>
      )}

      {/* Auto-play restart hint */}
      {!expanded && !isAutoPlaying && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {photos.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === autoIndex ? 'bg-white/90 w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Prueba2() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <h1 className="text-3xl font-bold text-foreground mb-10">Galería</h1>
      <div className="w-full max-w-6xl">
        <PhotoStackGallery />
      </div>
    </div>
  )
}

export default Prueba2
