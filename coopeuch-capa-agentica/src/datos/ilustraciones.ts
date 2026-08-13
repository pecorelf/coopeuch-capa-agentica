/* Ilustraciones de cabecera.
   Son SVG que escribe el agente de diseño: vector, no fotografía ni banco de
   imágenes. La dirección de arte es deliberada: escenas cotidianas con personas,
   formas orgánicas y paleta cálida. Un socio no se emociona con un diagrama.

   Estas vienen precompiladas para que los casos guionados se vean siempre igual;
   en el Caso libre se generan en vivo con la misma dirección de arte. */

const F = "#F7F3EF";   // fondo cálido
const BL = "#F6DCD5";  // blush
const R = "#E4032E";   // rojo Coopeuch
const RO = "#A50B22";
const T = "#1C1917";   // tinta
const N = "#E4DAD2";   // neutro
const PA = "#D9A06B";  // piel cálida
const PB = "#A9714A";  // piel media
const PC = "#EFC199";  // piel clara
const PELO = "#3A2B23";
const PELO2 = "#6B4A32";
const VE = "#2E7D5B";

const marco = (contenido: string) =>
  `<svg viewBox="0 0 620 190" xmlns="http://www.w3.org/2000/svg" role="img">
  <rect width="620" height="190" fill="${F}"/>
  ${contenido}
</svg>`;

/* --- Persona sencilla, de frente. Bloques suaves, sin contornos duros. --- */
function persona(
  x: number, y: number, escala: number, piel: string, pelo: string, ropa: string,
  opts: { pelolargo?: boolean; brazo?: [number, number]; brazoIzq?: boolean } = {}
) {
  const s = escala;
  const br = opts.brazo
    ? `<path d="M${opts.brazoIzq ? -22 : 22} 26 Q${opts.brazo[0] * 0.6} ${opts.brazo[1] * 0.5 + 22}, ${opts.brazo[0]} ${opts.brazo[1]}"
         fill="none" stroke="${ropa}" stroke-width="15" stroke-linecap="round"/>
       <circle cx="${opts.brazo[0]}" cy="${opts.brazo[1]}" r="8.5" fill="${piel}"/>`
    : "";
  return `<g transform="translate(${x},${y}) scale(${s})">
    <path d="M-30 62 C-30 26, -17 12, 0 12 C17 12, 30 26, 30 62 Z" fill="${ropa}"/>
    ${br}
    ${opts.pelolargo ? `<path d="M-23 -4 C-26 26, -20 34, -14 36 L14 36 C20 34, 26 26, 23 -4 Z" fill="${pelo}"/>` : ""}
    <circle cx="0" cy="-8" r="20" fill="${piel}"/>
    <path d="M-21 -12 C-21 -33, -12 -40, 0 -40 C12 -40, 21 -33, 21 -12 C14 -22, -12 -18, -21 -12 Z" fill="${pelo}"/>
  </g>`;
}

/* ============ 1 · Transferencias sin costo ============
   Una persona con el teléfono en la mano; el dinero se mueve solo. */
export const ILU_TRANSFERENCIA = marco(`
  <circle cx="176" cy="104" r="86" fill="${BL}"/>
  <path d="M0 190 L620 190 L620 168 C480 152, 300 176, 0 158 Z" fill="${N}" opacity=".7"/>
  ${persona(166, 86, 1.42, PA, PELO, R, { brazo: [34, 24] })}
  <g transform="translate(206,100) rotate(-9)">
    <rect x="0" y="0" width="42" height="70" rx="7" fill="${T}"/>
    <rect x="4" y="5" width="34" height="60" rx="4" fill="#fff"/>
    <rect x="9" y="14" width="24" height="5" rx="2.5" fill="${N}"/>
    <rect x="9" y="25" width="18" height="5" rx="2.5" fill="${N}"/>
    <rect x="9" y="43" width="24" height="12" rx="3" fill="${R}"/>
  </g>
  <g fill="${R}">
    <circle cx="322" cy="70" r="9"/><circle cx="368" cy="60" r="7" opacity=".82"/>
    <circle cx="412" cy="58" r="5.5" opacity=".64"/><circle cx="450" cy="63" r="4" opacity=".46"/>
  </g>
  <path d="M300 88 C350 46, 430 44, 486 74" fill="none" stroke="${R}" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 9"/>
  <g transform="translate(486,74)">
    <circle r="34" fill="#fff" stroke="${N}" stroke-width="2"/>
    <path d="M-13 4 L0 -10 L13 4 L13 15 L-13 15 Z" fill="${RO}"/>
    <rect x="-4" y="4" width="8" height="11" fill="#fff"/>
  </g>
  <rect x="452" y="122" width="132" height="26" rx="13" fill="#fff"/>
  <text x="518" y="139" font-family="Poppins,Arial,sans-serif" font-size="12" font-weight="600" fill="${T}" text-anchor="middle">sin comisión</text>
`);

/* ============ 2 · Crédito y portabilidad ============
   Dos personas conversando frente a una mesa. La decisión se toma acompañado. */
export const ILU_CREDITO = marco(`
  <circle cx="310" cy="96" r="92" fill="${BL}" opacity=".85"/>
  ${persona(212, 82, 1.26, PC, PELO2, RO, { pelolargo: true, brazo: [30, 30] })}
  ${persona(412, 84, 1.28, PB, PELO, "#2B4C6F", { brazo: [-30, 30], brazoIzq: true })}
  <rect x="252" y="140" width="128" height="9" rx="4.5" fill="${T}" opacity=".85"/>
  <rect x="268" y="149" width="8" height="30" fill="${T}" opacity=".55"/>
  <rect x="356" y="149" width="8" height="30" fill="${T}" opacity=".55"/>
  <g transform="translate(286,104) rotate(-6)">
    <rect width="60" height="42" rx="3" fill="#fff" stroke="${N}" stroke-width="1.5"/>
    <rect x="8" y="9" width="34" height="4" rx="2" fill="${N}"/>
    <rect x="8" y="18" width="44" height="4" rx="2" fill="${N}"/>
    <rect x="8" y="28" width="22" height="6" rx="3" fill="${R}"/>
  </g>
  <g opacity=".9">
    <circle cx="120" cy="58" r="26" fill="#fff"/>
    <text x="120" y="63" font-family="Poppins,Arial,sans-serif" font-size="13" font-weight="700" fill="${R}" text-anchor="middle">CAE</text>
  </g>
  <path d="M146 66 C176 76, 190 84, 202 92" fill="none" stroke="${R}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 8"/>
`);

/* ============ 3 · Remanente y cuotas ============
   La cooperativa como círculo de personas. El resultado vuelve a todos. */
export const ILU_REMANENTE = marco(`
  <circle cx="310" cy="98" r="78" fill="${BL}"/>
  <circle cx="310" cy="98" r="46" fill="${R}"/>
  <circle cx="310" cy="98" r="30" fill="#fff" opacity=".16"/>
  <g>
    ${[0, 1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        const a = (Math.PI * 2 * i) / 8 - Math.PI / 2;
        const x = 310 + Math.cos(a) * 108;
        const y = 98 + Math.sin(a) * 62;
        const piel = [PA, PB, PC][i % 3];
        const pelo = i % 2 ? PELO : PELO2;
        return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) scale(0.52)">
          <path d="M-30 58 C-30 24, -17 12, 0 12 C17 12, 30 24, 30 58 Z" fill="${i % 3 === 0 ? RO : i % 3 === 1 ? "#2B4C6F" : "#5B6E4F"}"/>
          <circle cx="0" cy="-8" r="20" fill="${piel}"/>
          <path d="M-21 -12 C-21 -33, -12 -40, 0 -40 C12 -40, 21 -33, 21 -12 C14 -22, -12 -18, -21 -12 Z" fill="${pelo}"/>
        </g>`;
      })
      .join("\n    ")}
  </g>
  <g fill="#fff" opacity=".95">
    <circle cx="310" cy="86" r="5"/><circle cx="296" cy="104" r="4"/><circle cx="324" cy="104" r="4"/>
  </g>
`);

/* ============ 4 · Ahorro y depósito ============
   Algo que se cuida y crece. Una persona mirando su planta. */
export const ILU_AHORRO = marco(`
  <circle cx="404" cy="98" r="84" fill="${BL}"/>
  ${persona(196, 88, 1.38, PB, PELO, "#2B4C6F", { pelolargo: true, brazo: [34, 20] })}
  <g transform="translate(392,60)">
    <path d="M8 84 C8 60, -18 52, -20 26 C2 30, 12 46, 14 62 C16 40, 30 24, 52 18 C48 46, 30 60, 20 68 L20 84 Z" fill="${VE}"/>
    <path d="M-26 84 L62 84 L54 128 L-18 128 Z" fill="${R}"/>
    <rect x="-30" y="76" width="96" height="12" rx="4" fill="${RO}"/>
  </g>
  <g fill="${R}" opacity=".55">
    <circle cx="298" cy="52" r="6"/><circle cx="330" cy="38" r="4"/><circle cx="266" cy="42" r="3.5"/>
  </g>
  <path d="M236 92 C266 84, 300 82, 330 88" fill="none" stroke="${R}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 8"/>
`);

/* ============ 5 · Seguros y protección ============ */
export const ILU_PROTECCION = marco(`
  <circle cx="310" cy="106" r="86" fill="${BL}" opacity=".8"/>
  <path d="M150 92 C150 22, 470 22, 470 92 Z" fill="${R}"/>
  <path d="M150 92 C186 78, 214 78, 246 92 C278 78, 306 78, 342 92 C374 78, 402 78, 434 92 L470 92 Z" fill="${RO}" opacity=".55"/>
  ${persona(246, 118, 1.14, PA, PELO2, "#2B4C6F", { brazo: [30, 34] })}
  ${persona(374, 118, 1.14, PC, PELO, "#8B2C4A", { pelolargo: true, brazo: [-30, 34], brazoIzq: true })}
  ${persona(310, 138, 0.82, PB, PELO, "#5B6E4F")}
  <g fill="${N}" opacity=".8">
    <circle cx="126" cy="140" r="7"/><circle cx="500" cy="132" r="9"/><circle cx="536" cy="156" r="5"/>
  </g>
`);

/* ============ 6 · Genérica · mensaje que llega bien ============ */
export const ILU_MENSAJE = marco(`
  <circle cx="230" cy="98" r="84" fill="${BL}"/>
  ${persona(220, 92, 1.4, PC, PELO, RO, { pelolargo: true, brazo: [32, 22] })}
  <g transform="translate(360,44)">
    <path d="M0 0 L200 0 L200 84 L44 84 L24 106 L24 84 L0 84 Z" fill="#fff" stroke="${N}" stroke-width="2"/>
    <rect x="22" y="24" width="150" height="7" rx="3.5" fill="${N}"/>
    <rect x="22" y="41" width="118" height="7" rx="3.5" fill="${N}"/>
    <rect x="22" y="60" width="66" height="12" rx="6" fill="${R}"/>
  </g>
  <path d="M292 96 C316 84, 336 78, 356 76" fill="none" stroke="${R}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 8"/>
`);

export const SVG_GENERICO = ILU_MENSAJE;

/* Selector por familia de producto, para el Caso libre sin IA. */
export function ilustracionPara(productos: string[], objetivos: string[] = []) {
  const p = productos.join(" ").toLowerCase();
  const o = objetivos.join(" ").toLowerCase();
  if (/seguro/.test(p)) return ILU_PROTECCION;
  if (/cuota|remanente|participación/.test(p)) return ILU_REMANENTE;
  if (/crédito|credito|portabilidad|tarjeta|hipotecario/.test(p)) return ILU_CREDITO;
  if (/ahorro|depósito|deposito|plazo|ahorrando/.test(p)) return ILU_AHORRO;
  if (/cuenta vista/.test(p)) return ILU_TRANSFERENCIA;
  if (/fraude/.test(o)) return ILU_PROTECCION;
  return ILU_MENSAJE;
}

/* Dirección de arte que se entrega al agente cuando genera en vivo. */
export const DIRECCION_ARTE =
  "Estilo: ilustración plana editorial, cálida y humana. Personas estilizadas sin rasgos faciales detallados (cabeza circular, pelo como forma sólida, torso como una forma orgánica), escenas cotidianas chilenas. Nada de iconos corporativos, diagramas, flechas de negocio ni gráficos. Formas grandes y limpias, sin contornos delgados. Paleta: fondo #F7F3EF, blush #F6DCD5, rojo #E4032E como acento principal, rojo oscuro #A50B22, neutro #E4DAD2, tinta #1C1917, pieles #D9A06B #A9714A #EFC199, pelo #3A2B23 #6B4A32, azul #2B4C6F y verde #2E7D5B para ropa. Incluye al menos una persona.";
