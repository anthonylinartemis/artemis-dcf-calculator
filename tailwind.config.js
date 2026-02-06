/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode lavender
        'artemis-bg': '#f8f7ff',
        'artemis-card': '#ffffff',
        'artemis-border': '#e4e0f5',
        'artemis-accent': '#7c6dd8',
        'artemis-accent-hover': '#6b5cc7',
        'artemis-text': '#1a1625',
        'artemis-text-muted': '#6b6580',
        // Dark mode
        'artemis-dark-bg': '#2d2a4a',
        'artemis-dark-card': '#3d3a5a',
        'artemis-dark-border': '#4d4a6a',
        'artemis-dark-accent': '#9d8df1',
        'artemis-dark-text': '#e5e5e5',
        'artemis-dark-text-muted': '#9ca3af',
        // Semantic
        'artemis-green': '#22c55e',
        'artemis-red': '#ef4444',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
