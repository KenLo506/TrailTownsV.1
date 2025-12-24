/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Animal Crossing-inspired color palette
        'ac-green': {
          light: '#B8E6B8',
          DEFAULT: '#8FD08F',
          dark: '#6BA66B',
        },
        'ac-yellow': {
          light: '#FFF9C4',
          DEFAULT: '#FFE082',
          dark: '#FFC107',
        },
        'ac-brown': {
          light: '#D7CCC8',
          DEFAULT: '#A1887F',
          dark: '#6D4C41',
        },
        'ac-cream': '#FFF8E7',
        'ac-sky': '#B3E5FC',
        'ac-pink': '#F8BBD0',
      },
    },
  },
  plugins: [],
}