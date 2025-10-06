import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  darkMode: ["class", ".dark"],
  plugins: [],
};

export default config;
