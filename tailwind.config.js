/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/App.{js,jsx,ts,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#FE8C00',
        white: {
          DEFAULT: '#ffffff',
          100: '#fafafa',
          200: '#fbfbfb',
        },
        gray: {
          100: '#858585',
          200: '#878787',
        },
        dark: {
          100: '#181C2E',
        },
        error: '#F14141',
        success: '#2F9B65',
        softPink: '#FAF1F1',
        softBeige: '#FAF5ED',
      },
      fontFamily: {
        quicksand: ['Quicksand-Regular', 'sans-serif'],
        'quicksand-bold': ['Quicksand-Bold', 'sans-serif'],
        'quicksand-semibold': ['Quicksand-SemiBold', 'sans-serif'],
        'quicksand-light': ['Quicksand-Light', 'sans-serif'],
        'quicksand-medium': ['Quicksand-Medium', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
