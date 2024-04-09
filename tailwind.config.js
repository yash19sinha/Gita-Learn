/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        'custom-small': '0.875rem', // Example custom font size
        'custom-base': '1rem',      // Example custom base font size
        'custom-large': '1.25rem',  // Example custom large font size
        // Add more custom sizes as needed
      },
    },
  },
  plugins: [require("daisyui")],
}
