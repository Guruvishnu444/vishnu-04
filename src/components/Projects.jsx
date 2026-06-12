import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeContext'

function SkeletonCard({ dark }) {
  const shimmer = dark ? 'bg-white/10' : 'bg-black/10'
  return (
    <div className={`flex-shrink-0 w-[340px] border rounded-2xl overflow-hidden ${dark ? 'border-white/10' : 'border-black/10'}`}>
      <div className={`h-48 ${shimmer} animate-pulse`} />
      <div className="p-5 space-y-3">
        <div className={`h-4 w-24 rounded ${shimmer} animate-pulse`} />
        <div className={`h-6 w-3/4 rounded ${shimmer} animate-pulse`} />
        <div className={`h-4 w-full rounded ${shimmer} animate-pulse`} />
      </div>
    </div>
  )
}

function ProjectCard({ project, dark }) {
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#2b2b2b]'
  const mutedText = dark ? 'text-[#f5f5f5]/60' : 'text-[#2b2b2b]/60'
  const cardBg = dark ? 'bg-white/5 border-white/10 hover:border-white/25' : 'bg-black/5 border-black/10 hover:border-black/25'
  const tagBg = dark ? 'bg-white/10 text-[#f5f5f5]/80' : 'bg-black/10 text-[#2b2b2b]/80'

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
      className={`flex-shrink-0 w-[320px] border rounded-2xl overflow-hidden transition-all ${cardBg}`}>
      {project.image && (
        <div className="h-44 overflow-hidden">
          <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-5">
        <h3 className={`font-bold text-lg mb-2 ${textColor}`}>{project.title}</h3>
        <p className={`text-sm mb-4 leading-relaxed ${mutedText}`}>{project.description}</p>
        {project.tags && (
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => (
              <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${tagBg}`}>{tag}</span>
            ))}
          </div>
        )}
      </div>
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

  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#2b2b2b]'
  const badgeBg = dark ? 'bg-purple-400/10 text-purple-400' : 'bg-purple-500/10 text-purple-600'

  useEffect(() => {
    fetch('./projects.json').then(r => r.json()).then(d => setProjects(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    scrollRef.current.scrollLeft = scrollLeft - (e.pageX - scrollRef.current.offsetLeft - startX) * 1.5
  }

  return (
    <section id="projects" className="relative py-24 px-6" aria-label="Projects section">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="text-center mb-12">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${badgeBg}`}>
            Portfolio
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textColor}`}>
            Upcoming{' '}
            <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">Projects</span>
          </h2>
        </motion.div>

        <div ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={handleMouseMove}
          className={`flex gap-6 overflow-x-auto pb-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} dark={dark} />)
            : projects.map((p, i) => <ProjectCard key={p.id || i} project={p} dark={dark} />)
          }
        </div>
        <div className={`flex items-center justify-center gap-2 mt-4 text-sm ${dark ? 'text-[#f5f5f5]/40' : 'text-[#2b2b2b]/40'}`}>
          <span>Drag to scroll</span>
          <span className="animate-pulse">→</span>
        </div>
      </div>
    </section>
  )
}

export default Projects
