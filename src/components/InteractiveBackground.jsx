import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { motion, useScroll, useTransform } from 'framer-motion'
import * as THREE from 'three'

// --- HIGH QUALITY 3D WIREFRAME MESH ---
export default function InteractiveBackground() {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const { dark } = useTheme()

  // Framer Motion Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  // Map scroll to 3D Zoom (1x to 1.5x) 
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.5])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return

    // 1. Setup Three.js Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 6)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // Cap for performance
    
    // Append canvas
    const container = containerRef.current
    if (container) {
      // Clear any existing children (just in case)
      while (container.firstChild) container.removeChild(container.firstChild)
      container.appendChild(renderer.domElement)
    }

    // 2. Create the 3D Wireframe Silhouette (Head & Neck)
    // We use a LatheGeometry to create the organic profile curve
    const points = [];
    // Profile curve data (Creates a generic head/neck shape matching your image)
    points.push(new THREE.Vector2(0.0, -1.2));  // Neck base
    points.push(new THREE.Vector2(0.5, -1.0));
    points.push(new THREE.Vector2(0.7, -0.5));
    points.push(new THREE.Vector2(0.8, 0.0));  // Chin
    points.push(new THREE.Vector2(0.7, 0.4));  // Mouth area
    points.push(new THREE.Vector2(0.6, 0.8));  // Nose
    points.push(new THREE.Vector2(0.55, 1.1)); // Forehead
    points.push(new THREE.Vector2(0.5, 1.4));  // Top of head
    points.push(new THREE.Vector2(0.2, 1.5));
    points.push(new THREE.Vector2(0.0, 1.5));  // Top center

    const geometry = new THREE.LatheGeometry(points, 64) // 64 segments for high detail
    
    // 3. Create the Wireframe and Nodes (The "Dots" and "Lines" look)
    // Instead of a solid mesh, we create an EdgesGeometry to draw the wires
    const edges = new THREE.EdgesGeometry(geometry)
    
    // Setup colors based on Theme
    const getColor = (isDark) => {
      return isDark ? 0xffffff : 0x1a1a2e // White in dark mode, Dark blue in light mode
    }
    
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: getColor(dark), 
      transparent: true, 
      opacity: 0.25 
    })
    const wireframe = new THREE.LineSegments(edges, lineMaterial)
    scene.add(wireframe)

    // Add "Dense particle nodes" at the vertices
    const positions = geometry.attributes.position.array
    const particleGeometry = new THREE.BufferGeometry()
    // Extract unique vertices
    const uniquePoints = []
    const seen = new Set()
    for (let i = 0; i < positions.length; i += 3) {
      const key = `${positions[i].toFixed(2)},${positions[i+1].toFixed(2)},${positions[i+2].toFixed(2)}`
      if (!seen.has(key)) {
        seen.add(key)
        uniquePoints.push(positions[i], positions[i+1], positions[i+2])
      }
    }
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(uniquePoints, 3))
    
    const particleMaterial = new THREE.PointsMaterial({
      color: getColor(dark),
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    // 4. Animation Loop (Rotates Slowly like the reference image)
    let time = 0
    const animate = () => {
      time += 0.003
      // Smooth organic rotation
      wireframe.rotation.y = Math.sin(time) * 0.4
      wireframe.rotation.x = Math.sin(time * 0.7) * 0.1
      particles.rotation.y = wireframe.rotation.y
      particles.rotation.x = wireframe.rotation.x
      
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // 5. Window Resize Handling
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      edges.dispose()
      particleGeometry.dispose()
      // Cancel animation not strictly needed if component unmounts
    }
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      // Use Framer Motion to physically zoom the 3D canvas container
      style={{ 
        scale: zoom,
        transformOrigin: "center center"
      }}
    >
      {/* Background Color Transition */}
      <motion.div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          backgroundColor: dark ? '#0b0b0e' : '#eef2f9' // Deep dark or soft light grey
        }} 
      />
    </motion.div>
  )
}