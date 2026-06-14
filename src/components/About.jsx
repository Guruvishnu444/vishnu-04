import { motion } from 'framer-motion'
import {
  Code, FileHtml, FileCss, FileJs, Atom, BracketsAngle,
  Database, Cloud, GitBranch, Terminal
} from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

const skillCategories = [
  {
    category: 'Frontend',
    skills: [
      { name: 'HTML5', icon: FileHtml },
      { name: 'CSS3', icon: FileCss },
      { name: 'JavaScript', icon: FileJs },
      
    ]
  },
  {
    category: 'Backend & Languages',
    skills: [
      
      { name: 'Java', icon: Terminal },
      { name: 'C', icon: BracketsAngle },
      { name: 'C++', icon: BracketsAngle },
    ]
  },
  {
    category: 'Tools & Infra',
    skills: [
      { name: 'Git', icon: GitBranch },
     
      { name: 'VS Code', icon: Code },
    ]
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
}

function About() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/65' : 'text-[#1a1a1a]/65'
  const cardBg = dark
    ? 'bg-white/5 border-white/10 hover:border-orange-500/40'
    : 'bg-black/[0.03] border-black/10 hover:border-violet-400/40'
  const badgeBg = dark ? 'bg-red-500/10 text-red-400' : 'bg-blue-400/10 text-blue-500'
  const headingGradient = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
  const iconColor = dark ? 'text-orange-400' : 'text-violet-500'
  const categoryLabel = dark ? 'text-orange-400/80 border-orange-500/20' : 'text-violet-500/80 border-violet-400/20'

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6" aria-label="About section">
      <div className="max-w-6xl mx-auto">

        {/* Top: bio left, intro right */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${badgeBg}`}>
              About Me
            </span>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${textColor}`}>
              Turning Ideas Into{' '}
              <span className={`bg-gradient-to-r ${headingGradient} bg-clip-text text-transparent`}>
                Digital Reality
              </span>
            </h2>
            <div className={`space-y-4 leading-relaxed text-sm sm:text-base ${mutedText}`}>
              <p>Hi! I'm Guruvishnu S, a BSc IT student and passionate Full Stack Developer with a strong foundation in modern web technologies and programming languages.</p>
              <p>I'm currently open to internships and freelance opportunities where I can contribute while continuing to grow. I love tackling complex problems and turning them into elegant, user-friendly solutions.</p>
              <p>When not coding, you'll find me exploring new tech, contributing to open-source, or sharpening skills on competitive programming platforms.</p>
            </div>
          </motion.div>

          {/* Quick stats cards */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
            className="grid grid-cols-2 gap-4">
            {[
              
              { value: '2024', label: 'Started College', sub: 'BSc IT @ KPRCAS' },
              
              { value: '100%', label: 'Open to Work', sub: 'Internships & Freelance' },
            ].map((item, i) => (
              <motion.div key={i} custom={i} variants={fadeUp} initial="hidden" whileInView="visible"
                viewport={{ once: true }}
                className={`border rounded-2xl p-5 sm:p-6 transition-all ${cardBg}`}>
                <p className={`text-2xl sm:text-3xl font-bold mb-1 ${iconColor}`}>{item.value}</p>
                <p className={`text-sm font-semibold ${textColor}`}>{item.label}</p>
                <p className={`text-xs mt-1 ${mutedText}`}>{item.sub}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Skills by category */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className={`text-2xl sm:text-3xl font-bold mb-10 text-center ${textColor}`}>
            Technical{' '}
            <span className={`bg-gradient-to-r ${headingGradient} bg-clip-text text-transparent`}>Skills</span>
          </h3>

          <div className="space-y-10">
            {skillCategories.map((cat, ci) => (
              <div key={cat.category}>
                <p className={`text-xs font-bold tracking-widest uppercase mb-4 border-b pb-2 ${categoryLabel}`}>
                  {cat.category}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {cat.skills.map((skill, si) => (
                    <motion.div key={skill.name}
                      custom={ci * 4 + si} variants={fadeUp} initial="hidden" whileInView="visible"
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className={`border rounded-xl p-4 sm:p-5 flex flex-col items-center gap-3 cursor-default transition-all ${cardBg}`}>
                      <skill.icon size={30} weight="duotone" className={iconColor} />
                      <span className={`text-sm font-medium text-center ${textColor}`}>{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
