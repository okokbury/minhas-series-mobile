/** @type {import('tailwindcss').Config} */
module.exports = {
  // Onde o Tailwind procura className. Se faltar uma pasta aqui, as classes dela são ignoradas.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: { extend: {} },
  plugins: [],
};