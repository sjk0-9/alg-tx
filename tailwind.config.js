const colors = require('tailwindcss/colors')

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
      }
    },
  },
  plugins: [],
}
