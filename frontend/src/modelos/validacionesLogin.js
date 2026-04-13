export function validarCredencialesFormulario(usuario, password) {
  const u = String(usuario ?? "").trim();
  const p = password ?? "";
  if (!u) {
    return { ok: false, mensaje: "Ingresa un usuario." };
  }
  if (!p) {
    return { ok: false, mensaje: "Ingresa la contraseña." };
  }
  return { ok: true, usuario: u, password: p };
}
