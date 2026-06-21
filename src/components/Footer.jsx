import { motion } from 'framer-motion'
import { GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]
const socialLinks = [
  { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/Guruvishnu444' },
  { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-951a67345/' },
  { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/u/GuruvishnuS/' },
]

export default function Footer() {
  const { dark } = useTheme()
  const c = getColors(dark)

  return (
    <footer className="relative border-t py-10 sm:py-12 px-4 sm:px-6" style={{ borderColor: c.cardBorder }}>
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }} className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
            {navLinks.map(link => (
              <a key={link.label} href={link.href} className="text-sm font-medium hover:opacity-100" style={{ color: c.textSecondary, opacity: 0.85 }}>
                {link.label}
              </a>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 }} className="flex justify-center sm:justify-end gap-4">
            {socialLinks.map(link => (
              <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${link.name}`}
                className="w-10 h-10 rounded-lg border flex items-center justify-center"
                style={{ borderColor: c.cardBorder, backgroundColor: c.card, color: c.accent }}>
                <link.icon size={20} weight="duotone" />
              </a>
            ))}
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t text-center" style={{ borderColor: c.cardBorder }}>
          <p className="text-sm" style={{ color: c.textSecondary }}>© 2025 Guruvishnu S. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
