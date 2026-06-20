import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import ThemeToggle from './ThemeToggle'

function Navbar() {
  const { dark } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'journey' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ]

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

  // ── Exact color system ──
  const textColor = dark ? '#00F0FF' : '#0A1A3A'
  const accentColor = dark ? '#FFFFFF' : '#00F0FF'
  const navBg = dark ? 'rgba(0,0,0,0.85)' : 'rgba(248,249,250,0.92)'
  const navBgScrolled = dark ? 'rgba(0,0,0,0.92)' : 'rgba(248,249,250,0.97)'
  const borderColor = dark ? 'rgba(0,240,255,0.15)' : 'rgba(10,26,58,0.1)'
  const mobileBg = dark ? 'rgba(0,0,0,0.97)' : 'rgba(248,249,250,0.98)'

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-center px-3 sm:px-4 pt-3 sm:pt-5 md:px-0">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: scrolled ? 'auto' : '100%',
          maxWidth: scrolled ? '860px' : '100%',
          borderRadius: scrolled ? '9999px' : '0px',
          paddingLeft: scrolled ? '20px' : '0px',
          paddingRight: scrolled ? '20px' : '0px',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1), background-color 0.3s ease, border-color 0.3s ease',
          backdropFilter: 'blur(16px)',
          backgroundColor: scrolled ? navBgScrolled : navBg,
          border: `1px solid ${borderColor}`,
          boxShadow: scrolled ? `0 8px 32px rgba(0,0,0,${dark ? 0.5 : 0.08})` : 'none',
          overflow: 'hidden',
          position: 'relative',
          color: textColor,
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="relative z-10 w-full py-3">
          <div className={`flex items-center justify-between gap-3 sm:gap-6 ${scrolled ? 'px-3 sm:px-2' : 'max-w-7xl mx-auto px-4 sm:px-8'}`}>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8 lg:gap-10">
              {navLinks.map(link => (
                <motion.button key={link.id} onClick={() => scrollToSection(link.id)}
                  whileHover={{ y: -1 }}
                  className="relative font-medium pb-1 group transition-opacity whitespace-nowrap"
                  style={{ color: textColor, opacity: activeSection === link.id ? 1 : 0.7 }}>
                  {link.label}
                  <span
                    className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: accentColor,
                      width: activeSection === link.id ? '100%' : '0%',
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Right: ThemeToggle + CTA (desktop pushed right via ml-auto on mobile too) */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              <ThemeToggle />
              <motion.a href="mailto:guruvishnu4gd@gmail.com"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-full font-semibold text-sm transition-all whitespace-nowrap"
                style={{
                  backgroundColor: accentColor,
                  color: dark ? '#000000' : '#FFFFFF',
                }}
              >
                Hii
              </motion.a>
            </div>

            {/* Mobile: toggle + menu button, pushed to opposite ends */}
            <div className="md:hidden flex items-center justify-between w-full gap-2">
              <span className="text-sm font-semibold" style={{ color: textColor }}>Menu</span>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg"
                  style={{ color: textColor }}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>
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
              style={{ backgroundColor: mobileBg, borderTop: `1px solid ${borderColor}` }}
              className="md:hidden w-full">
              <div className="px-5 py-4 flex flex-col gap-1">
                {navLinks.map(link => (
                  <button key={link.id} onClick={() => scrollToSection(link.id)}
                    className="text-left font-medium py-2.5 border-b transition-colors"
                    style={{
                      color: textColor,
                      borderColor: activeSection === link.id ? accentColor : 'transparent',
                      opacity: activeSection === link.id ? 1 : 0.7,
                    }}>
                    {link.label}
                  </button>
                ))}
                <a href="mailto:guruvishnu4gd@gmail.com"
                  className="text-center py-2.5 rounded-full font-semibold mt-3"
                  style={{ backgroundColor: accentColor, color: dark ? '#000000' : '#FFFFFF' }}>
                  Hii
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  )
}

export default Navbar
