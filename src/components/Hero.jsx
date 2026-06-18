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

  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/65' : 'text-[#1a1a1a]/65'
  const nameGradient = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
  const cursorColor = dark ? 'bg-orange-400' : 'bg-violet-500'

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
      className="relative min-h-screen flex items-center justify-start pt-24 px-4 sm:px-6 lg:px-16"
      aria-label="Hero section">

      {/* Subtle dark overlay behind text for readability */}
      {dark && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent pointer-events-none z-0" />
      )}

      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="relative z-10 max-w-4xl text-left w-full">

        <motion.h1 variants={itemVariants}
          className={`text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${textColor}`}>
          Hello, I'm{' '}
          <span className={`bg-gradient-to-r ${nameGradient} bg-clip-text text-transparent`}>
            {displayed}
            {!done && (
              <motion.span animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                className={`inline-block ml-1 w-[3px] h-[0.85em] align-middle ${cursorColor}`} />
            )}
          </span>
        </motion.h1>

        <motion.p variants={itemVariants}
          className={`text-base sm:text-lg md:text-xl max-w-2xl mb-10 leading-relaxed ${mutedText}`}>
          A passionate developer focused on clean code, performant UI, and building
          impactful products that make a difference.
        </motion.p>
      </motion.div>
    </motion.section>
  )
}

export default Hero
