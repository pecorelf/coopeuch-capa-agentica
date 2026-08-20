import React from "react";
import { MARCA as M } from "../datos/marca";
import { Etiqueta, Logo } from "./UI";
import { medirPieza } from "../lib/legibilidad";
import { useSesion } from "../estado/sesion";
import type { Pieza } from "../lib/tipos";

export function PiezaEmail({
  pieza, version = "v1", imagen, compacta = false, mostrarLegibilidad = true,
}: { pieza: Pieza; version?: string; imagen?: string; compacta?: boolean; mostrarLegibilidad?: boolean }) {
  if (!pieza) return null;
  const l = medirPieza(pieza).total;
  const inst = useSesion.getState().inst;

  return (
    <div style={{ border: `1px solid ${M.linea}`, background: "#fff", width: "100%", borderRadius: 14, overflow: "hidden" }}>
      <div className="flex items-center justify-between px-3 py-2" style={{ background: M.niebla, borderBottom: `1px solid ${M.linea}` }}>
        <span className="font-mono" style={{ fontSize: 9.5, color: M.gris, letterSpacing: "0.1em" }}>
          VISTA PREVIA · {version.toUpperCase()}
        </span>
        {mostrarLegibilidad && (
          <span className="font-mono" style={{ fontSize: 9.5, color: l.color }}>
            legibilidad {l.ifsz}
          </span>
        )}
      </div>

      <div className="px-4 pt-3 pb-2">
        <Etiqueta>Asunto</Etiqueta>
        <div style={{ fontSize: compacta ? 13 : 14.5, fontWeight: 600, marginBottom: 6, lineHeight: 1.35 }}>{pieza.asunto}</div>
        <Etiqueta>Preheader</Etiqueta>
        <div style={{ fontSize: 11.5, color: M.gris, lineHeight: 1.45 }}>{pieza.preheader}</div>
      </div>

      <div style={{ borderTop: `1px solid ${M.linea}` }} className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Logo alto={20} />
          <div style={{ width: 3, height: 16, background: M.rojo }} />
        </div>

        {imagen && (
          <div
            className="mb-3"
            style={{ border: `1px solid ${M.linea}`, borderRadius: 10 }}
            dangerouslySetInnerHTML={{ __html: imagen }}
          />
        )}

        <div style={{ fontSize: compacta ? 17 : 21, fontWeight: 600, lineHeight: 1.25, marginBottom: 10 }}>{pieza.titular}</div>

        {pieza.cuerpo.map((p, i) => (
          <p key={i} style={{ fontSize: compacta ? 12.5 : 13.5, lineHeight: 1.7, marginBottom: 10 }}>{p}</p>
        ))}

        <div style={{ display: "inline-block", background: M.rojo, color: "#fff", padding: "10px 20px", fontSize: 12.5, fontWeight: 600 }}>
          {pieza.cta}
        </div>

        {pieza.legal && (
          <div style={{ marginTop: 14, padding: 10, background: M.niebla, fontSize: 10.5, lineHeight: 1.6 }}>
            {pieza.legal}
          </div>
        )}

        <div style={{ marginTop: 14, paddingTop: 9, borderTop: `1px solid ${M.linea}`, fontSize: 9, color: M.gris, lineHeight: 1.6 }}>
          {inst.nombre} nunca solicita claves ni datos personales por correo, WhatsApp o teléfono.
          {inst.sector === "gas"
            ? " · Ante emergencia de gas, corte el suministro y llame al 600 600 9200."
            : " · Infórmese sobre la garantía estatal de los depósitos en su institución o en www.cmfchile.cl"}
        </div>
      </div>
    </div>
  );
}
