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
        // Цвета Base бренда
        "base-blue": "#0052FF",
        "base-blue-light": "#3B82F6",
        "base-purple": "#8B5CF6",
        "base-dark": "#0a0a1e",
        "base-card": "rgba(255,255,255,0.05)",
        "base-border": "rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "gradient-base": "linear-gradient(135deg, #0052FF 0%, #3B82F6 50%, #8B5CF6 100%)",
        "gradient-blue": "linear-gradient(135deg, #0052FF, #3B82F6)",
        "gradient-success": "linear-gradient(135deg, #10B981, #059669)",
        "gradient-warning": "linear-gradient(135deg, #F59E0B, #EF4444)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
