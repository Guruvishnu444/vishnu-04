import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ── Digital Plexus background (mono-blue, no dot glow) ─────────
// A triangulated wireframe mesh of nodes + lines, all in one blue
// hue, with a few brighter "energy strands" flowing through the
// mesh like in the reference image. Dots are crisp, flat, no glow.
// Dark mode only.

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

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    const handleScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── Mesh nodes: scattered, denser toward one side, like a torn web ──
    const area = width * height
    const NODE_COUNT = Math.min(170, Math.max(70, Math.round(area / 9000)))
    const LINK_DIST = Math.min(width, height) * 0.22

    // converge point: where the bright strands funnel toward (top area)
    const convergeX = width * 0.32
    const convergeY = -height * 0.15

    const nodes = Array.from({ length: NODE_COUNT }, () => {
      const x = Math.random() * width
      const y = Math.random() * height
      return {
        x, y,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: 1.0 + Math.random() * 1.3,
        flicker: Math.random() * Math.PI * 2,
        flickerSpeed: 0.3 + Math.random() * 0.5,
      }
    })

    // a handful of flowing energy strands (the bright streaks in the reference)
    const STRAND_COUNT = 7
    const strands = Array.from({ length: STRAND_COUNT }, () => {
      const startX = width * (0.18 + Math.random() * 0.22)
      return {
        baseX: startX,
        amp: 18 + Math.random() * 30,
        freq: 1.2 + Math.random() * 1.6,
        seed: Math.random() * Math.PI * 2,
        speed: 0.15 + Math.random() * 0.2,
        width: 1.1 + Math.random() * 1.4,
        bend: (Math.random() - 0.5) * 0.6,
      }
    })

    const wrap = (n) => {
      if (n.x < -30) n.x = width + 30
      if (n.x > width + 30) n.x = -30
      if (n.y < -30) n.y = height + 30
      if (n.y > height + 30) n.y = -30
    }

    const animate = () => {
      time += 0.012
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      const scrollY = scrollRef.current
      const t = Math.min(scrollY / 1400, 1)
      const zoom = 1 + t * 0.16
      const fade = 1 - t * 0.18

      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      // drift nodes gently, slight mouse attraction like a web being touched
      nodes.forEach((n) => {
        n.x += n.vx
        n.y += n.vy
        if (mx > 0) {
          const dx = mx - n.x, dy = my - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < 50000) {
            const d = Math.sqrt(d2) || 1
            n.x += (dx / d) * 0.15
            n.y += (dy / d) * 0.15
          }
        }
        wrap(n)
      })

      // ── triangulated mesh lines ──
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            const proximity = 1 - dist / LINK_DIST
            let alpha = proximity * proximity * 0.5 * fade

            if (mx > 0) {
              const mdx = (a.x + b.x) / 2 - mx
              const mdy = (a.y + b.y) / 2 - my
              const md2 = mdx * mdx + mdy * mdy
              alpha = Math.min(1, alpha + Math.exp(-md2 / 20000) * 0.45)
            }

            ctx.beginPath()
            ctx.strokeStyle = `rgba(${BASE.r},${BASE.g},${BASE.b},${alpha})`
            ctx.lineWidth = 0.6
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      // ── flat, crisp nodes — no glow, just a small soft-edge dot ──
      nodes.forEach((n) => {
        const flick = 0.6 + 0.4 * Math.sin(time * n.flickerSpeed + n.flicker)
        let boost = 1
        if (mx > 0) {
          const dx = mx - n.x, dy = my - n.y
          const d2 = dx * dx + dy * dy
          boost = 1 + Math.exp(-d2 / 14000) * 1.4
        }
        const alpha = Math.min(1, 0.55 * flick * fade * boost)
        ctx.beginPath()
        ctx.fillStyle = `rgba(${BRIGHT.r},${BRIGHT.g},${BRIGHT.b},${alpha})`
        ctx.arc(n.x, n.y, n.r * (boost > 1 ? 1.3 : 1), 0, Math.PI * 2)
        ctx.fill()
      })

      // ── bright flowing energy strands (the streaking highlight lines) ──
      strands.forEach((s) => {
        ctx.beginPath()
        let prevX, prevY
        const steps = 60
        for (let k = 0; k <= steps; k++) {
          const ft = k / steps
          const y = height * (-0.1 + ft * 1.15)
          const sway =
            Math.sin(ft * Math.PI * s.freq + time * s.speed + s.seed) * s.amp * (0.3 + ft * 0.7)
          const bendShift = s.bend * (y - convergeY) * 0.4
          const x = s.baseX + sway + bendShift + (convergeX - s.baseX) * Math.max(0, 1 - ft * 1.4)
          if (k === 0) {
            ctx.moveTo(x, y)
          } else {
            const cx = (prevX + x) / 2
            const cy = (prevY + y) / 2
            ctx.quadraticCurveTo(prevX, prevY, cx, cy)
          }
          prevX = x; prevY = y
        }
        const grad = ctx.createLinearGradient(s.baseX, 0, s.baseX, height)
        grad.addColorStop(0, `rgba(${BRIGHT.r},${BRIGHT.g},${BRIGHT.b},${0.85 * fade})`)
        grad.addColorStop(0.6, `rgba(${BASE.r},${BASE.g},${BASE.b},${0.4 * fade})`)
        grad.addColorStop(1, `rgba(${BASE.r},${BASE.g},${BASE.b},0)`)
        ctx.strokeStyle = grad
        ctx.lineWidth = s.width
        ctx.stroke()
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
      <div className="absolute inset-0" style={{ background: '#000000' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: 'transparent' }} />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)' }}
      />
    </motion.div>
  )
}
