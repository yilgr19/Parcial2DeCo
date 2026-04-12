# Frontend — Parcial productos (JWT)

Aplicación en **HTML + JavaScript** con patrón **MVC** (carpetas `vistas`, `controladores`, `modelos`). Estilos con **Tailwind** vía `src/css/estilos.css` (`@tailwind`).

## Requisitos

- Node.js instalado
- API backend corriendo (por defecto `http://localhost:3000`)

## Instalar y ejecutar

```bash
cd frontend
npm install
npm run dev
```

Abrí la URL que muestra Vite. La raíz (`/`) redirige a **`/vistas/login.html`**.

Opcional: copiá `.env.example` a `.env` y ajustá `VITE_API_URL` si la API no está en `localhost:3000`.

## Estructura MVC

| Carpeta / archivo | Rol |
|-------------------|-----|
| **`vistas/`** | Vistas HTML: `login.html`, `productos.html` (solo estructura y clases Tailwind). |
| **`src/controladores/`** | Controladores: `login.controlador.js`, `productos.controlador.js` (eventos DOM, orquestación). |
| **`src/modelos/`** | Modelo: `api.js` (fetch a la API), `sesion.js` (token en `localStorage`), `config.js`, `validacionesProducto.js`. |
| **`src/css/estilos.css`** | Directivas Tailwind. |
| **`index.html`** (raíz) | Redirección a `vistas/login.html`. |

## Build

```bash
npm run build
```

Salida en `dist/`. Vista previa: `npm run preview`.
