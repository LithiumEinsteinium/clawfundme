/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'claw-green': '#00ff88',
        'claw-dark': '#0a0a0a',
        'claw-gray': '#1a1a2e',
      },
    },
  },
  plugins: [],
}
