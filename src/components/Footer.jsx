import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

function FooterParticles({ accent }) {
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
    const hex = accent.replace('#', '')
    const color = `${parseInt(hex.substring(0, 2), 16)},${parseInt(hex.substring(2, 4), 16)},${parseInt(hex.substring(4, 6), 16)}`
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.offsetWidth, y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
    }))
    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${color},${(1 - d / 90) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},0.5)`; ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [accent])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]
const socialLinks = [
  { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/Guruvishnu444' },
  { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-951a67345/' },
  { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/u/GuruvishnuS/' },
]

export default function Footer() {
  const { dark } = useTheme()
  const c = getColors(dark)

  return (
    <footer className="relative border-t py-10 sm:py-12 px-4 sm:px-6 overflow-hidden" style={{ borderColor: c.cardBorder }}>
      <FooterParticles accent={c.accent} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-sm font-medium hover:opacity-100" style={{ color: c.textSecondary, opacity: 0.85 }}>
                {link.label}
              </a>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }} className="flex justify-center sm:justify-end gap-4">
            {socialLinks.map(link => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${link.name}`}
                className="w-10 h-10 rounded-lg border flex items-center justify-center"
                style={{ borderColor: c.cardBorder, backgroundColor: c.card, color: c.accent }}>
                <link.icon size={20} weight="duotone" />
              </a>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center" style={{ borderColor: c.cardBorder }}>
          <p className="text-sm" style={{ color: c.textSecondary }}>© 2025 Guruvishnu S. All rights reserved.</p>
          <p className="text-xs mt-2" style={{ color: c.textSecondary, opacity: 0.6 }}>Made with lots of ☕️ and a whole lot of ❤️.</p>
        </motion.div>
      </div>
    </footer>
  )
}
