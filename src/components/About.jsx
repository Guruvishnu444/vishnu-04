import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

const bioParagraphs = [
  "Hello! I'm Guru Vishnu, a motivated BSc Information Technology student from Puducherry, India, with a passion for building practical web solutions. I'm currently pursuing my degree at KPR College of Arts, Science and Research, developing strong foundations in full-stack web development.",
  "I specialize in front-end development with HTML, CSS, and JavaScript, while actively expanding into back-end technologies including the MERN stack. My toolkit includes Visual Studio Code for development and GitHub for version control.",
  "As an aspiring full-stack developer, I'm dedicated to building clean, efficient, user-friendly applications — and currently seeking internship opportunities where I can contribute while learning from experienced professionals.",
  "Beyond coding, I'm a continuous learner through certifications on IBM SkillBuild, Udemy, Coursera, and LinkedIn Learning. I also stay active with fitness and enjoy Tamil music and movies.",
]

// Honest, ranked — not decorative. This is the actual point: communicate
// strength hierarchy in under 3 seconds, not "look how it spins."
const skillGroups = [
  {
    label: 'Confident',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub'],
  },
  {
    label: 'Actively learning',
    skills: ['React', 'Node.js', 'Express', 'MongoDB'],
  },
  {
    label: 'Familiar',
    skills: ['Python', 'C', 'C++'],
  },
]

function SkillRow({ group, index, dark }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const c = getColors(dark)

  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-b last:border-b-0 py-5"
      style={{ borderColor: c.cardBorder }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.accent }}>
        {group.label}
      </p>
      <div className="flex flex-wrap gap-2">
        {group.skills.map((skill, i) => (
          <motion.span key={skill}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
            className="px-3 py-1.5 rounded-lg text-sm font-medium"
            style={{ backgroundColor: c.accentSoft, color: c.textPrimary }}>
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

export default function About() {
  const { dark } = useTheme()
  const c = getColors(dark)

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6" aria-label="About section">
      <div className="max-w-3xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-14">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
            style={{ backgroundColor: c.accentSoft, color: c.accent }}>
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-6" style={{ color: c.textPrimary }}>
            Turning Ideas Into <span style={{ color: c.accent }}>Digital Reality</span>
          </h2>
          <div className="space-y-4">
            {bioParagraphs.map((para, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                className="leading-relaxed text-sm sm:text-base"
                style={{ color: c.textSecondary }}>
                {para}
              </motion.p>
            ))}
          </div>
        </motion.div>

        <div>
          <h3 className="text-xl sm:text-2xl font-black mb-1" style={{ color: c.textPrimary }}>
            Where I stand <span style={{ color: c.accent }}>today</span>
          </h3>
          <p className="text-sm mb-2" style={{ color: c.textSecondary }}>
            Honest skill levels — not everything is mastered, and that's fine at this stage.
          </p>
          {skillGroups.map((group, i) => (
            <SkillRow key={group.label} group={group} index={i} dark={dark} />
          ))}
        </div>
      </div>
    </section>
  )
}
