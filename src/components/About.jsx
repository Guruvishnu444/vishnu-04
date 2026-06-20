import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../ThemeContext'

// ── Skills radar/orbit layout ─────────────────────────────
// Concentric circle grid with skill icons placed in a 3x3-ish
// orbit pattern around a center point, matching the reference image.

const skills = [
  { name: 'React', label: 'React', angle: 0,    ring: 2, glyph: 'react' },
  { name: 'JavaScript', label: 'JS', angle: 45,  ring: 2, glyph: 'js' },
  { name: 'Figma', label: 'Figma', angle: 90,    ring: 1, glyph: 'figma' },
  { name: 'Vercel', label: '∧', angle: 135,      ring: 2, glyph: 'vercel' },
  { name: 'Git', label: 'Git', angle: 180,       ring: 1, glyph: 'git' },
  { name: 'TypeScript', label: 'TS', angle: 225, ring: 1, glyph: 'ts' },
  { name: 'AWS', label: 'aws', angle: 270,       ring: 2, glyph: 'aws' },
  { name: 'GitHub', label: 'GitHub', angle: 315, ring: 2, glyph: 'github' },
  { name: 'HTML5', label: '5', angle: 22,        ring: 3, glyph: 'html' },
  { name: 'CSS3', label: '3', angle: 158,        ring: 3, glyph: 'css' },
]

function Glyph({ type }) {
  const props = { viewBox: '0 0 24 24', fill: 'currentColor', className: 'w-6 h-6' }
  switch (type) {
    case 'react':
      return <svg {...props}><path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zM12 2.5c5.247 0 9.5 4.253 9.5 9.5s-4.253 9.5-9.5 9.5S2.5 17.247 2.5 12 6.753 2.5 12 2.5zm0 1.5C7.582 4 4 7.582 4 12s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"/></svg>
    case 'js':
      return <span className="font-black text-sm">JS</span>
    case 'ts':
      return <span className="font-black text-sm">TS</span>
    case 'figma':
      return <svg {...props}><path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM8.148 8.981c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981H8.148zm0 1.471h4.588v8.981H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.491 4.49-4.491zm7.704 8.981h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.39 4.49z"/></svg>
    case 'vercel':
      return <svg {...props}><path d="M24 22.525H0l12-21.05 12 21.05z"/></svg>
    case 'git':
      return <svg {...props}><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>
    case 'aws':
      return <span className="font-bold text-[10px] tracking-wide">aws</span>
    case 'github':
      return <svg {...props}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    case 'html':
      return <span className="font-bold text-sm">5</span>
    case 'css':
      return <span className="font-bold text-sm">3</span>
    default:
      return null
  }
}

function OrbitIcon({ skill, dark, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  // ring radius as a % of container half-width (container is square)
  const ringPercent = { 1: 30.5, 2: 57.5, 3: 82.5 }[skill.ring]
  const rad = (skill.angle * Math.PI) / 180
  const x = Math.cos(rad) * ringPercent
  const y = Math.sin(rad) * ringPercent

  const iconBg = dark ? 'rgba(0,240,255,0.06)' : 'rgba(10,26,58,0.04)'
  const iconBorder = dark ? 'rgba(0,240,255,0.18)' : 'rgba(10,26,58,0.14)'
  const iconColor = dark ? '#00F0FF' : '#0A1A3A'

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: index * 0.06, duration: 0.5, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.18 }}
      className="absolute flex items-center justify-center rounded-2xl border backdrop-blur-sm cursor-default"
      style={{
        left: `calc(50% + ${x}%)`,
        top: `calc(50% + ${y}%)`,
        transform: 'translate(-50%, -50%)',
        width: 'clamp(38px, 10.5vw, 56px)',
        height: 'clamp(38px, 10.5vw, 56px)',
        backgroundColor: iconBg,
        borderColor: iconBorder,
        color: iconColor,
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
  const lineColor = dark ? 'rgba(0,240,255,0.1)' : 'rgba(10,26,58,0.08)'
  return (
    <svg className="absolute inset-0 w-full h-full" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid meet">
      {[30.5, 57.5, 82.5].map(r => (
        <circle key={r} cx="0" cy="0" r={r} fill="none" stroke={lineColor} strokeWidth="0.4" />
      ))}
      <line x1="-100" y1="0" x2="100" y2="0" stroke={lineColor} strokeWidth="0.4" />
      <line x1="0" y1="-100" x2="0" y2="100" stroke={lineColor} strokeWidth="0.4" />
      <line x1="-70" y1="-70" x2="70" y2="70" stroke={lineColor} strokeWidth="0.4" />
      <line x1="-70" y1="70" x2="70" y2="-70" stroke={lineColor} strokeWidth="0.4" />
    </svg>
  )
}

function About() {
  const { dark } = useTheme()
  const textColor = dark ? '#00F0FF' : '#0A1A3A'
  const mutedText = dark ? 'rgba(0,240,255,0.65)' : 'rgba(10,26,58,0.65)'
  const accent = dark ? '#FFFFFF' : '#00F0FF'

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6" aria-label="About section">
      <div className="max-w-6xl mx-auto">

        {/* Bio */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ backgroundColor: dark ? 'rgba(0,240,255,0.1)' : 'rgba(0,200,220,0.12)', color: accent }}>
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-black mb-5" style={{ color: textColor }}>
            Turning Ideas Into <span style={{ color: accent }}>Digital Reality</span>
          </h2>
          <p className="leading-relaxed text-sm sm:text-base" style={{ color: mutedText }}>
           

           <p>Hello! I'm Guru Vishnu, a motivated BSc Information Technology student from Puducherry, India, with a passion for building practical web solutions. I'm currently pursuing my degree at KPR College of Arts, Science and Research, where I'm developing strong foundations in full-stack web development.</p>

             <p>I specialize in front-end development using HTML, CSS, and JavaScript, and I'm actively expanding my skills into back-end technologies including the MERN stack (MongoDB, Express, React, Node.js). My development toolkit includes Visual Studio Code for coding and GitHub for version control and portfolio hosting.</p>

              <p>As an aspiring full-stack developer, I'm dedicated to creating clean, efficient, and user-friendly web applications. I'm currently seeking internship opportunities where I can contribute my skills while learning from experienced professionals in the industry.</p>

                  <p>Beyond coding, I'm passionate about continuous learning through certification courses from platforms like IBM Skill Build, Udemy, Coursera, and LinkedIn Learning. I also maintain a balanced lifestyle with fitness workouts and enjoy Tamil music and movies.</p>

                   <p>I'm always excited to connect with fellow developers, explore new technologies, and collaborate on meaningful projects. Feel free to reach out through LinkedIn or email to discuss potential opportunities!</p>

                     <p><strong>Let's build something amazing together!</strong></p>
                       </p>
        </motion.div>

        {/* ── Skills radar/orbit ── */}
        <div className="mb-6 text-center">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-1" style={{ color: textColor }}>
            Technical <span style={{ color: accent }}>Skills</span>
          </h3>
          <p className="text-sm" style={{ color: mutedText }}>The tech I orbit around daily.</p>
        </div>

        <div
          className="relative mx-auto"
          style={{
            width: 'min(520px, 92vw)',
            height: 'min(520px, 92vw)',
            maxWidth: '100%',
          }}
        >
          {/* glow center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full blur-3xl"
              style={{
                width: 'clamp(100px, 34vw, 180px)',
                height: 'clamp(100px, 34vw, 180px)',
                background: dark
                  ? 'radial-gradient(circle, rgba(0,240,255,0.25), transparent 70%)'
                  : 'radial-gradient(circle, rgba(0,200,220,0.18), transparent 70%)',
              }}
            />
          </div>

          <RadarGrid dark={dark} />

          {/* center node */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center font-black"
            style={{
              width: 'clamp(44px, 12vw, 64px)',
              height: 'clamp(44px, 12vw, 64px)',
              fontSize: 'clamp(11px, 2.6vw, 14px)',
              backgroundColor: dark ? '#00F0FF' : '#0A1A3A',
              color: dark ? '#000000' : '#FFFFFF',
              boxShadow: dark ? '0 0 40px rgba(0,240,255,0.5)' : '0 0 30px rgba(10,26,58,0.3)',
            }}
          >
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

export default About
