import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

// ── Polygon-mesh plexus background ──────────────────────────
// Translucent low-poly triangles + node/line mesh that responds
// to cursor and zooms in/out on scroll, themed with premium accent colors.

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollRef = useRef(0)
  const [mounted, setMounted] = useState(false)
  const { dark } = useTheme()
  const c = getColors(dark)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initNodes()
    }

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    const handleScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    let nodes = []
    let triangles = []

    const initNodes = () => {
      const area = width * height
      const count = Math.min(140, Math.max(60, Math.round(area / 11000)))
      nodes = Array.from({ length: count }, () => {
        const x = Math.random() * width
        const y = Math.random() * height
        return {
          x, y, baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          r: 0.8 + Math.random() * 1.6,
          flicker: Math.random() * Math.PI * 2,
        }
      })

      triangles = []
      for (let i = 0; i < Math.round(count * 0.18); i++) {
        const a = nodes[Math.floor(Math.random() * nodes.length)]
        const b = nodes[Math.floor(Math.random() * nodes.length)]
        const cnode = nodes[Math.floor(Math.random() * nodes.length)]
        if (a !== b && b !== cnode && a !== cnode) {
          const d1 = Math.hypot(a.x - b.x, a.y - b.y)
          const d2 = Math.hypot(b.x - cnode.x, b.y - cnode.y)
          const d3 = Math.hypot(a.x - cnode.x, a.y - cnode.y)
          if (d1 < 260 && d2 < 260 && d3 < 260) {
            triangles.push({ a, b, c: cnode, alpha: 0.02 + Math.random() * 0.05 })
          }
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)

    let time = 0
    const LINK_DIST = 130

    // base mesh color (subtle, theme text color) and accent color (interactive highlight)
    const hexToRgb = (hex) => {
      const h = hex.replace('#', '')
      return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`
    }
    const baseRGB = hexToRgb(c.textSecondary.startsWith('#') ? c.textSecondary : (dark ? '#8B949E' : '#57606A'))
    const accentRGB = hexToRgb(c.accent)

    const animate = () => {
      time += 0.012
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      const scrollY = scrollRef.current
      const t = Math.min(scrollY / 1200, 1)
      const zoom = 1 + t * 0.4
      const fade = 1 - t * 0.25

      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy

        if (mx > 0) {
          const dx = n.x - mx, dy = n.y - my
          const d2 = dx * dx + dy * dy
          const radius = 160
          if (d2 < radius * radius && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (1 - d / radius) * 0.6
            n.x += (dx / d) * force
            n.y += (dy / d) * force
          }
        }

        n.x += (n.baseX - n.x) * 0.002
        n.y += (n.baseY - n.y) * 0.002

        const margin = 40
        if (n.x < -margin) n.baseX = n.x = width + margin
        if (n.x > width + margin) n.baseX = n.x = -margin
        if (n.y < -margin) n.baseY = n.y = height + margin
        if (n.y > height + margin) n.baseY = n.y = -margin
      })

      triangles.forEach(tri => {
        ctx.beginPath()
        ctx.moveTo(tri.a.x, tri.a.y)
        ctx.lineTo(tri.b.x, tri.b.y)
        ctx.lineTo(tri.c.x, tri.c.y)
        ctx.closePath()
        ctx.fillStyle = `rgba(${baseRGB},${tri.alpha * fade})`
        ctx.fill()
      })

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.2 * fade
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${baseRGB},${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        if (mx > 0) {
          const dx = nodes[i].x - mx, dy = nodes[i].y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(mx, my)
            ctx.strokeStyle = `rgba(${accentRGB},${(1 - dist / 180) * 0.4 * fade})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      nodes.forEach(n => {
        const flick = 0.6 + 0.4 * Math.sin(time * 1.4 + n.flicker)
        let cursorBoost = 0
        if (mx > 0) {
          const dx = mx - n.x, dy = my - n.y
          const d2 = dx * dx + dy * dy
          cursorBoost = Math.exp(-d2 / 12000)
        }

        const radius = n.r * (1 + cursorBoost * 0.8)
        const alpha = (0.45 * flick + cursorBoost * 0.5) * fade

        const glowR = radius * (2.5 + cursorBoost * 2)
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        const col = cursorBoost > 0.1 ? accentRGB : baseRGB
        grad.addColorStop(0, `rgba(${col},${alpha * 0.8})`)
        grad.addColorStop(1, `rgba(${col},0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.fillStyle = `rgba(${col},${Math.min(1, alpha + 0.25)})`
        ctx.arc(n.x, n.y, radius * 0.6, 0, Math.PI * 2)
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
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: c.bg }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(31,35,40,0.05) 100%)',
        }}
      />
    </div>
  )
}
