import React, { useState } from "react";
import { MARCA as M, SET_REGLAS } from "../datos/marca";
import { CASOS } from "../datos/casos";
import { useApp, firma } from "../estado/store";
import { Panel, Chip, Fila, Etiqueta, Metrica, Boton } from "../componentes/UI";
import { TiraMetricas, Anillo } from "../componentes/Animados";
import { CorreoEmulado, type Destino } from "../componentes/CorreoEmulado";
import { Trazabilidad } from "../componentes/Trazabilidad";
import { GraficoBiblioteca } from "../componentes/Graficos";
import { VistaCanales } from "../componentes/Previsualizaciones";
import { adaptacionesLocales } from "../lib/motorLocal";
import { medirPieza } from "../lib/legibilidad";
import { piezaAHtml, payloadSfmc, descargar, slug } from "../lib/exportar";
import { lista } from "../lib/motorLocal";

export default function Resultado() {
  const { casoId, log, biblioteca, corridas, libre, ultima, etapa } = useApp();
  const [correo, setCorreo] = useState<Destino | null>(null);
  const [enviados, setEnviados] = useState<Record<string, string>>({});
  const c = CASOS.find((x) => x.id === casoId)!;
  const modulos = biblioteca.filter((b) => b.tipo === "Módulo HTML");
  const reglasTono = biblioteca.filter((b) => b.tipo === "Regla de tono");
  const totalUsos = biblioteca.reduce((a, b) => a + (b.usos || 0), 0);
  const prom = (rs: any[]) => (rs?.length ? Math.round(rs.reduce((a, r) => a + r.actua, 0) / rs.length) : 0);

  const esLibre = ultima === "libre" && libre;
  const nadaCorrido = ultima === "caso" && etapa === 0 && corridas === 0;

  /* La sección refleja la corrida real: el caso reproducido o el caso libre ejecutado. */
  const pieza = esLibre ? libre!.pieza : c.piezaFinal;
  const imagen = esLibre ? libre!.imagen : c.imagenFinal;
  const nombre = esLibre ? `${lista(libre!.brief.productos)} · ${lista(libre!.brief.segmentos)}` : `${c.producto} · ${c.segmento}`;
  const origen = esLibre ? "Caso libre" : c.nombre;
  const modulosCorrida = esLibre ? libre!.modulos : c.modulos;
  const canalesCorrida: string[] = esLibre ? libre!.brief.canales : c.canal.split("+").map((x: string) => x.trim());

  const payload = esLibre
    ? payloadSfmc({
        clave: `coopeuch_${slug(lista(libre!.brief.productos))}_libre`,
        nombre,
        canal: libre!.brief.canales.map((x: string) => x.toLowerCase()).join("+"),
        pieza,
        segmentos: libre!.brief.segmentos,
        modulos: modulosCorrida.map((m: any) => m.id),
        veredicto: libre!.compliance.veredicto,
        panelN: libre!.ids.length,
        extra: { origen: "caso-libre" },
      })
    : {
        definitionKey: `coopeuch_${c.id.toLowerCase()}_${slug(c.producto)}_final`,
        assetType: { name: "htmlemail", id: 208 },
        name: nombre,
        channel: c.canal.toLowerCase().includes("push") ? "email+push" : "email",
        subjectLine: c.piezaFinal.asunto,
        preheader: c.piezaFinal.preheader,
        dataExtension: c.activacion.dataExtension,
        audienceFilter: { segmento: c.segmento, excluir: c.activacion.excluir },
        journey: { key: c.activacion.journey, entrySource: c.activacion.dataExtension, sendClassification: "Comercial" },
        sendWindow: c.activacion.ventana,
        personalizacion: c.activacion.personalizacion,
        modulos: c.modulos.map((m) => m.id),
        compliance: {
          reglaSetVersion: SET_REGLAS,
          veredictosVariantes: Object.fromEntries(c.variantes.map((v) => [v.id, v.veredicto])),
          veredictoFinal: "apto",
        },
        pruebaPrevia: {
          tipo: "panel sintético A/B/C", n: c.panelSegmento.length, ganadora: c.ganador,
          intencionGanadora: prom(c.reacciones[c.ganador]), intencionFinal: prom(c.reaccionesFinal),
        },
        legibilidad: { escala: "INFLESZ", indice: medirPieza(c.piezaFinal).total.ifsz, nivel: medirPieza(c.piezaFinal).total.nivel },
        trazabilidad: { briefHash: firma(c.brief), datosReales: false, conexionSistemas: false, ambiente: "deloitte-demo" },
      };

  const bitacora = esLibre && libre!.log?.length ? libre!.log : log;

  const descargarTodo = () => {
    const base = slug(pieza.titular);
    descargar(`${base}.html`, piezaAHtml(pieza, imagen), "text/html");
    setTimeout(() => descargar(`${base}-paquete.json`, JSON.stringify(payload, null, 2), "application/json"), 400);
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 xl:grid-cols-[260px_1fr] items-start">
        <Metrica etiqueta="Corrida en pantalla" valor={origen} sufijo="" color={M.rojo} />
        <TiraMetricas
          items={[
            { etiqueta: "Módulos en biblioteca", valor: modulos.length, color: M.tinta },
            { etiqueta: "Reglas de tono codificadas", valor: reglasTono.length, color: M.tinta },
            { etiqueta: "Reutilizaciones acumuladas", valor: totalUsos, color: M.ok },
            { etiqueta: "Corridas completadas", valor: corridas, color: M.alerta },
          ]}
        />
      </div>

      {nadaCorrido && (
        <Panel titulo="Sin corridas todavía" acento={M.alerta}>
          <div style={{ fontSize: 13, color: M.gris, lineHeight: 1.65 }}>
            Esta sección muestra el resultado de la última corrida real. Reproduzca un caso en la estación 01 o ejecute
            el caso libre en la 02 y vuelva acá: lo que se ve abajo es la vista previa del caso seleccionado.
          </div>
        </Panel>
      )}

      <div className="grid gap-4 xl:grid-cols-[420px_1fr_1fr] items-start">
        <div className="grid gap-2">
          <Etiqueta color={M.rojo}>Pieza activada · {origen}</Etiqueta>
          <VistaCanales
            pieza={pieza}
            imagen={imagen}
            adaptaciones={adaptacionesLocales(pieza, canalesCorrida)}
            canales={canalesCorrida}
          />
          <div className="flex gap-2 flex-wrap">
            <Boton onClick={descargarTodo} icono="↓">Descargar piezas</Boton>
            <Boton variante="secundario" onClick={() => descargar(`${slug(pieza.titular)}-paquete.json`, JSON.stringify(payload, null, 2), "application/json")}>
              Solo el paquete
            </Boton>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Boton variante="suave" icono="✉" onClick={() => setCorreo("negocio")}>Enviar a negocio</Boton>
            <Boton variante="suave" icono="§" onClick={() => setCorreo("legal")}>Revisión legal</Boton>
          </div>
          {(enviados.negocio || enviados.legal) && (
            <div className="flex gap-2 flex-wrap">
              {enviados.negocio && <Chip color={M.ok} punto>negocio notificado</Chip>}
              {enviados.legal && <Chip color={M.ok} punto>legal a la espera</Chip>}
            </div>
          )}
        </div>

        <Panel titulo="Paquete para Marketing Cloud" acento={M.rojo} aside={<Chip color={M.alerta}>data no real</Chip>}>
          <pre className="font-mono" style={{ fontSize: 10.5, lineHeight: 1.7, overflowX: "auto", margin: 0 }}>
            {JSON.stringify(payload, null, 2)}
          </pre>
        </Panel>

        <div className="grid gap-4">
          <Panel titulo="Bitácora de la corrida" acento={M.tinta} aside={<Chip>{bitacora.length} eventos</Chip>}>
            <Trazabilidad log={bitacora} alto={250} />
          </Panel>
          <Panel titulo="Qué queda registrado">
            <Fila izq="Quién pidió qué" der="El brief original y su firma" ancho={140} />
            <Fila izq="Bajo qué regla" der={`Set normativo aplicado (${SET_REGLAS})`} ancho={140} />
            <Fila izq="Qué se descartó" der={esLibre ? "Ediciones manuales y versión previa" : "Las variantes que no ganaron y por qué"} ancho={140} />
            <Fila izq="Qué se probó antes" der={esLibre ? "Panel del segmento sobre la pieza" : "Test A/B/C con el panel del segmento"} ancho={140} />
            <Fila izq="Qué tan legible es" der="Índice y nivel lector de la pieza activada" ancho={140} />
            <Fila izq="Qué se activó" der="Payload exacto entregado al motor" ancho={140} />
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr] items-start">
        <Panel titulo="La biblioteca de la cooperativa" acento={M.rojo} aside={<Chip>{biblioteca.length} elementos</Chip>}>
          <GraficoBiblioteca items={biblioteca} />
          <div style={{ fontSize: 12, color: M.gris, marginTop: 8, lineHeight: 1.6 }}>
            Cada corrida suma acá: los módulos reutilizados aumentan su contador y los nuevos entran a la biblioteca. Es
            el argumento del documento hecho contador.
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          <Panel titulo="Camino A · uso disperso" acento={M.linea}>
            <Fila izq="Cada pieza" der="Se genera desde cero con la herramienta que cada equipo tenga" ancho={92} />
            <Fila izq="El criterio" der="Vive en el prompt de una persona" ancho={92} />
            <Fila izq="Al terminar" der="Queda la pieza enviada. Nada más" ancho={92} />
          </Panel>
          <Panel titulo="Camino B · capacidad propia" acento={M.rojo}>
            <Fila izq="Cada pieza" der="Se compone con módulos que ya pasaron por revisión" ancho={92} />
            <Fila izq="El criterio" der="Vive en el set de reglas de la cooperativa, versionado" ancho={92} />
            <Fila izq="Al terminar" der="Queda la pieza, el módulo, la regla y el hallazgo" ancho={92} />
          </Panel>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 items-start">
        <Panel titulo="Lo que habría que medir en el trabajo conjunto" acento={M.alerta}>
          <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, marginBottom: 12 }}>
            El documento planteó cifras de referencia sin datos de Coopeuch. Estas son las que se levantarían primero
            para reemplazar la hipótesis por evidencia.
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div>
              <Fila izq="Tiempo por tramo" der="Del ciclo entre diseño, compliance y HTML" ancho={170} />
              <Fila izq="Iteraciones por pieza" der="Vueltas antes de una versión activable" ancho={170} />
              <Fila izq="Reutilización" der="Proporción armada con módulos existentes" ancho={170} />
            </div>
            <div>
              <Fila izq="Retrabajo por compliance" der="Ajustes que aparecen en la revisión final" ancho={190} />
              <Fila izq="Costo por pieza activable" der="Incluyendo esperas, no solo horas" ancho={190} />
              <Fila izq="Legibilidad del stock" der="Piezas vigentes en zona difícil" ancho={190} />
            </div>
          </div>
        </Panel>

        <CorreoEmulado
        abierto={correo !== null}
        destino={correo || "negocio"}
        datos={{
          variantes: [{ id: esLibre ? "libre" : "final", nombre: origen, pieza }],
          ganadora: esLibre ? "libre" : "final",
          reacciones: { [esLibre ? "libre" : "final"]: esLibre ? libre!.reacciones : c.reaccionesFinal },
          productos: esLibre ? libre!.brief.productos : [c.producto],
          segmentos: esLibre ? libre!.brief.segmentos : [c.segmento],
          canales: canalesCorrida,
          panelN: esLibre ? libre!.ids.length : c.panelSegmento.length,
          imagen,
        }}
        onCerrar={() => setCorreo(null)}
        onEnviado={(d, asunto) => setEnviados({ ...enviados, [d]: asunto })}
      />

      <Panel titulo="Hallazgos sobre el socio que dejaron los casos" acento={M.ok}>
          <div className="grid gap-2 md:grid-cols-3">
            {CASOS.map((x) => {
              const h = x.aprendizaje.find((a) => a.tipo === "Hallazgo de panel");
              return (
                <div key={x.id} style={{ border: `1px solid ${M.linea}`, padding: 12 }}>
                  <Etiqueta>{x.nombre}</Etiqueta>
                  <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.5 }}>{h?.nombre}</div>
                </div>
              );
            })}
          </div>
          {esLibre && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${M.linea}` }}>
              <Etiqueta color={M.rojo}>De la corrida libre</Etiqueta>
              <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.6 }}>
                {libre!.estrategia?.riesgo}
              </div>
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}
