/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,ejs}',
    './node_modules/tw-elements-react/dist/js/**/*.js',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  // eslint-disable-next-line global-require
  plugins: [require('tw-elements-react/dist/plugin.cjs')],
};
