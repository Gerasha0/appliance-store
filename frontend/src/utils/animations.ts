/**
 * Animations utility - Reusable animation variants for Framer Motion
 * Can be used with Material-UI components with animation libraries
 */

/**
 * Fade in animation
 */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

/**
 * Slide up animation
 */
export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.3 },
};

/**
 * Slide down animation
 */
export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};

/**
 * Scale animation
 */
export const scale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { duration: 0.2 },
};

/**
 * Slide from left
 */
export const slideFromLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: 0.3 },
};

/**
 * Slide from right
 */
export const slideFromRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
  transition: { duration: 0.3 },
};

/**
 * Stagger children animation (for lists)
 */
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Spring animation
 */
export const spring = {
  type: 'spring',
  stiffness: 300,
  damping: 20,
};

/**
 * Bounce animation
 */
export const bounce = {
  initial: { scale: 0 },
  animate: {
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 15,
    },
  },
};

/**
 * CSS keyframes for loading animations
 */
export const cssAnimations = {
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,
  spin: `
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }
  `,
  fadeInOut: `
    @keyframes fadeInOut {
      0%, 100% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
    }
  `,
};

/**
 * Material-UI sx props for animations
 */
export const muiAnimations = {
  fadeIn: {
    '@keyframes fadeIn': {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animation: 'fadeIn 0.3s ease-in',
  },
  slideUp: {
    '@keyframes slideUp': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animation: 'slideUp 0.3s ease-out',
  },
  pulse: {
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    animation: 'pulse 2s ease-in-out infinite',
  },
  spin: {
    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    animation: 'spin 1s linear infinite',
  },
};

