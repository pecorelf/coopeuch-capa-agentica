import React from "react";
import { MARCA as M, SET_REGLAS } from "../datos/marca";
import { CASOS } from "../datos/casos";
import { useApp } from "../estado/store";
import { Panel, Chip, Fila, Etiqueta } from "../componentes/UI";
import { Trazabilidad } from "../componentes/Trazabilidad";
import { firma } from "../estado/store";

export default function Paquete() {
  const { casoId, log, etapa } = useApp();
  const c = CASOS.find((x) => x.id === casoId)!;
  const listo = etapa >= 7;

  const payload = {
    definitionKey: `coopeuch_${c.id.toLowerCase()}_${c.producto.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_v2`,
    assetType: { name: "htmlemail", id: 208 },
    name: `${c.producto} · ${c.segmento}`,
    channel: c.canal.toLowerCase().includes("push") ? "email+push" : "email",
    subjectLine: c.piezaV2.asunto,
    preheader: c.piezaV2.preheader,
    dataExtension: c.activacion.dataExtension,
    audienceFilter: { segmento: c.segmento, excluir: c.activacion.excluir },
    journey: { key: c.activacion.journey, entrySource: c.activacion.dataExtension, sendClassification: "Comercial" },
    sendWindow: c.activacion.ventana,
    personalizacion: c.activacion.personalizacion,
    modulos: c.modulos.map((m) => m.id),
    compliance: {
      reglaSetVersion: SET_REGLAS,
      veredictoV1: c.compliance.veredicto,
      veredictoV2: "apto",
      bloqueos: c.compliance.reglas.filter((r) => r.estado === "bloquea").map((r) => r.id),
      ajustes: c.compliance.reglas.filter((r) => r.estado === "ajustar").map((r) => r.id),
    },
    trazabilidad: {
      briefHash: firma(c.brief),
      version: 2,
      panelSintetico: { n: c.panelSegmento.length, intencionV1: prom(c.reacciones), intencionV2: prom(c.reaccionesV2) },
      envioAutomatico: false,
      ambiente: "deloitte-demo",
    },
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
      <div className="grid gap-4">
        <Panel
          titulo="Envío a Salesforce Marketing Cloud"
          acento={M.rojo}
          aside={<Chip color={M.alerta}>envío automático desactivado</Chip>}
        >
          {!listo && (
            <div style={{ fontSize: 12.5, color: M.gris, marginBottom: 12 }}>
              Vista previa del paquete del caso seleccionado. Reproduce el caso completo para verlo construirse paso a paso.
            </div>
          )}
          <pre className="font-mono" style={{ fontSize: 10.5, lineHeight: 1.7, overflowX: "auto", margin: 0 }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </Panel>
      </div>

      <div className="grid gap-4">
        <Panel titulo="Bitácora de la corrida" acento={M.tinta} aside={<Chip>{log.length} eventos</Chip>}>
          <Trazabilidad log={log} alto={330} />
        </Panel>

        <Panel titulo="Qué queda registrado">
          <Fila izq="Quién pidió qué" der="El brief original y su firma" />
          <Fila izq="Bajo qué regla" der={`Versión del set normativo aplicado (${SET_REGLAS})`} />
          <Fila izq="Qué se corrigió" der="Bloqueos y ajustes, con la regla que los originó" />
          <Fila izq="Qué se probó antes" der="Evaluación del panel sintético y objeciones recogidas" />
          <Fila izq="Qué cambió entre versiones" der="Diferencia v1 → v2 y su motivo" />
          <Fila izq="Qué se activó" der="Payload exacto entregado al motor de activación" />
          <div style={{ fontSize: 12.5, color: M.gris, marginTop: 14, lineHeight: 1.65 }}>
            Esta bitácora es la respuesta a la pregunta que hoy cuesta responder cuando llega una consulta de la CMF o
            del SERNAC seis meses después: por qué esta pieza decía esto, quién lo revisó y bajo qué criterio.
          </div>
        </Panel>

        <Panel titulo="Límite de la capa" acento={M.linea}>
          <Etiqueta>Hasta dónde llega</Etiqueta>
          <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.65, color: M.gris }}>
            La capa interpreta, genera, valida, compone y empaqueta. No envía, no administra audiencias, no mide. Eso
            sigue siendo Marketing Cloud, y los resultados de allá vuelven como aprendizaje sobre módulos y reglas.
          </div>
        </Panel>
      </div>
    </div>
  );
}

function prom(rs: any[]) {
  return Math.round(rs.reduce((a, r) => a + r.actua, 0) / rs.length);
}
