import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { GithubLogo, LinkedinLogo, FileText, ArrowDown, ArrowUpRight } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'
import { buttonMotionProps, iconMotionProps } from './motionPresets'

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

export default function Hero() {
  const { dark } = useTheme()
  const c = getColors(dark)
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const scale = useTransform(scrollY, [0, 500], [1, 0.96])
  const y = useTransform(scrollY, [0, 500], [0, 60])
  const { displayed, done } = useTypingEffect('Vishnu', 90, 700)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 16 } },
  }

  return (
    <motion.section id="hero" style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center justify-start pt-28 sm:pt-24 px-4 sm:px-6 lg:px-16"
      aria-label="Hero section">

      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 max-w-3xl text-left w-full">

        <motion.span variants={itemVariants}
          className="inline-block px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6"
          style={{ backgroundColor: c.accentSoft, color: c.accent }}>
          Open to Internships
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
        </motion.h1>

        <motion.p variants={itemVariants}
          className="text-base sm:text-lg md:text-xl max-w-xl mb-9 leading-relaxed"
          style={{ color: c.textSecondary }}>
          I build clean, responsive interfaces with{' '}
          <span style={{ color: c.textPrimary, fontWeight: 600 }}>HTML, CSS & JavaScript</span>,
          and I'm currently deepening that into full-stack work with the{' '}
          <span style={{ color: c.textPrimary, fontWeight: 600 }}>MERN stack</span> —
          learning in public, one real commit at a time.
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
          <motion.a
            href="https://github.com/Guruvishnu444"
            target="_blank"
            rel="noopener noreferrer"
            {...buttonMotionProps}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-lg"
            style={{ backgroundColor: c.accent, color: '#FFFFFF', boxShadow: `0 8px 24px ${c.accent}40` }}>
            <GithubLogo size={19} weight="bold" />
            View My GitHub
            <ArrowUpRight size={16} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </motion.a>

          <motion.a
            href="#about"
            onClick={e => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) }}
            {...buttonMotionProps}
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm sm:text-base border-2"
            style={{ borderColor: c.cardBorder, color: c.textPrimary, backgroundColor: 'transparent' }}>
            Scroll My Story
            <ArrowDown size={16} weight="bold" className="group-hover:translate-y-0.5 transition-transform" />
          </motion.a>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-3 mt-7">
          {[
            { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-951a67345/' },
            { name: 'Resume', icon: FileText, href: '/resume.pdf', download: true },
          ].map(link => (
            <motion.a key={link.name} href={link.href}
              target={link.download ? undefined : '_blank'} rel="noopener noreferrer" download={link.download}
              aria-label={link.name}
              {...iconMotionProps}
              className="w-10 h-10 rounded-lg border flex items-center justify-center"
              style={{ borderColor: c.cardBorder, color: c.textSecondary }}>
              <link.icon size={18} weight="duotone" />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
