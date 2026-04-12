const CLAVE_TOKEN = "access_token";

export function guardarToken(token) {
  localStorage.setItem(CLAVE_TOKEN, token);
}

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function borrarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}

export function haySesion() {
  return Boolean(obtenerToken());
}

export function guardarMensajeSesion(texto) {
  sessionStorage.setItem("mensaje_sesion", texto);
}

export function tomarMensajeSesion() {
  const m = sessionStorage.getItem("mensaje_sesion");
  if (m) sessionStorage.removeItem("mensaje_sesion");
  return m;
}
