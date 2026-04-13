let productos = [];
let nextId = 1;

export function getProductos() {
  return productos;
}

export function findById(id) {
  return productos.find((p) => p.id === id);
}

export function createProducto(payload) {
  const id = nextId++;
  const nuevo = { id, ...payload };
  productos.push(nuevo);
  return nuevo;
}

export function updateProducto(id, payload) {
  const idx = productos.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const actualizado = { id, ...payload };
  productos[idx] = actualizado;
  return actualizado;
}

export function deleteProducto(id) {
  const idx = productos.findIndex((p) => p.id === id);
  if (idx === -1) return false;
  productos.splice(idx, 1);
  return true;
}
