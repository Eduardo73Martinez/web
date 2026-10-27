import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Rocket, Star, Globe, Zap, Eye, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'

/**
 * CosmosWorld — An immersive scroll-driven space exploration experience.
 * 
 * Features:
 * - Three.js particle starfield that responds to scroll
 * - Parallax sections with smooth framer-motion animations
 * - Interactive 3D planet that rotates on scroll
 * - Floating asteroids with depth layers
 * - Scroll-triggered text reveals
 * - Dynamic lighting effects
 */

function StarField({ scrollProgress }) {
  const containerRef = useRef(null)
  const starsRef = useRef(null)
  const asteroidsRef = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 50

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Create star particles
    const starsGeometry = new THREE.BufferGeometry()
    const starsCount = 8000
    const positions = new Float32Array(starsCount * 3)
    const colors = new Float32Array(starsCount * 3)
    const sizes = new Float32Array(starsCount)

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3
      const radius = 50 + Math.random() * 150
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      // Star colors: white, blue-white, yellow
      const colorType = Math.random()
      if (colorType < 0.6) {
        colors[i3] = 1; colors[i3 + 1] = 1; colors[i3 + 2] = 1
      } else if (colorType < 0.8) {
        colors[i3] = 0.7; colors[i3 + 1] = 0.8; colors[i3 + 2] = 1
      } else {
        colors[i3] = 1; colors[i3 + 1] = 0.9; colors[i3 + 2] = 0.7
      }

      sizes[i] = Math.random() * 2
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)
    starsRef.current = stars

    // Create asteroids
    const asteroidGeometry = new THREE.IcosahedronGeometry(1, 1)
    const asteroidMaterial = new THREE.MeshStandardMaterial({
      color: 0x666666,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true
    })

    for (let i = 0; i < 15; i++) {
      const asteroid = new THREE.Mesh(
        asteroidGeometry,
        asteroidMaterial.clone()
      )
      
      const scale = 0.3 + Math.random() * 1.5
      asteroid.scale.set(scale, scale * (0.7 + Math.random() * 0.6), scale)
      asteroid.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        -20 - Math.random() * 80
      )
      asteroid.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      
      asteroid.userData = {
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        orbitSpeed: 0.001 + Math.random() * 0.003,
        orbitRadius: asteroid.position.distanceTo(new THREE.Vector3(0, 0, 0)),
        orbitAngle: Math.atan2(asteroid.position.y, asteroid.position.x)
      }

      scene.add(asteroid)
      asteroidsRef.current.push(asteroid)
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 2, 100)
    pointLight.position.set(10, 10, 10)
    scene.add(pointLight)

    const pointLight2 = new THREE.PointLight(0x4444ff, 1, 100)
    pointLight2.position.set(-10, -10, 10)
    scene.add(pointLight2)

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Rotate stars based on scroll
      if (starsRef.current) {
        starsRef.current.rotation.y = scrollProgress * Math.PI * 2
        starsRef.current.rotation.x = scrollProgress * Math.PI * 0.5
      }

      // Animate asteroids
      asteroidsRef.current.forEach(asteroid => {
        asteroid.rotation.x += asteroid.userData.rotSpeed.x
        asteroid.rotation.y += asteroid.userData.rotSpeed.y
        asteroid.rotation.z += asteroid.userData.rotSpeed.z
        
        // Orbital motion
        asteroid.userData.orbitAngle += asteroid.userData.orbitSpeed * 0.01
        asteroid.position.x = Math.cos(asteroid.userData.orbitAngle) * asteroid.userData.orbitRadius
        asteroid.position.y = Math.sin(asteroid.userData.orbitAngle) * asteroid.userData.orbitRadius
      })

      // Camera movement based on scroll
      camera.position.z = 50 - scrollProgress * 30
      camera.position.y = scrollProgress * 10

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      container.removeChild(renderer.domElement)
      renderer.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
      asteroidsRef.current.forEach(a => {
        a.geometry.dispose()
        a.material.dispose()
      })
    }
  }, [])

  // Update scroll progress
  useEffect(() => {
    // Scroll progress is read in the animation loop
  }, [scrollProgress])

  return (
    <div 
      ref={containerRef} 
      className="cosmos-starfield"
      style={{ 
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  )
}

function Planet3D({ scrollProgress, position }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Planet
    const planetGeometry = new THREE.SphereGeometry(1.5, 64, 64)
    
    // Create planet material with procedural texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    
    // Draw planet surface
    const gradient = ctx.createLinearGradient(0, 0, 512, 256)
    gradient.addColorStop(0, '#1a237e')
    gradient.addColorStop(0.3, '#283593')
    gradient.addColorStop(0.5, '#3949ab')
    gradient.addColorStop(0.7, '#1565c0')
    gradient.addColorStop(1, '#0d47a1')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 256)
    
    // Add some noise for surface detail
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 256
      const r = Math.random() * 3
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.1
    })

    const planet = new THREE.Mesh(planetGeometry, planetMaterial)
    scene.add(planet)

    // Atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.7, 32, 32)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    scene.add(atmosphere)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    scene.add(ambientLight)

    const sunLight = new THREE.DirectionalLight(0xffffff, 2)
    sunLight.position.set(5, 3, 5)
    scene.add(sunLight)

    const rimLight = new THREE.DirectionalLight(0x4488ff, 0.5)
    rimLight.position.set(-5, 0, -5)
    scene.add(rimLight)

    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      planet.rotation.y += 0.005
      planet.rotation.x = scrollProgress * 0.5
      
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      container.removeChild(renderer.domElement)
      renderer.dispose()
      planetGeometry.dispose()
      planetMaterial.dispose()
      texture.dispose()
      atmosphereGeometry.dispose()
      atmosphereMaterial.dispose()
    }
  }, [])

  useEffect(() => {
    // Scroll progress affects rotation in animation loop
  }, [scrollProgress])

  return (
    <div 
      ref={containerRef}
      className="cosmos-planet"
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        ...position
      }}
    />
  )
}

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  })
  
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [100, 0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  
  const springY = useSpring(y, { stiffness: 100, damping: 30 })
  const springOpacity = useSpring(opacity, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      ref={ref}
      style={{ y: springY, opacity: springOpacity }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function CosmosWorld() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef(null)

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

  const features = [
    { icon: Rocket, title: 'Exploración', desc: 'Viaja más allá de los límites conocidos del universo' },
    { icon: Star, title: 'Descubrimiento', desc: 'Encuentra nuevos mundos y civilizaciones' },
    { icon: Globe, title: 'Conexión', desc: 'Únete a una comunidad de exploradores cósmicos' },
    { icon: Zap, title: 'Velocidad', desc: 'Tecnología de propulsión avanzada para viajes instantáneos' },
    { icon: Eye, title: 'Visión', desc: 'Observa el cosmos en resolución nunca antes vista' },
    { icon: Sparkles, title: 'Innovación', desc: 'Cada día descubrimos nuevas posibilidades' }
  ]

  return (
    <div ref={containerRef} className="cosmos-world">
      <StarField scrollProgress={scrollProgress} />
      
      {/* Hero Section */}
      <section className="cosmos-hero">
        <div className="cosmos-hero-content">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="cosmos-badge">
              <Rocket className="cosmos-badge-icon" />
              <span>Exploración Espacial 2026</span>
            </div>
            
            <h1 className="cosmos-title">
              El universo<br />
              <span className="cosmos-title-gradient">te espera</span>
            </h1>
            
            <p className="cosmos-subtitle">
              Desplázate para iniciar tu viaje a través de las estrellas. 
              Una experiencia inmersiva donde cada scroll te acerca más a los misterios del cosmos.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="cosmos-scroll-hint"
          >
            <ChevronDown className="cosmos-scroll-arrow" />
            <span>Desplaza para explorar</span>
          </motion.div>
        </div>
      </section>

      {/* Section 1: Planet Discovery */}
      <section className="cosmos-section cosmos-planet-section">
        <div className="cosmos-section-content">
          <Section>
            <div className="cosmos-text">
              <span className="cosmos-section-number">01 / 04</span>
              <h2 className="cosmos-section-title">
                Mundos por descubrir
              </h2>
              <p className="cosmos-section-body">
                Miles de planetas esperan ser explorados. Cada uno con su propia 
                atmósfera, gravedad y secretos ancestrales que contar.
              </p>
            </div>
          </Section>
          
          <div className="cosmos-planet-container">
            <Planet3D scrollProgress={scrollProgress} position={{ right: '10%', top: '20%' }} />
          </div>
        </div>
      </section>

      {/* Section 2: Features Grid */}
      <section className="cosmos-section cosmos-features-section">
        <div className="cosmos-container">
          <Section>
            <div className="cosmos-text-center">
              <span className="cosmos-section-number">02 / 04</span>
              <h2 className="cosmos-section-title">
                Tecnología estelar
              </h2>
              <p className="cosmos-section-body cosmos-max-width">
                Herramientas avanzadas para la exploración del espacio profundo
              </p>
            </div>
          </Section>
          
          <div className="cosmos-features-grid">
            {features.map((feature, index) => (
              <Section key={index} className="cosmos-feature-card-wrapper">
                <div className="cosmos-feature-card">
                  <div className="cosmos-feature-icon">
                    <feature.icon />
                  </div>
                  <h3 className="cosmos-feature-title">{feature.title}</h3>
                  <p className="cosmos-feature-desc">{feature.desc}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Nebula Journey */}
      <section className="cosmos-section cosmos-nebula-section">
        <div className="cosmos-nebula-bg" />
        <div className="cosmos-section-content">
          <Section>
            <div className="cosmos-text">
              <span className="cosmos-section-number">03 / 04</span>
              <h2 className="cosmos-section-title">
                Viaje a través de<br />
                <span className="cosmos-text-gradient">la nebulosa</span>
              </h2>
              <p className="cosmos-section-body">
                Las nebulosas son los cunas del universo. Aquí nacen las estrellas, 
                se forjan los planetas y se escriben las leyes de la física.
              </p>
              <div className="cosmos-stats">
                <div className="cosmos-stat">
                  <span className="cosmos-stat-value">200B+</span>
                  <span className="cosmos-stat-label">Estrellas conocidas</span>
                </div>
                <div className="cosmos-stat">
                  <span className="cosmos-stat-value">13.8B</span>
                  <span className="cosmos-stat-label">Años de edad del universo</span>
                </div>
                <div className="cosmos-stat">
                  <span className="cosmos-stat-value">∞</span>
                  <span className="cosmos-stat-label">Posibilidades</span>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section className="cosmos-section cosmos-cta-section">
        <div className="cosmos-cta-bg" />
        <Section>
          <div className="cosmos-cta-content">
            <span className="cosmos-section-number">04 / 04</span>
            <h2 className="cosmos-cta-title">
              Tu viaje comienza aquí
            </h2>
            <p className="cosmos-cta-body">
              Únete a la misión más ambiciosa de la humanidad. 
              El cosmos no espera a nadie.
            </p>
            <div className="cosmos-cta-buttons">
              <button className="cosmos-btn cosmos-btn-primary">
                Iniciar misión
                <ArrowRight className="cosmos-btn-icon" />
              </button>
              <button className="cosmos-btn cosmos-btn-secondary">
                Saber más
              </button>
            </div>
          </div>
        </Section>
      </section>

      <style jsx>{`
        .cosmos-world {
          position: relative;
          background: #000000;
          color: #ffffff;
          overflow-x: hidden;
        }

        .cosmos-hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .cosmos-hero-content {
          text-align: center;
          max-width: 900px;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .cosmos-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(68, 136, 255, 0.15);
          border: 1px solid rgba(68, 136, 255, 0.3);
          border-radius: 999px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #88bbff;
          margin-bottom: 2rem;
        }

        .cosmos-badge-icon {
          width: 16px;
          height: 16px;
        }

        .cosmos-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .cosmos-title-gradient {
          background: linear-gradient(135deg, #4488ff 0%, #88bbff 50%, #ff8844 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cosmos-subtitle {
          font-size: clamp(1.125rem, 2vw, 1.5rem);
          color: rgba(255, 255, 255, 0.7);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .cosmos-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.875rem;
          animation: cosmos-bounce 2s ease-in-out infinite;
        }

        .cosmos-scroll-arrow {
          width: 24px;
          height: 24px;
        }

        @keyframes cosmos-bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }

        .cosmos-section {
          position: relative;
          z-index: 10;
          padding: 10vh 0;
        }

        .cosmos-section-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .cosmos-section-number {
          font-family: ui-monospace, Menlo, monospace;
          font-size: 0.875rem;
          color: #4488ff;
          letter-spacing: 0.1em;
        }

        .cosmos-section-title {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          margin: 1rem 0;
          line-height: 1.2;
        }

        .cosmos-section-body {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.7;
          max-width: 500px;
        }

        .cosmos-planet-container {
          position: relative;
          height: 400px;
        }

        .cosmos-planet {
          position: absolute !important;
        }

        .cosmos-features-section {
          background: linear-gradient(180deg, transparent 0%, rgba(68, 136, 255, 0.05) 50%, transparent 100%);
        }

        .cosmos-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .cosmos-text-center {
          text-align: center;
          margin-bottom: 4rem;
        }

        .cosmos-max-width {
          max-width: 600px;
          margin: 0 auto;
        }

        .cosmos-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .cosmos-feature-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .cosmos-feature-card:hover {
          background: rgba(68, 136, 255, 0.1);
          border-color: rgba(68, 136, 255, 0.3);
          transform: translateY(-4px);
        }

        .cosmos-feature-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(68, 136, 255, 0.15);
          border-radius: 12px;
          margin-bottom: 1rem;
          color: #88bbff;
        }

        .cosmos-feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .cosmos-feature-desc {
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.6;
        }

        .cosmos-nebula-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
        }

        .cosmos-nebula-bg {
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(136, 0, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(255, 0, 136, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(0, 136, 255, 0.15) 0%, transparent 50%);
          animation: cosmos-nebula-pulse 8s ease-in-out infinite;
        }

        @keyframes cosmos-nebula-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        .cosmos-text-gradient {
          background: linear-gradient(135deg, #ff88ff 0%, #8888ff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cosmos-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .cosmos-stat {
          text-align: center;
        }

        .cosmos-stat-value {
          display: block;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4488ff 0%, #88bbff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cosmos-stat-label {
          display: block;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.5rem;
        }

        .cosmos-cta-section {
          min-height: 80vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cosmos-cta-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(68, 136, 255, 0.1) 100%);
        }

        .cosmos-cta-content {
          text-align: center;
          max-width: 700px;
          padding: 2rem;
        }

        .cosmos-cta-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin: 1rem 0;
        }

        .cosmos-cta-body {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .cosmos-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cosmos-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .cosmos-btn-primary {
          background: linear-gradient(135deg, #4488ff 0%, #2266dd 100%);
          color: white;
        }

        .cosmos-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(68, 136, 255, 0.4);
        }

        .cosmos-btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .cosmos-btn-secondary:hover {
          border-color: #4488ff;
          background: rgba(68, 136, 255, 0.1);
        }

        .cosmos-btn-icon {
          width: 20px;
          height: 20px;
        }

        @media (max-width: 768px) {
          .cosmos-section-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .cosmos-planet-container {
            height: 300px;
          }

          .cosmos-stats {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .cosmos-features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

export default CosmosWorld
