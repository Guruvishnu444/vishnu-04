import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, FileArrowDown } from '@phosphor-icons/react'

function MagneticButton({ children, className, onClick }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

function MagneticLink({ children, className, href }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 20 })
  const springY = useSpring(y, { stiffness: 150, damping: 20 })

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </motion.a>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const scale = useTransform(scrollY, [0, 400], [1, 0.95])
  const y = useTransform(scrollY, [0, 400], [0, 100])

  const scrollToProjects = () => {
    const element = document.getElementById('projects')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <motion.section
      style={{ opacity, scale, y }}
      className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      aria-label="Hero section"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 rounded-full glass-card text-sm text-off-white/80 font-medium">
            Full Stack Developer
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-off-white leading-tight mb-6 text-balance"
        >
          Hello, I'm{' '}
          <span className="gradient-text">Guruvishnu S</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl text-off-white/70 max-w-2xl mx-auto mb-10 leading-relaxed text-pretty"
        >
          A passionate developer focused on clean code, performant UI, and building
          impactful products that make a difference.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Magnetic "View My Work" button */}
          <MagneticButton
            onClick={scrollToProjects}
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-sky-neon to-lavender text-midnight font-semibold hover:opacity-90 transition-all flex items-center gap-2"
          >
            View My Work
            <ArrowDown
              size={20}
              weight="bold"
              className="group-hover:translate-y-1 transition-transform"
            />
          </MagneticButton>

          {/* Magnetic "Resume" link */}
          <MagneticLink
            href="/resume.pdf"
            className="px-8 py-4 rounded-xl glass-card text-off-white font-semibold hover:border-sky-neon/50 transition-all flex items-center gap-2 border border-white/10"
          >
            <FileArrowDown size={20} weight="bold" />
            Resume Here
          </MagneticLink>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-6 h-10 rounded-full border-2 border-off-white/30 flex items-start justify-center p-2"
          >
            {/* Changed from sky-neon to off-white to eliminate neon indicator glow */}
            <motion.div className="w-1.5 h-1.5 rounded-full bg-off-white" />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

export default Hero
