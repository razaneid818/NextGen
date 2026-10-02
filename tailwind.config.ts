import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: "#4F39A7",
          50: "#F2EEFB",
          100: "#E3DBF6",
          500: "#4F39A7",
          600: "#3E2C89",
          700: "#2F2168",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          50: "#FFF0F0",
          100: "#FFDADA",
          500: "#FF6B6B",
          600: "#F24E4E",
        },
        navy: {
          DEFAULT: "#1B1E3C",
          900: "#12142B",
        },
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Outfit", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
