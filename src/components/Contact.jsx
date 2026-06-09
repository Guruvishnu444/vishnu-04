import { motion } from 'framer-motion'
import {
  Envelope,
  GithubLogo,
  LinkedinLogo,
  Code,
} from '@phosphor-icons/react'

function Contact() {
  const socialLinks = [
    {
      name: 'GitHub',
      icon: GithubLogo,
      href: 'https://github.com/guruvishnu',
      label: 'Visit GitHub profile',
    },
    {
      name: 'LinkedIn',
      icon: LinkedinLogo,
      href: 'https://linkedin.com/in/guruvishnu',
      label: 'Visit LinkedIn profile',
    },
    {
      name: 'LeetCode',
      icon: Code,
      href: 'https://leetcode.com/guruvishnu',
      label: 'Visit LeetCode profile',
    },
  ]

  return (
    <section
      id="contact"
      className="relative py-24 px-6"
      aria-label="Contact section"
    >
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-neon/10 text-sky-neon mb-4">
            Contact
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-off-white mb-6 text-balance">
            {"Let's build something"} <span className="gradient-text">great</span>
          </h2>

          <p className="text-off-white/70 mb-10 leading-relaxed">
            {"Have a project in mind or just want to chat? I'd love to hear from you. Feel free to connect with me directly."}
          </p>

          {/* Email Link */}
          <div className="flex justify-center mb-10">
            <a
              href="mailto:guruvishnu4gd@gmail.com"
              className="inline-flex items-center gap-3 text-off-white hover:text-sky-neon transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:border-sky-neon/50 transition-colors">
                <Envelope size={24} weight="duotone" className="text-sky-neon" />
              </div>
              <span className="font-medium">guruvishnu4gd@gmail.com</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl glass-card flex items-center justify-center hover:border-sky-neon/50 transition-all group"
              >
                <link.icon
                  size={24}
                  weight="duotone"
                  className="text-off-white/70 group-hover:text-sky-neon transition-colors"
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
