import type { Config } from "tailwindcss";

/** "Cuaderno de ideas": papel crema, tinta oscura y un acento tomate. Los colores viven en globals.css para el modo oscuro. */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        papel: "rgb(var(--papel) / <alpha-value>)",
        hoja: "rgb(var(--hoja) / <alpha-value>)",
        tinta: "rgb(var(--tinta) / <alpha-value>)",
        tenue: "rgb(var(--tenue) / <alpha-value>)",
        linea: "rgb(var(--linea) / <alpha-value>)",
        tomate: "rgb(var(--tomate) / <alpha-value>)",
        menta: "rgb(var(--menta) / <alpha-value>)",
        mostaza: "rgb(var(--mostaza) / <alpha-value>)",
      },
      fontFamily: {
        titulo: ["var(--font-titulo)", "Georgia", "serif"],
        texto: ["var(--font-texto)", "system-ui", "sans-serif"],
        firma: ["var(--font-firma)", "cursive"],
      },
    },
  },
  plugins: [],
};

export default config;
