import { motion } from 'framer-motion'
import { GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

function Footer() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#2b2b2b]'
  const mutedColor = dark ? 'text-[#f5f5f5]/50' : 'text-[#2b2b2b]/50'
  const borderColor = dark ? 'border-white/10' : 'border-black/10'
  const cardBorder = dark ? 'border-white/10 hover:border-white/30' : 'border-black/10 hover:border-black/30'
  const iconColor = dark ? 'text-[#f5f5f5]/70' : 'text-[#2b2b2b]/70'

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ]
  const socialLinks = [
    { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/guruvishnu' },
    { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://linkedin.com/in/guruvishnu' },
    { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/guruvishnu' },
  ]

  return (
    <footer className={`relative border-t py-12 px-6 transition-colors duration-500 ${borderColor}`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-center">

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-400 to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">GV</span>
            </div>
            <div>
              <span className={`font-semibold ${textColor}`}>Guruvishnu</span>
              <p className={`text-sm ${mutedColor}`}>Building the future</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="flex justify-center gap-8">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className={`text-sm font-medium transition-opacity hover:opacity-100 ${mutedColor}`}>
                {link.label}
              </a>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }} className="flex justify-end gap-4">
            {socialLinks.map((link) => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                aria-label={`Visit ${link.name}`}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all group ${cardBorder}`}>
                <link.icon size={20} weight="duotone" className={`transition-colors ${iconColor}`} />
              </a>
            ))}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className={`mt-8 pt-8 border-t text-center ${borderColor}`}>
          <p className={`text-sm ${mutedColor}`}>© 2025 Guruvishnu S. All rights reserved.</p>
          <p className={`text-xs mt-2 ${dark ? 'text-[#f5f5f5]/25' : 'text-[#2b2b2b]/30'}`}>
            Made with lots of ☕️ and a whole lot of ❤️.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
