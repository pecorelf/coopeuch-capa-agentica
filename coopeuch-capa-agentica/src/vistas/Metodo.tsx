import React, { useState } from "react";
import { MARCA as M } from "../datos/marca";
import { PERSONAS } from "../datos/personas";
import { Panel, Chip, Etiqueta, Barra } from "../componentes/UI";
import { Cascada, Anillo } from "../componentes/Animados";
import { BarraLegibilidad } from "../componentes/Graficos";
import { BANDAS } from "../lib/legibilidad";

const nivelDe = (n: string) => (n === "Alta" ? 100 : n === "Media" ? 60 : 25);

export default function Metodo() {
  const [sel, setSel] = useState<string | null>(null);
  const p = PERSONAS.find((x) => x.id === sel) || null;

  return (
    <div className="grid gap-4">
      {/* Panel completo, clickeable */}
      <Panel titulo="El panel de socios sintéticos" acento={M.rojo}
        aside={<Chip>{PERSONAS.length} socios · haga clic para ver el detalle</Chip>}>
        <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-5">
          <Cascada retardo={45}>
          {PERSONAS.map((x) => {
            const activo = sel === x.id;
            return (
              <button key={x.id} onClick={() => setSel(activo ? null : x.id)} className="text-left"
                style={{
                  border: `1px solid ${activo ? M.rojo : M.linea}`,
                  background: activo ? M.niebla : "#fff", padding: 12, cursor: "pointer",
                  borderRadius: 12, transition: "all .2s ease", height: "100%",
                }}>
                <div className="flex items-baseline justify-between gap-2">
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{x.nombre}</span>
                  <span className="font-mono" style={{ fontSize: 9.5, color: M.gris }}>{x.id}</span>
                </div>
                <div style={{ fontSize: 11.5, color: M.gris, marginTop: 2 }}>{x.edad} · {x.ciudad}</div>
                <div style={{ fontSize: 11.5, marginTop: 5, lineHeight: 1.4 }}>{x.perfil}</div>
                <div className="flex items-center gap-2 mt-3">
                  <Chip color={x.validez === "Alta" ? M.ok : x.validez === "Media" ? M.alerta : M.gris}>
                    validez {x.validez.toLowerCase()}
                  </Chip>
                  <span className="font-mono" style={{ fontSize: 9, color: M.gris }}>digital {x.digital.toLowerCase()}</span>
                </div>
              </button>
            );
          })}
          </Cascada>
        </div>
      </Panel>

      {/* Ficha de la persona seleccionada */}
      {p && (
        <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr] items-start entra">
          <Panel titulo={`${p.nombre} · ${p.edad} años · ${p.ciudad}`} acento={M.rojo}
            aside={<Chip color={p.validez === "Alta" ? M.ok : M.alerta}>validez {p.validez.toLowerCase()}</Chip>}>
            <div style={{ fontSize: 13.5, lineHeight: 1.7, marginBottom: 14 }}>{p.rasgo}</div>

            <Etiqueta color={M.tinta}>Qué representa en la base</Etiqueta>
            <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.6, color: M.gris, marginBottom: 14 }}>{p.representa}</div>

            <Etiqueta color={M.tinta}>Cómo lee un mensaje</Etiqueta>
            <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.6, color: M.gris, marginBottom: 14 }}>{p.comoLee}</div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Etiqueta>Antigüedad como socio</Etiqueta>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{p.antiguedad}</div>
              </div>
              <div>
                <Etiqueta>Uso digital</Etiqueta>
                <div style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>{p.digital}</div>
                <Barra valor={nivelDe(p.digital)} color={M.rojo} alto={3} />
              </div>
            </div>
          </Panel>

          <Panel titulo="Relación con la cooperativa">
            <Etiqueta color={M.tinta}>Productos que tiene</Etiqueta>
            <div className="flex flex-wrap gap-1 mt-2 mb-4">
              {p.productos.map((x) => <Chip key={x} color={M.rojo}>{x}</Chip>)}
            </div>
            <Etiqueta color={M.tinta}>Canales que usa</Etiqueta>
            <div className="flex flex-wrap gap-1 mt-2 mb-4">
              {p.canales.map((x) => <Chip key={x} color={M.gris}>{x}</Chip>)}
            </div>
            <Etiqueta color={M.tinta}>De dónde salen sus datos</Etiqueta>
            <div className="grid gap-1 mt-2">
              {p.fuentes.map((x) => (
                <div key={x} className="font-mono" style={{ fontSize: 10.5, color: M.gris, lineHeight: 1.6 }}>· {x}</div>
              ))}
            </div>
          </Panel>

          <Panel titulo="Qué lo mueve y qué lo frena">
            <Etiqueta color={M.ok}>Motivaciones</Etiqueta>
            <div className="grid gap-1 mt-2 mb-4">
              {p.motivaciones.map((x) => <div key={x} style={{ fontSize: 12.5, lineHeight: 1.5 }}>· {x}</div>)}
            </div>
            <Etiqueta color={M.falla}>Frenos</Etiqueta>
            <div className="grid gap-1 mt-2 mb-4">
              {p.frenos.map((x) => <div key={x} style={{ fontSize: 12.5, lineHeight: 1.5 }}>· {x}</div>)}
            </div>
            <Etiqueta color={M.alerta}>Sensible a</Etiqueta>
            <div className="flex flex-wrap gap-1 mt-2">
              {p.sensibilidades.map((x) => <Chip key={x} color={M.alerta}>{x}</Chip>)}
            </div>
          </Panel>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3 items-start">
        <Panel titulo="Cómo se construye un socio sintético" acento={M.rojo}>
          {[
            ["Anclaje", "Cada persona se construye desde una fuente identificable: base de socios, voz del socio, reclamos, estudios. Sin fuente, no entra al panel."],
            ["Composición", "Se combinan atributos observables (edad, producto, canal, región, antigüedad) con comportamiento declarado. No se inventan rasgos para que calcen con la campaña."],
            ["Validez", "Alta cuando hay datos propios suficientes; media cuando se apoya en estudios; baja cuando es exploratoria. La etiqueta viaja con cada respuesta."],
            ["Segmentación", "Solo responde el subconjunto que pertenece al segmento de la campaña. Consultar a todo el panel produce un promedio que no representa a nadie."],
            ["Qué mide la reacción", "El panel reacciona al texto, no al brief: pesa legibilidad, largo, si hay cifra concreta, si aparece el aviso antifraude, el encuadre cooperativo y el tipo de llamado a la acción. Por eso dos variantes distintas dan resultados distintos."],
            ["Triangulación", "Un hallazgo se toma en serio cuando coincide con datos reales de campaña o con investigación con socios. Mientras tanto, es una hipótesis ordenada."],
          ].map(([k, v]) => (
            <div key={k} className="mb-3">
              <Etiqueta color={M.tinta}>{k}</Etiqueta>
              <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.65, color: M.gris }}>{v}</div>
            </div>
          ))}
        </Panel>

        <Panel titulo="Qué no hace el panel" acento={M.alerta}>
          {[
            "No predice tasas de apertura reales. Ordena hipótesis antes de gastar audiencia.",
            "No reemplaza la investigación con socios ni las pruebas A/B en producción.",
            "No representa a socios individuales ni usa datos personales identificables.",
            "No decide. Entrega objeciones para que el equipo decida con más información.",
            "No sustituye a compliance: son dos filtros distintos y ninguno cubre al otro.",
          ].map((t, i) => <div key={i} style={{ fontSize: 12.5, lineHeight: 1.6, paddingBottom: 6 }}>· {t}</div>)}

          <div style={{ marginTop: 10, paddingTop: 12, borderTop: `1px solid ${M.linea}` }}>
            <Etiqueta color={M.tinta}>Dónde encaja Marketing Cloud</Etiqueta>
            <div style={{ fontSize: 12.5, color: M.gris, marginTop: 6, lineHeight: 1.6 }}>
              La capa interpreta, genera, valida, compone y empaqueta. No envía, no administra audiencias, no mide. Eso
              sigue siendo Marketing Cloud, y sus resultados vuelven como aprendizaje sobre módulos y reglas.
            </div>
          </div>
        </Panel>

        <Panel titulo="Comprensión del mensaje" acento={M.rojo}>
          <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, marginBottom: 14 }}>
            Una pieza puede cumplir todas las reglas y aun así no entenderse. La capa mide cada versión con el índice de
            Flesch-Szigriszt y lo interpreta con la escala INFLESZ, la validada para hábitos lectores en español.
          </div>

          <div className="grid gap-2 mb-4">
            {BANDAS.slice().reverse().map((x) => (
              <div key={x.nombre} className="flex items-center gap-3">
                <div style={{ width: 10, height: 10, background: x.color }} />
                <span style={{ fontSize: 12.5, fontWeight: 500, minWidth: 104 }}>{x.nombre}</span>
                <span className="font-mono" style={{ fontSize: 10.5, color: M.gris, minWidth: 56 }}>{x.desde}-{x.hasta}</span>
                <span style={{ fontSize: 11.5, color: M.gris }}>
                  {x.nombre === "Muy difícil" ? "universitario" :
                   x.nombre === "Algo difícil" ? "media superior o técnico" :
                   x.nombre === "Normal" ? "enseñanza media" :
                   x.nombre === "Bastante fácil" ? "básica 5º a 8º" : "básica 1º a 4º"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-3">
            <Anillo valor={72} etiqueta="OBJETIVO" color={M.ok} tam={72} />
            <div style={{ flex: 1 }}>
              <BarraLegibilidad valor={72} etiqueta="Zona objetivo para una base de 1,2 millones de socios" />
            </div>
          </div>

          <div style={{ fontSize: 12, color: M.gris, marginTop: 16, lineHeight: 1.65 }}>
            Por qué importa: la cooperativa atiende de Arica a Punta Arenas, con peso fuerte de pensionados y convenios.
            Escribir en zona difícil no es un problema de estilo, es dejar socios fuera. Y el bloque legal suele ser el
            que arrastra el índice hacia abajo, justo donde está lo que más se necesita entender.
          </div>
          <div style={{ fontSize: 11, color: M.gris, marginTop: 10, lineHeight: 1.55, borderTop: `1px solid ${M.niebla}`, paddingTop: 8 }}>
            Fuentes: Szigriszt-Pazos, F. (1993) · Fernández Huerta, J. (1959) · Barrio-Cantalejo, I. et al. (2008),
            validación de la escala INFLESZ, An Sist Sanit Navar 31(2). El conteo de sílabas es una aproximación por
            grupos vocálicos, suficiente para comparar piezas entre sí.
          </div>
        </Panel>
      </div>

      <Panel titulo="Qué es esta demo y qué no">
        <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.7, maxWidth: 1000 }}>
          Es una demo 100% funcional construida en ambiente Deloitte, con data no real y sin conexión a sistemas de
          Coopeuch. Está desarrollada en base a investigación interna e hipótesis: las reglas de compliance, los módulos
          y los perfiles del panel son una aproximación de trabajo que se reemplaza por los datos reales de la
          cooperativa en la primera etapa. Los tres casos están guionados para que la presentación sea reproducible; el
          caso libre genera en vivo.
        </div>
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${M.linea}` }} className="flex items-center gap-2">
          <div style={{ width: 8, height: 8, background: M.deloitte }} />
          <span className="font-mono" style={{ fontSize: 10, color: M.gris, letterSpacing: "0.08em" }}>
            DELOITTE DIGITAL · CUSTOMER STRATEGY &amp; DESIGN
          </span>
        </div>
      </Panel>
    </div>
  );
}
