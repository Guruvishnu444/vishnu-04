import { motion } from 'framer-motion'
import { GithubLogo, ArrowUpRight } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

export default function Projects() {
  const { dark } = useTheme()
  const c = getColors(dark)

  return (
    <section id="projects" className="relative py-20 sm:py-24 px-4 sm:px-6" aria-label="Projects section">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>

          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
            style={{ backgroundColor: c.accentSoft, color: c.accent }}>
            Projects
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-5" style={{ color: c.textPrimary }}>
            Building <span style={{ color: c.accent }}>in public</span>
          </h2>
          <p className="text-sm sm:text-base leading-relaxed mb-10 max-w-md mx-auto" style={{ color: c.textSecondary }}>
            I don't have a finished project to show yet — and I'd rather tell you that
            than dress up placeholders. What I do have is an active GitHub where I'm
            learning the MERN stack in the open. Check back, or follow along.
          </p>

          <motion.a
            href="https://github.com/Guruvishnu444"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold border"
            style={{ borderColor: c.cardBorder, backgroundColor: c.card, color: c.textPrimary }}
          >
            <GithubLogo size={20} weight="duotone" style={{ color: c.accent }} />
            Follow my GitHub
            <ArrowUpRight size={16} weight="bold" className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" style={{ color: c.accent }} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
