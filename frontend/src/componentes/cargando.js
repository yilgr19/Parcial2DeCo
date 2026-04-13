/**
 * Overlay de carga y estado deshabilitado en botones.
 */
export function setOverlayCargando(el, visible) {
  el.classList.toggle("hidden", !visible);
  el.classList.toggle("flex", visible);
}

export function setBotonCargando(btn, cargando) {
  btn.disabled = cargando;
}

/** Texto auxiliar “Cargando…” u otro indicador que solo alterna `hidden`. */
export function setIndicadorCargando(el, visible) {
  el.classList.toggle("hidden", !visible);
}
