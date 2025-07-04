/** @type {import('tailwindcss').Config} */
// tailwind.config.js
import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake", "retro", "coffee", "forest", "dracula", "business", "aqua", "luxury", "night", "valentine", "pastel", "winter", "lemonade", "garden", "emerald", "black", "lofi"], // Add all you plan to use
    // require('@tailwindcss/aspect-ratio'),
  },
}


