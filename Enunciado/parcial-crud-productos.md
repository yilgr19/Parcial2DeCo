# Parcial Práctico — API REST: CRUD de Productos con Autenticación JWT

## Información General

| Campo | Detalle |
|-------|---------|
| Materia | Desarrollo de APIs REST |
| Tipo | Parcial práctico individual |
| Duración | 2 horas |
| Tecnología | Libre (Node.js/Express, Python/FastAPI, Java/Spring Boot, etc.) |
| Base de datos | No requerida — usar almacenamiento en memoria (array, lista, diccionario) |
| Entrega | Repositorio Git con README indicando cómo ejecutar el proyecto |

---

## Contexto

Usted ha sido contratado para desarrollar el backend de una tienda en línea. Como primer entregable, debe construir una API REST que permita gestionar el catálogo de productos y que esté protegida mediante autenticación JWT.

No se requiere conexión a base de datos. Todos los datos se almacenan en memoria (se pierden al reiniciar el servidor).

---

## Modelo de Datos

### Producto

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `id` | number | Identificador único, autogenerado | Sí (auto) |
| `nombre` | string | Nombre del producto | Sí |
| `descripcion` | string | Descripción detallada del producto | Sí |
| `subcategoria` | string | Subcategoría a la que pertenece | Sí |
| `precio` | number | Precio unitario del producto | Sí |
| `precioxcantidad` | number | Precio por cantidad/mayoreo | Sí |
| `estado` | string | Estado del producto: `"activo"` o `"inactivo"` | Sí |

### Usuario (datos precargados en memoria)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | number | Identificador único |
| `usuario` | string | Nombre de usuario |
| `password` | string | Contraseña (texto plano para simplificar) |
| `activo` | boolean | Si el usuario está activo o no |

**Usuarios precargados sugeridos:**

```json
[
  { "id": 1, "usuario": "admin", "password": "admin123", "activo": true },
  { "id": 2, "usuario": "estudiante", "password": "est2025", "activo": true },
  { "id": 3, "usuario": "inactivo", "password": "noactivo1", "activo": false }
]
```

---

## Endpoints Requeridos

### Autenticación

| Verbo | Endpoint | Descripción |
|-------|----------|-------------|
| `POST` | `/auth` | Recibe usuario y contraseña, retorna un JWT |

### CRUD de Productos (protegidos con JWT)

| Verbo | Endpoint | Descripción |
|-------|----------|-------------|
| `GET` | `/productos` | Listar todos los productos |
| `GET` | `/productos/:id` | Obtener un producto por ID |
| `POST` | `/productos` | Crear un nuevo producto |
| `PUT` | `/productos/:id` | Actualizar un producto existente |
| `DELETE` | `/productos/:id` | Eliminar un producto por ID |

---

## Niveles de Dificultad y Criterios de Evaluación

### Nivel 1 — Básico (3.0 / 5.0)

Requisitos mínimos para aprobar:

1. **Endpoint POST /auth** que reciba `usuario` y `password` en el body
   - Si las credenciales son correctas, responder con un JWT firmado
   - Si son incorrectas, responder `401 Unauthorized`
   - El JWT debe contener al menos: `sub` (id del usuario), `usuario`, `activo`

2. **CRUD básico de productos** (sin protección JWT):
   - `GET /productos` — retorna la lista completa de productos
   - `POST /productos` — crea un producto y lo agrega al array en memoria
   - `PUT /productos/:id` — actualiza un producto existente
   - `DELETE /productos/:id` — elimina un producto del array

3. **Respuestas con códigos HTTP correctos:**
   - `200` para consultas exitosas
   - `201` para creación exitosa
   - `404` cuando el producto no existe
   - `401` para credenciales inválidas

---

### Nivel 2 — Intermedio (4.0 / 5.0)

Todo lo del Nivel 1, más:

4. **Middleware de autenticación JWT:**
   - Todos los endpoints de `/productos` deben requerir el header `Authorization: Bearer <token>`
   - El middleware debe verificar la firma del JWT
   - Si el token es inválido o no se envía, responder `401 Unauthorized`

5. **Validación de usuario activo:**
   - Después de verificar la firma del JWT, extraer el claim `activo` del payload
   - Si el usuario NO está activo (`activo: false`), responder `403 Forbidden` con mensaje: `"Usuario inactivo, acceso denegado"`
   - Solo los usuarios activos pueden acceder a los endpoints del CRUD

6. **Manejo de errores consistente:**
   - Todas las respuestas de error deben seguir la estructura:
   ```json
   {
     "error": {
       "code": "CODIGO_ERROR",
       "message": "Descripción del error"
     }
   }
   ```
   - Todas las respuestas exitosas deben seguir la estructura:
   ```json
   {
     "data": { ... }
   }
   ```

---

### Nivel 3 — Avanzado (5.0 / 5.0)

Todo lo del Nivel 2, más:

7. **Validación de campos en la creación y actualización:**
   - Validar que todos los campos obligatorios estén presentes en `POST /productos`
   - Validar que `precio` y `precioxcantidad` sean números positivos
   - Validar que `estado` solo sea `"activo"` o `"inactivo"`
   - Si la validación falla, responder `400 Bad Request` con detalle de los campos inválidos:
   ```json
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Datos de entrada inválidos",
       "details": [
         { "field": "precio", "message": "Debe ser un número positivo" },
         { "field": "estado", "message": "Solo se permite 'activo' o 'inactivo'" }
       ]
     }
   }
   ```

8. **Expiración del token:**
   - El JWT debe tener una expiración de 1 hora (`exp`)
   - Si el token está expirado, responder `401 Unauthorized` con código `"TOKEN_EXPIRED"`

9. **Endpoint GET /productos con filtros por query params:**
   - `GET /productos?subcategoria=bebidas` — filtrar por subcategoría
   - `GET /productos?estado=activo` — filtrar por estado
   - `GET /productos?nombre=coca` — buscar por nombre (coincidencia parcial, case-insensitive)
   - Los filtros deben poder combinarse: `GET /productos?subcategoria=bebidas&estado=activo`

10. **Paginación en GET /productos:**
    - Soportar query params `page` y `limit`
    - Ejemplo: `GET /productos?page=1&limit=5`
    - La respuesta debe incluir metadata de paginación:
    ```json
    {
      "data": [ ... ],
      "pagination": {
        "page": 1,
        "limit": 5,
        "total": 23,
        "totalPages": 5
      }
    }
    ```

---

## Especificación Detallada de Endpoints

### POST /auth

**Request:**
```
POST /auth
Content-Type: application/json

{
  "usuario": "admin",
  "password": "admin123"
}
```

**Response exitosa — 200 OK:**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

**Response credenciales inválidas — 401 Unauthorized:**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Usuario o contraseña incorrectos"
  }
}
```

---

### GET /productos

**Request:**
```
GET /productos
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response — 200 OK:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Coca-Cola 600ml",
      "descripcion": "Bebida gaseosa sabor cola",
      "subcategoria": "bebidas",
      "precio": 2500,
      "precioxcantidad": 10000,
      "estado": "activo"
    }
  ]
}
```

**Response sin token — 401 Unauthorized:**
```json
{
  "error": {
    "code": "NO_TOKEN",
    "message": "Token de autenticación requerido"
  }
}
```

**Response usuario inactivo — 403 Forbidden:**
```json
{
  "error": {
    "code": "USER_INACTIVE",
    "message": "Usuario inactivo, acceso denegado"
  }
}
```

---

### GET /productos/:id

**Request:**
```
GET /productos/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response — 200 OK:**
```json
{
  "data": {
    "id": 1,
    "nombre": "Coca-Cola 600ml",
    "descripcion": "Bebida gaseosa sabor cola",
    "subcategoria": "bebidas",
    "precio": 2500,
    "precioxcantidad": 10000,
    "estado": "activo"
  }
}
```

**Response no encontrado — 404 Not Found:**
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No se encontró el producto con id 99"
  }
}
```

---

### POST /productos

**Request:**
```
POST /productos
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "nombre": "Pan integral",
  "descripcion": "Pan integral tajado 500g",
  "subcategoria": "panadería",
  "precio": 5800,
  "precioxcantidad": 22000,
  "estado": "activo"
}
```

**Response — 201 Created:**
```json
{
  "data": {
    "id": 2,
    "nombre": "Pan integral",
    "descripcion": "Pan integral tajado 500g",
    "subcategoria": "panadería",
    "precio": 5800,
    "precioxcantidad": 22000,
    "estado": "activo"
  }
}
```

---

### PUT /productos/:id

**Request:**
```
PUT /productos/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "nombre": "Coca-Cola 1.5L",
  "descripcion": "Bebida gaseosa sabor cola tamaño familiar",
  "subcategoria": "bebidas",
  "precio": 4500,
  "precioxcantidad": 16000,
  "estado": "activo"
}
```

**Response — 200 OK:**
```json
{
  "data": {
    "id": 1,
    "nombre": "Coca-Cola 1.5L",
    "descripcion": "Bebida gaseosa sabor cola tamaño familiar",
    "subcategoria": "bebidas",
    "precio": 4500,
    "precioxcantidad": 16000,
    "estado": "activo"
  }
}
```

---

### DELETE /productos/:id

**Request:**
```
DELETE /productos/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Response — 200 OK:**
```json
{
  "data": {
    "message": "Producto eliminado exitosamente"
  }
}
```

**Response no encontrado — 404 Not Found:**
```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "No se encontró el producto con id 1"
  }
}
```

---

## Resumen de Calificación

| Nivel | Puntos | Requisitos |
|-------|--------|------------|
| Nivel 1 — Básico | 3.0 | POST /auth + CRUD sin protección + códigos HTTP correctos |
| Nivel 2 — Intermedio | 4.0 | + Middleware JWT + validación usuario activo + estructura de respuesta consistente |
| Nivel 3 — Avanzado | 5.0 | + Validación de campos + expiración del token + filtros por query params + paginación |

**Bonificaciones (+0.5 cada una, máximo 5.0):**
- Documentación clara en el README (cómo instalar, ejecutar y probar)
- Colección de Postman o archivo `.http` con ejemplos de cada endpoint
- Código limpio, organizado en carpetas (rutas, middlewares, datos)

---

## Restricciones

- No usar base de datos. Todo en memoria.
- No copiar código de compañeros. Se revisará similitud.
- El JWT debe firmarse con una clave secreta definida por el estudiante (puede ser una constante en el código).
- El servidor debe correr en el puerto `3000` (o indicar en el README cuál puerto usa).

---

## Herramientas Sugeridas para Probar

- [Postman](https://www.postman.com/) — cliente gráfico para probar APIs
- [Thunder Client](https://www.thunderclient.com/) — extensión de VS Code
- Archivos `.http` con la extensión REST Client de VS Code
- `curl` desde la terminal

---

## Ejemplo de Flujo Completo de Prueba

```
1. POST /auth con { "usuario": "admin", "password": "admin123" }
   → Copiar el access_token de la respuesta

2. POST /productos con el body del producto + header Authorization: Bearer <token>
   → Verificar que retorna 201 con el producto creado

3. GET /productos con header Authorization: Bearer <token>
   → Verificar que el producto aparece en la lista

4. GET /productos/1 con header Authorization: Bearer <token>
   → Verificar que retorna el producto específico

5. PUT /productos/1 con body actualizado + header Authorization: Bearer <token>
   → Verificar que retorna 200 con los datos actualizados

6. DELETE /productos/1 con header Authorization: Bearer <token>
   → Verificar que retorna 200

7. GET /productos/1 con header Authorization: Bearer <token>
   → Verificar que retorna 404

8. POST /auth con { "usuario": "inactivo", "password": "noactivo1" }
   → Copiar el token

9. GET /productos con el token del usuario inactivo
   → Verificar que retorna 403 "Usuario inactivo, acceso denegado"
```
