export default {
  content: ["./index.html", "./vistas/**/*.html", "./src/**/*.{js,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["DM Sans", "system-ui", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgb(15 23 42 / 0.06), 0 4px 12px rgb(15 23 42 / 0.04)",
        "card-hover": "0 4px 20px rgb(15 23 42 / 0.08)",
      },
    },
  },
  plugins: [],
};
