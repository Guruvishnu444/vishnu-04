import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../ThemeContext'

function SkeletonCard({ dark }) {
  const shimmer = dark ? 'bg-white/10' : 'bg-black/10'
  const border = dark ? 'border-white/10' : 'border-black/10'
  return (
    <div className={`flex-shrink-0 w-[600px] border rounded-2xl overflow-hidden ${border}`}>
      <div className={`h-80 ${shimmer} animate-pulse`} />
      <div className="p-6 space-y-3">
        <div className={`h-6 w-3/4 rounded ${shimmer} animate-pulse`} />
        <div className={`h-4 w-full rounded ${shimmer} animate-pulse`} />
        <div className={`h-4 w-2/3 rounded ${shimmer} animate-pulse`} />
      </div>
    </div>
  )
}

function ProjectCard({ project, dark, index }) {
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/60' : 'text-[#1a1a1a]/60'
  const cardBg = dark ? 'bg-white/5 border-white/10 hover:border-orange-500/30' : 'bg-black/4 border-black/10 hover:border-violet-400/30'
  const tagBg = dark ? 'bg-orange-500/15 text-orange-300' : 'bg-violet-400/15 text-violet-600'
  const linkColor = dark ? 'text-orange-400 hover:text-orange-300' : 'text-violet-500 hover:text-violet-600'
  const placeholderBg = dark ? 'bg-gradient-to-br from-red-600/20 to-orange-500/20' : 'bg-gradient-to-br from-blue-400/20 via-pink-400/20 to-violet-500/20'
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.2,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      className={`flex-shrink-0 w-[600px] max-w-full border-2 rounded-2xl overflow-hidden transition-all ${cardBg} shadow-xl`}>
      <motion.div 
        className="h-80 overflow-hidden bg-black/5 relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.4 }}>
        {project.image ? (
          <motion.img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-contain"
            initial={{ scale: 1.1, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${placeholderBg}`}>
            <motion.span 
              className={`text-6xl font-bold ${textColor} opacity-50`}
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}>
              💰
            </motion.span>
          </div>
        )}
      </motion.div>
      <motion.div 
        className="p-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <motion.h3 
          className={`font-bold text-xl mb-3 ${textColor}`}
          whileHover={{ x: 5 }}
          transition={{ type: "spring", stiffness: 300 }}>
          {project.title}
        </motion.h3>
        <p className={`text-base mb-5 leading-relaxed ${mutedText}`}>{project.description}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.map((tag, i) => (
              <motion.span 
                key={tag} 
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${tagBg}`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: 0.4 + (i * 0.1),
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.15,
                  rotate: [-2, 2, -2, 0],
                  transition: { duration: 0.3 }
                }}>
                {tag}
              </motion.span>
            ))}
          </div>
        )}
        {project.link && (
          <motion.a 
            href={project.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-base font-semibold transition-colors ${linkColor}`}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400 }}>
            Visit Project 
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}>
              →
            </motion.span>
          </motion.a>
        )}
      </motion.div>
    </motion.div>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const { dark } = useTheme()

  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const badgeBg = dark ? 'bg-orange-500/10 text-orange-400' : 'bg-pink-400/10 text-pink-500'
  const gradient = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
  const dragHint = dark ? 'text-[#f5f5f5]/35' : 'text-[#1a1a1a]/35'

  useEffect(() => {
    fetch('./projects.json').then(r => r.json()).then(d => setProjects(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <section id="projects" className="relative py-24 px-6" aria-label="Projects section">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${badgeBg}`}>
            Portfolio
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textColor}`}>
            My{' '}
            <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>Projects</span>
          </h2>
        </motion.div>
        <div ref={scrollRef}
          onMouseDown={e => { setIsDragging(true); setStartX(e.pageX - scrollRef.current.offsetLeft); setScrollLeft(scrollRef.current.scrollLeft) }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={e => { if (!isDragging) return; e.preventDefault(); scrollRef.current.scrollLeft = scrollLeft - (e.pageX - scrollRef.current.offsetLeft - startX) * 1.5 }}
          className={`flex gap-6 overflow-x-auto pb-6 ${projects.length > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'justify-center'}`}
          style={{ scrollbarWidth: 'none' }}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {loading
            ? Array.from({ length: 1 }).map((_, i) => <SkeletonCard key={i} dark={dark} />)
            : projects.map((p, i) => <ProjectCard key={p.id || i} project={p} dark={dark} index={i} />)}
        </div>
        {projects.length > 1 && <p className={`text-center text-sm mt-4 ${dragHint}`}>Drag to scroll →</p>}
      </div>
    </section>
  )
}

export default Projects
