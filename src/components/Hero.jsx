import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GithubLogo, LinkedinLogo, FileText, ArrowDown } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

function useTypingEffect(text, speed = 90, startDelay = 700) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0; setDisplayed(''); setDone(false)
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++; setDisplayed(text.slice(0, i))
        if (i >= text.length) { clearInterval(interval); setDone(true) }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)
    return () => clearTimeout(timeout)
  }, [text])
  return { displayed, done }
}

const socialLinks = [
  { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/Guruvishnu444' },
  { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-951a67345/' },
  { name: 'Resume', icon: FileText, href: '/resume.pdf', download: true },
]

export default function Hero() {
  const { dark } = useTheme()
  const c = getColors(dark)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.96])
  const y = useTransform(scrollY, [0, 400], [0, 80])
  const { displayed, done } = useTypingEffect('Vishnu', 90, 700)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 16 } },
  }

  return (
    <motion.section style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center justify-start pt-28 sm:pt-24 px-4 sm:px-6 lg:px-16"
      aria-label="Hero section">

      <div className="absolute inset-0 pointer-events-none z-0"
        style={{ background: `linear-gradient(to bottom, ${c.bg}b3, ${c.bg}40, transparent)` }} />

      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 max-w-3xl text-left w-full">

        <motion.span variants={itemVariants}
          className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6"
          style={{ backgroundColor: c.accentSoft, color: c.accent }}>
          Full Stack Developer
        </motion.span>

        <motion.h1 variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6"
          style={{ color: c.textPrimary }}>
          Hi, I'm{' '}
          <span style={{ color: c.accent }}>
            {displayed}
            {!done && (
              <motion.span animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block ml-1 w-[3px] h-[0.8em] align-middle"
                style={{ backgroundColor: c.accent }} />
            )}
          </span>.
          <br />
          I build scalable full-stack web applications.
        </motion.h1>

        <motion.p variants={itemVariants}
          className="text-base sm:text-lg md:text-xl max-w-xl mb-9 leading-relaxed"
          style={{ color: c.textSecondary }}>
          Using <span style={{ color: c.textPrimary, fontWeight: 600 }}>React, Node.js, and the MERN stack</span>,
          I turn ideas into clean, performant, and user-friendly products.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            href="#projects"
            onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-opacity hover:opacity-90"
            style={{ backgroundColor: c.accent, color: '#FFFFFF' }}
          >
            View My Work
            <ArrowDown size={18} weight="bold" className="group-hover:translate-y-0.5 transition-transform" />
          </motion.a>

          <div className="flex items-center gap-3">
            {socialLinks.map(link => (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.download ? undefined : '_blank'}
                rel="noopener noreferrer"
                download={link.download}
                aria-label={link.name}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center"
                style={{ borderColor: c.cardBorder, backgroundColor: c.card, color: c.accent }}
              >
                <link.icon size={21} weight="duotone" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
