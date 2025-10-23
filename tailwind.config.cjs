/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        primary: { DEFAULT: "#2563eb", light: "#3b82f6", dark: "#1e40af" },
        surface: { light: "rgba(255,255,255,0.8)", dark: "rgba(17,25,40,0.8)" }
      },
      boxShadow: { glass: "0 4px 30px rgba(0, 0, 0, 0.08)" },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
