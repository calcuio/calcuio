/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcdcff',
          300: '#8ec5ff',
          400: '#59a3ff',
          500: '#2f7fff',
          600: '#1a63f0',
          700: '#154fd9',
          800: '#1742b0',
          900: '#193c8a',
          950: '#11234d',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        surface: {
          light: '#ffffff',
          'light-subtle': '#f7f8fa',
          'light-muted': '#eef0f4',
          dark: '#0b0d12',
          'dark-subtle': '#12151c',
          'dark-muted': '#1a1f29',
          'dark-border': '#252b38',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        'soft-lg': '0 4px 16px -2px rgba(15,23,42,0.08), 0 2px 6px -2px rgba(15,23,42,0.06)',
        'soft-xl': '0 12px 40px -8px rgba(15,23,42,0.12), 0 4px 12px -4px rgba(15,23,42,0.08)',
        'glow': '0 0 0 1px rgba(47,127,255,0.18), 0 8px 30px -6px rgba(47,127,255,0.22)',
        'dark-soft': '0 1px 2px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)',
        'dark-lg': '0 4px 16px -2px rgba(0,0,0,0.4), 0 2px 6px -2px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'xl2': '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-down': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-in-up': 'fade-in-up 0.3s ease-out',
        'scale-in': 'scale-in 0.18s ease-out',
        'slide-down': 'slide-down 0.2s ease-out',
        'pulse-soft': 'pulse-soft 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};
