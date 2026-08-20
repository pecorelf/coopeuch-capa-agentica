import React, { useEffect, useRef, useState } from "react";
import { MARCA as M } from "../datos/marca";
import { Etiqueta } from "./UI";

/* Ocho componentes animados. Cada uno existe porque hay un momento de la demo
   donde el movimiento explica algo que un número quieto no explica.
   Todos respetan prefers-reduced-motion vía CSS en index.css. */

/* 1 · Cifra que sube. Para métricas de resultado: el número se construye a la
   vista y eso hace que la gente lo mire. */
export function Contador({ hasta, sufijo = "", decimales = 0, duracion = 900, tam = 30, color = M.tinta }: any) {
  const [v, setV] = useState(0);
  const ref = useRef<number>();
  useEffect(() => {
    const t0 = performance.now();
    const paso = (t: number) => {
      const p = Math.min(1, (t - t0) / duracion);
      const suave = 1 - Math.pow(1 - p, 3);
      setV(hasta * suave);
      if (p < 1) ref.current = requestAnimationFrame(paso);
    };
    ref.current = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(ref.current!);
  }, [hasta, duracion]);
  return (
    <span style={{ fontSize: tam, fontWeight: 300, letterSpacing: "-.03em", lineHeight: 1.1, color }}>
      {v.toFixed(decimales)}
      <span style={{ fontSize: tam * 0.45, color: M.gris }}>{sufijo}</span>
    </span>
  );
}

/* 2 · Anillo de progreso. Para el índice de legibilidad y cualquier 0-100:
   se lee de un vistazo y ocupa poco. */
export function Anillo({ valor, max = 100, tam = 96, grosor = 8, color = M.rojo, etiqueta, sufijo = "" }: any) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setV(valor), 60);
    return () => clearTimeout(id);
  }, [valor]);
  const r = (tam - grosor) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(v, max) / max) * c;
  /* La etiqueta va DEBAJO del círculo, no dentro: adentro solo cabe el número
     sin que se monte con el trazo. */
  return (
    <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
      <div style={{ position: "relative", width: tam, height: tam }}>
        <svg width={tam} height={tam} style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke={M.niebla} strokeWidth={grosor} />
          <circle cx={tam / 2} cy={tam / 2} r={r} fill="none" stroke={color} strokeWidth={grosor} strokeLinecap="round"
            strokeDasharray={c} strokeDashoffset={off} style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: tam * 0.3, fontWeight: 600, lineHeight: 1, letterSpacing: "-.02em" }}>
            {Math.round(valor)}<span style={{ fontSize: tam * 0.16, color: M.gris }}>{sufijo}</span>
          </span>
        </div>
      </div>
      {etiqueta && (
        <span className="font-mono" style={{ fontSize: 8.5, color: M.gris, letterSpacing: ".1em", whiteSpace: "nowrap" }}>{etiqueta}</span>
      )}
    </div>
  );
}

/* 3 · Agente trabajando. Tres puntos en secuencia: comunica "esto está pasando
   ahora" sin barra de carga genérica. */
export function AgentePulso({ activo, listo, nombre, tarea, color = M.rojo }: any) {
  return (
    <div className="flex items-start gap-2.5 py-2" style={{ borderBottom: `1px solid ${M.niebla}` }}>
      <span style={{ position: "relative", width: 9, height: 9, marginTop: 5, flexShrink: 0 }}>
        <span style={{ position: "absolute", inset: 0, borderRadius: 999, background: listo ? M.ok : activo ? color : M.linea }} />
        {activo && <span className="pulso-anillo" style={{ position: "absolute", inset: -4, borderRadius: 999, border: `2px solid ${color}` }} />}
      </span>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div className="flex items-center gap-2 flex-wrap">
          <span style={{ fontSize: 12.5, fontWeight: activo ? 600 : 500 }}>{nombre}</span>
          {activo && (
            <span className="font-mono" style={{ fontSize: 9.5, color }}>
              trabajando<span className="puntos-anim" />
            </span>
          )}
          {listo && <span className="font-mono" style={{ fontSize: 9.5, color: M.ok }}>listo</span>}
        </div>
        {tarea && <div style={{ fontSize: 11.5, color: M.gris, marginTop: 2, lineHeight: 1.45 }}>{tarea}</div>}
      </div>
    </div>
  );
}

/* 4 · Texto que se escribe. Para las salidas del redactor: hace visible que la
   pieza se está generando, no que estaba guardada. */
export function TextoEscrito({ texto, velocidad = 18, activo = true, estilo }: any) {
  const [n, setN] = useState(activo ? 0 : (texto || "").length);
  useEffect(() => {
    if (!activo) return setN(texto.length);
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setN(i);
      if (i >= texto.length) clearInterval(id);
    }, velocidad);
    return () => clearInterval(id);
  }, [texto, activo, velocidad]);
  const parcial = (texto || "").slice(0, n);
  return (
    <span style={estilo}>
      {parcial}
      {n < (texto || "").length && <span className="cursor-escribe" />}
    </span>
  );
}

/* 5 · Barra comparativa animada. Para el test A/B/C fuera del gráfico: sirve en
   filas densas donde Recharts sería excesivo. */
export function BarraComparada({ items, sufijo = "%", alto = 26 }: { items: { etiqueta: string; valor: number; color: string; destacado?: boolean }[]; sufijo?: string; alto?: number }) {
  const [listo, setListo] = useState(false);
  useEffect(() => { const id = setTimeout(() => setListo(true), 80); return () => clearTimeout(id); }, [items]);
  const max = Math.max(...items.map((i) => i.valor), 1);
  return (
    <div className="grid gap-2">
      {items.map((it, k) => (
        <div key={it.etiqueta} className="flex items-center gap-3">
          <span className="font-mono" style={{ fontSize: 10.5, width: 92, color: it.destacado ? M.tinta : M.gris, fontWeight: it.destacado ? 700 : 400 }}>
            {it.etiqueta}
          </span>
          <div style={{ flex: 1, background: M.niebla, borderRadius: 999, height: alto, position: "relative", overflow: "hidden" }}>
            <div style={{
              width: listo ? `${(it.valor / max) * 100}%` : 0, height: "100%", background: it.color,
              borderRadius: 999, transition: `width .8s cubic-bezier(.4,0,.2,1) ${k * 120}ms`,
              display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 9,
            }}>
              <span style={{ fontSize: 11.5, color: "#fff", fontWeight: 600 }}>{it.valor}{sufijo}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* 6 · Flujo de la capa. Las etapas conectadas, con la actual latiendo. Reemplaza
   la lista vertical de pasos cuando hay espacio horizontal. */
export function FlujoEtapas({ etapas, actual }: { etapas: string[]; actual: number }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {etapas.map((e, i) => {
        const hecha = actual > i;
        const activa = actual === i;
        return (
          <React.Fragment key={e}>
            <div className="flex items-center gap-2 px-3 py-1.5"
              style={{
                borderRadius: 999, background: activa ? `${M.rojo}12` : hecha ? `${M.ok}10` : M.niebla,
                border: `1px solid ${activa ? `${M.rojo}44` : hecha ? `${M.ok}33` : "transparent"}`,
                transition: "all .4s ease",
              }}>
              <span style={{
                width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                background: hecha ? M.ok : activa ? M.rojo : M.linea, color: "#fff",
                fontSize: 9.5, lineHeight: 1, display: "inline-flex", alignItems: "center",
                justifyContent: "center", fontWeight: 700, fontFamily: "ui-monospace, monospace",
                paddingTop: hecha ? 0 : 0.5,
              }} className={activa ? "late" : ""}>
                {hecha ? "✓" : i + 1}
              </span>
              <span style={{ fontSize: 11.5, fontWeight: activa ? 600 : 400, color: activa ? M.tinta : hecha ? M.tinta : M.gris }}>{e}</span>
            </div>
            {i < etapas.length - 1 && (
              <span style={{ width: 14, height: 1.5, background: hecha ? M.ok : M.linea, transition: "background .4s ease", borderRadius: 999 }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* 7 · Aparición escalonada. Envuelve una lista para que los ítems entren uno tras
   otro: hace legible una tabla larga que si no aparece de golpe. */
export function Cascada({ children, retardo = 60 }: { children: React.ReactNode; retardo?: number }) {
  return (
    <>
      {React.Children.map(children, (hijo, i) => (
        <div className="entra" style={{ animationDelay: `${i * retardo}ms` }}>{hijo}</div>
      ))}
    </>
  );
}

/* 8 · Estado de envío. Pasos que se van completando: se usa en la transferencia
   a Marketing Cloud y en el envío emulado de correo. */
export function Progresion({ pasos, indice, textoFinal }: { pasos: string[]; indice: number; textoFinal?: string }) {
  if (indice < 0) return null;
  return (
    <div className="grid gap-1.5">
      {pasos.map((p, i) => {
        const hecho = indice > i;
        const activo = indice === i;
        return (
          <div key={p} className="flex items-center gap-2.5" style={{ opacity: indice >= i ? 1 : 0.4, transition: "opacity .3s" }}>
            <span style={{
              width: 18, height: 18, borderRadius: 999, flexShrink: 0, fontSize: 9.5, lineHeight: 1,
              fontWeight: 700, color: "#fff", fontFamily: "ui-monospace, monospace",
              background: hecho ? M.ok : activo ? M.rojo : M.linea,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              paddingTop: hecho ? 0 : 0.5,
            }} className={activo ? "late" : ""}>
              {hecho ? "✓" : i + 1}
            </span>
            <span style={{ fontSize: 12.5, color: indice >= i ? M.tinta : M.gris }}>{p}</span>
            {activo && <span className="font-mono" style={{ fontSize: 9.5, color: M.rojo }}>en curso<span className="puntos-anim" /></span>}
          </div>
        );
      })}
      {indice >= pasos.length && textoFinal && (
        <div className="entra" style={{ marginTop: 8, padding: 11, background: `${M.ok}0D`, borderLeft: `3px solid ${M.ok}`, borderRadius: "0 10px 10px 0", fontSize: 12.5, lineHeight: 1.6 }}>
          {textoFinal}
        </div>
      )}
    </div>
  );
}

/* Extra · Cinta de recuento animada, para encabezar secciones de resultado. */
export function TiraMetricas({ items }: { items: { etiqueta: string; valor: number; sufijo?: string; color?: string; decimales?: number }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((it) => (
        <div key={it.etiqueta} style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 14, padding: 15, position: "relative", overflow: "hidden" }}>
          <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: it.color || M.rojo }} />
          <Etiqueta>{it.etiqueta}</Etiqueta>
          <div style={{ marginTop: 3 }}>
            <Contador hasta={it.valor} sufijo={it.sufijo} decimales={it.decimales || 0} color={M.tinta} />
          </div>
        </div>
      ))}
    </div>
  );
}
