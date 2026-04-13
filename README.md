# Parcial — API REST + Frontend (productos y JWT)

Incluye un backend en **Node/Express** con JWT y CRUD en memoria, y un frontend en **HTML y JavaScript** con **Tailwind** que consume esa API.

---

## Cómo levantar el proyecto (recomendado)

Todo se hace desde la carpeta del proyecto  
`Parcial2 DeCo` (donde está este archivo `README.md`).

### Opción A — Doble clic (Windows)

1. Abre la carpeta del proyecto en el Explorador de archivos.
2. Haz **doble clic** en **`iniciar.bat`**.
3. La primera vez puede tardar mientras instala dependencias.
4. Cuando en la consola aparezca la URL del frontend (Vite), ábrela en el navegador (por ejemplo `http://localhost:5173`; redirige al login en `vistas/login.html`).
5. La **API** queda en `http://localhost:3000` en la misma ventana (se inicia junto con el frontend).

Para detener: cierra la ventana de consola o pulsa **Ctrl+C**.

### Opción B — Terminal (una sola ventana)

Abre **PowerShell** o **CMD** en la carpeta del proyecto y ejecuta **en este orden** (solo la primera vez haces `setup`):

```bash
npm install
npm run setup
npm run dev
```

Después, cada vez que quieras trabajar, basta con:

```bash
npm run dev
```

(si ya ejecutaste `npm install` y `npm run setup` antes).

**Nota:** Si en PowerShell `npm` muestra un error de “ejecución de scripts”, usa `npm.cmd` en lugar de `npm` (por ejemplo `npm.cmd run dev`).

### Qué hace `npm run dev`

Arranca **a la vez**:

- **API** → `http://localhost:3000`
- **Frontend** → la URL que muestra Vite (normalmente `http://localhost:5173`)

Inicia sesión, por ejemplo, con usuario `admin` y contraseña `admin123`.

---

## Si prefieres dos terminales por separado

| Qué | Comando (desde la carpeta del proyecto) |
|-----|----------------------------------------|
| Solo API | `npm run api` |
| Solo frontend | `npm run web` |

(También puedes usar `cd api` + `npm start`, y `cd frontend` + `npm run dev`.)

---

## Estructura del repositorio

| Carpeta | Contenido |
|---------|-----------|
| **`api/`** | Servidor REST. Más detalle en `api/README.md`. |
| **`frontend/`** | Login y productos. Más detalle en `frontend/README.md`. |
| **`Enunciado/`** | Enunciados del parcial. |

---

## Build del frontend (entrega)

```bash
cd frontend
npm run build
```

La salida queda en `frontend/dist/`. Vista previa: `npm run preview` dentro de `frontend/`.

---

## Documentación

- [api/README.md](api/README.md) — API, JWT, productos en memoria, tabla de comprobación de endpoints.
- [api/pruebas-api.http](api/pruebas-api.http) — ejemplos de cada endpoint (REST Client).
- En la carpeta `api`, con la API en marcha: **`npm run verify`** — comprueba los endpoints automáticamente (sin pegar tokens).
- [frontend/README.md](frontend/README.md) — archivos del frontend.

Los productos están **solo en memoria** en el servidor; al reiniciar la API se pierden.
