// PostCSS processes Tailwind's directives (@tailwind base/components/utilities)
// and autoprefixer adds vendor prefixes for cross-browser compatibility
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};