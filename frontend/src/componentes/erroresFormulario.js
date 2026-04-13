/**
 * Errores por campo (validación local o detalles 400 del backend).
 */
export function limpiarErroresPorMapa(mapaIds, idsExtra = []) {
  [...Object.values(mapaIds), ...idsExtra].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

export function pintarErroresLocales(errores, mapaIds) {
  Object.entries(errores).forEach(([campo, msg]) => {
    const id = mapaIds[campo];
    if (id) {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    }
  });
}

export function pintarErroresBackend(details, mapaIds) {
  details.forEach((d) => {
    const id = mapaIds[d.field];
    if (id) {
      const el = document.getElementById(id);
      if (el) el.textContent = d.message;
    }
  });
}
