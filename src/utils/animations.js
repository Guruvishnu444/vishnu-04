// Premium animation utilities and variants
export const ease = {
  smooth: [0.43, 0.13, 0.23, 0.96],
  spring: { type: "spring", stiffness: 300, damping: 30 },
  elastic: { type: "spring", stiffness: 400, damping: 25 },
  soft: [0.25, 0.46, 0.45, 0.94],
};

// Stagger configurations
export const stagger = {
  fast: 0.05,
  medium: 0.1,
  slow: 0.15,
};

// Hero section animations
export const heroVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: ease.smooth,
      },
    },
  },
  title: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: ease.smooth,
      },
    },
  },
};

// Section reveal animations
export const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: ease.smooth,
    },
  },
};

// Card animations
export const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: ease.smooth,
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: ease.spring,
    },
  },
};

// Grid stagger animations
export const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger.medium,
      delayChildren: 0.1,
    },
  },
};

export const gridItemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: ease.smooth,
    },
  },
};

// Timeline animations
export const timelineVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: ease.smooth,
    },
  },
};

// Button hover animations
export const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: ease.smooth,
    },
  },
  tap: { scale: 0.98 },
};

// Magnetic effect for interactive elements
export const magneticEffect = (e, ref, strength = 0.3) => {
  if (!ref.current) return { x: 0, y: 0 };
  
  const rect = ref.current.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const deltaX = (e.clientX - centerX) * strength;
  const deltaY = (e.clientY - centerY) * strength;
  
  return { x: deltaX, y: deltaY };
};

// Scroll-triggered animations
export const useScrollAnimation = () => {
  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: "-100px" },
  };
};

// Reduced motion check
export const shouldReduceMotion = () => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};
