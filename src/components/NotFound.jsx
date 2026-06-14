import { motion } from 'framer-motion'
import { useTheme } from '../ThemeContext'
import { ArrowLeft, WifiHigh, Bug } from '@phosphor-icons/react'
import { useEffect, useRef } from 'react'

function GlitchText({ text, dark }) {
  return (
    <div className="relative inline-block select-none">
      <motion.span
        className={`text-[8rem] sm:text-[12rem] font-black leading-none bg-gradient-to-r ${
          dark ? 'from-red-500 via-orange-400 to-red-400' : 'from-blue-400 via-pink-400 to-violet-500'
        } bg-clip-text text-transparent`}
        animate={{
          skewX: [0, -2, 2, 0],
          opacity: [1, 0.9, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {text}
      </motion.span>
      {/* glitch layers */}
      <motion.span
        className="absolute inset-0 text-[8rem] sm:text-[12rem] font-black leading-none text-red-500 opacity-20"
        animate={{ x: [-3, 3, -3], opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.5 }}
      >{text}</motion.span>
      <motion.span
        className="absolute inset-0 text-[8rem] sm:text-[12rem] font-black leading-none text-cyan-400 opacity-20"
        animate={{ x: [3, -3, 3], opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 2.8, delay: 0.05 }}
      >{text}</motion.span>
    </div>
  )
}

const terminalLines = [
  '> initializing route resolver...',
  '> scanning directories...',
  '> ERROR: path not found [404]',
  '> running diagnostics...',
  '> suggestion: check your URL',
  '> or just go home 🏠',
]

function TerminalBlock({ dark }) {
  const bg = dark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
  const text = dark ? 'text-green-400' : 'text-green-600'
  const muted = dark ? 'text-white/40' : 'text-black/40'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className={`border rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm text-left max-w-md mx-auto ${bg}`}
    >
      <div className={`flex items-center gap-2 mb-3 ${muted}`}>
        <span className="w-3 h-3 rounded-full bg-red-500/70" />
        <span className="w-3 h-3 rounded-full bg-orange-400/70" />
        <span className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-2">terminal — bash</span>
      </div>
      {terminalLines.map((line, i) => (
        <motion.p key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 + i * 0.18 }}
          className={`leading-relaxed ${line.includes('ERROR') ? 'text-red-400 font-bold' : text}`}>
          {line}
        </motion.p>
      ))}
    </motion.div>
  )
}

export default function NotFound() {
  const { dark } = useTheme()
  const textColor = dark ? 'text-[#f5f5f5]' : 'text-[#1a1a1a]'
  const mutedText = dark ? 'text-[#f5f5f5]/55' : 'text-[#1a1a1a]/55'
  const btnGradient = dark
    ? 'bg-gradient-to-r from-red-600 to-orange-500'
    : 'bg-gradient-to-r from-blue-400 via-pink-400 to-violet-500'

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center transition-colors duration-300 ${dark ? 'bg-black' : 'bg-white'}`}>

      {/* Floating icons */}
      <div className="relative mb-4">
        <motion.div
          animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-8 -left-12 opacity-30"
        >
          <WifiHigh size={40} className={dark ? 'text-orange-400' : 'text-violet-400'} />
        </motion.div>
        <motion.div
          animate={{ y: [8, -8, 8], rotate: [5, -5, 5] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -top-6 -right-12 opacity-30"
        >
          <Bug size={36} className={dark ? 'text-red-400' : 'text-pink-400'} />
        </motion.div>

        <GlitchText text="404" dark={dark} />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-2xl sm:text-3xl font-bold mb-3 ${textColor}`}
      >
        Server down? No — just a wrong turn!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className={`text-sm sm:text-base mb-8 max-w-sm ${mutedText}`}
      >
        The page you're looking for doesn't exist or has been moved.
        Don't worry — even the best developers hit a 404 sometimes.
      </motion.p>

      <TerminalBlock dark={dark} />

      <motion.a
        href="/"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={`mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity ${btnGradient}`}
      >
        <ArrowLeft size={18} weight="bold" />
        Back to Home
      </motion.a>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className={`mt-6 text-xs ${mutedText}`}
      >
        Error code: 404 · Page not found · Guruvishnu S Portfolio
      </motion.p>
    </div>
  )
}
