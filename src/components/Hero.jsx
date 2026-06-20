import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '../ThemeContext'

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

function Hero() {
  const { dark } = useTheme()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])
  const y = useTransform(scrollY, [0, 400], [0, 100])
  const { displayed, done } = useTypingEffect('Guruvishnu S', 80, 800)

  const textColor = dark ? '#00F0FF' : '#0A1A3A'
  const mutedText = dark ? 'rgba(0,240,255,0.65)' : 'rgba(10,26,58,0.65)'
  const accent = dark ? '#FFFFFF' : '#00F0FF'

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

      {/* Readability overlay — only in dark mode, theme-aware */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: dark
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0.25), transparent)'
            : 'linear-gradient(to bottom, rgba(248,249,250,0.5), rgba(248,249,250,0.2), transparent)',
        }}
      />

      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 max-w-4xl text-left w-full">

        <motion.h1 variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-5 sm:mb-6"
          style={{ color: textColor }}>
          Hello, I'm{' '}
          <span style={{ color: accent }}>
            {displayed}
            {!done && (
              <motion.span animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className="inline-block ml-1 w-[3px] h-[0.85em] align-middle"
                style={{ backgroundColor: accent }} />
            )}
          </span>
        </motion.h1>

        <motion.p variants={itemVariants}
          className="text-base sm:text-lg md:text-xl max-w-2xl mb-4 sm:mb-6 leading-relaxed"
          style={{ color: mutedText }}>
          An enthusiastic full-stack developer.
        </motion.p>

        <motion.p variants={itemVariants}
          className="text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 leading-relaxed"
          style={{ color: mutedText }}>
          A passionate developer focused on clean code, performant UI, and building
          impactful products that make a difference.
        </motion.p>
      </motion.div>
    </motion.section>
  )
}

export default Hero
