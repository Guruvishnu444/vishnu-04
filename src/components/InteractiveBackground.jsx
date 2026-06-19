import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── Digital Plexus background (mono-blue, no dot glow) ─────────
// Enhanced version with smoother animations, better performance,
// and cursor repulsion instead of attraction.

const BASE = { r: 70, g: 140, b: 255 }   // mesh line / dot blue
const BRIGHT = { r: 130, g: 210, b: 255 } // bright flowing-strand blue

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = window.innerWidth
    let height = window.innerHeight
    let time = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => { 
      mouseRef.current = { x: e.clientX, y: e.clientY } 
    }
    const handleMouseLeave = () => { 
      mouseRef.current = { x: -9999, y: -9999 } 
    }
    const handleScroll = () => { 
      scrollRef.current = window.scrollY 
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── Optimized node distribution ──
    const area = width * height
    const NODE_COUNT = Math.min(200, Math.max(80, Math.round(area / 8000)))
    const LINK_DIST = Math.min(width, height) * 0.2
    const REPULSION_RADIUS = 150 // Radius for cursor repulsion

    // Create nodes with better distribution
    const nodes = Array.from({ length: NODE_COUNT }, () => {
      // Distribute nodes more evenly with slight clustering
      const x = Math.random() * width * 0.95 + width * 0.025
      const y = Math.random() * height * 0.95 + height * 0.025
      return {
        x, y,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        r: 0.8 + Math.random() * 1.5,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: 0.2 + Math.random() * 0.6,
        baseX: x, // Store original position for gentle return
        baseY: y,
      }
    })

    const wrap = (n) => {
      const margin = 50
      if (n.x < -margin) n.x = width + margin
      if (n.x > width + margin) n.x = -margin
      if (n.y < -margin) n.y = height + margin
      if (n.y > height + margin) n.y = -margin
    }

    // Pre-compute line connections for performance
    const getConnections = (nodes, linkDist) => {
      const connections = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < linkDist) {
            connections.push({ i, j, dist })
          }
        }
      }
      return connections
    }

    let connections = getConnections(nodes, LINK_DIST)

    const animate = () => {
      time += 0.016 // ~60fps timing
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const scrollY = scrollRef.current
      
      // Smooth scroll-based zoom and fade
      const t = Math.min(scrollY / 1500, 1)
      const zoom = 1 + t * 0.12
      const fade = 1 - t * 0.15

      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      // ── Node updates with cursor repulsion ──
      nodes.forEach((n) => {
        // Gentle drift
        n.x += n.vx
        n.y += n.vy
        
        // Cursor repulsion (push away from cursor)
        if (mx > 0 && my > 0) {
          const dx = n.x - mx
          const dy = n.y - my
          const d2 = dx * dx + dy * dy
          
          if (d2 < REPULSION_RADIUS * REPULSION_RADIUS && d2 > 1) {
            const d = Math.sqrt(d2)
            const strength = (1 - d / REPULSION_RADIUS) * 0.8 // Repulsion strength
            n.x += (dx / d) * strength * 2
            n.y += (dy / d) * strength * 2
          }
        }
        
        // Gentle return to base position (creates organic movement)
        n.x += (n.baseX - n.x) * 0.002
        n.y += (n.baseY - n.y) * 0.002
        
        wrap(n)
      })

      // Update connections
      connections = getConnections(nodes, LINK_DIST)

      // ── Draw mesh lines with improved quality ──
      connections.forEach(({ i, j, dist }) => {
        const a = nodes[i]
        const b = nodes[j]
        const proximity = 1 - dist / LINK_DIST
        let alpha = proximity * proximity * 0.45 * fade

        // Subtle cursor influence on line brightness
        if (mx > 0) {
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2
          const mdx = midX - mx
          const mdy = midY - my
          const md2 = mdx * mdx + mdy * mdy
          // Lines near cursor become slightly dimmer (repulsion effect)
          const cursorEffect = Math.min(1, 1 - Math.exp(-md2 / 30000) * 0.3)
          alpha = alpha * cursorEffect
        }

        if (alpha > 0.01) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${BASE.r},${BASE.g},${BASE.b},${alpha})`
          ctx.lineWidth = 0.7 + proximity * 0.3 // Thicker lines when closer
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      })

      // ── Draw crisp nodes with enhanced quality ──
      nodes.forEach((n) => {
        const flick = 0.65 + 0.35 * Math.sin(time * n.flickerSpeed + n.flicker)
        
        // Calculate node brightness based on distance from cursor
        let cursorBoost = 1
        if (mx > 0) {
          const dx = mx - n.x
          const dy = my - n.y
          const d2 = dx * dx + dy * dy
          // Nodes near cursor become dimmer (repulsion)
          cursorBoost = 1 - Math.exp(-d2 / 20000) * 0.5
        }
        
        const alpha = Math.min(1, Math.max(0.15, 0.6 * flick * fade * cursorBoost))
        
        // Node glow effect (subtle, without being too bright)
        const gradient = ctx.createRadialGradient(
          n.x, n.y, 0,
          n.x, n.y, n.r * 2.5
        )
        gradient.addColorStop(0, `rgba(${BRIGHT.r},${BRIGHT.g},${BRIGHT.b},${alpha * 0.8})`)
        gradient.addColorStop(1, `rgba(${BRIGHT.r},${BRIGHT.g},${BRIGHT.b},0)`)
        
        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI * 2)
        ctx.fill()
        
        // Core dot
        ctx.beginPath()
        ctx.fillStyle = `rgba(${BRIGHT.r},${BRIGHT.g},${BRIGHT.b},${alpha * 0.9})`
        ctx.arc(n.x, n.y, n.r * 0.8, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.restore()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
    >
      <div className="absolute inset-0" style={{ background: '#000000' }} />
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          background: 'transparent',
          imageRendering: 'auto',
        }} 
      />
      <div
        className="absolute inset-0"
        style={{ 
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  )
}