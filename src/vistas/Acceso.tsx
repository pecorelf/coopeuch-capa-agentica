import React, { useEffect, useState } from "react";
import { MARCA as M } from "../datos/marca";
import { USUARIOS, useSesion } from "../estado/sesion";
import { aplicarFavicon } from "../lib/favicon";
import { INSTITUCIONES } from "../datos/instituciones";
import { Boton, Etiqueta, Logo } from "../componentes/UI";

/* Pantalla de acceso. Es una barrera de presentación, no un control de
   seguridad: la clave es compartida y vive en el cliente. Para que la URL no
   quede pública, lo que corresponde es Password Protection en Vercel. */

const LOGOS_DELOITTE = [
  "/logo-deloitte.png", "/logo-deloitte.jpg", "/logo-deloitte.svg",
  "/logo-deloitte-digital.png", "/deloitte.png", "/deloitte-digital.png",
];

export default function Acceso() {
  const { entrar, setInstitucion, institucionId } = useSesion();
  const [usuario, setUsuario] = useState(USUARIOS[2].id);
  const [clave, setClave] = useState("");
  const [error, setError] = useState(false);
  const [logoIdx, setLogoIdx] = useState(0);

  useEffect(() => {
    aplicarFavicon({ nombre: "Deloitte", color: M.tinta });
    document.title = "Capacidad Agéntica de Marketing · Deloitte Digital";
  }, []);

  const intentar = () => {
    if (entrar(usuario, clave)) return;
    setError(true);
    setTimeout(() => setError(false), 2200);
  };

  return (
    <div style={{ minHeight: "100vh", background: M.niebla, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="entra" style={{ width: "100%", maxWidth: 940, display: "grid", gap: 0, gridTemplateColumns: "1fr", borderRadius: 20, overflow: "hidden", boxShadow: "0 24px 60px -24px rgba(20,20,20,.28)" }}>
        <div className="grid md:grid-cols-[1.05fr_1fr]">
          {/* Panel izquierdo */}
          <div style={{ background: M.tinta, color: "#fff", padding: "40px 38px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 460 }}>
            <div>
              {logoIdx < LOGOS_DELOITTE.length ? (
                <img
                  src={LOGOS_DELOITTE[logoIdx]}
                  alt="Deloitte Digital"
                  style={{ height: 34, width: "auto", filter: "brightness(0) invert(1)" }}
                  onError={() => setLogoIdx(logoIdx + 1)}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 21, fontWeight: 600, letterSpacing: "-.02em" }}>Deloitte.</span>
                  <span style={{ width: 8, height: 8, borderRadius: 999, background: M.deloitte, display: "inline-block", marginBottom: -2 }} />
                </div>
              )}

              <div style={{ marginTop: 46 }}>
                <div className="font-mono" style={{ fontSize: 10, letterSpacing: ".14em", color: "rgba(255,255,255,.55)" }}>
                  PRODUCTO DIGITAL
                </div>
                <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.15, letterSpacing: "-.02em", marginTop: 10 }}>
                  Capacidad Agéntica<br />de Marketing
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.7)", marginTop: 16, maxWidth: 330 }}>
                  Generación, cumplimiento normativo y prueba con audiencias sintéticas antes de activar una campaña.
                </div>
              </div>
            </div>

            <div className="font-mono" style={{ fontSize: 9.5, letterSpacing: ".08em", color: "rgba(255,255,255,.4)", lineHeight: 1.8 }}>
              DEMO 100% FUNCIONAL · DATA NO REAL<br />
              SIN CONEXIÓN A SISTEMAS DE LA INSTITUCIÓN
            </div>
          </div>

          {/* Panel derecho */}
          <div style={{ background: "#fff", padding: "40px 38px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Etiqueta color={M.tinta}>Acceso</Etiqueta>
            <div style={{ fontSize: 13, color: M.gris, marginTop: 6, marginBottom: 22, lineHeight: 1.6 }}>
              Seleccione su usuario e ingrese la clave de la demostración.
            </div>

            <div className="grid gap-2 mb-4">
              {USUARIOS.map((u) => {
                const sel = usuario === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setUsuario(u.id)}
                    className="text-left flex items-center gap-3"
                    style={{
                      border: `1px solid ${sel ? M.rojo : M.linea}`,
                      background: sel ? `${M.rojo}0A` : "#fff",
                      borderRadius: 12, padding: "10px 13px", cursor: "pointer", transition: "all .18s ease",
                    }}
                  >
                    <span style={{
                      width: 15, height: 15, borderRadius: 999, flexShrink: 0,
                      border: `2px solid ${sel ? M.rojo : M.linea}`,
                      background: sel ? M.rojo : "transparent",
                      boxShadow: sel ? "inset 0 0 0 2.5px #fff" : "none",
                    }} />
                    <span>
                      <span style={{ fontSize: 13, fontWeight: 600, display: "block" }}>{u.nombre}</span>
                      <span style={{ fontSize: 11, color: M.gris }}>{u.rol}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <Etiqueta color={M.tinta}>Clave</Etiqueta>
            <input
              type="password"
              value={clave}
              autoFocus
              onChange={(e) => setClave(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && intentar()}
              placeholder="••••••••••••"
              className="campo w-full mt-1.5"
              style={{ fontSize: 13, padding: "11px 13px", border: `1px solid ${error ? M.falla : M.linea}`, borderRadius: 10 }}
            />
            {error && (
              <div className="entra" style={{ fontSize: 11.5, color: M.falla, marginTop: 7 }}>
                Clave incorrecta.
              </div>
            )}

            <div className="mt-5">
              <Boton onClick={intentar} ancho icono="→">Entrar</Boton>
            </div>

            <div style={{ marginTop: 22, paddingTop: 16, borderTop: `1px solid ${M.niebla}` }}>
              <Etiqueta>Institución de la demostración</Etiqueta>
              <select
                value={institucionId}
                onChange={(e) => setInstitucion(e.target.value)}
                className="campo w-full mt-1.5"
                style={{ fontSize: 12.5, padding: "9px 11px", border: `1px solid ${M.linea}`, borderRadius: 10, background: "#fff" }}
              >
                {INSTITUCIONES.map((i) => <option key={i.id} value={i.id}>{i.nombre}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
