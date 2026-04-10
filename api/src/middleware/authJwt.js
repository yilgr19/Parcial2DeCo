import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import * as respuestas from "../utils/respuestas.js";

export function authJwt(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return respuestas.error(
      res,
      401,
      "NO_TOKEN",
      "Token de autenticación requerido"
    );
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.usuarioJwt = payload;
    if (payload.activo === false) {
      return respuestas.error(
        res,
        403,
        "USER_INACTIVE",
        "Usuario inactivo, acceso denegado"
      );
    }
    next();
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      return respuestas.error(res, 401, "TOKEN_EXPIRED", "Token expirado");
    }
    return respuestas.error(res, 401, "INVALID_TOKEN", "Token inválido");
  }
}
