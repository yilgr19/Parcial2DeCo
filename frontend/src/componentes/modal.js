export function abrirModal(overlay) {
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

export function cerrarModal(overlay) {
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
}
