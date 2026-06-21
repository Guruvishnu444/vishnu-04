export const buttonMotionProps = {
  whileHover: { y: -2, scale: 1.03, transition: { type: 'spring', stiffness: 400, damping: 25, mass: 0.8 } },
  whileTap: { scale: 0.96, transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 } },
}

export const iconMotionProps = {
  whileHover: { y: -3, scale: 1.1, transition: { type: 'spring', stiffness: 420, damping: 22, mass: 0.6 } },
  whileTap: { scale: 0.92, transition: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 } },
}

export const cardMotionProps = {
  whileHover: { y: -6, transition: { type: 'spring', stiffness: 300, damping: 30, mass: 1.1 } },
}
