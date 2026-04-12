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
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      q.set(k, String(v));
    }
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export async function pedirProductos(filtros) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos${armarQuery(filtros)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    manejarAccesoDenegado(data, res.status);
    return null;
  }
  return { res, data };
}

export async function crearProducto(body) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    manejarAccesoDenegado(data, res.status);
    return null;
  }
  return { res, data };
}

export async function actualizarProducto(id, body) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    manejarAccesoDenegado(data, res.status);
    return null;
  }
  return { res, data };
}

export async function eliminarProducto(id) {
  const token = obtenerToken();
  const res = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 || res.status === 403) {
    manejarAccesoDenegado(data, res.status);
    return null;
  }
  return { res, data };
}

function manejarAccesoDenegado(data, status) {
  const msg =
    data?.error?.message ||
    (status === 403
      ? "Acceso denegado (usuario inactivo)."
      : "Sesión inválida o expirada.");
  borrarToken();
  guardarMensajeSesion(msg);
  window.location.href = "login.html";
}
