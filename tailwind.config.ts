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
          800: "#0F172A",
          900: "#0B132B",
          950: "#050B18",
        },
        cyan: {
          400: "#22D3EE",
          500: "#06B6D4",
        },
        slate: {
          850: "#152033",
        },
      },
    },
  },
  plugins: [],
};
export default config;
