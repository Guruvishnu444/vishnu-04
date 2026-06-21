import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

const timelineData = [
  { id: 1, title: 'Schooling', institution: 'Kongu Vellalar Matriculation Higher Secondary School, Karumathampatti.', period: '2021 – 2024', description: 'Scored 72% in 10th and 83.8% in 12th standard.' },
  { id: 2, title: 'BSc. Information Technology', institution: 'KPR College of Arts, Science and Research (KPRCAS), Uthupalayam.', period: '2024 – Present', description: 'CGPA — Coming soon.' },
]

export default function Journey() {
  const { dark } = useTheme()
  const c = getColors(dark)
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.3'],
  })
  // The vertical line literally grows as you scroll through this section —
  // this is the "draws itself" motion-led behavior, not a generic fade-in.
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="journey" ref={sectionRef} className="relative py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="mb-14">
          <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: c.textPrimary }}>
            My <span style={{ color: c.accent }}>Journey</span>
          </h2>
          <p className="text-sm sm:text-base" style={{ color: c.textSecondary }}>
            The milestones that brought me here.
          </p>
        </motion.div>

        <div className="relative pl-8 sm:pl-10">
          {/* Track (static, faint) */}
          <div className="absolute left-0 top-0 bottom-0 w-px" style={{ backgroundColor: c.cardBorder }} />
          {/* Progress line — grows with scroll */}
          <motion.div
            className="absolute left-0 top-0 w-px origin-top"
            style={{ height: lineHeight, backgroundColor: c.accent, boxShadow: `0 0 8px ${c.accent}` }}
          />

          {timelineData.map((item, index) => (
            <motion.div key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative mb-12 last:mb-0"
            >
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.15, type: 'spring', stiffness: 300 }}
                className="absolute -left-[34px] sm:-left-[42px] top-1 w-3 h-3 rounded-full"
                style={{ backgroundColor: c.accent, boxShadow: `0 0 10px ${c.accent}` }}
              />
              <div className="border rounded-2xl p-5 sm:p-6" style={{ backgroundColor: c.card, borderColor: c.cardBorder }}>
                <h3 className="font-bold text-base sm:text-lg mb-1" style={{ color: c.textPrimary }}>{item.title}</h3>
                <p className="font-semibold text-sm mb-1" style={{ color: c.accent }}>{item.institution}</p>
                <p className="text-sm mb-3" style={{ color: c.textSecondary }}>{item.period}</p>
                <p className="text-sm leading-relaxed" style={{ color: c.textSecondary }}
                  dangerouslySetInnerHTML={{ __html: item.description.replace(/(\d+\.?\d*%|\d+\.\d+)/g, '<strong>$1</strong>') }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
