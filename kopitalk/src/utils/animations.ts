/**
 * Framer Motion Animation Configurations
 * Reusable animation variants for consistent UI/UX across the application
 * Optimized for both mobile and desktop experiences
 */

import { Variants } from 'framer-motion'

/**
 * Animation variants for container elements that orchestrate the animation of their children.
 * Ideal for page-level or section-level transitions.
 */
export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

/**
 * Animation variants for individual items within a container that uses `staggerChildren`.
 * Typically used for list items or elements appearing in sequence.
 */
export const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

/**
 * A collection of variants for hover and tap interactions on card-like components.
 * Provides visual feedback when a user interacts with an element.
 */
export const cardHoverVariants = {
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Animation variants for creating a sliding transition effect, commonly used in carousels
 * or tabbed interfaces. The direction of the slide can be controlled dynamically.
 */
export const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' },
  }),
};

/** A set of variants for fading in elements from different directions. */

/** Fades an element in from the bottom. */
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/** Fades an element in from the top. */
export const fadeInDown: Variants = {
  hidden: {
    opacity: 0,
    y: -40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/** Fades an element in from the left. */
export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/** Fades an element in from the right. */
export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

/**
 * A spring-based scaling animation that makes an element "pop" into view.
 * It grows from a scale of 0 to 1 with a spring physics effect.
 */
export const scaleIn: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    },
  },
};

/**
 * A simpler scaling animation where an element grows from 80% to 100% of its size.
 * Useful for more subtle entrances, like for modals or cards.
 */
export const scaleInCenter: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

/**
 * A container variant for lists that animates its children in a staggered sequence.
 * This should be applied to the parent `motion` component.
 */
export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * An item variant for list elements designed to be used with `listContainerVariants`.
 * Each item will fade and slide in from the left.
 */
export const listItemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
    },
  },
};

/**
 * Animation variants for a modal backdrop/overlay. Fades in and out smoothly.
 */
export const modalBackdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Animation variants for the modal content itself. It appears with a slight
 * scale and slide-up effect, using spring physics for a natural feel.
 */
export const modalContentVariants: Variants = {
  hidden: {
    scale: 0.9,
    opacity: 0,
    y: 20,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Animation variants for a progress bar. The `animate` variant takes a custom
 * `progress` value (0-100) to dynamically set the width.
 */
export const progressBarVariants = {
  initial: {
    width: 0,
  },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
};

/**
 * Animation variants for a number counter, giving it a "popping" spring effect as it appears.
 */
export const counterVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
};

/**
 * A simple set of variants for button interactions, providing visual feedback
 * for hover and tap states.
 */
export const buttonVariants = {
  idle: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

/**
 * Animation variants for notification or "toast" messages.
 * The notification appears with a spring effect and exits by fading and shrinking.
 */
export const notificationVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.3,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.5,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * A threshold used in swipe gestures to determine if a swipe is strong enough to trigger an action.
 */
export const swipeConfidenceThreshold = 10000;

/**
 * Calculates the power of a swipe gesture based on its offset and velocity.
 * @param {number} offset - The distance the element was dragged.
 * @param {number} velocity - The velocity of the drag gesture.
 * @returns {number} The calculated swipe power.
 */
export const swipePower = (offset: number, velocity: number): number => {
  return Math.abs(offset) * velocity;
};

/**
 * A factory function that creates a stagger container variant with customizable delays.
 * @param {number} [staggerChildren=0.1] - The delay between each child's animation.
 * @param {number} [delayChildren=0] - The delay before the first child's animation starts.
 * @returns {Variants} A Framer Motion Variants object for a stagger container.
 */
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/**
 * Returns an animation duration, adjusted for the user's "prefers-reduced-motion" setting.
 * @param {number} [baseDuration=0.3] - The default duration for the animation.
 * @returns {number} The adjusted animation duration.
 */
export const getAnimationDuration = (baseDuration = 0.3): number => {
  // Check if user prefers reduced motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return baseDuration * 0.3; // Reduce animation time by 70%
  }
  return baseDuration;
};

/**
 * A collection of pre-configured spring physics settings for different animation feels.
 */
export const springConfigs = {
  gentle: { type: 'spring' as const, stiffness: 100, damping: 20 },
  bouncy: { type: 'spring' as const, stiffness: 300, damping: 15 },
  stiff: { type: 'spring' as const, stiffness: 500, damping: 30 },
  slow: { type: 'spring' as const, stiffness: 50, damping: 25 },
};

/**
 * A collection of standard cubic-bezier easing functions for use in transitions.
 */
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  sharp: [0.4, 0, 0.6, 1],
};
