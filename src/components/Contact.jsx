import { useState } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import {
  Envelope,
  GithubLogo,
  LinkedinLogo,
  Code,
  PaperPlaneTilt,
  CircleNotch,
} from '@phosphor-icons/react'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

      if (!serviceId || !templateId || !publicKey) {
        toast.error('Email service not configured. Please contact via email directly.')
        setIsSubmitting(false)
        return
      }

      await emailjs.send(serviceId, templateId, {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Guruvishnu',
      }, publicKey)

      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      console.error('[v0] EmailJS error:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

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
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-sky-neon/10 text-sky-neon mb-4">
              Contact
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-off-white mb-6 text-balance">
              {"Let's build something"} <span className="gradient-text">great</span>
            </h2>
            <p className="text-off-white/70 mb-8 leading-relaxed">
              {"Have a project in mind or just want to chat? I'd love to hear from you. Feel free to reach out through the form or connect with me directly."}
            </p>

            {/* Email Link */}
            <a
              href="mailto:guruvishnu4gd@gmail.com"
              className="inline-flex items-center gap-3 text-off-white hover:text-sky-neon transition-colors mb-8 group"
            >
              <div className="w-12 h-12 rounded-xl glass-card flex items-center justify-center group-hover:border-sky-neon/50 transition-colors">
                <Envelope size={24} weight="duotone" className="text-sky-neon" />
              </div>
              <span className="font-medium">guruvishnu4gd@gmail.com</span>
            </a>

            {/* Social Links */}
            <div className="flex gap-4">
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

          {/* Right Column - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
          >
            <form onSubmit={handleSubmit} className="clay-card p-6 sm:p-8">
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-off-white/80 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight/50 border border-white/10 text-off-white placeholder:text-off-white/40 focus:border-sky-neon transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-off-white/80 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-midnight/50 border border-white/10 text-off-white placeholder:text-off-white/40 focus:border-sky-neon transition-colors"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-off-white/80 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl bg-midnight/50 border border-white/10 text-off-white placeholder:text-off-white/40 focus:border-sky-neon transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-neon to-lavender text-midnight font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <CircleNotch size={20} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <PaperPlaneTilt size={20} weight="bold" />
                      Send Message
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
