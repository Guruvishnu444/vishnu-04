import { motion } from 'framer-motion'
import { Code, FileHtml, FileCss, FileJs, Atom, BracketsAngle } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

const skills = [
  { name: 'HTML5', icon: FileHtml },
  { name: 'CSS3', icon: FileCss },
  { name: 'JavaScript', icon: FileJs },
  { name: 'React', icon: Atom },
  { name: 'Python', icon: Code },
  { name: 'C', icon: BracketsAngle },
  { name: 'C++', icon: BracketsAngle },
  { name: 'Java', icon: Code },
]

function About() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/65' : 'text-[#1a1a1a]/65'
  const cardBg = dark ? 'bg-white/5 border-white/10 hover:border-orange-500/30' : 'bg-black/4 border-black/10 hover:border-violet-400/30'
  const badgeBg = dark ? 'bg-red-500/10 text-red-400' : 'bg-blue-400/10 text-blue-500'
  const headingGradient = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
  const iconColor = dark ? 'text-orange-400' : 'text-violet-500'

  return (
    <section id="about" className="relative py-24 px-6" aria-label="About section">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

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
            <div className={`space-y-4 leading-relaxed ${mutedText}`}>
              <p>Hi! I'm Guruvishnu S, a passionate Full Stack Developer with a strong foundation in modern web technologies.</p>
              <p>I'm currently open to internships and freelance opportunities where I can contribute my skills while continuing to grow as a developer.</p>
              <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharpening my problem-solving skills.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}>
            <div className={`border rounded-2xl p-6 sm:p-8 backdrop-blur-sm transition-all ${cardBg}`}>
              <h3 className={`text-xl font-semibold mb-6 ${textColor}`}>Technical Skills</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skills.map((skill, index) => (
                  <motion.div key={skill.name}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className={`border rounded-xl p-4 flex flex-col items-center gap-3 cursor-default transition-all ${cardBg}`}>
                    <skill.icon size={32} weight="duotone" className={iconColor} />
                    <span className={`text-sm font-medium ${textColor}`}>{skill.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default About
