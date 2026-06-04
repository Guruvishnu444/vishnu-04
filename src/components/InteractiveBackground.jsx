import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

// Canvas Particle Network - High performance particle system
function ParticleCanvas({ mouseX, mouseY }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    // Resize handler
    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }

    // Particle class
    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.vx = (Math.random() - 0.5) * 0.8
        this.vy = (Math.random() - 0.5) * 0.8
        this.radius = Math.random() * 2 + 1
        this.baseRadius = this.radius
        this.color = this.getColor()
        this.alpha = Math.random() * 0.5 + 0.3
        this.pulseSpeed = Math.random() * 0.02 + 0.01
        this.pulseOffset = Math.random() * Math.PI * 2
      }

      getColor() {
        const colors = [
          { r: 56, g: 189, b: 248 },  // Sky blue
          { r: 192, g: 132, b: 252 }, // Lavender
          { r: 129, g: 140, b: 248 }, // Indigo
          { r: 96, g: 165, b: 250 },  // Blue
          { r: 167, g: 139, b: 250 }, // Violet
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update(mouseX, mouseY, time) {
        // Mouse interaction - attraction/repulsion
        const dx = mouseX - this.x
        const dy = mouseY - this.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 200

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist
          const angle = Math.atan2(dy, dx)
          // Slight attraction towards cursor
          this.vx += Math.cos(angle) * force * 0.02
          this.vy += Math.sin(angle) * force * 0.02
          // Increase size near cursor
          this.radius = this.baseRadius + force * 2
        } else {
          this.radius += (this.baseRadius - this.radius) * 0.1
        }

        // Pulse effect
        this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.5

        // Apply velocity with damping
        this.vx *= 0.99
        this.vy *= 0.99
        this.x += this.vx
        this.y += this.vy

        // Boundary wrapping
        if (this.x < -50) this.x = width + 50
        if (this.x > width + 50) this.x = -50
        if (this.y < -50) this.y = height + 50
        if (this.y > height + 50) this.y = -50
      }

      draw(ctx) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha})`
        ctx.fill()

        // Glow effect
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 2, 0, Math.PI * 2)
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 2
        )
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.3})`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(Math.floor((width * height) / 15000), 120)
      particlesRef.current = Array.from({ length: particleCount }, () => new Particle())
    }

    // Draw connections between nearby particles
    const drawConnections = (particles, mouseX, mouseY) => {
      const connectionDistance = 150
      const mouseConnectionDistance = 200

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]

        // Connections to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.3
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            gradient.addColorStop(0, `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`)
            gradient.addColorStop(1, `rgba(${p2.color.r}, ${p2.color.g}, ${p2.color.b}, ${alpha})`)
            
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }

        // Connections to mouse
        const mouseDx = p1.x - mouseX
        const mouseDy = p1.y - mouseY
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy)

        if (mouseDist < mouseConnectionDistance) {
          const alpha = (1 - mouseDist / mouseConnectionDistance) * 0.5
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouseX, mouseY)
          ctx.strokeStyle = `rgba(${p1.color.r}, ${p1.color.g}, ${p1.color.b}, ${alpha})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
    }

    // Animation loop
    let time = 0
    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, width, height)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Draw connections first (behind particles)
      drawConnections(particlesRef.current, mx, my)

      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(mx, my, time)
        particle.draw(ctx)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Track mouse position
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    
    resize()
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
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

// Floating Node - Larger interactive nodes with Framer Motion
function FloatingNode({ index, mouseX, mouseY }) {
  const baseX = (index * 17.3) % 90 + 5
  const baseY = (index * 23.7 + 10) % 80 + 10
  const size = 8 + (index % 4) * 4
  const depth = 0.3 + (index % 5) * 0.15

  const colors = [
    'rgba(56, 189, 248, 0.8)',   // Sky
    'rgba(192, 132, 252, 0.8)', // Lavender
    'rgba(129, 140, 248, 0.8)', // Indigo
    'rgba(96, 165, 250, 0.8)',  // Blue
  ]
  const color = colors[index % colors.length]

  const offsetX = useTransform(mouseX, [0, 1], [-50 * depth, 50 * depth])
  const offsetY = useTransform(mouseY, [0, 1], [-50 * depth, 50 * depth])

  const springX = useSpring(offsetX, { damping: 20 + index * 2, stiffness: 80, mass: 1 + index * 0.1 })
  const springY = useSpring(offsetY, { damping: 20 + index * 2, stiffness: 80, mass: 1 + index * 0.1 })

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        left: `${baseX}%`,
        top: `${baseY}%`,
        width: size,
        height: size,
        x: springX,
        y: springY,
        background: `radial-gradient(circle at 30% 30%, white, ${color})`,
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color.replace('0.8', '0.3')}`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 3 + (index % 4) * 0.5,
        repeat: Infinity,
        delay: index * 0.2,
        ease: "easeInOut",
      }}
    />
  )
}

// Network Pulse Ring - Expanding rings from cursor position
function NetworkPulse({ mouseX, mouseY }) {
  const x = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const y = useTransform(mouseY, [0, 1], ['0%', '100%'])

  const springX = useSpring(x, { damping: 30, stiffness: 150 })
  const springY = useSpring(y, { damping: 30, stiffness: 150 })

  return (
    <>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border pointer-events-none"
          style={{
            left: springX,
            top: springY,
            width: 100,
            height: 100,
            marginLeft: -50,
            marginTop: -50,
            borderColor: 'rgba(56, 189, 248, 0.3)',
          }}
          animate={{
            scale: [0.5, 3],
            opacity: [0.5, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  )
}

// Hexagon Grid Pattern - Subtle geometric background
function HexagonGrid({ mouseX, mouseY }) {
  const offsetX = useTransform(mouseX, [0, 1], [-20, 20])
  const offsetY = useTransform(mouseY, [0, 1], [-20, 20])

  const springX = useSpring(offsetX, { damping: 50, stiffness: 50 })
  const springY = useSpring(offsetY, { damping: 50, stiffness: 50 })

  return (
    <motion.div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        x: springX,
        y: springY,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%2338bdf8' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
    />
  )
}

// Data Stream Lines - Animated flowing lines
function DataStream({ index, mouseX, mouseY }) {
  const isHorizontal = index % 2 === 0
  const position = 15 + (index * 12) % 70

  const offsetX = useTransform(mouseX, [0, 1], [-15, 15])
  const offsetY = useTransform(mouseY, [0, 1], [-15, 15])

  const springX = useSpring(offsetX, { damping: 40, stiffness: 60 })
  const springY = useSpring(offsetY, { damping: 40, stiffness: 60 })

  return (
    <motion.div
      className="absolute"
      style={{
        ...(isHorizontal
          ? { left: 0, right: 0, top: `${position}%`, height: 1, x: springX }
          : { top: 0, bottom: 0, left: `${position}%`, width: 1, y: springY }
        ),
        background: isHorizontal
          ? 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.2), transparent)'
          : 'linear-gradient(180deg, transparent, rgba(192, 132, 252, 0.2), transparent)',
      }}
      animate={{
        opacity: [0.1, 0.4, 0.1],
        ...(isHorizontal
          ? { backgroundPosition: ['0% 0%', '200% 0%'] }
          : { backgroundPosition: ['0% 0%', '0% 200%'] }
        ),
      }}
      transition={{
        duration: 4 + index,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  )
}

// Central Hub - Glowing center point
function CentralHub({ mouseX, mouseY }) {
  const scale = useTransform(mouseY, [0, 0.5, 1], [0.8, 1.2, 0.8])
  const springScale = useSpring(scale, { damping: 20, stiffness: 100 })

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: 150,
        height: 150,
        scale: springScale,
        background: `
          radial-gradient(circle,
            rgba(56, 189, 248, 0.15) 0%,
            rgba(192, 132, 252, 0.1) 30%,
            rgba(129, 140, 248, 0.05) 60%,
            transparent 70%
          )
        `,
        boxShadow: '0 0 80px rgba(56, 189, 248, 0.1), 0 0 120px rgba(192, 132, 252, 0.05)',
      }}
      animate={{
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Orbit Ring - Rotating ring around central hub
function OrbitRing({ index, mouseX, mouseY }) {
  const size = 200 + index * 100
  const rotateOffset = useTransform(mouseX, [0, 1], [-10, 10])
  const springRotate = useSpring(rotateOffset, { damping: 30, stiffness: 50 })

  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full border"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderColor: `rgba(56, 189, 248, ${0.08 - index * 0.02})`,
        rotateZ: springRotate,
      }}
      animate={{
        rotate: [0, 360],
      }}
      transition={{
        duration: 30 + index * 15,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {/* Orbit dot */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 6,
          height: 6,
          top: -3,
          left: '50%',
          marginLeft: -3,
          background: 'rgba(56, 189, 248, 0.6)',
          boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)',
        }}
      />
    </motion.div>
  )
}

// Cursor Trail Node
function CursorTrail({ mouseX, mouseY, delay }) {
  const x = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const y = useTransform(mouseY, [0, 1], ['0%', '100%'])

  const springConfig = { damping: 15 + delay * 5, stiffness: 100 - delay * 10, mass: 1 + delay * 0.5 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: springX,
        top: springY,
        width: 12 - delay * 2,
        height: 12 - delay * 2,
        marginLeft: -(12 - delay * 2) / 2,
        marginTop: -(12 - delay * 2) / 2,
        background: `radial-gradient(circle, rgba(56, 189, 248, ${0.6 - delay * 0.15}), transparent)`,
        boxShadow: `0 0 ${20 - delay * 4}px rgba(56, 189, 248, ${0.3 - delay * 0.08})`,
      }}
    />
  )
}

export default function InteractiveBackground() {
  const [mounted, setMounted] = useState(false)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const nodes = Array.from({ length: 12 }, (_, i) => i)
  const streams = Array.from({ length: 8 }, (_, i) => i)
  const orbits = Array.from({ length: 3 }, (_, i) => i)
  const trails = Array.from({ length: 4 }, (_, i) => i)

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
      {/* Deep space background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(192, 132, 252, 0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(15, 23, 42, 1) 0%, rgba(11, 15, 25, 1) 100%)
          `,
        }}
      />

      {/* Hexagon grid pattern */}
      <HexagonGrid mouseX={mouseX} mouseY={mouseY} />

      {/* Data stream lines */}
      {streams.map((i) => (
        <DataStream key={`stream-${i}`} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* Canvas particle network - main attraction */}
      <ParticleCanvas mouseX={mouseX} mouseY={mouseY} />

      {/* Central hub glow */}
      <CentralHub mouseX={mouseX} mouseY={mouseY} />

      {/* Orbit rings */}
      {orbits.map((i) => (
        <OrbitRing key={`orbit-${i}`} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* Floating nodes with Framer Motion */}
      {nodes.map((i) => (
        <FloatingNode key={`node-${i}`} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}

      {/* Cursor trail */}
      {trails.map((i) => (
        <CursorTrail key={`trail-${i}`} mouseX={mouseX} mouseY={mouseY} delay={i} />
      ))}

      {/* Network pulse rings */}
      <NetworkPulse mouseX={mouseX} mouseY={mouseY} />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(11, 15, 25, 0.4) 100%)',
        }}
      />
    </div>
  )
}
