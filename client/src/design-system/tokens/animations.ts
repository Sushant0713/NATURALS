export const durations = {
  fast: '150ms',
  normal: '250ms',
  slow: '400ms',
  slower: '600ms',
} as const;

export const easings = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const keyframes = {
  'fade-in': {
    from: { opacity: '0' },
    to: { opacity: '1' },
  },
  'fade-out': {
    from: { opacity: '1' },
    to: { opacity: '0' },
  },
  'slide-up': {
    from: { opacity: '0', transform: 'translateY(12px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'slide-down': {
    from: { opacity: '0', transform: 'translateY(-12px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
  'scale-in': {
    from: { opacity: '0', transform: 'scale(0.95)' },
    to: { opacity: '1', transform: 'scale(1)' },
  },
  shimmer: {
    '0%': { backgroundPosition: '-200% 0' },
    '100%': { backgroundPosition: '200% 0' },
  },
  'pulse-soft': {
    '0%, 100%': { opacity: '1' },
    '50%': { opacity: '0.7' },
  },
  'drop-letter': {
    '0%': { transform: 'translateY(-150px)', opacity: '0' },
    '60%': { transform: 'translateY(10px)', opacity: '1' },
    '80%': { transform: 'translateY(-5px)' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  'slide-in-left': {
    from: { opacity: '0', transform: 'translateX(-120px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
  'slide-in-right': {
    from: { opacity: '0', transform: 'translateX(120px)' },
    to: { opacity: '1', transform: 'translateX(0)' },
  },
} as const;

export const animations = {
  'fade-in': 'fade-in 0.3s ease-out',
  'fade-out': 'fade-out 0.2s ease-in',
  'slide-up': 'slide-up 0.4s ease-out',
  'slide-down': 'slide-down 0.4s ease-out',
  'scale-in': 'scale-in 0.25s ease-out',
  shimmer: 'shimmer 2s linear infinite',
  'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
  'drop-letter': 'drop-letter 1.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) both',
  'slide-in-left': 'slide-in-left 1.5s cubic-bezier(0.16, 1, 0.3, 1) both',
  'slide-in-right': 'slide-in-right 1.5s cubic-bezier(0.16, 1, 0.3, 1) both',
} as const;
