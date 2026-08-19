// tailwind.config.ts
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
          900: "#0B132B", // Warna utama (Deep Ocean)
        },
        ocean: {
          500: "#0284C7", // Warna aksen (Ocean Blue)
          600: "#0369A1",
        },
        seafoam: "#E0F2FE", // Background lembut
      },
    },
  },
  plugins: [],
};
export default config;
