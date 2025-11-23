/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      colors: {
        gold: {
          400: '#D4AF37',
          500: '#C5A028',
          600: '#B08D26',
        },
        obsidian: '#0F0F11',
        charcoal: '#1C1C1E',
      }
    }
  },
  plugins: []
}
