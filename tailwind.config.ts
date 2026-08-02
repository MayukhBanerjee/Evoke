import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        evoke: {
          bg: "var(--bg-color)",
          surface: "var(--surface-color)",
          card: "var(--card-color)",
          border: "var(--border-color)",
          "accent-primary": "#7C6AFF",
          "accent-hover": "#9D8FFF",
          "accent-soft": "rgba(124, 106, 255, 0.10)",
          mint: "#4ECCA3",
          amber: "#FF9A3C",
          gold: "#C5A880",
          "gold-hover": "#D4B890",
          "gold-soft": "rgba(197, 168, 128, 0.12)",
          "text-primary": "var(--text-primary)",
          "text-secondary": "var(--text-secondary)",
          "text-muted": "var(--text-muted)",
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "14px",
        pill: "100px",
        input: "10px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 106, 255, 0.25)",
        "glow-lg": "0 0 35px rgba(124, 106, 255, 0.35)",
        "glow-mint": "0 0 20px rgba(78, 204, 163, 0.25)",
        "glow-gold": "0 0 20px rgba(197, 168, 128, 0.30)",
        "input-focus": "0 0 0 3px rgba(124, 106, 255, 0.15)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #7C6AFF 0%, #4ECCA3 100%)",
        "gold-gradient": "linear-gradient(135deg, #C5A880 0%, #E6C594 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(20, 20, 31, 0.8) 0%, rgba(15, 15, 26, 0.9) 100%)",
      },
      keyframes: {
        pulseSlow: {
          "0%, 100%": { opacity: "0.15", transform: "scale(1) translate(0, 0)" },
          "50%": { opacity: "0.35", transform: "scale(1.1) translate(20px, -20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        wave: {
          "0%, 100%": { height: "6px" },
          "50%": { height: "24px" },
        },
      },
      animation: {
        "orb-slow": "pulseSlow 20s infinite ease-in-out",
        shimmer: "shimmer 2s linear infinite",
        wave: "wave 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
