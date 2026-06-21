import { motion } from 'framer-motion'
import { ArrowLeft, WifiHigh, Bug } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

const terminalLines = [
  '> initializing route resolver...',
  '> scanning directories...',
  '> ERROR: path not found [404]',
  '> running diagnostics...',
  '> suggestion: check your URL',
  '> or just go home 🏠',
]

function TerminalBlock({ c }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
      className="border rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm text-left max-w-md mx-auto"
      style={{ backgroundColor: c.card, borderColor: c.cardBorder }}>
      <div className="flex items-center gap-2 mb-3" style={{ color: c.textSecondary }}>
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.danger }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.warning }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.success }} />
        <span className="ml-2">terminal — bash</span>
      </div>
      {terminalLines.map((line, i) => (
        <motion.p key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.18 }} className="leading-relaxed"
          style={{ color: line.includes('ERROR') ? c.danger : c.success, fontWeight: line.includes('ERROR') ? 700 : 400 }}>
          {line}
        </motion.p>
      ))}
    </motion.div>
  )
}

export default function NotFound() {
  const { dark } = useTheme()
  const c = getColors(dark)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: c.bg }}>
      <div className="relative mb-4">
        <motion.div animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-8 -left-12 opacity-30">
          <WifiHigh size={40} style={{ color: c.accent }} />
        </motion.div>
        <motion.div animate={{ y: [8, -8, 8], rotate: [5, -5, 5] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -top-6 -right-12 opacity-30">
          <Bug size={36} style={{ color: c.danger }} />
        </motion.div>
        <motion.span className="text-[8rem] sm:text-[12rem] font-black leading-none inline-block" style={{ color: c.accent }}
          animate={{ skewX: [0, -2, 2, 0], opacity: [1, 0.9, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          404
        </motion.span>
      </div>

      <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: c.textPrimary }}>
        Server down? No — just a wrong turn!
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="text-sm sm:text-base mb-8 max-w-sm" style={{ color: c.textSecondary }}>
        The page you're looking for doesn't exist or has been moved.
      </motion.p>

      <TerminalBlock c={c} />

      <motion.a href="/" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.2 }}
        whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.97 }}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:opacity-90"
        style={{ backgroundColor: c.accent, color: '#fff' }}>
        <ArrowLeft size={18} weight="bold" /> Back to Home
      </motion.a>
    </div>
  )
}
