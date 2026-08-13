import { create } from "zustand";

/* Configuración de la capa. En la demo las conexiones son simuladas; la
   estructura es la real: de esto se alimenta la capacidad. */

export interface Fuente {
  id: string;
  nombre: string;
  icono: string;
  sistema: string;
  alimenta: string;
  estado: "conectada" | "parcial" | "pendiente";
}

export const FUENTES_CATALOGO: Fuente[] = [
  { id: "sfmc", nombre: "Salesforce Marketing Cloud", icono: "☁", sistema: "Email Studio · Journey Builder",
    alimenta: "Motor de activación, Data Extensions y métricas de campaña.", estado: "conectada" },
  { id: "socios", nombre: "Base de socios", icono: "◍", sistema: "Core cooperativo",
    alimenta: "Segmentos, anclaje de los socios sintéticos y exclusiones de audiencia.", estado: "parcial" },
  { id: "brand", nombre: "Brand book", icono: "◆", sistema: "Repositorio de marca",
    alimenta: "Paleta, tipografía, reglas de tono y palabras vetadas.", estado: "parcial" },
  { id: "legal", nombre: "Set normativo", icono: "§", sistema: "Fiscalía y cumplimiento",
    alimenta: "Obligaciones que compliance impone antes de escribir.", estado: "parcial" },
  { id: "modulos", nombre: "Biblioteca de módulos", icono: "▣", sistema: "Content Builder",
    alimenta: "Bloques HTML reutilizables que ya pasaron por revisión.", estado: "pendiente" },
  { id: "voc", nombre: "Voz del socio", icono: "◔", sistema: "Encuestas y reclamos",
    alimenta: "Objeciones y motivaciones de los perfiles del panel.", estado: "pendiente" },
  { id: "imagenes", nombre: "Archivo fotográfico", icono: "▤", sistema: "DAM corporativo",
    alimenta: "Imágenes de campaña con derechos vigentes.", estado: "pendiente" },
  { id: "analitica", nombre: "Resultados históricos", icono: "◑", sistema: "Analítica de campañas",
    alimenta: "Calibración del panel contra desempeño real.", estado: "pendiente" },
];

export interface FuenteImagen {
  id: string;
  nombre: string;
  detalle: string;
  estado?: string;
}

const IMAGENES: FuenteImagen[] = [
  { id: "vector", nombre: "Ilustración generada", estado: "activa",
    detalle: "La capa escribe el SVG con dirección de arte propia. Sin costo por imagen y sin problemas de derechos." },
  { id: "dam", nombre: "Archivo fotográfico Coopeuch",
    detalle: "Fotografía propia con derechos vigentes. Requiere conectar el DAM corporativo." },
  { id: "stock", nombre: "Banco de imágenes con licencia",
    detalle: "Catálogo externo. Aporta variedad, pero repite imágenes que usa el resto de la industria." },
  { id: "generativa", nombre: "Generación fotorrealista",
    detalle: "Imagen sintética a pedido. Abre una discusión de política de marca sobre personas que no existen." },
];

const CONTEXTO_BASE =
  "Coopeuch es la mayor cooperativa de ahorro y crédito de Chile: más de 1.200.000 socios, 81 oficinas de Arica a Punta Arenas, supervisada por la CMF. Los socios son copropietarios y reciben Remanente anual: en 2026 se distribuyeron $72.178 millones entre 1.284.000 socios. Desde julio de 2026 las transferencias electrónicas no tienen costo. Productos: Cuenta Vista, Cuenta de Ahorro, Depósito a Plazo, AhorrAndo, Crédito de Consumo, Crédito Pensionados, Crédito MYPE, Hipotecario, Tarjeta de Crédito, seguros y cuotas de participación.";

const VOZ_BASE =
  "Se dice socio, nunca cliente. Trato de usted con pensionados, convenios y baja actividad digital; tú con los demás. Sin superlativos que no se puedan verificar. El beneficio se explica desde el modelo cooperativo, no como una promoción. Frases cortas: el mensaje debe entenderse sin educación superior. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.";

interface Estado {
  fuentes: Fuente[];
  imagenes: FuenteImagen[];
  fuenteImagen: string;
  contexto: string;
  voz: string;
  vetadas: string[];
  objetivoMin: number;
  alternarFuente: (id: string) => void;
  setFuenteImagen: (id: string) => void;
  setContexto: (t: string) => void;
  setVoz: (t: string) => void;
  agregarVetada: (p: string) => void;
  quitarVetada: (p: string) => void;
  setObjetivo: (n: number) => void;
}

export const useConfig = create<Estado>((set, get) => ({
  fuentes: FUENTES_CATALOGO,
  imagenes: IMAGENES,
  fuenteImagen: "vector",
  contexto: CONTEXTO_BASE,
  voz: VOZ_BASE,
  vetadas: ["cliente", "gratis", "el mejor del mercado", "oferta imperdible", "sin letra chica"],
  objetivoMin: 65,

  alternarFuente: (id) =>
    set((s) => ({
      fuentes: s.fuentes.map((f) =>
        f.id === id ? { ...f, estado: f.estado === "pendiente" ? "conectada" : "pendiente" } : f
      ),
    })),
  setFuenteImagen: (id) => set({ fuenteImagen: id }),
  setContexto: (t) => set({ contexto: t }),
  setVoz: (t) => set({ voz: t }),
  agregarVetada: (p) => set((s) => (s.vetadas.includes(p) ? s : { vetadas: [...s.vetadas, p] })),
  quitarVetada: (p) => set((s) => ({ vetadas: s.vetadas.filter((x) => x !== p) })),
  setObjetivo: (n) => set({ objetivoMin: n }),
}));

/* Lo que se le entrega a los agentes en cada llamada. */
export function contextoParaAgentes() {
  const c = useConfig.getState();
  return `${c.contexto}\n\nVOZ DE MARCA: ${c.voz}\n\nPalabras que no se usan: ${c.vetadas.join(", ")}.\n\nObjetivo de comprensión: índice de legibilidad INFLESZ igual o superior a ${c.objetivoMin}.`;
}
