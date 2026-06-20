import { motion } from 'framer-motion'
import { Envelope, GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

function Contact() {
  const { dark } = useTheme()
  const c = getColors(dark)

  const socialLinks = [
    { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/Guruvishnu444' },
    { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-951a67345/' },
    { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/u/GuruvishnuS/' },
  ]

  return (
    <section id="contact" className="relative py-20 sm:py-24 px-4 sm:px-6" aria-label="Contact section">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4"
            style={{ backgroundColor: c.accentSoft, color: c.accent }}>
            Contact
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold mb-5 sm:mb-6" style={{ color: c.textPrimary }}>
            Let's build something{' '}
            <span style={{ color: c.accent }}>great</span>
          </h2>
          <p className="mb-8 sm:mb-10 leading-relaxed text-sm sm:text-base" style={{ color: c.textSecondary }}>
            Have a project in mind or just want to chat? Feel free to connect with me directly.
          </p>
          <div className="flex justify-center mb-8 sm:mb-10">
            <a href="mailto:guruvishnu4gd@gmail.com"
              className="inline-flex items-center gap-3 transition-opacity hover:opacity-70"
              style={{ color: c.textPrimary }}>
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center"
                style={{ borderColor: c.cardBorder, backgroundColor: c.card }}>
                <Envelope size={22} weight="duotone" style={{ color: c.accent }} />
              </div>
              <span className="font-medium text-sm sm:text-base break-all">guruvishnu4gd@gmail.com</span>
            </a>
          </div>
          <div className="flex justify-center gap-3 sm:gap-4">
            {socialLinks.map(link => (
              <motion.a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border flex items-center justify-center"
                style={{ borderColor: c.cardBorder, backgroundColor: c.card, color: c.accent }}>
                <link.icon size={22} weight="duotone" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
