import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        evoke: {
          bg: "#080810",
          surface: "#0F0F1A",
          card: "#14141F",
          border: "#1E1E30",
          "accent-primary": "#7C6AFF",
          "accent-hover": "#9D8FFF",
          "accent-soft": "rgba(124, 106, 255, 0.10)",
          mint: "#4ECCA3",
          amber: "#FF9A3C",
          "text-primary": "#F0F0F8",
          "text-secondary": "#9090A8",
          "text-muted": "#55556A",
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
        "input-focus": "0 0 0 3px rgba(124, 106, 255, 0.15)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #7C6AFF 0%, #4ECCA3 100%)",
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
