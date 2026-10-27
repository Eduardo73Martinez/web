import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import ScrollExpand from '@/components/ui/ScrollExpand'
import { ArrowRight, Zap, Shield, Globe, Layers, Sparkles, Rocket } from 'lucide-react'

import parallaxLightImage from '@/assets/parallax-light.jpg'
import iglesiaImage from '@/assets/iglesia.jpg'
import foto6Image from '@/assets/foto6.jpg'

function ParallaxSection({ imageSrc, title, subtitle, children, dark = true }) {
  const containerRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onScroll = () => {
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Progress: 0 when section enters viewport, 1 when it leaves
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - windowHeight)))

      // Parallax background: moves slower than scroll
      if (bgRef.current) {
        const translateY = progress * 100 - 50
        bgRef.current.style.transform = `translateY(${translateY}px) scale(1.1)`
      }

      // Content fades and moves up
      if (contentRef.current) {
        const contentOpacity = progress < 0.3 ? progress / 0.3 : progress > 0.7 ? (1 - progress) / 0.3 : 1
        const contentTranslateY = (1 - contentOpacity) * 40
        contentRef.current.style.opacity = contentOpacity
        contentRef.current.style.transform = `translateY(${contentTranslateY}px)`
      }

      // Section scale effect like Apple
      if (containerRef.current) {
        const scale = progress < 0.5 ? 1 : 1 - (progress - 0.5) * 0.15
        const sectionOpacity = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4
        containerRef.current.style.transform = `scale(${scale})`
        containerRef.current.style.opacity = sectionOpacity
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${dark ? 'bg-black text-white' : 'bg-white text-foreground'}`}
      style={{ minHeight: '200vh', willChange: 'transform, opacity' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background image with parallax */}
        <div
          ref={bgRef}
          className="absolute inset-0 will-change-transform"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className={`absolute inset-0 ${dark ? 'bg-black/50' : 'bg-white/50'}`} />

        {/* Content with parallax */}
        <div
          ref={contentRef}
          className="relative z-10 flex h-full flex-col items-center justify-center px-8 text-center"
          style={{ willChange: 'transform, opacity' }}
        >
          <h2 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">{title}</h2>
          <p className={`text-lg md:text-2xl max-w-2xl ${dark ? 'text-white/80' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Children render after the sticky section */}
      <div className="relative z-20">{children}</div>
    </div>
  )
}

function FadeInSection({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [scrollState, setScrollState] = useState({ progress: 0, isVisible: false })

  useEffect(() => {
    let rafId = 0
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const windowHeight = window.innerHeight
        const inView = rect.top < windowHeight * 0.85 && rect.bottom > 0
        const progress = Math.max(0, Math.min(1,
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ))
        setScrollState({ progress, isVisible: inView })
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const { progress, isVisible } = scrollState
  const opacity = isVisible ? Math.min(1, progress * 3) : 0
  const translateY = isVisible ? (1 - Math.min(1, progress * 3)) * 60 : 60

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity',
      }}
    >
      {children}
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <FadeInSection delay={delay}>
      <div className="group rounded-2xl bg-card p-8 shadow-sm border border-border hover:shadow-lg hover:border-primary/20 transition-all duration-300">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </FadeInSection>
  )
}

function Home() {
  return (
    <div className="home">
      {/* Section 1: Hero with ScrollExpand */}
      <ScrollExpand
        src={iglesiaImage}
        alt="Globo terráqueo digital con conexiones globales"
        title="Bienvenido"
        scrollHint="Desplaza para explorar"
        useWindowScroll
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#fff', marginBottom: '0.5rem' }}>
          Zolezzi 274 Ezpeleta
        </h2>
        <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', maxWidth: '500px', lineHeight: 1.6 }}>
          Una casa de oración.
        </p>
      </ScrollExpand>

      {/* Section 2: Parallax showcase - Dark */}
      <ParallaxSection
        imageSrc={foto6Image}
        title="Una familia en Cristo"
        subtitle=" El que cree en mí, como dice la Escritura, de su interior correrán ríos de agua viva.."
        dark={true}
      >
        <div style={{ height: '100vh' }} />
      </ParallaxSection>

      {/* Section 3: Features grid */}
      <section className="py-24 px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Todo lo que necesitas
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Diseñado para ser rápido, seguro y fácil de usar.
              </p>
            </div>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Zap}
              title="Ultra rápido"
              description="Optimizado para cargar en milisegundos. Cada interacción se siente instantánea."
              delay={0}
            />
            <FeatureCard
              icon={Shield}
              title="Seguro por defecto"
              description="Encriptación de extremo a extremo y autenticación robusta en cada capa."
              delay={100}
            />
            <FeatureCard
              icon={Globe}
              title="Conectado globalmente"
              description="Accede desde cualquier lugar del mundo con infraestructura distribuida."
              delay={200}
            />
            <FeatureCard
              icon={Layers}
              title="Arquitectura modular"
              description="Componentes reutilizables que crecen con tu proyecto sin deuda técnica."
              delay={300}
            />
            <FeatureCard
              icon={Sparkles}
              title="Inteligente"
              description="IA integrada que aprende de tus patrones y sugiere mejoras automáticas."
              delay={400}
            />
            <FeatureCard
              icon={ArrowRight}
              title="Escalable"
              description="Desde un usuario hasta millones. La infraestructura se adapta sin intervención."
              delay={500}
            />
          </div>
        </div>
      </section>

      {/* Section 3: Cosmos World Feature */}
      <section className="py-16 px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <FadeInSection>
            <Link to="/cosmos" className="group relative overflow-hidden rounded-3xl block">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900" />
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 40% 70%, white, transparent), radial-gradient(2px 2px at 60% 20%, white, transparent), radial-gradient(2px 2px at 80% 60%, white, transparent), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 70% 40%, rgba(255,255,255,0.5), transparent), radial-gradient(1px 1px at 90% 10%, rgba(255,255,255,0.5), transparent)',
                  backgroundSize: '200px 200px'
                }} />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-12 md:p-16">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6">
                    <Rocket className="w-4 h-4" />
                    <span>Experiencia inmersiva 3D</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                    Explora el cosmos
                  </h2>
                  <p className="text-lg text-white/70 max-w-xl mb-8">
                    Un viaje a través de las estrellas con efectos 3D interactivos, 
                    planetas en tiempo real y animaciones que responden a tu scroll.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white text-indigo-950 font-semibold px-8 py-4 rounded-full text-lg group-hover:bg-white/90 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                    Iniciar viaje
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-800 shadow-2xl shadow-purple-500/30 animate-pulse" style={{ animationDuration: '4s' }} />
                </div>
              </div>
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* Section 4: Parallax showcase - Light */}
      <ParallaxSection
        imageSrc={parallaxLightImage}
        title="Diseñado para ti"
        subtitle="Cada detalle está pensado para que te concentres en lo que importa: tu trabajo."
        dark={false}
      >
        <div style={{ height: '100vh' }} />
      </ParallaxSection>

      {/* Section 5: CTA section */}
      <section className="relative py-32 px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <FadeInSection>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              ¿Que esperas para venir?
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed">
              Únete a miles de usuarios que ya están transformando su forma de trabajar.
            </p>
            <button className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-white/90 transition-colors duration-200 shadow-lg">
              Comunicate con nosotros
              <ArrowRight className="h-5 w-5" />
            </button>
          </FadeInSection>
        </div>
      </section>

      {/* Section 6: Footer spacer */}
      <footer className="py-12 px-8 bg-background border-t border-border">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>© 2026 Web App. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
