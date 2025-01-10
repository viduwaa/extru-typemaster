/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'letter-unchecked' : '#0061fe',
        'letter-correct' : '#332800',
        'letter-incorrect' : '#ff0000',
        'bg-theme' : '#fff2d5'
      }
    },
  },
  plugins: [],
}

