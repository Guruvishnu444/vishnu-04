import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowSquareOut, GithubLogo, X, ArrowRight } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

const statusColors = {
  'Live': { bg: 'rgba(34,197,94,0.18)', text: '#4ade80' },
  'In Progress': { bg: 'rgba(245,158,11,0.18)', text: '#fbbf24' },
  'Planned': { bg: 'rgba(59,130,246,0.18)', text: '#60a5fa' },
}

function CaseStudyModal({ project, onClose, dark, accent, textColor }) {
  const modalBg = dark ? '#000000' : '#F8F9FA'
  const rowBg = dark ? 'rgba(0,240,255,0.05)' : 'rgba(10,26,58,0.04)'
  const rowBorder = dark ? 'rgba(0,240,255,0.12)' : 'rgba(10,26,58,0.1)'
  const tagBg = dark ? 'rgba(0,240,255,0.12)' : 'rgba(0,200,220,0.12)'
  const sc = statusColors[project.status] || { bg: 'rgba(120,120,120,0.2)', text: '#999' }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 200 }}
        onClick={e => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg rounded-2xl border p-5 sm:p-8 shadow-2xl max-h-[88vh] overflow-y-auto"
        style={{ backgroundColor: modalBg, borderColor: rowBorder }}>
        <button onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: textColor }}>
          <X size={22} />
        </button>

        <div className="flex items-center gap-3 mb-5 sm:mb-6 pr-8">
          <span className="text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
            style={{ backgroundColor: sc.bg, color: sc.text }}>
            {project.status}
          </span>
          <h3 className="text-lg sm:text-xl font-bold" style={{ color: textColor }}>{project.title}</h3>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
          {[
            { label: '🔍 Problem', text: project.problem },
            { label: '⚡ Action', text: project.action },
            { label: '✅ Result', text: project.result },
          ].map(row => (
            <div key={row.label} className="border rounded-xl p-4" style={{ backgroundColor: rowBg, borderColor: rowBorder }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                {row.label}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: textColor, opacity: 0.7 }}>{row.text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
          {project.tags?.map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tagBg, color: accent }}>{tag}</span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {project.liveLink && project.liveLink !== '#' && (
            <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: accent, color: dark ? '#000' : '#fff' }}>
              <ArrowSquareOut size={16} /> Live Demo
            </a>
          )}
          {project.githubLink && project.githubLink !== '#' && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ borderColor: rowBorder, color: textColor }}>
              <GithubLogo size={16} /> GitHub
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProjectCard({ project, dark, accent, textColor, onClick }) {
  const cardBorder = dark ? 'rgba(0,240,255,0.12)' : 'rgba(10,26,58,0.1)'
  const tagBg = dark ? 'rgba(0,240,255,0.1)' : 'rgba(0,200,220,0.1)'
  const sc = statusColors[project.status] || { bg: 'rgba(120,120,120,0.2)', text: '#999' }

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] border rounded-2xl overflow-hidden cursor-pointer transition-all"
      style={{ borderColor: cardBorder }}
      onClick={() => onClick(project)}>

      <div className="h-2" style={{ backgroundColor: accent }} />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between mb-3 gap-2">
          <h3 className="font-bold text-base sm:text-lg leading-tight" style={{ color: textColor }}>{project.title}</h3>
          <span className="flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap"
            style={{ backgroundColor: sc.bg, color: sc.text }}>
            {project.status}
          </span>
        </div>

        <p className="text-sm mb-4 sm:mb-5 leading-relaxed line-clamp-3" style={{ color: textColor, opacity: 0.6 }}>{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
          {project.tags?.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: tagBg, color: accent }}>{tag}</span>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: accent, color: dark ? '#000' : '#fff' }}>
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

  const textColor = dark ? '#00F0FF' : '#0A1A3A'
  const accent = dark ? '#FFFFFF' : '#00F0FF'
  const badgeBg = dark ? 'rgba(0,240,255,0.1)' : 'rgba(0,200,220,0.12)'

  useEffect(() => {
    fetch('./projects.json').then(r => r.json()).then(d => setProjects(d)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const SkeletonCard = () => {
    const shimmer = dark ? 'rgba(0,240,255,0.08)' : 'rgba(10,26,58,0.08)'
    const border = dark ? 'rgba(0,240,255,0.12)' : 'rgba(10,26,58,0.1)'
    return (
      <div className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] border rounded-2xl overflow-hidden" style={{ borderColor: border }}>
        <div className="h-2" style={{ backgroundColor: shimmer }} />
        <div className="p-6 space-y-3">
          <div className="h-6 w-3/4 rounded-lg animate-pulse" style={{ backgroundColor: shimmer }} />
          <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: shimmer }} />
          <div className="h-4 w-2/3 rounded animate-pulse" style={{ backgroundColor: shimmer }} />
        </div>
      </div>
    )
  }

  return (
    <section id="projects" className="relative py-20 sm:py-24 px-4 sm:px-6" aria-label="Projects section">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10 sm:mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ backgroundColor: badgeBg, color: accent }}>
            Portfolio
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold" style={{ color: textColor }}>
            My{' '}
            <span style={{ color: accent }}>Projects</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base" style={{ color: textColor, opacity: 0.5 }}>
            Tap any card to see the full case study
          </p>
        </motion.div>

        <div ref={scrollRef}
          onMouseDown={e => { setIsDragging(true); setStartX(e.pageX - scrollRef.current.offsetLeft); setScrollLeft(scrollRef.current.scrollLeft) }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onMouseMove={e => { if (!isDragging) return; e.preventDefault(); scrollRef.current.scrollLeft = scrollLeft - (e.pageX - scrollRef.current.offsetLeft - startX) * 1.5 }}
          className={`flex gap-4 sm:gap-6 overflow-x-auto pb-6 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
                  <ProjectCard project={p} dark={dark} accent={accent} textColor={textColor} onClick={setSelected} />
                </motion.div>
              ))}
        </div>
        <p className="text-center text-xs sm:text-sm mt-4" style={{ color: textColor, opacity: 0.3 }}>
          ← Drag to scroll →
        </p>
      </div>

      <AnimatePresence>
        {selected && (
          <CaseStudyModal project={selected} onClose={() => setSelected(null)} dark={dark} accent={accent} textColor={textColor} />
        )}
      </AnimatePresence>
    </section>
  )
}

export default Projects
