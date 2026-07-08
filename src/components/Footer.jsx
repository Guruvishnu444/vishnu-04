import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

function FooterParticles({ dark }) {
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
    const darkColors = ['220,38,38', '234,88,12', '239,68,68', '249,115,22']
    const lightColors = ['56,189,248', '236,72,153', '139,92,246', '99,102,241']
    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.5,
      color: dark
        ? darkColors[Math.floor(Math.random() * darkColors.length)]
        : lightColors[Math.floor(Math.random() * lightColors.length)],
    }))
    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      // draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(${particles[i].color},${(1 - d / 100) * 0.25})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},0.7)`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [dark])
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

function Footer() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedColor = dark ? 'text-[#f5f5f5]/50' : 'text-[#1a1a1a]/50'
  const borderColor = dark ? 'border-white/10' : 'border-black/10'
  const cardBorder = dark ? 'border-white/10 hover:border-orange-500/50' : 'border-black/10 hover:border-violet-400/50'
  const iconColor = dark ? 'text-orange-400' : 'text-violet-500'
  const linkHover = dark ? 'hover:text-orange-400' : 'hover:text-violet-500'

  const navLinks = [
    { label: 'About', href: '#about', key: 'about-1' },
    { label: 'Projects', href: '#projects', key: 'projects-1' },
    { label: 'Contact', href: '#contact', key: 'contact-1' },
    { label: 'Projects', href: '#projects', key: 'projects-2' },
    { label: 'Contact', href: '#contact', key: 'contact-2' },
  ]
  const socialLinks = [
    { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/Guruvishnu444' },
    { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-v4/' },
    { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/u/GuruvishnuS/' },
  ]

  return (
    <footer className={`relative border-t py-12 px-6 overflow-hidden transition-colors duration-500 ${borderColor}`}>
      <FooterParticles dark={dark} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${dark ? 'bg-gradient-to-br from-red-600 to-orange-500' : 'bg-gradient-to-br from-blue-400 via-pink-400 to-violet-500'}`}>
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div>
              <span className={`font-semibold ${textColor}`}>VISHNU!</span>
              <p className={`text-sm ${mutedColor}`}>Building the future</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="flex justify-center gap-8">
            {navLinks.map(link => (
              <a key={link.key} href={link.href}
                className={`text-sm font-medium transition-colors ${mutedColor} ${linkHover}`}>
                {link.label}
              </a>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex justify-end gap-4">
            {socialLinks.map(link => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                aria-label={`Visit ${link.name}`}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all group ${cardBorder}`}>
                <link.icon size={20} weight="duotone" className={`transition-colors ${iconColor}`} />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className={`mt-8 pt-8 border-t text-center ${borderColor}`}>
          <p className={`text-sm ${mutedColor}`}>© 2026 Guruvishnu S. All rights reserved.</p>
          <p className={`text-xs mt-2 ${dark ? 'text-[#f5f5f5]/25' : 'text-[#1a1a1a]/25'}`}>
            Made with lots of ☕️ and a whole lot of ❤️.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
