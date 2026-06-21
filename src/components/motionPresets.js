// ── 2. Spring physics presets for micro-interactions ──────────────
//
// Framer Motion springs are defined by three numbers:
//   stiffness — how strongly it pulls toward the target (higher = snappier)
//   damping   — how much it resists oscillation (higher = less bounce)
//   mass      — how heavy the object "feels" (higher = slower, more inertia)
//
// The relationship that matters: damping/stiffness ratio controls bounce.
// Low damping relative to stiffness = springy/bouncy. High damping = smooth,
// no overshoot. For UI chrome (buttons, icons, cards) you want CONFIDENT
// but NOT bouncy — a bounce on every hover reads as toy-like, not premium.

export const springs = {
  // Buttons: quick, slight overshoot on hover for "organic" feel,
  // but settles fast. stiffness:400 + damping:25 gives a tiny bounce
  // (~3-4% overshoot) that's felt more than seen — premium apps like
  // Linear and Vercel use this exact range.
  button: {
    hover: { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 },
    tap: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }, // tap should feel instant + firm
  },

  // Social icons: slightly bouncier than buttons since they're smaller
  // and decorative — a little personality here doesn't compete with
  // primary actions. mass is lower (0.6) so they feel "light."
  icon: {
    hover: { type: 'spring', stiffness: 420, damping: 22, mass: 0.6 },
    tap: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 },
  },

  // Cards: heavier mass (1.1) and higher damping (30) — bigger elements
  // should feel like they have real weight. No overshoot at all; a card
  // bouncing on hover looks unstable, not premium.
  card: {
    hover: { type: 'spring', stiffness: 300, damping: 30, mass: 1.1 },
  },
}

// ── Standard motion props you spread onto any element ──
// whileHover/whileTap take a plain object of target values; the
// `transition` key inside *that* object is how you attach a specific
// spring to that specific gesture (hover gets one feel, tap another).

export const buttonMotionProps = {
  whileHover: { y: -2, scale: 1.03, transition: springs.button.hover },
  whileTap: { scale: 0.96, transition: springs.button.tap },
}

export const iconMotionProps = {
  whileHover: { y: -3, scale: 1.1, transition: springs.icon.hover },
  whileTap: { scale: 0.92, transition: springs.icon.tap },
}

export const cardMotionProps = {
  whileHover: { y: -6, transition: springs.card.hover },
}

/* ── Usage ──

import { motion } from 'framer-motion'
import { buttonMotionProps, iconMotionProps, cardMotionProps } from './motionPresets'

<motion.button {...buttonMotionProps} className="...">Click me</motion.button>
<motion.a {...iconMotionProps} className="...">icon</motion.a>
<motion.div {...cardMotionProps} className="...">card content</motion.div>

This is exactly what's already wired into Hero.jsx, Navbar.jsx, About.jsx,
Contact.jsx, etc in your current build — this file just centralizes the
numbers so you tune them ONCE instead of hunting through 8 files.
*/
