import "../css/estilos.css";
import {
  mostrarAlerta,
  ocultarAlerta,
  setBotonCargando,
  setIndicadorCargando,
} from "../componentes/index.js";
import { iniciarSesion } from "../modelos/api.js";
import { guardarToken, tomarMensajeSesion } from "../modelos/sesion.js";

const form = document.getElementById("formLogin");
const errBox = document.getElementById("msgError");
const btn = document.getElementById("btnEntrar");
const spinner = document.getElementById("cargando");

const flash = tomarMensajeSesion();
if (flash) {
  mostrarAlerta(errBox, flash);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  ocultarAlerta(errBox);

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value;

  setIndicadorCargando(spinner, true);
  setBotonCargando(btn, true);

  try {
    const { res, data } = await iniciarSesion(usuario, password);

    if (res.ok && data.data?.access_token) {
      guardarToken(data.data.access_token);
      window.location.href = "productos.html";
      return;
    }

    if (res.status === 401) {
      mostrarAlerta(
        errBox,
        data?.error?.message || "Usuario o contraseña incorrectos"
      );
      return;
    }

    mostrarAlerta(errBox, "No se pudo iniciar sesión.");
  } catch {
    mostrarAlerta(errBox, "Error de red. ¿Está la API en marcha?");
  } finally {
    setIndicadorCargando(spinner, false);
    setBotonCargando(btn, false);
  }
});
