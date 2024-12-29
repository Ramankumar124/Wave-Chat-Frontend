/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    ],
  theme: {
  	extend: {

		animation: {
			enter: 'fadeIn 0.5s ease-out',
			leave: 'fadeOut 0.5s ease-in',
		  },
		  keyframes: {
			fadeIn: {
			  from: { opacity: 0 },
			  to: { opacity: 1 },
			},
			fadeOut: {
			  from: { opacity: 1 },
			  to: { opacity: 0 },
			},
		  },

  		}
  	
  },
  plugins: [require("tailwindcss-animate")],
  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
}

