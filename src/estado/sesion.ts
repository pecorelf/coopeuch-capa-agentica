import { create } from "zustand";
import { INSTITUCIONES, institucion, type Institucion } from "../datos/instituciones";
import { MARCA } from "../datos/marca";

/* Acceso y selección de institución.
   La clave es compartida a propósito: es una demo comercial, no un sistema con
   datos reales. No sustituye la protección del despliegue: para que la URL no
   quede pública conviene activar Password Protection en Vercel. */

export const USUARIOS = [
  { id: "italo", nombre: "Italo Pinochet", rol: "Deloitte Digital" },
  { id: "luz", nombre: "Luz Elena Parra", rol: "Deloitte Digital" },
  { id: "peco", nombre: "Francisco Pecorella", rol: "Deloitte Digital" },
  { id: "greshy", nombre: "Greshy Moreno", rol: "Deloitte Digital" },
];

const CLAVE = "deloitte-2026";
const LLAVE_SESION = "cam.sesion";
const LLAVE_INST = "cam.institucion";

interface Estado {
  autenticado: boolean;
  usuario: string | null;
  institucionId: string;
  inst: Institucion;
  tema: number;              // se incrementa para forzar remontaje del árbol
  entrar: (usuarioId: string, clave: string) => boolean;
  salir: () => void;
  setInstitucion: (id: string) => void;
  actualizarInstitucion: (parcial: Partial<Institucion>) => void;
}

const leer = (k: string) => {
  try { return window.localStorage.getItem(k); } catch { return null; }
};
const guardar = (k: string, v: string) => {
  try { window.localStorage.setItem(k, v); } catch {}
};

/* Permite abrir la demo ya configurada: ?institucion=santander */
const desdeUrl = () => {
  try {
    const p = new URLSearchParams(window.location.search).get("institucion");
    return p && INSTITUCIONES.some((x) => x.id === p) ? p : null;
  } catch { return null; }
};

const inicial = desdeUrl() || leer(LLAVE_INST) || "coopeuch";

export const useSesion = create<Estado>((set, get) => ({
  autenticado: leer(LLAVE_SESION) === "1",
  usuario: leer(LLAVE_SESION + ".usuario"),
  institucionId: inicial,
  inst: institucion(inicial),
  tema: 0,

  entrar: (usuarioId, clave) => {
    if (clave.trim().toLowerCase() !== CLAVE) return false;
    const u = USUARIOS.find((x) => x.id === usuarioId);
    if (!u) return false;
    guardar(LLAVE_SESION, "1");
    guardar(LLAVE_SESION + ".usuario", u.nombre);
    set({ autenticado: true, usuario: u.nombre });
    return true;
  },

  salir: () => {
    guardar(LLAVE_SESION, "0");
    set({ autenticado: false, usuario: null });
  },

  setInstitucion: (id) => {
    const inst = institucion(id);
    guardar(LLAVE_INST, id);
    aplicarTema(inst);
    sincronizarConfig(inst);
    set({ institucionId: id, inst, tema: get().tema + 1 });
  },

  actualizarInstitucion: (parcial) =>
    set((s) => {
      const inst = { ...s.inst, ...parcial };
      aplicarTema(inst);
      sincronizarConfig(inst);
      return { inst, tema: s.tema + 1 };
    }),
}));

/* Aplica el tema de la institución.
   Los componentes leen MARCA.rojo en cada render, así que mutar el objeto y
   remontar el árbol (key en App) es lo que hace que el color cambie de verdad.
   Antes solo se escribían variables CSS que ningún componente usaba: por eso
   la marca no cambiaba al elegir otra institución. */
export function aplicarTema(inst: Institucion) {
  MARCA.rojo = inst.colores.rojo;
  MARCA.rojoOsc = inst.colores.rojoOsc;
  MARCA.tinta = inst.colores.tinta;
  MARCA.niebla = inst.colores.niebla;
  MARCA.linea = inst.colores.linea;
  MARCA.nombre = inst.nombre;
  MARCA.logo = inst.logo;

  if (typeof document !== "undefined") {
    const r = document.documentElement;
    r.style.setProperty("--marca-rojo", inst.colores.rojo);
    r.style.setProperty("--marca-rojo-osc", inst.colores.rojoOsc);
    r.style.setProperty("--marca-niebla", inst.colores.niebla);
    r.style.setProperty("--marca-linea", inst.colores.linea);
    document.body.style.background = inst.colores.niebla;
  }
}


/* El contexto, la voz y las palabras vetadas que reciben los agentes vienen de
   la institución activa. Si el usuario los editó en Configuración, esta función
   los reemplaza al cambiar de institución: es lo correcto, porque son de otra
   marca. */
type ConfigApi = {
  setContexto: (t: string) => void;
  setVoz: (t: string) => void;
  setVetadas: (v: string[]) => void;
};
let apiConfig: (() => ConfigApi) | null = null;

/* config.ts se registra acá al cargarse. Evita el import circular: sesion no
   importa config, config avisa que existe. */
export function registrarConfig(fn: () => ConfigApi) {
  apiConfig = fn;
}

function sincronizarConfig(inst: Institucion) {
  if (!apiConfig) return;
  const c = apiConfig();
  c.setContexto(inst.contexto);
  c.setVoz(inst.voz);
  c.setVetadas(inst.vetadas);
}
