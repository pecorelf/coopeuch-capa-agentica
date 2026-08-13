import React from "react";
import { MARCA as M } from "../datos/marca";
import { Chip, Barra, Metrica } from "./UI";
import { persona } from "../datos/personas";
import type { Reaccion } from "../lib/tipos";

const prom = (rs: Reaccion[], k: keyof Reaccion) =>
  rs.length ? Math.round(rs.reduce((a, r) => a + (r[k] as number), 0) / rs.length) : 0;

export function Resumen({ reacciones, previas }: { reacciones: Reaccion[]; previas?: Reaccion[] }) {
  const d = (k: keyof Reaccion) => (previas ? prom(reacciones, k) - prom(previas, k) : undefined);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Metrica etiqueta="Abre" valor={prom(reacciones, "abre")} sufijo="%" color={M.tinta} delta={d("abre")} />
      <Metrica etiqueta="Entiende" valor={prom(reacciones, "entiende")} sufijo="/5" color={M.ok} delta={d("entiende")} />
      <Metrica
        etiqueta="Confía"
        valor={prom(reacciones, "confia")}
        sufijo="/5"
        color={prom(reacciones, "confia") >= 4 ? M.ok : M.alerta}
        delta={d("confia")}
      />
      <Metrica etiqueta="Intención de actuar" valor={prom(reacciones, "actua")} sufijo="%" color={M.rojo} delta={d("actua")} />
    </div>
  );
}

export function Tarjetas({ ids, reacciones, revelados }: { ids: string[]; reacciones: Reaccion[]; revelados?: number }) {
  const n = revelados === undefined ? ids.length : revelados;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {ids.map((id, idx) => {
        const p = persona(id);
        const r = idx < n ? reacciones.find((x) => x.id === id) : undefined;
        return (
          <div key={id} style={{ background: "#fff", border: `1px solid ${M.linea}`, padding: 13 }} className={r ? "entra" : ""}>
            <div className="flex items-baseline justify-between gap-2">
              <div>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>{p.nombre}</span>
                <span style={{ fontSize: 12, color: M.gris }}> · {p.edad} · {p.ciudad}</span>
              </div>
              <Chip color={p.validez === "Alta" ? M.ok : p.validez === "Media" ? M.alerta : M.gris}>
                validez {p.validez.toLowerCase()}
              </Chip>
            </div>
            <div style={{ fontSize: 11.5, color: M.gris, marginTop: 2 }}>{p.perfil}</div>
            <div className="font-mono" style={{ fontSize: 9.5, color: M.gris, marginTop: 5 }}>
              ANCLAJE · {p.anclaje}
            </div>

            {r ? (
              <div className="mt-3">
                <div className="grid grid-cols-4 gap-2">
                  {([["abre", r.abre, "%"], ["entiende", r.entiende, "/5"], ["confía", r.confia, "/5"], ["actúa", r.actua, "%"]] as any[]).map(
                    ([k, v, s]) => (
                      <div key={k}>
                        <div className="font-mono" style={{ fontSize: 9, color: M.gris }}>{k}</div>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>
                          {v}<span style={{ fontSize: 10, color: M.gris }}>{s}</span>
                        </div>
                        <Barra valor={s === "/5" ? v * 20 : v} color={s === "/5" && v <= 2 ? M.falla : M.rojo} alto={3} />
                      </div>
                    )
                  )}
                </div>
                <div style={{ fontSize: 12.5, marginTop: 9, fontStyle: "italic", lineHeight: 1.5 }}>«{r.frase}»</div>
                <div style={{ fontSize: 11.5, color: M.alerta, marginTop: 5 }}>Objeción: {r.objecion}</div>
              </div>
            ) : (
              <div style={{ fontSize: 12, color: M.gris, marginTop: 8, lineHeight: 1.5 }}>{p.rasgo}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
