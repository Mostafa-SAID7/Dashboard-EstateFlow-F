/** @type {import('tailwindcss').Config} */
const primeui = require("tailwindcss-primeui");

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edf9f3',
          100: '#d7f1e3',
          200: '#afe3c7',
          300: '#7bcea8',
          400: '#4ab587',
          500: '#218a67',
          600: '#177354',
          700: '#125b45',
          800: '#104838',
          900: '#0b332a',
        },
        secondary: {
          50: '#f8f7f2',
          100: '#f0eee6',
          200: '#dfddd2',
          300: '#c9c6b8',
          400: '#aaa695',
          500: '#8c8878',
          600: '#6f6b5e',
          700: '#595549',
          800: '#403e35',
          900: '#2d2b26',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'DM Sans', 'ui-sans-serif', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-in-from-top-2': 'slideInFromTop 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromTop: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(-8px)',
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(25, 43, 35, 0.04)',
        'md': '0 6px 18px -8px rgba(25, 43, 35, 0.16)',
        'lg': '0 16px 35px -16px rgba(25, 43, 35, 0.22)',
        'xl': '0 24px 50px -22px rgba(25, 43, 35, 0.28)',
      },
    },
  },
  plugins: [primeui],
}

