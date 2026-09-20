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
    <section id="contact" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div {...scrollAnim} variants={sectionVariants} className="mb-16 text-center">
        </motion.div>

        {/* Main content - Centered */}
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...scrollAnim} variants={sectionVariants}>
            <h2 className={`text-[1.875rem] md:text-[2.25rem] font-bold leading-tight mb-12 ${
              dark ? 'text-white' : 'text-slate-900'
            }`}>
              Have a vision? {' '}
              <span className={`${dark ? 'text-cyan-400' : 'text-blue-600'}`}>A project idea?</span>
              Let's turn your ideas into action.{' '}
              <span className={`${dark ? 'text-cyan-400' : 'text-blue-600'}`}> let's start building something great together.</span>
            </h2>
          </motion.div>

          {/* Email Button - Centered */}
          <motion.div
            {...scrollAnim}
            variants={sectionVariants}
            className="mb-16 flex justify-center"
          >
            <motion.a
              href="mailto:guruvishnu4gd@gmail.com"
              variants={buttonHoverVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
              className={`relative px-12 py-5 rounded-2xl font-bold text-xl overflow-hidden transition-all ${
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
            <p className={`text-base md:text-[1.125rem] font-mono tracking-widest mb-6 ${dark ? 'text-slate-600' : 'text-slate-400'}`}>
              <strong>𝖮𝗋 𝖿𝗂𝗇𝖽 𝗆𝖾 𝗈𝗇 𝗍𝗁𝖾𝗌𝖾 𝗉𝗅𝖺𝗍𝖿𝗈𝗋𝗆𝗌:</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-8">
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
                      size={32} 
                      weight="fill" 
                      className={`transition-all duration-300 ${
                        dark
                          ? 'text-slate-400 group-hover:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0)] group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]'
                          : 'text-slate-600 group-hover:text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0)] group-hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.6)]'
                      }`}
                    />
                    
                    {/* Tooltip on hover */}
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap pointer-events-none ${
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
