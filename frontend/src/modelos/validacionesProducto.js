const CAMPOS = [
  "nombre",
  "descripcion",
  "subcategoria",
  "precio",
  "precioxcantidad",
  "estado",
];

export function validarCamposProducto(valores) {
  const errores = {};

  for (const c of CAMPOS) {
    const v = valores[c];
    if (v === undefined || v === null || String(v).trim() === "") {
      errores[c] = "Este campo es obligatorio";
    }
  }

  const p = Number(valores.precio);
  if (valores.precio !== "" && valores.precio !== undefined) {
    if (Number.isNaN(p) || p <= 0) {
      errores.precio = "Debe ser un número mayor que 0";
    }
  }

  const pxq = Number(valores.precioxcantidad);
  if (
    valores.precioxcantidad !== "" &&
    valores.precioxcantidad !== undefined
  ) {
    if (Number.isNaN(pxq) || pxq <= 0) {
      errores.precioxcantidad = "Debe ser un número mayor que 0";
    }
  }

  const est = valores.estado;
  if (est && est !== "activo" && est !== "inactivo") {
    errores.estado = "Elegí activo o inactivo";
  }

  return errores;
}

export function hayErrores(errores) {
  return Object.keys(errores).length > 0;
}
