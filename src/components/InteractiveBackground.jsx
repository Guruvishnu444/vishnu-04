import { useEffect, useRef, useState, useCallback } from 'react'
import { useTheme } from '../ThemeContext'
import { motion, useScroll, useTransform } from 'framer-motion'

// High-performance 3D Particle Network
export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [mounted, setMounted] = useState(false)
  const { dark } = useTheme()

  // Framer Motion scroll tracking (horizontal scroll behavior simulation)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  // Map scroll progress to Zoom (0 to 1.6x) and Opacity (1 to 0.7)
  const zoom = useTransform(scrollYProgress, [0, 1], [1, 1.6])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.75])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    let width = window.innerWidth
    let height = window.innerHeight
    let time = 0
    let particles = []
    let mouseX = -9999
    let mouseY = -9999

    // ── 1. High Quality Particle System ──────────────────────
    const PARTICLE_COUNT = 280 // High but optimized for 60fps
    const CONNECTION_DIST = 110 // Max distance for lines

    const initParticles = () => {
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2, // Very subtle drift
          vy: (Math.random() - 0.5) * 0.2,
          radius: 0.8 + Math.random() * 1.5,
          baseX: Math.random() * width,
          baseY: Math.random() * height
        })
      }
    }
    initParticles()

    // ── 2. Responsive Resize ─────────────────────────────────
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }
    window.addEventListener('resize', resize)

    // ── 3. Mouse & Scroll Handlers ──────────────────────────
    const handleMouseMove = (e) => { 
      mouseRef.current = { x: e.clientX, y: e.clientY }
      mouseX = e.clientX
      mouseY = e.clientY
    }
    const handleMouseLeave = () => { 
      mouseRef.current = { x: -9999, y: -9999 }
      mouseX = -9999
      mouseY = -9999
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // ── 4. Color Palette (Matches uploaded image) ────────────
    // Light Mode: White mesh on light blue/grey background
    // Dark Mode: White/Silver mesh on black/dark grey background
    const getColors = (isDark) => {
      return {
        node: isDark ? '255, 255, 255' : '20, 30, 40',
        edge: isDark ? '200, 210, 220' : '40, 60, 80',
        glow: isDark ? '255, 255, 255' : '0, 150, 255'
      }
    }

    // ── 5. Main Animation Loop (High Performance) ────────────
    const animate = () => {
      time += 0.005
      ctx.clearRect(0, 0, width, height)
      
      const colors = getColors(dark)

      // ── Move Particles (Fluid dynamics) ──────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        
        // Mouse attraction force (magnetic pull)
        if (mouseX > 0) {
          const dx = mouseX - p.x
          const dy = mouseY - p.y
          const dist = Math.sqrt(dx*dx + dy*dy)
          if (dist < 250) {
            const force = (250 - dist) / 250 * 0.02
            p.vx += dx / dist * force
            p.vy += dy / dist * force
          }
        }

        // Drift back to base position (creates the organic flow)
        p.vx += (p.baseX - p.x) * 0.001
        p.vy += (p.baseY - p.y) * 0.001

        // Apply velocity & boundary check
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.98 // Damping
        p.vy *= 0.98

        // Wrap around edges
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0
      }

      // ── Draw Triangulated Network (Mesh) ─────────────────
      // We draw lines first, then nodes on top for better depth
      const connectedPairs = []

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i]
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx*dx + dy*dy)

          if (dist < CONNECTION_DIST) {
            connectedPairs.push({ p1, p2, dist })
          }
        }
      }

      // Draw Edges (The fine web lines)
      ctx.lineWidth = 0.4
      for (const pair of connectedPairs) {
        const alpha = (1 - pair.dist / CONNECTION_DIST) * 0.6
        ctx.beginPath()
        ctx.moveTo(pair.p1.x, pair.p1.y)
        ctx.lineTo(pair.p2.x, pair.p2.y)
        ctx.strokeStyle = `rgba(${colors.edge}, ${alpha})`
        ctx.stroke()
      }

      // Draw Nodes (The bright dots)
      for (const p of particles) {
        const alpha = 0.3 + Math.sin(time * 2 + p.x) * 0.2 // Subtle shimmer
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        
        // Inner bright center
        ctx.fillStyle = `rgba(${colors.node}, ${0.8 * alpha})`
        ctx.fill()
        
        // Outer glow (Soft corona)
        ctx.shadowColor = `rgba(${colors.glow}, ${0.2 * alpha})`
        ctx.shadowBlur = 6
        ctx.fill()
        ctx.shadowBlur = 0 // Reset shadow for performance
      }

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <motion.div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      // Framer Motion applies the scroll-based zoom here
      style={{ 
        scale: zoom, 
        opacity: opacity,
        transformOrigin: "center center"
      }}
    >
      {/* Background Color Transition */}
      <motion.div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{ 
          backgroundColor: dark ? '#09090b' : '#e8f4f8' 
        }} 
      />
      
      {/* The Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
    </motion.div>
  )
}