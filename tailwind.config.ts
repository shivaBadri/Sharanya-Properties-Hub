import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14171A", // deep charcoal — primary dark surface + headings
          soft: "#22262B",
          800: "#2C3138",
        },
        paper: {
          DEFAULT: "#FAF8F3", // warm off-white page background
          200: "#F2EEE4",
          300: "#EBE5D8",
        },
        gold: {
          DEFAULT: "#C6A15B", // restrained brass accent
          deep: "#A6813C",
          soft: "#D8BE8B",
        },
        slate: {
          DEFAULT: "#6A7078", // secondary text
          ink: "#4A5058",
        },
        line: "#E3DCCE", // hairline rules — the "surveyor's line" motif
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      maxWidth: {
        wrap: "1200px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,23,26,0.04), 0 12px 32px -18px rgba(20,23,26,0.25)",
        lift: "0 2px 4px rgba(20,23,26,0.05), 0 24px 48px -24px rgba(20,23,26,0.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
