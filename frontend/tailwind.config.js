/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: '#f4f7fb',
          100: '#e8eff7',
          200: '#ccdcee',
          300: '#a0c0e0',
          400: '#6c9ecf',
          500: '#467ebc',
          600: '#3363a0',
          700: '#2b5083',
          800: '#26446d',
          900: '#1b2c48',
          950: '#0f172a',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        sage: {
          50: '#f2f9f6',
          100: '#e1f2eb',
          200: '#c5e6d8',
          300: '#9bd2be',
          400: '#6bb79e',
          500: '#489b82',
          600: '#367c69',
          700: '#2e6355',
          800: '#285046',
          900: '#24433b',
          950: '#102621',
        },
        warm: {
          50: '#faf9f6',
          100: '#f5f3ee',
          200: '#e9e4db',
          300: '#d9d0c2',
          400: '#c1b3a1',
          500: '#a89783',
          600: '#8d7c6b',
          700: '#716255',
          800: '#5c5047',
          900: '#4d433c',
          950: '#29231f',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'soft-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08)',
        'rose-glow': '0 0 25px -5px rgba(244, 63, 94, 0.25)',
        'sapphire-glow': '0 0 25px -5px rgba(70, 126, 188, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
