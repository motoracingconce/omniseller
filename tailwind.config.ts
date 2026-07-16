import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef9ff',
          100: '#d8f1ff',
          200: '#b9e8ff',
          300: '#89dbff',
          400: '#52c4ff',
          500: '#2aa4ff',
          600: '#1585f5',
          700: '#0e6de1',
          800: '#1158b6',
          900: '#144c8f',
          950: '#112f57',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
