import React, { useEffect, useState } from "react";
import { MARCA as M, SET_REGLAS } from "../datos/marca";
import { Modal, Boton, Etiqueta, Chip, Campo } from "./UI";
import { Progresion } from "./Animados";
import { medirPieza } from "../lib/legibilidad";
import { piezaAHtml, slug } from "../lib/exportar";
import type { Pieza, Reaccion } from "../lib/tipos";

/* Correo emulado. No abre el cliente de correo del equipo ni sale de la app:
   se redacta, se edita y se "envía" dentro de la demo. Sirve para mostrar el
   handoff que hoy ocurre por fuera del proceso y sin trazabilidad. */

export type Destino = "negocio" | "legal";

const PASOS_ENVIO = [
  "Adjuntando piezas en HTML",
  "Adjuntando paquete de activación",
  "Registrando el envío en la bitácora",
  "Notificando al destinatario",
];

export interface DatosCorreo {
  variantes: { id: string; nombre: string; pieza: Pieza; hipotesis?: string }[];
  ganadora?: string | null;
  reacciones?: Record<string, Reaccion[]> | null;
  productos: string[];
  segmentos: string[];
  canales: string[];
  requisitos?: { id: string; norma: string; exige: string; comoSeResuelve: string }[];
  correcciones?: string[];
  panelN?: number;
  imagen?: string;
  dominio?: string;
  institucion?: string;
}

const prom = (rs?: Reaccion[]) => (rs?.length ? Math.round(rs.reduce((a, r) => a + r.actua, 0) / rs.length) : 0);
const lista = (a: string[]) => (!a?.length ? "" : a.length === 1 ? a[0] : a.slice(0, -1).join(", ") + " y " + a[a.length - 1]);

/* --- Redacción del cuerpo según a quién va dirigido --- */
export function redactarCorreo(destino: Destino, d: DatosCorreo) {
  const campana = `${lista(d.productos)} · ${lista(d.segmentos)}`;
  const gana = d.variantes.find((v) => v.id === d.ganadora) || d.variantes[0];
  const leg = medirPieza(gana.pieza).total;

  if (destino === "negocio") {
    return {
      para: `marketing.digital@${d.dominio || "institucion"}.cl`,
      cc: `gerencia.comercial@${d.dominio || "institucion"}.cl`,
      asunto: `Revisión de campaña · ${campana}`,
      cuerpo: [
        `Hola,`,
        ``,
        `Van las piezas de la campaña ${campana} para su revisión, en ${d.canales.length === 1 ? "el canal" : "los canales"} ${lista(d.canales)}.`,
        ``,
        `Se generaron tres variantes con hipótesis distintas y se probaron con un panel de ${d.panelN || 0} socios del segmento antes de cualquier envío:`,
        ...d.variantes.map((v) => {
          const p = prom(d.reacciones?.[v.id]);
          return `· Variante ${v.id} (${v.nombre}): intención de actuar ${p}%.${v.hipotesis ? ` Hipótesis: ${v.hipotesis.toLowerCase()}` : ""}`;
        }),
        ``,
        `La recomendación es la variante ${gana.id}, que obtuvo la mayor intención de actuar en el segmento. Su índice de comprensión es ${leg.ifsz} (${leg.banda.toLowerCase()}, nivel lector ${leg.nivel.toLowerCase()}).`,
        ``,
        `Todas las variantes salieron cumpliendo el set normativo vigente (${SET_REGLAS}); las obligaciones se aplicaron durante la generación, no en una revisión posterior. La revisión legal va en paralelo.`,
        ``,
        `Lo que necesitamos de ustedes:`,
        `· Confirmar la variante a activar (o pedir ajustes).`,
        `· Validar el segmento y la ventana de envío.`,
        `· Avisar si hay alguna condición comercial que no esté reflejada.`,
        ``,
        `Adjunto las piezas en HTML y el paquete de activación para Marketing Cloud.`,
        ``,
        `Saludos.`,
      ].join("\n"),
    };
  }

  /* Legal: el texto le dice al abogado qué se contempló y qué queda pendiente
     de su confirmación. Nunca afirma que la pieza está aprobada. */
  const reqs = d.requisitos || [];
  return {
    para: `fiscalia@${d.dominio || "institucion"}.cl`,
    cc: `cumplimiento@${d.dominio || "institucion"}.cl`,
    asunto: `Solicitud de revisión legal · ${campana}`,
    cuerpo: [
      `Estimado equipo legal,`,
      ``,
      `Enviamos para su revisión y confirmación las piezas de la campaña ${campana}, en ${lista(d.canales)}.`,
      ``,
      `Para facilitar la revisión, detallamos qué se contempló durante la generación. Esto es lo que la herramienta aplicó, no una validación: la revisión de fondo sigue siendo suya.`,
      ``,
      `Set normativo aplicado: ${SET_REGLAS}.`,
      ``,
      `Obligaciones incorporadas en la redacción:`,
      ...(reqs.length
        ? reqs.map((r) => `· ${r.id} — ${r.norma}: ${r.exige}. Resuelto así: ${r.comoSeResuelve.toLowerCase()}.`)
        : ["· (sin requisitos registrados en esta corrida)"]),
      ``,
      ...(d.correcciones?.length
        ? [`Elementos que la capa insertó automáticamente por ser obligatorios:`, ...d.correcciones.map((c) => `· ${c}`), ``]
        : []),
      `Comprensión del mensaje: la pieza recomendada tiene un índice de ${leg.ifsz} en la escala INFLESZ (${leg.banda.toLowerCase()}), equivalente a nivel lector ${leg.nivel.toLowerCase()}. Se midió porque una pieza puede cumplir la norma y aun así no entenderse.`,
      ``,
      `Puntos que requieren su criterio y que la herramienta no puede resolver:`,
      `· Suficiencia del ejemplo representativo para el producto comunicado.`,
      `· Vigencia de las condiciones comerciales citadas en la pieza.`,
      `· Aplicabilidad de normativa sectorial reciente no incorporada al set.`,
      `· Cualquier compromiso implícito en el texto que pueda leerse como oferta vinculante.`,
      ``,
      `Quedamos a la espera de su confirmación o de las observaciones que corresponda incorporar antes de activar. No se enviará ninguna pieza sin su respuesta.`,
      ``,
      `Adjuntamos las piezas en HTML y el detalle del paquete de activación.`,
      ``,
      `Saludos cordiales.`,
    ].join("\n"),
  };
}

export function CorreoEmulado({
  abierto, destino, datos, onCerrar, onEnviado,
}: {
  abierto: boolean;
  destino: Destino;
  datos: DatosCorreo;
  onCerrar: () => void;
  onEnviado?: (destino: Destino, asunto: string) => void;
}) {
  const [para, setPara] = useState("");
  const [cc, setCc] = useState("");
  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [paso, setPaso] = useState(-1);
  const [enviado, setEnviado] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const d = redactarCorreo(destino, datos);
    setPara(d.para); setCc(d.cc); setAsunto(d.asunto); setCuerpo(d.cuerpo);
    setPaso(-1); setEnviado(false);
  }, [abierto, destino]);

  const adjuntos = datos.variantes.map((v) => ({
    nombre: `${slug(lista(datos.productos))}-variante-${v.id.toLowerCase()}.html`,
    peso: Math.round(piezaAHtml(v.pieza, datos.imagen).length / 1024),
  }));
  adjuntos.push({ nombre: `${slug(lista(datos.productos))}-paquete.json`, peso: 4 });

  const enviar = async () => {
    for (let i = 0; i < PASOS_ENVIO.length; i++) {
      setPaso(i);
      await new Promise((r) => setTimeout(r, 550));
    }
    setPaso(PASOS_ENVIO.length);
    setEnviado(true);
    onEnviado?.(destino, asunto);
  };

  const esLegal = destino === "legal";

  return (
    <Modal
      abierto={abierto}
      onCerrar={onCerrar}
      ancho={820}
      titulo={esLegal ? "Revisión y auditoría legal" : "Enviar a negocio para revisión"}
      subtitulo={
        esLegal
          ? "El texto le indica al abogado qué contempló la capa y qué queda pendiente de su confirmación."
          : "Correo con las piezas adjuntas y el resultado del panel. Editable antes de enviar."
      }
      pie={
        enviado ? (
          <Boton onClick={onCerrar}>Cerrar</Boton>
        ) : (
          <>
            <Boton variante="fantasma" onClick={onCerrar}>Cancelar</Boton>
            <Boton onClick={enviar} disabled={paso >= 0} icono="→">
              {paso >= 0 ? "Enviando…" : "Enviar"}
            </Boton>
          </>
        )
      }
    >
      <div className="mb-3">
        <Chip color={M.alerta} punto>envío emulado · no sale de esta demo</Chip>
      </div>

      {!enviado ? (
        <>
          <div className="grid gap-3 md:grid-cols-2">
            <Campo etiqueta="Para" valor={para} onChange={setPara} />
            <Campo etiqueta="CC" valor={cc} onChange={setCc} />
          </div>
          <Campo etiqueta="Asunto" valor={asunto} onChange={setAsunto} />
          <Campo etiqueta="Mensaje" valor={cuerpo} onChange={setCuerpo} filas={16} />

          <div style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 12 }}>
            <Etiqueta color={M.tinta}>Adjuntos ({adjuntos.length})</Etiqueta>
            <div className="flex flex-wrap gap-2 mt-2">
              {adjuntos.map((a) => (
                <span key={a.nombre} className="inline-flex items-center gap-2"
                  style={{ fontSize: 11.5, background: M.niebla, borderRadius: 10, padding: "6px 11px" }}>
                  <span style={{ fontSize: 13 }}>📎</span>
                  <span className="font-mono">{a.nombre}</span>
                  <span style={{ color: M.gris }}>{a.peso} KB</span>
                </span>
              ))}
            </div>
          </div>

          {paso >= 0 && (
            <div className="mt-4" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 12 }}>
              <Progresion pasos={PASOS_ENVIO} indice={paso} />
            </div>
          )}
        </>
      ) : (
        <div className="entra">
          <Progresion
            pasos={PASOS_ENVIO}
            indice={PASOS_ENVIO.length}
            textoFinal={
              esLegal
                ? "Solicitud registrada. En un entorno conectado, la campaña queda bloqueada para activación hasta que legal responda: la capa no envía sin esa confirmación."
                : "Correo registrado en la bitácora de la campaña. El destinatario confirma la variante o pide ajustes, y esa respuesta queda asociada a la corrida."
            }
          />
          <div className="mt-4" style={{ background: M.niebla, borderRadius: 12, padding: 14 }}>
            <Etiqueta color={M.tinta}>Lo que queda registrado</Etiqueta>
            <div style={{ fontSize: 12.5, lineHeight: 1.7, marginTop: 6, color: M.gris }}>
              A quién se envió, con qué asunto, qué variantes iban adjuntas, bajo qué versión del set de reglas y con qué
              resultado de panel. Hoy este traspaso ocurre por correo suelto y esa cadena se pierde; acá queda amarrada
              a la corrida.
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
