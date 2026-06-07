import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'

function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = []
    const particleCount = 50

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }

    let animationId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)'
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

function Footer() {
  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]

  const socialLinks = [
    {
      name: 'GitHub',
      icon: GithubLogo,
      href: 'https://github.com/guruvishnu',
    },
    {
      name: 'LinkedIn',
      icon: LinkedinLogo,
      href: 'https://linkedin.com/in/guruvishnu',
    },
    {
      name: 'LeetCode',
      icon: Code,
      href: 'https://leetcode.com/guruvishnu',
    },
  ]

  return (
    <footer className="relative border-t border-white/10 py-12 px-6 overflow-hidden">
      <ParticleCanvas />
      
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Logo & Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-neon to-lavender flex items-center justify-center">
              <span className="text-midnight font-bold text-lg">GV</span>
            </div>
            <div>
              <span className="text-off-white font-semibold">Guruvishnu</span>
              <p className="text-off-white/50 text-sm">Building the future</p>
            </div>
          </motion.div>

          {/* Nav Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-8"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-off-white/70 hover:text-sky-neon transition-colors text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          {/* Social Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-end gap-4"
          >
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${link.name}`}
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center hover:border-sky-neon/50 transition-all group"
              >
                <link.icon
                  size={20}
                  weight="duotone"
                  className="text-off-white/70 group-hover:text-sky-neon transition-colors"
                />
              </a>
            ))}
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-white/5 text-center"
        >
          <p className="text-off-white/50 text-sm">
            © 2025 Guruvishnu S. All rights reserved.
          </p>
          <p className="text-off-white/30 text-xs mt-2">
            Made with lots of ☕️ and a whole lot of ❤️.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
