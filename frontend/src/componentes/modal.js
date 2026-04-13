/**
 * Modal con overlay (clases hidden/flex como en productos.html).
 */
export function abrirModal(overlay) {
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");
}

export function cerrarModal(overlay) {
  overlay.classList.add("hidden");
  overlay.classList.remove("flex");
}

/**
 * Cierra al hacer clic fuera del panel (solo en el backdrop).
 */
export function enlazarCierreBackdrop(overlay, handlerCerrar) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) handlerCerrar();
  });
}
