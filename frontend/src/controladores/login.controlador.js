import "../css/estilos.css";
import { iniciarSesion } from "../modelos/api.js";
import { guardarToken, tomarMensajeSesion } from "../modelos/sesion.js";

const form = document.getElementById("formLogin");
const errBox = document.getElementById("msgError");
const btn = document.getElementById("btnEntrar");
const spinner = document.getElementById("cargando");

const flash = tomarMensajeSesion();
if (flash) {
  mostrarError(flash);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  errBox.classList.add("hidden");
  errBox.textContent = "";

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;

  setCargando(true);

  try {
    const { res, data } = await iniciarSesion(usuario, password);

    if (res.ok && data.data?.access_token) {
      guardarToken(data.data.access_token);
      window.location.href = "productos.html";
      return;
    }

    if (res.status === 401) {
      mostrarError(
        data?.error?.message || "Usuario o contraseña incorrectos"
      );
      return;
    }

    mostrarError("No se pudo iniciar sesión.");
  } catch {
    mostrarError("Error de red. ¿Está la API en marcha?");
  } finally {
    setCargando(false);
  }
});

function mostrarError(msg) {
  errBox.textContent = msg;
  errBox.classList.remove("hidden");
}

function setCargando(on) {
  spinner.classList.toggle("hidden", !on);
  btn.disabled = on;
}
