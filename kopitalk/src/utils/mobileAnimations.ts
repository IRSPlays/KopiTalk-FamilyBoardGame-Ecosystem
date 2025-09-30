/**
 * Mobile Animation Utilities
 * Provides touch-optimized Framer Motion animation variants and utilities
 * Compatible with all mobile devices (iOS, Android, tablets)
 */

import { Variants, Transition } from 'framer-motion'

// Detect if device is mobile/touch-enabled
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0)
}

// Mobile-optimized spring transition
export const mobileSpring: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 0.8
}

// Touch-optimized button animations
export const touchButtonVariants: Variants = {
  rest: {
    scale: 1,
    transition: mobileSpring
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: mobileSpring
  },
  tap: {
    scale: 0.95,
    transition: {
      ...mobileSpring,
      duration: 0.1
    }
  }
}

// Card entrance animations (mobile-optimized)
export const mobileCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.05,
      ...mobileSpring
    }
  }),
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
}

// Slide animations for mobile navigation
export const mobileSlideVariants: Variants = {
  enter: (direction: number = 1) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: mobileSpring
  },
  exit: (direction: number = 1) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  })
}

// Modal/Dialog animations for mobile
export const mobileModalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: 50,
    transition: {
      duration: 0.2
    }
  }
}

// List item stagger animations
export const mobileListContainerVariants: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

export const mobileListItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: mobileSpring
  }
}

// Swipe gesture configurations for mobile
export const swipeConfidenceThreshold = 10000
export const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

// Tap/Press feedback for mobile buttons
export const mobileTapFeedback = {
  scale: 0.95,
  transition: {
    duration: 0.1,
    ease: 'easeInOut'
  }
}

// Floating/Pulsing animation for notifications
export const mobileFloatingVariants: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
}

// Success/Error shake animation
export const mobileShakeVariants: Variants = {
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.4
    }
  }
}

// Loading spinner for mobile
export const mobileSpinnerVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear'
    }
  }
}

// Utility: Get appropriate animation based on device type
export const getResponsiveAnimation = (
  desktopVariant: Variants,
  mobileVariant: Variants
): Variants => {
  return isMobileDevice() ? mobileVariant : desktopVariant
}

// Utility: Touch-safe drag constraints
export const mobileDragConstraints = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0
}

// Page transition variants for mobile
export const mobilePageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
}

// Bottom sheet animation for mobile
export const mobileBottomSheetVariants: Variants = {
  hidden: {
    y: '100%',
    transition: {
      type: 'spring',
      damping: 30
    }
  },
  visible: {
    y: 0,
    transition: {
      type: 'spring',
      damping: 30
    }
  }
}

// Tab switch animation for mobile
export const mobileTabVariants: Variants = {
  inactive: {
    opacity: 0.6,
    scale: 0.95
  },
  active: {
    opacity: 1,
    scale: 1,
    transition: mobileSpring
  }
}

// Icon rotation for mobile (e.g., chevrons, arrows)
export const mobileIconRotateVariants: Variants = {
  up: {
    rotate: 180,
    transition: mobileSpring
  },
  down: {
    rotate: 0,
    transition: mobileSpring
  }
}

// Badge pulse animation for notifications
export const mobileBadgePulseVariants: Variants = {
  pulse: {
    scale: [1, 1.2, 1],
    transition: {
      duration: 1,
      repeat: Infinity
    }
  }
}

// Export all mobile animation presets
export const mobileAnimations = {
  button: touchButtonVariants,
  card: mobileCardVariants,
  slide: mobileSlideVariants,
  modal: mobileModalVariants,
  listContainer: mobileListContainerVariants,
  listItem: mobileListItemVariants,
  floating: mobileFloatingVariants,
  shake: mobileShakeVariants,
  spinner: mobileSpinnerVariants,
  page: mobilePageVariants,
  bottomSheet: mobileBottomSheetVariants,
  tab: mobileTabVariants,
  iconRotate: mobileIconRotateVariants,
  badgePulse: mobileBadgePulseVariants
}
