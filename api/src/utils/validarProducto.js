const CAMPOS = [
  "nombre",
  "descripcion",
  "subcategoria",
  "precio",
  "precioxcantidad",
  "estado",
];

export function validarProducto(body) {
  const details = [];

  for (const campo of CAMPOS) {
    const v = body[campo];
    if (v === undefined || v === null || v === "") {
      details.push({
        field: campo,
        message: "Campo obligatorio",
      });
    }
  }

  const precio = body.precio;
  if (precio !== undefined && precio !== null && precio !== "") {
    const n = Number(precio);
    if (Number.isNaN(n) || n <= 0) {
      details.push({
        field: "precio",
        message: "Debe ser un número positivo",
      });
    }
  }

  const pxc = body.precioxcantidad;
  if (pxc !== undefined && pxc !== null && pxc !== "") {
    const n = Number(pxc);
    if (Number.isNaN(n) || n <= 0) {
      details.push({
        field: "precioxcantidad",
        message: "Debe ser un número positivo",
      });
    }
  }

  const estado = body.estado;
  if (estado !== undefined && estado !== null && estado !== "") {
    if (estado !== "activo" && estado !== "inactivo") {
      details.push({
        field: "estado",
        message: "Solo se permite 'activo' o 'inactivo'",
      });
    }
  }

  if (details.length) {
    return {
      valido: false,
      details,
    };
  }

  const payload = {
    nombre: String(body.nombre).trim(),
    descripcion: String(body.descripcion).trim(),
    subcategoria: String(body.subcategoria).trim(),
    precio: Number(body.precio),
    precioxcantidad: Number(body.precioxcantidad),
    estado: body.estado,
  };

  return { valido: true, payload };
}
