/** @type {import('tailwindcss').Config} */const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'class',
  //['class', '[data-mode="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'pale': colors.stone,
      }
    },
  },
  plugins: [require("tailwindcss-fluid-type"),
  require('@whiterussianstudio/tailwind-easing')],
};
