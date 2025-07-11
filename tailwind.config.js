/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // If you're using the App Router (Next.js 13+):
    // "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bevietnam: ['Be Vietnam Pro', 'sans-serif'],
        emoji: [
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          'NotoColorEmoji',
          'sans-serif'
        ],
      },
    },
  },
  plugins: [],
};
