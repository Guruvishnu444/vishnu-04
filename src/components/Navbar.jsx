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

  const mutedText = dark ? 'text-[#f5f5f5]/70' : 'text-[#1a1a1a]/70'
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const underlineColor = dark ? 'bg-orange-500' : 'bg-violet-500'
  const mobileBg = dark ? 'bg-black/95' : 'bg-white/95'
  const mobileBorder = dark ? 'border-white/10' : 'border-black/10'

  return (
    <header className="fixed top-0 right-0 left-0 z-50 flex justify-center px-4 pt-5 md:px-0">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          width: scrolled ? 'auto' : '100%',
          maxWidth: scrolled ? '820px' : '100%',
          borderRadius: scrolled ? '9999px' : '0px',
          paddingLeft: scrolled ? '32px' : '0px',
          paddingRight: scrolled ? '32px' : '0px',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1), background-color 0.3s ease, border-color 0.3s ease',
          backdropFilter: 'blur(16px)',
          backgroundColor: dark
            ? scrolled ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0.75)'
            : scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.80)',
          border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
          boxShadow: scrolled ? (dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.1)') : 'none',
          overflow: 'hidden',
          position: 'relative',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* NO ParticleCanvas here — removed */}
        <div className="relative z-10 w-full py-3">
          <div className={`flex items-center justify-between gap-8 ${scrolled ? 'px-2' : 'max-w-7xl mx-auto px-8'}`}>

            {/* Logo */}
            <motion.a href="#"
              onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="font-bold text-lg"
              whileHover={{ opacity: 0.75 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            >
              {dark
                ? <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">Guruvishnu</span>
                : <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-violet-500 bg-clip-text text-transparent">Guruvishnu</span>
              }
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-12">
              {navLinks.map(link => (
                <motion.button key={link.id} onClick={() => scrollToSection(link.id)}
                  whileHover={{ opacity: 1, y: -1 }}
                  className={`relative font-medium pb-1 group transition-opacity ${mutedText}`}>
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ${underlineColor} ${activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </motion.button>
              ))}
            </div>

            {/* Right: ThemeToggle + CTA */}
            <div className="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <motion.a href="mailto:guruvishnu4gd@gmail.com"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-full font-semibold text-sm text-white bg-white/20 hover:bg-white/30 border border-white/30 transition-all">
                Hii
              </motion.a>
            </div>

            {/* Mobile */}
            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`p-2 ${textColor}`}>
                {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
              className={`md:hidden border-t ${mobileBg} ${mobileBorder}`}>
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map(link => (
                  <button key={link.id} onClick={() => scrollToSection(link.id)}
                    className={`text-left font-medium py-2 border-b-2 transition-colors ${
                      activeSection === link.id
                        ? `${textColor} ${dark ? 'border-orange-500' : 'border-violet-500'}`
                        : `${mutedText} border-transparent`}`}>
                    {link.label}
                  </button>
                ))}
                <a href="mailto:guruvishnu4gd@gmail.com"
                  className="text-center py-2.5 rounded-full text-white font-semibold mt-1 bg-white/20 border border-white/30">
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
