/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        accent: "var(--accent-color)",
        danger: "var(--danger-color)",
        dark: "var(--bg-color)",
        "dark-card": "var(--card-bg)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        shake: "shake 0.3s ease-in-out",
        "pulse-glow": "pulse-glow 2s infinite",
      },
    },
  },
  plugins: [],
};
