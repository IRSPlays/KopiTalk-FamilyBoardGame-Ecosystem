/**
 * Framer Motion Animation Configurations
 * Reusable animation variants for consistent UI/UX across the application
 * Optimized for both mobile and desktop experiences
 */

import { Variants } from 'framer-motion'

// Container animations for page/section transitions
export const containerVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
}

// Individual item animations within containers
export const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
}

// Card hover and tap animations for interactive elements
export const cardHoverVariants = {
  hover: { 
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
}

// Tab/slide transitions for navigation
export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  })
}

// Fade in from different directions
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export const fadeInDown: Variants = {
  hidden: { 
    opacity: 0, 
    y: -40 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export const fadeInLeft: Variants = {
  hidden: { 
    opacity: 0, 
    x: -40 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export const fadeInRight: Variants = {
  hidden: { 
    opacity: 0, 
    x: 40 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

// Scale animations
export const scaleIn: Variants = {
  hidden: { 
    scale: 0, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
}

export const scaleInCenter: Variants = {
  hidden: { 
    scale: 0.8, 
    opacity: 0 
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

// List stagger animations
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.3 
    }
  }
}

// Modal/Overlay animations
export const modalBackdropVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.2 
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2 
    }
  }
}

export const modalContentVariants: Variants = {
  hidden: { 
    scale: 0.9, 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    scale: 1, 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 25,
      stiffness: 300
    }
  },
  exit: { 
    scale: 0.9, 
    opacity: 0, 
    y: 20,
    transition: { 
      duration: 0.2 
    }
  }
}

// Progress bar animation
export const progressBarVariants = {
  initial: { 
    width: 0 
  },
  animate: (progress: number) => ({ 
    width: `${progress}%`,
    transition: { 
      duration: 0.8, 
      ease: "easeOut" 
    }
  })
}

// Number counter animation
export const counterVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.5 
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
}

// Button interactions
export const buttonVariants = {
  idle: { 
    scale: 1 
  },
  hover: { 
    scale: 1.05,
    transition: { 
      duration: 0.2 
    }
  },
  tap: { 
    scale: 0.95,
    transition: { 
      duration: 0.1 
    }
  }
}

// Notification/Toast animations
export const notificationVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -50, 
    scale: 0.3 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 25
    }
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.5,
    transition: { 
      duration: 0.2 
    }
  }
}

// Mobile swipe gestures
export const swipeConfidenceThreshold = 10000
export const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

// Stagger animations with custom delays
export const staggerContainer = (staggerChildren: number = 0.1, delayChildren: number = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren
    }
  }
})

// Responsive animation durations based on reduced motion preference
export const getAnimationDuration = (baseDuration: number = 0.3): number => {
  // Check if user prefers reduced motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return baseDuration * 0.3 // Reduce animation time by 70%
  }
  return baseDuration
}

// Spring configurations for different use cases
export const springConfigs = {
  gentle: { type: "spring" as const, stiffness: 100, damping: 20 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 15 },
  stiff: { type: "spring" as const, stiffness: 500, damping: 30 },
  slow: { type: "spring" as const, stiffness: 50, damping: 25 }
}

// Easing functions
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1]
}
