import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Digital Plexus Background (Ultra Dark, Depth Zoom) ─────────
// Features:
// - Darker color palette with deep blue tones
// - Depth zoom that scales with scroll (zooms in as you scroll down)
// - Contrast adjustment that responds to scroll position
// - Cursor repulsion with organic node movement
// - Smooth transitions between scroll states

const DARK_BASE = { r: 40, g: 80, b: 180 }     // Deeper mesh line blue
const DARK_BRIGHT = { r: 100, g: 180, b: 255 }  // Brighter node blue
const DARKEST = { r: 20, g: 40, b: 100 }        // For deep contrast

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [mounted, setMounted] = useState(false)
  
  // Framer Motion scroll tracking
  const { scrollY } = useScroll()
  const scrollProgress = useTransform(scrollY, [0, 2000], [0, 1])
  const [scrollValue, setScrollValue] = useState(0)

  useEffect(() => { 
    setMounted(true) 
    const unsubscribe = scrollProgress.onChange(value => {
      setScrollValue(value)
    })
    return () => unsubscribe()
  }, [scrollProgress])

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
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // ── Enhanced node distribution with depth layers ──
    const area = width * height
    const NODE_COUNT = Math.min(220, Math.max(90, Math.round(area / 7500)))
    const LINK_DIST = Math.min(width, height) * 0.18
    const REPULSION_RADIUS = 180

    // Create nodes with depth layers (z-index for 3D effect)
    const nodes = Array.from({ length: NODE_COUNT }, (_, index) => {
      const depthLayer = Math.random() // 0-1 for z-depth
      const x = Math.random() * width * 0.92 + width * 0.04
      const y = Math.random() * height * 0.92 + height * 0.04
      return {
        x, y,
        vx: (Math.random() - 0.5) * 0.03,
        vy: (Math.random() - 0.5) * 0.03,
        r: 0.6 + Math.random() * 1.8,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: 0.15 + Math.random() * 0.7,
        baseX: x,
        baseY: y,
        depth: depthLayer, // For 3D effects
        pulseOffset: Math.random() * Math.PI * 2,
      }
    })

    const wrap = (n) => {
      const margin = 60
      if (n.x < -margin) n.x = width + margin
      if (n.x > width + margin) n.x = -margin
      if (n.y < -margin) n.y = height + margin
      if (n.y > height + margin) n.y = -margin
    }

    // ── Optimized connection calculation ──
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
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      
      // ── Scroll-based depth zoom and contrast ──
      const scrollT = Math.min(scrollValue, 1)
      
      // Depth zoom: zooms in progressively as you scroll
      const minZoom = 1
      const maxZoom = 1.35
      const zoom = minZoom + (maxZoom - minZoom) * scrollT
      
      // Contrast: increases darkness and contrast as you scroll
      const contrastBoost = 1 + scrollT * 0.4
      const darkness = 1 - scrollT * 0.15 // Darker as you scroll
      const brightnessBoost = 1 + scrollT * 0.2 // Brighter nodes at depth
      
      // Dynamic fade based on scroll
      const baseFade = 0.85 - scrollT * 0.15

      ctx.save()
      
      // ── Apply depth zoom with center focus ──
      const centerX = width / 2
      const centerY = height / 2
      ctx.translate(centerX, centerY)
      ctx.scale(zoom, zoom)
      ctx.translate(-centerX, -centerY)

      // ── Apply contrast enhancement ──
      // Darken the background slightly as scroll progresses
      const bgDarkness = 0.05 + scrollT * 0.08
      ctx.fillStyle = `rgba(0, 0, 0, ${bgDarkness})`
      ctx.fillRect(0, 0, width, height)

      // ── Update nodes with depth-based movement ──
      nodes.forEach((n) => {
        // Depth-based drift speed (deeper nodes move slower)
        const depthFactor = 1 - n.depth * 0.3
        n.x += n.vx * depthFactor
        n.y += n.vy * depthFactor
        
        // Cursor repulsion with depth influence
        if (mx > 0 && my > 0) {
          const dx = n.x - mx
          const dy = n.y - my
          const d2 = dx * dx + dy * dy
          
          if (d2 < REPULSION_RADIUS * REPULSION_RADIUS && d2 > 1) {
            const d = Math.sqrt(d2)
            // Deeper nodes react less to cursor
            const depthReact = 1 - n.depth * 0.5
            const strength = (1 - d / REPULSION_RADIUS) * 0.7 * depthReact
            n.x += (dx / d) * strength * 2
            n.y += (dy / d) * strength * 2
          }
        }
        
        // Gentle return with depth influence
        const returnSpeed = 0.001 + (1 - n.depth) * 0.002
        n.x += (n.baseX - n.x) * returnSpeed
        n.y += (n.baseY - n.y) * returnSpeed
        
        wrap(n)
      })

      // Update connections
      connections = getConnections(nodes, LINK_DIST * (1 + scrollT * 0.1))

      // ── Draw mesh lines with depth and contrast ──
      connections.forEach(({ i, j, dist }) => {
        const a = nodes[i]
        const b = nodes[j]
        const proximity = 1 - dist / (LINK_DIST * (1 + scrollT * 0.1))
        
        // Depth-based alpha (deeper nodes create dimmer lines)
        const avgDepth = (a.depth + b.depth) / 2
        const depthDim = 1 - avgDepth * 0.4
        
        let alpha = proximity * proximity * 0.4 * baseFade * depthDim * darkness
        
        // Scroll contrast effect: lines get slightly more defined at depth
        alpha = Math.min(0.8, alpha * contrastBoost * 0.9)

        // Cursor influence (dimming near cursor)
        if (mx > 0) {
          const midX = (a.x + b.x) / 2
          const midY = (a.y + b.y) / 2
          const mdx = midX - mx
          const mdy = midY - my
          const md2 = mdx * mdx + mdy * mdy
          const cursorEffect = Math.min(1, 1 - Math.exp(-md2 / 30000) * 0.25)
          alpha = alpha * cursorEffect
        }

        if (alpha > 0.01) {
          // Color shifts darker with scroll
          const r = Math.floor(DARK_BASE.r * (1 - scrollT * 0.2))
          const g = Math.floor(DARK_BASE.g * (1 - scrollT * 0.15))
          const b = Math.floor(DARK_BASE.b * (1 - scrollT * 0.1))
          
          ctx.beginPath()
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
          ctx.lineWidth = 0.5 + proximity * 0.4
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      })

      // ── Draw nodes with depth and contrast enhancement ──
      nodes.forEach((n) => {
        const flick = 0.6 + 0.4 * Math.sin(time * n.flickerSpeed + n.flicker)
        const pulse = 0.8 + 0.2 * Math.sin(time * 0.5 + n.pulseOffset)
        
        // Depth influence on node appearance
        const depthBrightness = 1 - n.depth * 0.3
        const sizeMod = 1 + (1 - n.depth) * 0.3
        
        // Cursor proximity dimming
        let cursorDim = 1
        if (mx > 0) {
          const dx = mx - n.x
          const dy = my - n.y
          const d2 = dx * dx + dy * dy
          cursorDim = 1 - Math.exp(-d2 / 20000) * 0.4
        }
        
        // Scroll-based brightness boost
        const scrollBrightness = 1 + scrollT * 0.3
        
        const alpha = Math.min(1, Math.max(0.1, 
          0.5 * flick * baseFade * depthBrightness * cursorDim * scrollBrightness
        ))
        
        const finalRadius = n.r * sizeMod * pulse * (1 + scrollT * 0.1)

        // ── Node glow (depth-based) ──
        const glowRadius = finalRadius * (2 + scrollT * 1.5)
        const gradient = ctx.createRadialGradient(
          n.x, n.y, 0,
          n.x, n.y, glowRadius
        )
        
        // Brighter colors with scroll
        const brightR = Math.min(255, DARK_BRIGHT.r + scrollT * 30)
        const brightG = Math.min(255, DARK_BRIGHT.g + scrollT * 20)
        const brightB = Math.min(255, DARK_BRIGHT.b)
        
        gradient.addColorStop(0, `rgba(${brightR},${brightG},${brightB},${alpha * 0.9})`)
        gradient.addColorStop(0.3, `rgba(${brightR},${brightG},${brightB},${alpha * 0.4})`)
        gradient.addColorStop(1, `rgba(${brightR},${brightG},${brightB},0)`)
        
        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(n.x, n.y, glowRadius, 0, Math.PI * 2)
        ctx.fill()

        // ── Core dot with contrast boost ──
        const coreAlpha = Math.min(1, alpha * (1 + scrollT * 0.3))
        ctx.beginPath()
        ctx.fillStyle = `rgba(${brightR},${brightG},${brightB},${coreAlpha * 0.85})`
        ctx.arc(n.x, n.y, finalRadius * 0.7, 0, Math.PI * 2)
        ctx.fill()
        
        // ── Inner bright core for depth effect ──
        if (scrollT > 0.3) {
          const innerBrightness = 1 + (scrollT - 0.3) * 0.5
          ctx.beginPath()
          ctx.fillStyle = `rgba(180, 220, 255, ${coreAlpha * 0.3 * innerBrightness})`
          ctx.arc(n.x, n.y, finalRadius * 0.3, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      ctx.restore()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mounted, scrollValue])

  if (!mounted) return null

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: 'easeOut' }}
    >
      {/* Deep dark background with gradient */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          background: 'radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%, #000000 100%)',
        }}
      />
      
      {/* Canvas layer */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full" 
        style={{ 
          background: 'transparent',
          imageRendering: 'auto',
        }} 
      />
      
      {/* Subtle vignette overlay that darkens with scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />
      
      {/* Depth fog overlay for 3D effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,20,0.1) 50%, rgba(0,0,10,0.2) 100%)',
        }}
      />
    </motion.div>
  )
}