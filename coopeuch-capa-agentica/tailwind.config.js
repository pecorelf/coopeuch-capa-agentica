export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rojo: "#E4032E",
        rojoOsc: "#A50B22",
        tinta: "#141414",
        grisc: "#6B6663",
        niebla: "#F2F1EF",
        linea: "#DCD8D3",
        ok: "#1E7A4C",
        alerta: "#B26A00",
        falla: "#B00020",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
