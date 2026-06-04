import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        kompas: {
          cream: "#fbf7ef",
          paper: "#fffdf8",
          ink: "#24342f",
          muted: "#60706a",
          line: "#e4ded2",
          green: "#2f6f5e",
          greenSoft: "#dcebe4",
          sand: "#f0e3cf",
          safety: "#8a3b2f"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(36, 52, 47, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
