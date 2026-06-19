import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTheme } from '../ThemeContext'

const timelineData = [
  { id: 1, title: 'Schooling', institution: 'Kongu Vellalar Matriculation Higher Secondary School, Karumathampatti.', period: '2021 - 2024', description: 'Scored 72% in 10th and 83.8% in 12th standard.', side: 'left' },
  { id: 2, title: 'BSc. Information Technology', institution: 'KPR College of Arts, Science and Research (KPRCAS), Uthupalayam.', period: '2024 - Present', description: 'CGPA — Coming soon.', side: 'right' },
]

function TimelineCard({ item, index, dark }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const isLeft = item.side === 'left'
  const textColor = dark ? '#00F0FF' : '#0A1A3A'
  const cardBg = dark ? 'rgba(0,240,255,0.04)' : 'rgba(10,26,58,0.03)'
  const cardBorder = dark ? 'rgba(0,240,255,0.15)' : 'rgba(10,26,58,0.12)'
  const accent = dark ? '#FFFFFF' : '#00F0FF'

  return (
    <div className="relative flex items-center justify-center w-full mb-20">
      <motion.div ref={ref}
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.15 }}
        className={`w-[44%] ${isLeft ? 'mr-auto pr-10' : 'ml-auto pl-10'}`}>
        <div className="border rounded-2xl p-6 transition-all duration-300"
          style={{ backgroundColor: cardBg, borderColor: cardBorder, color: textColor }}>
          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
          <p className="font-semibold text-sm mb-1" style={{ color: accent }}>{item.institution}</p>
          <p className="text-sm mb-3 opacity-50">{item.period}</p>
          <p className="text-sm leading-relaxed opacity-75"
            dangerouslySetInnerHTML={{ __html: item.description.replace(/(\d+\.?\d*%|\d+\.\d+)/g, '<strong>$1</strong>') }} />
        </div>
      </motion.div>
      <motion.div initial={{ scale: 0, opacity: 0 }} animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 bg-transparent z-10"
        style={{ borderColor: accent }} />
    </div>
  )
}

function Journey() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true })
  const { dark } = useTheme()
  const textColor = dark ? '#00F0FF' : '#0A1A3A'
  const accent = dark ? '#FFFFFF' : '#00F0FF'
  const lineColor = dark ? 'rgba(0,240,255,0.15)' : 'rgba(10,26,58,0.12)'

  return (
    <section id="journey" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div ref={headingRef} initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ color: textColor }}>
            My{' '}
            <span style={{ color: accent }}>Journey & Education</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto opacity-50" style={{ color: textColor }}>
            Milestones and roles that have shaped my expertise and perspective.
          </p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px" style={{ backgroundColor: lineColor }} />
          {timelineData.map((item, index) => <TimelineCard key={item.id} item={item} index={index} dark={dark} />)}
        </div>
      </div>
    </section>
  )
}

export default Journey
