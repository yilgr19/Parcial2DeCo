import "../css/estilos.css";
import {
  mostrarAlerta,
  ocultarAlerta,
  setBotonCargando,
  setIndicadorCargando,
} from "../componentes/index.js";
import { iniciarSesion } from "../modelos/api.js";
import {
  guardarToken,
  tomarMensajeSesion,
  haySesion,
  tokenValido,
} from "../modelos/sesion.js";
import { validarCredencialesFormulario } from "../modelos/validacionesLogin.js";

if (haySesion()) {
  window.location.replace("productos.html");
}

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

  const usuarioRaw = document.getElementById("usuario").value;
  const passwordRaw = document.getElementById("password").value;

  const validacion = validarCredencialesFormulario(usuarioRaw, passwordRaw);
  if (!validacion.ok) {
    mostrarAlerta(errBox, validacion.mensaje);
    return;
  }

  const { usuario, password } = validacion;

  setIndicadorCargando(spinner, true);
  setBotonCargando(btn, true);

  try {
    const { res, data } = await iniciarSesion(usuario, password);

    const token = data?.data?.access_token;
    if (res.ok && tokenValido(token)) {
      guardarToken(token.trim());
      window.location.replace("productos.html");
      return;
    }

    if (res.status === 401) {
      mostrarAlerta(
        errBox,
        data?.error?.message || "Usuario o contraseña incorrectos"
      );
      return;
    }

    mostrarAlerta(
      errBox,
      "La respuesta del servidor no incluye un token válido."
    );
  } catch {
    mostrarAlerta(errBox, "Error de red. ¿Está la API en marcha?");
  } finally {
    setIndicadorCargando(spinner, false);
    setBotonCargando(btn, false);
  }
});
