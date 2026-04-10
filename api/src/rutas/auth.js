import { Router } from "express";
import jwt from "jsonwebtoken";
import { buscarPorCredenciales } from "../data/usuarios.js";
import { JWT_SECRET, JWT_EXPIRES_SEC } from "../config.js";
import * as respuestas from "../utils/respuestas.js";

const router = Router();

router.post("/", (req, res) => {
  const { usuario, password } = req.body || {};
  if (!usuario || !password) {
    return respuestas.error(
      res,
      401,
      "INVALID_CREDENTIALS",
      "Usuario o contraseña incorrectos"
    );
  }

  const user = buscarPorCredenciales(usuario, password);
  if (!user) {
    return respuestas.error(
      res,
      401,
      "INVALID_CREDENTIALS",
      "Usuario o contraseña incorrectos"
    );
  }

  const token = jwt.sign(
    {
      sub: user.id,
      usuario: user.usuario,
      activo: user.activo,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_SEC }
  );

  return respuestas.ok(
    res,
    {
      access_token: token,
      token_type: "Bearer",
      expires_in: JWT_EXPIRES_SEC,
    },
    200
  );
});

export default router;
