import { motion } from 'framer-motion'

function ProjectCard({ project, index }) {
  const { seed, title, description, tags, id } = project

  // Generate a picsum image URL based on the seed
  const imageUrl = `https://picsum.photos/seed/${seed}/400/250`

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className="flex-shrink-0 w-[340px] glass-card overflow-hidden group"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={`${title} preview`}
          loading="lazy"
          width={400}
          height={250}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          crossOrigin="anonymous"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
        
        {/* Coming Soon Badge */}
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-lavender/90 text-midnight">
            Coming Soon
          </span>
        </div>

        {/* Project Number */}
        <div className="absolute bottom-4 left-4">
          <span className="text-6xl font-bold text-off-white/10">
            {String(id).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-off-white mb-2 group-hover:text-sky-neon transition-colors">
          {title}
        </h3>
        <p className="text-off-white/60 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium bg-sky-neon/10 text-sky-neon border border-sky-neon/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
