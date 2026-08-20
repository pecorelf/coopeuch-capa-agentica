/* Ilustraciones de cabecera · dirección de arte v2
   Son SVG que escribe el agente de diseño: vector, no fotografía.
   Reglas del sistema: escenas con profundidad (fondo, medio, primer plano),
   figuras con gesto y postura asimétrica —nunca centradas ni simétricas—,
   contexto cotidiano y paleta cálida con el rojo de marca como acento.
   El pelo se dibuja detrás de la cabeza para que enmarque el rostro, y cada
   brazo termina en mano: son los dos errores que hacían que las figuras
   parecieran íconos. */

const P = {
  fondo: "#FAF6F1",
  crema: "#F2E7DC",
  blush: "#F3D9CF",
  arena: "#E8DACB",
  rojo: "#E4032E",
  rojoOsc: "#A50B22",
  vino: "#8B2C3F",
  tinta: "#1C1917",
  azul: "#2F4B6B",
  azulClaro: "#7A9BB5",
  verde: "#3D7A5E",
  ocre: "#D99A4E",
  pielA: "#E0AE84",
  pielB: "#B67D55",
  pielC: "#8A5A3B",
  peloA: "#2E2119",
  peloB: "#5C3A24",
  peloC: "#8A6B4F",
  amarillo: "#FCDB00",
  amarilloOsc: "#D9BB00",
  azulLipi: "#2E2E84",
  azulCirculo: "#2078BF",
  verdeMezcla: "#549543",
};

/* Texturas y sombra suave, declaradas una vez por SVG */
const DEFS = `
<defs>
  <pattern id="puntos" width="7" height="7" patternUnits="userSpaceOnUse">
    <circle cx="1.6" cy="1.6" r="1.05" fill="${P.tinta}" opacity="0.09"/>
  </pattern>
  <linearGradient id="luz" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#fff" stop-opacity="0.55"/>
    <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="calido" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${P.blush}"/>
    <stop offset="100%" stop-color="${P.crema}"/>
  </linearGradient>
</defs>`;

/* foco: eje X (0 a 1) donde está el interés de la escena. Los formatos
   verticales y cuadrados recortan alrededor de ese punto en vez del centro
   geométrico, que en una escena compuesta a un tercio corta lo que importa. */
const lienzo = (contenido: string, foco = 0.5, w = 620, h = 220) =>
  `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" data-foco="${foco}">
${DEFS}
  <rect width="${w}" height="${h}" fill="${P.fondo}"/>
  ${contenido}
</svg>`;

/* ---------- Figura con gesto ----------
   Hombros en ángulo, cabeza inclinada, un brazo con recorrido real. Nada
   simétrico: la simetría es lo que hacía que parecieran íconos. */
function figura(opts: {
  x: number; y: number; e?: number;
  piel: string; pelo: string; ropa: string; ropaSombra?: string;
  inclina?: number;
  pelolargo?: boolean;
  brazo?: "sube" | "mesa" | "cruzado" | "abajo";
  mira?: "izq" | "der";
}) {
  const { x, y, e = 1, piel, pelo, ropa, inclina = 0, pelolargo, brazo = "abajo", mira = "der" } = opts;
  const sombraRopa = opts.ropaSombra || ropa;
  const flip = mira === "izq" ? -1 : 1;

  /* Cada brazo termina en mano. Antes quedaban en muñón. */
  const brazos: Record<string, string> = {
    sube: `<path d="M12 30 C30 28, 42 16, 48 6" fill="none" stroke="${ropa}" stroke-width="13" stroke-linecap="round"/>
           <ellipse cx="51" cy="3" rx="8" ry="7.5" fill="${piel}" transform="rotate(-28 51 3)"/>`,
    mesa: `<path d="M12 32 C28 36, 40 42, 50 45" fill="none" stroke="${ropa}" stroke-width="13" stroke-linecap="round"/>
           <ellipse cx="54" cy="46" rx="9" ry="6.5" fill="${piel}" transform="rotate(12 54 46)"/>`,
    cruzado: `<path d="M-16 36 C-4 46, 12 46, 20 38" fill="none" stroke="${sombraRopa}" stroke-width="12.5" stroke-linecap="round"/>
              <ellipse cx="23" cy="36" rx="8" ry="7" fill="${piel}" transform="rotate(-30 23 36)"/>`,
    abajo: `<path d="M16 28 C24 40, 26 50, 25 60" fill="none" stroke="${ropa}" stroke-width="12.5" stroke-linecap="round"/>
            <ellipse cx="25" cy="63" rx="7" ry="8" fill="${piel}"/>`,
  };

  /* Orden de capas: pelo de atrás, torso, brazo, cabeza, flequillo.
     Así el pelo enmarca la cara en vez de taparle el mentón. */
  return `<g transform="translate(${x},${y}) scale(${e * flip},${e})">
    <g transform="rotate(${inclina})">
      ${pelolargo
        ? `<path d="M-24 -14 C-27 16, -22 34, -15 40 L-2 40 C-11 30, -14 12, -13 -8 Z" fill="${pelo}"/>
           <path d="M24 -14 C27 16, 22 34, 15 40 L2 40 C11 30, 14 12, 13 -8 Z" fill="${pelo}"/>`
        : ""}
    </g>
    <path d="M-27 68 C-27 32, -16 17, -1 15 C15 13, 28 28, 30 68 Z" fill="${ropa}"/>
    <path d="M4 15 C18 17, 28 32, 30 68 L15 68 C17 42, 12 25, 4 15 Z" fill="${sombraRopa}" opacity="0.32"/>
    ${brazos[brazo]}
    <g transform="rotate(${inclina})">
      <path d="M-8 2 L8 2 L8 17 L-8 17 Z" fill="${piel}"/>
      <circle cx="0" cy="-9" r="19" fill="${piel}"/>
      <path d="M-20 -12 C-21 -33, -11 -40, 1 -40 C13 -40, 21 -32, 20 -12 C17 -24, 10 -29, 0 -28 C-9 -27, -16 -20, -20 -12 Z" fill="${pelo}"/>
    </g>
  </g>`;
}

/* ============ Escena 1 · transferir desde la cocina ============ */
export const ESC_TRANSFERENCIA = lienzo(`
  <!-- pared y luz -->
  <rect x="0" y="0" width="620" height="164" fill="${P.crema}"/>
  <rect x="0" y="0" width="620" height="164" fill="url(#luz)"/>
  <!-- ventana -->
  <rect x="392" y="22" width="146" height="104" rx="6" fill="${P.blush}"/>
  <rect x="392" y="22" width="146" height="104" rx="6" fill="url(#puntos)"/>
  <line x1="465" y1="22" x2="465" y2="126" stroke="${P.fondo}" stroke-width="4"/>
  <line x1="392" y1="74" x2="538" y2="74" stroke="${P.fondo}" stroke-width="4"/>
  <!-- planta en el alféizar -->
  <path d="M556 126 C556 108, 542 104, 540 90 C552 94, 559 104, 560 114 C562 100, 570 92, 582 88 C580 106, 568 116, 562 120 L562 126 Z" fill="${P.verde}"/>
  <path d="M548 126 L578 126 L575 148 L551 148 Z" fill="${P.ocre}"/>
  <!-- mesa -->
  <rect x="0" y="164" width="620" height="10" fill="${P.arena}"/>
  <rect x="0" y="174" width="620" height="46" fill="${P.fondo}"/>
  <!-- taza -->
  <path d="M96 140 L124 140 L120 164 L100 164 Z" fill="#fff"/>
  <path d="M124 145 C134 145, 134 157, 124 157" fill="none" stroke="#fff" stroke-width="4"/>
  <!-- figura -->
  ${figura({ x: 214, y: 96, e: 1.16, piel: P.pielA, pelo: P.peloA, ropa: P.rojo, ropaSombra: P.rojoOsc, inclina: -6, brazo: "mesa", pelolargo: true })}
  <!-- teléfono en la mano -->
  <g transform="translate(262,124) rotate(-14)">
    <rect x="0" y="0" width="40" height="66" rx="8" fill="${P.tinta}"/>
    <rect x="3.5" y="4" width="33" height="58" rx="5" fill="#fff"/>
    <rect x="9" y="12" width="21" height="4" rx="2" fill="${P.arena}"/>
    <rect x="9" y="21" width="14" height="4" rx="2" fill="${P.arena}"/>
    <rect x="9" y="40" width="21" height="11" rx="4" fill="${P.rojo}"/>
  </g>
  <!-- flujo del dinero -->
  <path d="M318 108 C356 76, 408 72, 442 92" fill="none" stroke="${P.rojo}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="0.5 8"/>
  <circle cx="330" cy="99" r="7.5" fill="${P.rojo}"/>
  <circle cx="366" cy="82" r="5.5" fill="${P.rojo}" opacity="0.7"/>
  <circle cx="404" cy="78" r="4" fill="${P.rojo}" opacity="0.45"/>
`, 0.34);

/* ============ Escena 2 · conversación en el mesón ============ */
export const ESC_CREDITO = lienzo(`
  <rect x="0" y="0" width="620" height="150" fill="${P.crema}"/>
  <rect x="0" y="0" width="620" height="150" fill="url(#luz)"/>
  <circle cx="500" cy="52" r="46" fill="${P.blush}" opacity="0.85"/>
  <rect x="0" y="150" width="620" height="8" fill="${P.arena}"/>
  <rect x="0" y="158" width="620" height="62" fill="${P.fondo}"/>

  <!-- socia -->
  ${figura({ x: 196, y: 92, e: 1.12, piel: P.pielB, pelo: P.peloB, ropa: P.vino, inclina: 5, brazo: "mesa", pelolargo: true })}
  <!-- ejecutiva -->
  ${figura({ x: 424, y: 90, e: 1.14, piel: P.pielA, pelo: P.peloA, ropa: P.azul, ropaSombra: "#22384f", inclina: -5, brazo: "mesa", mira: "izq" })}

  <!-- mesón -->
  <rect x="248" y="146" width="128" height="9" rx="3" fill="${P.tinta}" opacity="0.82"/>
  <rect x="262" y="155" width="7" height="34" fill="${P.tinta}" opacity="0.45"/>
  <rect x="356" y="155" width="7" height="34" fill="${P.tinta}" opacity="0.45"/>

  <!-- documento con condiciones -->
  <g transform="translate(278,104) rotate(-4)">
    <rect width="68" height="46" rx="3" fill="#fff"/>
    <rect x="8" y="9" width="38" height="4" rx="2" fill="${P.arena}"/>
    <rect x="8" y="18" width="50" height="4" rx="2" fill="${P.arena}"/>
    <rect x="8" y="27" width="30" height="4" rx="2" fill="${P.arena}"/>
    <rect x="8" y="35" width="20" height="6" rx="3" fill="${P.rojo}"/>
  </g>
`, 0.5);

/* ============ Escena 3 · la cooperativa como grupo ============ */
export const ESC_REMANENTE = lienzo(`
  <rect x="0" y="0" width="620" height="220" fill="${P.fondo}"/>
  <circle cx="310" cy="120" r="98" fill="url(#calido)"/>
  <circle cx="310" cy="120" r="98" fill="url(#puntos)"/>

  ${[
    { x: 152, y: 150, e: 0.72, piel: P.pielC, pelo: P.peloA, ropa: P.verde, mira: "der" as const, brazo: "cruzado" as const },
    { x: 224, y: 140, e: 0.82, piel: P.pielA, pelo: P.peloB, ropa: P.azul, pelolargo: true, mira: "der" as const, brazo: "cruzado" as const },
    { x: 310, y: 130, e: 0.94, piel: P.pielB, pelo: P.peloA, ropa: P.rojo, ropaSombra: P.rojoOsc, brazo: "cruzado" as const },
    { x: 396, y: 140, e: 0.82, piel: P.pielC, pelo: P.peloC, ropa: P.ocre, mira: "izq" as const, brazo: "cruzado" as const },
    { x: 468, y: 150, e: 0.72, piel: P.pielA, pelo: P.peloA, ropa: P.vino, pelolargo: true, mira: "izq" as const, brazo: "cruzado" as const },
  ]
    .map((f) => figura(f as any))
    .join("\n  ")}

  <rect x="0" y="196" width="620" height="24" fill="${P.arena}" opacity="0.5"/>
`, 0.5);

/* ============ Escena 4 · ahorro que crece ============ */
export const ESC_AHORRO = lienzo(`
  <rect x="0" y="0" width="620" height="158" fill="${P.crema}"/>
  <rect x="0" y="0" width="620" height="158" fill="url(#luz)"/>
  <rect x="0" y="158" width="620" height="6" fill="${P.arena}"/>
  <rect x="0" y="164" width="620" height="56" fill="${P.fondo}"/>

  <!-- repisa con macetas de distinto porte: la idea de plazo -->
  <g>
    <path d="M316 164 L350 164 L346 132 L320 132 Z" fill="${P.ocre}"/>
    <path d="M333 132 C333 122, 326 118, 325 110 C332 112, 336 118, 337 124 C338 114, 344 108, 352 105 C350 118, 342 126, 338 129 Z" fill="${P.verde}"/>

    <path d="M382 164 L424 164 L419 122 L387 122 Z" fill="${P.rojo}"/>
    <path d="M403 122 C403 102, 390 94, 388 76 C402 82, 410 96, 411 110 C413 88, 424 76, 440 70 C436 98, 420 114, 412 118 Z" fill="${P.verde}"/>

    <path d="M452 164 L480 164 L477 142 L455 142 Z" fill="${P.arena}"/>
    <path d="M466 142 C466 134, 460 130, 459 124 C465 126, 468 131, 469 136 C470 128, 475 124, 481 122 C479 132, 472 138, 469 140 Z" fill="${P.verde}" opacity="0.75"/>
  </g>

  ${figura({ x: 208, y: 98, e: 1.16, piel: P.pielC, pelo: P.peloA, ropa: P.azul, ropaSombra: "#22384f", inclina: 7, brazo: "mesa", pelolargo: true })}
`, 0.44);

/* ============ Escena 5 · protección familiar ============ */
export const ESC_PROTECCION = lienzo(`
  <rect x="0" y="0" width="620" height="220" fill="${P.fondo}"/>
  <circle cx="310" cy="140" r="92" fill="${P.blush}" opacity="0.7"/>
  <!-- techo, no paraguas: menos cliché de seguro -->
  <path d="M172 112 L310 44 L448 112 Z" fill="${P.rojo}"/>
  <path d="M310 44 L448 112 L406 112 L310 60 Z" fill="${P.rojoOsc}" opacity="0.4"/>
  <rect x="196" y="112" width="228" height="7" rx="3" fill="${P.rojoOsc}" opacity="0.28"/>

  ${figura({ x: 254, y: 138, e: 0.92, piel: P.pielA, pelo: P.peloB, ropa: P.azul, inclina: 5, brazo: "cruzado" })}
  ${figura({ x: 366, y: 138, e: 0.92, piel: P.pielB, pelo: P.peloA, ropa: P.vino, pelolargo: true, inclina: -5, brazo: "cruzado", mira: "izq" })}
  ${figura({ x: 310, y: 152, e: 0.62, piel: P.pielC, pelo: P.peloA, ropa: P.verde, brazo: "cruzado" })}

  <rect x="0" y="196" width="620" height="24" fill="${P.arena}" opacity="0.45"/>
`, 0.5);

/* ============ Escena 6 · el mensaje que llega ============ */
export const ESC_MENSAJE = lienzo(`
  <rect x="0" y="0" width="620" height="220" fill="${P.fondo}"/>
  <rect x="330" y="0" width="290" height="220" fill="${P.crema}"/>
  <rect x="330" y="0" width="290" height="220" fill="url(#puntos)"/>

  ${figura({ x: 180, y: 106, e: 1.26, piel: P.pielA, pelo: P.peloA, ropa: P.rojo, ropaSombra: P.rojoOsc, inclina: -6, brazo: "cruzado", pelolargo: true })}

  <g transform="translate(372,52)">
    <rect width="196" height="92" rx="10" fill="#fff"/>
    <path d="M22 92 L22 112 L48 92 Z" fill="#fff"/>
    <rect x="20" y="22" width="150" height="7" rx="3.5" fill="${P.arena}"/>
    <rect x="20" y="40" width="116" height="7" rx="3.5" fill="${P.arena}"/>
    <rect x="20" y="60" width="66" height="14" rx="7" fill="${P.rojo}"/>
  </g>
`, 0.3);


/* ============ Escena 7 · gas en la cocina ============
   Para el sector gas: el cilindro en su contexto real, la cocina, con la
   persona resolviendo. Nada de camiones ni logos. */
export const ESC_GAS = lienzo(`
  <rect x="0" y="0" width="620" height="150" fill="${P.crema}"/>
  <rect x="0" y="0" width="620" height="150" fill="url(#luz)"/>
  <rect x="0" y="150" width="620" height="9" fill="${P.arena}"/>
  <rect x="0" y="159" width="620" height="61" fill="${P.fondo}"/>

  <!-- repisa con utensilios -->
  <rect x="366" y="44" width="188" height="6" rx="3" fill="${P.arena}"/>
  <rect x="392" y="20" width="18" height="24" rx="3" fill="${P.verdeMezcla}"/>
  <rect x="422" y="26" width="14" height="18" rx="3" fill="${P.ocre}"/>
  <circle cx="470" cy="34" r="10" fill="${P.azulCirculo}" opacity="0.3"/>

  <!-- olla sobre la llama -->
  <ellipse cx="300" cy="132" rx="34" ry="9" fill="${P.tinta}" opacity="0.85"/>
  <path d="M268 132 L332 132 L326 112 L274 112 Z" fill="#C9CBD0"/>
  <rect x="272" y="107" width="56" height="6" rx="3" fill="#E2E4E8"/>
  <path d="M292 146 C296 138, 304 138, 308 146 C304 142, 296 142, 292 146 Z" fill="${P.ocre}"/>

  ${figura({ x: 186, y: 92, e: 1.2, piel: P.pielA, pelo: P.peloB, ropa: P.azulLipi, ropaSombra: "#1F1F5E", inclina: 6, brazo: "mesa", pelolargo: true })}

  <!-- cilindro -->
  <g transform="translate(452,120)">
    <ellipse cx="31" cy="96" rx="34" ry="6" fill="${P.tinta}" opacity="0.1"/>
    <rect x="0" y="8" width="62" height="86" rx="10" fill="${P.amarillo}"/>
    <path d="M40 8 L52 8 C58 8, 62 13, 62 18 L62 84 C62 90, 58 94, 52 94 L40 94 Z" fill="${P.amarilloOsc}" opacity="0.4"/>
    <rect x="0" y="8" width="62" height="16" rx="8" fill="#fff" opacity="0.22"/>
    <rect x="20" y="-6" width="22" height="16" rx="4" fill="#9AA0A6"/>
    <rect x="26" y="-14" width="10" height="10" rx="3" fill="#9AA0A6"/>
    <rect x="12" y="46" width="38" height="16" rx="4" fill="#fff" opacity="0.85"/>
  </g>
`, 0.42);

/* Alias que usa el resto del proyecto */
export const ILU_TRANSFERENCIA = ESC_TRANSFERENCIA;
export const ILU_CREDITO = ESC_CREDITO;
export const ILU_REMANENTE = ESC_REMANENTE;
export const ILU_AHORRO = ESC_AHORRO;
export const ILU_PROTECCION = ESC_PROTECCION;
export const ILU_MENSAJE = ESC_MENSAJE;
export const SVG_GENERICO = ESC_MENSAJE;

/* Selector por familia de producto, para el Caso custom sin IA. */
export function ilustracionPara(productos: string[], objetivos: string[] = []) {
  const p = productos.join(" ").toLowerCase();
  const o = objetivos.join(" ").toLowerCase();
  if (/cilindro|granel|medidor|gas|lipi|kg/.test(p)) return ESC_GAS;
  if (/seguro/.test(p)) return ESC_PROTECCION;
  if (/cuota|remanente|participación/.test(p)) return ESC_REMANENTE;
  if (/crédito|credito|portabilidad|tarjeta|hipotecario/.test(p)) return ESC_CREDITO;
  if (/ahorro|depósito|deposito|plazo|ahorrando/.test(p)) return ESC_AHORRO;
  if (/cuenta vista/.test(p)) return ESC_TRANSFERENCIA;
  if (/fraude/.test(o)) return ESC_PROTECCION;
  return ESC_MENSAJE;
}

/* Dirección de arte que se le entrega al agente cuando genera en vivo. */
export const DIRECCION_ARTE = [
  "Ilustración plana editorial, cálida y humana. NO es un diagrama: prohibidas las flechas de negocio, los iconos corporativos, las cajas y los gráficos.",
  "COMPOSICIÓN: tres planos de profundidad. Fondo con un plano de color (#F2E7DC) y un elemento de contexto (ventana, repisa, pared). Línea de suelo o mesón que separe el fondo del primer plano. La figura NO va centrada: colócala hacia un tercio del lienzo y deja aire al otro lado.",
  "FIGURAS: torso asimétrico (un hombro más alto), cabeza levemente inclinada, y un brazo con recorrido real que TERMINA EN UNA MANO (elipse del color de la piel). El pelo va detrás de la cabeza y la enmarca: nunca cubre el mentón. Sin ojos ni boca.",
  "PALETA: fondo #FAF6F1, plano #F2E7DC, blush #F3D9CF, arena #E8DACB, rojo #E4032E, rojo oscuro #A50B22, vino #8B2C3F, azul #2F4B6B, verde #3D7A5E, ocre #D99A4E, tinta #1C1917. Pieles #E0AE84 #B67D55 #8A5A3B. Pelos #2E2119 #5C3A24 #8A6B4F.",
  "OBJETOS: da contexto cotidiano chileno (taza, planta, mesón, ventana, documento). Un solo objeto protagonista además de la figura.",
  "TÉCNICA: formas grandes y limpias, sin contornos delgados. Puedes usar una capa del mismo color con opacity 0.3 como sombra de volumen.",
].join(" ");
