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
        foreground: "#18e299",
        background: "#10102d",
        "background-dark": "#0d0d25",
        "background-light": "#1a1a37",
      },
    },
  },
  plugins: [],
};
export default config;
