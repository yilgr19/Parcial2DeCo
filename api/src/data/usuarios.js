const usuarios = [
  { id: 1, usuario: "admin", password: "admin123", activo: true },
  { id: 2, usuario: "estudiante", password: "est2025", activo: true },
  { id: 3, usuario: "inactivo", password: "noactivo1", activo: false },
];

export function buscarPorCredenciales(usuario, password) {
  return usuarios.find(
    (u) => u.usuario === usuario && u.password === password
  );
}
