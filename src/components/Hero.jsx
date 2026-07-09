import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, FileArrowDown } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import SplitText from './SplitText'

function MagneticButton({ children, className, onClick }) {
  const x = useMotionValue(0); const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })
  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  return (
    <motion.button style={{ x: springX, y: springY }}
      onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick} className={className}>{children}</motion.button>
  )
}

function MagneticLink({ children, className, href }) {
  const x = useMotionValue(0); const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })
  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  return (
    <motion.a style={{ x: springX, y: springY }}
      onMouseMove={handleMouse} onMouseLeave={() => { x.set(0); y.set(0) }}
      href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</motion.a>
  )
}

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
  }, [text, speed, startDelay])
  return { displayed, done }
}

function Hero() {
  const { dark } = useTheme()
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])
  const y = useTransform(scrollY, [0, 400], [0, 100])
  const { displayed, done } = useTypingEffect('Guruvishnu S', 100, 1200)

  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/65' : 'text-[#1a1a1a]/65'
  const nameGradient = dark
    ? 'from-red-500 via-orange-400 to-red-400'
    : 'from-blue-400 via-pink-400 to-violet-500'
  const cursorColor = dark ? 'bg-orange-400' : 'bg-violet-500'
  const btnGradient = dark
    ? 'bg-gradient-to-r from-red-600 to-orange-500'
    : 'bg-gradient-to-r from-blue-400 via-pink-400 to-violet-500'
  const resumeBtn = dark
    ? 'border-white/15 text-[#f5f5f5] hover:border-orange-500/50'
    : 'border-black/15 text-[#1a1a1a] hover:border-violet-400/50'
  const scrollBorder = dark ? 'border-white/25' : 'border-black/25'
  const scrollDot = dark ? 'bg-orange-400' : 'bg-violet-500'
  const badgeGradient = dark
    ? 'from-red-600 via-orange-500 to-red-400'
    : 'from-blue-400 via-pink-400 to-violet-500'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } },
  }

  return (
    <motion.section id="hero" style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center justify-start pt-24 px-6"
      aria-label="Hero section">
      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className="max-w-4xl text-left">

        <motion.div variants={itemVariants} className="mb-6">
          <span className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gradient-to-r ${badgeGradient} rounded-xl shadow-sm`}>
            Full Stack Developer !
          </span>

        </motion.div>

        <motion.h1 variants={itemVariants}
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 ${textColor}`}>
          <SplitText
            tag="span"
            text="Hello, I'm "
            className="inline"
            delay={40}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
            repeatEvery={30000}
          />
          <SplitText
            tag="span"
            text="Guruvishnu S"
            className={`inline bg-gradient-to-r ${nameGradient} bg-clip-text text-transparent`}
            delay={40}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="left"
            repeatEvery={30000}
          />
        </motion.h1>

        <motion.p variants={itemVariants}
          className={`text-lg sm:text-x2 max-w-2x4 mb-10 leading-relaxed ${mutedText}`}>
          I’m an aspiring full-stack developer and BSc IT student from Coimbatore, passionate about building clean, responsive web experiences.<br></br>
          I enjoy turning ideas into practical digital products using React, JavaScript, HTML, and CSS.

        </motion.p>

      </motion.div>
    </motion.section>
  )
}

export default Hero