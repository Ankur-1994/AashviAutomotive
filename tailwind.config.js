/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "#0B3B74", // deep blue
        secondary: "#FF7A18", // orange
        accent: "#FF9A4A", // light orange
        bgLight: "#F7FAFC",
        textDark: "#0f172a",
      },
      animation: {
        gradientMove: "gradientMove 12s ease-in-out infinite",
      },
      keyframes: {
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
