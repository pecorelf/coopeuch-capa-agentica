import type { Persona } from "../lib/tipos";
import { PERSONAS_GAS } from "./personas-gas";

/* Presets por institución. Mismo producto, distinto vocabulario y marca.
   La diferencia entre una cooperativa y un banco no es el color: es cómo se
   nombra a la persona del otro lado (socio vs cliente), qué productos existen
   y qué reglas aplican. Cambiar solo la paleta produce una demo que suena
   falsa a los cinco segundos. */

export interface Institucion {
  id: string;
  nombre: string;
  tipo: "cooperativa" | "banco" | "caja" | "retail" | "gas";
  /* Sector normativo: define qué set de reglas aplica */
  sector: "financiero" | "gas";
  /* Nombre de la app del cliente, usado en el copy */
  app: string;
  /* Dominio, para correos y previsualización del sitio privado */
  dominio: string;
  logo: string;
  colores: { rojo: string; rojoOsc: string; tinta: string; niebla: string; linea: string };
  /* Vocabulario */
  persona: string;          // socio / cliente
  personaPlural: string;
  personaFem: string;
  tratamiento: "socio" | "cliente";
  /* Contenido */
  contexto: string;
  voz: string;
  vetadas: string[];
  productos: string[];
  segmentos: string[];
  setReglas: string;
  motorActivacion: string;
}

const REGLAS_CL = "cl-cmf-2026.07";

export const INSTITUCIONES: Institucion[] = [
  {
    id: "coopeuch",
    dominio: "coopeuch.cl",
    nombre: "Coopeuch",
    tipo: "cooperativa",
    sector: "financiero",
    app: "AppCoopeuch",
    logo: "/logo-coopeuch.png",
    colores: { rojo: "#E4032E", rojoOsc: "#A50B22", tinta: "#141414", niebla: "#F2F1EF", linea: "#DCD8D3" },
    persona: "socio", personaPlural: "socios", personaFem: "socia", tratamiento: "socio",
    contexto:
      "Coopeuch es la mayor cooperativa de ahorro y crédito de Chile: más de 1.200.000 socios, 81 oficinas de Arica a Punta Arenas, supervisada por la CMF. Los socios son copropietarios y reciben Remanente anual: en 2026 se distribuyeron $72.178 millones entre 1.284.000 socios. Desde julio de 2026 las transferencias electrónicas no tienen costo.",
    voz:
      "Se dice socio, nunca cliente. Trato de usted con pensionados, convenios y baja actividad digital; tú con los demás. Sin superlativos que no se puedan verificar. El beneficio se explica desde el modelo cooperativo, no como una promoción. Frases cortas. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["cliente", "gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["Cuenta Vista", "Crédito de Consumo", "Crédito Pensionados", "Crédito MYPE", "Portabilidad Financiera",
      "Depósito a Plazo", "Cuenta de Ahorro", "AhorrAndo", "Tarjeta de Crédito", "Hipotecario Verde", "Cuotas de participación", "Seguros"],
    segmentos: ["Socios pensionados (60+)", "Socios con sueldo abonado", "Socios jóvenes 18-30", "Socios MYPE",
      "Socios de convenios institucionales", "Socios con baja actividad digital", "Socios nuevos digitales", "Socios con capital social bajo"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "banco-chile",
    dominio: "bancochile.cl",
    app: "la app Banco de Chile",
    nombre: "Banco de Chile",
    tipo: "banco",
    sector: "financiero",
    logo: "/logo-banco-chile.png",
    colores: { rojo: "#0B3B7A", rojoOsc: "#072A57", tinta: "#141414", niebla: "#F1F3F6", linea: "#D6DBE2" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Banco de Chile es uno de los mayores bancos del país, supervisado por la CMF. Opera banca de personas, pyme, empresas y banca privada, con red nacional de sucursales y una base amplia de clientes con cuenta corriente y tarjetas.",
    voz:
      "Se dice cliente. Trato de usted en banca privada, empresas y segmento senior; tú en banca de personas y digital. Sin superlativos no verificables. Las condiciones esenciales van en la pieza, no solo en el pie. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible", "único banco"],
    productos: ["Cuenta Corriente", "Cuenta FAN", "Crédito de Consumo", "Crédito Hipotecario", "Crédito Automotriz",
      "Tarjeta de Crédito", "Línea de Crédito", "Depósito a Plazo", "Fondos Mutuos", "Seguros", "Portabilidad Financiera", "Banca Pyme"],
    segmentos: ["Clientes banca preferencial", "Clientes con sueldo abonado", "Clientes jóvenes 18-30", "Clientes pyme",
      "Clientes banca privada", "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "santander",
    dominio: "santander.cl",
    app: "la app Santander",
    nombre: "Santander Chile",
    tipo: "banco",
    sector: "financiero",
    logo: "/logo-santander.png",
    colores: { rojo: "#EC0000", rojoOsc: "#B30000", tinta: "#1C1917", niebla: "#FAF7F1", linea: "#E0DBD2" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Santander Chile es uno de los mayores bancos del país, supervisado por la CMF, con fuerte foco en digitalización y en su propuesta de cuenta digital. Opera banca de personas, pyme, empresas y banca privada.",
    voz:
      "Se dice cliente. Tono cercano y directo en banca de personas; sobrio en empresas y banca privada. Sin superlativos no verificables. Las condiciones esenciales van visibles. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["Cuenta Corriente", "Cuenta Life", "Crédito de Consumo", "Crédito Hipotecario", "Crédito Automotriz",
      "Tarjeta de Crédito", "Línea de Crédito", "Depósito a Plazo", "Inversiones", "Seguros", "Portabilidad Financiera", "Santander Pyme"],
    segmentos: ["Clientes Select", "Clientes con sueldo abonado", "Clientes jóvenes 18-30", "Clientes pyme",
      "Clientes banca privada", "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "itau",
    dominio: "itau.cl",
    app: "la app Itaú",
    nombre: "Itaú Chile",
    tipo: "banco",
    sector: "financiero",
    logo: "/logo-itau.png",
    colores: { rojo: "#EC7000", rojoOsc: "#B35400", tinta: "#1B1B1B", niebla: "#FAF6F1", linea: "#E2DCD3" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Itaú Chile es un banco de escala mediana con foco en banca de personas de renta media-alta, banca privada y empresas, supervisado por la CMF.",
    voz:
      "Se dice cliente. Tono profesional y claro, sin coloquialismos. Trato de usted por defecto. Sin superlativos no verificables. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["Cuenta Corriente", "Crédito de Consumo", "Crédito Hipotecario", "Tarjeta de Crédito",
      "Línea de Crédito", "Depósito a Plazo", "Inversiones", "Seguros", "Portabilidad Financiera", "Itaú Empresas"],
    segmentos: ["Clientes Personal Bank", "Clientes con sueldo abonado", "Clientes jóvenes profesionales", "Clientes empresas",
      "Clientes banca privada", "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "bci",
    dominio: "bci.cl",
    app: "la app Bci",
    nombre: "Bci",
    tipo: "banco",
    sector: "financiero",
    logo: "/logo-bci.png",
    colores: { rojo: "#0033A0", rojoOsc: "#00237A", tinta: "#141414", niebla: "#F2F4F8", linea: "#D5DBE5" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Bci es uno de los principales bancos del país, supervisado por la CMF, con presencia relevante en banca de personas, pyme y empresas, y con operación digital propia.",
    voz:
      "Se dice cliente. Tono directo y operativo. Sin superlativos no verificables. Las condiciones esenciales visibles en la pieza. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["Cuenta Corriente", "Cuenta Digital", "Crédito de Consumo", "Crédito Hipotecario", "Crédito Automotriz",
      "Tarjeta de Crédito", "Línea de Crédito", "Depósito a Plazo", "Inversiones", "Seguros", "Bci Pyme"],
    segmentos: ["Clientes preferentes", "Clientes con sueldo abonado", "Clientes jóvenes 18-30", "Clientes pyme",
      "Clientes empresas", "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "estado",
    dominio: "bancoestado.cl",
    app: "la app BancoEstado",
    nombre: "BancoEstado",
    tipo: "banco",
    sector: "financiero",
    logo: "/logo-bancoestado.png",
    colores: { rojo: "#F26A21", rojoOsc: "#C1500F", tinta: "#141414", niebla: "#F7F4F0", linea: "#DFD9D1" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "BancoEstado es el banco público de Chile, supervisado por la CMF, con la mayor cobertura territorial del país y un rol relevante en inclusión financiera a través de CuentaRUT.",
    voz:
      "Se dice cliente. Lenguaje simple y accesible: la base es muy amplia y heterogénea. Trato de usted por defecto. Sin superlativos no verificables. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["CuentaRUT", "Cuenta Corriente", "Crédito de Consumo", "Crédito Hipotecario", "Microcrédito",
      "Tarjeta de Crédito", "Depósito a Plazo", "Ahorro Previsional", "Seguros", "BancoEstado Microempresas"],
    segmentos: ["Clientes CuentaRUT", "Clientes con sueldo abonado", "Clientes jóvenes 18-30", "Microempresarios",
      "Clientes de regiones extremas", "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "falabella",
    dominio: "bancofalabella.cl",
    app: "la app Banco Falabella",
    nombre: "Banco Falabella",
    tipo: "retail",
    sector: "financiero",
    logo: "/logo-falabella.png",
    colores: { rojo: "#00A94F", rojoOsc: "#00793A", tinta: "#141414", niebla: "#F3F6F3", linea: "#D9E0D9" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Banco Falabella es un banco ligado al retail, supervisado por la CMF, con foco en tarjeta de crédito, consumo y en el ecosistema del grupo (retail, seguros, viajes y programa de beneficios).",
    voz:
      "Se dice cliente. Tono cercano y comercial, pero sin superlativos no verificables. Las condiciones de la tarjeta y el CAE van visibles. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["CMR", "Cuenta Corriente", "Crédito de Consumo", "Avance en Efectivo", "Súper Avance",
      "Depósito a Plazo", "Seguros", "Crédito Hipotecario", "Programa de beneficios"],
    segmentos: ["Clientes CMR activos", "Clientes con sueldo abonado", "Clientes jóvenes 18-30", "Clientes con avance vigente",
      "Clientes del ecosistema retail", "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "lipigas",
    dominio: "lipigas.cl",
    nombre: "Lipigas",
    tipo: "gas",
    sector: "gas",
    app: "la LipiApp",
    logo: "/logo-lipigas.png",
    /* Colores tomados del logo oficial: azul Minsk #2E2E84, amarillo #FCDB00,
       azul del círculo #2078BF y el verde de la mezcla #549543.
       El azul va como acento principal de interfaz porque el amarillo con texto
       blanco no alcanza contraste legible; el amarillo queda para destacados. */
    colores: { rojo: "#2E2E84", rojoOsc: "#1F1F5E", tinta: "#1C1917", niebla: "#F7F6FA", linea: "#DEDCE8" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Lipigas es una de las mayores distribuidoras de gas licuado de Chile, con alrededor de 34% de participación de mercado en GLP y cobertura en todo el país. Parte del grupo LipiAndes, que opera además en Perú, Colombia y Ecuador. Vende gas en tres formatos: cilindro (5, 11, 15 y 45 kilos, en versiones Clásico, Plus y Catalítico), granel para tanque instalado en el domicilio, y medidor de gas licuado o gas natural por red. Canales de venta: LipiApp MiCilindro, LipiApp MiCuenta para clientes medidor y granel, Sucursal Virtual en lipigas.cl, WhatsApp, call center 600 600 6200 y la red de más de 170 puntos LipiVecino, donde el cliente retira sin costo de despacho. Programas vigentes: Lipipuntos en la app, Lipibolsas para clientes medidor y granel, convenios con más de 200 municipalidades y con AMUCH, y convenios comerciales con WOM, Bci y cajas de compensación. Emergencias de gas: 600 600 9200. Compite con Abastible y Gasco en un mercado de producto homogéneo, con precio internacional fuera del control de la compañía y fuerte estacionalidad invernal.",
    voz:
      "Se dice cliente, nunca socio ni usuario. Trato de tú, cercano y directo, sin tecnicismos. El precio del gas depende del mercado internacional: nunca se promete un precio bajo permanente ni se atribuye el alza a terceros. Toda promoción declara vigencia, tope por RUT y si es acumulable. Nunca se induce a manipular la instalación de gas: eso lo hace un instalador autorizado. Las piezas operativas informan el canal de emergencia. Sin superlativos que no se puedan verificar.",
    vetadas: ["socio", "socios", "el gas más barato", "precio congelado", "gratis", "oferta imperdible"],
    productos: ["Cilindro 5 kg", "Cilindro 11 kg", "Cilindro 15 kg", "Cilindro 45 kg", "Gas granel (tanque)",
      "Medidor gas licuado", "Medidor gas natural", "Lipibolsas", "LipiApp MiCilindro", "Puntos LipiVecino",
      "Convenios municipales", "Lipipuntos"],
    segmentos: ["Clientes cilindro alta rotación", "Clientes cilindro esporádicos", "Clientes granel residencial",
      "Clientes medidor gas natural", "Clientes con convenio municipal", "Clientes de regiones del sur",
      "Clientes que compran en LipiVecino", "Clientes nuevos de la app", "Pequeño comercio y locales",
      "Clientes en riesgo de fuga a la competencia"],
    setReglas: "cl-sec-sernac-2026.08",
    motorActivacion: "Salesforce Marketing Cloud",
  },
  {
    id: "generico",
    dominio: "institucion.cl",
    app: "la app",
    nombre: "Institución A1",
    tipo: "banco",
    sector: "financiero",
    logo: "/logo-institucion.png",
    colores: { rojo: "#4A4A55", rojoOsc: "#2E2E36", tinta: "#141414", niebla: "#F4F4F6", linea: "#DCDCE0" },
    persona: "cliente", personaPlural: "clientes", personaFem: "clienta", tratamiento: "cliente",
    contexto:
      "Institución financiera chilena supervisada por la CMF, con operación en banca de personas y pyme. Preset neutro para demostraciones sin identificar a la institución.",
    voz:
      "Se dice cliente. Tono neutro y claro. Sin superlativos no verificables. Las condiciones esenciales visibles. Nunca se piden claves ni datos por canal digital, y se dice explícitamente.",
    vetadas: ["gratis", "el mejor del mercado", "oferta imperdible"],
    productos: ["Cuenta Corriente", "Cuenta Vista", "Crédito de Consumo", "Crédito Hipotecario", "Tarjeta de Crédito",
      "Línea de Crédito", "Depósito a Plazo", "Seguros", "Portabilidad Financiera"],
    segmentos: ["Clientes preferentes", "Clientes con sueldo abonado", "Clientes jóvenes 18-30", "Clientes pyme",
      "Clientes con baja actividad digital", "Clientes nuevos digitales", "Clientes senior (60+)"],
    setReglas: REGLAS_CL,
    motorActivacion: "Salesforce Marketing Cloud",
  },
];

export const institucion = (id: string) => INSTITUCIONES.find((x) => x.id === id) || INSTITUCIONES[0];

/* Devuelve el panel que corresponde a la institución.
   En gas no se traduce el panel bancario: son clientes distintos, con otros
   productos, otros canales y otras razones para irse. */
export function adaptarPersonas(personas: Persona[], inst: Institucion): Persona[] {
  if (inst.sector === "gas") return PERSONAS_GAS;
  if (inst.tratamiento === "socio") return personas;
  const cambiar = (t: string) =>
    t.replace(/\bsocios\b/g, "clientes").replace(/\bsocio\b/g, "cliente")
     .replace(/\bsocia\b/g, "clienta").replace(/\bSocios\b/g, "Clientes").replace(/\bSocio\b/g, "Cliente")
     .replace(/cooperativa/gi, "institución").replace(/Remanente/g, "programa de beneficios")
     .replace(/cuotas de participación/gi, "productos de inversión")
     .replace(/copropietari[oa]s?/gi, "cliente")
     .replace(/AppCoopeuch/g, "la app");
  return personas.map((p) => ({
    ...p,
    perfil: cambiar(p.perfil),
    rasgo: cambiar(p.rasgo),
    anclaje: cambiar(p.anclaje),
    representa: cambiar(p.representa),
    comoLee: cambiar(p.comoLee),
    productos: p.productos.map(cambiar),
    fuentes: p.fuentes.map(cambiar),
    motivaciones: p.motivaciones.map(cambiar),
    frenos: p.frenos.map(cambiar),
    sensibilidades: p.sensibilidades.map(cambiar),
  }));
}
