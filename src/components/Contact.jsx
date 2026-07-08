import { motion } from 'framer-motion'
import { Envelope, GithubLogo, LinkedinLogo, Code } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'

function Contact() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/65' : 'text-[#1a1a1a]/65'
  const cardBorder = dark ? 'border-white/10 hover:border-orange-500/40' : 'border-black/10 hover:border-violet-400/40'
  const badgeBg = dark ? 'bg-red-500/10 text-red-400' : 'bg-blue-400/10 text-blue-500'
  const headingGradient = dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
  const iconColor = dark ? 'text-orange-400' : 'text-violet-500'

  const socialLinks = [
    { name: 'GitHub', icon: GithubLogo, href: 'https://github.com/Guruvishnu444' },
    { name: 'LinkedIn', icon: LinkedinLogo, href: 'https://www.linkedin.com/in/guruvishnu-s-v4/' },
    { name: 'LeetCode', icon: Code, href: 'https://leetcode.com/u/GuruvishnuS/' },
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
            <span className={`bg-gradient-to-r ${headingGradient} bg-clip-text text-transparent`}>great</span>
          </h2>
          <p className={`mb-10 leading-relaxed ${mutedText}`}>
            Have a project in mind or just want to chat? Feel free to connect with me directly.
          </p>
          <div className="flex justify-center mb-10">
            <a href="mailto:guruvishnu4gd@gmail.com"
              className={`inline-flex items-center gap-3 transition-colors group ${textColor} hover:opacity-70`}>
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${cardBorder}`}>
                <Envelope size={24} weight="duotone" className={iconColor} />
              </div>
              <span className="font-medium">guruvishnu4gd@gmail.com</span>
            </a>
          </div>
          <div className="flex justify-center gap-4">
            {socialLinks.map(link => (
              <motion.a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all group ${cardBorder}`}>
                <link.icon size={24} weight="duotone" className={`transition-colors ${iconColor}`} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
