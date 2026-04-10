import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import authRoutes from "./rutas/auth.js";
import productosRoutes from "./rutas/productos.js";
import { authJwt } from "./middleware/authJwt.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/productos", authJwt, productosRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Ruta no encontrada",
    },
  });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
