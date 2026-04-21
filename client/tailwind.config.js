/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  // Any class not found here gets purged from the production build
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Custom line-clamp utility used in IssueCard description preview
      lineClamp: {
        2: '2',
        3: '3',
      },
    },
  },
  plugins: [],
};