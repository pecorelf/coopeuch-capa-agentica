/* Catálogo de formatos. Las dimensiones y los límites son los reales de cada
   plataforma: es lo que define cuánto texto entra y qué se cae.
   Este archivo es el que convierte "una campaña" en las veinte piezas que hoy
   se producen a mano. */

export type Plataforma = "propio" | "meta" | "tiktok" | "google" | "mensajeria";
export type Familia = "email" | "social" | "display" | "mensajeria" | "sitio";

export interface Formato {
  id: string;
  nombre: string;
  plataforma: Plataforma;
  familia: Familia;
  w: number;
  h: number;
  /* Límites duros de la plataforma */
  maxTitular: number;
  maxCuerpo: number;
  maxCta: number;
  /* Reglas de composición */
  admiteLegal: boolean;      // ¿cabe el bloque de condiciones?
  admiteCuerpo: boolean;
  admiteImagen: boolean;
  /* Qué se hace cuando el legal no cabe */
  notaLegal?: string;
}

export const FORMATOS: Formato[] = [
  /* ---- Canales propios ---- */
  { id: "email", nombre: "Email", plataforma: "propio", familia: "email", w: 620, h: 820,
    maxTitular: 90, maxCuerpo: 420, maxCta: 30, admiteLegal: true, admiteCuerpo: true, admiteImagen: true },
  { id: "web-hero", nombre: "Banner sitio privado", plataforma: "propio", familia: "sitio", w: 1200, h: 400,
    maxTitular: 60, maxCuerpo: 140, maxCta: 24, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "Las condiciones van en la página de destino, con enlace visible en la pieza." },
  { id: "push", nombre: "Push app", plataforma: "propio", familia: "mensajeria", w: 360, h: 130,
    maxTitular: 42, maxCuerpo: 110, maxCta: 0, admiteLegal: false, admiteCuerpo: true, admiteImagen: false,
    notaLegal: "Sin espacio para condiciones: el push no puede comunicar una oferta con cifras." },

  /* ---- Mensajería ---- */
  { id: "whatsapp", nombre: "WhatsApp", plataforma: "mensajeria", familia: "mensajeria", w: 340, h: 480,
    maxTitular: 60, maxCuerpo: 300, maxCta: 26, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "Plantilla verificada. Las condiciones van en el enlace, nunca pidiendo datos." },

  /* ---- Meta ---- */
  { id: "meta-feed", nombre: "Meta feed 1:1", plataforma: "meta", familia: "social", w: 1080, h: 1080,
    maxTitular: 40, maxCuerpo: 125, maxCta: 20, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "El texto primario admite 125 caracteres antes del «ver más». Las condiciones van en el destino." },
  { id: "meta-story", nombre: "Meta story 9:16", plataforma: "meta", familia: "social", w: 1080, h: 1920,
    maxTitular: 34, maxCuerpo: 70, maxCta: 18, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "Formato vertical de paso rápido: solo titular y llamado." },
  { id: "meta-reel", nombre: "Meta reel 9:16", plataforma: "meta", familia: "social", w: 1080, h: 1920,
    maxTitular: 30, maxCuerpo: 60, maxCta: 18, admiteLegal: false, admiteCuerpo: false, admiteImagen: true,
    notaLegal: "Pieza de video: la versión estática es el cierre. Sin cifras." },

  /* ---- TikTok ---- */
  { id: "tiktok", nombre: "TikTok 9:16", plataforma: "tiktok", familia: "social", w: 1080, h: 1920,
    maxTitular: 34, maxCuerpo: 90, maxCta: 18, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "Zona segura inferior ocupada por la interfaz: el contenido sube." },

  /* ---- Google Display ---- */
  { id: "gdn-300x250", nombre: "Display 300×250", plataforma: "google", familia: "display", w: 300, h: 250,
    maxTitular: 42, maxCuerpo: 80, maxCta: 18, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "Medium rectangle. Condiciones en destino." },
  { id: "gdn-728x90", nombre: "Display 728×90", plataforma: "google", familia: "display", w: 728, h: 90,
    maxTitular: 46, maxCuerpo: 0, maxCta: 16, admiteLegal: false, admiteCuerpo: false, admiteImagen: true,
    notaLegal: "Leaderboard: solo titular y botón. No admite oferta con cifras." },
  { id: "gdn-160x600", nombre: "Display 160×600", plataforma: "google", familia: "display", w: 160, h: 600,
    maxTitular: 34, maxCuerpo: 70, maxCta: 14, admiteLegal: false, admiteCuerpo: true, admiteImagen: true,
    notaLegal: "Skyscraper: columna angosta, jerarquía vertical." },
  { id: "gdn-320x50", nombre: "Display 320×50", plataforma: "google", familia: "display", w: 320, h: 50,
    maxTitular: 30, maxCuerpo: 0, maxCta: 12, admiteLegal: false, admiteCuerpo: false, admiteImagen: false,
    notaLegal: "Banner móvil: no admite oferta, imagen ni condiciones. Solo recordación de marca." },
];

export const formato = (id: string) => FORMATOS.find((f) => f.id === id)!;

export const PLATAFORMAS: { id: Plataforma; nombre: string; color: string }[] = [
  { id: "propio", nombre: "Canales propios", color: "#2F4B6B" },
  { id: "mensajeria", nombre: "Mensajería", color: "#3D7A5E" },
  { id: "meta", nombre: "Meta", color: "#1877F2" },
  { id: "tiktok", nombre: "TikTok", color: "#1C1917" },
  { id: "google", nombre: "Google Display", color: "#D99A4E" },
];

/* Selección por defecto: lo que realmente se produce en una campaña completa. */
export const SELECCION_BASE = [
  "email", "web-hero", "push", "whatsapp",
  "meta-feed", "meta-story", "tiktok",
  "gdn-300x250", "gdn-728x90", "gdn-160x600", "gdn-320x50",
];

/* Estimación de esfuerzo manual por formato, en minutos.
   Referencia de trabajo: se reemplaza por la medición real en la primera etapa. */
export const MINUTOS_MANUAL: Record<Familia, number> = {
  email: 90,
  sitio: 45,
  mensajeria: 25,
  social: 35,
  display: 30,
};

export function esfuerzoManual(ids: string[]) {
  return ids.reduce((a, id) => a + (MINUTOS_MANUAL[formato(id).familia] || 30), 0);
}
