/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      colors: {
        charcoal: '#111111',
        electric: '#3B82F6',
        magenta: '#EC4899',
        neon: '#10B981',
        softwhite: '#F1F5F9',
        mutedgray: '#94A3B8',
      },
    },
  },
  plugins: [],
}
