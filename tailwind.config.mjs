/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFBF5",
          100: "#FFF3E3",
          200: "#FFE6C8"
        },
        orange: {
          100: "#FFE0CC",
          200: "#F8C3A4",
          300: "#F2A678"
        },
        terracotta: {
          200: "#E6B39A",
          300: "#D79A80",
          400: "#C87A5A"
        },
        cocoa: {
          400: "#8A6458",
          500: "#6B4B3E",
          600: "#53372E"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(107, 75, 62, 0.12)",
        softer: "0 6px 16px rgba(107, 75, 62, 0.10)"
      },
      borderRadius: {
        blob: "28px"
      }
    }
  },
  plugins: []
};

