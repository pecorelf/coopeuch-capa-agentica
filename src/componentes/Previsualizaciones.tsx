import React, { useState } from "react";
import { MARCA as M } from "../datos/marca";
import { PiezaEmail } from "./PiezaEmail";
import { Etiqueta } from "./UI";
import { useSesion } from "../estado/sesion";
import type { Pieza } from "../lib/tipos";
import type { Adaptaciones } from "../lib/motorLocal";

/* Cada canal se ve como lo ve el socio. Un correo en el inbox, un WhatsApp en el
   teléfono, un push en la pantalla bloqueada. La pieza es la misma; el marco
   cambia la conversación. */

const limpio = (t: string) =>
  String(t || "").replace(/%%NombreSocio%%/g, "Rosa").replace(/%%[^%]+%%/g, "").replace(/^[,:]\s*/, "").trim();

function Telefono({ children, etiqueta }: { children: React.ReactNode; etiqueta?: string }) {
  return (
    <div className="flex flex-col items-center">
      <div style={{ width: 288, border: `10px solid ${M.tinta}`, borderRadius: 34, overflow: "hidden", background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,.10)" }}>
        <div style={{ background: M.tinta, height: 22, display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
          <div style={{ width: 92, height: 15, background: M.tinta, borderRadius: "0 0 12px 12px" }} />
        </div>
        {children}
      </div>
      {etiqueta && <div className="font-mono mt-2" style={{ fontSize: 9.5, color: M.gris, letterSpacing: ".08em" }}>{etiqueta}</div>}
    </div>
  );
}

export function VistaWhatsApp({ texto }: { texto: string }) {
  const inst = useSesion.getState().inst;
  const partes = String(texto || "").split("\n").filter((x) => x !== undefined);
  return (
    <Telefono etiqueta="WHATSAPP · CUENTA DE EMPRESA VERIFICADA">
      <div style={{ background: "#075E54", padding: "9px 12px", display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: M.rojo, fontSize: 13, fontWeight: 700 }}>{inst.nombre.charAt(0)}</span>
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            {inst.nombre} <span style={{ fontSize: 10 }}>✓</span>
          </div>
          <div style={{ color: "#B7D6D1", fontSize: 9.5 }}>cuenta de empresa</div>
        </div>
      </div>

      <div style={{ background: "#ECE5DD", padding: "14px 10px", minHeight: 330 }}>
        <div style={{ background: "#fff", borderRadius: "0 8px 8px 8px", padding: "9px 11px", maxWidth: 232, boxShadow: "0 1px 1px rgba(0,0,0,.08)" }}>
          {partes.map((p, i) => {
            const negrita = /^\*.*\*$/.test(p.trim());
            const t = p.replace(/\*/g, "");
            if (!t.trim()) return <div key={i} style={{ height: 7 }} />;
            return (
              <div key={i} style={{ fontSize: 12.5, lineHeight: 1.55, fontWeight: negrita ? 700 : 400, color: "#111", marginBottom: 2 }}>
                {t}
              </div>
            );
          })}
          <div style={{ textAlign: "right", fontSize: 9, color: "#8696A0", marginTop: 4 }}>10:24 ✓✓</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 8, marginTop: 6, padding: "8px 0", maxWidth: 232, textAlign: "center", boxShadow: "0 1px 1px rgba(0,0,0,.08)" }}>
          <span style={{ fontSize: 12.5, color: "#027EB5", fontWeight: 600 }}>Ver en {inst.app}</span>
        </div>

        <div style={{ marginTop: 10, textAlign: "center" }}>
          <span style={{ fontSize: 9.5, color: "#667781", background: "#FCF4CB", padding: "4px 8px", borderRadius: 6, display: "inline-block", lineHeight: 1.4 }}>
            {inst.nombre} nunca pide claves por este medio
          </span>
        </div>
      </div>
    </Telefono>
  );
}

export function VistaPush({ titulo, cuerpo }: { titulo: string; cuerpo: string }) {
  const inst = useSesion.getState().inst;
  return (
    <Telefono etiqueta="PUSH · PANTALLA BLOQUEADA">
      <div style={{ background: "linear-gradient(160deg,#2B3A4A,#6B4A52)", minHeight: 380, padding: "26px 12px" }}>
        <div style={{ textAlign: "center", color: "#fff", marginBottom: 26 }}>
          <div style={{ fontSize: 38, fontWeight: 300, letterSpacing: "-.02em" }}>10:24</div>
          <div style={{ fontSize: 11, opacity: 0.85 }}>martes 4 de agosto</div>
        </div>

        <div style={{ background: "rgba(255,255,255,.92)", borderRadius: 16, padding: "10px 12px", backdropFilter: "blur(8px)" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 5 }}>
            <div style={{ width: 16, height: 16, background: M.rojo, borderRadius: 4 }} />
            <span style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".05em" }}>{inst.app}</span>
            <span style={{ fontSize: 10, color: "#888", marginLeft: "auto" }}>ahora</span>
          </div>
          <div style={{ fontSize: 12.5, fontWeight: 700, lineHeight: 1.35, marginBottom: 2 }}>{titulo}</div>
          <div style={{ fontSize: 12, lineHeight: 1.45, color: "#333" }}>{cuerpo}</div>
        </div>
      </div>
    </Telefono>
  );
}

export function VistaWeb({ titulo, bajada, cta, imagen }: { titulo: string; bajada: string; cta: string; imagen?: string }) {
  const inst = useSesion.getState().inst;
  return (
    <div style={{ border: `1px solid ${M.linea}`, background: "#fff", borderRadius: 14, overflow: "hidden" }}>
      <div className="flex items-center gap-2 px-3 py-2" style={{ background: M.niebla, borderBottom: `1px solid ${M.linea}` }}>
        <div className="flex gap-1">
          {[M.rojo, M.linea, M.linea].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
        </div>
        <div className="font-mono" style={{ fontSize: 9.5, color: M.gris, background: "#fff", padding: "3px 10px", border: `1px solid ${M.linea}`, flex: 1 }}>
          {inst.dominio || "institucion.cl"} / mi-cuenta
        </div>
      </div>

      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${M.linea}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 20, background: M.rojo }} />
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Mi {inst.nombre}</span>
        <span className="font-mono" style={{ fontSize: 10, color: M.gris, marginLeft: "auto" }}>Hola, Rosa</span>
      </div>

      <div style={{ padding: 16 }}>
        <div style={{ border: `1px solid ${M.linea}`, display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
          <div style={{ padding: 18 }}>
            <div className="font-mono" style={{ fontSize: 9.5, color: M.rojo, letterSpacing: ".1em", marginBottom: 8 }}>PARA USTED</div>
            <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.28, marginBottom: 8 }}>{titulo}</div>
            <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.6, marginBottom: 14 }}>{bajada}</div>
            <div style={{ display: "inline-block", background: M.rojo, color: "#fff", padding: "9px 18px", fontSize: 12.5, fontWeight: 600 }}>{cta}</div>
          </div>
          {imagen && <div style={{ borderLeft: `1px solid ${M.linea}` }} dangerouslySetInnerHTML={{ __html: imagen }} />}
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          {(inst.sector === "gas" ? ["Mis pedidos", "Saldo Lipipuntos", "Mis boletas"] : ["Saldo Cuenta Vista", "Cuotas de participación", "Mis productos"]).map((x) => (
            <div key={x} style={{ border: `1px solid ${M.linea}`, padding: 12 }}>
              <div style={{ fontSize: 11, color: M.gris }}>{x}</div>
              <div style={{ height: 6, background: M.niebla, marginTop: 8 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Selector de canal. Muestra solo los canales elegidos en el brief. */
export function VistaCanales({
  pieza, imagen, adaptaciones, canales,
}: { pieza: Pieza; imagen?: string; adaptaciones: Adaptaciones; canales: string[] }) {
  const disponibles = [
    { id: "email", nombre: "Correo", activo: canales.some((c) => /email|correo/i.test(c)) },
    { id: "whatsapp", nombre: "WhatsApp", activo: canales.some((c) => /whatsapp/i.test(c)) },
    { id: "push", nombre: "Push", activo: canales.some((c) => /push/i.test(c)) },
    { id: "web", nombre: "Sitio privado", activo: canales.some((c) => /privado|sitio|web/i.test(c)) },
  ].filter((x) => x.activo);

  const lista = disponibles.length ? disponibles : [{ id: "email", nombre: "Correo", activo: true }];
  const [sel, setSel] = useState(lista[0].id);
  const actual = lista.some((x) => x.id === sel) ? sel : lista[0].id;

  return (
    <div>
      {lista.length > 1 && (
        <div className="flex gap-1 mb-3">
          {lista.map((x) => (
            <button
              key={x.id}
              onClick={() => setSel(x.id)}
              style={{
                fontSize: 11.5, padding: "6px 14px", cursor: "pointer", borderRadius: 999,
                border: `1px solid ${actual === x.id ? M.rojo : M.linea}`,
                background: actual === x.id ? M.rojo : "#fff",
                color: actual === x.id ? "#fff" : M.tinta,
                transition: "all .18s ease",
              }}
            >{x.nombre}</button>
          ))}
        </div>
      )}

      {actual === "email" && <PiezaEmail pieza={pieza} version="correo" imagen={imagen} compacta />}

      {actual === "whatsapp" && (
        <div className="flex justify-center py-2">
          <VistaWhatsApp texto={adaptaciones.whatsapp || `*${limpio(pieza.titular)}*\n\n${limpio((pieza.cuerpo || [])[0] || "")}\n\n${limpio(pieza.cta)}`} />
        </div>
      )}

      {actual === "push" && (
        <div className="flex justify-center py-2">
          <VistaPush
            titulo={adaptaciones.push?.titulo || limpio(pieza.titular)}
            cuerpo={adaptaciones.push?.cuerpo || limpio(pieza.preheader)}
          />
        </div>
      )}

      {actual === "web" && (
        <VistaWeb
          titulo={adaptaciones.web?.titulo || limpio(pieza.titular)}
          bajada={adaptaciones.web?.bajada || limpio(pieza.preheader)}
          cta={limpio(pieza.cta)}
          imagen={imagen}
        />
      )}

      {lista.length > 1 && (
        <div style={{ fontSize: 11, color: M.gris, marginTop: 8, lineHeight: 1.55 }}>
          <Etiqueta>Una pieza, {lista.length} canales</Etiqueta>
          La capa adapta el mismo mensaje a cada canal en la generación. No es el mismo texto recortado: el push tiene
          otro límite, WhatsApp otra forma de leer y el sitio privado otro contexto.
        </div>
      )}
    </div>
  );
}
