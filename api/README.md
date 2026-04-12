# API REST — Catálogo de productos (JWT)

API para el parcial: autenticación con JWT, CRUD de productos en memoria, validaciones, filtros y paginación. Servidor en **Node.js** con **Express**.

---

## Cómo ejecutar

1. Instalar dependencias (solo la primera vez):

   ```bash
   npm install
   ```

2. Arrancar el servidor (por defecto puerto **3000**):

   ```bash
   npm start
   ```

3. Modo desarrollo (reinicia al guardar cambios en los archivos):

   ```bash
   npm run dev
   ```

Variables opcionales:

- `PORT` — puerto del servidor (si no se define, se usa `3000`).
- `JWT_SECRET` — clave para firmar tokens (si no se define, se usa una constante en código; en producción conviene definirla).

---

## Funcionamiento de la API

### Visión general

1. El **cliente** (Postman, navegador, frontend) envía peticiones HTTP al servidor Express.
2. Express aplica **middleware global**: CORS y parseo del body JSON.
3. Según la **URL**, la petición va a:
   - **`/auth`** → solo la ruta de login (`POST`). No pide token.
   - **`/productos`** → primero pasa por **`authJwt`**: exige `Authorization: Bearer <token>` válido y usuario activo; si falla, responde sin llegar al CRUD.
4. Las rutas llaman a **`data/`** (usuarios o productos) y a **`utils/`** (validación y formato de JSON).
5. La respuesta siempre sigue el formato del enunciado: éxito con **`data`** (y **`pagination`** en el listado paginado); error con **`error.code`** y **`error.message`** (y **`details`** en validación).

### Flujo de autenticación

1. El cliente hace **`POST /auth`** con `usuario` y `password`.
2. El servidor busca en el array de **`usuarios.js`**. Si no hay coincidencia → **`401`**.
3. Si hay coincidencia, se firma un **JWT** con `jsonwebtoken`, incluyendo `sub` (id del usuario), `usuario`, `activo` y expiración de **1 hora**.
4. El cliente guarda el **`access_token`** y lo envía en cada llamada a **`/productos`** en el header:  
   `Authorization: Bearer <access_token>`.

### Flujo del CRUD de productos

1. El middleware **`authJwt`** valida el token (firma, no expirado) y que **`activo`** no sea `false`.
2. **`GET /productos`** aplica filtros en memoria (`subcategoria`, `estado`, `nombre`) y paginación (`page`, `limit`), y devuelve `data` + `pagination`.
3. **`GET /productos/:id`**, **`POST`**, **`PUT`**, **`DELETE`** operan sobre el array en **`productosStore.js`** (ver sección siguiente).
4. Validaciones de creación/edición están en **`validarProducto.js`**; si fallan → **`400`** con lista de campos en **`error.details`**.

### Códigos HTTP que usa esta API (resumen)

| Código | Cuándo |
|--------|--------|
| **200** | Consultas y actualizaciones correctas; borrado correcto. |
| **201** | Producto creado. |
| **400** | Validación de datos del producto incorrecta. |
| **401** | Login fallido, token ausente, inválido o expirado. |
| **403** | Token válido pero usuario **inactivo** en el JWT. |
| **404** | Ruta inexistente o producto con ese `id` no encontrado. |

---

## Productos: dónde están, cómo se cargan y qué preguntan en la defensa

### Dónde están en el código

Los productos viven en **`src/data/productosStore.js`**, en un **array en memoria** llamado internamente `productos`, que al **arrancar el servidor** está **vacío** (`[]`).

- **No** hay un archivo JSON ni base de datos: el enunciado exige **solo memoria**.
- Los **usuarios** sí están **precargados** en código (`usuarios.js`), porque el enunciado da una lista fija. Los **productos no** vienen dados: se supone que el catálogo lo va llenando el uso de la API (`POST`) o pruebas manuales.

### Cómo “se cargan” los productos

| Origen | Qué ocurre |
|--------|------------|
| **Al iniciar el servidor** | El array empieza vacío; no hay productos hasta que alguien cree uno. |
| **`POST /productos`** | Se valida el body, se asigna un **`id`** autogenerado (contador `nextId`) y se hace **`push`** al array. |
| **`PUT /productos/:id`** | Se reemplaza el producto con ese `id` si existe. |
| **`DELETE /productos/:id`** | Se quita del array. |
| **Reinicio del servidor** | **Se pierde todo**: la memoria se vacía otra vez (comportamiento esperado del parcial). |

### IDs autogenerados

El **primer** producto creado tendrá `id = 1`, el siguiente `2`, etc., mediante el contador **`nextId`** en el mismo archivo. No lo elige el cliente en el `POST` (el `id` lo genera el servidor).

### Cómo explicarlo en una pregunta oral (resumen)

- *“¿Dónde guardan los productos?”* → En un **array en memoria** en `productosStore.js`, **sin base de datos**.
- *“¿Hay datos iniciales?”* → **No** para productos; **sí** para usuarios en `usuarios.js`.
- *“¿Qué pasa si apago el servidor?”* → **Se pierden** los productos; al volver a levantar, la lista está vacía otra vez.
- *“¿Cómo se relaciona con el JWT?”* → Todas las rutas bajo **`/productos`** exigen token válido y usuario activo; **`/auth`** es la única que entrega el token.

---

## Estructura de carpetas y por qué existen

La carpeta `api` agrupa todo el backend. Dentro, el código fuente vive en **`src/`** para separarlo de la configuración del proyecto (`package.json`, dependencias, etc.).

| Carpeta / archivo | Motivo |
|-------------------|--------|
| **`src/`** | Punto único del código de la aplicación: más fácil de navegar y de entregar. |
| **`src/data/`** | **Datos en memoria** (usuarios fijos y lista de productos). El enunciado pide no usar base de datos; aislar “dónde están los datos” evita mezclar arrays con la lógica HTTP. |
| **`src/middleware/`** | Código que se ejecuta **antes** de las rutas de productos: aquí va la verificación del JWT. Así no se repite el mismo código en cada endpoint. |
| **`src/rutas/`** | **Definición de endpoints** (URLs y métodos HTTP). Una ruta por recurso (`auth`, `productos`) mantiene cada archivo acotado. |
| **`src/utils/`** | Funciones **reutilizables** que no son rutas ni datos: formato de respuestas JSON y validación de productos. |

Los archivos de la raíz de `api` (`package.json`, `package-lock.json`, `node_modules/`) son estándar de Node: dependencias, scripts y librerías instaladas.

---

## Qué hace cada archivo

### Raíz de `api`

| Archivo | Función |
|---------|---------|
| **`package.json`** | Define el nombre del proyecto, el comando `npm start`, las dependencias (Express, JWT, CORS) y `"type": "module"` para usar `import`/`export` modernos. |
| **`package-lock.json`** | Fija versiones exactas de dependencias para que la instalación sea reproducible. |
| **`node_modules/`** | Carpeta generada por `npm install`; contiene las librerías. No se edita a mano. |

---

### `src/index.js`

**Entrada principal del servidor.** Crea la app Express, activa **CORS** (para que un frontend en otro puerto pueda llamar a la API), interpreta el cuerpo JSON (`express.json()`), registra las rutas:

- `/auth` → login (sin JWT).
- `/productos` → todas las rutas de productos pasan antes por el middleware **`authJwt`** (token obligatorio).

Al final define un manejador para rutas inexistentes (`404`) y pone el servidor a escuchar en el puerto configurado.

---

### `src/config.js`

**Constantes centralizadas:** puerto (`PORT`), clave secreta del JWT (`JWT_SECRET`) y duración del token en segundos (`JWT_EXPIRES_SEC`, 3600 = 1 hora). Así se cambia el comportamiento sin tocar la lógica de rutas.

---

### `src/data/usuarios.js`

**Usuarios precargados** según el enunciado (admin, estudiante, inactivo). Mantiene la lista en memoria y exporta `buscarPorCredenciales(usuario, password)`, que usa `POST /auth` para validar el login sin devolver contraseñas en la respuesta.

---

### `src/data/productosStore.js`

**Almacenamiento en memoria** de productos: array interno y contador para **IDs autogenerados**. Exporta funciones para leer, crear, actualizar, borrar y buscar por `id`, en lugar de manipular el array directamente desde las rutas. Si se reinicia el servidor, los datos se pierden (como pide el parcial).

---

### `src/middleware/authJwt.js`

**Middleware de autenticación** para `/productos`:

1. Lee el header `Authorization: Bearer <token>`.
2. Si falta el token → respuesta `401` con código `NO_TOKEN`.
3. Verifica firma y validez del JWT con la misma clave que en el login.
4. Si el token expiró → `401` con código `TOKEN_EXPIRED`.
5. Si el token es inválido → `401` con código `INVALID_TOKEN`.
6. Si el usuario tiene `activo: false` en el payload → `403` con el mensaje de usuario inactivo.

Si todo es correcto, adjunta la información decodificada (por si hiciera falta más adelante) y llama a `next()` para seguir a la ruta del producto.

---

### `src/rutas/auth.js`

**Ruta `POST /auth`:** recibe `usuario` y `password` en JSON. Si las credenciales coinciden con `usuarios.js`, genera un JWT con `sub` (id), `usuario` y `activo`, con expiración de 1 hora, y responde en el formato del enunciado (`access_token`, `token_type`, `expires_in` dentro de `data`). Si fallan las credenciales → `401` con `INVALID_CREDENTIALS`.

---

### `src/rutas/productos.js`

**CRUD y listado** (ya protegido por JWT a nivel de `index.js`):

| Método | Ruta | Comportamiento |
|--------|------|----------------|
| `GET` | `/` | Lista con **filtros** opcionales (`subcategoria`, `estado`, `nombre` parcial sin distinguir mayúsculas) y **paginación** (`page`, `limit`). Respuesta con `data` (array) y `pagination` (`page`, `limit`, `total`, `totalPages`). |
| `GET` | `/:id` | Un producto por ID; `404` si no existe. |
| `POST` | `/` | Crea producto; valida el cuerpo con `validarProducto.js`; `201` si OK. |
| `PUT` | `/:id` | Actualiza; mismas validaciones; `404` si el ID no existe. |
| `DELETE` | `/:id` | Elimina; `200` con mensaje en `data`; `404` si no existe. |

---

### `src/utils/respuestas.js`

**Formato uniforme** de respuestas JSON del parcial:

- Éxito: `{ "data": ... }` (y opcionalmente se combina con `pagination` en el listado, según el enunciado).
- Error: `{ "error": { "code", "message" } }` y, en validación, `details` con lista de `{ field, message }`.

Así las rutas no repiten la estructura del JSON en cada respuesta.

---

### `src/utils/validarProducto.js`

**Validaciones** para crear y actualizar productos: campos obligatorios (`nombre`, `descripcion`, `subcategoria`, `precio`, `precioxcantidad`, `estado`), números positivos para precios y `estado` solo `activo` o `inactivo`. Devuelve lista de errores por campo o un objeto listo para guardar. Lo usan `POST` y `PUT` de productos.

---

## Resumen visual

```
api/
├── package.json
├── package-lock.json
├── pruebas-api.http
├── scripts/
│   └── verificar-endpoints.mjs   ← usado por npm run verify
├── node_modules/
└── src/
    ├── index.js
    ├── config.js
    ├── data/
    │   ├── usuarios.js
    │   └── productosStore.js
    ├── middleware/
    │   └── authJwt.js
    ├── rutas/
    │   ├── auth.js
    │   └── productos.js
    └── utils/
        ├── respuestas.js
        └── validarProducto.js
```

---

## Instalar, ejecutar y probar (bonificación / entrega)

### Instalar y ejecutar

1. `cd api` (o desde la raíz del repo: `npm run setup` si aún no instalaste dependencias).
2. `npm install`
3. `npm start` → el servidor debe mostrar `API escuchando en http://localhost:3000`.

### Verificación automática (recomendado — no hace falta pegar tokens)

Con la API **ya en marcha** en otra terminal, en la carpeta `api` ejecutá:

```bash
npm run verify
```

El script `scripts/verificar-endpoints.mjs` llama a los endpoints (login, listado, crear, editar, errores, usuario inactivo, borrar, etc.) y muestra líneas `OK` o `FAIL`. Si todo sale bien, al final verás **Resultado: todo OK.**

Si falla la conexión, el mensaje te indica que tenés que arrancar antes la API con `npm start`.

### Probar con el archivo `pruebas-api.http` (extensión REST Client)

**Idea general:** podés enviar peticiones desde el editor con la extensión **REST Client** y el archivo **`api/pruebas-api.http`**.

El archivo ya está armado para que **no tengas que copiar el token a mano**: la primera petición se llama **Login admin** y lleva `# @name loginAdmin`. Las siguientes usan automáticamente `{{loginAdmin.response.body.$.data.access_token}}` en el header `Authorization`.

**Pasos:**

1. Instalá **REST Client** (*Huachao Mao*) en Cursor/VS Code.
2. `npm start` en `api/` (la API tiene que estar corriendo).
3. Abrí **`pruebas-api.http`**.
4. Hacé clic en **Send Request** del bloque **Login admin** primero (así queda guardada la respuesta para el token).
5. Después podés enviar el resto de bloques en cualquier orden; los que van a `/productos` ya usan el Bearer del login admin.
6. Para el flujo **usuario inactivo**, enviá antes el bloque **Login — usuario inactivo** (`# @name loginInactivo`) y luego **Listar con token de usuario inactivo**.

Si en tu versión de REST Client no resuelve bien `{{loginAdmin.response...}}`, usá **`npm run verify`** arriba o **Thunder Client** (siguiente sección).

### Verificación con Thunder Client

**Thunder Client** es una extensión de VS Code / Cursor para probar APIs sin salir del editor.

1. **Instalar:** en el panel de extensiones, buscá **Thunder Client** (autor *Ranga Vadhineni*) e instalala.
2. **Levantar la API:** `npm start` en la carpeta `api/` y comprobá el mensaje `API escuchando en http://localhost:3000`.
3. **Abrir Thunder Client:** icono del rayo en la barra lateral (o menú *View → Thunder Client*).
4. **Login (obtener token):**
   - **New Request** → método **POST** → URL `http://localhost:3000/auth`.
   - Pestaña **Body** → **JSON** → pegá:  
     `{"usuario":"admin","password":"admin123"}`  
   - **Send**. En la respuesta, copiá el valor de `data.access_token` (sin comillas).
5. **Peticiones a `/productos` (con Bearer):**
   - Nueva petición **GET** → `http://localhost:3000/productos`.
   - Pestaña **Auth** → tipo **Bearer** → en **Token** pegá el `access_token` que copiaste (o usá una variable, ver el punto 7).
   - **Send** → deberías ver **200**, `data` (array) y `pagination`.
6. **Mismo patrón** para el resto de endpoints (misma base `http://localhost:3000`):
   - **GET** `http://localhost:3000/productos/1` (Auth → Bearer).
   - **POST** `http://localhost:3000/productos` → Body JSON con todos los campos del producto (Auth → Bearer).
   - **PUT** `http://localhost:3000/productos/1` → Body JSON completo (Auth → Bearer).
   - **DELETE** `http://localhost:3000/productos/1` (Auth → Bearer).
   - **GET** con query, por ejemplo:  
     `http://localhost:3000/productos?nombre=coca&subcategoria=bebidas&estado=activo&page=1&limit=10` (Auth → Bearer).
7. **Opcional — variables:** en Thunder Client podés crear un **Environment** (por ejemplo `local`) con una variable `token`, y en cada request usar **Auth → Bearer** y en el token `{{token}}`. Tras cada login, actualizá el valor de `token` en el entorno para no pegarlo a mano en cada petición.
8. **Casos extra (401, 403, 400, 404):** probá **GET** `/productos` **sin** pestaña Auth (debería dar **401**). Para **403**, hacé login con `inactivo` / `noactivo1`, copiá ese token y usalo en **GET** `/productos`. Para **404**, **GET** `/productos/9999` con Bearer de admin. Los cuerpos de error coinciden con la tabla de abajo.
9. **Lista de escenarios:** el archivo **`pruebas-api.http`** del repo enumera los mismos casos; podés **recrear cada uno** como request en Thunder Client o copiar URL, método y JSON desde ahí.

Compará cada respuesta con la **tabla de verificación** siguiente.

### Tabla de verificación rápida (qué deberías obtener)

| Petición (resumen) | Código esperado | Notas |
|--------------------|-----------------|--------|
| Login admin correcto | 200 | `data.access_token`, `expires_in`: 3600 |
| Login mal password | 401 | `INVALID_CREDENTIALS` |
| GET /productos sin `Authorization` | 401 | `NO_TOKEN` |
| GET /productos con Bearer válido | 200 | `data` + `pagination` |
| GET con filtros `nombre`, `subcategoria`, `estado` | 200 | Filtros combinables |
| GET /productos/:id existente | 200 | Un objeto en `data` |
| GET /productos/:id inexistente | 404 | `PRODUCT_NOT_FOUND` |
| POST /productos cuerpo válido | 201 | Producto con `id` autogenerado |
| POST cuerpo inválido | 400 | `VALIDATION_ERROR` + `details[]` |
| PUT /productos/:id | 200 | Actualización |
| DELETE /productos/:id | 200 | `data.message` |
| Login usuario `inactivo` | 200 | Sigue devolviendo token |
| GET /productos con ese token | 403 | `USER_INACTIVE` |

### Flujo mínimo manual (sin extensiones)

1. `POST http://localhost:3000/auth` con `{"usuario":"admin","password":"admin123"}`.
2. Copiar `data.access_token`.
3. `GET http://localhost:3000/productos` con header `Authorization: Bearer <token>`.

### Organización del código (enunciado)

- **Rutas:** `src/rutas/` (`auth.js`, `productos.js`).
- **Middleware JWT:** `src/middleware/authJwt.js`.
- **Datos en memoria:** `src/data/`.
- **Utilidades:** `src/utils/` (respuestas JSON y validación).
