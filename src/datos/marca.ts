/* Un solo lugar para la identidad. Ajustar al manual de marca de Coopeuch. */
/* Los colores se sobreescriben en caliente cuando cambia la institución activa
   (ver src/estado/sesion.ts). Estos son los de Coopeuch como valor por defecto. */
export const MARCA = {
  rojo: "#E4032E",
  rojoOsc: "#A50B22",
  tinta: "#141414",
  gris: "#6B6663",
  niebla: "#F2F1EF",
  linea: "#DCD8D3",
  ok: "#1E7A4C",
  alerta: "#B26A00",
  falla: "#B00020",
  deloitte: "#86BC25",
  // El archivo lo pone el equipo en /public. El componente <Logo> prueba
  // logo-coopeuch.png / .jpg / .svg y si no hay ninguno no dibuja nada.
  nombre: "Coopeuch",
  logo: "/logo-coopeuch.png",
};

export const SET_REGLAS = "cl-cmf-2026.07";
