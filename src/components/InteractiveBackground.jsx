import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../ThemeContext'

export default function InteractiveBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
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
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    // particles
    const count = Math.min(Math.floor((width * height) / 9000), 160)
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.5,
    }))

    // dark mode: white/gray particles, light mode: black/gray particles
    const getDarkColor = () => {
      const colors = ['255,255,255', '235,235,235', '210,210,210', '180,180,180']
      return colors[Math.floor(Math.random() * colors.length)]
    }
    const getLightColor = () => {
      const colors = ['0,0,0', '25,25,25', '50,50,50', '75,75,75']
      return colors[Math.floor(Math.random() * colors.length)]
    }
    particles.forEach(p => {
      p.color = dark ? getDarkColor() : getLightColor()
    })

    const animate = () => {
      ctx.clearRect(0, 0, width, height)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      particles.forEach(p => {
        const dx = mx - p.x, dy = my - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 130 && dist > 0) {
          const force = (130 - dist) / 130
          const angle = Math.atan2(dy, dx)
          p.vx -= Math.cos(angle) * force * 0.7
          p.vy -= Math.sin(angle) * force * 0.7
        }
        p.vx *= 0.98; p.vy *= 0.98
        p.x += p.vx; p.y += p.vy
        if (p.x < -50) p.x = width + 50
        if (p.x > width + 50) p.x = -50
        if (p.y < -50) p.y = height + 50
        if (p.y > height + 50) p.y = -50

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},0.8)`
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
            ctx.strokeStyle = `rgba(${p1.color},${(1 - d / maxDist) * 0.3})`
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
          ctx.strokeStyle = `rgba(${p1.color},${(1 - md / 180) * 0.55})`
          ctx.lineWidth = 0.7
          ctx.stroke()
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
  }, [mounted, dark])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 transition-colors duration-500"
        style={{ backgroundColor: dark ? '#000000' : '#ffffff' }} />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }} />
    </div>
  )
}
