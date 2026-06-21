import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { label: 'About', id: 'about' },
  { label: 'Journey', id: 'journey' },
  { label: 'Projects', id: 'projects' },
  { label: 'Contact', id: 'contact' },
]

export default function Navbar() {
  const { dark } = useTheme()
  const c = getColors(dark)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  const navBg = dark ? 'rgba(13,17,23,0.85)' : 'rgba(248,249,250,0.92)'
  const navBgScrolled = dark ? 'rgba(13,17,23,0.95)' : 'rgba(248,249,250,0.97)'
  const mobileBg = dark ? 'rgba(13,17,23,0.98)' : 'rgba(248,249,250,0.98)'

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-5">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: scrolled ? 'auto' : '100%',
          maxWidth: scrolled ? '780px' : '100%',
          borderRadius: scrolled ? '9999px' : '0px',
          paddingLeft: scrolled ? '24px' : '0px',
          paddingRight: scrolled ? '24px' : '0px',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1), background-color 0.3s ease, border-color 0.3s ease',
          backdropFilter: 'blur(16px)',
          backgroundColor: scrolled ? navBgScrolled : navBg,
          border: `1px solid ${c.cardBorder}`,
          boxShadow: scrolled ? `0 8px 32px rgba(0,0,0,${dark ? 0.4 : 0.08})` : 'none',
          position: 'relative',
        }}
      >
        <div className="w-full py-3">
          <div className="flex items-center justify-between md:justify-center w-full max-w-7xl mx-auto px-4 sm:px-8">

            {/* Desktop: centered links */}
            <div className="hidden md:flex items-center gap-9 lg:gap-10">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => scrollToSection(link.id)}
                  className="relative font-medium pb-1 transition-all duration-200"
                  style={{ color: activeSection === link.id ? c.accent : c.textSecondary }}
                  onMouseEnter={e => { e.currentTarget.style.color = c.accent; e.currentTarget.style.textShadow = `0 0 10px ${c.accent}90` }}
                  onMouseLeave={e => { if (activeSection !== link.id) e.currentTarget.style.color = c.textSecondary; e.currentTarget.style.textShadow = 'none' }}
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: c.accent,
                      boxShadow: `0 0 8px ${c.accent}`,
                      width: activeSection === link.id ? '100%' : '0%',
                    }} />
                </button>
              ))}
            </div>

            {/* Desktop right cluster */}
            <div className="hidden md:flex items-center gap-4 absolute right-4 sm:right-8">
              <ThemeToggle />
              <a href="mailto:guruvishnu4gd@gmail.com"
                className="px-4 py-2 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: c.accent, color: '#FFFFFF' }}>
                Hire Me
              </a>
            </div>

            {/* Mobile bar */}
            <div className="md:hidden flex items-center justify-between w-full">
              <span className="font-bold text-sm" style={{ color: c.accent }}>GV</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2" style={{ color: c.textPrimary }}>
                  {mobileMenuOpen ? <X size={22} /> : <List size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              style={{ backgroundColor: mobileBg, borderTop: `1px solid ${c.cardBorder}` }}
              className="md:hidden w-full overflow-hidden">
              <div className="px-5 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <button key={link.id} onClick={() => scrollToSection(link.id)}
                    className="text-left font-medium py-2.5 border-b transition-colors"
                    style={{
                      color: activeSection === link.id ? c.accent : c.textSecondary,
                      borderColor: activeSection === link.id ? c.accent : 'transparent',
                    }}>
                    {link.label}
                  </button>
                ))}
                <a href="mailto:guruvishnu4gd@gmail.com"
                  className="text-center py-2.5 rounded-full font-semibold mt-3"
                  style={{ backgroundColor: c.accent, color: '#FFFFFF' }}>
                  Hire Me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}
