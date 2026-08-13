import { REGLAS } from "../datos/reglas";
import { PERSONAS } from "../datos/personas";
import type { EvaluacionRegla, Modulo, Pieza, Reaccion } from "./tipos";
import { medirPieza, medir } from "./legibilidad";

/* Motor determinista de respaldo para el Caso libre. No pretende ser inteligente:
   pretende que la demo funcione sin conexion y sin clave.
   Regla de oro: lo que escribe va dirigido al socio que lo recibe. La nota del
   solicitante es contexto interno y nunca se copia a la pieza. */

export interface BriefLibre {
  productos: string[];
  objetivos: string[];
  segmentos: string[];
  canales: string[];
  tonos: string[];
  detalle: string;
  oferta: string;
}

export const p1 = (a: string[]) => (a && a.length ? a[0] : "");
export const lista = (a: string[]) =>
  !a || !a.length ? "" : a.length === 1 ? a[0] : a.slice(0, -1).join(", ") + " y " + a[a.length - 1];

const esCredito = (b: BriefLibre) => /crédito|credito|portabilidad|tarjeta/i.test(b.productos.join(" "));
const esDeposito = (b: BriefLibre) => /depósito|deposito|ahorro|cuenta vista|plazo/i.test(b.productos.join(" "));
const esCooperativo = (b: BriefLibre) => /cuota|remanente|participación/i.test(b.productos.join(" "));
const esSeguro = (b: BriefLibre) => /seguro/i.test(b.productos.join(" "));
const trataDeUsted = (b: BriefLibre) => /pensionad|60|convenio|baja actividad/i.test(b.segmentos.join(" "));

export function estrategiaLocal(b: BriefLibre) {
  const prod = p1(b.productos) || "el producto";
  const obj = p1(b.objetivos);
  return {
    angulo: esCooperativo(b)
      ? "Explicar el mecanismo cooperativo, no empujar el producto."
      : `${prod} contado desde lo que le cambia al socio, no desde el producto.`,
    promesa: esCredito(b)
      ? `Puede evaluar ${prod.toLowerCase()} con todas las condiciones a la vista.`
      : esDeposito(b)
      ? `Su dinero puede trabajar sin dejar de estar disponible cuando lo necesite.`
      : `Entender ${prod.toLowerCase()} sin letra chica.`,
    riesgo: esCredito(b)
      ? "Comunicar una cifra de beneficio sin CAE ni costo total del crédito."
      : esCooperativo(b)
      ? "Prometer un resultado futuro que depende del ejercicio y de la Junta."
      : "Que el mensaje se lea como promoción temporal y no como condición estable.",
    kpi: obj === "Informar" || obj === "Educar y prevenir fraude"
      ? "Lectura completa y consultas informadas"
      : "Acciones iniciadas sobre la base contactada",
  };
}

/* Copy dirigido al socio. Tres enfoques realmente distintos, no el mismo texto
   con otro titular: cambia el largo, el tipo de llamado a la acción y qué se
   pone adelante. Eso es lo que el panel después distingue. */
export type Enfoque = "directa" | "explicativa" | "cooperativa";

interface Base {
  tema: string;
  tituloCorto: string;   // para la variante directa
  hecho: string;         // el dato concreto
  comoSeHace: string;    // el paso operativo
  detalleExtra: string;  // solo la variante explicativa
  porQue: string;        // el encuadre cooperativo
  ctaAccion: string;
  ctaBlando: string;
  legal: string;
}

function baseDe(b: BriefLibre, usted: boolean): Base {
  const tu = (u: string, t: string) => (usted ? u : t);
  const prod = p1(b.productos) || "su producto";

  if (esCredito(b))
    return {
      tema: prod,
      tituloCorto: tu("Su cuota, en un minuto", "Tu cuota, en un minuto"),
      detalleExtra: tu(
        "El plazo, la cuota y la CAE quedan fijos al firmar. Si le conviene depende de su tasa actual y del saldo que le queda.",
        "El plazo, la cuota y la CAE quedan fijos al firmar. Si te conviene depende de tu tasa actual y del saldo que te queda."),
      hecho: tu(
        `Puede traer ${prod.toLowerCase()} a su cooperativa. Un ejemplo: $3.000.000 a 36 meses, cuota de $122.400.`,
        `Puedes traer ${prod.toLowerCase()} a tu cooperativa. Un ejemplo: $3.000.000 a 36 meses, cuota de $122.400.`),
      comoSeHace: tu(
        "La evaluación es gratuita. La pide en sucursal, en AppCoopeuch o llamando al número del reverso de su tarjeta.",
        "La evaluación es gratuita. La pides en sucursal, en AppCoopeuch o llamando al número del reverso de tu tarjeta."),
      porQue: tu(
        "Acá los dueños son los socios, así que la evaluación se hace pensando en si le conviene a usted, no en colocar un crédito.",
        "Acá los dueños son los socios, así que la evaluación se hace pensando en si te conviene a ti, no en colocar un crédito."),
      ctaAccion: "Solicitar la evaluación",
      ctaBlando: "Ver cómo funciona",
      legal:
        "Ejemplo de referencia. El crédito es de $3.000.000 a 36 meses. La cuota es de $122.400. La tasa es 1,35% al mes y la CAE es 21,4%. En total paga $4.406.400. Su caso puede ser distinto: depende de su evaluación.",
    };

  if (esCooperativo(b))
    return {
      tema: "su Remanente",
      tituloCorto: tu("Su Remanente, en simple", "Tu Remanente, en simple"),
      detalleExtra: "El monto de cada año lo aprueba la Junta de Delegados en abril, así que no se puede anticipar.",
      hecho: "En 2026 se repartieron $72.178 millones de Remanente entre 1.284.000 socios.",
      comoSeHace: tu(
        "Su parte depende del capital que mantiene en cuotas y de cuánto usa la cooperativa durante el año.",
        "Tu parte depende del capital que mantienes en cuotas y de cuánto usas la cooperativa durante el año."),
      porQue: tu(
        "Usted no es cliente de Coopeuch: es copropietario, y por eso cada año parte del resultado vuelve a los socios y no a un accionista.",
        "No eres cliente de Coopeuch: eres copropietario, y por eso cada año parte del resultado vuelve a los socios y no a un accionista."),
      ctaAccion: "Aumentar mi cuota",
      ctaBlando: "Ver cómo se calcula",
      legal:
        "Coopeuch nunca solicita claves ni datos personales por correo, WhatsApp o teléfono para entregar el Remanente. Ante cualquier duda, verifique en AppCoopeuch o en una sucursal.",
    };

  if (esDeposito(b) && /depósito|deposito|plazo|ahorro/i.test(b.productos.join(" ")))
    return {
      tema: prod,
      tituloCorto: tu("Su saldo puede rendir", "Tu saldo puede rendir"),
      detalleExtra: tu(
        "Puede elegir el plazo entre 30 y 360 días. El dinero vuelve a su Cuenta Vista el día del vencimiento, sin trámite.",
        "Puedes elegir el plazo entre 30 y 360 días. El dinero vuelve a tu Cuenta Vista el día del vencimiento, sin trámite."),
      hecho: tu(
        `Con $1.000.000 a 90 días en ${prod.toLowerCase()}, ve el monto exacto que recibe antes de confirmar.`,
        `Con $1.000.000 a 90 días en ${prod.toLowerCase()}, ves el monto exacto que recibes antes de confirmar.`),
      comoSeHace: tu(
        "Se hace desde AppCoopeuch en un paso: elige el monto, el plazo y confirma.",
        "Se hace desde AppCoopeuch en un paso: eliges el monto, el plazo y confirmas."),
      porQue: tu(
        "El saldo que deja quieto no rinde. Como acá los dueños son los socios, preferimos que ese dinero trabaje para usted.",
        "El saldo que dejas quieto no rinde. Como acá los dueños son los socios, preferimos que ese dinero trabaje para ti."),
      ctaAccion: "Invertir mi saldo",
      ctaBlando: "Ver mis opciones",
      legal: "Infórmese sobre la garantía estatal de los depósitos en su cooperativa o en www.cmfchile.cl",
    };

  if (esSeguro(b))
    return {
      tema: prod,
      tituloCorto: tu("Qué cubre, en simple", "Qué cubre, en simple"),
      detalleExtra: tu(
        "La prima se descuenta mensualmente y puede terminar la cobertura cuando quiera, sin multa.",
        "La prima se descuenta mensualmente y puedes terminar la cobertura cuando quieras, sin multa."),
      hecho: tu(
        `${prod} cubre lo que está en la póliza y deja fuera lo que no: se lo mostramos en una pantalla, con el costo mensual.`,
        `${prod} cubre lo que está en la póliza y deja fuera lo que no: te lo mostramos en una pantalla, con el costo mensual.`),
      comoSeHace: tu("Puede revisarlo en AppCoopeuch o en cualquier sucursal, sin compromiso.", "Puedes revisarlo en AppCoopeuch o en cualquier sucursal, sin compromiso."),
      porQue: tu(
        "No vendemos coberturas que después no sirven: los dueños de la cooperativa son los mismos socios que las contratan.",
        "No vendemos coberturas que después no sirven: los dueños de la cooperativa son los mismos socios que las contratan."),
      ctaAccion: "Contratar la cobertura",
      ctaBlando: "Ver qué cubre",
      legal: "",
    };

  /* Cuenta Vista y resto */
  return {
    tema: prod,
    tituloCorto: tu("Transferir ya no cuesta", "Transferir ya no cuesta"),
    detalleExtra: tu(
      "El cambio es permanente y no tiene tope de operaciones. Su cuenta sigue funcionando igual en todo lo demás.",
      "El cambio es permanente y no tiene tope de operaciones. Tu cuenta sigue funcionando igual en todo lo demás."),
    hecho: tu(
      `Desde el 1 de julio, transferir desde su ${prod} no tiene comisión. No es una promoción: es la tarifa que rige de ahora en adelante.`,
      `Desde el 1 de julio, transferir desde tu ${prod} no tiene comisión. No es una promoción: es la tarifa que rige de ahora en adelante.`),
    comoSeHace: tu(
      "Aplica a cuentas de Coopeuch y de otros bancos, sin tope de operaciones. Lo hace desde AppCoopeuch.",
      "Aplica a cuentas de Coopeuch y de otros bancos, sin tope de operaciones. Lo haces desde AppCoopeuch."),
    porQue: tu(
      "En una cooperativa los socios son los dueños, así que cobrarle por mover su propio dinero dejó de tener sentido.",
      "En una cooperativa los socios son los dueños, así que cobrarte por mover tu propio dinero dejó de tener sentido."),
    ctaAccion: "Transferir ahora",
    ctaBlando: "Ver mi cuenta",
    legal: "",
  };
}

export function piezaLocal(b: BriefLibre, enfoque: Enfoque = "explicativa"): Pieza {
  const usted = trataDeUsted(b);
  const tu = (u: string, t: string) => (usted ? u : t);
  const base = baseDe(b, usted);
  const sobrio = b.tonos.includes("Institucional sobrio");
  const antifraude = b.objetivos.includes("Educar y prevenir fraude");
  const avisoFraude = tu(
    "Coopeuch nunca le pide claves ni datos personales por correo, WhatsApp o teléfono.",
    "Coopeuch nunca te pide claves ni datos personales por correo, WhatsApp o teléfono.");
  const primeraFrase = (t: string) => t.split(". ")[0].replace(/\.$/, "") + ".";
  const sinCifras = (t: string) => t.replace(/\$\s?[\d.]+/g, "lo que corresponda").replace(/\d+([.,]\d+)?\s?%/g, "la tasa vigente");

  let asunto = "";
  let titular = "";
  let cuerpo: string[] = [];
  let cta = "";
  let legal = "";

  if (enfoque === "directa") {
    /* Corta de verdad: un párrafo, frases breves, llamado a ejecutar. */
    asunto = `%%NombreSocio%%, ${primeraFrase(base.tituloCorto).toLowerCase().replace(/\.$/, "")}`;
    titular = base.tituloCorto;
    cuerpo = [`${primeraFrase(base.hecho)} ${primeraFrase(base.comoSeHace)}`];
    cta = base.ctaAccion;
    legal = base.legal;
  } else if (enfoque === "cooperativa") {
    /* Abre por la copropiedad, sin cifras, invita a entender antes que a actuar. */
    asunto = tu("%%NombreSocio%%, esto lo decidimos porque usted es socio", "%%NombreSocio%%, esto lo decidimos porque eres socio");
    titular = tu("Una decisión de cooperativa", "Una decisión de cooperativa");
    cuerpo = [
      base.porQue,
      sinCifras(`${primeraFrase(base.hecho)} ${base.comoSeHace}`),
      tu(
        "Si quiere entenderlo con calma, en cualquier sucursal se lo explican sin apuro.",
        "Si quieres entenderlo con calma, en cualquier sucursal te lo explican sin apuro."),
    ];
    cta = base.ctaBlando;
    legal = "";
  } else {
    /* Explicativa: el dato completo, el paso operativo y toda la letra chica. */
    asunto = `%%NombreSocio%%, ${tu("cómo funciona", "cómo funciona")} ${base.tema.toLowerCase()}`;
    titular = `Cómo funciona ${base.tema.toLowerCase()}`;
    cuerpo = [base.hecho, base.comoSeHace, base.detalleExtra].filter(Boolean);
    cta = base.ctaBlando;
    legal = base.legal;
  }

  if (b.oferta.trim() && enfoque !== "cooperativa")
    cuerpo[0] += ` ${tu("Condición vigente", "Condición vigente")}: ${b.oferta.trim()}.`;
  if (antifraude) cuerpo.push(avisoFraude);
  if (b.tonos.includes("Directo y breve") && enfoque !== "directa")
    cuerpo = cuerpo.slice(0, 2);
  if (sobrio) asunto = asunto.replace("%%NombreSocio%%, ", "%%NombreSocio%%: ");

  return {
    asunto: asunto.replace(/\s+/g, " "),
    preheader: resumen(enfoque === "cooperativa" ? base.porQue : enfoque === "directa" ? base.comoSeHace : base.hecho),
    titular,
    cuerpo,
    cta,
    legal,
  };
}

const quitarPersonalizacion = (t: string) => t.replace(/%%[^%]+%%/g, "").trim();
const resumen = (t: string) => {
  const f = t.split(". ")[0];
  return f.length > 90 ? f.slice(0, 88) + "…" : f + ".";
};

export function modulosLocal(b: BriefLibre): Modulo[] {
  const mods: Modulo[] = [{ id: "M-011", nombre: "Encabezado socio + saludo nominal", origen: "biblioteca" }];
  if (esCredito(b)) mods.push({ id: "M-023", nombre: "Bloque de condiciones con CAE y costo total", origen: "biblioteca" });
  if (esDeposito(b)) mods.push({ id: "M-031", nombre: "Pie con garantía estatal CMF", origen: "biblioteca" });
  mods.push({ id: "M-044", nombre: "Aviso antifraude · no pedimos claves", origen: "biblioteca" });
  if (b.canales.some((c) => c.includes("Push"))) mods.push({ id: "M-062", nombre: "Versión corta para push", origen: "biblioteca" });
  if (b.canales.some((c) => c.includes("WhatsApp"))) mods.push({ id: "M-066", nombre: "Plantilla WhatsApp verificada", origen: "biblioteca" });
  mods.push({ id: "M-0" + (90 + (p1(b.productos).length % 9)), nombre: `Bloque específico de ${p1(b.productos)}`, origen: "nuevo" });
  return mods;
}

/* ---------- Panel local: la reacción depende del TEXTO, no del brief ----------
   Cada persona tiene sesgos estables (edad, digitalidad, sensibilidades) y la
   pieza tiene rasgos medibles (legibilidad, largo, cifras, aviso antifraude,
   encuadre cooperativo, tipo de llamado a la acción). El cruce de ambos es lo
   que hace que tres variantes distintas den resultados distintos. */

const sello = (t: string) => {
  let h = 0;
  for (let i = 0; i < t.length; i++) h = (h * 31 + t.charCodeAt(i)) >>> 0;
  return h;
};

interface Rasgos {
  legibilidad: number;
  palabras: number;
  breve: boolean;
  largo: boolean;
  conCifra: boolean;
  conCAE: boolean;
  monto: boolean;
  antifraude: boolean;
  cooperativo: boolean;
  urgencia: boolean;
  ctaAccion: boolean;
  ctaBlando: boolean;
  asuntoLargo: boolean;
  permanencia: boolean;
  detalleCompleto: boolean;
}

function rasgosDe(p?: Pieza, respaldo = ""): Rasgos {
  const texto = p
    ? [p.asunto, p.preheader, p.titular, ...(p.cuerpo || []), p.cta, p.legal].filter(Boolean).join(" ")
    : respaldo;
  const l = p ? medirPieza(p).total : medir(texto);
  const cta = p?.cta || "";
  return {
    legibilidad: l.ifsz,
    palabras: l.palabras,
    breve: l.palabras < 75,
    largo: l.palabras > 125,
    conCifra: /\d+([.,]\d+)?\s?%|\$\s?[\d.]+/.test(texto),
    conCAE: /\bcae\b/i.test(texto),
    monto: /\$\s?[\d.]{4,}/.test(texto),
    antifraude: /nunca (le |te )?(pide|pedir|solicita)/i.test(texto),
    cooperativo: /copropietari|dueños son los socios|remanente|parte del resultado/i.test(texto),
    urgencia: /\b(hoy|ahora|ya mismo|aprovech|último)/i.test(texto),
    ctaAccion: /^(transferir|aumentar|contratar|solicitar|activar|abrir|invertir)/i.test(cta),
    ctaBlando: /^(ver|cómo|conocer|revisar|entender)/i.test(cta),
    asuntoLargo: (p?.asunto || "").length > 64,
    permanencia: /permanente|de aquí en adelante|de ahora en adelante|no es una promoci/i.test(texto),
    detalleCompleto: Boolean(p?.legal) && (p?.cuerpo?.length || 0) >= 3,
  };
}

export function panelLocal(b: BriefLibre, ids: string[], pieza?: Pieza | string): Reaccion[] {
  const p = typeof pieza === "string" || pieza === undefined ? undefined : pieza;
  const r = rasgosDe(p, typeof pieza === "string" ? pieza : b.detalle);
  const credito = esCredito(b);
  const hayPush = b.canales.some((c) => /push/i.test(c));
  const hayWhats = b.canales.some((c) => /whatsapp/i.test(c));

  return ids.map((id) => {
    const per = PERSONAS.find((x) => x.id === id)!;
    const mayor = per.edad >= 55;
    const digitalAlta = per.digital === "Alta";
    const digitalBaja = per.digital === "Baja";

    /* --- abre --- */
    let abre = 46 + (mayor ? 12 : -2);
    if (r.asuntoLargo) abre -= 6;
    if (r.breve) abre += digitalAlta ? 12 : mayor ? -3 : 3;
    if (r.largo) abre -= digitalAlta ? 14 : 2;
    if (r.conCifra) abre += mayor ? -9 : 5;
    if (r.urgencia) abre += mayor ? -8 : 3;
    if (r.monto || r.permanencia) abre += 5;
    if (hayPush && digitalAlta) abre += 6;
    if (hayWhats && digitalBaja) abre += 4;
    if (per.id === "P6") abre -= 18;
    if (per.id === "P7" && r.cooperativo) abre += 9;

    /* --- entiende --- */
  let entiende = r.legibilidad >= 85 ? 5 : r.legibilidad >= 72 ? 4.6 : r.legibilidad >= 62 ? 4.1
      : r.legibilidad >= 52 ? 3.6 : r.legibilidad >= 40 ? 3 : 2.2;
    if (r.largo) entiende -= 0.8;
    if (r.conCAE && !r.monto) entiende -= 0.7;
    if (per.id === "P8" && r.largo) entiende -= 0.8;
    if (per.id === "P3" && r.largo) entiende -= 0.6;
    if (mayor && r.legibilidad < 55) entiende -= 0.6;
    if (r.breve && (per.id === "P3" || per.id === "P8")) entiende += 0.5;

    /* --- confía --- */
    let confia = 4;
    if (r.antifraude) confia += per.id === "P6" ? 2 : 0.6;
    if (r.conCifra && credito && !r.conCAE) confia -= mayor ? 2 : 1;
    if (r.conCAE) confia += 0.7;
    if (r.permanencia) confia += per.id === "P10" ? 1.4 : 0.5;
    if (r.urgencia && mayor) confia -= 1;
    if (r.cooperativo) confia += per.id === "P7" ? 1.4 : 0.4;
    if (r.detalleCompleto) confia += 0.5;
    if (!p?.legal && credito) confia -= 0.8;
    if (per.id === "P6") confia -= 2;

    /* --- actúa --- */
    let actua = 26;
    if (entiende >= 4.5) actua += 11; else if (entiende >= 4) actua += 6;
    if (confia >= 4.5) actua += 10; else if (confia >= 4) actua += 5;
    if (r.ctaAccion) actua += digitalAlta ? 14 : digitalBaja ? -13 : 1;
    if (r.ctaBlando) actua += digitalBaja ? 11 : 2;
    if (r.monto && ["P1", "P2", "P4", "P10"].includes(per.id)) actua += 14;
    if (!r.monto && ["P2", "P4"].includes(per.id)) actua -= 10;
    if (r.conCAE && ["P2", "P4"].includes(per.id)) actua += 12;
    if (r.cooperativo && per.id === "P7") actua += 17;
    if (r.cooperativo && ["P1", "P9"].includes(per.id)) actua += 6;
    if (!r.cooperativo && per.id === "P7") actua -= 9;
    if (r.breve && ["P3", "P8"].includes(per.id)) actua += 13;
    if (r.largo && ["P3", "P8"].includes(per.id)) actua -= 14;
    if (r.largo && ["P1", "P9"].includes(per.id)) actua += 5;
    if (r.permanencia && per.id === "P10") actua += 12;
    if (r.detalleCompleto && ["P2", "P4", "P9"].includes(per.id)) actua += 8;
    if (r.detalleCompleto && ["P3", "P8"].includes(per.id)) actua -= 6;
    if (per.id === "P6") actua -= 14;
    if (r.legibilidad < 45) actua -= 8;

    /* --- ruido estable: la misma pieza da siempre el mismo número --- */
    const j = (sello(per.id + (p?.asunto || "") + (p?.cta || "")) % 7) - 3;
    abre += j;
    actua += Math.round(j * 0.8);

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v)));
    const clamp1 = (v: number, min: number, max: number) => Math.max(min, Math.min(max, Math.round(v * 10) / 10));
    const e = clamp1(entiende, 1, 5);
    const c = clamp1(confia, 1, 5);

    return {
      id,
      abre: clamp(abre, 8, 92),
      entiende: e,
      confia: c,
      actua: clamp(actua, 3, 78),
      objecion: objecionDe(per, r, credito, c, e),
      frase: fraseDe(per.id),
    };
  });
}

function objecionDe(per: any, r: Rasgos, credito: boolean, confia: number, entiende: number) {
  if (per.id === "P6" && !r.antifraude) return "Lo lee como posible suplantación";
  if (per.id === "P6") return "Verifica por su cuenta antes de actuar";
  if (credito && !r.conCAE) return "Sin tasa ni cuota no puede evaluar";
  if (r.conCifra && per.edad >= 55 && confia <= 3) return "La cifra grande le genera sospecha";
  if (entiende <= 3) return "Tiene que leerlo dos veces para entenderlo";
  if (r.largo && per.digital === "Alta") return "Demasiado largo para el canal";
  if (per.id === "P7" && !r.cooperativo) return "Le suena a banco, no a cooperativa";
  if (per.id === "P10" && !r.permanencia) return "Duda de que la condición se mantenga";
  if (!r.monto && ["P1", "P2", "P4"].includes(per.id)) return "Le falta el número concreto";
  if (r.ctaAccion && per.digital === "Baja") return "El paso que le piden le da fricción";
  return "Quiere ver el detalle antes de decidir";
}

function fraseDe(id: string) {
  const frases: Record<string, string> = {
    P1: "Necesito que me digan el número, lo demás es puro adorno.",
    P2: "Si no está la cifra concreta, no lo puedo comparar con lo mío.",
    P3: "Si me hablan así de formal lo archivo y no vuelvo.",
    P4: "Muéstrenme la tasa y el plazo, eso es lo que miro.",
    P5: "Está bien, pero yo estoy comparando con otra institución.",
    P6: "Yo confirmo en la sucursal antes de tocar cualquier enlace.",
    P7: "Soy socia, no clienta; que me hablen desde ahí.",
    P8: "Si tengo que leer dos veces para entenderlo, lo dejo.",
    P9: "Que me lo expliquen claro y yo después decido.",
    P10: "Mi cuenta principal es otra, tienen que darme una razón real.",
  };
  return frases[id] || "Lo leo, pero necesito algo más concreto.";
}

/* ---------- Revision sobre el texto real de la pieza ---------- */
export function revisarPieza(p: Pieza, b: BriefLibre): { reglas: EvaluacionRegla[]; correcciones: string[]; veredicto: "apto" | "apto con ajustes" | "no apto" } {
  const texto = [p.asunto, p.preheader, p.titular, ...(p.cuerpo || []), p.cta, p.legal].filter(Boolean).join(" ");
  const t = texto.toLowerCase();

  const credito = esCredito(b);
  const deposito = esDeposito(b);
  const conCifra = /(\d+\s?%)|(\$\s?\d)|hasta un|hasta el/i.test(texto);
  const tieneCAE = /\bcae\b/i.test(texto);
  const tieneCostoTotal = /costo total|en total paga/i.test(texto);
  const pideDatos = /(ingres[ae]\s+tus?\s+datos)|(ingrese sus datos)|(env[íi]e su clave)/i.test(t);
  const avisoFraude = /nunca (le |te )?(pide|pedir[áa]?|solicita)/i.test(t);
  const garantiza = /(asegur[ae] tu)|(garantiz)|(seguro que recib)/i.test(t);
  const garantiaEstatal = /garantía estatal|garantia estatal/i.test(t);
  const diceCliente = /\bclientes?\b/i.test(t) && !/no (es|eres|somos) cliente/i.test(t);

  const reglas: EvaluacionRegla[] = REGLAS.map((r) => {
    switch (r.id) {
      case "R-01":
        return { id: r.id, estado: texto.length > 140 ? "cumple" : "ajustar", evidencia: texto.length > 140 ? "El producto queda explicado" : "Texto demasiado breve para explicar el producto" };
      case "R-02":
        return garantiza
          ? { id: r.id, estado: "bloquea", evidencia: "Promete un resultado que no está garantizado" }
          : conCifra && credito && !tieneCAE
          ? { id: r.id, estado: "ajustar", evidencia: "Cifra sin condiciones esenciales visibles" }
          : { id: r.id, estado: "cumple", evidencia: "Sin promesa sin sustento" };
      case "R-03":
        return deposito
          ? garantiaEstatal
            ? { id: r.id, estado: "cumple", evidencia: "Leyenda de garantía estatal presente" }
            : { id: r.id, estado: "ajustar", evidencia: "Falta leyenda de garantía estatal" }
          : { id: r.id, estado: "no aplica", evidencia: "No comunica producto de depósito" };
      case "R-04":
        return credito
          ? tieneCAE && tieneCostoTotal
            ? { id: r.id, estado: "cumple", evidencia: "CAE y costo total presentes" }
            : { id: r.id, estado: "bloquea", evidencia: "Falta CAE o costo total del crédito" }
          : { id: r.id, estado: "no aplica", evidencia: "No comunica oferta crediticia" };
      case "R-05":
        return pideDatos
          ? { id: r.id, estado: "bloquea", evidencia: "Solicita datos o claves por el canal" }
          : { id: r.id, estado: avisoFraude ? "cumple" : "ajustar", evidencia: avisoFraude ? "Incluye aviso antifraude" : "Sin aviso antifraude explícito" };
      case "R-06":
        return conCifra && !/(referencia|ejemplo)/i.test(t)
          ? { id: r.id, estado: "ajustar", evidencia: "Cifra sin declararse como ejemplo representativo" }
          : { id: r.id, estado: "cumple", evidencia: "Sin ejemplo que requiera representatividad" };
      case "R-07":
        return diceCliente
          ? { id: r.id, estado: "ajustar", evidencia: "Usa «cliente» en vez de «socio»" }
          : { id: r.id, estado: "cumple", evidencia: "Trato de socio, voz cooperativa" };
      default:
        return { id: r.id, estado: "cumple", evidencia: "Exclusiones de audiencia aplicadas" };
    }
  });

  const correcciones = reglas.filter((r) => r.estado === "bloquea" || r.estado === "ajustar").map((r) => `${r.id} · ${r.evidencia}`);
  const bloquea = reglas.some((r) => r.estado === "bloquea");
  return { reglas, correcciones, veredicto: bloquea ? "no apto" : correcciones.length ? "apto con ajustes" : "apto" };
}

/* Diferencias campo a campo entre dos versiones de una pieza */
export function diffPiezas(a: Pieza, b: Pieza) {
  const campos: { campo: string; antes: string; despues: string }[] = [];
  const push = (campo: string, x?: string, y?: string) => {
    if ((x || "") !== (y || "")) campos.push({ campo, antes: x || "", despues: y || "" });
  };
  push("Asunto", a.asunto, b.asunto);
  push("Preheader", a.preheader, b.preheader);
  push("Titular", a.titular, b.titular);
  const n = Math.max(a.cuerpo?.length || 0, b.cuerpo?.length || 0);
  for (let i = 0; i < n; i++) push(`Párrafo ${i + 1}`, a.cuerpo?.[i], b.cuerpo?.[i]);
  push("Llamado a la acción", a.cta, b.cta);
  push("Bloque legal", a.legal, b.legal);
  return campos;
}

/* Panel sugerido segun los segmentos elegidos (union, sin repetir) */
export function panelDeSegmentos(segmentos: string[]): string[] {
  const mapa: Record<string, string[]> = {
    "Socios pensionados (60+)": ["P1", "P6", "P2"],
    "Socios con sueldo abonado": ["P5", "P9", "P3"],
    "Socios jóvenes 18-30": ["P3", "P8"],
    "Socios MYPE": ["P4", "P5"],
    "Socios de convenios institucionales": ["P2", "P9", "P6"],
    "Socios con baja actividad digital": ["P10", "P1"],
    "Socios nuevos digitales": ["P8", "P3"],
    "Socios con capital social bajo": ["P7", "P4", "P10"],
  };
  const ids = segmentos.flatMap((s) => mapa[s] || []);
  const unicos = [...new Set(ids)];
  return unicos.length ? unicos.slice(0, 6) : ["P5", "P3", "P9", "P7"];
}


/* ---------- Requisitos que compliance impone ANTES de escribir ----------
   El agente no revisa al final: entrega al redactor la lista de obligaciones
   que la pieza tiene que cumplir por producto, canal y segmento. La revisión
   posterior solo corre cuando una persona edita el texto a mano. */
export interface Requisito {
  id: string;
  norma: string;
  exige: string;
  comoSeResuelve: string;
}

export function requisitos(b: BriefLibre): Requisito[] {
  const req: Requisito[] = [
    { id: "R-07", norma: "Marca Coopeuch", exige: "Trato de socio, nunca cliente; sin superlativos no verificables",
      comoSeResuelve: "Voz cooperativa aplicada en asunto, cuerpo y CTA" },
    { id: "R-08", norma: "Consentimiento y audiencia", exige: "Excluir opt-out, mora 90+ y socios sin consentimiento",
      comoSeResuelve: "Filtro incorporado en el paquete de activación" },
    { id: "R-01", norma: "Ley 21.398", exige: "Características del producto informadas y accesibles",
      comoSeResuelve: "El cuerpo explica qué es y qué implica antes de pedir la acción" },
  ];
  if (esCredito(b))
    req.push({ id: "R-04", norma: "CAE y costo total del crédito", exige: "CAE, costo total y plazo en la misma pieza",
      comoSeResuelve: "Bloque legal con ejemplo representativo redactado en frases cortas" },
      { id: "R-06", norma: "Publicidad financiera", exige: "Ejemplo representativo, no un caso excepcional",
        comoSeResuelve: "El ejemplo se declara como referencial y sujeto a evaluación" });
  if (esDeposito(b))
    req.push({ id: "R-03", norma: "CMF · garantía estatal", exige: "Leyenda de garantía estatal de depósitos",
      comoSeResuelve: "Pie legal incorporado desde la biblioteca (módulo M-031)" });
  if (esCooperativo(b))
    req.push({ id: "R-02", norma: "Ley 19.496 · SERNAC Financiero", exige: "Sin sugerir resultados garantizados",
      comoSeResuelve: "Se explica el mecanismo sin proyectar montos futuros" });
  if (b.canales.some((c) => /whatsapp|push|email/i.test(c)) || b.objetivos.includes("Educar y prevenir fraude"))
    req.push({ id: "R-05", norma: "Ley 20.009", exige: "Sin solicitar claves ni datos por canal digital",
      comoSeResuelve: "Aviso antifraude explícito y derivación a canales verificables" });
  return req;
}

/* Aplica los requisitos sobre una pieza recién generada. Si el modelo omitió
   algo obligatorio, la capa lo inserta: la pieza sale conforme por construcción. */
export function asegurarConformidad(p: Pieza, b: BriefLibre): { pieza: Pieza; correcciones: string[] } {
  const pieza: Pieza = { ...p, cuerpo: [...(p.cuerpo || [])] };
  const correcciones: string[] = [];
  const texto = () => [pieza.asunto, pieza.titular, ...(pieza.cuerpo || []), pieza.cta, pieza.legal].filter(Boolean).join(" ");

  if (/\bclientes?\b/i.test(texto()) && !/no (es|eres) cliente/i.test(texto())) {
    const arreglar = (t: string) => t.replace(/\bclientes\b/gi, "socios").replace(/\bcliente\b/gi, "socio");
    pieza.asunto = arreglar(pieza.asunto);
    pieza.titular = arreglar(pieza.titular);
    pieza.cuerpo = pieza.cuerpo.map(arreglar);
    correcciones.push("R-07 · se reemplazó «cliente» por «socio» en la generación");
  }

  if (esCredito(b) && !/\bcae\b/i.test(texto())) {
    pieza.legal =
      "Ejemplo de referencia. El crédito es de $3.000.000 a 36 meses. La cuota es de $122.400. La tasa es 1,35% al mes y la CAE es 21,4%. En total paga $4.406.400. Su caso puede ser distinto: depende de su evaluación.";
    correcciones.push("R-04 · se insertó el ejemplo representativo con CAE y costo total");
  }

  if (esDeposito(b) && !/garant[íi]a estatal/i.test(texto())) {
    pieza.legal = [pieza.legal, "Infórmese sobre la garantía estatal de los depósitos en su cooperativa o en www.cmfchile.cl"]
      .filter(Boolean).join(" ");
    correcciones.push("R-03 · se agregó la leyenda de garantía estatal");
  }

  if (!/nunca (le |te )?(pide|pedir|solicita)/i.test(texto())) {
    pieza.legal = [pieza.legal, "Coopeuch nunca le pide claves ni datos personales por correo, WhatsApp o teléfono."]
      .filter(Boolean).join(" ");
    correcciones.push("R-05 · se agregó el aviso antifraude");
  }

  if (/(asegur[ae] tu)|(garantiz)/i.test(texto())) {
    const suavizar = (t: string) => t.replace(/asegur[ae] tu/gi, "conoce tu").replace(/garantiza(mos)?/gi, "explicamos");
    pieza.asunto = suavizar(pieza.asunto);
    pieza.cuerpo = pieza.cuerpo.map(suavizar);
    correcciones.push("R-02 · se eliminó la promesa de resultado garantizado");
  }

  return { pieza, correcciones };
}

/* ---------- Adaptaciones por canal ---------- */
export interface Adaptaciones {
  whatsapp?: string;
  push?: { titulo: string; cuerpo: string };
  web?: { titulo: string; bajada: string };
}

const recortar = (t: string, n: number) => (t.length > n ? t.slice(0, n - 1).trim() + "…" : t);

export function adaptacionesLocales(p: Pieza, canales: string[]): Adaptaciones {
  const a: Adaptaciones = {};
  const limpio = (t: string) => t.replace(/%%NombreSocio%%/g, "Rosa").replace(/%%[^%]+%%/g, "").replace(/^[,:]\s*/, "").trim();
  if (canales.some((c) => /whatsapp/i.test(c)))
    a.whatsapp = `*${limpio(p.titular)}*\n\n${limpio((p.cuerpo || [])[0] || "")}\n\n${limpio(p.cta)} 👉 coopeuch.cl`;
  if (canales.some((c) => /push/i.test(c)))
    a.push = { titulo: recortar(limpio(p.titular), 42), cuerpo: recortar(limpio(p.preheader), 110) };
  if (canales.some((c) => /privado|sitio|web/i.test(c)))
    a.web = { titulo: limpio(p.titular), bajada: recortar(limpio(p.preheader), 140) };
  return a;
}
