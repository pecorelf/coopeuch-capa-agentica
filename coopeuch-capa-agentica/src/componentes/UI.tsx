import React, { useState } from "react";
import { MARCA as M } from "../datos/marca";

/* El logo lo pone el equipo en /public. Probamos los nombres habituales y, si no
   hay ninguno, no se dibuja nada: la app nunca depende del archivo. */
const CANDIDATOS = ["/logo-coopeuch.png", "/logo-coopeuch.jpg", "/logo-coopeuch.svg", "/logo.png"];

export const Logo = ({ alto = 28 }: { alto?: number }) => {
  const [i, setI] = useState(0);
  if (i >= CANDIDATOS.length) return null;
  return <img src={CANDIDATOS[i]} alt="Coopeuch" style={{ height: alto, width: "auto" }} onError={() => setI(i + 1)} />;
};

export const Etiqueta = ({ children, color = M.gris }: any) => (
  <div className="font-mono uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", color }}>
    {children}
  </div>
);

export const Chip = ({ children, color = M.gris, punto = false }: any) => (
  <span
    className="font-mono inline-flex items-center gap-1.5"
    style={{
      fontSize: 10, color, background: `${color}0F`, border: `1px solid ${color}2E`,
      padding: "3px 9px", letterSpacing: "0.05em", borderRadius: 999,
    }}
  >
    {punto && <span style={{ width: 5, height: 5, borderRadius: 999, background: color }} />}
    {children}
  </span>
);

export const Panel = ({ titulo, aside, children, acento, clase = "", sinPadding = false }: any) => (
  <div
    className={`panel ${clase}`}
    style={{
      background: "#fff",
      border: `1px solid ${M.linea}`,
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(28,25,23,.04), 0 8px 24px -16px rgba(28,25,23,.18)",
    }}
  >
    {titulo && (
      <div className="flex items-center justify-between gap-3 px-4 py-3" style={{ borderBottom: `1px solid ${M.niebla}` }}>
        <div className="flex items-center gap-2 min-w-0">
          {acento && <span style={{ width: 4, height: 15, borderRadius: 999, background: acento, flexShrink: 0 }} />}
          <Etiqueta color={M.tinta}>{titulo}</Etiqueta>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">{aside}</div>
      </div>
    )}
    <div className={sinPadding ? "" : "p-4"}>{children}</div>
  </div>
);

export const Boton = ({ children, onClick, disabled, variante = "primario", ancho, icono, tam = "normal" }: any) => {
  const estilos: any = {
    primario: { background: M.rojo, color: "#fff", borderColor: M.rojo, boxShadow: "0 1px 2px rgba(228,3,46,.28)" },
    secundario: { background: "#fff", color: M.tinta, borderColor: M.linea },
    suave: { background: M.niebla, color: M.tinta, borderColor: "transparent" },
    fantasma: { background: "transparent", color: M.gris, borderColor: "transparent" },
  };
  const dims = tam === "chico"
    ? { fontSize: 12, padding: "6px 13px", minHeight: 32 }
    : { fontSize: 13, padding: "9px 18px", minHeight: 40 };
  return (
    <button
      className="btn"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...dims, fontWeight: 600, border: "1px solid", borderRadius: 999,
        lineHeight: 1.2, whiteSpace: "nowrap", display: "inline-flex", alignItems: "center",
        justifyContent: "center", gap: 7,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        width: ancho ? "100%" : undefined, ...estilos[variante],
      }}
    >
      {icono && <span style={{ fontSize: tam === "chico" ? 12 : 14, lineHeight: 1 }}>{icono}</span>}
      {children}
    </button>
  );
};

export const Barra = ({ valor, color = M.rojo, alto = 5 }: any) => (
  <div style={{ height: alto, background: M.niebla, width: "100%", borderRadius: 999, overflow: "hidden" }}>
    <div style={{ height: alto, width: `${Math.max(0, Math.min(100, valor))}%`, background: color, borderRadius: 999, transition: "width .5s cubic-bezier(.4,0,.2,1)" }} />
  </div>
);

export const Metrica = ({ etiqueta, valor, sufijo, color = M.tinta, delta }: any) => {
  const texto = typeof valor === "string";
  return (
    <div style={{ background: "#fff", border: `1px solid ${M.linea}`, borderRadius: 14, padding: 15, position: "relative", overflow: "hidden" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: color }} />
      <Etiqueta>{etiqueta}</Etiqueta>
      <div className="flex items-baseline gap-2">
        <div style={{ fontSize: texto ? 15 : 31, fontWeight: texto ? 600 : 300, letterSpacing: texto ? 0 : "-0.03em", lineHeight: texto ? 1.35 : 1.2, marginTop: texto ? 5 : 2 }}>
          {valor}
          <span style={{ fontSize: 14, color: M.gris }}>{sufijo}</span>
        </div>
        {typeof delta === "number" && delta !== 0 && (
          <span className="font-mono" style={{ fontSize: 11, color: delta > 0 ? M.ok : M.falla }}>
            {delta > 0 ? "+" : ""}{delta}
          </span>
        )}
      </div>
    </div>
  );
};

export const Fila = ({ izq, der, ancho = 150 }: any) => (
  <div className="flex gap-3 items-baseline py-1.5" style={{ borderBottom: `1px solid ${M.niebla}` }}>
    <span style={{ fontSize: 12.5, fontWeight: 600, minWidth: ancho }}>{izq}</span>
    <span style={{ fontSize: 12, color: M.gris }}>{der}</span>
  </div>
);

/* Ventana modal. Se usa para el correo emulado y la configuración. */
export const Modal = ({ abierto, onCerrar, titulo, subtitulo, ancho = 760, children, pie }: any) => {
  if (!abierto) return null;
  return (
    <div
      className="modal-fondo"
      onClick={onCerrar}
      style={{
        position: "fixed", inset: 0, background: "rgba(20,20,20,.42)", backdropFilter: "blur(3px)",
        zIndex: 60, display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "40px 16px", overflowY: "auto",
      }}
    >
      <div
        className="modal-caja"
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: ancho, boxShadow: "0 24px 60px -12px rgba(20,20,20,.35)", overflow: "hidden" }}
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4" style={{ borderBottom: `1px solid ${M.niebla}` }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{titulo}</div>
            {subtitulo && <div style={{ fontSize: 12, color: M.gris, marginTop: 2, lineHeight: 1.5 }}>{subtitulo}</div>}
          </div>
          <button onClick={onCerrar} aria-label="Cerrar"
            style={{ background: M.niebla, border: "none", borderRadius: 999, width: 30, height: 30, cursor: "pointer", color: M.gris, fontSize: 16, lineHeight: 1, flexShrink: 0 }}>
            ×
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {pie && <div className="flex items-center justify-end gap-2 px-5 py-3" style={{ borderTop: `1px solid ${M.niebla}`, background: M.niebla }}>{pie}</div>}
      </div>
    </div>
  );
};

export const Campo = ({ etiqueta, valor, onChange, filas = 1, placeholder, mono = false, ayuda }: any) => (
  <div className="mb-3">
    {etiqueta && <Etiqueta color={M.tinta}>{etiqueta}</Etiqueta>}
    {filas > 1 ? (
      <textarea
        value={valor} rows={filas} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className={`campo mt-1.5 w-full ${mono ? "font-mono" : ""}`}
        style={{ fontSize: 12.5, padding: "9px 11px", border: `1px solid ${M.linea}`, borderRadius: 10, resize: "vertical", lineHeight: 1.65, background: "#fff" }}
      />
    ) : (
      <input
        value={valor} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className={`campo mt-1.5 w-full ${mono ? "font-mono" : ""}`}
        style={{ fontSize: 12.5, padding: "9px 11px", border: `1px solid ${M.linea}`, borderRadius: 10, background: "#fff" }}
      />
    )}
    {ayuda && <div style={{ fontSize: 10.5, color: M.gris, marginTop: 4, lineHeight: 1.5 }}>{ayuda}</div>}
  </div>
);
