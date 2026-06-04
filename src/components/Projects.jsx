import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[340px] glass-card overflow-hidden">
      <div className="h-48 shimmer" />
      <div className="p-5 space-y-3">
        <div className="h-4 w-24 rounded shimmer" />
        <div className="h-6 w-3/4 rounded shimmer" />
        <div className="h-4 w-full rounded shimmer" />
        <div className="h-4 w-2/3 rounded shimmer" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-16 rounded-full shimmer" />
          <div className="h-6 w-16 rounded-full shimmer" />
          <div className="h-6 w-16 rounded-full shimmer" />
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('./projects.json')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('[v0] Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }

  return (
    <section
      id="projects"
      className="relative py-24 px-6"
      aria-label="Projects section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-lavender/10 text-lavender mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-off-white text-balance">
            Upcoming <span className="gradient-text">Projects</span>
          </h2>
        </motion.div>

        {/* Scrollable Projects Track */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onMouseMove={handleMouseMove}
            className={`flex gap-6 overflow-x-auto pb-6 scroll-smooth ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {loading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : projects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
          </div>

          {/* Scroll Hint */}
          <div className="flex items-center justify-center gap-2 mt-4 text-off-white/50 text-sm">
            <span>Drag to scroll</span>
            <span className="animate-pulse">→</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Projects
