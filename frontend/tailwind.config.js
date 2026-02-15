/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#44D7B6',
          600: '#14b8a6',
          700: '#0d9488',
          800: '#0f766e',
          900: '#115e59',
        },
        accent: {
          400: '#44D7B6',
          500: '#2dd4bf',
          600: '#14b8a6',
          700: '#0d9488',
        },
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(to top right, #115e59 0%, #0f766e 35%, #0d9488 60%, #44D7B6 100%)',
        'gradient-hero-overlay': 'linear-gradient(to top right, rgba(17,94,89,0.92) 0%, rgba(13,148,136,0.75) 50%, rgba(68,215,182,0.5) 100%)',
        'gradient-card': 'linear-gradient(145deg, #f0fdfa 0%, #ccfbf1 50%, #f0fdfa 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
