/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kontent-primary': '#F05A22',
        'kontent-secondary': '#00A8C8',
        'kontent-dark': '#1A1A1A',
        'kontent-light': '#F8F9FA',
      },
    },
  },
  plugins: [],
}