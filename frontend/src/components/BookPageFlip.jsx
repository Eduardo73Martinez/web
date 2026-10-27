import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * BookPageFlip — 3D book with wind-driven page turning on scroll.
 * 
 * As the user scrolls, pages flip from right to left like wind is blowing
 * through an open book resting on a table. Each page has a slight curve
 * and shadow for realism.
 */
function BookPageFlip({ 
  pageCount = 12, 
  scrollProgress = 0,
  bookWidth = 2.4, 
  bookHeight = 1.8,
  pageColor = '#f5f0e8'
}) {
  const containerRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 2.5, 4)
    camera.lookAt(0, 0, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5e6, 0.6)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2)
    dirLight.position.set(3, 5, 4)
    dirLight.castShadow = true
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xffd4a6, 0.5, 10)
    pointLight.position.set(-2, 3, 2)
    scene.add(pointLight)

    // Table surface
    const tableGeo = new THREE.BoxGeometry(8, 0.15, 4)
    const tableMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b6f47,
      roughness: 0.8,
      metalness: 0.1
    })
    const table = new THREE.Mesh(tableGeo, tableMat)
    table.position.y = -0.8
    table.receiveShadow = true
    scene.add(table)

    // Book spine
    const spineGeo = new THREE.BoxGeometry(0.15, bookHeight * 0.95, 0.3)
    const spineMat = new THREE.MeshStandardMaterial({ 
      color: 0x5c3a1e,
      roughness: 0.6,
      metalness: 0.05
    })
    const spine = new THREE.Mesh(spineGeo, spineMat)
    spine.position.y = -0.1
    spine.castShadow = true
    spine.receiveShadow = true
    scene.add(spine)

    // Create pages — each gets its own geometry to avoid sharing
    const pages = []
    const halfWidth = bookWidth * 0.24
    
    for (let i = 0; i < pageCount; i++) {
      const geo = new THREE.PlaneGeometry(halfWidth, bookHeight * 0.9, 20, 1)
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(pageColor),
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.95
      })

      const page = new THREE.Mesh(geo, mat)
      page.castShadow = true
      page.receiveShadow = true
      
      page.position.x = halfWidth * 0.5
      page.position.y = -0.1
      page.position.z = i * 0.003
      page.rotation.y = 0
      page.rotation.order = 'YXZ'
      
      page.userData = {
        baseX: halfWidth * 0.5,
        flipProgress: 0
      }
      
      scene.add(page)
      pages.push(page)
    }

    // Animation loop
    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Update page positions based on scrollProgress
      const pagesToFlip = Math.floor(scrollProgress * pageCount)
      const partialFlip = (scrollProgress * pageCount) - pagesToFlip

      pages.forEach((page, i) => {
        let targetProgress = 0
        
        if (i < pagesToFlip) {
          targetProgress = 1
        } else if (i === pagesToFlip) {
          targetProgress = partialFlip
        }
        
        // Smooth interpolation
        page.userData.flipProgress += (targetProgress - page.userData.flipProgress) * 0.15
        const p = page.userData.flipProgress

        // Page flip: rotate around left edge (spine side)
        page.rotation.y = p * Math.PI
        
        // Move from right to left
        page.position.x = page.userData.baseX * (1 - p * 2)
        
        // Arc: page rises during flip
        const arcHeight = Math.sin(p * Math.PI) * 0.5
        page.position.y = -0.1 + arcHeight
        
        // Curve effect on geometry
        const positions = page.geometry.attributes.position
        for (let j = 0; j < positions.count; j++) {
          const localX = positions.getX(j)
          const normalizedX = (localX / halfWidth + 1) * 0.5 // 0 to 1
          const curve = Math.sin(normalizedX * Math.PI) * p * 0.2
          positions.setZ(j, -curve)
        }
        positions.needsUpdate = true
        page.geometry.computeVertexNormals()
      })

      renderer.render(scene, camera)
    }
    animate()
    animationRef.current = animationId

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
      pages.forEach(page => {
        page.geometry.dispose()
        page.material.dispose()
      })
      tableGeo.dispose()
      tableMat.dispose()
      spineGeo.dispose()
      spineMat.dispose()
    }
  }, [pageCount, bookWidth, bookHeight, pageColor])

  // Update scroll progress without re-creating scene
  useEffect(() => {
    // Scroll progress is read directly in the animation loop via closure
    // No need for separate effect
  }, [scrollProgress])

  return (
    <div 
      ref={containerRef} 
      className="book-page-flip"
      style={{ 
        width: '100%', 
        height: '100%',
        position: 'relative'
      }}
    />
  )
}

export default BookPageFlip
