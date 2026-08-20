import React, { useEffect, useRef } from "react";
import { MARCA as M } from "../datos/marca";
import type { EventoLog } from "../estado/store";

export function Trazabilidad({ log, alto = 250 }: { log: EventoLog[]; alto?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [log.length]);

  return (
    <div ref={ref} className="font-mono" style={{ fontSize: 10.5, lineHeight: 1.75, maxHeight: alto, overflowY: "auto" }}>
      {log.length === 0 && <span style={{ color: M.gris }}>Sin eventos todavía.</span>}
      {log.map((l, i) => (
        <div key={i} className="entra" style={{ borderBottom: `1px dotted ${M.niebla}`, paddingBottom: 4, marginBottom: 4 }}>
          <span style={{ color: M.gris }}>{l.t}</span> <span style={{ color: M.rojo }}>{l.agente}</span>
          <div style={{ color: M.tinta }}>{l.evento}</div>
          {l.ref && <div style={{ color: M.gris }}>ref {l.ref}</div>}
        </div>
      ))}
    </div>
  );
}
