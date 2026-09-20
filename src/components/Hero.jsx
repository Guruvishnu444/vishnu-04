import { motion } from 'framer-motion';
import { ArrowDown } from '@phosphor-icons/react';
import { useTheme } from '../ThemeContext';
import { heroVariants } from '../utils/animations';

export default function Hero() {
  const { dark } = useTheme();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20"
    >
      <motion.div
        variants={heroVariants.container}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto w-full relative z-10"
      >
        {/* Intro text */}
        <motion.div variants={heroVariants.item} className="mb-6">
          <p className={`text-base sm:text-lg md:text-xl font-light tracking-wide ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            Hello, I'm
          </p>
          <motion.div 
            className="w-16 h-0.5 mt-2"
            style={{ backgroundColor: '#ef4444' }}
            initial={{ width: 0 }}
            animate={{ width: '4rem' }}
            transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
          />
        </motion.div>

        {/* Name - Large Display */}
        <motion.div variants={heroVariants.title} className="mb-6">
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
            Guruvishnu S
          </h1>
        </motion.div>

        {/* Professional title */}
        <motion.div variants={heroVariants.item} className="mb-8">
          <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal leading-tight tracking-wide ${dark ? 'text-slate-300' : 'text-slate-700'}`}>
            A Full-Stack Developer & Problem Solver.
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div variants={heroVariants.item} className="mb-16 max-w-3xl">
          <p className={`text-base sm:text-lg md:text-xl leading-relaxed font-light ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            I learn, build, and optimize web solutions to solve real-world problems. 
            BSc IT student from Coimbatore, passionate about creating clean, responsive digital experiences.
          </p>
        </motion.div>

        {/* Social links - bottom */}
        <motion.div 
          variants={heroVariants.item}
          className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
        >
          <span className={`text-xs font-mono tracking-widest uppercase ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
            Find me on
          </span>
          <div className="flex items-center gap-5">
            {[
              { name: 'GitHub', url: 'https://github.com/Guruvishnu444' },
              { name: 'LinkedIn', url: 'https://www.linkedin.com/in/guruvishnu-s-v4/' },
              { name: 'LeetCode', url: 'https://leetcode.com/u/GuruvishnuS/' },
            ].map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-sm font-medium transition-colors ${
                  dark 
                    ? 'text-slate-400 hover:text-cyan-400' 
                    : 'text-slate-600 hover:text-blue-600'
                }`}
                whileHover={{ y: -2 }}
              >
                {link.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={() => scrollToSection('about')}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <ArrowDown size={20} className={`${dark ? 'text-slate-600 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600'} transition-colors`} weight="bold" />
        </motion.button>
      </motion.div>
    </section>
  );
}
