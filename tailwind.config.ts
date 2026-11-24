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
        wood: {
          50: "#faf6f0",
          100: "#f3ebe0",
          200: "#e6d5bf",
          300: "#d6ba99",
          400: "#c49a6e",
          500: "#b5814d",
          600: "#9e683d",
          700: "#804f32",
          800: "#683f2c",
          900: "#553426",
          950: "#301b13",
        },
        charcoal: {
          50: "#f6f6f6",
          100: "#e7e7e7",
          200: "#d1d1d1",
          300: "#b0b0b0",
          400: "#888888",
          500: "#6d6d6d",
          600: "#575757",
          700: "#444444",
          800: "#2a2a2a",
          900: "#181818",
          950: "#0e0e0e",
        },
        beige: {
          50: "#fdfcf9",
          100: "#f9f6f0",
          200: "#f2ece0",
          300: "#e8ddca",
          400: "#d9c8af",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "Poppins", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft-sm': "0 2px 8px -2px rgba(24, 24, 24, 0.05)",
        'soft-md': "0 8px 24px -4px rgba(24, 24, 24, 0.07)",
        'soft-lg': "0 16px 36px -6px rgba(24, 24, 24, 0.09)",
        'soft-xl': "0 24px 48px -12px rgba(24, 24, 24, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
