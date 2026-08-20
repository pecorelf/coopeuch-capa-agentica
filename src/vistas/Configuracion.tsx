import React from "react";
import { MARCA as M, SET_REGLAS } from "../datos/marca";
import { Panel, Etiqueta, Chip, Boton, Campo, Barra } from "../componentes/UI";
import { Anillo, Cascada } from "../componentes/Animados";
import { useConfig, FUENTES_CATALOGO } from "../estado/config";
import { useSesion } from "../estado/sesion";

/* Configuración de la capa. En la demo las conexiones son simuladas: el punto es
   mostrar de qué se alimenta la capacidad y qué falta conectar para que deje de
   ser una aproximación. */

const colorEstado = (e: string) => (e === "conectada" ? M.ok : e === "parcial" ? M.alerta : M.gris);

export default function Configuracion() {
  const c = useConfig();
  const inst = useSesion((s) => s.inst);
  const conectadas = c.fuentes.filter((f) => f.estado === "conectada").length;
  const parciales = c.fuentes.filter((f) => f.estado === "parcial").length;
  const cobertura = Math.round(((conectadas + parciales * 0.5) / c.fuentes.length) * 100);

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 xl:grid-cols-[300px_1fr] items-start">
        <Panel titulo="Cobertura de fuentes" acento={M.rojo}>
          <div className="flex items-center gap-4">
            <Anillo valor={cobertura} sufijo="%" etiqueta="COBERTURA" color={cobertura >= 60 ? M.ok : M.alerta} />
            <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.6 }}>
              {conectadas} {conectadas === 1 ? "fuente conectada" : "fuentes conectadas"}, {parciales} parcial
              {parciales === 1 ? "" : "es"} y {c.fuentes.length - conectadas - parciales} pendientes.
            </div>
          </div>
          <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.65, marginTop: 14, borderTop: `1px solid ${M.niebla}`, paddingTop: 12 }}>
            Mientras la cobertura sea parcial, lo que produce la capa es una aproximación de trabajo. La primera etapa
            del proyecto es justamente cerrar esta brecha: sin base de socios real, el panel es una hipótesis ordenada;
            sin el set normativo de la cooperativa, compliance opera con una aproximación.
          </div>
        </Panel>

        <Panel titulo="Fuentes conectadas" acento={M.rojo}
          aside={<Chip color={M.alerta} punto>conexiones simuladas en esta demo</Chip>}>
          <div className="grid gap-2 md:grid-cols-2">
            <Cascada retardo={50}>
              {c.fuentes.map((f) => (
                <div key={f.id} style={{ border: `1px solid ${M.linea}`, borderRadius: 12, padding: 13, height: "100%" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span style={{ fontSize: 15 }}>{f.icono}</span>
                      <span style={{ fontSize: 12.5, fontWeight: 600 }}>{f.nombre}</span>
                    </div>
                    <Chip color={colorEstado(f.estado)} punto>{f.estado}</Chip>
                  </div>
                  <div style={{ fontSize: 11.5, color: M.gris, marginTop: 6, lineHeight: 1.5 }}>{f.alimenta}</div>
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <span className="font-mono" style={{ fontSize: 9.5, color: M.gris }}>{f.sistema}</span>
                    <Boton
                      tam="chico"
                      variante={f.estado === "pendiente" ? "secundario" : "fantasma"}
                      onClick={() => c.alternarFuente(f.id)}
                    >
                      {f.estado === "pendiente" ? "Conectar" : "Desconectar"}
                    </Boton>
                  </div>
                </div>
              ))}
            </Cascada>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-3 items-start">
        <Panel titulo={`Contexto de marca · ${inst.nombre}`} acento={M.rojo}>
          <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.6, marginBottom: 12 }}>
            Este texto viaja en cada llamada a los agentes. Es lo que hace que la pieza suene a {inst.nombre} y no a una
            institución genérica.
          </div>
          <Campo etiqueta="Quién es la cooperativa" valor={c.contexto} onChange={c.setContexto} filas={7} />
          <Campo etiqueta="Cómo se le habla al socio" valor={c.voz} onChange={c.setVoz} filas={5}
            ayuda="Reglas de tono que el redactor aplica siempre." />
        </Panel>

        <Panel titulo="Brand book" acento={M.rojo}
          aside={<Chip color={M.alerta}>versión de trabajo</Chip>}>
          <div style={{ fontSize: 11.5, color: M.gris, lineHeight: 1.55, marginBottom: 12 }}>
            Los valores vienen del preset de {inst.nombre}. Se editan por institución en /admin.
          </div>
          <Etiqueta color={M.tinta}>Paleta</Etiqueta>
          <div className="flex flex-wrap gap-2 mt-2 mb-4">
            {[[`Principal ${inst.nombre}`, M.rojo], ["Rojo oscuro", M.rojoOsc], ["Tinta", M.tinta], ["Neutro", M.linea], ["Fondo", M.niebla]].map(([n, col]) => (
              <div key={n as string} className="flex items-center gap-2" style={{ background: M.niebla, borderRadius: 999, padding: "4px 11px 4px 4px" }}>
                <span style={{ width: 20, height: 20, borderRadius: 999, background: col as string, border: `1px solid ${M.linea}` }} />
                <span style={{ fontSize: 11 }}>{n}</span>
                <span className="font-mono" style={{ fontSize: 9.5, color: M.gris }}>{col}</span>
              </div>
            ))}
          </div>

          <Etiqueta color={M.tinta}>Tipografía</Etiqueta>
          <div style={{ fontSize: 12.5, marginTop: 5, marginBottom: 14, lineHeight: 1.6 }}>
            Poppins para interfaz y piezas. Se reemplaza por la tipografía corporativa cuando esté disponible.
          </div>

          <Etiqueta color={M.tinta}>Palabras que no se usan</Etiqueta>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {c.vetadas.map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5"
                style={{ fontSize: 11.5, background: `${M.falla}0F`, color: M.falla, border: `1px solid ${M.falla}2E`, borderRadius: 999, padding: "3px 9px" }}>
                {p}
                <button onClick={() => c.quitarVetada(p)} style={{ background: "none", border: "none", cursor: "pointer", color: M.falla, fontSize: 13, lineHeight: 1, padding: 0 }}>×</button>
              </span>
            ))}
          </div>
          <div className="mt-2">
            <input
              placeholder="Agregar palabra y Enter"
              className="campo w-full"
              style={{ fontSize: 12, padding: "7px 10px", border: `1px solid ${M.linea}`, borderRadius: 10 }}
              onKeyDown={(e: any) => { if (e.key === "Enter" && e.target.value.trim()) { c.agregarVetada(e.target.value.trim()); e.target.value = ""; } }}
            />
          </div>
        </Panel>

        <Panel titulo="Fuentes de imagen" acento={M.rojo}>
          <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.6, marginBottom: 12 }}>
            De dónde salen las ilustraciones de las piezas. Hoy la capa las genera como vector con dirección de arte
            propia; conectar un banco de imágenes o el archivo fotográfico de la cooperativa es una decisión abierta.
          </div>
          {c.imagenes.map((o) => (
            <button key={o.id} onClick={() => c.setFuenteImagen(o.id)} className="w-full text-left"
              style={{
                border: `1px solid ${c.fuenteImagen === o.id ? M.rojo : M.linea}`,
                background: c.fuenteImagen === o.id ? `${M.rojo}08` : "#fff",
                borderRadius: 12, padding: 12, marginBottom: 8, cursor: "pointer", transition: "all .2s ease",
              }}>
              <div className="flex items-center gap-2">
                <span style={{
                  width: 15, height: 15, borderRadius: 999, flexShrink: 0,
                  border: `2px solid ${c.fuenteImagen === o.id ? M.rojo : M.linea}`,
                  background: c.fuenteImagen === o.id ? M.rojo : "transparent",
                  boxShadow: c.fuenteImagen === o.id ? `inset 0 0 0 2.5px #fff` : "none",
                }} />
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{o.nombre}</span>
                {o.estado && <Chip color={o.estado === "activa" ? M.ok : M.gris}>{o.estado}</Chip>}
              </div>
              <div style={{ fontSize: 11.5, color: M.gris, marginTop: 5, lineHeight: 1.5, paddingLeft: 23 }}>{o.detalle}</div>
            </button>
          ))}
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 items-start">
        <Panel titulo="Set de reglas" acento={M.ok} aside={<Chip color={M.ok}>{SET_REGLAS}</Chip>}>
          <div className="grid gap-2">
            {[
              ["Origen", "Aproximación de trabajo construida con normativa pública chilena"],
              ["Alcance", "8 reglas: CMF, SERNAC Financiero, Ley 20.009, CAE y marca"],
              ["Aplicación", "Durante la generación, no en revisión posterior"],
              ["Versionado", "Cada corrida registra la versión del set que aplicó"],
              ["Pendiente", "Reemplazar por el set normativo de la cooperativa y su matriz de riesgo"],
            ].map(([k, v]) => (
              <div key={k} className="flex gap-3 items-baseline py-1.5" style={{ borderBottom: `1px solid ${M.niebla}` }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, minWidth: 100 }}>{k}</span>
                <span style={{ fontSize: 12, color: k === "Pendiente" ? M.alerta : M.gris }}>{v}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel titulo="Umbral de comprensión" acento={M.rojo}>
          <div style={{ fontSize: 12, color: M.gris, lineHeight: 1.6, marginBottom: 14 }}>
            Rango de legibilidad que la capa persigue en toda pieza. Con una base de más de 1,2 millones de socios de
            Arica a Punta Arenas, escribir por debajo de este piso equivale a dejar gente fuera.
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Anillo valor={c.objetivoMin} etiqueta="MÍNIMO" color={M.ok} tam={80} />
            <div style={{ flex: 1 }}>
              <Etiqueta>Piso aceptable</Etiqueta>
              <input
                type="range" min={40} max={85} value={c.objetivoMin}
                onChange={(e) => c.setObjetivo(Number(e.target.value))}
                style={{ width: "100%", accentColor: M.rojo, marginTop: 8 }}
              />
              <div className="flex justify-between font-mono" style={{ fontSize: 9.5, color: M.gris, marginTop: 2 }}>
                <span>40 · muy difícil</span><span>85 · muy fácil</span>
              </div>
              <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.55 }}>
                Nivel lector objetivo: <b>{c.objetivoMin >= 80 ? "básica 1º a 4º" : c.objetivoMin >= 65 ? "básica 5º a 8º" : c.objetivoMin >= 55 ? "enseñanza media" : "media superior o técnico"}</b>
              </div>
            </div>
          </div>
          <Barra valor={c.objetivoMin} color={c.objetivoMin >= 65 ? M.ok : M.alerta} alto={6} />
        </Panel>
      </div>

      <Panel titulo="Pendientes para operar con datos reales" acento={M.alerta}>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            ["Base de socios", "Reconstruir el panel con anclaje verificable en datos propios, no en arquetipos."],
            ["Set normativo real", "Reemplazar las 8 reglas de trabajo por la matriz de la cooperativa."],
            ["Inventario de módulos", "Levantar los templates y bloques que ya viven en Marketing Cloud."],
            ["Línea base de tiempos", "Medir el ciclo actual por tramo para reemplazar la hipótesis del documento."],
          ].map(([k, v]) => (
            <div key={k} style={{ border: `1px solid ${M.linea}`, borderRadius: 12, padding: 13 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 11.5, color: M.gris, marginTop: 5, lineHeight: 1.55 }}>{v}</div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
