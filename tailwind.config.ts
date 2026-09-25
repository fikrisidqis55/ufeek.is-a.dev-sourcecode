import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Windows 98 color palette
        white: "#ffffff",
        win98: {
          bg: "#008080", // Teal Desktop
          surface: "#c0c0c0", // Window background
          text: "#000000",
          "title-active": "#000080", // Dark blue
          "title-inactive": "#808080",
          "title-text": "#ffffff",
          "border-light": "#dfdfdf",
          "border-dark": "#808080",
          "border-darker": "#000000",
        },
        primary: "#FF00FF", // Hot Magenta (keeping for legacy parts)
        secondary: "#00FFFF", // Electric Cyan
        tertiary: "#FF9900", // Sunset Orange
        background: "#008080", // Teal Desktop
        foreground: "#000000", 
        card: "#c0c0c0", 
        "card-border": "#808080",
        "card-border-active": "#000000",
        // Legacy colors
        "legacy-primary": "#D63200",
        "legacy-secondary": "#FF10F0",
        "legacy-tertiary": "#236CFF",
        "legacy-background": "#333738",
      },
      fontFamily: {
        heading: ['"Orbitron"', "sans-serif"],
        mono: ['"Share Tech Mono"', "monospace"],
      },
      boxShadow: {
        "neon-magenta": "0 0 10px #FF00FF, 0 0 20px #FF00FF",
        "neon-cyan": "0 0 20px rgba(0,255,255,0.2), 0 0 15px #00FFFF",
        "neon-orange": "0 0 10px #FF9900, 0 0 20px rgba(255,153,0,0.5)",
        "neon-large": "0 0 50px rgba(0,255,255,0.2)",
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
