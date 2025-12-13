/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        sweet: {
          50: '#fef8f3',
          100: '#fde8d8',
          200: '#fad0b1',
          300: '#f7b88a',
          400: '#f4a063',
          500: '#d97706',
          600: '#a85005',
          700: '#7c3a04',
          800: '#5a2802',
          900: '#3d1c01',
        },
      },
    },
  },
  plugins: [],
}