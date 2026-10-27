import { useEffect, useRef, useState } from 'react'
import BookPageFlip from '@/components/BookPageFlip'
import { BookOpen, Library, Users, Heart } from 'lucide-react'

/**
 * ScrollWorld — Biblioteca 3D con efecto de paginación de libro.
 * 
 * Una página inmersiva donde al hacer scroll:
 * 1. Se muestra un pasillo de biblioteca con estantes
 * 2. Un libro sobre una mesa donde las páginas se vuelan con el viento
 * 
 * Usa Three.js para el libro 3D y CSS animations para los efectos de ambiente.
 */
function ScrollWorld() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [bookProgress, setBookProgress] = useState(0)
  const bookSectionRef = useRef(null)
  const containerRef = useRef(null)

  // Track global scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track book section scroll progress
  useEffect(() => {
    const section = bookSectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height
      
      // Calculate progress within this section (0 to 1)
      const progress = Math.max(0, Math.min(1, 
        (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)
      ))
      setBookProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef} className="scroll-world">
      {/* Section 1: Hero - Biblioteca exterior */}
      <section className="scroll-world__hero">
        <div className="scroll-world__hero-bg" />
        <div className="scroll-world__hero-content">
          <div className="scroll-world__hero-badge">
            <Library className="scroll-world__hero-icon" />
            <span>Biblioteca Comunitaria</span>
          </div>
          <h1 className="scroll-world__hero-title">
            Un mundo de<br />
            <span className="scroll-world__hero-highlight">conocimiento</span>
          </h1>
          <p className="scroll-world__hero-subtitle">
            Donde cada página abre una puerta a nuevas posibilidades.
            Explora nuestra colección y descubre historias que transforman vidas.
          </p>
          <div className="scroll-world__scroll-hint">
            <span>Desplaza para explorar</span>
            <div className="scroll-world__scroll-arrow" />
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="scroll-world__particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="scroll-world__particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Section 2: Pasillo de biblioteca */}
      <section className="scroll-world__hallway">
        <div className="scroll-world__hallway-content">
          <div className="scroll-world__hallway-text">
            <span className="scroll-world__section-number">01 / 02</span>
            <h2 className="scroll-world__section-title">
              Pasillos del saber
            </h2>
            <p className="scroll-world__section-body">
              Miles de libros esperan ser descubiertos. Cada estante guarda 
              historias, conocimientos y sueños que esperan encontrar su lector.
            </p>
            <div className="scroll-world__features">
              <div className="scroll-world__feature">
                <BookOpen className="scroll-world__feature-icon" />
                <div>
                  <h4>Colección diversa</h4>
                  <p>Libros de todas las disciplinas y géneros</p>
                </div>
              </div>
              <div className="scroll-world__feature">
                <Users className="scroll-world__feature-icon" />
                <div>
                  <h4>Espacio comunitario</h4>
                  <p>Un lugar para aprender juntos</p>
                </div>
              </div>
              <div className="scroll-world__feature">
                <Heart className="scroll-world__feature-icon" />
                <div>
                  <h4>Apasionados por leer</h4>
                  <p>Fomentamos el amor por la lectura</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bookshelf visualization */}
          <div className="scroll-world__bookshelf">
            {Array.from({ length: 5 }).map((_, shelfIndex) => (
              <div key={shelfIndex} className="scroll-world__shelf">
                {Array.from({ length: 8 + Math.floor(Math.random() * 4) }).map((_, bookIndex) => {
                  const height = 60 + Math.random() * 40
                  const hue = 20 + Math.random() * 30
                  const saturation = 40 + Math.random() * 30
                  const lightness = 25 + Math.random() * 20
                  
                  return (
                    <div
                      key={bookIndex}
                      className="scroll-world__book"
                      style={{
                        height: `${height}%`,
                        backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                        animationDelay: `${shelfIndex * 0.1 + bookIndex * 0.05}s`
                      }}
                    />
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Libro con paginación */}
      <section ref={bookSectionRef} className="scroll-world__book-section">
        <div className="scroll-world__book-content">
          <div className="scroll-world__book-text">
            <span className="scroll-world__section-number">02 / 02</span>
            <h2 className="scroll-world__section-title">
              Páginas que cobran vida
            </h2>
            <p className="scroll-world__section-body">
              Desplaza para volar las páginas. Cada hoja revela nuevas ideas, 
              nuevas perspectivas, nuevas posibilidades. El conocimiento fluye 
              como el viento a través de estas páginas.
            </p>
            <div className="scroll-world__book-progress">
              <div className="scroll-world__progress-bar">
                <div 
                  className="scroll-world__progress-fill"
                  style={{ width: `${bookProgress * 100}%` }}
                />
              </div>
              <span className="scroll-world__progress-text">
                {Math.floor(bookProgress * 100)}% explorado
              </span>
            </div>
          </div>
          
          {/* 3D Book */}
          <div className="scroll-world__book-3d">
            <BookPageFlip
              pageCount={15}
              scrollProgress={bookProgress}
              bookWidth={2.8}
              bookHeight={2}
              pageColor="#faf6f0"
            />
          </div>
        </div>
        
        {/* Ambient light effect */}
        <div className="scroll-world__ambient-light" />
      </section>

      {/* Section 4: CTA Final */}
      <section className="scroll-world__cta">
        <div className="scroll-world__cta-content">
          <h2 className="scroll-world__cta-title">
            Tu próxima historia<br />te espera
          </h2>
          <p className="scroll-world__cta-body">
            Únete a nuestra comunidad de lectores y descubre un mundo 
            de conocimiento, inspiración y crecimiento personal.
          </p>
          <div className="scroll-world__cta-buttons">
            <button className="scroll-world__cta-btn scroll-world__cta-btn--primary">
              Visítanos
            </button>
            <button className="scroll-world__cta-btn scroll-world__cta-btn--secondary">
              Conoce más
            </button>
          </div>
        </div>
        
        {/* Background pattern */}
        <div className="scroll-world__cta-pattern" />
      </section>

      <style jsx>{`
        .scroll-world {
          --sw-bg: #f5f0e8;
          --sw-ink: #2a2420;
          --sw-ink-soft: #6a6058;
          --sw-accent: #8b6f47;
          --sw-accent-light: #c4a77d;
          --sw-warm: #f5e6d0;
        }

        .scroll-world__hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #2a2420 0%, #3a3028 50%, #4a3f35 100%);
        }

        .scroll-world__hero-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 30% 40%, rgba(139, 111, 71, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(196, 167, 125, 0.2) 0%, transparent 50%);
          animation: scroll-world__hero-bg-pulse 8s ease-in-out infinite;
        }

        @keyframes scroll-world__hero-bg-pulse {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .scroll-world__hero-content {
          position: relative;
          z-index: 10;
          text-align: center;
          color: #faf6f0;
          max-width: 800px;
          padding: 2rem;
        }

        .scroll-world__hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(139, 111, 71, 0.3);
          border: 1px solid rgba(196, 167, 125, 0.4);
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .scroll-world__hero-icon {
          width: 1rem;
          height: 1rem;
          color: #c4a77d;
        }

        .scroll-world__hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .scroll-world__hero-highlight {
          background: linear-gradient(135deg, #c4a77d 0%, #8b6f47 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .scroll-world__hero-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          line-height: 1.6;
          color: rgba(250, 246, 240, 0.8);
          max-width: 600px;
          margin: 0 auto 3rem;
        }

        .scroll-world__scroll-hint {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: rgba(250, 246, 240, 0.6);
          animation: scroll-world__scroll-bounce 2s ease-in-out infinite;
        }

        @keyframes scroll-world__scroll-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }

        .scroll-world__scroll-arrow {
          width: 2px;
          height: 24px;
          background: linear-gradient(to bottom, #c4a77d, transparent);
        }

        .scroll-world__particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .scroll-world__particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(196, 167, 125, 0.4);
          border-radius: 50%;
          animation: scroll-world__particle-float linear infinite;
        }

        @keyframes scroll-world__particle-float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .scroll-world__hallway {
          position: relative;
          padding: 8rem 2rem;
          background: var(--sw-bg);
          overflow: hidden;
        }

        .scroll-world__hallway-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .scroll-world__section-number {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.875rem;
          letter-spacing: 0.1em;
          color: var(--sw-accent);
          display: block;
          margin-bottom: 1rem;
        }

        .scroll-world__section-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 700;
          line-height: 1.1;
          color: var(--sw-ink);
          margin-bottom: 1.5rem;
        }

        .scroll-world__section-body {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--sw-ink-soft);
          margin-bottom: 2rem;
        }

        .scroll-world__features {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .scroll-world__feature {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .scroll-world__feature-icon {
          width: 2rem;
          height: 2rem;
          color: var(--sw-accent);
          flex-shrink: 0;
        }

        .scroll-world__feature h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--sw-ink);
          margin-bottom: 0.25rem;
        }

        .scroll-world__feature p {
          font-size: 0.875rem;
          color: var(--sw-ink-soft);
        }

        .scroll-world__bookshelf {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 2rem;
          background: linear-gradient(135deg, #8b6f47 0%, #6b5437 100%);
          border-radius: 1rem;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.1),
            inset 0 2px 4px rgba(255, 255, 255, 0.1);
        }

        .scroll-world__shelf {
          display: flex;
          gap: 0.25rem;
          height: 80px;
          align-items: flex-end;
          padding: 0 1rem;
          border-bottom: 8px solid #5c4a2a;
          position: relative;
        }

        .scroll-world__shelf::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          right: 0;
          height: 4px;
          background: rgba(0, 0, 0, 0.2);
          filter: blur(2px);
        }

        .scroll-world__book {
          width: 20px;
          border-radius: 2px 4px 4px 2px;
          animation: scroll-world__book-appear 0.6s ease-out backwards;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2);
        }

        @keyframes scroll-world__book-appear {
          from {
            transform: scaleY(0);
            opacity: 0;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        .scroll-world__book-section {
          position: relative;
          min-height: 200vh;
          background: linear-gradient(to bottom, var(--sw-bg) 0%, var(--sw-warm) 100%);
          overflow: hidden;
        }

        .scroll-world__book-content {
          position: sticky;
          top: 0;
          height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          padding: 4rem 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .scroll-world__book-3d {
          position: relative;
          height: 60vh;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .scroll-world__book-progress {
          margin-top: 2rem;
        }

        .scroll-world__progress-bar {
          height: 4px;
          background: rgba(139, 111, 71, 0.2);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .scroll-world__progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--sw-accent), var(--sw-accent-light));
          transition: width 0.1s ease-out;
          border-radius: 2px;
        }

        .scroll-world__progress-text {
          font-size: 0.875rem;
          color: var(--sw-ink-soft);
        }

        .scroll-world__ambient-light {
          position: absolute;
          top: 50%;
          right: 10%;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(255, 221, 180, 0.4) 0%, transparent 70%);
          pointer-events: none;
          animation: scroll-world__ambient-pulse 4s ease-in-out infinite;
        }

        @keyframes scroll-world__ambient-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        .scroll-world__cta {
          position: relative;
          padding: 10rem 2rem;
          background: linear-gradient(135deg, #2a2420 0%, #3a3028 100%);
          overflow: hidden;
          text-align: center;
        }

        .scroll-world__cta-content {
          position: relative;
          z-index: 10;
          max-width: 700px;
          margin: 0 auto;
          color: #faf6f0;
        }

        .scroll-world__cta-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
        }

        .scroll-world__cta-body {
          font-size: 1.25rem;
          line-height: 1.6;
          color: rgba(250, 246, 240, 0.8);
          margin-bottom: 3rem;
        }

        .scroll-world__cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .scroll-world__cta-btn {
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 600;
          border: none;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .scroll-world__cta-btn--primary {
          background: #faf6f0;
          color: #2a2420;
        }

        .scroll-world__cta-btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(250, 246, 240, 0.3);
        }

        .scroll-world__cta-btn--secondary {
          background: transparent;
          color: #faf6f0;
          border: 2px solid rgba(250, 246, 240, 0.4);
        }

        .scroll-world__cta-btn--secondary:hover {
          border-color: #faf6f0;
          transform: translateY(-2px);
        }

        .scroll-world__cta-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle at 1px 1px, rgba(196, 167, 125, 0.15) 1px, transparent 0);
          background-size: 40px 40px;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .scroll-world__hallway-content,
          .scroll-world__book-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .scroll-world__book-3d {
            height: 40vh;
          }

          .scroll-world__bookshelf {
            order: -1;
          }
        }
      `}</style>
    </div>
  )
}

export default ScrollWorld
