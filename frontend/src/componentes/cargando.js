export function setOverlayCargando(el, visible) {
  el.classList.toggle("hidden", !visible);
  el.classList.toggle("flex", visible);
  el.classList.toggle("flex-col", visible);
}

export function setBotonCargando(btn, cargando) {
  btn.disabled = cargando;
}

export function setIndicadorCargando(el, visible) {
  el.classList.toggle("hidden", !visible);
}
