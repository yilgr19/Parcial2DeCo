import "../css/estilos.css";
import {
  mostrarAlerta,
  ocultarAlerta,
  setOverlayCargando,
  setBotonCargando,
  abrirModal,
  cerrarModal,
  limpiarErroresPorMapa,
  pintarErroresLocales,
  pintarErroresBackend,
  actualizarOpcionesSubcategoria,
  actualizarBarraPaginacion,
  renderizarTablaProductos,
} from "../componentes/index.js";
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
  limpiarErroresPorMapa(IDS_ERR_NUEVO, ["errNuevoGeneral"]);
  ocultarAlerta(msgGlobal);

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
  cerrarModal(modalEditar);
});

btnGuardarEdit.addEventListener("click", async () => {
  limpiarErroresPorMapa(IDS_ERR_EDIT, ["errEditGeneral"]);
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
      cerrarModal(modalEditar);
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
  if (e.target === modalEditar) cerrarModal(modalEditar);
});

async function cargarLista() {
  setOverlayCargando(cargandoLista, true);
  ocultarAlerta(msgGlobal);

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
      mostrarAlerta(
        msgGlobal,
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
    actualizarOpcionesSubcategoria(filtroSub, subcategoriasVistas);

    renderizarTablaProductos(tablaCuerpo, lista, {
      onEditar: abrirEditar,
      onEliminar: confirmarBorrar,
    });

    const total = pag?.total ?? lista.length;
    const totalPag = pag?.totalPages ?? 0;
    const pagActual = pag?.page ?? pagina;

    if (pagActual !== pagina) pagina = pagActual;

    actualizarBarraPaginacion({
      infoEl: infoPaginacion,
      btnAnt,
      btnSig,
      pagActual,
      totalPag,
      total,
    });
  } finally {
    setOverlayCargando(cargandoLista, false);
  }
}

function abrirEditar(p) {
  limpiarErroresPorMapa(IDS_ERR_EDIT, ["errEditGeneral"]);
  document.getElementById("eId").value = String(p.id);
  document.getElementById("eNombre").value = p.nombre ?? "";
  document.getElementById("eDesc").value = p.descripcion ?? "";
  document.getElementById("eSub").value = p.subcategoria ?? "";
  document.getElementById("ePrecio").value = String(p.precio ?? "");
  document.getElementById("ePxc").value = String(p.precioxcantidad ?? "");
  document.getElementById("eEstado").value = p.estado ?? "activo";
  document.getElementById("errEditGeneral").textContent = "";
  abrirModal(modalEditar);
}

async function confirmarBorrar(p) {
  const ok = window.confirm(`¿Eliminar el producto "${p.nombre}"?`);
  if (!ok) return;

  const r = await eliminarProducto(p.id);
  if (!r) return;

  if (r.res.ok) {
    await cargarLista();
    return;
  }

  mostrarAlerta(msgGlobal, r.data.error?.message || "No se pudo eliminar.");
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

cargarLista();
