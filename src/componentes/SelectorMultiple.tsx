import React, { useState } from "react";
import { MARCA as M } from "../datos/marca";
import { Etiqueta } from "./UI";

/* Selector múltiple compacto.
   El problema del diseño anterior: doce píldoras siempre visibles por campo
   convertían el brief en un muro. Acá lo seleccionado se muestra como etiquetas
   removibles y lo demás vive en un desplegable, más «Otro…» para escribir un
   valor que no está en la lista. */

export function SelectorMultiple({
  etiqueta, opciones, valores, onChange, placeholder = "Agregar…", ejemploOtro = "Escriba una opción propia",
}: {
  etiqueta: string;
  opciones: string[];
  valores: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  ejemploOtro?: string;
}) {
  const [abriendoOtro, setAbriendoOtro] = useState(false);
  const [texto, setTexto] = useState("");

  const disponibles = opciones.filter((o) => !valores.includes(o));
  const propios = valores.filter((v) => !opciones.includes(v));

  const quitar = (v: string) => {
    if (valores.length <= 1) return;
    onChange(valores.filter((x) => x !== v));
  };

  const agregarOtro = () => {
    const t = texto.trim();
    if (!t) return;
    if (!valores.includes(t)) onChange([...valores, t]);
    setTexto("");
    setAbriendoOtro(false);
  };

  return (
    <div style={{ borderBottom: `1px solid ${M.niebla}`, paddingBottom: 11, marginBottom: 11 }}>
      <div className="flex items-baseline justify-between">
        <Etiqueta color={M.tinta}>{etiqueta}</Etiqueta>
        <span className="font-mono" style={{ fontSize: 9.5, color: M.gris }}>
          {valores.length} {valores.length === 1 ? "seleccionado" : "seleccionados"}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {valores.map((v) => {
          const propio = !opciones.includes(v);
          return (
            <span
              key={v}
              className="inline-flex items-center gap-1.5"
              style={{
                fontSize: 11.5, padding: "4px 7px 4px 11px", borderRadius: 999,
                background: propio ? "#fff" : M.rojo,
                color: propio ? M.tinta : "#fff",
                border: `1px solid ${propio ? M.rojo : M.rojo}`,
                borderStyle: propio ? "dashed" : "solid",
              }}
            >
              {v}
              <button
                onClick={() => quitar(v)}
                title={valores.length <= 1 ? "Debe quedar al menos uno" : "Quitar"}
                style={{
                  background: "transparent", border: "none", cursor: valores.length <= 1 ? "not-allowed" : "pointer",
                  color: propio ? M.gris : "rgba(255,255,255,.85)", fontSize: 13, lineHeight: 1, padding: "0 1px",
                  opacity: valores.length <= 1 ? 0.35 : 1,
                }}
              >×</button>
            </span>
          );
        })}

        {!abriendoOtro && (
          <select
            value=""
            onChange={(e) => {
              if (e.target.value === "__otro__") setAbriendoOtro(true);
              else if (e.target.value) onChange([...valores, e.target.value]);
            }}
            style={{
              fontSize: 11.5, padding: "5px 11px", border: `1px dashed ${M.linea}`, borderRadius: 999,
              background: "#fff", color: M.gris, cursor: "pointer", maxWidth: 200,
            }}
          >
            <option value="">{placeholder}</option>
            {disponibles.map((o) => <option key={o} value={o}>{o}</option>)}
            <option value="__otro__">Otro…</option>
          </select>
        )}

        {abriendoOtro && (
          <span className="inline-flex items-center gap-1">
            <input
              autoFocus
              value={texto}
              placeholder={ejemploOtro}
              onChange={(e) => setTexto(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") agregarOtro();
                if (e.key === "Escape") { setAbriendoOtro(false); setTexto(""); }
              }}
              className="campo"
              style={{ fontSize: 11.5, padding: "5px 11px", border: `1px solid ${M.rojo}`, borderRadius: 999, width: 210 }}
            />
            <button onClick={agregarOtro}
              style={{ fontSize: 11.5, padding: "5px 13px", background: M.rojo, color: "#fff", border: "none", borderRadius: 999, cursor: "pointer" }}>
              agregar
            </button>
            <button onClick={() => { setAbriendoOtro(false); setTexto(""); }}
              style={{ fontSize: 11.5, padding: "4px 6px", background: "transparent", border: "none", color: M.gris, cursor: "pointer" }}>
              cancelar
            </button>
          </span>
        )}
      </div>

      {propios.length > 0 && (
        <div style={{ fontSize: 10.5, color: M.gris, marginTop: 6, lineHeight: 1.5 }}>
          {propios.length === 1 ? "Valor propio" : "Valores propios"} (borde punteado): los agentes los reciben tal cual;
          las plantillas de respaldo no los reconocen, así que conviene tener la IA activa.
        </div>
      )}
    </div>
  );
}
