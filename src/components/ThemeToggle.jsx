import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../ThemeContext'

export default function ThemeToggle() {
  const { dark, toggle } = useTheme()

  return (
    <motion.button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        dark
          ? 'bg-gradient-to-r from-orange-600 to-red-600 focus-visible:ring-orange-500'
          : 'bg-gradient-to-r from-blue-400 to-violet-500 focus-visible:ring-violet-400'
      }`}
    >
      {/* Track */}
      <motion.div
        layout
        animate={{ x: dark ? 30 : 2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        <AnimatePresence mode="wait">
          {dark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] leading-none"
            >
              🌙
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="text-[11px] leading-none"
            >
              ☀️
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
