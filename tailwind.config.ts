import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: {
          DEFAULT: "#EFE3C4",
          warm: "#E8DAB4",
        },
        card: {
          DEFAULT: "#F7EED5",
          light: "#FBF5E1",
        },
        ink: {
          DEFAULT: "#241A10",
          2: "#4A3A24",
          mute: "#7A6749",
        },
        line: "#B8A576",
        terracotta: {
          DEFAULT: "#C24A1E",
          dark: "#8E3411",
        },
        olive: {
          DEFAULT: "#5A6B2B",
          mute: "#8A9B4E",
        },
        pink: {
          DEFAULT: "#E9A5A0",
        },
        gold: "#A97E1A",
      },
      fontFamily: {
        serif: ['"Bookman Old Style"', '"Bitstream Charter"', '"URW Bookman L"', "Georgia", '"Times New Roman"', "serif"],
        sans: ["system-ui", "-apple-system", '"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"],
        mono: ['"SFMono-Regular"', '"SF Mono"', "Menlo", "Consolas", '"Liberation Mono"', "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 #f9f0d8, 0 2px 0 rgba(36,26,16,.10), 0 22px 40px -28px rgba(36,26,16,.35)",
        stamp: "0 2px 0 rgba(36,26,16,.18), 0 16px 40px -20px rgba(36,26,16,.5)",
      },
    },
  },
  plugins: [],
} satisfies Config;
