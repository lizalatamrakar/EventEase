/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#0b0c16',
          800: '#141627',
          700: '#1a1c32',
          600: '#252845',
          500: '#32365a',
        },
        brand: {
          50:  '#f0f4ff',
          100: '#dde8ff',
          200: '#c3d4fe',
          300: '#9db6fc',
          400: '#7b96f9',
          500: '#6272f5',
          600: '#5057e8',
          700: '#4145ce',
          800: '#363aa7',
          900: '#303683',
        },
        accent: {
          500: '#a855f7',
          400: '#c084fc',
          300: '#d8b4fe',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
