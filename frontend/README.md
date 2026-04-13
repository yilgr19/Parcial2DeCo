# Frontend — Parcial productos (JWT)

Interfaz en **HTML y JavaScript**, organizada como **MVC**: carpetas `vistas`, `controladores` y `modelos`. Los estilos usan **Tailwind** a través de `src/css/estilos.css` (`@tailwind`).

## Requisitos

- Node.js
- API backend en ejecución (por defecto en `http://localhost:3000`)

## Instalar y ejecutar

```bash
cd frontend
npm install
npm run dev
```

Abre en el navegador la URL que indica Vite. La raíz (`/`) redirige a **`/vistas/login.html`**.

Opcional: copia `.env.example` a `.env` y cambia `VITE_API_URL` si la API no está en `localhost:3000`.

## Estructura MVC

| Carpeta / archivo | Contenido |
|-------------------|-----------|
| **`vistas/`** | Páginas HTML: `login.html`, `productos.html` (estructura y clases Tailwind). |
| **`src/controladores/`** | Lógica de pantalla: `login.controlador.js`, `productos.controlador.js` (eventos y flujo). |
| **`src/modelos/`** | `api.js` (llamadas a la API), `sesion.js` (token en `localStorage`), `config.js`, `validacionesProducto.js`. |
| **`src/css/estilos.css`** | Entrada de Tailwind. |
| **`index.html`** (raíz) | Redirección a `vistas/login.html`. |

## Build

```bash
npm run build
```

La salida queda en `dist/`. Para revisar el resultado: `npm run preview`.
