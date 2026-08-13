import React, { useEffect, useRef, useState } from "react";
import { MARCA as M, SET_REGLAS } from "../datos/marca";
import { CASOS } from "../datos/casos";
import { regla } from "../datos/reglas";
import { persona } from "../datos/personas";
import { useApp, ETAPAS } from "../estado/store";
import { Panel, Etiqueta, Chip, Boton, Barra } from "../componentes/UI";
import { AgentePulso, Anillo, BarraComparada } from "../componentes/Animados";
import { PiezaEmail } from "../componentes/PiezaEmail";
import { VistaCanales } from "../componentes/Previsualizaciones";
import { adaptacionesLocales } from "../lib/motorLocal";
import { Trazabilidad } from "../componentes/Trazabilidad";
import { GraficoABC, RadarABC, GraficoAntesDespues, DonutCompliance, FichaLegibilidad } from "../componentes/Graficos";
import { medirPieza } from "../lib/legibilidad";

const colorEstado = (e: string) =>
  e === "cumple" ? M.ok : e === "ajustar" ? M.alerta : e === "bloquea" ? M.falla : M.gris;
const colorVeredicto = (v: string) => (v === "apto" ? M.ok : v === "no apto" ? M.falla : M.alerta);
const COLOR_VAR: Record<string, string> = { A: "#B9B3AE", B: "#E4032E", C: "#1F5F8B" };

export default function Casos() {
  const { casoId, elegirCaso, etapa, reproduciendo, alternar, avanzar, retroceder, reiniciar, velocidad, setVelocidad, log } = useApp();
  const c = CASOS.find((x) => x.id === casoId)!;
  const [t, setT] = useState(0);
  const [verTraza, setVerTraza] = useState(false);
  const ref = useRef(0);

  const duracion = etapa >= 1 && etapa <= ETAPAS.length ? ETAPAS[etapa - 1].duracion / velocidad : 0;

  useEffect(() => { setT(0); ref.current = 0; }, [etapa, casoId]);

  useEffect(() => {
    if (!reproduciendo) return;
    const id = window.setInterval(() => {
      ref.current += 120;
      setT(ref.current);
      if (etapa === 0 || ref.current >= duracion) { avanzar(); ref.current = 0; }
    }, 120);
    return () => window.clearInterval(id);
  }, [reproduciendo, etapa, duracion, avanzar]);

  const progreso = !reproduciendo ? 1 : duracion ? Math.min(1, t / duracion) : 0;
  const revelar = (total: number) => (reproduciendo ? Math.max(1, Math.ceil(progreso * total)) : total);
  const ganadora = c.variantes.find((v) => v.id === c.ganador)!;

  return (
    <div className="grid gap-4">
      {/* Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {CASOS.map((x, i) => {
          const activo = x.id === casoId;
          return (
            <button
              key={x.id}
              onClick={() => elegirCaso(x.id)}
              className="text-left"
              style={{
                background: activo ? "#fff" : "transparent",
                border: `1px solid ${activo ? M.rojo : M.linea}`,
                padding: "12px 14px", cursor: "pointer", borderRadius: 14,
                transition: "all .2s ease",
                boxShadow: activo ? "0 4px 16px -8px rgba(228,3,46,.4)" : "none",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono" style={{ fontSize: 9.5, color: activo ? M.rojo : M.gris }}>CASO {i + 1}</span>
                {x.variantes.some((v) => v.veredicto === "no apto") && <Chip color={M.falla}>compliance detiene</Chip>}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 3 }}>{x.nombre}</div>
              <div style={{ fontSize: 11, color: M.gris, marginTop: 2 }}>{x.segmento}</div>
            </button>
          );
        })}
      </div>

      {/* Barra de contexto + controles */}
      <div style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 14, overflow: "hidden" }}>
        <div className="flex items-center gap-3 flex-wrap px-4 py-3" style={{ borderBottom: `1px solid ${M.niebla}` }}>
          <Boton onClick={etapa >= ETAPAS.length ? reiniciar : alternar}>
            {etapa >= ETAPAS.length ? "Reproducir de nuevo" : reproduciendo ? "Pausar" : etapa === 0 ? "Reproducir" : "Continuar"}
          </Boton>
          <Boton variante="secundario" onClick={retroceder} disabled={etapa === 0}>Anterior</Boton>
          <Boton variante="secundario" onClick={avanzar} disabled={etapa >= ETAPAS.length}>Siguiente</Boton>
          <div className="flex items-center gap-1 ml-auto">
            {[1, 1.5, 2].map((v) => (
              <button
                key={v}
                onClick={() => setVelocidad(v)}
                className="font-mono"
                style={{
                  fontSize: 10, padding: "4px 10px", cursor: "pointer", borderRadius: 999,
                  background: velocidad === v ? `${M.rojo}0F` : "#fff",
                  border: `1px solid ${velocidad === v ? M.rojo : M.linea}`, color: velocidad === v ? M.rojo : M.gris,
                }}
              >{v}x</button>
            ))}
          </div>
        </div>

        <div className="flex gap-1 px-4 pt-3 pb-3">
          {ETAPAS.map((e, i) => {
            const hecha = etapa > i + 1;
            const actual = etapa === i + 1;
            return (
              <button
                key={e.id}
                onClick={() => useApp.setState({ etapa: i + 1, reproduciendo: false })}
                className="flex-1 text-left"
                style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
              >
                <Barra valor={hecha ? 100 : actual ? progreso * 100 : 0} color={actual ? M.rojo : M.ok} alto={3} />
                <div className="font-mono mt-1" style={{ fontSize: 9, color: actual ? M.rojo : hecha ? M.tinta : M.gris }}>
                  {e.agente} · {e.nombre}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ETAPA 0 · el caso */}
      {etapa === 0 && (
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] items-start">
          <Panel titulo="La solicitud que entra a la capa" acento={M.rojo}>
            <div style={{ fontSize: 14.5, lineHeight: 1.7, marginBottom: 14 }}>{c.brief}</div>
            <div style={{ borderLeft: `2px solid ${M.alerta}`, paddingLeft: 12 }}>
              <Etiqueta color={M.alerta}>Lo que puede salir mal</Etiqueta>
              <div style={{ fontSize: 12.5, marginTop: 5, lineHeight: 1.6 }}>{c.riesgo}</div>
            </div>
          </Panel>
          <Panel titulo="Contexto" aside={<Chip>{c.canal}</Chip>}>
            <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65 }}>{c.contexto}</div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {[["Producto", c.producto], ["Segmento", c.segmento], ["Objetivo", c.objetivo], ["Fuente", c.fuente]].map(([k, v]) => (
                <div key={k}>
                  <Etiqueta>{k}</Etiqueta>
                  <div style={{ fontSize: 12, marginTop: 2, lineHeight: 1.45 }}>{v}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {/* ETAPA 1 · estrategia */}
      {etapa === 1 && (
        <Panel titulo="A1 · Estrategia de campaña" acento={M.rojo}>
          <div className="grid gap-4 md:grid-cols-2">
            {[["Ángulo", c.estrategia.angulo], ["Promesa", c.estrategia.promesa], ["Riesgo declarado", c.estrategia.riesgo], ["KPI", c.estrategia.kpi]].map(
              ([k, v], i) => (
                <div key={k} style={{ opacity: revelar(4) > i ? 1 : 0.15, transition: "opacity .4s", borderLeft: `2px solid ${i === 2 ? M.alerta : M.linea}`, paddingLeft: 12 }}>
                  <Etiqueta color={M.tinta}>{k}</Etiqueta>
                  <div style={{ fontSize: 14, marginTop: 5, lineHeight: 1.6 }}>{v}</div>
                </div>
              )
            )}
          </div>
        </Panel>
      )}

      {/* ETAPA 2 · A/B/C */}
      {etapa === 2 && (
        <>
          <Panel titulo="A2 · Tres variantes, tres hipótesis" acento={M.rojo}>
            <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65 }}>
              No se escribe una pieza y se le buscan alternativas de estilo. Se escriben tres apuestas distintas sobre
              qué mueve a este segmento, para que después el panel las resuelva con evidencia. La ilustración de
              cabecera también la genera la capa, como vector.
            </div>
          </Panel>
          <div className="grid gap-3 lg:grid-cols-3 xl:gap-4">
            {c.variantes.slice(0, revelar(3)).map((v) => (
              <div key={v.id} className="entra grid gap-2">
                <div style={{ background: "#fff", border: `1px solid ${M.linea}`, borderTop: `3px solid ${COLOR_VAR[v.id]}`, padding: 12 }}>
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: COLOR_VAR[v.id] }}>{v.id}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v.nombre}</span>
                  </div>
                  <div style={{ fontSize: 12, color: M.gris, marginTop: 4, lineHeight: 1.5 }}>{v.hipotesis}</div>
                </div>
                <PiezaEmail pieza={v.pieza} version={v.id} imagen={v.imagen} compacta />
              </div>
            ))}
          </div>
        </>
      )}

      {/* ETAPA 3 · compliance */}
      {etapa === 3 && (
        <>
          <div className="grid gap-4 lg:grid-cols-[1fr_340px] items-start">
            <div className="grid gap-3">
              {c.variantes.slice(0, revelar(3)).map((v) => (
                <div key={v.id} className="entra" style={{ background: "#fff", border: `1px solid ${M.linea}`, borderLeft: `3px solid ${colorVeredicto(v.veredicto)}`, padding: 14, borderRadius: "0 14px 14px 0" }}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: COLOR_VAR[v.id] }}>{v.id}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{v.nombre}</span>
                    <Chip color={colorVeredicto(v.veredicto)}>{v.veredicto}</Chip>
                  </div>
                  <div className="grid gap-1 mt-3">
                    {v.hallazgos.map((h) => (
                      <div key={h.id} className="flex gap-3 items-baseline">
                        <span className="font-mono" style={{ fontSize: 10, color: colorEstado(h.estado), minWidth: 34 }}>{h.id}</span>
                        <span style={{ fontSize: 11.5, color: M.gris, minWidth: 190 }}>{regla(h.id).norma}</span>
                        <span className="font-mono" style={{ fontSize: 10, color: colorEstado(h.estado), minWidth: 56 }}>{h.estado}</span>
                        <span style={{ fontSize: 12 }}>{h.evidencia}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Panel titulo="Set de reglas" aside={<Chip>{SET_REGLAS}</Chip>}>
              <DonutCompliance reglas={c.variantes.flatMap((v) => v.hallazgos)} />
              <div style={{ fontSize: 11.5, color: M.gris, lineHeight: 1.55, marginTop: 6 }}>
                Ocho reglas cargadas. Se aplican durante la generación, no en una revisión posterior.
              </div>
            </Panel>
          </div>
          <Panel titulo="Lectura de compliance" acento={M.alerta}>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 980 }}>{c.notaCompliance}</div>
            <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.65, marginTop: 12, borderTop: `1px solid ${M.niebla}`, paddingTop: 10, maxWidth: 980 }}>
              En operación, estas obligaciones se le entregan al redactor antes de escribir y la pieza sale cumpliendo.
              El caso las muestra como veredicto para que se vea qué habría violado cada hipótesis si se hubiera escrito
              sin la capa: es exactamente el retrabajo que hoy aparece después de tres vueltas.
            </div>
          </Panel>
        </>
      )}

      {/* ETAPA 4 · panel A/B/C */}
      {etapa === 4 && (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Panel titulo="Test A/B/C con el panel del segmento" acento={M.rojo} aside={<Chip>n={c.panelSegmento.length}</Chip>}>
              <GraficoABC reacciones={c.reacciones} ganador={progreso > 0.6 ? c.ganador : undefined} />
            </Panel>
            <Panel titulo="Perfil de cada variante">
              <RadarABC reacciones={c.reacciones} />
            </Panel>
          </div>

          <Panel titulo="Intención de actuar, socio por socio">
            <div className="grid gap-1">
              <div className="flex gap-2 items-center" style={{ borderBottom: `1px solid ${M.linea}`, paddingBottom: 5 }}>
                <span style={{ fontSize: 11, color: M.gris, minWidth: 190 }} />
                {c.variantes.map((v) => (
                  <span key={v.id} className="font-mono text-center" style={{ fontSize: 10, color: COLOR_VAR[v.id], width: 78, fontWeight: 700 }}>
                    {v.id} {v.nombre}
                  </span>
                ))}
              </div>
              {c.panelSegmento.slice(0, revelar(c.panelSegmento.length)).map((id) => {
                const p = persona(id);
                const vals = c.variantes.map((v) => c.reacciones[v.id].find((x) => x.id === id)!.actua);
                const max = Math.max(...vals);
                return (
                  <div key={id} className="flex gap-2 items-center entra" style={{ borderBottom: `1px solid ${M.niebla}`, padding: "6px 0" }}>
                    <span style={{ fontSize: 12, minWidth: 190 }}>
                      <b>{p.nombre}</b> <span style={{ color: M.gris }}>· {p.edad} · {p.perfil.split(" · ")[0]}</span>
                    </span>
                    {vals.map((v, i) => (
                      <span key={i} className="text-center" style={{ width: 78 }}>
                        <span style={{ fontSize: 13, fontWeight: v === max ? 700 : 400, color: v === max ? M.tinta : M.gris }}>{v}%</span>
                        <Barra valor={v} color={v === max ? COLOR_VAR[c.variantes[i].id] : M.linea} alto={4} />
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          </Panel>

          {progreso > 0.75 && (
            <Panel titulo={`Gana la variante ${c.ganador} · ${ganadora.nombre}`} acento={M.rojo} clase="entra"
              aside={<Chip color={M.rojo}>mayor intención de actuar</Chip>}>
              <div style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 12 }}>{c.razonGanador}</div>
              <div className="grid gap-2 md:grid-cols-2">
                {c.panelSegmento.slice(0, 2).map((id) => {
                  const r = c.reacciones[c.ganador].find((x) => x.id === id)!;
                  return (
                    <div key={id} style={{ borderLeft: `2px solid ${M.linea}`, paddingLeft: 12 }}>
                      <div style={{ fontSize: 12.5, fontStyle: "italic", lineHeight: 1.55 }}>«{r.frase}»</div>
                      <div style={{ fontSize: 11, color: M.gris, marginTop: 3 }}>{persona(id).nombre} · objeción: {r.objecion}</div>
                    </div>
                  );
                })}
              </div>
            </Panel>
          )}
        </>
      )}

      {/* ETAPA 5 · refinamiento */}
      {etapa === 5 && (
        <>
          <div className="grid gap-4 lg:grid-cols-2 items-start">
            <div className="grid gap-2">
              <Etiqueta>Variante ganadora · {c.ganador}</Etiqueta>
              <PiezaEmail pieza={ganadora.pieza} version={c.ganador} imagen={ganadora.imagen} compacta />
            </div>
            <div className="grid gap-2">
              <Etiqueta color={M.rojo}>Pieza final · como la recibe el socio</Etiqueta>
              <VistaCanales
                pieza={c.piezaFinal}
                imagen={c.imagenFinal}
                adaptaciones={adaptacionesLocales(c.piezaFinal, c.canal.split("+").map((x) => x.trim()))}
                canales={c.canal.split("+").map((x) => x.trim())}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2 items-start">
            <Panel titulo="Qué cambió y por qué" acento={M.ok}>
              {c.cambios.slice(0, revelar(c.cambios.length)).map((x, i) => (
                <div key={i} className="flex gap-2 py-1 entra" style={{ fontSize: 12.5, lineHeight: 1.55 }}>
                  <span className="font-mono" style={{ color: M.ok, fontSize: 10, minWidth: 18 }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{x}</span>
                </div>
              ))}
            </Panel>

            <Panel titulo="Comprensión del mensaje" acento={M.tinta} aside={<Chip>escala INFLESZ</Chip>}>
              <div className="flex items-center gap-4 mb-4">
                <Anillo valor={medirPieza(c.piezaFinal).total.ifsz} etiqueta="FINAL" color={medirPieza(c.piezaFinal).total.color} tam={78} />
                <Anillo valor={medirPieza(ganadora.pieza).total.ifsz} etiqueta="ANTES" color={M.gris} tam={62} grosor={6} />
                <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.6, flex: 1 }}>
                  El refinamiento sube la comprensión sin quitar ningún dato exigido.
                </div>
              </div>
              <FichaLegibilidad
                l={medirPieza(c.piezaFinal).total}
                titulo="Pieza final"
                comparar={medirPieza(ganadora.pieza).total.ifsz}
              />
              <div style={{ fontSize: 11.5, color: M.gris, marginTop: 10, lineHeight: 1.55 }}>
                La marca gris es la variante ganadora antes del refinamiento. Con más de 1,2 millones de socios de Arica
                a Punta Arenas, una pieza que exige nivel universitario para entenderse deja gente fuera.
              </div>
            </Panel>
          </div>

          <Panel titulo="El panel vuelve a evaluar" acento={M.rojo}>
            <GraficoAntesDespues antes={c.reacciones[c.ganador]} despues={c.reaccionesFinal} />
          </Panel>
        </>
      )}

      {/* ETAPA 6 · activación */}
      {etapa === 6 && (
        <>
          <div className="grid gap-4 lg:grid-cols-[1fr_1fr] items-start">
            <Panel titulo="A5 · Paquete para Salesforce Marketing Cloud" acento={M.rojo}>
              <div className="grid gap-1">
                {[
                  ["Data Extension", c.activacion.dataExtension],
                  ["Journey", c.activacion.journey],
                  ["Personalización", c.activacion.personalizacion.join(" · ")],
                  ["Exclusiones", c.activacion.excluir.join(" · ")],
                  ["Ventana sugerida", c.activacion.ventana],
                  ["Versión activada", `final, sobre la variante ${c.ganador}`],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-3 items-baseline py-1" style={{ borderBottom: `1px solid ${M.niebla}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, minWidth: 128 }}>{k}</span>
                    <span style={{ fontSize: 11.5, color: M.gris }}>{v}</span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel titulo="Compliance de la pieza final" acento={M.ok}>
              <div className="grid gap-1">
                {c.reglasFinal.map((r) => (
                  <div key={r.id} className="flex gap-2 items-baseline" style={{ borderBottom: `1px solid ${M.niebla}`, padding: "3px 0" }}>
                    <span className="font-mono" style={{ fontSize: 10, color: colorEstado(r.estado), minWidth: 34 }}>{r.id}</span>
                    <span style={{ fontSize: 11, color: M.gris, minWidth: 176 }}>{regla(r.id).norma}</span>
                    <span className="font-mono" style={{ fontSize: 9.5, color: colorEstado(r.estado) }}>{r.estado}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          <Panel titulo="Lo que queda en la cooperativa después de esta campaña" acento={M.ok}>
            <div className="grid gap-2 md:grid-cols-3">
              {c.aprendizaje.map((a, i) => (
                <div key={i} style={{ border: `1px solid ${M.linea}`, padding: 12 }}>
                  <Chip color={M.ok}>{a.tipo}</Chip>
                  <div style={{ fontSize: 12.5, marginTop: 7, lineHeight: 1.5 }}>{a.nombre}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: M.gris, marginTop: 14, lineHeight: 1.65 }}>
              En el Camino A, al terminar queda la pieza enviada. Acá queda además un módulo, una regla mejor escrita y
              un hallazgo sobre el socio que la próxima campaña ya trae puesto.
            </div>
          </Panel>
        </>
      )}

      {/* Trazabilidad plegable */}
      <div style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 14, overflow: "hidden" }}>
        <button
          onClick={() => setVerTraza(!verTraza)}
          className="w-full flex items-center justify-between px-4 py-2"
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
        >
          <Etiqueta color={M.tinta}>Cinta de trazabilidad · {log.length} eventos</Etiqueta>
          <span className="font-mono" style={{ fontSize: 10, color: M.gris }}>{verTraza ? "ocultar" : "ver"}</span>
        </button>
        {verTraza && <div className="px-4 pb-4"><Trazabilidad log={log} alto={220} /></div>}
      </div>
    </div>
  );
}
