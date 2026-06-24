/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Archivo"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'monospace'],
      },
      colors: {
        brutal: {
          bg: '#F4F1E9',
          ink: '#111111',
          yellow: '#FFE100',
          pink: '#FF8BD0',
          blue: '#4D7CFE',
          sky: '#74D2FF',
          green: '#36E07C',
          red: '#FF5A4D',
          orange: '#FF8A33',
          purple: '#A77BFF',
        },
      },
      boxShadow: {
        'brutal-xs': '1px 1px 0 0 #111111',
        'brutal-sm': '2px 2px 0 0 #111111',
        'brutal': '3px 3px 0 0 #111111',
        'brutal-lg': '4px 4px 0 0 #111111',
        'brutal-xl': '6px 6px 0 0 #111111',
      },
    },
  },
  plugins: [],
}
