export function limpiarErroresPorMapa(mapaIds, idsExtra = []) {
  [...Object.values(mapaIds), ...idsExtra].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

export function pintarErroresLocales(errores, mapaIds) {
  Object.entries(errores).forEach(([campo, msg]) => {
    const el = document.getElementById(mapaIds[campo]);
    if (el) el.textContent = msg;
  });
}

export function pintarErroresBackend(details, mapaIds) {
  details.forEach((d) => {
    const el = document.getElementById(mapaIds[d.field]);
    if (el) el.textContent = d.message;
  });
}
