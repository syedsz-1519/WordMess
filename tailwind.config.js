/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wm: {
          correct: 'var(--wm-correct)',
          present: 'var(--wm-present)',
          absent: 'var(--wm-absent)',
          'bg-dark': 'var(--wm-bg-dark)',
          'bg-light': 'var(--wm-bg-light)',
          surface: 'var(--wm-surface)',
          border: 'var(--wm-border)',
          text: 'var(--wm-text)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
