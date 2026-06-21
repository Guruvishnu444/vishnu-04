import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'
import { useScrollNarrative } from '../ScrollNarrative'

const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`
}

// ── Each chapter has a distinct particle "behavior" target ──
// hero:     scattered, drifting freely, calm
// about:    pulled into a loose central cluster (focus tightens)
// journey:  arranged along a horizontal path (timeline read)
// projects: pulled to the edges / dimmed (content takes center stage)
// contact:  converge toward center (arriving, closing the loop)

export default function NarrativeBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const [mounted, setMounted] = useState(false)
  const { dark } = useTheme()
  const c = getColors(dark)
  const narrative = useScrollNarrative()
  const narrativeRef = useRef(narrative)
  narrativeRef.current = narrative

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight
    let nodes = []
    let time = 0

    const initNodes = () => {
      const area = width * height
      const count = Math.min(120, Math.max(60, Math.round(area / 13000)))
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        r: 0.8 + Math.random() * 1.4,
        flicker: Math.random() * Math.PI * 2,
        seed: Math.random(),
        // each node gets a stable "journey index" so the timeline
        // arrangement is consistent frame to frame
        journeyIndex: i,
      }))
    }

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
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const handleMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 } }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    const baseRGB = hexToRgb(dark ? '#8B949E' : '#57606A')
    const accentRGB = hexToRgb(c.accent)

    // Target position for a node given the current chapter
    const getTarget = (n, chapterName, chapterProgress, count) => {
      const cx = width / 2
      const cy = height / 2

      switch (chapterName) {
        case 'hero':
          // free scatter — no pull, just base drift around spawn point
          return null

        case 'about': {
          // pull into a loose cluster, radius shrinks as progress increases
          const angle = n.seed * Math.PI * 2
          const radius = Math.min(width, height) * (0.32 - chapterProgress * 0.08)
          return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, strength: 0.02 }
        }

        case 'journey': {
          // arrange along a horizontal line (timeline), staggered by journeyIndex
          const t = (n.journeyIndex % 24) / 24
          const lineY = cy + Math.sin(t * Math.PI * 2 + time * 0.3) * 30
          return { x: width * 0.1 + t * width * 0.8, y: lineY, strength: 0.025 }
        }

        case 'projects': {
          // pull to edges, dim center for content focus
          const side = n.seed > 0.5 ? 1 : -1
          const edgeX = side > 0 ? width * (0.85 + n.seed * 0.1) : width * (0.05 - n.seed * 0.1)
          return { x: edgeX, y: n.y, strength: 0.015 }
        }

        case 'contact': {
          // converge toward center — arriving
          const angle = n.seed * Math.PI * 2
          const radius = Math.min(width, height) * 0.15 * (1 - chapterProgress * 0.6)
          return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, strength: 0.03 }
        }

        default:
          return null
      }
    }

    const animate = () => {
      time += 0.012
      ctx.clearRect(0, 0, width, height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const { chapterName, chapterProgress } = narrativeRef.current || { chapterName: 'hero', chapterProgress: 0 }

      nodes.forEach(n => {
        // free drift always present (keeps things alive, never fully static)
        n.x += n.vx
        n.y += n.vy

        // pull toward chapter target, if any
        const target = getTarget(n, chapterName, chapterProgress, nodes.length)
        if (target) {
          n.x += (target.x - n.x) * target.strength
          n.y += (target.y - n.y) * target.strength
        }

        // cursor repulsion — always active, gives life/interactivity
        if (mx > 0) {
          const dx = n.x - mx, dy = n.y - my
          const d2 = dx * dx + dy * dy
          const radius = 140
          if (d2 < radius * radius && d2 > 1) {
            const d = Math.sqrt(d2)
            const force = (1 - d / radius) * 0.5
            n.x += (dx / d) * force
            n.y += (dy / d) * force
          }
        }

        const m = 60
        if (n.x < -m) n.x = width + m
        if (n.x > width + m) n.x = -m
        if (n.y < -m) n.y = height + m
        if (n.y > height + m) n.y = -m
      })

      // connections — distance depends on chapter (tighter when clustered/timeline)
      const linkDist = chapterName === 'journey' ? 90 : chapterName === 'projects' ? 100 : 125
      const lineAlphaMul = chapterName === 'projects' ? 0.5 : 1

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < linkDist) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(${baseRGB},${(1 - dist / linkDist) * 0.16 * lineAlphaMul})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
        if (mx > 0) {
          const dist = Math.hypot(nodes[i].x - mx, nodes[i].y - my)
          if (dist < 160) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(mx, my)
            ctx.strokeStyle = `rgba(${accentRGB},${(1 - dist / 160) * 0.35})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
      }

      // nodes
      nodes.forEach(n => {
        const flick = 0.6 + 0.4 * Math.sin(time * 1.3 + n.flicker)
        let boost = 0
        if (mx > 0) {
          const d2 = (mx - n.x) ** 2 + (my - n.y) ** 2
          boost = Math.exp(-d2 / 11000)
        }
        const dimMul = chapterName === 'projects' ? 0.5 : 1
        const radius = n.r * (1 + boost * 0.7)
        const alpha = (0.4 * flick + boost * 0.45) * dimMul
        const glowR = radius * (2 + boost * 1.8)
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR)
        const col = boost > 0.1 ? accentRGB : baseRGB
        grad.addColorStop(0, `rgba(${col},${alpha * 0.7})`)
        grad.addColorStop(1, `rgba(${col},0)`)
        ctx.beginPath()
        ctx.fillStyle = grad
        ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.fillStyle = `rgba(${col},${Math.min(1, alpha + 0.2)})`
        ctx.arc(n.x, n.y, radius * 0.55, 0, Math.PI * 2)
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: c.bg }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: 'transparent' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: dark
            ? 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(31,35,40,0.04) 100%)',
        }} />
    </div>
  )
}
