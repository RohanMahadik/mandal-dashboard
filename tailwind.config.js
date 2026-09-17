/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mukta: ['Mukta', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'Mukta', 'sans-serif'],
        calligraphy: ['Rozha One', 'Yatra One', 'Mukta', 'cursive'],
        sans: ['Poppins', 'Mukta', 'sans-serif'],
      },
      colors: {
        mandal: {
          navy: '#0f172a',
          navydark: '#090d16',
          blue: '#2563eb',
          saffron: '#f97316',
          maroon: '#991b1b',
        }
      }
    },
  },
  plugins: [],
}
