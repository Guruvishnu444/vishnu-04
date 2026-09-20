import { motion } from 'framer-motion';
import { Code, FileHtml, FileCss, FileJs, Atom, BracketsAngle } from '@phosphor-icons/react';
import { useTheme } from '../ThemeContext';
import { sectionVariants, gridContainerVariants, gridItemVariants, useScrollAnimation } from '../utils/animations';

const skills = [
  { name: 'HTML5', icon: FileHtml, category: 'Frontend' },
  { name: 'CSS3', icon: FileCss, category: 'Frontend' },
  { name: 'JavaScript', icon: FileJs, category: 'Frontend' },
  { name: 'React', icon: Atom, category: 'Frontend' },
  { name: 'Python', icon: Code, category: 'Backend' },
  { name: 'C', icon: BracketsAngle, category: 'Language' },
  { name: 'C++', icon: BracketsAngle, category: 'Language' },
  { name: 'Java', icon: Code, category: 'Language' },
];

export default function About() {
  const { dark } = useTheme();
  const scrollAnim = useScrollAnimation();

  return (
    <section id="about" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">


        {/* Main content - Editorial layout */}
        <div className="space-y-12 sm:space-y-16">
          {/* Intro paragraph */}
          <motion.div {...scrollAnim} variants={sectionVariants} className="max-w-4xl px-4 sm:px-0">
            <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 sm:mb-8 ${dark ? 'text-white' : 'text-slate-900'}`}>
              Fueling the future with innovative solutions, backed by continuous learning and real-world impact.
            </h2>
          </motion.div>

          {/* Body content */}
          <motion.div {...scrollAnim} variants={sectionVariants} className="grid lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 px-4 sm:px-0">
            {/* Left side - Text */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <p className={`text-base sm:text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                I am a BSc Information Technology student at KPR College of Arts, Science and Research (KPRCAS) in Coimbatore. 
                With a strong interest in full-stack web development, I focus on building responsive, user-friendly applications 
                that solve real-world problems.
              </p>
              
              <p className={`text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                I work at the intersection of frontend design and backend logic, using modern frameworks like React, JavaScript, 
                and Python to create seamless digital experiences. My approach prioritizes clean code, maintainable architecture, 
                and thoughtful user interfaces.
              </p>
              
              <p className={`text-lg leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
                I'm currently open to internships and freelance opportunities where I can contribute my skills while continuing 
                to grow as a developer. When I'm not coding, you'll find me exploring new technologies, contributing to open-source 
                projects, or sharpening my problem-solving skills on competitive programming platforms.
              </p>
            </div>

            {/* Right side - Stats */}
            <div className="lg:col-span-5">
              <motion.div 
                {...scrollAnim}
                variants={gridContainerVariants}
                className="space-y-8"
              >
                {[
                  { label: 'Projects Completed', value: '2+' },
                  { label: 'Technologies Mastered', value: '8+' },
                  { label: 'Years Learning', value: '2+' },
                ].map((stat) => (
                  <motion.div key={stat.label} variants={gridItemVariants} className={`pb-8 border-b ${dark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className={`text-5xl sm:text-6xl font-bold mb-2 ${dark ? 'text-cyan-400' : 'text-blue-600'}`}>
                      {stat.value}
                    </div>
                    <div className={`text-sm font-medium tracking-wide ${dark ? 'text-slate-500' : 'text-slate-600'}`}>
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Core Toolkit Section */}
          <motion.div {...scrollAnim} variants={sectionVariants} className="pt-12">
            <h3 className={`text-xl font-bold mb-8 ${dark ? 'text-white' : 'text-slate-900'}`}>
              My Core Toolkit
            </h3>
            
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4"
            >
              {skills.map((skill) => (
                <motion.div
                  key={skill.name}
                  variants={gridItemVariants}
                  whileHover={{ 
                    y: -6,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  className={`group relative flex flex-col items-center gap-3 p-4 rounded-xl border transition-all cursor-default ${
                    dark
                      ? 'bg-white/[0.02] border-white/10 hover:border-cyan-400/50 hover:bg-white/5'
                      : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <skill.icon 
                      size={28} 
                      weight="duotone" 
                      className={`${dark ? 'text-cyan-400' : 'text-blue-600'} transition-colors`} 
                    />
                  </motion.div>
                  <div className="text-center">
                    <div className={`text-xs font-medium ${dark ? 'text-slate-300 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'} transition-colors`}>
                      {skill.name}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
