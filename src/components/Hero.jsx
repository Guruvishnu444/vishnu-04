import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GithubLogo, LinkedinLogo, FileText } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

function useTypingEffect(text, speed = 80, startDelay = 600) {
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

function Hero() {
  const { dark } = useTheme()
  const c = getColors(dark)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])
  const y = useTransform(scrollY, [0, 400], [0, 100])
  const { displayed, done } = useTypingEffect('Vishnu', 90, 700)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  }

  return (
    <motion.section style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center justify-start pt-28 sm:pt-24 px-4 sm:px-6 lg:px-16"
      aria-label="Hero section">

      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: dark
            ? `linear-gradient(to bottom, ${c.bg}cc, ${c.bg}66, transparent)`
            : `linear-gradient(to bottom, ${c.bg}99, ${c.bg}33, transparent)`,
        }}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 max-w-4xl text-left w-full">

        <motion.span variants={itemVariants}
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-5"
          style={{ backgroundColor: c.accentSoft, color: c.accent }}>
          Full Stack Developer
        </motion.span>

        <motion.h1 variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 sm:mb-6"
          style={{ color: c.textPrimary }}>
          Hi, I'm{' '}
          <span style={{ color: c.accent }}>
            {displayed}
            {!done && (
              <motion.span animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block ml-1 w-[3px] h-[0.85em] align-middle"
                style={{ backgroundColor: c.accent }} />
            )}
          </span>
          .
        </motion.h1>

        <motion.p variants={itemVariants}
          className="text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 leading-relaxed"
          style={{ color: c.textSecondary }}>
          I build scalable full-stack web applications using{' '}
          <span style={{ color: c.textPrimary, fontWeight: 600 }}>
            React, Node.js, and the MERN stack
          </span>.
        </motion.p>

        {/* Social icons */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 sm:gap-4">
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
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center transition-all"
              style={{ borderColor: c.cardBorder, backgroundColor: c.card, color: c.accent }}
            >
              <link.icon size={22} weight="duotone" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default Hero
