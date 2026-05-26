import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#1B2E52",
        gold: "#C9A227",
        background: "#F5F3EE",
        success: "#0F6E56",
        danger: "#993C1D",
        charcoal: "#2C2C2A",
      },
    },
  },
  plugins: [],
};
export default config;
