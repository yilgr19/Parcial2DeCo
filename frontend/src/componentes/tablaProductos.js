const CLASE_FILA =
  "border-b border-slate-100 transition-colors hover:bg-indigo-50/40";
const CLASE_TD = "max-w-[200px] truncate px-4 py-3 text-slate-700";

function fmtNum(n) {
  if (n === null || n === undefined || n === "") return "";
  const x = Number(n);
  if (Number.isNaN(x)) return String(n);
  return x.toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

function tdTexto(texto) {
  const td = document.createElement("td");
  td.className = CLASE_TD;
  td.textContent = texto ?? "";
  return td;
}

function tdEstado(estado) {
  const td = document.createElement("td");
  td.className = `${CLASE_TD} whitespace-nowrap`;
  const span = document.createElement("span");
  const activo = String(estado).toLowerCase() === "activo";
  span.className = activo
    ? "inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800"
    : "inline-flex rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700";
  span.textContent = estado ?? "";
  td.appendChild(span);
  return td;
}

export function renderizarTablaProductos(tbody, lista, { onEditar, onEliminar }) {
  tbody.innerHTML = "";

  if (lista.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "px-4 py-12 text-center text-sm text-slate-500";
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
    tr.appendChild(tdTexto(fmtNum(p.precio)));
    tr.appendChild(tdTexto(fmtNum(p.precioxcantidad)));
    tr.appendChild(tdEstado(p.estado));

    const tdAcc = document.createElement("td");
    tdAcc.className = "whitespace-nowrap px-4 py-3";

    const bEdit = document.createElement("button");
    bEdit.type = "button";
    bEdit.className =
      "mr-2 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900 transition hover:bg-amber-100";
    bEdit.textContent = "Editar";
    bEdit.addEventListener("click", () => onEditar(p));

    const bDel = document.createElement("button");
    bDel.type = "button";
    bDel.className =
      "rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-800 transition hover:bg-red-100";
    bDel.textContent = "Eliminar";
    bDel.addEventListener("click", () => onEliminar(p));

    tdAcc.appendChild(bEdit);
    tdAcc.appendChild(bDel);
    tr.appendChild(tdAcc);

    tbody.appendChild(tr);
  }
}
