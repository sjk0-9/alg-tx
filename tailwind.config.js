const colors = require('tailwindcss/colors')

// See: https://stackoverflow.com/a/5624139
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return `rgb(${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)})`;
};

const externalLinkSvgBuilder = fillColor => `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="${hexToRgb(fillColor)}"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>')`;

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: colors.teal['700'],
        // Primary hover
        'primary-h': colors.teal['800'],
        'primary-a': colors.teal['900'],
        subtle: colors.zinc['400'],
        'subtle-h': colors.zinc['500'],
        'subtle-a': colors.zinc['600'],
        grey: colors.zinc,
      },
      content: ( { theme }) => ({
        'external-link': externalLinkSvgBuilder(theme('colors.primary')),
        'external-link-h': externalLinkSvgBuilder(theme('colors.primary-h')),
        'external-link-a': externalLinkSvgBuilder(theme('colors.primary-a')),
      })
    },
  },
  plugins: [],
}

