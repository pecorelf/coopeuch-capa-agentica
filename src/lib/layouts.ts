import type { Formato } from "../datos/formatos";
import type { Pieza } from "./tipos";

/* Sistema de layout.
   Un esquema no es un estilo: es una regla de composición que dice qué módulos
   van, en qué orden y con qué peso. Es la respuesta a la pregunta de estructura
   de marca —"arriba siempre va un banner y después baja con cierta estructura"—
   que hoy vive en la cabeza del equipo de diseño. */

export type ModuloId = "franja" | "imagen" | "titular" | "cuerpo" | "cta" | "legal" | "logo";

export interface Esquema {
  id: string;
  nombre: string;
  descripcion: string;
  /* Orden y peso de los módulos. peso = proporción vertical sugerida. */
  bloques: { modulo: ModuloId; peso: number }[];
  /* Reglas que impone el esquema */
  franjaSuperior: boolean;
  imagenDominante: boolean;
  fondo: "claro" | "marca" | "imagen";
}

export const ESQUEMAS: Esquema[] = [
  {
    id: "franja",
    nombre: "Franja de marca",
    descripcion:
      "Banda de marca arriba, luego titular, cuerpo y llamado. Es la estructura que la mayoría de las instituciones tiene normada y la más segura para piezas con condiciones.",
    bloques: [
      { modulo: "franja", peso: 0.08 },
      { modulo: "logo", peso: 0.07 },
      { modulo: "imagen", peso: 0.3 },
      { modulo: "titular", peso: 0.16 },
      { modulo: "cuerpo", peso: 0.2 },
      { modulo: "cta", peso: 0.11 },
      { modulo: "legal", peso: 0.08 },
    ],
    franjaSuperior: true,
    imagenDominante: false,
    fondo: "claro",
  },
  {
    id: "imagen",
    nombre: "Imagen dominante",
    descripcion:
      "La escena ocupa la mayor parte y el texto se apoya sobre ella. Funciona en social y display, donde la competencia por atención es visual. Pierde capacidad de carga legal.",
    bloques: [
      { modulo: "imagen", peso: 0.58 },
      { modulo: "logo", peso: 0.07 },
      { modulo: "titular", peso: 0.18 },
      { modulo: "cuerpo", peso: 0.09 },
      { modulo: "cta", peso: 0.08 },
    ],
    franjaSuperior: false,
    imagenDominante: true,
    fondo: "imagen",
  },
  {
    id: "texto",
    nombre: "Texto dominante",
    descripcion:
      "Titular grande sobre fondo de marca, con la imagen reducida a un acento. Es el esquema con mayor comprensión medida y el que mejor soporta condiciones y cifras.",
    bloques: [
      { modulo: "logo", peso: 0.09 },
      { modulo: "titular", peso: 0.3 },
      { modulo: "cuerpo", peso: 0.26 },
      { modulo: "imagen", peso: 0.14 },
      { modulo: "cta", peso: 0.12 },
      { modulo: "legal", peso: 0.09 },
    ],
    franjaSuperior: false,
    imagenDominante: false,
    fondo: "marca",
  },
];

export const esquema = (id: string) => ESQUEMAS.find((e) => e.id === id) || ESQUEMAS[0];

/* ---------- Adaptación de la pieza al formato ----------
   No es recortar texto: es decidir qué se cae y avisarlo. */

export interface Adaptacion {
  titular: string;
  cuerpo: string;
  cta: string;
  legal: string;
  conImagen: boolean;
  /* Qué se perdió respecto de la pieza original y por qué */
  ajustes: string[];
  /* Bloqueo real: la pieza no puede salir así en este formato */
  alertas: string[];
  /* Condición: puede salir, pero con una versión adaptada y enlace a condiciones */
  condiciones: string[];
}

const recortar = (t: string, max: number) => {
  const s = (t || "").replace(/%%NombreSocio%%/g, "").replace(/^[,:]\s*/, "").trim();
  if (!max || s.length <= max) return s;
  const corte = s.slice(0, max - 1);
  const esp = corte.lastIndexOf(" ");
  return (esp > max * 0.6 ? corte.slice(0, esp) : corte).trim() + "…";
};

const tieneCifra = (t: string) => /\d+([.,]\d+)?\s?%|\$\s?[\d.]{3,}/.test(t || "");

export function adaptar(pieza: Pieza, f: Formato, esq: Esquema): Adaptacion {
  const ajustes: string[] = [];
  const alertas: string[] = [];

  const titularCompleto = pieza.titular || "";
  const cuerpoCompleto = (pieza.cuerpo || []).join(" ");
  const legalCompleto = pieza.legal || "";

  const titular = recortar(titularCompleto, f.maxTitular);
  if (titular !== titularCompleto.trim()) ajustes.push(`Titular ajustado a ${f.maxTitular} caracteres.`);

  let cuerpo = "";
  if (f.admiteCuerpo && f.maxCuerpo > 0) {
    cuerpo = recortar(cuerpoCompleto, f.maxCuerpo);
    if (cuerpo !== cuerpoCompleto.trim()) ajustes.push(`Cuerpo reducido a ${f.maxCuerpo} caracteres.`);
  } else if (cuerpoCompleto) {
    ajustes.push("El formato no admite cuerpo: se conserva solo el titular.");
  }

  const cta = f.maxCta > 0 ? recortar(pieza.cta || "", f.maxCta) : "";
  if (!f.maxCta && pieza.cta) ajustes.push("El formato no lleva botón: el llamado va en el destino.");

  let legal = "";
  if (f.admiteLegal) {
    legal = legalCompleto;
  } else if (legalCompleto) {
    ajustes.push(f.notaLegal || "Las condiciones se trasladan a la página de destino.");
  }

  /* Alertas de fondo: no son de estilo, son de cumplimiento.
     La cifra puede estar en el titular, en el cuerpo o en el propio bloque de
     condiciones: si la pieza necesita condiciones y el formato no las admite,
     hay un problema aunque el titular se vea limpio. */
  const condiciones: string[] = [];
  /* La cifra que importa es la que queda VISIBLE después de adaptar, no la de
     la pieza original: si el recorte la dejó fuera, el formato es publicable. */
  const cifraVisible = tieneCifra(`${titular} ${cuerpo}`);
  const exigeCondiciones = Boolean(legalCompleto) && tieneCifra(legalCompleto);

  if (cifraVisible && !f.admiteLegal) {
    alertas.push(
      "El texto adaptado deja una cifra a la vista y el formato no admite el bloque de condiciones. Corresponde retirar la cifra o excluir este formato."
    );
  } else if (exigeCondiciones && !f.admiteLegal) {
    condiciones.push(
      "La campaña lleva condiciones obligatorias: esta versión sale sin cifras y el enlace debe llevar a las condiciones completas."
    );
  }
  if (exigeCondiciones && f.maxCuerpo === 0) {
    condiciones.push("Sin cuerpo ni condiciones: este formato solo sirve para recordación de marca, no para comunicar la oferta.");
  }
  if (esq.imagenDominante && legalCompleto && f.admiteLegal) {
    alertas.push("Con imagen dominante el bloque de condiciones queda al pie y pierde legibilidad.");
  }
  if (!f.admiteImagen && esq.imagenDominante) {
    ajustes.push("El formato no admite imagen: se aplica el esquema de texto.");
  }

  return {
    titular,
    cuerpo,
    cta,
    legal,
    conImagen: f.admiteImagen && esq.id !== "texto" ? true : f.admiteImagen && esq.id === "texto",
    ajustes,
    alertas,
    condiciones,
  };
}

/* Esquema sugerido por familia de formato. La regla: donde hay condiciones,
   texto dominante; donde hay competencia visual, imagen dominante. */
export function esquemaSugerido(f: Formato, tieneLegal: boolean): string {
  if (f.familia === "email") return tieneLegal ? "franja" : "imagen";
  if (f.familia === "display" && f.h <= 100) return "texto";
  if (f.familia === "social") return "imagen";
  if (f.familia === "mensajeria") return "texto";
  return "franja";
}
