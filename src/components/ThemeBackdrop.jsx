import { motion } from 'framer-motion'
import { useTheme } from '../ThemeContext'

const DARK_BG = '#0b0f19'
const LIGHT_BG = '#f8fafc'

export default function ThemeBackdrop() {
  const { dark } = useTheme()

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ backgroundColor: LIGHT_BG }} />
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: DARK_BG }}
        animate={{ opacity: dark ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  )
}
