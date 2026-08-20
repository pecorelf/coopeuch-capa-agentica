import React, { useMemo, useState } from "react";
import { MARCA as M } from "../datos/marca";
import { FORMATOS, PLATAFORMAS, SELECCION_BASE, esfuerzoManual, formato as buscarFormato, type Formato } from "../datos/formatos";
import { ESQUEMAS, adaptar, esquemaSugerido, esquema as buscarEsquema } from "../lib/layouts";
import { CASOS } from "../datos/casos";
import { PERSONAS as PERSONAS_BASE, persona } from "../datos/personas";
import { adaptarPersonas } from "../datos/instituciones";
import { useSesion } from "../estado/sesion";
import { useApp } from "../estado/store";
import { Panel, Etiqueta, Chip, Boton, Barra, Fila } from "../componentes/UI";
import { PiezaFormato } from "../componentes/PiezaFormato";
import { Contador, Anillo, Cascada, BarraComparada, Progresion } from "../componentes/Animados";
import { medirPieza } from "../lib/legibilidad";
import { piezaAHtml, descargar, slug } from "../lib/exportar";
import type { Pieza } from "../lib/tipos";

/* Producción multiformato.
   Una campaña no son tres correos: son las veinte piezas que hoy se adaptan a
   mano, cada una con su recorte, su jerarquía y su límite de caracteres. Esta
   sección toma la pieza aprobada y la despliega en todos los formatos, marcando
   qué se ajustó y dónde la regla obliga a sacar la cifra. */

const PASOS_SINCRONIA = [
  "Generando piezas por formato",
  "Aplicando reglas de estructura de marca",
  "Verificando condiciones por formato",
  "Empaquetando por plataforma",
  "Sincronizando audiencias",
];

export default function Produccion() {
  const inst = useSesion((s) => s.inst);
  const { casoId, libre, ultima } = useApp();
  const PERSONAS = adaptarPersonas(PERSONAS_BASE, inst);

  const caso = CASOS.find((x) => x.id === casoId)!;
  const esLibre = ultima === "libre" && libre;
  const piezaBase: Pieza = esLibre ? libre!.pieza : caso.piezaFinal;
  const imagen = esLibre ? libre!.imagen : caso.imagenFinal;
  const nombreCampana = esLibre
    ? `${libre!.brief.productos.join(", ")}`
    : `${caso.producto}`;

  const [seleccion, setSeleccion] = useState<string[]>(SELECCION_BASE);
  const [esquemaGlobal, setEsquemaGlobal] = useState<string>("auto");
  const [detalle, setDetalle] = useState<string | null>(null);
  const [sincronia, setSincronia] = useState(-1);
  const [pestaña, setPestaña] = useState<"grilla" | "test" | "ciclo">("grilla");

  const tieneLegal = Boolean(piezaBase.legal);

  const esquemaDe = (f: Formato) =>
    esquemaGlobal === "auto" ? esquemaSugerido(f, tieneLegal) : esquemaGlobal;

  const piezas = useMemo(
    () => seleccion.map((id) => {
      const f = buscarFormato(id);
      const esq = buscarEsquema(esquemaDe(f));
      return { f, esq, a: adaptar(piezaBase, f, esq) };
    }),
    [seleccion, esquemaGlobal, piezaBase, tieneLegal]
  );

  const alertas = piezas.filter((p) => p.a.alertas.length > 0);
  const conCondicion = piezas.filter((p) => p.a.condiciones.length > 0);
  const minutos = esfuerzoManual(seleccion);
  const horas = Math.round((minutos / 60) * 10) / 10;

  const alternarFormato = (id: string) =>
    setSeleccion((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const alternarPlataforma = (p: string) => {
    const ids = FORMATOS.filter((f) => f.plataforma === p).map((f) => f.id);
    const todos = ids.every((i) => seleccion.includes(i));
    setSeleccion((s) => (todos ? s.filter((x) => !ids.includes(x)) : [...new Set([...s, ...ids])]));
  };

  const sincronizar = async () => {
    for (let i = 0; i < PASOS_SINCRONIA.length; i++) {
      setSincronia(i);
      await new Promise((r) => setTimeout(r, 620));
    }
    setSincronia(PASOS_SINCRONIA.length);
  };

  const descargarLote = () => {
    descargar(`${slug(nombreCampana)}-email.html`, piezaAHtml(piezaBase, imagen), "text/html");
    setTimeout(() => {
      const manifiesto = {
        campana: nombreCampana,
        institucion: inst.nombre,
        formatos: piezas.map((p) => ({
          id: p.f.id, nombre: p.f.nombre, plataforma: p.f.plataforma,
          dimensiones: `${p.f.w}x${p.f.h}`, esquema: p.esq.nombre,
          titular: p.a.titular, cuerpo: p.a.cuerpo, cta: p.a.cta,
          condicionesEnPieza: Boolean(p.a.legal),
          ajustes: p.a.ajustes, condiciones: p.a.condiciones, alertas: p.a.alertas,
        })),
      };
      descargar(`${slug(nombreCampana)}-formatos.json`, JSON.stringify(manifiesto, null, 2), "application/json");
    }, 400);
  };

  /* Test de diseño: el panel evalúa esquemas, no textos. */
  const testDiseno = useMemo(() => {
    const idsPanel = esLibre ? libre!.ids : caso.panelSegmento;
    return ESQUEMAS.map((e) => {
      const f = buscarFormato("meta-feed");
      const a = adaptar(piezaBase, f, e);
      const leg = medirPieza({ ...piezaBase, titular: a.titular, cuerpo: [a.cuerpo] }).total;
      /* Reglas de atención por esquema y perfil: los perfiles digitales
         responden a la imagen; los que buscan la cifra, al texto. */
      const porPersona = idsPanel.map((id: string) => {
        const p = PERSONAS.find((x) => x.id === id) || persona(id);
        let v = 42;
        if (e.imagenDominante) v += p.digital === "Alta" ? 16 : p.digital === "Baja" ? -12 : 2;
        if (e.id === "texto") v += p.digital === "Baja" ? 14 : -4;
        if (e.id === "franja") v += 4;
        if (e.id === "texto" && leg.ifsz >= 65) v += 6;
        if (e.imagenDominante && tieneLegal) v -= 8;
        return { id, nombre: p.nombre, valor: Math.max(6, Math.min(88, v)) };
      });
      const prom = Math.round(porPersona.reduce((a2, x) => a2 + x.valor, 0) / porPersona.length);
      return { esquema: e, prom, porPersona, legibilidad: leg.ifsz };
    });
  }, [piezaBase, esLibre, casoId, tieneLegal]);

  const ganadorDiseno = testDiseno.reduce((a, b) => (b.prom > a.prom ? b : a), testDiseno[0]);

  return (
    <div className="grid gap-4">
      {/* Encabezado */}
      <div className="grid gap-3 xl:grid-cols-[1fr_auto] items-start">
        <Panel titulo="Campaña en producción" acento={M.rojo}
          aside={<Chip color={M.gris}>{esLibre ? "caso custom" : caso.nombre}</Chip>}>
          <div className="flex items-start gap-5 flex-wrap">
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{piezaBase.titular}</div>
              <div style={{ fontSize: 12.5, color: M.gris, marginTop: 5, lineHeight: 1.6 }}>
                {nombreCampana} · {inst.nombre}
                {tieneLegal && " · la pieza lleva condiciones, lo que restringe los formatos disponibles"}
              </div>
            </div>
            <div className="flex gap-5">
              <div>
                <Etiqueta>Piezas a producir</Etiqueta>
                <Contador hasta={seleccion.length} tam={28} />
              </div>
              <div>
                <Etiqueta>Esfuerzo manual estimado</Etiqueta>
                <Contador hasta={horas} sufijo=" h" decimales={1} tam={28} color={M.alerta} />
              </div>
              <div>
                <Etiqueta>Formatos bloqueados</Etiqueta>
                <Contador hasta={alertas.length} tam={28} color={alertas.length ? M.falla : M.ok} />
              </div>
              <div>
                <Etiqueta>Con versión sin cifras</Etiqueta>
                <Contador hasta={conCondicion.length} tam={28} color={M.alerta} />
              </div>
            </div>
          </div>
        </Panel>

        <Panel titulo="Esquema de diseño">
          <div className="flex gap-1 flex-wrap">
            {[{ id: "auto", nombre: "Automático" }, ...ESQUEMAS].map((e) => (
              <button key={e.id} onClick={() => setEsquemaGlobal(e.id)}
                style={{
                  fontSize: 11.5, padding: "6px 12px", borderRadius: 999, cursor: "pointer",
                  border: `1px solid ${esquemaGlobal === e.id ? M.rojo : M.linea}`,
                  background: esquemaGlobal === e.id ? M.rojo : "#fff",
                  color: esquemaGlobal === e.id ? "#fff" : M.tinta,
                }}>{e.nombre}</button>
            ))}
          </div>
          <div style={{ fontSize: 11.5, color: M.gris, marginTop: 9, lineHeight: 1.55, maxWidth: 330 }}>
            {esquemaGlobal === "auto"
              ? "Cada formato toma el esquema que le corresponde: imagen dominante en social, texto dominante donde hay condiciones o poco espacio."
              : buscarEsquema(esquemaGlobal).descripcion}
          </div>
        </Panel>
      </div>

      {/* Pestañas */}
      <div className="flex gap-1 flex-wrap">
        {([["grilla", "Piezas por formato"], ["test", "Test de diseño"], ["ciclo", "Ciclo de aprendizaje"]] as const).map(([id, n]) => (
          <button key={id} onClick={() => setPestaña(id)}
            style={{
              fontSize: 12.5, padding: "8px 16px", borderRadius: 999, cursor: "pointer", fontWeight: 600,
              border: `1px solid ${pestaña === id ? M.rojo : M.linea}`,
              background: pestaña === id ? `${M.rojo}0F` : "#fff",
              color: pestaña === id ? M.rojo : M.tinta,
            }}>{n}</button>
        ))}
      </div>

      {/* ---------- Grilla de formatos ---------- */}
      {pestaña === "grilla" && (
        <>
          <Panel titulo="Formatos de la campaña" aside={<Chip>{seleccion.length} de {FORMATOS.length}</Chip>}>
            <div className="flex flex-wrap gap-2">
              {PLATAFORMAS.map((p) => {
                const ids = FORMATOS.filter((f) => f.plataforma === p.id).map((f) => f.id);
                const activos = ids.filter((i) => seleccion.includes(i)).length;
                return (
                  <button key={p.id} onClick={() => alternarPlataforma(p.id)}
                    className="flex items-center gap-2"
                    style={{
                      fontSize: 11.5, padding: "6px 12px", borderRadius: 999, cursor: "pointer",
                      border: `1px solid ${activos ? p.color : M.linea}`,
                      background: activos ? `${p.color}12` : "#fff", color: activos ? p.color : M.gris,
                    }}>
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: activos ? p.color : M.linea }} />
                    {p.nombre}
                    <span className="font-mono" style={{ fontSize: 9.5 }}>{activos}/{ids.length}</span>
                  </button>
                );
              })}
            </div>
          </Panel>

          {(alertas.length > 0 || conCondicion.length > 0) && (
            <Panel titulo="Restricciones por formato" acento={alertas.length ? M.falla : M.alerta}
              aside={<>
                {alertas.length > 0 && <Chip color={M.falla} punto>{alertas.length} bloqueados</Chip>}
                {conCondicion.length > 0 && <Chip color={M.alerta} punto>{conCondicion.length} con condición</Chip>}
              </>}>
              {conCondicion.length > 0 && (
                <div style={{ fontSize: 12.5, lineHeight: 1.65, marginBottom: 12, padding: 11, background: `${M.alerta}0D`, borderRadius: 10 }}>
                  <b>{conCondicion.length} formatos</b> no pueden mostrar el bloque de condiciones. La capa genera para
                  ellos una versión sin cifras, con enlace a las condiciones completas. Es la regla que hoy se descubre
                  cuando legal revisa la pieza ya diseñada.
                </div>
              )}
              <div className="grid gap-2">
                {alertas.map((p) => (
                  <div key={p.f.id} className="flex gap-3 items-baseline py-1.5" style={{ borderBottom: `1px solid ${M.niebla}` }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, minWidth: 160 }}>{p.f.nombre}</span>
                    <span style={{ fontSize: 12, color: M.falla, lineHeight: 1.55 }}>{p.a.alertas[0]}</span>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            <Cascada retardo={40}>
              {piezas.map(({ f, esq, a }) => {
                const plat = PLATAFORMAS.find((p) => p.id === f.plataforma)!;
                const abierto = detalle === f.id;
                return (
                  <div key={f.id} style={{
                    background: "#fff", border: `1px solid ${a.alertas.length ? `${M.falla}55` : M.linea}`,
                    borderRadius: 14, padding: 13, height: "100%",
                  }}>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span style={{ width: 7, height: 7, borderRadius: 999, background: plat.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{f.nombre}</span>
                      </div>
                      <button onClick={() => alternarFormato(f.id)} title="Quitar de la campaña"
                        style={{ background: "none", border: "none", cursor: "pointer", color: M.gris, fontSize: 15, lineHeight: 1 }}>×</button>
                    </div>

                    <div className="flex justify-center" style={{ background: M.niebla, borderRadius: 10, padding: 12, minHeight: 150 }}>
                      <PiezaFormato pieza={piezaBase} formato={f} esquemaId={esq.id} imagen={imagen} anchoDisponible={240} />
                    </div>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <Chip color={M.gris}>{esq.nombre}</Chip>
                      {a.legal && <Chip color={M.ok}>con condiciones</Chip>}
                      {a.alertas.length > 0 && <Chip color={M.falla} punto>bloqueado</Chip>}
                      {!a.alertas.length && a.condiciones.length > 0 && <Chip color={M.alerta}>sin cifras</Chip>}
                      {(a.ajustes.length > 0 || a.condiciones.length > 0) && (
                        <button onClick={() => setDetalle(abierto ? null : f.id)}
                          className="font-mono"
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 9.5, color: M.gris, marginLeft: "auto" }}>
                          {a.ajustes.length + a.condiciones.length} notas {abierto ? "▲" : "▼"}
                        </button>
                      )}
                    </div>

                    {abierto && (
                      <div className="entra mt-2" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 8 }}>
                        {a.ajustes.map((x, i) => (
                          <div key={i} style={{ fontSize: 11, color: M.gris, lineHeight: 1.55, marginBottom: 4 }}>· {x}</div>
                        ))}
                        {a.condiciones.map((x, i) => (
                          <div key={i} style={{ fontSize: 11, color: M.alerta, lineHeight: 1.55, marginBottom: 4 }}>· {x}</div>
                        ))}
                        {a.alertas.map((x, i) => (
                          <div key={i} style={{ fontSize: 11, color: M.falla, lineHeight: 1.55, marginBottom: 4 }}>· {x}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </Cascada>
          </div>

          <Panel titulo="Entrega del lote" acento={M.rojo}>
            <div className="grid gap-4 xl:grid-cols-2 items-start">
              <div>
                <div className="flex gap-2 flex-wrap">
                  <Boton onClick={descargarLote} icono="↓">Descargar el lote</Boton>
                  <Boton variante="secundario" icono="→" onClick={sincronizar}
                    disabled={sincronia >= 0 && sincronia < PASOS_SINCRONIA.length}>
                    Sincronizar con plataformas
                  </Boton>
                </div>
                <div style={{ fontSize: 11.5, color: M.gris, marginTop: 10, lineHeight: 1.6, maxWidth: 560 }}>
                  El lote entrega el correo en HTML y un manifiesto con las {seleccion.length} piezas: dimensiones,
                  esquema aplicado, texto adaptado y los ajustes de cada formato. La sincronización muestra la secuencia
                  que se ejecutaría contra {inst.motorActivacion}, Meta y Google; en esta demostración no hay conexión.
                </div>
                {sincronia >= 0 && (
                  <div className="mt-4">
                    <Progresion pasos={PASOS_SINCRONIA} indice={sincronia}
                      textoFinal="Lote registrado en la simulación. En un entorno conectado, las piezas quedarían como borradores en cada plataforma, pendientes de aprobación." />
                  </div>
                )}
              </div>

              <div>
                <Etiqueta color={M.tinta}>Lo que se produce en una campaña</Etiqueta>
                <div className="grid gap-1 mt-2">
                  {PLATAFORMAS.map((p) => {
                    const n = piezas.filter((x) => x.f.plataforma === p.id).length;
                    if (!n) return null;
                    return (
                      <div key={p.id} className="flex items-center gap-3 py-1" style={{ borderBottom: `1px solid ${M.niebla}` }}>
                        <span style={{ fontSize: 12, minWidth: 140 }}>{p.nombre}</span>
                        <div style={{ flex: 1 }}><Barra valor={(n / seleccion.length) * 100} color={p.color} alto={5} /></div>
                        <span className="font-mono" style={{ fontSize: 11, minWidth: 22, textAlign: "right" }}>{n}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ fontSize: 11.5, color: M.gris, marginTop: 10, lineHeight: 1.6 }}>
                  Estimación de referencia del esfuerzo manual: {horas} horas para este lote. Medirlo con datos reales
                  es parte de la primera etapa; la cifra de acá es una hipótesis de trabajo.
                </div>
              </div>
            </div>
          </Panel>
        </>
      )}

      {/* ---------- Test de diseño ---------- */}
      {pestaña === "test" && (
        <>
          <Panel titulo="Test de diseño con el panel" acento={M.rojo}
            aside={<Chip>mismo mensaje, tres estructuras</Chip>}>
            <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, maxWidth: 940, marginBottom: 14 }}>
              El test A/B/C del Caso base compara textos. Este compara estructuras: el mensaje es idéntico y lo que
              cambia es la composición. Es la prueba que hoy se hace publicando y esperando, cuando se hace.
            </div>
            <BarraComparada
              items={testDiseno.map((t) => ({
                etiqueta: t.esquema.nombre,
                valor: t.prom,
                color: t.esquema.id === ganadorDiseno.esquema.id ? M.rojo : "#B9B3AE",
                destacado: t.esquema.id === ganadorDiseno.esquema.id,
              }))}
            />
          </Panel>

          <div className="grid gap-3 lg:grid-cols-3">
            {testDiseno.map((t) => (
              <div key={t.esquema.id} style={{
                background: "#fff", borderRadius: 14, padding: 14,
                border: `1px solid ${t.esquema.id === ganadorDiseno.esquema.id ? M.rojo : M.linea}`,
              }}>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span style={{ fontSize: 13.5, fontWeight: 600 }}>{t.esquema.nombre}</span>
                  {t.esquema.id === ganadorDiseno.esquema.id && <Chip color={M.rojo}>mayor atención · {t.prom}%</Chip>}
                </div>
                <div style={{ fontSize: 11.5, color: M.gris, lineHeight: 1.55, marginBottom: 12 }}>{t.esquema.descripcion}</div>

                <div className="flex justify-center" style={{ background: M.niebla, borderRadius: 10, padding: 12 }}>
                  <PiezaFormato pieza={piezaBase} formato={buscarFormato("meta-feed")} esquemaId={t.esquema.id}
                    imagen={imagen} anchoDisponible={200} mostrarRegla={false} />
                </div>

                <div className="mt-3">
                  <Etiqueta>Atención estimada por perfil</Etiqueta>
                  <div className="grid gap-1 mt-2">
                    {t.porPersona.map((p: any) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <span style={{ fontSize: 11.5, minWidth: 66 }}>{p.nombre}</span>
                        <div style={{ flex: 1 }}><Barra valor={p.valor} color={M.rojo} alto={4} /></div>
                        <span className="font-mono" style={{ fontSize: 10, minWidth: 24, textAlign: "right", color: M.gris }}>{p.valor}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Panel titulo="Cómo se estima la atención por estructura" acento={M.alerta}>
            <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.7, maxWidth: 940 }}>
              No es un modelo entrenado con datos de {inst.nombre}. Cruza dos cosas: el nivel de uso digital declarado
              de cada perfil —los perfiles digitales responden mejor a la imagen dominante, los de baja actividad al
              texto— y la carga de condiciones de la pieza, que penaliza los esquemas donde la letra chica queda al pie.
              Sirve para ordenar qué estructura probar primero, no para pronosticar el desempeño. La calibración con
              resultados reales es lo que aparece en la pestaña siguiente.
            </div>
          </Panel>
        </>
      )}

      {/* ---------- Ciclo de aprendizaje ---------- */}
      {pestaña === "ciclo" && (
        <>
          <Panel titulo="Qué vuelve de las plataformas" acento={M.rojo}>
            <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, maxWidth: 940, marginBottom: 16 }}>
              La capa entrega piezas y las plataformas devuelven desempeño. Ese retorno es lo que convierte la
              biblioteca en un activo: deja de ser un repositorio de bloques y pasa a saber qué estructura funciona con
              qué segmento. Los datos de esta pantalla son de referencia; el circuito real se cierra al conectar las
              plataformas.
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              {[
                { k: "Campañas registradas", v: 34, c: M.tinta },
                { k: "Piezas producidas", v: 412, c: M.tinta },
                { k: "Módulos en biblioteca", v: 26, c: M.ok },
                { k: "Reglas derivadas del desempeño", v: 9, c: M.rojo },
              ].map((x) => (
                <div key={x.k} style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 14, padding: 15 }}>
                  <Etiqueta>{x.k}</Etiqueta>
                  <div style={{ marginTop: 3 }}><Contador hasta={x.v} color={x.c} /></div>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-4 xl:grid-cols-2 items-start">
            <Panel titulo="Desempeño por estructura y segmento">
              <div className="grid gap-1">
                <div className="flex gap-2 items-center" style={{ borderBottom: `1px solid ${M.linea}`, paddingBottom: 6 }}>
                  <span style={{ minWidth: 150 }} />
                  {ESQUEMAS.map((e) => (
                    <span key={e.id} className="font-mono text-center" style={{ fontSize: 9.5, color: M.gris, width: 78 }}>
                      {e.nombre.split(" ")[0]}
                    </span>
                  ))}
                </div>
                {[
                  { seg: "Digitales 18-30", v: [38, 61, 29] },
                  { seg: "Sueldo abonado", v: [44, 47, 42] },
                  { seg: "Baja actividad digital", v: [41, 22, 53] },
                  { seg: "Senior 60+", v: [46, 19, 58] },
                  { seg: "Pyme / MYPE", v: [43, 36, 49] },
                ].map((r) => {
                  const max = Math.max(...r.v);
                  return (
                    <div key={r.seg} className="flex gap-2 items-center py-1.5" style={{ borderBottom: `1px solid ${M.niebla}` }}>
                      <span style={{ fontSize: 12, minWidth: 150 }}>{r.seg}</span>
                      {r.v.map((v, i) => (
                        <span key={i} className="text-center" style={{ width: 78 }}>
                          <span style={{ fontSize: 12.5, fontWeight: v === max ? 700 : 400, color: v === max ? M.tinta : M.gris }}>{v}%</span>
                          <Barra valor={v} color={v === max ? M.rojo : M.linea} alto={3} />
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
              <div style={{ fontSize: 11.5, color: M.gris, marginTop: 12, lineHeight: 1.6 }}>
                El patrón que aparece con datos reales: la imagen dominante gana en segmentos digitales y pierde
                fuerte en baja actividad y senior. Eso deja de ser opinión de diseño y pasa a ser una regla.
              </div>
            </Panel>

            <Panel titulo="Reglas que aprendió la biblioteca" acento={M.ok}>
              <div className="grid gap-2">
                {[
                  ["Estructura", "En segmentos senior, texto dominante supera a imagen dominante por 39 puntos.", "alta"],
                  ["Estructura", "En 18-30, la imagen dominante sostiene la atención; el texto largo la pierde.", "alta"],
                  ["Condiciones", "Las piezas con cifra y sin bloque de condiciones visible duplican las consultas al contact center.", "media"],
                  ["Formato", "El banner 320×50 no aporta acción medible en campañas de producto; sirve solo a recordación.", "media"],
                  ["Módulo", "El bloque de aviso antifraude no baja la conversión: se puede mantener siempre.", "alta"],
                  ["Canal", "En baja actividad digital, el push tiene apertura pero no acción: conviene correo.", "media"],
                ].map(([tipo, texto, conf], i) => (
                  <div key={i} className="flex gap-3 items-baseline py-1.5" style={{ borderBottom: `1px solid ${M.niebla}` }}>
                    <Chip color={conf === "alta" ? M.ok : M.alerta}>{tipo}</Chip>
                    <span style={{ fontSize: 12, lineHeight: 1.55, flex: 1 }}>{texto}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11.5, color: M.gris, marginTop: 12, lineHeight: 1.6 }}>
                Cada regla nace de un cruce entre lo que el panel predijo y lo que la campaña midió. Cuando ambas
                coinciden repetidas veces, la regla sube de confianza y empieza a aplicarse en la generación.
              </div>
            </Panel>
          </div>

          <Panel titulo="El circuito completo" acento={M.tinta}>
            <div className="grid gap-3 md:grid-cols-5">
              {[
                ["1 · Brief", "Entra una solicitud de negocio con producto, segmento y canales."],
                ["2 · Generación", "Compliance fija las obligaciones y el redactor escribe conforme."],
                ["3 · Producción", "La pieza se despliega en los formatos de cada plataforma."],
                ["4 · Activación", "Marketing Cloud, Meta y Google publican con la audiencia sincronizada."],
                ["5 · Retorno", "El desempeño vuelve, se contrasta con lo que el panel predijo y ajusta la regla."],
              ].map(([t, d], i) => (
                <div key={t} style={{ border: `1px solid ${M.linea}`, borderRadius: 12, padding: 13, position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: i === 4 ? M.rojo : M.linea, borderRadius: "12px 0 0 12px" }} />
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{t}</div>
                  <div style={{ fontSize: 11.5, color: M.gris, marginTop: 5, lineHeight: 1.55 }}>{d}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12.5, color: M.gris, marginTop: 14, lineHeight: 1.65, maxWidth: 980 }}>
              El paso 5 es el que separa una herramienta de una capacidad. Sin retorno, cada campaña vuelve a empezar de
              cero y la biblioteca solo acumula archivos. Con retorno, acumula criterio.
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
