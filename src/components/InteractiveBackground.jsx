import { useEffect, useRef, useState } from 'react'

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const scrollVelocityRef = useRef(0)
  const lastScrollRef = useRef(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let width = window.innerWidth
    let height = window.innerHeight
    let time = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    const handleMouseLeave = () => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }
    const handleScroll = () => {
      const sy = window.scrollY
      scrollVelocityRef.current = Math.abs(sy - lastScrollRef.current)
      lastScrollRef.current = sy
      scrollRef.current = sy
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll)

    const animate = () => {
      time += 0.018
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const scrollVel = Math.min(scrollVelocityRef.current, 60)
      // Decay scroll velocity
      scrollVelocityRef.current *= 0.92

      const isScrolling = scrollVel > 1
      const cx = width / 2
      const cy = height / 2

      if (!isScrolling) {
        // ── CIRCLE MODE ──────────────────────────────────────
        const numRings = 5
        const baseRadius = Math.min(width, height) * 0.18

        for (let r = 0; r < numRings; r++) {
          const ringRadius = baseRadius + r * 38
          const points = 120
          const mouseDist = mx > 0
            ? Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
            : 0
          const mouseInfluence = Math.max(0, 1 - mouseDist / (width * 0.5))
          const waveAmp = 6 + r * 3 + mouseInfluence * 20

          ctx.beginPath()
          for (let i = 0; i <= points; i++) {
            const angle = (i / points) * Math.PI * 2
            // Mouse distortion — pulls ring toward cursor
            const mx2 = mx > 0 ? mx - cx : 0
            const my2 = mx > 0 ? my - cy : 0
            const push = mouseInfluence * 18 * (r % 2 === 0 ? 1 : -1)
            const distortX = Math.cos(angle) * push * 0.3
            const distortY = Math.sin(angle) * push * 0.3

            const wave = Math.sin(angle * (3 + r) + time * (1 + r * 0.3)) * waveAmp
              + Math.cos(angle * (2 + r) - time * 0.7) * (waveAmp * 0.5)

            const rad = ringRadius + wave
            const x = cx + Math.cos(angle) * rad + distortX + mx2 * 0.03 * (r * 0.2)
            const y = cy + Math.sin(angle) * rad + distortY + my2 * 0.03 * (r * 0.2)

            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          ctx.closePath()

          const alpha = 0.55 - r * 0.08
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`
          ctx.lineWidth = 1.2 - r * 0.15
          ctx.stroke()
        }

        // Center dot
        const dotPulse = Math.sin(time * 2) * 2
        ctx.beginPath()
        ctx.arc(cx, cy, 4 + dotPulse, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fill()

      } else {
        // ── MUSIC WAVE MODE ───────────────────────────────────
        const waveLines = 18
        const intensity = Math.min(scrollVel / 20, 1)

        for (let w = 0; w < waveLines; w++) {
          const yBase = (w / (waveLines - 1)) * height
          const freq = 2 + w * 0.4
          const amp = (30 + w * 8) * intensity + 8
          const speed = 1.2 + w * 0.15
          const phase = w * 0.4

          // Mouse interaction — waves bend near cursor
          ctx.beginPath()
          for (let x = 0; x <= width; x += 3) {
            const mouseEffect = mx > 0
              ? Math.exp(-((x - mx) ** 2) / (2 * 15000)) * (my - yBase) * 0.3 * intensity
              : 0

            const y = yBase
              + Math.sin((x / width) * Math.PI * freq + time * speed + phase) * amp
              + Math.cos((x / width) * Math.PI * (freq * 0.6) - time * 0.8 + phase) * (amp * 0.4)
              + mouseEffect

            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }

          const alpha = 0.12 + (w % 3 === 0 ? 0.25 : 0.08) * intensity
          ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`
          ctx.lineWidth = w % 4 === 0 ? 1.5 : 0.8
          ctx.stroke()
        }

        // Bold center wave
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          const mouseEffect = mx > 0
            ? Math.exp(-((x - mx) ** 2) / (2 * 20000)) * (my - height / 2) * 0.5 * intensity
            : 0
          const y = height / 2
            + Math.sin((x / width) * Math.PI * 3 + time * 2) * (50 * intensity + 10)
            + Math.cos((x / width) * Math.PI * 1.5 - time) * (25 * intensity)
            + mouseEffect
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(0, 0, 0, 0.55)`
        ctx.lineWidth = 2
        ctx.stroke()
      }

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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0" style={{ backgroundColor: '#B8BABE' }} />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  )
}
