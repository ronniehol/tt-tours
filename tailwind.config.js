/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#0B4C5C',
          mid: '#136B82',
          light: '#1E8FA8',
          dark: '#072E38',
        },
        brand: {
          orange: '#F97316',
          'orange-dark': '#C95A08',
          'orange-faint': 'rgba(249,115,22,0.08)',
        },
        cream: '#F7F5F2',
        'off-white': '#EDE8E0',
      },
      fontFamily: {
        display: ['BarlowCondensed_700Bold_Italic'],
        'display-regular': ['BarlowCondensed_400Regular'],
        sans: ['SpaceGrotesk_400Regular'],
        'sans-medium': ['SpaceGrotesk_500Medium'],
        'sans-bold': ['SpaceGrotesk_700Bold'],
      },
    },
  },
  plugins: [],
};
