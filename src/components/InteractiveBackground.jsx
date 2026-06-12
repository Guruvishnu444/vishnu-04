import { useEffect, useRef, useState } from 'react'
import { useTheme } from './ThemeContext'

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const scrollVelocityRef = useRef(0)
  const lastScrollRef = useRef(0)
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
    const handleScroll = () => {
      const sy = window.scrollY
      scrollVelocityRef.current = Math.abs(sy - lastScrollRef.current)
      lastScrollRef.current = sy
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll)

    // Particle network
    const particles = []
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 160)
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 1.5 + 0.5,
      })
    }

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const scrollVel = Math.min(scrollVelocityRef.current, 60)
      scrollVelocityRef.current *= 0.9
      const isScrolling = scrollVel > 1

      // particle color based on theme
      const pColor = dark ? '255,255,255' : '0,0,0'
      const lineColor = dark ? '255,255,255' : '43,43,43'

      if (isScrolling) {
        // Music wave mode
        const intensity = Math.min(scrollVel / 20, 1)
        const waveLines = 18
        for (let w = 0; w < waveLines; w++) {
          const yBase = (w / (waveLines - 1)) * height
          const freq = 2 + w * 0.4
          const amp = (30 + w * 8) * intensity + 8
          const speed = 1.2 + w * 0.15
          const phase = w * 0.4

          ctx.beginPath()
          for (let x = 0; x <= width; x += 3) {
            const mouseEffect = mx > 0
              ? Math.exp(-((x - mx) ** 2) / (2 * 15000)) * (my - yBase) * 0.3 * intensity : 0
            const y = yBase
              + Math.sin((x / width) * Math.PI * freq + time * speed + phase) * amp
              + Math.cos((x / width) * Math.PI * (freq * 0.6) - time * 0.8 + phase) * (amp * 0.4)
              + mouseEffect
            x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
          }
          const alpha = 0.1 + (w % 3 === 0 ? 0.2 : 0.06) * intensity
          ctx.strokeStyle = `rgba(${lineColor},${alpha})`
          ctx.lineWidth = w % 4 === 0 ? 1.5 : 0.7
          ctx.stroke()
        }

        // Bold center wave
        ctx.beginPath()
        for (let x = 0; x <= width; x += 2) {
          const mouseEffect = mx > 0
            ? Math.exp(-((x - mx) ** 2) / (2 * 20000)) * (my - height / 2) * 0.5 * intensity : 0
          const y = height / 2
            + Math.sin((x / width) * Math.PI * 3 + time * 2) * (50 * intensity + 10)
            + Math.cos((x / width) * Math.PI * 1.5 - time) * (25 * intensity)
            + mouseEffect
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        }
        ctx.strokeStyle = `rgba(${lineColor},0.45)`
        ctx.lineWidth = 2
        ctx.stroke()

      } else {
        // Particle network mode
        particles.forEach(p => {
          // mouse repel
          const dx = mx - p.x, dy = my - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120
            const angle = Math.atan2(dy, dx)
            p.vx -= Math.cos(angle) * force * 0.6
            p.vy -= Math.sin(angle) * force * 0.6
          }
          p.vx *= 0.98; p.vy *= 0.98
          p.x += p.vx; p.y += p.vy
          if (p.x < -50) p.x = width + 50
          if (p.x > width + 50) p.x = -50
          if (p.y < -50) p.y = height + 50
          if (p.y > height + 50) p.y = -50

          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${pColor},0.7)`
          ctx.fill()
        })

        // connections
        const maxDist = 140
        for (let i = 0; i < particles.length; i++) {
          const p1 = particles[i]
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j]
            const dx = p1.x - p2.x, dy = p1.y - p2.y
            const d = Math.sqrt(dx * dx + dy * dy)
            if (d < maxDist) {
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.strokeStyle = `rgba(${lineColor},${(1 - d / maxDist) * 0.3})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
          // mouse connections
          const mdx = p1.x - mx, mdy = p1.y - my
          const md = Math.sqrt(mdx * mdx + mdy * mdy)
          if (md < 180) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(mx, my)
            ctx.strokeStyle = `rgba(${lineColor},${(1 - md / 180) * 0.5})`
            ctx.lineWidth = 0.7
            ctx.stroke()
          }
        }
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
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: dark ? '#1a1a1a' : '#fffaf0' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }} />
    </div>
  )
}
