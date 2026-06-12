import { motion } from 'framer-motion'
import { Envelope, GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from './ThemeContext'

function Contact() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#2b2b2b]'
  const mutedText = dark ? 'text-[#f5f5f5]/70' : 'text-[#2b2b2b]/70'
  const cardBorder = dark ? 'border-white/10 hover:border-white/30' : 'border-black/10 hover:border-black/30'
  const badgeBg = dark ? 'bg-sky-400/10 text-sky-400' : 'bg-sky-500/10 text-sky-600'

  const socialLinks = [
    { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/guruvishnu' },
    { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://linkedin.com/in/guruvishnu' },
    { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/guruvishnu' },
  ]

  return (
    <section id="contact" className="relative py-24 px-6" aria-label="Contact section">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}>

          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 ${badgeBg}`}>
            Contact
          </span>

          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 ${textColor}`}>
            Let's build something{' '}
            <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">great</span>
          </h2>

          <p className={`mb-10 leading-relaxed ${mutedText}`}>
            Have a project in mind or just want to chat? I'd love to hear from you.
          </p>

          <div className="flex justify-center mb-10">
            <a href="mailto:guruvishnu4gd@gmail.com"
              className={`inline-flex items-center gap-3 transition-colors group ${textColor} hover:opacity-70`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${cardBorder}`}>
                <Envelope size={24} weight="duotone" className="text-sky-400" />
              </div>
              <span className="font-medium">guruvishnu4gd@gmail.com</span>
            </a>
          </div>

          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <motion.a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                aria-label={link.name} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all group ${cardBorder}`}>
                <link.icon size={24} weight="duotone"
                  className={`transition-colors ${dark ? 'text-[#f5f5f5]/70 group-hover:text-sky-400' : 'text-[#2b2b2b]/70 group-hover:text-sky-500'}`} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
