import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

const skills = [
  { name: 'React', angle: 0,   ring: 2, glyph: 'react' },
  { name: 'JavaScript', angle: 40, ring: 2, glyph: 'js' },
  { name: 'Node.js', angle: 80, ring: 1, glyph: 'node' },
  { name: 'MongoDB', angle: 120, ring: 2, glyph: 'mongo' },
  { name: 'Git', angle: 160, ring: 1, glyph: 'git' },
  { name: 'HTML5', angle: 200, ring: 1, glyph: 'html' },
  { name: 'CSS3', angle: 240, ring: 2, glyph: 'css' },
  { name: 'GitHub', angle: 280, ring: 2, glyph: 'github' },
  { name: 'Express', angle: 320, ring: 3, glyph: 'express' },
  { name: 'VS Code', angle: 20, ring: 3, glyph: 'vscode' },
]

function Glyph({ type }) {
  const p = { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-6 h-6' }
  switch (type) {
    case 'react': return <svg {...p}><path d="M14.23 12a2.23 2.23 0 1 1-4.46 0 2.23 2.23 0 0 1 4.46 0zM12 2.5c5.25 0 9.5 4.25 9.5 9.5s-4.25 9.5-9.5 9.5S2.5 17.25 2.5 12 6.75 2.5 12 2.5zm0 1.5C7.58 4 4 7.58 4 12s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8z" /></svg>
    case 'js': return <span className="font-black text-sm">JS</span>
    case 'node': return <svg {...p}><path d="M12 21.985c-.275 0-.532-.074-.772-.202l-2.439-1.448c-.365-.203-.182-.277-.072-.314.496-.165.588-.201 1.101-.493.056-.027.129-.018.185.018l1.87 1.12c.074.036.166.036.226 0l7.319-4.237c.074-.036.11-.11.11-.202V7.768a.235.235 0 0 0-.11-.201l-7.317-4.219a.276.276 0 0 0-.227 0L4.552 7.566a.234.234 0 0 0-.11.201v8.457c0 .074.036.166.11.201l1.998 1.157c1.082.548 1.762-.095 1.762-.737V8.502c0-.117.092-.227.227-.227h.965c.119 0 .227.092.227.227v8.343c0 1.448-.79 2.299-2.163 2.299-.422 0-.752 0-1.688-.46l-1.925-1.099a1.55 1.55 0 0 1-.766-1.339V7.768c0-.55.293-1.064.766-1.339l7.317-4.237a1.605 1.605 0 0 1 1.535 0l7.317 4.237c.473.275.766.789.766 1.339v8.457c0 .549-.293 1.063-.766 1.339l-7.317 4.237a1.6 1.6 0 0 1-.789.2z" /></svg>
    case 'mongo': return <span className="font-black text-xs">DB</span>
    case 'git': return <svg {...p}><path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.658 2.66a1.838 1.838 0 1 1-1.105 1.704l-2.479-2.479v6.525a1.838 1.838 0 1 1-1.514-.054V8.835a1.838 1.838 0 0 1-1-2.41L7.636 3.7.45 10.881a1.55 1.55 0 0 0 0 2.189l10.48 10.477a1.55 1.55 0 0 0 2.186 0l10.43-10.43a1.55 1.55 0 0 0 0-2.187" /></svg>
    case 'html': return <span className="font-bold text-sm">5</span>
    case 'css': return <span className="font-bold text-sm">3</span>
    case 'github': return <svg {...p}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
    case 'express': return <span className="font-black text-[10px]">EX</span>
    case 'vscode': return <svg {...p}><path d="M23.15 2.587L18.21.21a1.49 1.49 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a1 1 0 0 0-1.276.057L.327 7.261a1 1 0 0 0 0 1.478L3.9 12l-3.573 3.26a1 1 0 0 0 0 1.48l1.65 1.2a1 1 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.49 1.49 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352z" /></svg>
    default: return null
  }
}

function OrbitIcon({ skill, dark, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const c = getColors(dark)
  const ringPercent = { 1: 30, 2: 57, 3: 82 }[skill.ring]
  const rad = (skill.angle * Math.PI) / 180
  const x = Math.cos(rad) * ringPercent
  const y = Math.sin(rad) * ringPercent

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.18, borderColor: c.accent }}
      className="absolute flex items-center justify-center rounded-2xl border backdrop-blur-sm cursor-default"
      style={{
        left: `calc(50% + ${x}%)`,
        top: `calc(50% + ${y}%)`,
        transform: 'translate(-50%, -50%)',
        width: 'clamp(38px, 10.5vw, 56px)',
        height: 'clamp(38px, 10.5vw, 56px)',
        backgroundColor: c.card,
        borderColor: c.cardBorder,
        color: c.accent,
      }}
      title={skill.name}
    >
      <div className="scale-75 sm:scale-100">
        <Glyph type={skill.glyph} />
      </div>
    </motion.div>
  )
}

function RadarGrid({ dark }) {
  const c = getColors(dark)
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet">
      {[30, 57, 82].map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={c.cardBorder} strokeWidth="0.4" />
      ))}
      <line x1="-100" y1="0" x2="100" y2="0" stroke={c.cardBorder} strokeWidth="0.4" />
      <line x1="0" y1="-100" x2="0" y2="100" stroke={c.cardBorder} strokeWidth="0.4" />
      <line x1="-70" y1="-70" x2="70" y2="70" stroke={c.cardBorder} strokeWidth="0.4" />
      <line x1="-70" y1="70" x2="70" y2="-70" stroke={c.cardBorder} strokeWidth="0.4" />
    </svg>
  )
}

const bioParagraphs = [
  "Hello! I'm Guru Vishnu, a motivated BSc Information Technology student from Puducherry, India, with a passion for building practical web solutions. I'm currently pursuing my degree at KPR College of Arts, Science and Research, developing strong foundations in full-stack web development.",
  "I specialize in front-end development with HTML, CSS, and JavaScript, while actively expanding into back-end technologies including the MERN stack. My toolkit includes Visual Studio Code for development and GitHub for version control.",
  "As an aspiring full-stack developer, I'm dedicated to building clean, efficient, user-friendly applications — and currently seeking internship opportunities where I can contribute while learning from experienced professionals.",
  "Beyond coding, I'm a continuous learner through certifications on IBM SkillBuild, Udemy, Coursera, and LinkedIn Learning. I also stay active with fitness and enjoy Tamil music and movies.",
]

export default function About() {
  const { dark } = useTheme()
  const c = getColors(dark)

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6" aria-label="About section">
      <div className="max-w-6xl mx-auto">

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4"
            style={{ backgroundColor: c.accentSoft, color: c.accent }}>
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-6" style={{ color: c.textPrimary }}>
            Turning Ideas Into <span style={{ color: c.accent }}>Digital Reality</span>
          </h2>

          <div className="space-y-4 text-left sm:text-center">
            {bioParagraphs.map((para, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="leading-relaxed text-sm sm:text-base"
                style={{ color: c.textSecondary }}>
                {para}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.5 }}
              className="leading-relaxed text-sm sm:text-base font-bold pt-2"
              style={{ color: c.accent }}>
              Let's build something amazing together!
            </motion.p>
          </div>
        </motion.div>

        {/* Skills radar */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-1" style={{ color: c.textPrimary }}>
            Technical <span style={{ color: c.accent }}>Skills</span>
          </h3>
          <p className="text-sm" style={{ color: c.textSecondary }}>The tech I work with daily.</p>
        </div>

        <div className="relative mx-auto" style={{ width: 'min(500px, 92vw)', height: 'min(500px, 92vw)' }}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="rounded-full blur-3xl"
              style={{
                width: 'clamp(100px, 34vw, 170px)', height: 'clamp(100px, 34vw, 170px)',
                background: `radial-gradient(circle, ${c.accent}40, transparent 70%)`,
              }} />
          </div>

          <RadarGrid dark={dark} />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-black"
            style={{
              width: 'clamp(44px, 12vw, 62px)', height: 'clamp(44px, 12vw, 62px)',
              fontSize: 'clamp(11px, 2.4vw, 13px)',
              backgroundColor: c.accent, color: dark ? c.bg : '#FFFFFF',
              boxShadow: `0 0 36px ${c.accent}80`,
            }}>
            GV
          </div>

          {skills.map((skill, i) => (
            <OrbitIcon key={skill.name} skill={skill} dark={dark} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
