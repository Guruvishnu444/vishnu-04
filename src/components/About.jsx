import { motion } from 'framer-motion'
import { Code, FileHtml, FileCss, FileJs, Atom, BracketsAngle } from '@phosphor-icons/react'
import { useTheme } from './ThemeContext'

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
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#2b2b2b]'
  const mutedText = dark ? 'text-[#f5f5f5]/70' : 'text-[#2b2b2b]/70'
  const cardBg = dark ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-black/5 border-black/10 hover:border-black/20'
  const badgeBg = dark ? 'bg-sky-400/10 text-sky-400' : 'bg-sky-500/10 text-sky-600'

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
              <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">
                Digital Reality
              </span>
            </h2>
            <div className={`space-y-4 leading-relaxed ${mutedText}`}>
              <p>Hi! I'm Guruvishnu S, a passionate Full Stack Developer with a strong foundation in modern web technologies. I specialize in building responsive, user-friendly applications that deliver exceptional experiences.</p>
              <p>I'm currently open to internships and freelance opportunities where I can contribute my skills while continuing to grow as a developer. I love tackling complex problems and transforming them into simple, elegant solutions.</p>
              <p>When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharpening my problem-solving skills on competitive programming platforms.</p>
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
                    <skill.icon size={32} weight="duotone" className="text-sky-400" />
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
