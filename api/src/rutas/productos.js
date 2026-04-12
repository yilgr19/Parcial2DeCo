import { Router } from "express";
import * as store from "../data/productosStore.js";
import * as respuestas from "../utils/respuestas.js";
import { validarProducto } from "../utils/validarProducto.js";

const router = Router();

function parseIdParam(raw) {
  const id = Number(raw);
  if (!Number.isInteger(id) || id < 1) return null;
  return id;
}

function aplicarFiltros(lista, query) {
  let r = [...lista];
  const { subcategoria, estado, nombre } = query;

  if (subcategoria !== undefined && subcategoria !== "") {
    r = r.filter(
      (p) =>
        String(p.subcategoria).toLowerCase() ===
        String(subcategoria).toLowerCase()
    );
  }
  if (estado !== undefined && estado !== "") {
    r = r.filter((p) => p.estado === estado);
  }
  if (nombre !== undefined && nombre !== "") {
    const q = String(nombre).toLowerCase();
    r = r.filter((p) => String(p.nombre).toLowerCase().includes(q));
  }
  return r;
}

// Un solo GET /productos: los filtros y la paginación van en la URL como query params (req.query).
// Ejemplos: /productos?subcategoria=bebidas
//           /productos?estado=activo
//           /productos?nombre=coca
//           /productos?subcategoria=bebidas&estado=activo&nombre=coca
//           /productos?page=1&limit=5
//           (se pueden combinar filtros + page + limit en la misma petición)
router.get("/", (req, res) => {
  const filtrados = aplicarFiltros(store.getProductos(), req.query);
  const total = filtrados.length;

  let page = Number(req.query.page);
  let limit = Number(req.query.limit);

  if (Number.isNaN(page) || page < 1) page = 1;
  if (Number.isNaN(limit) || limit < 1) limit = 10;

  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  if (total > 0 && page > totalPages) page = totalPages;

  const start = (page - 1) * limit;
  const slice = filtrados.slice(start, start + limit);

  return res.status(200).json({
    data: slice,
    pagination: {
      page,
      limit,
      total,
      totalPages: total === 0 ? 0 : totalPages,
    },
  });
});

router.get("/:id", (req, res) => {
  const id = parseIdParam(req.params.id);
  if (id === null) {
    return respuestas.error(
      res,
      404,
      "PRODUCT_NOT_FOUND",
      `No se encontró el producto con id ${req.params.id}`
    );
  }
  const p = store.findById(id);
  if (!p) {
    return respuestas.error(
      res,
      404,
      "PRODUCT_NOT_FOUND",
      `No se encontró el producto con id ${id}`
    );
  }
  return respuestas.ok(res, p);
});

router.post("/", (req, res) => {
  const v = validarProducto(req.body);
  if (!v.valido) {
    return respuestas.error(
      res,
      400,
      "VALIDATION_ERROR",
      "Datos de entrada inválidos",
      v.details
    );
  }
  const creado = store.createProducto(v.payload);
  return respuestas.ok(res, creado, 201);
});

router.put("/:id", (req, res) => {
  const id = parseIdParam(req.params.id);
  if (id === null) {
    return respuestas.error(
      res,
      404,
      "PRODUCT_NOT_FOUND",
      `No se encontró el producto con id ${req.params.id}`
    );
  }
  const v = validarProducto(req.body);
  if (!v.valido) {
    return respuestas.error(
      res,
      400,
      "VALIDATION_ERROR",
      "Datos de entrada inválidos",
      v.details
    );
  }
  const actualizado = store.updateProducto(id, v.payload);
  if (!actualizado) {
    return respuestas.error(
      res,
      404,
      "PRODUCT_NOT_FOUND",
      `No se encontró el producto con id ${id}`
    );
  }
  return respuestas.ok(res, actualizado);
});

router.delete("/:id", (req, res) => {
  const id = parseIdParam(req.params.id);
  if (id === null) {
    return respuestas.error(
      res,
      404,
      "PRODUCT_NOT_FOUND",
      `No se encontró el producto con id ${req.params.id}`
    );
  }
  const ok = store.deleteProducto(id);
  if (!ok) {
    return respuestas.error(
      res,
      404,
      "PRODUCT_NOT_FOUND",
      `No se encontró el producto con id ${id}`
    );
  }
  return respuestas.ok(res, { message: "Producto eliminado exitosamente" });
});

export default router;
