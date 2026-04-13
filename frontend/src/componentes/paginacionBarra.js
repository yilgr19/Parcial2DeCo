/**
 * Texto informativo y botones anterior/siguiente.
 */
export function actualizarBarraPaginacion({
  infoEl,
  btnAnt,
  btnSig,
  pagActual,
  totalPag,
  total,
}) {
  if (total === 0) {
    infoEl.textContent = "Sin productos (0)";
  } else {
    infoEl.textContent = `Página ${pagActual} de ${totalPag} — ${total} producto(s)`;
  }
  btnAnt.disabled = pagActual <= 1;
  btnSig.disabled = totalPag === 0 || pagActual >= totalPag;
}
