import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const timelineData = [
  {
    id: 1,
    title: 'Schooling',
    institution: 'Kongu Vellalar Matriculation Higher Secondary School, Karumathampatti.',
    period: '2021 - 2024',
    description: 'Scored 72% in 10th and 83.8% in 12th standard.',
    side: 'left',
  },
  {
    id: 2,
    title: 'BSc. Information Technology',
    institution: 'KPR College of Arts, Science and Research (KPRCAS), Uthupalayam.',
    period: '2024 - Present',
    description: '',
    side: 'right',
  },
]

function TimelineCard({ item, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const isLeft = item.side === 'left'

  return (
    <div className="relative flex items-center justify-center w-full mb-20">
      {/* Card */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: index * 0.15 }}
        className={`w-[44%] ${isLeft ? 'mr-auto pr-10' : 'ml-auto pl-10'}`}
      >
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
          <h3 className="text-off-white font-bold text-lg mb-2">{item.title}</h3>
          <p className="font-semibold text-sm mb-1" style={{ color: '#BFA181' }}>
            {item.institution}
          </p>
          <p className="text-off-white/40 text-sm mb-3">{item.period}</p>
          <p
            className="text-off-white/70 text-sm leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: item.description.replace(
                /(\d+\.?\d*%|\d+\.\d+)/g,
                '<strong>$1</strong>'
              ),
            }}
          />
        </div>
      </motion.div>

      {/* Center dot */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white/60 bg-transparent z-10"
      />
    </div>
  )
}

function Journey() {
  const headingRef = useRef(null)
  const headingInView = useInView(headingRef, { once: true })

  return (
    <section id="journey" className="relative py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-off-white mb-4">
            My{' '}
            <span className="gradient-text">Journey & Education</span>
          </h2>
          <p className="text-off-white/50 text-lg max-w-xl mx-auto">
            Milestones and roles that have shaped my expertise and perspective.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical center line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/10" />

          {timelineData.map((item, index) => (
            <TimelineCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Journey
