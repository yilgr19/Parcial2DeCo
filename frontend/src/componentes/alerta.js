/**
 * Mensajes visibles tipo banner (error en login, aviso global en productos).
 */
export function mostrarAlerta(el, texto) {
  el.textContent = texto;
  el.classList.remove("hidden");
}

export function ocultarAlerta(el) {
  el.textContent = "";
  el.classList.add("hidden");
}
