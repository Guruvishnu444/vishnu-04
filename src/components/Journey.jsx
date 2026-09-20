import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useTheme } from '../ThemeContext';
import { sectionVariants, timelineVariants, useScrollAnimation } from '../utils/animations';

const timeline = [
  {
    id: 1,
    year: '2021 - 2024',
    title: 'Schooling',
    institution: 'Kongu Vellalar Matriculation Higher Secondary School',
    location: 'Karumathampatti',
    description: 'Scored 72% in 10th and 83.8% in 12th standard.',
    status: 'completed',
  },
  {
    id: 2,
    year: '2024 - Present',
    title: 'BSc. Information Technology',
    institution: 'KPR College of Arts, Science and Research (KPRCAS)',
    location: 'Uthupalayam',
    description: 'CGPA — 7.5',
    status: 'current',
  },
];

export default function Journey() {
  const { dark } = useTheme();
  const scrollAnim = useScrollAnimation();
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="journey" className="relative py-20 sm:py-32 px-4 sm:px-6" ref={containerRef}>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div {...scrollAnim} variants={sectionVariants} className="mb-12 sm:mb-16 px-4 sm:px-0">
          <motion.h2 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Milestones and roles that have shaped my expertise and perspective.
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl ml-4 sm:ml-8">
          {/* Timeline line with more space */}
          <div className={`absolute left-0 md:left-12 top-0 bottom-0 w-px ${dark ? 'bg-white/10' : 'bg-slate-300'}`}>
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-red-500"
            />
          </div>

          {/* Timeline items */}
          <div className="space-y-10 sm:space-y-12 md:space-y-16">
            {timeline.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={timelineVariants}
                className="relative flex items-start pl-8 sm:pl-12 md:pl-32"
              >
                {/* Timeline dot with glow */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                    delay: 0.2 
                  }}
                  className="absolute left-0 md:left-12 -translate-x-1/2 top-2"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-4 relative ${
                      item.status === 'current'
                        ? 'bg-red-500 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]'
                        : 'bg-red-400 border-red-400 shadow-[0_0_15px_rgba(248,113,113,0.6)]'
                    }`}
                  >
                    {/* Additional glow ring */}
                    <div className={`absolute inset-0 rounded-full ${
                      item.status === 'current' 
                        ? 'animate-ping bg-red-500 opacity-75' 
                        : ''
                    }`} />
                  </div>
                </motion.div>

                {/* Content card */}
                <motion.div
                  whileHover={{ 
                    x: 8,
                    transition: { duration: 0.2 }
                  }}
                  className={`flex-1 p-4 sm:p-6 rounded-xl transition-all duration-300 ${
                    dark 
                      ? 'bg-slate-900/30 border border-slate-800 hover:border-slate-700' 
                      : 'bg-white/50 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Year and Status */}
                  <motion.div 
                    className="flex items-center gap-3 mb-3 flex-wrap"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className={`text-sm font-mono tracking-wider ${dark ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {item.year}
                    </span>
                    {item.status === 'current' && (
                      <motion.span 
                        className={`px-3 py-1 rounded-full text-xs font-mono tracking-widest ${
                          dark ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: 0.4 
                        }}
                      >
                        CURRENT
                      </motion.span>
                    )}
                  </motion.div>

                  <motion.h3 
                    className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 ${dark ? 'text-white' : 'text-slate-900'}`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.25 }}
                  >
                    {item.title}
                  </motion.h3>
                  
                  <motion.p 
                    className={`text-base font-medium mb-1 ${dark ? 'text-slate-300' : 'text-slate-700'}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                  >
                    {item.institution}
                  </motion.p>
                  
                  <motion.p 
                    className={`text-sm mb-3 ${dark ? 'text-slate-500' : 'text-slate-500'}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35 }}
                  >
                    {item.location}
                  </motion.p>
                  
                  <motion.p 
                    className={`text-base leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                  >
                    {item.description}
                  </motion.p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
