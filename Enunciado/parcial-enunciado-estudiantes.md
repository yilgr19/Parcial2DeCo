# Parcial Práctico — API REST: CRUD de Productos con Autenticación JWT

## Enunciado

Desarrollar una API REST para la gestión de un catálogo de productos de una tienda en línea, implementando autenticación mediante JSON Web Tokens (JWT). Almacenar todos los datos en memoria (sin base de datos).

---

## Qué hacer

### Autenticación

1. Crear un endpoint `POST /auth` para recibir usuario y contraseña en el body, validar las credenciales contra una lista de usuarios precargados en memoria y retornar un JWT firmado con los datos del usuario (`sub`, `usuario`, `activo`).
2. Retornar `401 Unauthorized` si las credenciales son incorrectas.
3. Incluir en el JWT un tiempo de expiración de 1 hora.

### CRUD de Productos

4. Crear un endpoint `GET /productos` para listar todos los productos almacenados en memoria.
5. Crear un endpoint `GET /productos/:id` para obtener un producto específico por su ID.
6. Crear un endpoint `POST /productos` para recibir los datos de un producto en el body y agregarlo al almacenamiento en memoria con un ID autogenerado.
7. Crear un endpoint `PUT /productos/:id` para recibir los datos actualizados de un producto y reemplazar el producto existente.
8. Crear un endpoint `DELETE /productos/:id` para eliminar un producto del almacenamiento en memoria.
9. Retornar `404 Not Found` cuando se intente consultar, actualizar o eliminar un producto que no existe.

### Protección con JWT

10. Crear un middleware de autenticación para proteger todos los endpoints de `/productos`.
11. Verificar que el header `Authorization: Bearer <token>` esté presente en cada petición al CRUD.
12. Validar la firma del JWT y retornar `401 Unauthorized` si el token es inválido, está ausente o está expirado.
13. Extraer el claim `activo` del payload del JWT y retornar `403 Forbidden` con el mensaje `"Usuario inactivo, acceso denegado"` si el usuario no está activo.

### Validaciones

14. Validar que todos los campos obligatorios (`nombre`, `descripcion`, `subcategoria`, `precio`, `precioxcantidad`, `estado`) estén presentes al crear un producto.
15. Validar que `precio` y `precioxcantidad` sean números positivos.
16. Validar que `estado` solo acepte los valores `"activo"` o `"inactivo"`.
17. Retornar `400 Bad Request` con el detalle de los campos inválidos si la validación falla.

### Filtros y Paginación

18. Implementar filtros por query params en `GET /productos`: filtrar por `subcategoria`, por `estado` y buscar por `nombre` (coincidencia parcial, case-insensitive).
19. Permitir combinar múltiples filtros en una misma petición.
20. Implementar paginación con los query params `page` y `limit`, incluyendo en la respuesta la metadata de paginación (`page`, `limit`, `total`, `totalPages`).

### Estructura de Respuestas

21. Envolver todas las respuestas exitosas dentro de la propiedad `"data"`.
22. Envolver todas las respuestas de error dentro de la propiedad `"error"` con los campos `"code"` y `"message"`.
23. Usar los códigos HTTP correctos: `200` para consultas exitosas, `201` para creación, `401` para no autenticado, `403` para no autorizado, `404` para no encontrado, `400` para validación fallida.

---

## Modelo de Datos

### Producto

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador único, autogenerado |
| `nombre` | string | Nombre del producto |
| `descripcion` | string | Descripción detallada |
| `subcategoria` | string | Subcategoría del producto |
| `precio` | number | Precio unitario |
| `precioxcantidad` | number | Precio por cantidad/mayoreo |
| `estado` | string | `"activo"` o `"inactivo"` |

### Usuarios precargados

```json
[
  { "id": 1, "usuario": "admin", "password": "admin123", "activo": true },
  { "id": 2, "usuario": "estudiante", "password": "est2025", "activo": true },
  { "id": 3, "usuario": "inactivo", "password": "noactivo1", "activo": false }
]
```

---

## Niveles de Dificultad

| Nivel | Nota | Alcance |
|-------|------|---------|
| Básico | 3.0 | Puntos 1 al 9: Endpoint `/auth` + CRUD completo sin protección JWT + códigos HTTP correctos |
| Intermedio | 4.0 | Puntos 1 al 13: Todo lo anterior + middleware JWT + validación de usuario activo + estructura de respuesta consistente |
| Avanzado | 5.0 | Puntos 1 al 23: Todo lo anterior + validaciones de campos + expiración del token + filtros + paginación |

### Bonificación (+0.5, máximo 5.0)

- Incluir un README claro con instrucciones para instalar, ejecutar y probar.
- Adjuntar una colección de Postman o archivo `.http` con ejemplos de cada endpoint.
- Organizar el código en carpetas (rutas, middlewares, datos).

---

## Restricciones

- No usar base de datos. Todo en memoria.
- Tecnología libre (Node.js, Python, Java, etc.).
- Firmar el JWT con una clave secreta definida por el estudiante.
- Ejecutar el servidor en el puerto `3000` o indicar el puerto en el README.
- Entregar en un repositorio Git.
- Duración: 2 horas.

---

## Flujo de Prueba Sugerido

```
1. Hacer POST /auth con { "usuario": "admin", "password": "admin123" } → copiar el token
2. Hacer POST /productos con el token → verificar 201
3. Hacer GET /productos con el token → verificar que el producto aparece
4. Hacer GET /productos/1 con el token → verificar el producto específico
5. Hacer PUT /productos/1 con datos actualizados → verificar 200
6. Hacer DELETE /productos/1 con el token → verificar 200
7. Hacer GET /productos/1 → verificar 404
8. Hacer POST /auth con { "usuario": "inactivo", "password": "noactivo1" } → copiar el token
9. Hacer GET /productos con el token del usuario inactivo → verificar 403
```
