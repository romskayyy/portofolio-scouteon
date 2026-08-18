import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef3f9",
          100: "#d6e2f0",
          500: "#1d4e89",
          600: "#163c6b",
          700: "#0f2a4d",
          900: "#081729",
        },
        teal: {
          500: "#0f9b8e",
          600: "#0c7d73",
        },
      },
    },
  },
  plugins: [],
};
export default config;
