import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../ThemeContext'

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const { dark } = useTheme()

  useEffect(() => { setMounted(true) }, [])

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

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    const handleScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── Flowing contour-line system ──────────────────────────
    // Horizontal flowing lines that ripple like the reference image's
    // mesh-wrap contours, made of dense dot clusters along each line.
    const LINE_COUNT = 46
    const POINTS_PER_LINE = 90

    const lines = Array.from({ length: LINE_COUNT }, (_, li) => {
      const baseY = (li / (LINE_COUNT - 1))
      return {
        baseY,
        seedA: Math.random() * Math.PI * 2,
        seedB: Math.random() * Math.PI * 2,
        freqA: 0.8 + Math.random() * 1.4,
        freqB: 1.5 + Math.random() * 2,
        ampScale: 0.6 + Math.random() * 0.8,
        density: 0.55 + (li % 5 === 0 ? 0.35 : Math.random() * 0.3),
      }
    })

    const lightColor = () => {
      const shades = ['10,10,10', '30,30,30', '55,55,55', '80,80,80']
      return shades[Math.floor(Math.random() * shades.length)]
    }
    const darkColor = () => {
      const shades = ['255,255,255', '230,230,230', '205,205,205', '180,180,180']
      return shades[Math.floor(Math.random() * shades.length)]
    }
    const colorFn = dark ? darkColor : lightColor

    const animate = () => {
      time += 0.0045
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // scroll-driven zoom: zoom in as page scrolls down, back out on scroll up
      const scrollY = scrollRef.current
      const maxScrollForZoom = 1200
      const t = Math.min(scrollY / maxScrollForZoom, 1)
      const zoom = 1 + t * 0.55 // up to 1.55x zoom
      const fade = 1 - t * 0.35 // slightly fade as it zooms

      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      lines.forEach((line, li) => {
        const y0 = line.baseY * height

        ctx.beginPath()
        let prevX = 0, prevY = 0

        for (let p = 0; p <= POINTS_PER_LINE; p++) {
          const xt = p / POINTS_PER_LINE
          const x = xt * width

          // layered sine waves for organic contour flow
          const wave =
            Math.sin(xt * Math.PI * line.freqA + time + line.seedA) * 28 * line.ampScale +
            Math.cos(xt * Math.PI * line.freqB - time * 0.7 + line.seedB) * 14 * line.ampScale

          // mouse ripple distortion
          let mouseEffect = 0
          if (mx > 0) {
            const dx = x - mx, dy = y0 - my
            const d2 = dx * dx + dy * dy
            mouseEffect = Math.exp(-d2 / 30000) * 40
          }

          const y = y0 + wave + mouseEffect

          if (p === 0) {
            ctx.moveTo(x, y)
          } else {
            // smooth curve
            const cx = (prevX + x) / 2
            const cy = (prevY + y) / 2
            ctx.quadraticCurveTo(prevX, prevY, cx, cy)
          }
          prevX = x; prevY = y
        }

        const alpha = (0.04 + (li % 7 === 0 ? 0.05 : 0)) * fade
        ctx.strokeStyle = `rgba(${colorFn()},${alpha})`
        ctx.lineWidth = 0.6
        ctx.stroke()

        // dense particle dots along the line (only every few lines, for performance)
        if (li % 2 === 0) {
          for (let p = 0; p <= POINTS_PER_LINE; p += 2) {
            if (Math.random() > line.density) continue
            const xt = p / POINTS_PER_LINE
            const x = xt * width
            const wave =
              Math.sin(xt * Math.PI * line.freqA + time + line.seedA) * 28 * line.ampScale +
              Math.cos(xt * Math.PI * line.freqB - time * 0.7 + line.seedB) * 14 * line.ampScale
            let mouseEffect = 0
            if (mx > 0) {
              const dx = x - mx, dy = y0 - my
              const d2 = dx * dx + dy * dy
              mouseEffect = Math.exp(-d2 / 30000) * 40
            }
            const y = y0 + wave + mouseEffect
            const r = 0.4 + Math.random() * 0.6
            ctx.beginPath()
            ctx.arc(x, y, r, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(${colorFn()},${0.5 * fade})`
            ctx.fill()
          }
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
      window.removeEventListener('scroll', handleScroll)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: dark ? '#000000' : '#00f0ff' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }} />
    </div>
  )
}
