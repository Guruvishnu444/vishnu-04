// ── 1. Dynamic smooth background transition ──────────────────────
//
// THE PROBLEM with inline style={{ backgroundColor: c.bg }}:
// React just swaps the CSS value on re-render — the browser does NOT
// animate background-color changes unless you tell it to. So toggling
// theme currently "pops" instantly even though everything *around* it
// (text, borders) has a CSS transition.
//
// THE FIX: don't animate backgroundColor directly (color interpolation
// via plain CSS transitions on hex values can look muddy mid-fade).
// Instead, layer TWO solid divs — dark and light — and crossfade their
// OPACITY with Framer Motion. Opacity transitions are GPU-accelerated
// and never produce a muddy intermediate color; you get a clean dissolve.
//
// This replaces the single <div style={{ backgroundColor: c.bg }} />
// at the top of NarrativeBackground.jsx (and InteractiveBackground.jsx
// if you're still using that one).

import { motion } from 'framer-motion'
import { useTheme } from '../ThemeContext'

const DARK_BG = '#0b0f19'   // deep cosmic navy-black
const LIGHT_BG = '#f8fafc'  // soft clean off-white

export function ThemeBackdrop() {
  const { dark } = useTheme()

  return (
    <div className="absolute inset-0">
      {/* Light layer — always present underneath */}
      <div className="absolute inset-0" style={{ backgroundColor: LIGHT_BG }} />

      {/* Dark layer — crossfades in/out on top via opacity, not color interpolation */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: DARK_BG }}
        animate={{ opacity: dark ? 1 : 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ── Usage inside NarrativeBackground.jsx ──
// Replace:
//   <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: c.bg }} />
// With:
//   <ThemeBackdrop />
//
// Why 0.5s + easeInOut specifically:
// - 0.5s is long enough to read as an intentional "mode change" rather
//   than a glitch, short enough that it doesn't feel laggy when someone
//   is rapidly toggling to compare modes.
// - easeInOut (slow-fast-slow) reads as "settling into a new state" —
//   linear feels mechanical, easeOut alone would snap to the new theme
//   too abruptly at the start.
