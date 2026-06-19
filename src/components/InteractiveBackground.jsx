import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ── Horizontal Glowing Dotted Wave ──────────────────────────────
// Features:
// - Twisted, organic ribbon composed of glowing dots
// - Deep dark background with a bright blue light source on the right
// - Scroll controls the wave's phase (flows as you scroll)
// - Subtle cursor tracking (tilts the wave toward your mouse)
// - Smooth, shimmering pulsing dots

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
    const unsubscribe = scrollProgress.onChange((value) => {
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

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // ── Base Background ──
      ctx.fillStyle = '#05050f' // Deep dark blue/black
      ctx.fillRect(0, 0, width, height)

      // ── Right-side Blue Glow (matches the image) ──
      const rightGlow = ctx.createRadialGradient(
        width * 0.85, height * 0.5, 0,
        width * 0.85, height * 0.5, width * 0.6
      )
      rightGlow.addColorStop(0, 'rgba(30, 100, 255, 0.2)')
      rightGlow.addColorStop(0.3, 'rgba(10, 50, 180, 0.1)')
      rightGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
      ctx.fillStyle = rightGlow
      ctx.fillRect(0, 0, width, height)

      // ── Mouse Influence ──
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseOffset = mx > 0 ? (my - height / 2) * 0.12 : 0

      // ── Scroll-based Wave Phase ──
      const scrollPhase = scrollValue * 25
      const baseY = height / 2 + mouseOffset
      const amplitude = height * 0.3
      const frequency = 0.02

      // ── Ribbon Strands ──
      const numStrands = 9
      const strandSpread = 20
      const mid = (numStrands - 1) / 2

      for (let i = 0; i < numStrands; i++) {
        const idxOffset = i - mid
        const phaseOffset = (i / numStrands) * Math.PI * 2

        // Twist the ribbon for a 3D effect
        const twistOffset = Math.sin(time * 0.3 + i * 0.5 + scrollPhase * 0.5)
        const currentSpread = strandSpread * (0.6 + 0.4 * twistOffset)
        const xOffset = idxOffset * 6 * (1 + 0.4 * twistOffset)

        for (let x = -40; x < width + 40; x += 4) {
          const xPos = x + xOffset

          // Complex wave shape (fundamental + harmonic)
          const waveY =
            amplitude * (
              0.7 * Math.sin(x * frequency + scrollPhase + phaseOffset) +
              0.3 * Math.sin(x * frequency * 2.5 + scrollPhase * 1.3 + phaseOffset * 0.8)
            )

          const yPos = baseY + idxOffset * (currentSpread / numStrands) + waveY

          // ── Dot Attributes ──
          const shimmer = 0.7 + 0.3 * Math.sin(x * 0.05 + i * 0.8 + time * 1.2)
          const radius = (1.8 + 1.2 * Math.sin(x * 0.07 + i * 0.5)) * shimmer

          // Depth fading (strands further from center are dimmer)
          const depthFade = Math.max(0, 1 - Math.abs(idxOffset) / (numStrands / 2) * 0.6)
          
          // Horizontal edge fade
          const edgeFade = Math.min(1, x / 150, (width - x) / 150)
          
          // Vertical fade (towards top/bottom)
          const yFade = Math.max(0, 1 - Math.abs(yPos - height / 2) / (height * 0.55))

          const alpha = depthFade * edgeFade * yFade * 0.85

          if (alpha < 0.01) continue

          // ── Glow Layer ──
          const glowRadius = radius * 4.5
          const gradient = ctx.createRadialGradient(
            xPos, yPos, 0,
            xPos, yPos, glowRadius
          )
          
          // Color gradient: Deep blue to bright cyan
          const r = 40 + 180 * (1 - Math.abs(idxOffset) / numStrands)
          const g = 120 + 130 * (1 - Math.abs(idxOffset) / numStrands)
          const b = 255

          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.9})`)
          gradient.addColorStop(0.3, `rgba(${r * 0.6}, ${g * 0.6}, ${b}, ${alpha * 0.4})`)
          gradient.addColorStop(1, `rgba(${r * 0.1}, ${g * 0.1}, ${b}, 0)`)

          ctx.beginPath()
          ctx.fillStyle = gradient
          ctx.arc(xPos, yPos, glowRadius, 0, Math.PI * 2)
          ctx.fill()

          // ── Bright Core Dot ──
          ctx.beginPath()
          ctx.fillStyle = `rgba(180, 230, 255, ${alpha * 0.9})`
          ctx.arc(xPos, yPos, radius * 0.7, 0, Math.PI * 2)
          ctx.fill()
        }
      }

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
      {/* Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'transparent',
          imageRendering: 'auto',
        }}
      />

      {/* Subtle Vignette Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.6) 100%)',
        }}
      />
    </motion.div>
  )
}