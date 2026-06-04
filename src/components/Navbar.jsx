import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { List, X } from '@phosphor-icons/react'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { label: 'About', id: 'about' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-midnight/80 backdrop-blur-lg border-b border-white/10'
          : 'bg-transparent'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 group"
            aria-label="Guruvishnu - Home"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-neon to-lavender flex items-center justify-center">
              <span className="text-midnight font-bold text-lg">GV</span>
            </div>
            <span className="text-off-white font-semibold text-lg group-hover:text-sky-neon transition-colors">
              Guruvishnu
            </span>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-off-white/80 hover:text-sky-neon transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="mailto:guruvishnu4gd@gmail.com"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-neon to-lavender text-midnight font-semibold hover:opacity-90 transition-opacity"
            >
              Hii
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-off-white"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={28} /> : <List size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-midnight/95 backdrop-blur-lg border-b border-white/10"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="text-left text-off-white/80 hover:text-sky-neon transition-colors font-medium py-2"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="mailto:guruvishnu4gd@gmail.com"
                className="inline-block text-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-neon to-lavender text-midnight font-semibold mt-2"
              >
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
