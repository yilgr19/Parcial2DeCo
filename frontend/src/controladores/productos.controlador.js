import "../css/estilos.css";
import {
  pedirProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from "../modelos/api.js";
import { borrarToken, haySesion } from "../modelos/sesion.js";
import {
  validarCamposProducto,
  hayErrores,
} from "../modelos/validacionesProducto.js";

if (!haySesion()) {
  window.location.href = "login.html";
}

const IDS_ERR_NUEVO = {
  nombre: "errNuevoNombre",
  descripcion: "errNuevoDesc",
  subcategoria: "errNuevoSub",
  precio: "errNuevoPrecio",
  precioxcantidad: "errNuevoPxc",
  estado: "errNuevoEstado",
};

const IDS_ERR_EDIT = {
  nombre: "errEditNombre",
  descripcion: "errEditDesc",
  subcategoria: "errEditSub",
  precio: "errEditPrecio",
  precioxcantidad: "errEditPxc",
  estado: "errEditEstado",
};

const tablaCuerpo = document.getElementById("tablaCuerpo");
const infoPaginacion = document.getElementById("infoPaginacion");
const cargandoLista = document.getElementById("cargandoLista");
const msgGlobal = document.getElementById("msgGlobal");

const filtroNombre = document.getElementById("filtroNombre");
const filtroSub = document.getElementById("filtroSub");
const filtroEstado = document.getElementById("filtroEstado");
const selectLimite = document.getElementById("selectLimite");

const btnAplicarFiltros = document.getElementById("btnAplicarFiltros");
const btnLimpiarFiltros = document.getElementById("btnLimpiarFiltros");
const btnAnt = document.getElementById("btnAnt");
const btnSig = document.getElementById("btnSig");
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

const btnCrear = document.getElementById("btnCrear");

const modalEditar = document.getElementById("modalEditar");
const btnCancelarEdit = document.getElementById("btnCancelarEdit");
const btnGuardarEdit = document.getElementById("btnGuardarEdit");

let pagina = 1;
const subcategoriasVistas = new Set();

btnCerrarSesion.addEventListener("click", () => {
  borrarToken();
  window.location.href = "login.html";
});

btnAplicarFiltros.addEventListener("click", () => {
  pagina = 1;
  cargarLista();
});

btnLimpiarFiltros.addEventListener("click", () => {
  filtroNombre.value = "";
  filtroSub.value = "";
  filtroEstado.value = "";
  pagina = 1;
  cargarLista();
});

selectLimite.addEventListener("change", () => {
  pagina = 1;
  cargarLista();
});

btnAnt.addEventListener("click", () => {
  if (pagina > 1) {
    pagina -= 1;
    cargarLista();
  }
});

btnSig.addEventListener("click", () => {
  pagina += 1;
  cargarLista();
});

btnCrear.addEventListener("click", async () => {
  limpiarErroresNuevo();
  msgGlobal.classList.add("hidden");

  const valores = leerFormNuevo();
  const errores = validarCamposProducto(valores);
  if (hayErrores(errores)) {
    pintarErroresLocales(errores, IDS_ERR_NUEVO);
    return;
  }

  setBotonCargando(btnCrear, true);
  try {
    const r = await crearProducto({
      nombre: valores.nombre,
      descripcion: valores.descripcion,
      subcategoria: valores.subcategoria,
      precio: Number(valores.precio),
      precioxcantidad: Number(valores.precioxcantidad),
      estado: valores.estado,
    });
    if (!r) return;

    if (r.res.status === 201 && r.data.data) {
      limpiarFormNuevo();
      await cargarLista();
      return;
    }

    if (r.res.status === 400 && r.data.error?.details) {
      pintarErroresBackend(r.data.error.details, IDS_ERR_NUEVO);
      if (r.data.error.message) {
        document.getElementById("errNuevoGeneral").textContent =
          r.data.error.message;
      }
      return;
    }

    document.getElementById("errNuevoGeneral").textContent =
      r.data.error?.message || "No se pudo crear.";
  } finally {
    setBotonCargando(btnCrear, false);
  }
});

btnCancelarEdit.addEventListener("click", () => {
  modalEditar.classList.add("hidden");
  modalEditar.classList.remove("flex");
});

btnGuardarEdit.addEventListener("click", async () => {
  limpiarErroresEdit();
  const id = Number(document.getElementById("eId").value);
  const valores = leerFormEdit();
  const errores = validarCamposProducto(valores);
  if (hayErrores(errores)) {
    pintarErroresLocales(errores, IDS_ERR_EDIT);
    return;
  }

  setBotonCargando(btnGuardarEdit, true);
  try {
    const r = await actualizarProducto(id, {
      nombre: valores.nombre,
      descripcion: valores.descripcion,
      subcategoria: valores.subcategoria,
      precio: Number(valores.precio),
      precioxcantidad: Number(valores.precioxcantidad),
      estado: valores.estado,
    });
    if (!r) return;

    if (r.res.ok && r.data.data) {
      modalEditar.classList.add("hidden");
      modalEditar.classList.remove("flex");
      await cargarLista();
      return;
    }

    if (r.res.status === 400 && r.data.error?.details) {
      pintarErroresBackend(r.data.error.details, IDS_ERR_EDIT);
      if (r.data.error.message) {
        document.getElementById("errEditGeneral").textContent =
          r.data.error.message;
      }
      return;
    }

    document.getElementById("errEditGeneral").textContent =
      r.data.error?.message || "No se pudo actualizar.";
  } finally {
    setBotonCargando(btnGuardarEdit, false);
  }
});

modalEditar.addEventListener("click", (e) => {
  if (e.target === modalEditar) {
    modalEditar.classList.add("hidden");
    modalEditar.classList.remove("flex");
  }
});

async function cargarLista() {
  cargandoLista.classList.remove("hidden");
  cargandoLista.classList.add("flex");
  msgGlobal.classList.add("hidden");

  const limit = Number(selectLimite.value) || 10;

  const params = {
    page: pagina,
    limit,
  };
  const n = filtroNombre.value.trim();
  const s = filtroSub.value.trim();
  const e = filtroEstado.value;
  if (n) params.nombre = n;
  if (s) params.subcategoria = s;
  if (e) params.estado = e;

  try {
    const r = await pedirProductos(params);
    if (!r) return;

    if (!r.res.ok) {
      mostrarGlobal(
        r.data.error?.message || "Error al cargar la lista."
      );
      tablaCuerpo.innerHTML = "";
      return;
    }

    const lista = r.data.data || [];
    const pag = r.data.pagination;

    lista.forEach((p) => {
      if (p.subcategoria) subcategoriasVistas.add(String(p.subcategoria));
    });
    actualizarSelectSubcategorias();

    renderTabla(lista);

    const total = pag?.total ?? lista.length;
    const totalPag = pag?.totalPages ?? 0;
    const pagActual = pag?.page ?? pagina;

    if (pagActual !== pagina) pagina = pagActual;

    if (total === 0) {
      infoPaginacion.textContent = "Sin productos (0)";
    } else {
      infoPaginacion.textContent = `Página ${pagActual} de ${totalPag} — ${total} producto(s)`;
    }

    btnAnt.disabled = pagActual <= 1;
    btnSig.disabled = totalPag === 0 || pagActual >= totalPag;
  } finally {
    cargandoLista.classList.add("hidden");
    cargandoLista.classList.remove("flex");
  }
}

function renderTabla(lista) {
  tablaCuerpo.innerHTML = "";
  if (lista.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.className = "px-3 py-6 text-center text-slate-500";
    td.textContent = "No hay productos con estos filtros.";
    tr.appendChild(td);
    tablaCuerpo.appendChild(tr);
    return;
  }

  for (const p of lista) {
    const tr = document.createElement("tr");
    tr.className = "border-b border-slate-100 hover:bg-slate-50";

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
    bEdit.addEventListener("click", () => abrirEditar(p));

    const bDel = document.createElement("button");
    bDel.type = "button";
    bDel.className =
      "rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700";
    bDel.textContent = "Eliminar";
    bDel.addEventListener("click", () => confirmarBorrar(p));

    tdAcc.appendChild(bEdit);
    tdAcc.appendChild(bDel);
    tr.appendChild(tdAcc);

    tablaCuerpo.appendChild(tr);
  }
}

function tdTexto(texto) {
  const td = document.createElement("td");
  td.className = "max-w-[200px] truncate px-3 py-2";
  td.textContent = texto ?? "";
  return td;
}

function abrirEditar(p) {
  limpiarErroresEdit();
  document.getElementById("eId").value = String(p.id);
  document.getElementById("eNombre").value = p.nombre ?? "";
  document.getElementById("eDesc").value = p.descripcion ?? "";
  document.getElementById("eSub").value = p.subcategoria ?? "";
  document.getElementById("ePrecio").value = String(p.precio ?? "");
  document.getElementById("ePxc").value = String(p.precioxcantidad ?? "");
  document.getElementById("eEstado").value = p.estado ?? "activo";
  document.getElementById("errEditGeneral").textContent = "";
  modalEditar.classList.remove("hidden");
  modalEditar.classList.add("flex");
}

async function confirmarBorrar(p) {
  const ok = window.confirm(
    `¿Eliminar el producto "${p.nombre}"?`
  );
  if (!ok) return;

  const r = await eliminarProducto(p.id);
  if (!r) return;

  if (r.res.ok) {
    await cargarLista();
    return;
  }

  mostrarGlobal(r.data.error?.message || "No se pudo eliminar.");
}

function actualizarSelectSubcategorias() {
  const valActual = filtroSub.value;
  filtroSub.innerHTML = "";
  const opt0 = document.createElement("option");
  opt0.value = "";
  opt0.textContent = "Todas";
  filtroSub.appendChild(opt0);

  const ordenadas = [...subcategoriasVistas].sort((a, b) =>
    a.localeCompare(b)
  );
  for (const s of ordenadas) {
    const op = document.createElement("option");
    op.value = s;
    op.textContent = s;
    filtroSub.appendChild(op);
  }
  if ([...filtroSub.options].some((o) => o.value === valActual)) {
    filtroSub.value = valActual;
  }
}

function leerFormNuevo() {
  return {
    nombre: document.getElementById("nNombre").value,
    descripcion: document.getElementById("nDesc").value,
    subcategoria: document.getElementById("nSub").value,
    precio: document.getElementById("nPrecio").value,
    precioxcantidad: document.getElementById("nPxc").value,
    estado: document.getElementById("nEstado").value,
  };
}

function limpiarFormNuevo() {
  document.getElementById("nNombre").value = "";
  document.getElementById("nDesc").value = "";
  document.getElementById("nSub").value = "";
  document.getElementById("nPrecio").value = "";
  document.getElementById("nPxc").value = "";
  document.getElementById("nEstado").value = "";
}

function leerFormEdit() {
  return {
    nombre: document.getElementById("eNombre").value,
    descripcion: document.getElementById("eDesc").value,
    subcategoria: document.getElementById("eSub").value,
    precio: document.getElementById("ePrecio").value,
    precioxcantidad: document.getElementById("ePxc").value,
    estado: document.getElementById("eEstado").value,
  };
}

function limpiarErroresNuevo() {
  [...Object.values(IDS_ERR_NUEVO), "errNuevoGeneral"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function limpiarErroresEdit() {
  [...Object.values(IDS_ERR_EDIT), "errEditGeneral"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}

function pintarErroresLocales(errores, mapaIds) {
  Object.entries(errores).forEach(([campo, msg]) => {
    const id = mapaIds[campo];
    if (id) document.getElementById(id).textContent = msg;
  });
}

function pintarErroresBackend(details, mapaIds) {
  details.forEach((d) => {
    const id = mapaIds[d.field];
    if (id) document.getElementById(id).textContent = d.message;
  });
}

function mostrarGlobal(texto) {
  msgGlobal.textContent = texto;
  msgGlobal.classList.remove("hidden");
}

function setBotonCargando(btn, on) {
  btn.disabled = on;
}

cargarLista();
