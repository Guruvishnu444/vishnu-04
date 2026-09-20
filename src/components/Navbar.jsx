import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, X, Sun, Moon } from '@phosphor-icons/react';
import { useTheme } from '../ThemeContext';

export default function Navbar() {
  const { dark, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Journey', id: 'journey' },
    { label: 'Projects', id: 'projects' },
    { label: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Get all sections
      const sections = navLinks.map(link => ({
        id: link.id,
        element: document.getElementById(link.id)
      })).filter(s => s.element);
      
      // Find which section is currently in view
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };
    
    handleScroll(); // Call once on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? dark
            ? 'bg-black/90 backdrop-blur-xl'
            : 'bg-white/90 backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`relative text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? dark
                      ? 'text-white'
                      : 'text-slate-900'
                    : dark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeSection"
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${
                      dark ? 'bg-cyan-400' : 'bg-blue-600'
                    }`}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="hidden md:block absolute right-6 lg:right-8">
            <motion.button
              onClick={toggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
                dark
                  ? 'border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400'
                  : 'border-slate-300 hover:border-blue-500 text-slate-600 hover:text-blue-600'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {dark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun size={18} weight="duotone" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon size={18} weight="duotone" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3 ml-auto">
            <motion.button
              onClick={toggle}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                dark ? 'border-white/10 text-slate-300' : 'border-slate-300 text-slate-600'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {dark ? <Sun size={16} weight="duotone" /> : <Moon size={16} weight="duotone" />}
            </motion.button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${dark ? 'text-white' : 'text-slate-900'}`}
            >
              {mobileMenuOpen ? <X size={24} /> : <List size={24} />}
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
              className={`md:hidden mt-4 pt-4 border-t ${
                dark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollToSection(link.id)}
                    className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${
                      activeSection === link.id
                        ? dark
                          ? 'bg-cyan-400/10 text-cyan-400 border-l-2 border-cyan-400'
                          : 'bg-blue-50 text-blue-600 border-l-2 border-blue-600'
                        : dark
                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
