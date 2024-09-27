/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Note the change here: **/* instead of */
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
