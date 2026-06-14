import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowSquareOut, GithubLogo, X, ArrowRight } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

const statusColors = {
  'Live': 'bg-green-500/20 text-green-400',
  'In Progress': 'bg-orange-500/20 text-orange-400',
  'Planned': 'bg-blue-500/20 text-blue-400',
}

function CaseStudyModal({ project, onClose, dark }) {
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/65' : 'text-[#1a1a1a]/65'
  const modalBg = dark ? 'bg-[#111] border-white/10' : 'bg-white border-black/10'
  const rowBg = dark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
  const gradient = dark ? 'from-red-500 to-orange-400' : 'from-blue-400 to-violet-500'
  const tagBg = dark ? 'bg-orange-500/15 text-orange-300' : 'bg-violet-400/15 text-violet-600'

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        className={`relative z-10 w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl ${modalBg}`}>
        <button onClick={onClose}
          className={`absolute top-4 right-4 p-1 rounded-lg transition-colors ${dark ? 'text-white/50 hover:text-white' : 'text-black/40 hover:text-black'}`}>
          <X size={22} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusColors[project.status] || 'bg-gray-500/20 text-gray-400'}`}>
            {project.status}
          </span>
          <h3 className={`text-xl font-bold ${textColor}`}>{project.title}</h3>
        </div>

        <div className="space-y-4 mb-6">
          {[
            { label: '🔍 Problem', text: project.problem },
            { label: '⚡ Action', text: project.action },
            { label: '✅ Result', text: project.result },
          ].map(row => (
            <div key={row.label} className={`border rounded-xl p-4 ${rowBg}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-2 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {row.label}
              </p>
              <p className={`text-sm leading-relaxed ${mutedText}`}>{row.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags?.map(tag => (
            <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${tagBg}`}>{tag}</span>
          ))}
        </div>

        <div className="flex gap-3">
          {project.liveLink && project.liveLink !== '#' && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${gradient}`}>
              <ArrowSquareOut size={16} /> Live Demo
            </a>
          )}
          {project.githubLink && project.githubLink !== '#' && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border transition-all ${dark ? 'border-white/15 text-white hover:border-white/40' : 'border-black/15 text-black hover:border-black/40'}`}>
              <GithubLogo size={16} /> GitHub
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({ project, dark, onClick }) {
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/60' : 'text-[#1a1a1a]/60'
  const cardBg = dark
    ? 'bg-white/5 border-white/10 hover:border-orange-500/50'
    : 'bg-black/[0.03] border-black/10 hover:border-violet-400/50'
  const tagBg = dark ? 'bg-orange-500/15 text-orange-300' : 'bg-violet-400/15 text-violet-600'
  const gradient = dark ? 'from-red-500 to-orange-400' : 'from-blue-400 to-violet-500'

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}
      className={`flex-shrink-0 w-[300px] sm:w-[340px] border rounded-2xl overflow-hidden transition-all cursor-pointer ${cardBg}`}
      onClick={() => onClick(project)}>

      {/* Color header strip */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className={`font-bold text-lg leading-tight ${textColor}`}>{project.title}</h3>
          <span className={`ml-2 flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full ${statusColors[project.status] || 'bg-gray-500/20 text-gray-400'}`}>
            {project.status}
          </span>
        </div>

        <p className={`text-sm mb-5 leading-relaxed line-clamp-3 ${mutedText}`}>{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags?.map(tag => (
            <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-medium ${tagBg}`}>{tag}</span>
          ))}
        </div>

        <button className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity`}>
          View Case Study <ArrowRight size={15} />
        </button>
      </div>
    </motion.div>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const { dark } = useTheme()

  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const badgeBg = dark ? 'bg-orange-500/10 text-orange-400' : 'bg-pink-400/10 text-pink-500'
  const gradient = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'

  useEffect(() => {
    fetch('./projects.json').then(r => r.json()).then(d => setProjects(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const SkeletonCard = () => {
    const shimmer = dark ? 'bg-white/10' : 'bg-black/10'
    const border = dark ? 'border-white/10' : 'border-black/10'
    return (
      <div className={`flex-shrink-0 w-[300px] sm:w-[340px] border rounded-2xl overflow-hidden ${border}`}>
        <div className={`h-2 ${shimmer}`} />
        <div className="p-6 space-y-3">
          <div className={`h-6 w-3/4 rounded-lg ${shimmer} animate-pulse`} />
          <div className={`h-4 w-full rounded ${shimmer} animate-pulse`} />
          <div className={`h-4 w-2/3 rounded ${shimmer} animate-pulse`} />
        </div>
      </div>
    )
  }

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6" aria-label="Projects section">
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
          <p className={`mt-3 text-sm sm:text-base ${dark ? 'text-[#f5f5f5]/50' : 'text-[#1a1a1a]/50'}`}>
            Click any card to see the full case study
          </p>
        </motion.div>

        <div ref={scrollRef}
          onMouseDown={e => { setIsDragging(true); setStartX(e.pageX - scrollRef.current.offsetLeft); setScrollLeft(scrollRef.current.scrollLeft) }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={e => { if (!isDragging) return; e.preventDefault(); scrollRef.current.scrollLeft = scrollLeft - (e.pageX - scrollRef.current.offsetLeft - startX) * 1.5 }}
          className={`flex gap-6 overflow-x-auto pb-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none' }}>
          <style>{`div::-webkit-scrollbar{display:none}`}</style>
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : projects.map((p, i) => (
                <motion.div key={p.id || i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}>
                  <ProjectCard project={p} dark={dark} onClick={setSelected} />
                </motion.div>
              ))}
        </div>
        <p className={`text-center text-xs sm:text-sm mt-4 ${dark ? 'text-[#f5f5f5]/30' : 'text-[#1a1a1a]/30'}`}>
          ← Drag to scroll →
        </p>
      </div>

      {/* Case study modal */}
      <AnimatePresence>
        {selected && (
          <CaseStudyModal project={selected} onClose={() => setSelected(null)} dark={dark} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
