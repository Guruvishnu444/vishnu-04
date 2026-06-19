import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── Digital Plexus background ──────────────────────────────────
// A glowing blue/violet/magenta particle network, always dark.
// Nodes drift slowly, link to nearby neighbours with faint lines,
// and brighten when the mouse comes near — same language as the
// reference "digital plexus" artwork.

const PALETTE = [
  { r: 56, g: 189, b: 248 },   // cyan-blue
  { r: 96, g: 130, b: 255 },   // electric blue
  { r: 147, g: 90, b: 255 },   // violet
  { r: 200, g: 70, b: 230 },   // magenta-violet
  { r: 230, g: 60, b: 190 },   // pink-magenta
]

function lerpColor(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  }
}

function pickColor(t) {
  // t in [0,1) walks across the palette for smooth blue -> violet -> magenta spread
  const seg = t * (PALETTE.length - 1)
  const i = Math.floor(seg)
  const f = seg - i
  const a = PALETTE[i]
  const b = PALETTE[Math.min(i + 1, PALETTE.length - 1)]
  return lerpColor(a, b, f)
}

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

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    const handleScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── Build particle field ──────────────────────────────────
    const area = width * height
    const NODE_COUNT = Math.min(150, Math.max(60, Math.round(area / 14000)))
    const DUST_COUNT = Math.min(220, Math.max(90, Math.round(area / 9000)))
    const LINK_DIST = Math.min(width, height) * 0.16

    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const colorT = Math.random()
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.1 + Math.random() * 2.0,
        colorT,
        color: pickColor(colorT),
        pulseSeed: Math.random() * Math.PI * 2,
        pulseSpeed: 0.4 + Math.random() * 0.6,
      }
    })

    // soft background bokeh dust (the small unconnected glow dots in the reference)
    const dust = Array.from({ length: DUST_COUNT }, () => {
      const colorT = Math.random()
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: 0.6 + Math.random() * 1.8,
        baseAlpha: 0.15 + Math.random() * 0.35,
        color: pickColor(colorT),
        twinkleSeed: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + Math.random() * 0.8,
      }
    })

    const wrap = (p) => {
      if (p.x < -20) p.x = width + 20
      if (p.x > width + 20) p.x = -20
      if (p.y < -20) p.y = height + 20
      if (p.y > height + 20) p.y = -20
    }

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // scroll-driven gentle zoom, same feel as before but subtler
      const scrollY = scrollRef.current
      const t = Math.min(scrollY / 1400, 1)
      const zoom = 1 + t * 0.18
      const fade = 1 - t * 0.2

      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      // background dust bokeh
      dust.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        wrap(p)
        const twinkle = 0.6 + 0.4 * Math.sin(time * p.twinkleSpeed + p.twinkleSeed)
        const alpha = p.baseAlpha * twinkle * fade
        const { r, g, b } = p.color
        const glowR = p.r * 4
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${alpha})`)
        grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fill()
      })

      // update node positions, with gentle mouse attraction
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (mx > 0) {
          const dx = mx - n.x, dy = my - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < 60000) {
            const d = Math.sqrt(d2) || 1
            n.x += (dx / d) * 0.18
            n.y += (dy / d) * 0.18
          }
        }
        wrap(n)
      })

      // draw links between near nodes
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const proximity = 1 - dist / LINK_DIST
            let lineAlpha = proximity * proximity * 0.55 * fade

            // brighten links near the cursor
            if (mx > 0) {
              const mdx = (a.x + b.x) / 2 - mx
              const mdy = (a.y + b.y) / 2 - my
              const md2 = mdx * mdx + mdy * mdy
              const boost = Math.exp(-md2 / 24000)
              lineAlpha = Math.min(1, lineAlpha + boost * 0.5)
            }

            const mix = lerpColor(a.color, b.color, 0.5)
            ctx.beginPath()
            ctx.strokeStyle = `rgba(${mix.r|0},${mix.g|0},${mix.b|0},${lineAlpha})`
            ctx.lineWidth = 0.7
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // draw glowing nodes
      nodes.forEach((n) => {
        const pulse = 0.75 + 0.25 * Math.sin(time * n.pulseSpeed + n.pulseSeed)
        let glowBoost = 1
        if (mx > 0) {
          const dx = mx - n.x, dy = my - n.y
          const d2 = dx * dx + dy * dy
          glowBoost = 1 + Math.exp(-d2 / 16000) * 2.2
        }
        const { r, g, b } = n.color
        const glowR = n.r * 7 * glowBoost
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        grad.addColorStop(0, `rgba(${r|0},${g|0},${b|0},${0.65 * pulse * fade})`)
        grad.addColorStop(0.4, `rgba(${r|0},${g|0},${b|0},${0.22 * pulse * fade})`)
        grad.addColorStop(1, `rgba(${r|0},${g|0},${b|0},0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        // bright core
        ctx.beginPath()
        ctx.fillStyle = `rgba(${Math.min(255, r + 80)|0},${Math.min(255, g + 80)|0},${Math.min(255, b + 80)|0},${0.9 * pulse * fade})`
        ctx.arc(n.x, n.y, n.r * 0.9, 0, Math.PI * 2)
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
      transition={{ duration: 1.2, ease: 'easeOut' }}
    >
      {/* deep space base + radial glow, always dark regardless of site theme */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 70% 20%, rgba(120,60,200,0.22), transparent 55%),' +
            'radial-gradient(circle at 15% 80%, rgba(40,110,255,0.18), transparent 55%),' +
            '#05030a',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: 'transparent' }} />
      {/* subtle vignette so edges stay rich/dark like the reference */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </motion.div>
  )
}
