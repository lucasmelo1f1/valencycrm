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
        v: {
          bg: "#050505",
          surface: "rgba(255, 255, 255, 0.02)",
          "surface-hover": "rgba(255, 255, 255, 0.04)",
          "surface-elevated": "rgba(255, 255, 255, 0.06)",
          border: "rgba(255, 255, 255, 0.06)",
          "border-hover": "rgba(255, 255, 255, 0.12)",
          "text-primary": "#EBEBEB",
          "text-secondary": "rgba(255, 255, 255, 0.50)",
          "text-muted": "rgba(255, 255, 255, 0.35)",
          accent: "#10B981",
          "accent-hover": "#34D399",
          "accent-subtle": "rgba(16, 185, 129, 0.15)",
          "accent-glow": "rgba(16, 185, 129, 0.20)",
          amber: "#F59E0B",
          red: "#EF4444",
          blue: "#3B82F6",
          purple: "#8B5CF6",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        grotesk: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "24px",
        "card-sm": "16px",
        pill: "9999px",
        input: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
