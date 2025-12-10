import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "81.25%",
        xl: "81.25%",
        "2xl": "81.25%",
      },
    },
    extend: {
      fontFamily: {
        inter: ["var(--font-inter)"],
        grotesque: ["var(--font-darker-grotesque)"],
      },
    },
  },
};

export default config;

