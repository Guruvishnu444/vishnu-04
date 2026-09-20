import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useState } from 'react'

function ProjectCard({ project, index }) {
  const { seed, title, description, tags, id } = project
  const [isHovered, setIsHovered] = useState(false)

  // Generate a picsum image URL based on the seed
  const imageUrl = `https://picsum.photos/seed/${seed}/400/250`

  // Mouse movement tracking for 3D effect
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-100, 100], [10, -10])
  const rotateY = useTransform(x, [-100, 100], [-10, 10])

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(event.clientX - centerX)
    y.set(event.clientY - centerY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ 
        scale: 1.02, 
        y: -8,
        transition: { duration: 0.3 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="flex-shrink-0 w-[340px] glass-card overflow-hidden group relative"
    >
      {/* Animated glow border effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4)',
          backgroundSize: '300% 300%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner card content with slight z-offset for 3D effect */}
      <div className="relative" style={{ transform: "translateZ(20px)" }}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={imageUrl}
            alt={`${title} preview`}
            loading="lazy"
            width={400}
            height={250}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.15, rotate: 2 }}
            transition={{ duration: 0.6 }}
            crossOrigin="anonymous"
          />
          
          {/* Animated Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent"
            animate={{
              background: isHovered 
                ? 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)'
                : 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
            }}
          />
          
          {/* Coming Soon Badge with pulse */}
          <motion.div 
            className="absolute top-4 right-4"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ 
              delay: index * 0.1 + 0.3,
              type: "spring",
              stiffness: 200
            }}
          >
            <motion.span 
              className="px-3 py-1 rounded-full text-xs font-semibold bg-lavender/90 text-midnight inline-block"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(167, 139, 250, 0.7)',
                  '0 0 0 8px rgba(167, 139, 250, 0)',
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Coming Soon
            </motion.span>
          </motion.div>

          {/* Project Number with parallax effect */}
          <motion.div 
            className="absolute bottom-4 left-4"
            style={{ 
              transform: isHovered ? "translateZ(40px)" : "translateZ(0px)",
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-6xl font-bold text-off-white/10"
              whileHover={{ scale: 1.1, opacity: 0.2 }}
            >
              {String(id).padStart(2, '0')}
            </motion.span>
          </motion.div>

          {/* Shine effect on hover */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
            animate={{
              x: isHovered ? ['-100%', '200%'] : '-100%',
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 1,
            }}
          />
        </div>

        {/* Content */}
        <div className="p-5 relative">
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.05), transparent)',
            }}
          />

          <motion.h3 
            className="text-xl font-semibold text-off-white mb-2 group-hover:text-sky-neon transition-colors relative"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {title}
          </motion.h3>
          
          <motion.p 
            className="text-off-white/60 text-sm mb-4 line-clamp-2 relative"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {description}
          </motion.p>

          {/* Tags with staggered animation */}
          <div className="flex flex-wrap gap-2 relative">
            {tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium bg-sky-neon/10 text-sky-neon border border-sky-neon/20"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1 + 0.4 + tagIndex * 0.05,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ 
                  scale: 1.1,
                  backgroundColor: 'rgba(14, 165, 233, 0.2)',
                  transition: { duration: 0.2 }
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-neon via-blue-500 to-purple-500"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
            style={{ originX: 0 }}
          />
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
