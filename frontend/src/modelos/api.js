import { API_URL } from "./config.js";
import {
  borrarToken,
  guardarMensajeSesion,
  obtenerToken,
} from "./sesion.js";

export async function iniciarSesion(usuario, password) {
  const res = await fetch(`${API_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, password }),
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

function armarQuery(params) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      q.set(k, String(v));
    }
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

async function fetchConToken(ruta, opciones) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}${ruta}`, {
    method: opciones.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opciones.body ? { "Content-Type": "application/json" } : {}),
      ...opciones.headers,
    },
    body: opciones.body,
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    const msg =
      data?.error?.message ||
      (res.status === 403
        ? "Acceso denegado (usuario inactivo)."
        : "Sesión inválida o expirada.");
    borrarToken();
    guardarMensajeSesion(msg);
    window.location.href = "login.html";
    return null;
  }
  return { res, data };
}

export function pedirProductos(filtros) {
  return fetchConToken(`/productos${armarQuery(filtros)}`, {});
}

export function crearProducto(body) {
  return fetchConToken("/productos", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function actualizarProducto(id, body) {
  return fetchConToken(`/productos/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function eliminarProducto(id) {
  return fetchConToken(`/productos/${id}`, { method: "DELETE" });
}
