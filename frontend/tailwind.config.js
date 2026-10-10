/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Earthy, farm-friendly palette
        brand: {
          50: '#f2fbf3',
          100: '#e1f6e3',
          200: '#c3ecd0',
          300: '#95dbab',
          400: '#5ec281',
          500: '#37a861',
          600: '#27894d',
          700: '#216d40',
          800: '#1d5736',
          900: '#19482e',
        },
        soil: {
          50: '#faf7f2',
          100: '#f0e9dd',
          200: '#e0d0b8',
          300: '#cbb08a',
          400: '#b89064',
          500: '#a67a4e',
          600: '#8c6142',
          700: '#704b39',
          800: '#5d4033',
          900: '#4e362d',
        },
      },
    },
  },
  plugins: [],
}
