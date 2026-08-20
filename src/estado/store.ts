import { create } from "zustand";
import { CASOS } from "../datos/casos";
import { BIBLIOTECA_INICIAL } from "../datos/biblioteca";
import type { Caso, Modulo } from "../lib/tipos";

export type Vista = "config" | "casos" | "libre" | "produccion" | "audiencias" | "bitacora" | "admin";

export interface EventoLog {
  t: string;
  agente: string;
  evento: string;
  ref?: string;
}

/* Las siete etapas del recorrido. La duracion es el tiempo que cada agente
   permanece en pantalla en velocidad 1x. */
export const ETAPAS = [
  { id: 1, agente: "A1", nombre: "Estrategia", tarea: "Fija ángulo, promesa y riesgo antes de escribir", duracion: 6000 },
  { id: 2, agente: "A2", nombre: "Redacción A/B/C", tarea: "Escribe tres variantes con hipótesis distintas", duracion: 10000 },
  { id: 3, agente: "A3", nombre: "Compliance", tarea: "Evalúa las tres contra el set de reglas", duracion: 9000 },
  { id: 4, agente: "PANEL", nombre: "Test A/B/C", tarea: "El panel del segmento prueba las tres variantes", duracion: 12000 },
  { id: 5, agente: "A2", nombre: "Refinamiento", tarea: "Combina lo que funcionó y corrige lo que falló", duracion: 9000 },
  { id: 6, agente: "A5", nombre: "Activación", tarea: "Empaqueta para Salesforce Marketing Cloud", duracion: 7000 },
];

const hora = () =>
  new Date().toLocaleTimeString("es-CL", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

export const firma = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0").slice(0, 8);
};

function eventosDe(c: Caso, etapa: number): EventoLog[] {
  const t = hora();
  const bloqueadas = c.variantes.filter((v) => v.veredicto === "no apto").map((v) => v.id);
  switch (etapa) {
    case 1:
      return [{ t, agente: "A1 Estrategia", evento: "Ángulo fijado y riesgo declarado antes de escribir", ref: firma(c.estrategia.angulo) }];
    case 2:
      return [
        { t, agente: "A2 Redacción", evento: "Tres variantes generadas con hipótesis distintas", ref: c.variantes.map((v) => v.id + "·" + v.nombre).join(" / ") },
        { t, agente: "A4 Diseño", evento: "Ilustración de cabecera generada como SVG", ref: "vector, no imagen de stock" },
      ];
    case 3:
      return [
        { t, agente: "A3 Compliance", evento: `Veredictos: ${c.variantes.map((v) => v.id + " " + v.veredicto).join(" · ")}`, ref: "set cl-cmf-2026.07" },
        ...(bloqueadas.length
          ? [{ t, agente: "A3 Compliance", evento: `Variante ${bloqueadas.join(", ")} detenida antes de salir del área`, ref: "" }]
          : []),
      ];
    case 4:
      return [
        { t, agente: "Panel sintético", evento: `${c.panelSegmento.length} socios del segmento evaluaron las tres variantes`, ref: `n=${c.panelSegmento.length} · 3 variantes` },
        { t, agente: "Panel sintético", evento: `Gana la variante ${c.ganador}`, ref: "decisión con evidencia, no por gusto" },
      ];
    case 5:
      return [
        { t, agente: "A2 Redacción", evento: "Pieza final construida sobre la ganadora", ref: firma(c.piezaFinal.asunto) },
        { t, agente: "A3 Compliance", evento: "Revalidación de la pieza final · apto", ref: "set cl-cmf-2026.07" },
      ];
    case 6:
      return [
        { t, agente: "A5 Activación", evento: `Paquete listo para ${c.activacion.journey}`, ref: c.activacion.dataExtension },
        { t, agente: "Sistema", evento: "Data no real · sin conexión a sistemas Coopeuch", ref: "" },
      ];
    default:
      return [];
  }
}

export interface ResultadoLibre {
  brief: any;
  estrategia: any;
  pieza: any;
  imagen: string;
  compliance: any;
  reacciones: any[];
  ids: string[];
  modulos: any[];
  log: EventoLog[];
}

interface Estado {
  vista: Vista;
  casoId: string;
  etapa: number;
  reproduciendo: boolean;
  velocidad: number;
  log: EventoLog[];
  biblioteca: Modulo[];
  corridas: number;
  libre: ResultadoLibre | null;
  ultima: "caso" | "libre";

  irA: (v: Vista) => void;
  elegirCaso: (id: string) => void;
  reproducir: () => void;
  pausar: () => void;
  alternar: () => void;
  avanzar: () => void;
  retroceder: () => void;
  reiniciar: () => void;
  setVelocidad: (v: number) => void;
  anotar: (e: EventoLog) => void;
  registrarAprendizaje: (c: Caso) => void;
  guardarLibre: (r: ResultadoLibre) => void;
}

export const useApp = create<Estado>((set, get) => ({
  vista: "casos",
  casoId: CASOS[0].id,
  etapa: 0,
  reproduciendo: false,
  velocidad: 1,
  log: [],
  biblioteca: BIBLIOTECA_INICIAL,
  corridas: 0,
  libre: null,
  ultima: "caso",

  irA: (v) => set({ vista: v }),

  elegirCaso: (id) => set({ casoId: id, etapa: 0, log: [], reproduciendo: false, ultima: "caso" }),

  reproducir: () => set({ reproduciendo: true }),
  pausar: () => set({ reproduciendo: false }),
  alternar: () => set({ reproduciendo: !get().reproduciendo }),

  avanzar: () => {
    const { etapa, casoId, log } = get();
    if (etapa >= ETAPAS.length) return set({ reproduciendo: false });
    const c = CASOS.find((x) => x.id === casoId)!;
    const siguiente = etapa + 1;
    set({ etapa: siguiente, log: [...log, ...eventosDe(c, siguiente)] });
    if (siguiente === ETAPAS.length) {
      set({ reproduciendo: false });
      get().registrarAprendizaje(c);
    }
  },

  retroceder: () => {
    const { etapa } = get();
    if (etapa <= 0) return;
    set({ etapa: etapa - 1, reproduciendo: false });
  },

  reiniciar: () => set({ etapa: 0, log: [], reproduciendo: false }),

  setVelocidad: (v) => set({ velocidad: v }),

  anotar: (e) => set({ log: [...get().log, e] }),

  guardarLibre: (r) =>
    set((s) => {
      const nuevos = (r.modulos || []).filter((m: any) => m.origen === "nuevo" && !s.biblioteca.some((b) => b.id === m.id));
      const usados = (r.modulos || []).filter((m: any) => m.origen === "biblioteca").map((m: any) => m.id);
      return {
        libre: r,
        ultima: "libre",
        corridas: s.corridas + 1,
        biblioteca: [
          ...nuevos.map((n: any) => ({ ...n, tipo: "Módulo HTML", usos: 1 })),
          ...s.biblioteca.map((b) => (usados.includes(b.id) ? { ...b, usos: (b.usos || 0) + 1 } : b)),
        ],
      };
    }),

  registrarAprendizaje: (c) => {
    const usados = c.modulos.filter((m) => m.origen === "biblioteca").map((m) => m.id);
    const nuevos = c.modulos.filter((m) => m.origen === "nuevo");
    set((s) => {
      const yaEsta = (id: string) => s.biblioteca.some((b) => b.id === id);
      const actualizada = s.biblioteca.map((b) =>
        usados.includes(b.id) ? { ...b, usos: (b.usos || 0) + 1 } : b
      );
      const agregados = nuevos
        .filter((n) => !yaEsta(n.id))
        .map((n) => ({ ...n, tipo: "Módulo HTML", usos: 1 }));
      return { biblioteca: [...agregados, ...actualizada], corridas: s.corridas + 1, ultima: "caso" as const };
    });
  },
}));
