/* Legibilidad en español.
   Fuentes de las fórmulas:
   - Flesch-Szigriszt (IFSZ, "perspicuidad"): 206,835 − 62,3·(S/P) − (P/F)
     Szigriszt-Pazos, F. (1993), tesis doctoral.
   - Fernández Huerta: 206,84 − 60·(S/P) − 1,02·(P/F)
   - Escala INFLESZ: Barrio-Cantalejo, I. et al. (2008), An Sist Sanit Navar 31(2).
     Es la escala validada para hábitos lectores en español, por eso es la que
     se usa como referencia en pantalla.
   S = sílabas, P = palabras, F = frases.
   El contador de sílabas es una aproximación por grupos vocálicos: suficiente
   para comparar piezas entre sí, no para uso académico. */

export interface Legibilidad {
  ifsz: number;
  fernandezHuerta: number;
  banda: string;
  nivel: string;
  color: string;
  palabras: number;
  frases: number;
  silabasPorPalabra: number;
  palabrasPorFrase: number;
  palabrasLargas: string[];
}

const VOCALES = "aeiouáéíóúüy";
const FUERTES = "aeoáéó";
const DEBIL_ACENT = "íú";

const esVocal = (c: string) => VOCALES.includes(c);

function silabasGrupo(g: string): number {
  if (g.length <= 1) return 1;
  let n = 1;
  for (let i = 1; i < g.length; i++) {
    const a = g[i - 1];
    const b = g[i];
    const dosFuertes = FUERTES.includes(a) && FUERTES.includes(b);
    const hiatoAcentuado = DEBIL_ACENT.includes(a) || DEBIL_ACENT.includes(b);
    if (dosFuertes || hiatoAcentuado) n++;
  }
  return n;
}

export function silabas(palabra: string): number {
  const s = palabra.toLowerCase().replace(/[^a-záéíóúüñ]/g, "");
  if (!s) return 0;
  let n = 0;
  let i = 0;
  while (i < s.length) {
    if (!esVocal(s[i])) { i++; continue; }
    let g = "";
    while (i < s.length && esVocal(s[i])) { g += s[i]; i++; }
    n += silabasGrupo(g);
  }
  return Math.max(1, n);
}

export function medir(texto: string): Legibilidad {
  const limpio = String(texto || "")
    .replace(/%%[^%]+%%/g, "socio")            // tokens de personalización
    .replace(/\$?\d[\d.,]*\s?%?/g, "cantidad") // cifras: los puntos de miles rompían el conteo de frases
    .replace(/\s+/g, " ")
    .trim();

  const palabrasArr = limpio.split(/[\s]+/).filter((w) => /[a-záéíóúüñA-ZÁÉÍÓÚÑ0-9]/.test(w));
  const frasesArr = limpio.split(/[.!?;:]+/).map((f) => f.trim()).filter((f) => f.length > 2);

  const P = Math.max(1, palabrasArr.length);
  const F = Math.max(1, frasesArr.length);
  const S = palabrasArr.reduce((a, w) => a + silabas(w), 0);

  const ifsz = 206.835 - 62.3 * (S / P) - P / F;
  const fh = 206.84 - 60 * (S / P) - 1.02 * (P / F);
  const { banda, nivel, color } = escala(Math.max(0, Math.min(100, ifsz)));

  const acotar = (v: number) => Math.max(0, Math.min(100, v));

  return {
    ifsz: Math.round(acotar(ifsz) * 10) / 10,
    fernandezHuerta: Math.round(acotar(fh) * 10) / 10,
    banda,
    nivel,
    color,
    palabras: P,
    frases: F,
    silabasPorPalabra: Math.round((S / P) * 100) / 100,
    palabrasPorFrase: Math.round((P / F) * 10) / 10,
    palabrasLargas: [...new Set(palabrasArr.filter((w) => silabas(w) >= 5).map((w) => w.replace(/[.,;:()]/g, "")))].slice(0, 6),
  };
}

/* Escala INFLESZ + equivalencia aproximada de nivel lector.
   La equivalencia educativa es orientativa, no un resultado de la escala. */
export function escala(v: number) {
  if (v < 40) return { banda: "Muy difícil", nivel: "Universitario", color: "#B00020" };
  if (v < 55) return { banda: "Algo difícil", nivel: "Media superior o técnico", color: "#B26A00" };
  if (v < 65) return { banda: "Normal", nivel: "Enseñanza media", color: "#7A7A2E" };
  if (v < 80) return { banda: "Bastante fácil", nivel: "Básica 5º a 8º", color: "#1E7A4C" };
  return { banda: "Muy fácil", nivel: "Básica 1º a 4º", color: "#1E7A4C" };
}

export const BANDAS = [
  { desde: 0, hasta: 40, nombre: "Muy difícil", color: "#B00020" },
  { desde: 40, hasta: 55, nombre: "Algo difícil", color: "#B26A00" },
  { desde: 55, hasta: 65, nombre: "Normal", color: "#7A7A2E" },
  { desde: 65, hasta: 80, nombre: "Bastante fácil", color: "#1E7A4C" },
  { desde: 80, hasta: 100, nombre: "Muy fácil", color: "#2E9E68" },
];

/* Objetivo de la cooperativa: una base de más de 1,2 millones de socios de
   Arica a Punta Arenas, con fuerte peso de pensionados y convenios. */
export const OBJETIVO = { min: 65, max: 85, etiqueta: "Objetivo Coopeuch · bastante fácil" };

export function medirPieza(p: { asunto?: string; titular?: string; cuerpo?: string[]; cta?: string; legal?: string }) {
  const cuerpo = medir([p.asunto, p.titular, ...(p.cuerpo || []), p.cta].filter(Boolean).join(". "));
  const legal = p.legal ? medir(p.legal) : null;
  const total = medir([p.asunto, p.titular, ...(p.cuerpo || []), p.cta, p.legal].filter(Boolean).join(". "));
  return { cuerpo, legal, total };
}
