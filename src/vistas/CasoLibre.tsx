import React, { useEffect, useRef, useState } from "react";
import { MARCA as M, SET_REGLAS } from "../datos/marca";
import { regla } from "../datos/reglas";
import { persona } from "../datos/personas";
import { ilustracionPara, DIRECCION_ARTE } from "../datos/ilustraciones";
import { Panel, Etiqueta, Chip, Boton, Barra } from "../componentes/UI";
import { AgentePulso, FlujoEtapas, Progresion, BarraComparada, Anillo, Cascada } from "../componentes/Animados";
import { CorreoEmulado, type Destino } from "../componentes/CorreoEmulado";
import { MetodologiaDimensiones } from "../componentes/Metodologia";
import { contextoParaAgentes } from "../estado/config";
import { SelectorMultiple } from "../componentes/SelectorMultiple";
import { VistaCanales } from "../componentes/Previsualizaciones";
import { Trazabilidad } from "../componentes/Trazabilidad";
import { GraficoABC, GraficoAntesDespues, FichaLegibilidad } from "../componentes/Graficos";
import { medirPieza } from "../lib/legibilidad";
import { generar, hayIA } from "../lib/api";
import {
  estrategiaLocal, piezaLocal, modulosLocal, panelLocal, revisarPieza, diffPiezas,
  panelDeSegmentos, requisitos, asegurarConformidad, adaptacionesLocales, notasSugeridas,
  lista, type BriefLibre, type Requisito, type Adaptaciones, type Enfoque,
} from "../lib/motorLocal";
import { piezaAHtml, payloadSfmc, descargar, slug, PASOS_TRANSFERENCIA } from "../lib/exportar";
import { firma, useApp, type EventoLog } from "../estado/store";
import { useSesion } from "../estado/sesion";
import type { Pieza, Reaccion } from "../lib/tipos";

const objetivosDe = (persona: string) => ["Informar", "Activar producto", `Retener ${persona}`, "Educar y prevenir fraude", "Captar operación"];
const canalesDe = (app: string) => ["Email", `Push ${app}`, "WhatsApp", "Sitio privado"];
const tonosDe = (inst: { tipo: string }) =>
  inst.tipo === "cooperativa"
    ? ["Cooperativo cercano", "Institucional sobrio", "Directo y breve"]
    : ["Cercano y claro", "Institucional sobrio", "Directo y breve"];

const PASOS = ["Estrategia", "Requisitos", "Variantes A/B/C", "Adaptación por canal", "Panel", "Paquete"];
/* La variante B toma el color de la marca activa; las otras dos son neutros
   estables para que la comparación se lea igual en cualquier institución. */
const colorVar = (): Record<string, string> => ({ A: "#B9B3AE", B: M.rojo, C: "#1F5F8B" });

const ENFOQUES: { id: "A" | "B" | "C"; enfoque: Enfoque; nombre: string; hipotesis: string }[] = [
  { id: "A", enfoque: "directa", nombre: "Directa", hipotesis: "Ir al grano gana atención en una bandeja saturada." },
  { id: "B", enfoque: "explicativa", nombre: "Explicativa", hipotesis: "Explicar la condición completa produce decisiones mejores y menos reclamos." },
  { id: "C", enfoque: "cooperativa", nombre: "Pertenencia", hipotesis: "Apelar al vínculo con la institución mueve más que cualquier cifra." },
];


const reglaVoz = (persona: string, plural: string) =>
  `MUY IMPORTANTE: escribes el mensaje que recibe el ${persona}, no el encargo interno. Nunca uses formulaciones como «invitar a los ${plural} a…», «comunicar que…» o «informar sobre…»: eso es la instrucción, no la pieza. Habla directo a la persona que abre el mensaje.`;

const espera = (ms: number) => new Promise((r) => setTimeout(r, ms));
const colorEstado = (e: string) => (e === "cumple" ? M.ok : e === "ajustar" ? M.alerta : e === "bloquea" ? M.falla : M.gris);
const prom = (rs: Reaccion[]) => (rs?.length ? Math.round(rs.reduce((a, r) => a + r.actua, 0) / rs.length) : 0);

interface Var {
  id: "A" | "B" | "C";
  nombre: string;
  hipotesis: string;
  pieza: Pieza;
  adaptaciones: Adaptaciones;
  correcciones: string[];
}

export default function CasoLibre() {
  const guardarLibre = useApp((s) => s.guardarLibre);
  const inst = useSesion((s) => s.inst);
  const [ia, setIa] = useState<boolean | null>(null);
  const app = inst.id === "coopeuch" ? "AppCoopeuch" : "app";
  const OBJETIVOS = objetivosDe(inst.persona);
  const CANALES = canalesDe(app);
  const TONOS = tonosDe(inst);

  /* El brief arranca con valores del preset activo, no con los de Coopeuch. */
  const briefInicial = (): BriefLibre => ({
    productos: [inst.productos.find((x) => /depósito|deposito|plazo|ahorro/i.test(x)) || inst.productos[0]],
    objetivos: ["Activar producto"],
    segmentos: [inst.segmentos.find((x) => /sueldo/i.test(x)) || inst.segmentos[0]],
    canales: ["Email", `Push ${app}`],
    tonos: [TONOS[0]],
    oferta: "",
    detalle: "",
  });

  const [b, setB] = useState<BriefLibre>(briefInicial);

  /* Al cambiar de institución, el brief se reinicia: los productos y segmentos
     del preset anterior no existen en el nuevo. */
  const instRef = useRef(inst.id);
  useEffect(() => {
    if (instRef.current === inst.id) return;
    instRef.current = inst.id;
    setB(briefInicial());
    setNotaTocada(false);
    setVariantes(null); setEstrategia(null); setReqs([]); setReacciones(null); setPaso(-1);
  }, [inst.id]);

  const [corriendo, setCorriendo] = useState(false);
  const [paso, setPaso] = useState(-1);
  const [estrategia, setEstrategia] = useState<any>(null);
  const [reqs, setReqs] = useState<Requisito[]>([]);
  const [variantes, setVariantes] = useState<Var[] | null>(null);
  const [imagen, setImagen] = useState<string>("");
  const [editadas, setEditadas] = useState<Record<string, Pieza>>({});
  const [activa, setActiva] = useState<"A" | "B" | "C">("B");
  const [reacciones, setReacciones] = useState<Record<string, Reaccion[]> | null>(null);
  const [ids, setIds] = useState<string[]>([]);
  const [ganadora, setGanadora] = useState<string | null>(null);
  const [analisis, setAnalisis] = useState<Record<string, any>>({});
  const [analizando, setAnalizando] = useState(false);
  const [modulos, setModulos] = useState<any[]>([]);
  const [log, setLog] = useState<EventoLog[]>([]);
  const [verTraza, setVerTraza] = useState(false);
  const [editandoEstrategia, setEditandoEstrategia] = useState(false);
  const [borrador, setBorrador] = useState<any>(null);
  const [transferencia, setTransferencia] = useState(-1);
  const [correo, setCorreo] = useState<Destino | null>(null);
  const [enviados, setEnviados] = useState<Record<string, string>>({});

  const logRef = useRef<EventoLog[]>([]);
  const corridaRef = useRef(0);          // identifica la corrida vigente
  const [notaTocada, setNotaTocada] = useState(false);
  useEffect(() => { hayIA().then(setIa); }, []);

  const hora = () => new Date().toLocaleTimeString("es-CL", { hour12: false });
  const anotar = (agente: string, evento: string, ref = "") => {
    logRef.current = [...logRef.current, { t: hora(), agente, evento, ref }];
    setLog(logRef.current);
  };

  const briefTexto =
    `Productos: ${lista(b.productos)}. Objetivos: ${lista(b.objetivos)}. Segmentos: ${lista(b.segmentos)}. ` +
    `Canales: ${lista(b.canales)}. Tono: ${lista(b.tonos)}. ${b.oferta ? "Condición: " + b.oferta + ". " : ""}` +
    `Nota interna del solicitante (contexto, no copiar): ${b.detalle}`;

  const alternar = (k: keyof BriefLibre, v: string) => {
    const actual = b[k] as string[];
    const nuevo = actual.includes(v) ? actual.filter((x) => x !== v) : [...actual, v];
    setB({ ...b, [k]: nuevo.length ? nuevo : actual });
  };

  /* Mientras el usuario no escriba su propia nota, la sugerida sigue a los
     parámetros. Apenas la edita a mano, deja de moverse sola. */
  const sugeridas = notasSugeridas(b);
  useEffect(() => {
    if (!notaTocada) setB((x) => ({ ...x, detalle: notasSugeridas(x)[0] || x.detalle }));
  }, [b.productos, b.segmentos, b.objetivos, b.canales, notaTocada]);

  const piezaDe = (id: string) => editadas[id] || variantes?.find((v) => v.id === id)?.pieza!;
  const varActiva = variantes?.find((v) => v.id === activa);

  /* ---------------- Agentes ---------------- */

  const correrEstrategia = async () => {
    let e = estrategiaLocal(b);
    if (ia) {
      try {
        e = await generar(
          `Eres el agente estratega de la capa de marketing de ${inst.nombre}. ${contextoParaAgentes()} Responde SOLO JSON: {"angulo":"","promesa":"","riesgo":"","kpi":""}. Máximo 22 palabras por campo. Español de Chile neutro, sin voseo. Si hay varios productos, segmentos o canales, el ángulo debe resolver la combinación completa.`,
          briefTexto, 600);
      } catch {}
    }
    return e;
  };

  const correrVariante = async (cfg: typeof ENFOQUES[number], est: any, req: Requisito[]): Promise<Var> => {
    let pieza = piezaLocal(b, cfg.enfoque);
    if (ia) {
      try {
        pieza = await generar(
          `Eres el redactor de marca de ${inst.nombre}. ${contextoParaAgentes()} ${reglaVoz(inst.persona, inst.personaPlural)}\n\n` +
          `El agente de compliance ya fijó las obligaciones que esta pieza DEBE cumplir mientras se escribe. No son una revisión posterior: son parte del encargo.\n` +
          req.map((r) => `- ${r.id} ${r.norma}: ${r.exige}`).join("\n") +
          `\n\nEscribe la variante «${cfg.nombre}»: ${cfg.hipotesis} Trato de usted si el segmento incluye pensionados, convenios o baja actividad digital. Frases cortas, comprensibles en enseñanza básica. El asunto empieza con %%NombreSocio%%. Responde SOLO JSON: {"asunto":"","preheader":"","titular":"","cuerpo":["",""],"cta":"","legal":""}. Cada párrafo, máximo 40 palabras. El campo legal debe resolver las obligaciones que lo requieran, en frases cortas; si ninguna aplica, déjalo vacío.`,
          `${briefTexto}\nÁngulo: ${est.angulo}\nPromesa: ${est.promesa}\nRiesgo a evitar: ${est.riesgo}`, 1100);
      } catch {}
    }
    const { pieza: conforme, correcciones } = asegurarConformidad(pieza, b);
    let adaptaciones = adaptacionesLocales(conforme, b.canales);
    if (ia && (b.canales.some((c) => /whatsapp|push/i.test(c)))) {
      try {
        const out = await generar(
          `Eres el agente de adaptación por canal de ${inst.nombre}. Adapta la misma pieza a cada canal respetando sus límites y su forma de leer. WhatsApp: máximo 60 palabras, puede usar *negrita*, sin enlaces que pidan datos. Push: título máximo 42 caracteres, cuerpo máximo 110. Responde SOLO JSON: {"whatsapp":"","push":{"titulo":"","cuerpo":""}}.`,
          `Pieza: titular "${conforme.titular}" · cuerpo: ${(conforme.cuerpo || []).join(" ")} · CTA "${conforme.cta}"`, 700);
        if (out?.whatsapp || out?.push) adaptaciones = { ...adaptaciones, ...out };
      } catch {}
    }
    return { id: cfg.id, nombre: cfg.nombre, hipotesis: cfg.hipotesis, pieza: conforme, adaptaciones, correcciones };
  };

  const correrImagen = async (p: Pieza) => {
    if (!ia) return ilustracionPara(b.productos, b.objetivos);
    try {
      const out = await generar(
        `Eres el agente de ilustración de ${inst.nombre}. Entregas un SVG válido con viewBox="0 0 620 220", sin texto, sin logotipos y sin imágenes externas. ${DIRECCION_ARTE} Responde SOLO JSON: {"svg":"<svg ...></svg>"}.`,
        `Escena a ilustrar para ${lista(b.segmentos)}: ${lista(b.productos)}. Mensaje: ${p.titular}. La escena debe mostrar a una persona en una situación cotidiana relacionada con eso.`, 1400);
      if (out?.svg && String(out.svg).trim().startsWith("<svg")) return out.svg as string;
    } catch {}
    return ilustracionPara(b.productos, b.objetivos);
  };

  const correrPanel = async (pieza: Pieza, listaIds: string[], etiqueta: string) => {
    let rs = panelLocal(b, listaIds, pieza);
    if (ia) {
      try {
        const out = await generar(
          `Eres un simulador de panel de ${inst.personaPlural} de ${inst.nombre}. Reacciones breves y honestas, con objeciones reales. Responde SOLO JSON: {"reacciones":[{"id":"","abre":0,"entiende":0,"confia":0,"actua":0,"objecion":"","frase":""}]}. abre y actua 0-100; entiende y confia 1-5; objecion máximo 12 palabras; frase en primera persona, español de Chile, máximo 15 palabras.`,
          `Variante ${etiqueta}. Pieza: asunto "${pieza.asunto}" · cuerpo: ${(pieza.cuerpo || []).join(" ")} · CTA "${pieza.cta}"\nCanales: ${lista(b.canales)}\n\nPersonas:\n${listaIds
            .map((id) => { const p = persona(id); return `${p.id} ${p.nombre}, ${p.edad}, ${p.ciudad}, ${p.perfil}. ${p.rasgo} Digitalidad ${p.digital}.`; }).join("\n")}`, 1000);
        if (out?.reacciones?.length) rs = out.reacciones;
      } catch {}
    }
    return rs;
  };

  /* Panel comparado: las tres variantes en una sola consulta, para que cada socio
     las contraste entre sí. Evaluarlas por separado produce puntajes parecidos
     porque nada obliga a distinguirlas. */
  const correrPanelComparado = async (vs: Var[], listaIds: string[]) => {
    const local: Record<string, Reaccion[]> = {};
    vs.forEach((v) => (local[v.id] = panelLocal(b, listaIds, v.pieza)));
    if (!ia) return local;

    try {
      const fichas = listaIds.map((id) => {
        const p = persona(id);
        return `${p.id} ${p.nombre}, ${p.edad} años, ${p.ciudad}. ${p.perfil}. ${p.rasgo} Uso digital ${p.digital}. Le mueve: ${p.motivaciones.join("; ")}. Le frena: ${p.frenos.join("; ")}.`;
      }).join("\n");

      const piezas = vs.map((v) =>
        `VARIANTE ${v.id} (${v.nombre}) — ${v.hipotesis}\nasunto: ${v.pieza.asunto}\ntitular: ${v.pieza.titular}\ncuerpo: ${(v.pieza.cuerpo || []).join(" ")}\ncta: ${v.pieza.cta}\nletra chica: ${v.pieza.legal || "no tiene"}`
      ).join("\n\n");

      const out = await generar(
        `Eres un panel de ${inst.personaPlural} de ${inst.nombre} evaluando tres variantes de la misma campaña. ` +
        `Cada ${inst.persona} lee las tres y las compara: las variantes son distintas entre sí en largo, en si traen cifras y en el tipo de llamado a la acción, así que sus puntajes NO pueden ser iguales. ` +
        `Para cada ${inst.persona}, al menos una variante debe quedar claramente mejor y una claramente peor en intención de actuar (diferencia mínima de 15 puntos entre la mejor y la peor). ` +
        `Sé honesto y específico: si a un ${inst.persona} mayor le molesta un llamado a ejecutar, bájalo; si otro necesita el número concreto, castiga la variante que no lo trae. ` +
        `Responde SOLO JSON: {"A":[{"id":"","abre":0,"entiende":0,"confia":0,"actua":0,"objecion":"","frase":""}],"B":[...],"C":[...]}. ` +
        `abre y actua 0-100; entiende y confia 1-5 (permite un decimal); objecion máximo 12 palabras; frase en primera persona, español de Chile, máximo 14 palabras. Incluye a todos los ${inst.personaPlural} en las tres listas.`,
        `PERFILES DEL SEGMENTO (${lista(b.segmentos)}):\n${fichas}\n\nCANALES: ${lista(b.canales)}\n\n${piezas}`,
        3000);

      const res: Record<string, Reaccion[]> = {};
      let completo = true;
      for (const v of vs) {
        const arr = out?.[v.id];
        if (Array.isArray(arr) && arr.length) res[v.id] = arr;
        else { completo = false; res[v.id] = local[v.id]; }
      }
      if (!completo) anotar("Panel sintético", "Respuesta parcial de la IA · variantes faltantes con motor local", "");
      return res;
    } catch {
      return local;
    }
  };

  /* ---------------- Corrida ---------------- */
  const detener = () => {
    corridaRef.current += 1;      // invalida la corrida en vuelo
    setCorriendo(false);
    anotar("Sistema", "Corrida detenida por el usuario", "");
  };

  const correr = async (desde = 0, estFijada?: any) => {
    corridaRef.current += 1;
    const miCorrida = corridaRef.current;
    const vigente = () => corridaRef.current === miCorrida;

    setCorriendo(true); setAnalisis({}); setEditadas({}); setTransferencia(-1); setGanadora(null); setReacciones(null);
    if (desde === 0) { logRef.current = []; setLog([]); }
    setPaso(0);

    if (desde === 0) anotar("Sistema", `Corrida abierta · brief ${firma(briefTexto)}`, ia ? "IA en vivo" : "motor local");
    else anotar("Sistema", "Reejecución con la estrategia editada", firma(JSON.stringify(estFijada || {})));

    const est = estFijada || (await correrEstrategia());
    if (!vigente()) return;
    setEstrategia(est);
    if (!estFijada) anotar("A1 Estrategia", "Ángulo definido y riesgo declarado", firma(est.angulo));
    await espera(350); setPaso(1);

    const req = requisitos(b);
    if (!vigente()) return;
    setReqs(req);
    anotar("A3 Compliance", `${req.length} obligaciones entregadas al redactor antes de escribir`, `set ${SET_REGLAS}`);
    await espera(500); setPaso(2);

    const vs: Var[] = [];
    for (const cfg of ENFOQUES) {
      const v = await correrVariante(cfg, est, req);
      if (!vigente()) return;
      vs.push(v);
      setVariantes([...vs]);
      anotar("A2 Redacción", `Variante ${v.id} · ${v.nombre} generada conforme`, firma(v.pieza.asunto));
      if (v.correcciones.length) anotar("A3 Compliance", `Variante ${v.id} · ${v.correcciones.length} obligaciones insertadas en la generación`, v.correcciones[0]);
    }
    await espera(300); setPaso(3);

    const img = await correrImagen(vs[1].pieza);
    if (!vigente()) return;
    setImagen(img);
    anotar("A4 Ilustración", ia ? "Escena generada como SVG" : "Escena de la biblioteca de ilustración", "vector");
    setModulos(modulosLocal(b));
    await espera(300); setPaso(4);

    const listaIds = panelDeSegmentos(b.segmentos);
    setIds(listaIds);
    const rs = await correrPanelComparado(vs, listaIds);
    if (!vigente()) return;
    setReacciones(rs);
    const gana = ["A", "B", "C"].reduce((a, x) => (prom(rs[x]) > prom(rs[a]) ? x : a), "A");
    setGanadora(gana);
    setActiva(gana as any);
    anotar("Panel sintético", `${listaIds.length} ${inst.personaPlural} evaluaron las tres variantes`, `gana ${gana}`);
    await espera(300); setPaso(5);
    setCorriendo(false);

    guardarLibre({
      brief: b, estrategia: est, pieza: vs.find((v) => v.id === gana)!.pieza, imagen: img,
      compliance: { veredicto: "apto", reglas: [], correcciones: vs.flatMap((v) => v.correcciones) },
      reacciones: rs[gana], ids: listaIds, modulos: modulosLocal(b), log: logRef.current,
    });
  };

  /* ---------------- Edición manual ---------------- */
  const editar = (campo: string, valor: string, i?: number) => {
    const base = piezaDe(activa);
    const actual = { ...base, cuerpo: [...(base.cuerpo || [])] };
    if (campo === "cuerpo" && i !== undefined) actual.cuerpo[i] = valor;
    else (actual as any)[campo] = valor;
    setEditadas({ ...editadas, [activa]: actual });
  };

  const analizar = async () => {
    const original = variantes?.find((v) => v.id === activa)?.pieza;
    const editada = editadas[activa];
    if (!original || !editada) return;
    setAnalizando(true);

    const cambios = diffPiezas(original, editada);
    const revision = revisarPieza(editada, b);
    const legAntes = medirPieza(original).total;
    const legDespues = medirPieza(editada).total;
    const reaccionesNuevas = await correrPanel(editada, ids, `${activa} editada`);

    let base: any = {
      cambios, revision, legAntes, legDespues, reaccionesNuevas,
      lectura: cambios.length
        ? `Se modificaron ${cambios.length} ${cambios.length === 1 ? "campo" : "campos"}. La legibilidad ${
            legDespues.ifsz > legAntes.ifsz ? "mejora" : legDespues.ifsz < legAntes.ifsz ? "empeora" : "se mantiene"
          } y la revisión sobre el texto nuevo queda en «${revision.veredicto}».`
        : "No hay cambios que analizar: la variante está igual que como salió de la capa.",
      mejoro: [], riesgo: revision.correcciones.slice(0, 3),
      veredicto: revision.veredicto === "no apto" ? "peor" : legDespues.ifsz >= legAntes.ifsz ? "mejor" : "peor",
    };

    if (ia && cambios.length) {
      try {
        const out = await generar(
          `Eres el agente de calibración de la capa de marketing de ${inst.nombre}. ${contextoParaAgentes()} La pieza salió conforme de la generación; ahora una persona la editó a mano. Tu trabajo es decir si la edición mantuvo o rompió lo que la capa había garantizado. Sin adular. Responde SOLO JSON: {"lectura":"","mejoro":["",""],"riesgo":["",""],"veredicto":"mejor|igual|peor"}. lectura máximo 45 palabras; cada ítem máximo 16 palabras. Español de Chile, sin voseo.`,
          `ORIGINAL:\nasunto: ${original.asunto}\ntitular: ${original.titular}\ncuerpo: ${(original.cuerpo || []).join(" ")}\ncta: ${original.cta}\nlegal: ${original.legal || "-"}\n\nEDITADA:\nasunto: ${editada.asunto}\ntitular: ${editada.titular}\ncuerpo: ${(editada.cuerpo || []).join(" ")}\ncta: ${editada.cta}\nlegal: ${editada.legal || "-"}\n\nObligaciones que debía cumplir: ${reqs.map((r) => r.id + " " + r.exige).join("; ")}\nLegibilidad antes ${legAntes.ifsz}, después ${legDespues.ifsz}.`,
          900);
        if (out?.lectura) base = { ...base, ...out };
      } catch {}
    }

    setAnalisis({ ...analisis, [activa]: base });
    anotar("A3 Calibración", `Edición manual de la variante ${activa} revisada · ${cambios.length} campos`, base.veredicto);
    setAnalizando(false);
  };

  /* ---------------- Entrega ---------------- */
  const paqueteDe = (id: string) =>
    payloadSfmc({
      clave: `coopeuch_${slug(lista(b.productos))}_libre_${id.toLowerCase()}`,
      nombre: `${lista(b.productos)} · ${lista(b.segmentos)} · variante ${id}`,
      canal: b.canales.map((c) => c.toLowerCase()).join("+"),
      pieza: piezaDe(id),
      segmentos: b.segmentos,
      modulos: modulos.map((m: any) => m.id),
      veredicto: analisis[id]?.revision?.veredicto || "apto",
      panelN: ids.length,
      extra: {
        briefHash: firma(briefTexto), motor: ia ? "ia-en-vivo" : "local",
        variante: id, ganadoraPanel: ganadora, edicionManual: Boolean(editadas[id]),
        canales: b.canales,
      },
    });

  const descargarVariante = (id: string) => {
    const p = piezaDe(id);
    const base = `${slug(lista(b.productos))}-variante-${id.toLowerCase()}`;
    descargar(`${base}.html`, piezaAHtml(p, imagen), "text/html");
    setTimeout(() => descargar(`${base}-paquete.json`, JSON.stringify(paqueteDe(id), null, 2), "application/json"), 350);
    anotar("Entrega", `Variante ${id} descargada${editadas[id] ? " con ediciones" : ""}`, base);
  };

  const descargarTodas = async () => {
    for (const v of variantes || []) {
      descargarVariante(v.id);
      await espera(700);
    }
  };

  const transferir = async () => {
    for (let i = 0; i < PASOS_TRANSFERENCIA.length; i++) { setTransferencia(i); await espera(600); }
    setTransferencia(PASOS_TRANSFERENCIA.length);
    anotar("A5 Activación", `Transferencia simulada · variante ${activa}`, "sin conexión real");
  };

  /* ---------------- UI ---------------- */
  const input = (etiqueta: string, valor: string, onChange: (v: string) => void, filas = 1) => (
    <div className="mb-2">
      <Etiqueta>{etiqueta}</Etiqueta>
      {filas > 1 ? (
        <textarea value={valor} rows={filas} onChange={(e) => onChange(e.target.value)} className="campo w-full mt-1"
          style={{ fontSize: 12.5, padding: "8px 11px", borderRadius: 10, border: `1px solid ${M.linea}`, resize: "vertical", lineHeight: 1.6 }} />
      ) : (
        <input value={valor} onChange={(e) => onChange(e.target.value)} className="campo w-full mt-1"
          style={{ fontSize: 12.5, padding: "8px 11px", borderRadius: 10, border: `1px solid ${M.linea}` }} />
      )}
    </div>
  );

  const an = analisis[activa];

  return (
    <div className="grid gap-4">
      {/* Brief */}
      <Panel titulo="Solicitud de negocio" acento={M.rojo}
        aside={<Chip color={ia ? M.ok : M.alerta}>{ia === null ? "verificando" : ia ? "IA en vivo" : "motor local"}</Chip>}>
        <div className="grid gap-x-8 gap-y-0 xl:grid-cols-2">
          <div>
            <SelectorMultiple etiqueta="Producto" opciones={inst.productos} valores={b.productos}
              onChange={(v) => setB({ ...b, productos: v })} placeholder="Agregar producto…" ejemploOtro="Ej: Cuenta Vista Jóvenes" />
            <SelectorMultiple etiqueta="Segmento" opciones={inst.segmentos} valores={b.segmentos}
              onChange={(v) => setB({ ...b, segmentos: v })} placeholder="Agregar segmento…" ejemploOtro="Ej: Socios de Punta Arenas" />
            <SelectorMultiple etiqueta="Objetivo" opciones={OBJETIVOS} valores={b.objetivos}
              onChange={(v) => setB({ ...b, objetivos: v })} placeholder="Agregar objetivo…" ejemploOtro="Ej: Recuperar socios inactivos" />
          </div>

          <div>
            <SelectorMultiple etiqueta="Canal" opciones={CANALES} valores={b.canales}
              onChange={(v) => setB({ ...b, canales: v })} placeholder="Agregar canal…" ejemploOtro="Ej: SMS" />
            <SelectorMultiple etiqueta="Tono" opciones={TONOS} valores={b.tonos}
              onChange={(v) => setB({ ...b, tonos: v })} placeholder="Agregar tono…" ejemploOtro="Ej: Didáctico, paso a paso" />

            <div className="grid gap-3 md:grid-cols-2 items-start">
              <div>
                <Etiqueta color={M.tinta}>Condición u oferta</Etiqueta>
                <input value={b.oferta} onChange={(e) => setB({ ...b, oferta: e.target.value })}
                  placeholder="Ej: tasa 0,42% mensual a 12 meses" className="w-full mt-2"
                  style={{ fontSize: 12.5, padding: "8px 11px", borderRadius: 10, border: `1px solid ${M.linea}` }} />
                <div style={{ fontSize: 10.5, color: M.gris, marginTop: 4 }}>Opcional. Si lleva cifra, compliance exige ejemplo representativo.</div>
              </div>
              <div>
                <Etiqueta color={M.tinta}>Nota interna del solicitante</Etiqueta>
                <textarea value={b.detalle} onChange={(e) => setB({ ...b, detalle: e.target.value })} rows={3}
                  className="w-full mt-2" style={{ fontSize: 12.5, padding: "8px 11px", borderRadius: 10, border: `1px solid ${M.linea}`, resize: "vertical" }} />
                <div style={{ fontSize: 10.5, color: M.gris, marginTop: 4, lineHeight: 1.5 }}>
                  Contexto para los agentes: nunca se copia al mensaje que recibe el socio.
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <Boton onClick={() => correr(0)} disabled={corriendo} icono="▶">
                {corriendo ? "Agentes trabajando…" : "Activar agentes"}
              </Boton>
              {corriendo && <Boton variante="secundario" onClick={detener}>Detener</Boton>}
              <span className="font-mono" style={{ fontSize: 10, color: M.gris }}>
                {b.productos.length + b.segmentos.length + b.objetivos.length + b.canales.length + b.tonos.length} parámetros · 3 variantes
              </span>
            </div>
          </div>
        </div>

        {paso >= 0 && (
          <div className="mt-5" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 14 }}>
            <FlujoEtapas etapas={PASOS} actual={paso} />
          </div>
        )}
      </Panel>

      {/* Estrategia editable */}
      {estrategia && (
        <Panel titulo="A1 · Estrategia" acento={M.rojo} clase="entra"
          aside={editandoEstrategia ? (
            <>
              <Boton variante="fantasma" tam="chico" onClick={() => setEditandoEstrategia(false)}>Cancelar</Boton>
              <Boton tam="chico" onClick={() => { setEditandoEstrategia(false); correr(1, borrador); }}>
                {corriendo ? "Detener y relanzar" : "Relanzar agentes"}
              </Boton>
            </>
          ) : (
            <button onClick={() => { setBorrador({ ...estrategia }); setEditandoEstrategia(true); }} title="Editar la estrategia"
              style={{ background: "transparent", border: `1px solid ${M.linea}`, borderRadius: 999, cursor: "pointer", padding: "5px 12px", fontSize: 12, color: M.gris }}>✎ editar</button>
          )}>
          {!editandoEstrategia ? (
            <div className="grid gap-4 md:grid-cols-4">
              {[["Ángulo", estrategia.angulo], ["Promesa", estrategia.promesa], ["Riesgo", estrategia.riesgo], ["KPI", estrategia.kpi]].map(([k, v]: any) => (
                <div key={k} style={{ borderLeft: `2px solid ${M.linea}`, paddingLeft: 10 }}>
                  <Etiqueta color={M.tinta}>{k}</Etiqueta>
                  <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.6 }}>{v}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-4">
              {(["angulo", "promesa", "riesgo", "kpi"] as const).map((k) => (
                <div key={k}>
                  <Etiqueta color={M.rojo}>{k === "angulo" ? "Ángulo" : k === "kpi" ? "KPI" : k}</Etiqueta>
                  <textarea value={borrador?.[k] || ""} rows={3}
                    onChange={(e) => setBorrador({ ...borrador, [k]: e.target.value })} className="campo w-full mt-1"
                    style={{ fontSize: 12.5, padding: "7px 9px", border: `1px solid ${M.rojo}`, resize: "vertical", lineHeight: 1.55 }} />
                </div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* Requisitos de compliance previos */}
      {reqs.length > 0 && (
        <Panel titulo="A3 · Requisitos previos a la redacción" acento={M.ok} clase="entra"
          aside={<Chip color={M.ok}>{reqs.length} obligaciones · set {SET_REGLAS}</Chip>}>
          <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, marginBottom: 12, maxWidth: 900 }}>
            Compliance entrega al redactor las obligaciones que corresponden por producto, canal y segmento antes de escribir. Si el redactor omite alguna obligatoria, la capa la inserta antes de mostrar la pieza.
          </div>
          <div className="grid gap-2 md:grid-cols-2 2xl:grid-cols-3">
            {reqs.map((r) => (
              <div key={r.id} style={{ border: `1px solid ${M.linea}`, borderLeft: `3px solid ${M.ok}`, padding: 11 }}>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono" style={{ fontSize: 10, color: M.ok }}>{r.id}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{r.norma}</span>
                </div>
                <div style={{ fontSize: 12, marginTop: 4, lineHeight: 1.5 }}>{r.exige}</div>
                <div style={{ fontSize: 11, color: M.gris, marginTop: 5, lineHeight: 1.5 }}>→ {r.comoSeResuelve}</div>
              </div>
            ))}
          </div>
          {variantes && variantes.some((v) => v.correcciones.length > 0) && (
            <div className="mt-4" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 10 }}>
              <Etiqueta color={M.alerta}>Insertado por la capa durante la generación</Etiqueta>
              {variantes.flatMap((v) => v.correcciones.map((c) => `${v.id} · ${c}`)).map((c, i) => (
                <div key={i} style={{ fontSize: 12, marginTop: 4 }}>· {c}</div>
              ))}
            </div>
          )}
        </Panel>
      )}

      {/* Variantes A/B/C */}
      {variantes && variantes.length > 0 && (
        <>
          <div className="grid gap-3 lg:grid-cols-3">
            {variantes.map((v) => {
              const sel = activa === v.id;
              const l = medirPieza(piezaDe(v.id)).total;
              return (
                <button key={v.id} onClick={() => setActiva(v.id)} className="text-left entra"
                  style={{
                    background: "#fff", border: `1px solid ${sel ? M.rojo : M.linea}`,
                    borderTop: `3px solid ${colorVar()[v.id]}`, padding: 13, cursor: "pointer",
                  }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: colorVar()[v.id] }}>{v.id}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v.nombre}</span>
                    <Chip color={M.ok}>conforme</Chip>
                    {ganadora === v.id && reacciones && (
                      <Chip color={M.rojo}>mayor intención · {prom(reacciones[v.id])}%</Chip>
                    )}
                    {editadas[v.id] && <Chip color={M.alerta}>editada</Chip>}
                  </div>
                  <div style={{ fontSize: 12, color: M.gris, marginTop: 5, lineHeight: 1.5 }}>{v.hipotesis}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 8, lineHeight: 1.4 }}>{piezaDe(v.id).asunto}</div>
                  <div className="flex items-center gap-4 mt-3" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 10 }}>
                    <Anillo valor={l.ifsz} etiqueta="COMPRENSIÓN" color={l.color} tam={54} grosor={5} />
                    {reacciones && (
                      <div>
                        <Etiqueta>Intención de actuar</Etiqueta>
                        <div style={{ fontSize: 21, fontWeight: 300, letterSpacing: "-.02em", lineHeight: 1.2 }}>
                          {prom(reacciones[v.id])}<span style={{ fontSize: 12, color: M.gris }}>%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {varActiva && (
            <div className="grid gap-4 xl:grid-cols-2 items-start">
              <div className="grid gap-2">
                <Etiqueta color={M.rojo}>Variante {varActiva.id} · {varActiva.nombre} · como la recibe el socio</Etiqueta>
                <VistaCanales pieza={piezaDe(activa)} imagen={imagen} adaptaciones={varActiva.adaptaciones} canales={b.canales} />
              </div>

              <Panel titulo={`✎ Editar la variante ${activa}`} acento={M.tinta}
                aside={
                  <>
                    {editadas[activa] && (
                      <Boton variante="fantasma" onClick={() => { const e = { ...editadas }; delete e[activa]; setEditadas(e); const a = { ...analisis }; delete a[activa]; setAnalisis(a); }}>
                        Descartar cambios
                      </Boton>
                    )}
                    <Boton variante="secundario" onClick={analizar} disabled={analizando || !editadas[activa]}>
                      {analizando ? "Calibrando…" : "Analizar cambios"}
                    </Boton>
                  </>
                }>
                {input("Asunto", piezaDe(activa).asunto, (v) => editar("asunto", v))}
                {input("Preheader", piezaDe(activa).preheader, (v) => editar("preheader", v))}
                {input("Titular", piezaDe(activa).titular, (v) => editar("titular", v))}
                {(piezaDe(activa).cuerpo || []).map((p, i) => (
                  <div key={i}>{input(`Párrafo ${i + 1}`, p, (v) => editar("cuerpo", v, i), 3)}</div>
                ))}
                {input("Llamado a la acción", piezaDe(activa).cta, (v) => editar("cta", v))}
                {input("Bloque legal", piezaDe(activa).legal || "", (v) => editar("legal", v), 3)}
                <div style={{ fontSize: 11, color: M.gris, marginTop: 6, lineHeight: 1.55 }}>
                  La pieza salió conforme de la generación. Al editarla, la calibración revisa si la edición mantuvo o
                  rompió lo que la capa había garantizado, vuelve a pasar el panel y mide la comprensión.
                </div>
              </Panel>
            </div>
          )}
        </>
      )}

      {/* Calibración tras edición manual */}
      {an && (
        <div className="grid gap-4 entra">
          <Panel titulo={`Calibración de la variante ${activa}`} acento={an.veredicto === "peor" ? M.alerta : M.ok}
            aside={<Chip color={an.veredicto === "peor" ? M.alerta : M.ok}>{an.veredicto}</Chip>}>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 12, maxWidth: 900 }}>{an.lectura}</div>
            <div className="grid gap-4 md:grid-cols-2">
              {an.mejoro?.length > 0 && (
                <div>
                  <Etiqueta color={M.ok}>Qué mejoró</Etiqueta>
                  {an.mejoro.map((x: string, i: number) => <div key={i} style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>· {x}</div>)}
                </div>
              )}
              {an.riesgo?.length > 0 && (
                <div>
                  <Etiqueta color={M.alerta}>Qué se rompió o hay que mirar</Etiqueta>
                  {an.riesgo.map((x: string, i: number) => <div key={i} style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.5 }}>· {x}</div>)}
                </div>
              )}
            </div>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-4 items-start">
            <Panel titulo="Comprensión" aside={<Chip>INFLESZ</Chip>}>
              <FichaLegibilidad l={an.legDespues} titulo="Versión editada" comparar={an.legAntes.ifsz} />
            </Panel>
            <Panel titulo="Revisión sobre el texto editado"
              acento={an.revision.veredicto === "no apto" ? M.falla : an.revision.veredicto === "apto" ? M.ok : M.alerta}
              aside={<Chip color={an.revision.veredicto === "no apto" ? M.falla : an.revision.veredicto === "apto" ? M.ok : M.alerta}>{an.revision.veredicto}</Chip>}>
              <div className="grid gap-1">
                {an.revision.reglas.map((x: any) => (
                  <div key={x.id} className="flex gap-2 items-baseline" style={{ borderBottom: `1px solid ${M.niebla}`, padding: "2px 0" }}>
                    <span className="font-mono" style={{ fontSize: 10, color: colorEstado(x.estado), minWidth: 32 }}>{x.id}</span>
                    <span className="font-mono" style={{ fontSize: 9.5, color: colorEstado(x.estado), minWidth: 50 }}>{x.estado}</span>
                    <span style={{ fontSize: 11 }}>{x.evidencia}</span>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel titulo={`Campos modificados · ${an.cambios.length}`}>
              <div className="grid gap-2" style={{ maxHeight: 250, overflowY: "auto" }}>
                {an.cambios.map((cm: any, i: number) => (
                  <div key={i} style={{ borderBottom: `1px solid ${M.niebla}`, paddingBottom: 6 }}>
                    <Etiqueta>{cm.campo}</Etiqueta>
                    <div style={{ fontSize: 11, color: M.gris, textDecoration: "line-through", marginTop: 3, lineHeight: 1.45 }}>{cm.antes || "(vacío)"}</div>
                    <div style={{ fontSize: 11.5, marginTop: 3, lineHeight: 1.45 }}>{cm.despues || "(vacío)"}</div>
                  </div>
                ))}
              </div>
            </Panel>
            <Panel titulo="Reevaluación del panel" acento={M.rojo}>
              <GraficoAntesDespues antes={reacciones?.[activa] || []} despues={an.reaccionesNuevas} />
            </Panel>
          </div>
        </div>
      )}

      {/* Panel A/B/C */}
      {reacciones && Object.keys(reacciones).length === 3 && (
        <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr] items-start">
          <Panel titulo="Test A/B/C con el panel del segmento" acento={M.rojo}
            aside={<Chip>n={ids.length} · {lista(b.segmentos)}</Chip>}>
            <div className="mb-3"><MetodologiaDimensiones compacto /></div>
            <GraficoABC reacciones={reacciones} ganador={ganadora || undefined} />
            {(() => {
              const vals = ["A", "B", "C"].map((k) => prom(reacciones[k]));
              const spread = Math.max(...vals) - Math.min(...vals);
              const peor = ["A", "B", "C"][vals.indexOf(Math.min(...vals))];
              return (
                <div className="flex items-baseline gap-3 flex-wrap mt-3" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 10 }}>
                  <span className="font-mono" style={{ fontSize: 10, color: spread >= 8 ? M.rojo : M.alerta }}>
                    DIFERENCIA {spread} PUNTOS DE INTENCIÓN
                  </span>
                  <span style={{ fontSize: 12, color: M.gris, lineHeight: 1.55, flex: 1, minWidth: 260 }}>
                    {spread >= 8
                      ? `${ganadora} supera a ${peor} en ${spread} puntos de intención, con el mismo brief y el mismo producto.`
                      : "Diferencia menor a 8 puntos: las tres son equivalentes para este segmento. La palanca no está en el texto."}
                  </span>
                </div>
              );
            })()}
          </Panel>

          <Panel titulo="Intención de actuar por socio">
            <div className="grid gap-1">
              <div className="flex gap-2 items-center" style={{ borderBottom: `1px solid ${M.linea}`, paddingBottom: 5 }}>
                <span style={{ minWidth: 190 }} />
                {["A", "B", "C"].map((id) => (
                  <span key={id} className="font-mono text-center" style={{ fontSize: 10, color: colorVar()[id], width: 76, fontWeight: 700 }}>
                    {id} {variantes?.find((v) => v.id === id)?.nombre}
                  </span>
                ))}
              </div>
              {ids.map((id) => {
                const p = persona(id);
                const vals = ["A", "B", "C"].map((k) => reacciones[k].find((x) => x.id === id)?.actua || 0);
                const max = Math.max(...vals);
                return (
                  <div key={id} className="flex gap-2 items-center" style={{ borderBottom: `1px solid ${M.niebla}`, padding: "5px 0" }}>
                    <span style={{ fontSize: 12, minWidth: 190 }}>
                      <b>{p.nombre}</b> <span style={{ color: M.gris }}>· {p.edad} · {p.perfil.split(" · ")[0]}</span>
                    </span>
                    {vals.map((v, i) => (
                      <span key={i} className="text-center" style={{ width: 76 }}>
                        <span style={{ fontSize: 13, fontWeight: v === max ? 700 : 400, color: v === max ? M.tinta : M.gris }}>{v}%</span>
                        <Barra valor={v} color={v === max ? colorVar()[["A", "B", "C"][i]] : M.linea} alto={3} />
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
      )}

      {/* Entrega */}
      {variantes && ganadora && (
        <Panel titulo="Entrega" acento={M.rojo} aside={<Chip color={M.alerta}>transferencia simulada</Chip>}>
          <div className="grid gap-4 xl:grid-cols-[1fr_1fr] items-start">
            <div>
              <Etiqueta color={M.tinta}>Descargar piezas</Etiqueta>
              <div className="flex flex-wrap items-stretch gap-2 mt-2">
                {(variantes || []).map((v) => (
                  <Boton key={v.id} variante={v.id === activa ? "primario" : "secundario"} onClick={() => descargarVariante(v.id)}>
                    Descargar {v.id} · {v.nombre}
                  </Boton>
                ))}
                <Boton variante="secundario" onClick={descargarTodas}>Descargar las tres</Boton>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 mb-4">
                {(variantes || []).map((v) => {
                  const marcas = [
                    ganadora === v.id ? `mayor intención (${reacciones ? prom(reacciones[v.id]) : 0}%)` : null,
                    editadas[v.id] ? "con ediciones" : null,
                  ].filter(Boolean);
                  if (!marcas.length) return null;
                  return (
                    <span key={v.id} className="font-mono" style={{ fontSize: 9.5, color: M.gris }}>
                      {v.id}: {marcas.join(" · ")}
                    </span>
                  );
                })}
              </div>

              <Etiqueta color={M.tinta}>Enviar a revisión</Etiqueta>
              <div className="flex flex-wrap items-stretch gap-2 mt-2">
                <Boton variante="secundario" icono="✉" onClick={() => setCorreo("negocio")}>
                  Enviar a negocio para revisión
                </Boton>
                <Boton variante="secundario" icono="§" onClick={() => setCorreo("legal")}>
                  Revisión y auditoría legal
                </Boton>
              </div>
              {Object.keys(enviados).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {enviados.negocio && <Chip color={M.ok} punto>negocio notificado</Chip>}
                  {enviados.legal && <Chip color={M.ok} punto>legal a la espera de confirmación</Chip>}
                </div>
              )}

              <div className="mt-4">
                <Etiqueta color={M.tinta}>Activación</Etiqueta>
                <div className="flex gap-2 flex-wrap mt-2">
                  <Boton variante={enviados.legal ? "primario" : "secundario"} icono="→" onClick={transferir}
                    disabled={transferencia >= 0 && transferencia < PASOS_TRANSFERENCIA.length}>
                    Transferir la variante {activa} a Marketing Cloud
                  </Boton>
                </div>
                {!enviados.legal && (
                  <div style={{ fontSize: 11, color: M.alerta, marginTop: 7, lineHeight: 1.55 }}>
                    En operación, la activación queda bloqueada hasta que legal confirme. Acá se puede transferir igual
                    para efectos de la demostración.
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11.5, color: M.gris, marginTop: 10, lineHeight: 1.6, maxWidth: 620 }}>
                La descarga entrega el correo en HTML con la ilustración embebida y el paquete de activación en JSON, con
                las ediciones que haya hecho sobre cada variante. La transferencia muestra la secuencia exacta que se
                ejecutaría contra Marketing Cloud; en esta demo no hay conexión real ni envío a socios.
              </div>

              {transferencia >= 0 && (
                <div className="mt-4">
                  <Progresion
                    pasos={PASOS_TRANSFERENCIA}
                    indice={transferencia}
                    textoFinal="Asset registrado en la simulación. En un entorno conectado el paso siguiente sería la aprobación del responsable de campaña dentro de Marketing Cloud: la capa no envía."
                  />
                </div>
              )}
            </div>

            <div>
              <Etiqueta color={M.tinta}>Paquete de la variante {activa}</Etiqueta>
              <pre className="font-mono mt-2" style={{ fontSize: 10, lineHeight: 1.65, overflowX: "auto", margin: 0, background: M.niebla, padding: 12 }}>
                {JSON.stringify(paqueteDe(activa), null, 2)}
              </pre>
            </div>
          </div>
        </Panel>
      )}

      <CorreoEmulado
        abierto={correo !== null}
        destino={correo || "negocio"}
        datos={{
          variantes: (variantes || []).map((v) => ({ id: v.id, nombre: v.nombre, pieza: piezaDe(v.id), hipotesis: v.hipotesis })),
          ganadora,
          reacciones,
          productos: b.productos,
          segmentos: b.segmentos,
          canales: b.canales,
          requisitos: reqs,
          correcciones: (variantes || []).flatMap((v) => v.correcciones.map((c) => `${v.id} · ${c}`)),
          panelN: ids.length,
          imagen,
          dominio: inst.dominio.replace(/\.cl$/, ""),
          institucion: inst.nombre,
        }}
        onCerrar={() => setCorreo(null)}
        onEnviado={(d, asunto) => {
          setEnviados({ ...enviados, [d]: asunto });
          anotar(d === "legal" ? "Revisión legal" : "Revisión de negocio", `Correo enviado · ${asunto}`, "envío emulado");
        }}
      />

      {variantes && (
        <div style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 14, overflow: "hidden" }}>
          <button onClick={() => setVerTraza(!verTraza)} className="w-full flex items-center justify-between px-4 py-2"
            style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            <Etiqueta color={M.tinta}>Cinta de trazabilidad · {log.length} eventos</Etiqueta>
            <span className="font-mono" style={{ fontSize: 10, color: M.gris }}>{verTraza ? "ocultar" : "ver"}</span>
          </button>
          {verTraza && <div className="px-4 pb-4"><Trazabilidad log={log} alto={220} /></div>}
        </div>
      )}
    </div>
  );
}
