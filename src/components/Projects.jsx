import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, GithubLogo } from '@phosphor-icons/react';
import { useTheme } from '../ThemeContext';
import { sectionVariants, cardVariants, gridContainerVariants, useScrollAnimation } from '../utils/animations';

export default function Projects() {
  const { dark } = useTheme();
  const scrollAnim = useScrollAnimation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('./projects.json')
      .then((r) => r.json())
      .then((d) => setProjects(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="projects" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div {...scrollAnim} variants={sectionVariants} className="mb-16">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${dark ? 'text-white' : 'text-slate-900'}`}>
            My Creations
          </h2>
          <p className={`text-lg max-w-3xl ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Here's a glimpse into some of the exciting projects I've worked on, showcasing my skills and passion 
            for innovation. Each project represents a unique challenge and a step forward in my journey.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-12 h-12 border-2 border-t-transparent rounded-full animate-spin ${
              dark ? 'border-cyan-400' : 'border-blue-600'
            }`} />
          </div>
        ) : projects.length > 0 ? (
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-16"
          >
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                variants={cardVariants}
                className="group"
              >
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                  {/* Project Image */}
                  <div className={`lg:col-span-7 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <motion.div
                      className="relative aspect-video rounded-2xl overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.4 }}
                    >
                      {project.image ? (
                        <>
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${
                            dark ? 'from-black/60 via-black/20' : 'from-white/60 via-white/20'
                          } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        </>
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          dark ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10' : 'bg-gradient-to-br from-blue-100 to-cyan-50'
                        }`}>
                          <GithubLogo size={80} className={`${dark ? 'text-white/20' : 'text-slate-300'}`} weight="duotone" />
                        </div>
                      )}
                      
                      {/* Project Number Overlay */}
                      <div className="absolute top-6 right-6">
                        <span className={`text-7xl font-bold ${dark ? 'text-white/5' : 'text-black/5'}`}>
                          {'0' + (index + 1)}
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Project Content */}
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    {/* Project number */}
                    <motion.span 
                      className={`block text-sm font-mono tracking-widest mb-4 ${dark ? 'text-slate-600' : 'text-slate-400'}`}
                      whileHover={{ x: 4 }}
                    >
                      PROJECT {'0' + (index + 1)}
                    </motion.span>

                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${
                      dark ? 'text-white group-hover:text-cyan-400' : 'text-slate-900 group-hover:text-blue-600'
                    } transition-colors`}>
                      {project.title}
                    </h3>

                    <p className={`text-base md:text-lg leading-relaxed mb-6 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {project.description}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                              dark
                                ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex flex-wrap items-center gap-4">
                      {project.link && (
                        <motion.a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                            dark 
                              ? 'bg-cyan-400 text-black hover:bg-cyan-300' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Visit Project
                          <ArrowUpRight size={18} weight="bold" />
                        </motion.a>
                      )}
                      
                      {project.github && (
                        <motion.a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium border transition-all ${
                            dark
                              ? 'border-white/20 text-white hover:border-cyan-400/50 hover:bg-white/5'
                              : 'border-slate-300 text-slate-900 hover:border-blue-500 hover:bg-blue-50'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <GithubLogo size={18} weight="bold" />
                          GitHub
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            {...scrollAnim}
            variants={sectionVariants}
            className="text-center py-20"
          >
            <div className="max-w-lg mx-auto">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8"
              >
                <GithubLogo size={80} className={`mx-auto ${dark ? 'text-white/20' : 'text-slate-300'}`} weight="duotone" />
              </motion.div>
              <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${dark ? 'text-white' : 'text-slate-900'}`}>
                Building in Public
              </h3>
              <p className={`text-lg mb-8 ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                Currently working on exciting projects. Follow my journey on GitHub to see what I'm building.
              </p>
              <motion.a
                href="https://github.com/Guruvishnu444"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${
                  dark
                    ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <GithubLogo size={20} weight="bold" />
                Explore GitHub
                <ArrowUpRight size={18} weight="bold" />
              </motion.a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
