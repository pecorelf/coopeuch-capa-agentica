import React from "react";
import { MARCA as M, SET_REGLAS } from "./datos/marca";
import { useApp, ETAPAS } from "./estado/store";
import { CASOS } from "./datos/casos";
import { Chip, Etiqueta, Logo } from "./componentes/UI";
import Casos from "./vistas/Casos";
import CasoLibre from "./vistas/CasoLibre";
import Resultado from "./vistas/Resultado";
import Metodo from "./vistas/Metodo";
import Configuracion from "./vistas/Configuracion";

const ESTACIONES = [
  { id: "casos", n: "01", nombre: "Casos", sub: "Tres campañas reales, paso a paso" },
  { id: "libre", n: "02", nombre: "Caso libre", sub: "Su brief, procesado en vivo" },
  { id: "resultado", n: "03", nombre: "Resultado", sub: "Entregable, bitácora y activo" },
  { id: "metodo", n: "04", nombre: "Método", sub: "Panel sintético y legibilidad" },
  { id: "config", n: "05", nombre: "Configuración", sub: "Fuentes, marca y set de reglas" },
] as const;

export default function App() {
  const { vista, irA, casoId, etapa, reproduciendo } = useApp();
  const c = CASOS.find((x) => x.id === casoId)!;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: M.niebla }}>
      {/* Cabecera */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${M.linea}` }}>
        <div className="flex items-center justify-between px-5 py-3.5 gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Logo alto={30} />
            <div style={{ width: 1, height: 28, background: M.linea }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em" }}>Capa Agéntica de Marketing</div>
              <div className="font-mono" style={{ fontSize: 9.5, color: M.gris, letterSpacing: "0.1em" }}>
                DEMO 100% FUNCIONAL · DATA NO REAL · SIN CONEXIÓN A SISTEMAS COOPEUCH
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Chip color={M.gris}>{SET_REGLAS}</Chip>
            <Chip color={M.gris}>Salesforce Marketing Cloud</Chip>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Riel */}
        <nav className="shrink-0 hidden md:block" style={{ width: 214, background: "#fff", borderRight: `1px solid ${M.linea}` }}>
          <div className="p-3 grid gap-1">
            {ESTACIONES.map((e) => {
              const activa = vista === e.id;
              return (
                <button
                  key={e.id}
                  onClick={() => irA(e.id as any)}
                  className="w-full text-left px-3 py-2.5"
                  style={{
                    borderRadius: 12,
                    background: activa ? `${M.rojo}0D` : "transparent",
                    border: `1px solid ${activa ? `${M.rojo}33` : "transparent"}`,
                    cursor: "pointer",
                    transition: "background .18s ease, border-color .18s ease",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono" style={{ fontSize: 9.5, color: activa ? M.rojo : M.gris }}>{e.n}</span>
                    <span style={{ fontSize: 13, fontWeight: activa ? 600 : 400, color: activa ? M.tinta : M.tinta }}>{e.nombre}</span>
                  </div>
                  <div style={{ fontSize: 10.5, color: M.gris, marginLeft: 21, marginTop: 1, lineHeight: 1.4 }}>{e.sub}</div>
                </button>
              );
            })}
          </div>

          <div className="px-4 py-3 mx-3 mb-3" style={{ background: M.niebla, borderRadius: 12 }}>
            <Etiqueta>Integración</Etiqueta>
            <div style={{ fontSize: 11, color: M.gris, marginTop: 6, lineHeight: 1.55 }}>
              Marketing Cloud es el motor de activación. La capa lo alimenta, no lo reemplaza.
            </div>
          </div>
        </nav>

        {/* Contenido */}
        <main className="flex-1 p-4 md:p-6 min-w-0">
          {vista === "casos" && <Casos />}
          {vista === "libre" && <CasoLibre />}
          {vista === "resultado" && <Resultado />}
          {vista === "metodo" && <Metodo />}
          {vista === "config" && <Configuracion />}
        </main>
      </div>

      {/* Consola */}
      <footer
        className="flex items-center justify-between px-5 py-2 gap-4 flex-wrap font-mono"
        style={{ background: "#fff", borderTop: `1px solid ${M.linea}`, fontSize: 9.5, color: M.gris, letterSpacing: "0.06em" }}
      >
        <div className="flex gap-5 flex-wrap">
          <span>CASO {c.nombre.toUpperCase()}</span>
          <span>ETAPA {etapa === 0 ? "—" : `${etapa}/${ETAPAS.length} ${ETAPAS[etapa - 1]?.agente || ""}`}</span>
          <span>REGLAS {SET_REGLAS}</span>
        </div>
        <div className="flex gap-5">
          <span style={{ color: reproduciendo ? M.rojo : M.gris }}>{reproduciendo ? "REPRODUCIENDO" : "EN PAUSA"}</span>
          <span>INVESTIGACIÓN INTERNA E HIPÓTESIS</span>
        </div>
      </footer>
    </div>
  );
}
