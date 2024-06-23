/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,jsx,tsx}',
    // you can either add all styles
    '../../node_modules/@rewind-ui/core/dist/theme/styles/*.js',
    // OR you can add only the styles you need
    '../../node_modules/@rewind-ui/core/dist/theme/styles/Button.styles.js',
    '../../node_modules/@rewind-ui/core/dist/theme/styles/Text.styles.js',
  ],
  theme: {
    extend: {
      minWidth: {
        500: '500px', // Custom min-width class
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes
    }),
  ],
};
