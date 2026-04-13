const CLASE_FILA = "border-b border-slate-100 hover:bg-slate-50";
const CLASE_TD = "max-w-[200px] truncate px-3 py-2";

function tdTexto(texto) {
  const td = document.createElement("td");
  td.className = CLASE_TD;
  td.textContent = texto ?? "";
  return td;
}

/**
 * Renderiza filas en tbody; si la lista está vacía, una sola fila con mensaje.
 */
export function renderizarTablaProductos(tbody, lista, { onEditar, onEliminar }) {
  tbody.innerHTML = "";

  if (lista.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "px-3 py-6 text-center text-slate-500";
    td.textContent = "No hay productos con estos filtros.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  for (const p of lista) {
    const tr = document.createElement("tr");
    tr.className = CLASE_FILA;

    tr.appendChild(tdTexto(p.nombre));
    tr.appendChild(tdTexto(p.descripcion));
    tr.appendChild(tdTexto(p.subcategoria));
    tr.appendChild(tdTexto(String(p.precio)));
    tr.appendChild(tdTexto(String(p.precioxcantidad)));
    tr.appendChild(tdTexto(p.estado));

    const tdAcc = document.createElement("td");
    tdAcc.className = "px-3 py-2 whitespace-nowrap";

    const bEdit = document.createElement("button");
    bEdit.type = "button";
    bEdit.className =
      "mr-2 rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-600";
    bEdit.textContent = "Editar";
    bEdit.addEventListener("click", () => onEditar(p));

    const bDel = document.createElement("button");
    bDel.type = "button";
    bDel.className =
      "rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700";
    bDel.textContent = "Eliminar";
    bDel.addEventListener("click", () => onEliminar(p));

    tdAcc.appendChild(bEdit);
    tdAcc.appendChild(bDel);
    tr.appendChild(tdAcc);

    tbody.appendChild(tr);
  }
}
