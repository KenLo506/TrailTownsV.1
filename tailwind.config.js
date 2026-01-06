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
        'ac-cream': '#FFF8E1',
        'ac-sky': '#B3E5FC',
        'ac-pink': '#F8BBD0',
      },
      fontFamily: {
        'quicksand': ['Quicksand-Regular', 'Quicksand-Bold', 'Quicksand-SemiBold'],
        'nunito': ['Nunito-Regular', 'Nunito-Bold', 'Nunito-SemiBold'],
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}