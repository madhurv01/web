/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050b1a',
          900: '#0a1428',
          800: '#0d1b3a',
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 8px 32px 0 rgba(20, 184, 166, 0.15)',
        premium: '0 20px 60px -15px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
