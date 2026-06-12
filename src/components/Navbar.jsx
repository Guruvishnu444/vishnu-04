import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X, Sun, Moon } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

function ParticleCanvas({ dark }) {
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
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      })
    }
    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      const color = dark ? '255,255,255' : '43,43,43'
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},0.25)`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [dark])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />
}

function Navbar() {
  const { dark, toggle } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ]

  useEffect(() => {
    const observers = []
    navLinks.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.4 }
      )
      observer.observe(el)
      observers.push(observer)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navBg = dark ? 'bg-[#1a1a1a]/85 border-white/10' : 'bg-[#fffaf0]/85 border-black/10'
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#2b2b2b]'
  const textMuted = dark ? 'text-[#f5f5f5]/70' : 'text-[#2b2b2b]/70'
  const underlineColor = dark ? 'bg-[#f5f5f5]' : 'bg-[#2b2b2b]'
  const mobileBg = dark ? 'bg-[#1a1a1a]/95' : 'bg-[#fffaf0]/95'

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 overflow-hidden backdrop-blur-lg border-b transition-colors duration-500 ${navBg}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <ParticleCanvas dark={dark} />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <motion.a href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className={`font-semibold text-lg transition-colors duration-300 ${textColor} hover:opacity-70`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            Guruvishnu
          </motion.a>

          {/* Desktop Nav */}
          <motion.div className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            {navLinks.map(link => (
              <button key={link.id} onClick={() => scrollToSection(link.id)}
                className={`relative font-medium pb-1 group transition-colors duration-300 ${textMuted} hover:${textColor}`}>
                {link.label}
                <span className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${underlineColor} ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </button>
            ))}
          </motion.div>

          {/* Right side: Theme toggle + CTA */}
          <motion.div className="hidden md:flex items-center gap-3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            {/* Dark/Light toggle */}
            <button onClick={toggle}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${dark ? 'border-white/20 text-[#f5f5f5] hover:border-white/50' : 'border-black/20 text-[#2b2b2b] hover:border-black/50'}`}
              aria-label="Toggle theme">
              {dark ? <Sun size={20} weight="duotone" /> : <Moon size={20} weight="duotone" />}
            </button>
            <a href="mailto:guruvishnu4gd@gmail.com"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 text-white font-semibold hover:opacity-90 transition-opacity">
              Hii
            </a>
          </motion.div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-300 ${dark ? 'border-white/20 text-[#f5f5f5]' : 'border-black/20 text-[#2b2b2b]'}`}>
              {dark ? <Sun size={18} weight="duotone" /> : <Moon size={18} weight="duotone" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${textColor}`} aria-label="Toggle menu">
              {mobileMenuOpen ? <X size={28} /> : <List size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className={`md:hidden backdrop-blur-lg border-b transition-colors duration-500 ${mobileBg} ${dark ? 'border-white/10' : 'border-black/10'}`}>
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollToSection(link.id)}
                  className={`text-left font-medium py-2 border-b-2 transition-colors duration-300 ${
                    activeSection === link.id
                      ? `${textColor} ${dark ? 'border-white' : 'border-[#2b2b2b]'}`
                      : `${textMuted} border-transparent`}`}>
                  {link.label}
                </button>
              ))}
              <a href="mailto:guruvishnu4gd@gmail.com"
                className="text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-violet-500 text-white font-semibold mt-2">
                Hii
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
