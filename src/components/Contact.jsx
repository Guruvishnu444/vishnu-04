import { motion } from 'framer-motion';
import { Envelope, GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react';
import { useTheme } from '../ThemeContext';
import { sectionVariants, buttonHoverVariants, useScrollAnimation } from '../utils/animations';

export default function Contact() {
  const { dark } = useTheme();
  const scrollAnim = useScrollAnimation();

  const socialLinks = [
    { name: 'GitHub', icon: GithubLogo, url: 'https://github.com/Guruvishnu444' },
    { name: 'LinkedIn', icon: LinkedinLogo, url: 'https://www.linkedin.com/in/guruvishnu-s-v4/' },
    { name: 'LeetCode', icon: Code, url: 'https://leetcode.com/u/GuruvishnuS/' },
  ];

  return (
    <section id="contact" className="relative py-20 sm:py-32 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div {...scrollAnim} variants={sectionVariants} className="mb-16 text-center">
        </motion.div>

        {/* Main content - Centered */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...scrollAnim} variants={sectionVariants}>
            <h2 className={`text-[1.5rem] sm:text-[1.875rem] md:text-[2.25rem] font-bold leading-tight mb-8 sm:mb-12 px-4 sm:px-0 ${
              dark ? 'text-white' : 'text-slate-900'
            }`}>
              Have a vision? A project idea?{' '}
              <span className={`${dark ? 'text-cyan-400' : 'text-blue-600'}`}>Let's turn your ideas into action.</span>
            </h2>
          </motion.div>

          {/* Email Button - Centered */}
          <motion.div
            {...scrollAnim}
            variants={sectionVariants}
            className="mb-12 sm:mb-16 flex justify-center px-4"
          >
            <motion.a
              href="mailto:guruvishnu4gd@gmail.com"
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`relative px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl overflow-hidden transition-all ${
                dark
                  ? 'bg-cyan-400 text-black shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_40px_rgba(34,211,238,0.8)]'
                  : 'bg-blue-600 text-white shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.8)]'
              }`}
            >
              <span className="relative z-10">Drop Me a Line</span>
            </motion.a>
          </motion.div>

          {/* Social links - Centered */}
          <motion.div {...scrollAnim} variants={sectionVariants}>
            <p className={`text-sm sm:text-base md:text-[1.125rem] font-mono tracking-widest mb-6 px-4 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
              OR FIND ME ON THESE PLATFORMS
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 px-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={buttonHoverVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                    className="group relative flex items-center justify-center"
                    aria-label={link.name}
                  >
                    {/* Icon with glow */}
                    <Icon 
                      size={28}
                      weight="fill" 
                      className={`sm:w-8 sm:h-8 transition-all duration-300 ${
                        dark
                          ? 'text-slate-400 group-hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                          : 'text-slate-600 group-hover:text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0)] group-hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                      }`}
                    />
                    
                    {/* Tooltip on hover - hidden on mobile */}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className={`hidden sm:block absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none ${
                        dark
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-900 text-white'
                      }`}
                    >
                      {link.name}
                    </motion.span>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
