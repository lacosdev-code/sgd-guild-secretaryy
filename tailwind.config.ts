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
        success: "#0F6E56",
        danger: "#993C1D",
        charcoal: "#2C2C2A",
        background: {
          DEFAULT: '#F5F3EE',
          dark: '#0F1B2D',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1B2E52',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#2A3F6B',
        }
      },
    },
  },
  plugins: [],
};
export default config;
