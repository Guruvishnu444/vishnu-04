import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'

function ParticleCanvas({ mouseX, mouseY }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
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
      initParticles()
    }

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.6
        this.vy = (Math.random() - 0.5) * 0.6
        this.radius = Math.random() * 1.5 + 0.5
        this.alpha = Math.random() * 0.6 + 0.4
      }

      update(mouseX, mouseY) {
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const repelDist = 120

        // Repel from mouse — particles scatter away
        if (dist < repelDist && dist > 0) {
          const force = (repelDist - dist) / repelDist
          const angle = Math.atan2(dy, dx)
          this.vx -= Math.cos(angle) * force * 0.8
          this.vy -= Math.sin(angle) * force * 0.8
        }

        this.vx *= 0.98
        this.vy *= 0.98
        this.x += this.vx
        this.y += this.vy

        if (this.x < -50) this.x = width + 50
        if (this.x > width + 50) this.x = -50
        if (this.y < -50) this.y = height + 50
        if (this.y > height + 50) this.y = -50
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`
        ctx.fill()
      }
    }

    const initParticles = () => {
      const count = Math.min(Math.floor((width * height) / 9000), 180)
      particlesRef.current = Array.from({ length: count }, () => new Particle())
    }

    const drawConnections = (particles, mouseX, mouseY) => {
      const maxDist = 160

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Lines to mouse
        const mdx = p1.x - mouseX
        const mdy = p1.y - mouseY
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
        const mouseLineDist = 180

        if (mdist < mouseLineDist) {
          const alpha = (1 - mdist / mouseLineDist) * 0.6
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      drawConnections(particlesRef.current, mx, my)

      particlesRef.current.forEach(p => {
        p.update(mx, my)
        p.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999
      mouseRef.current.y = -9999
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)

    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  )
}

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Pure black background */}
      <div className="absolute inset-0" style={{ backgroundColor: '#000000' }} />

      {/* Particle network canvas */}
      <ParticleCanvas mouseX={mouseX} mouseY={mouseY} />

      {/* Subtle vignette — darkens corners slightly */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  )
}
