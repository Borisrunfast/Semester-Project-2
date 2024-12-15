/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#047857',
        },
        secondary: {
          DEFAULT: '#E5E7EB',
        },
        accent: '#84CC16',
        text: '#1F2937',
        background: '#FFFFFF',
        
        error: {
          DEFAULT: '#B91C1C',
        }
      },
    },
  },
  plugins: [],
}
