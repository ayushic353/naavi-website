/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"Jost"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        obsidian: '#0a0a0a',
        charcoal: '#141414',
        graphite: '#1e1e1e',
        iron: '#2a2a2a',
        ash: '#3d3d3d',
        mist: '#6b6b6b',
        silver: '#a8a8a8',
        pearl: '#e8e4de',
        gold: '#c9a96e',
        'gold-light': '#e2c99a',
        ember: '#c45c3a',
        rouge: '#8b2635',
        sage: '#6b7c5e',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-right': 'slideRight 0.3s ease forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
