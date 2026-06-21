import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from '@phosphor-icons/react'
import { useTheme } from '../ThemeContext'
import { getColors } from '../colors'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()
  const c = getColors(dark)

  return (
    <motion.button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative w-14 h-7 rounded-full flex-shrink-0"
      style={{ backgroundColor: `${c.accent}33`, border: `1px solid ${c.accent}66` }}
    >
      <motion.div layout animate={{ x: dark ? 30 : 2 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute top-1 w-5 h-5 rounded-full shadow-md flex items-center justify-center" style={{ backgroundColor: c.accent }}>
        <AnimatePresence mode="wait">
          {dark ? (
            <motion.span key="moon" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.2 }}>
              <Moon size={12} weight="fill" style={{ color: c.bg }} />
            </motion.span>
          ) : (
            <motion.span key="sun" initial={{ opacity: 0, rotate: 90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.2 }}>
              <Sun size={12} weight="fill" style={{ color: '#FFFFFF' }} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
