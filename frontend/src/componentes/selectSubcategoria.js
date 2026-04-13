export function actualizarOpcionesSubcategoria(select, subcategoriasSet) {
  const valActual = select.value;
  select.innerHTML = "";

  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "Todas";
  select.appendChild(opt0);

  const ordenadas = [...subcategoriasSet].sort((a, b) => a.localeCompare(b));
  for (const s of ordenadas) {
    const op = document.createElement("option");
    op.value = s;
    op.textContent = s;
    select.appendChild(op);
  }

  if ([...select.options].some((o) => o.value === valActual)) {
    select.value = valActual;
  }
}
