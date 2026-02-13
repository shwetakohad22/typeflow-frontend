/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#14b8a6", // teal-500
        secondary: "#64748b", // slate-500
        accent: "#f59e0b", // amber-500
        danger: "#ef4444", // red-500
        dark: "#0d1117", // github dark
        "dark-card": "#161b22", // github dark card
      },
    },
  },
  plugins: [],
};
