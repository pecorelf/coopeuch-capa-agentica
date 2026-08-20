import React, { useState } from "react";
import { MARCA as M } from "../datos/marca";
import { INSTITUCIONES, type Institucion } from "../datos/instituciones";
import { useSesion, aplicarTema } from "../estado/sesion";
import { Panel, Etiqueta, Chip, Boton, Campo, Logo } from "../componentes/UI";
import { Cascada } from "../componentes/Animados";

/* /admin · configuración de la institución con la que corre la demostración.
   Cambia marca, vocabulario, productos y segmentos. El vocabulario es lo que
   más importa: una demo bancaria que dice "socio" se cae sola. */

export default function Admin() {
  const { inst, institucionId, setInstitucion, actualizarInstitucion } = useSesion();
  const [guardado, setGuardado] = useState(false);

  const cambiarColor = (k: keyof Institucion["colores"], v: string) => {
    const colores = { ...inst.colores, [k]: v };
    actualizarInstitucion({ colores });
    aplicarTema({ ...inst, colores });
  };

  const aplicar = () => {
    aplicarTema(inst);
    setGuardado(true);
    setTimeout(() => setGuardado(false), 2500);
  };

  const url = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?institucion=${institucionId}`
    : "";

  return (
    <div className="grid gap-4">
      <Panel titulo="Institución activa" acento={M.rojo}
        aside={<Chip color={M.alerta} punto>configuración de demostración</Chip>}>
        <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, marginBottom: 14, maxWidth: 900 }}>
          Cada preset cambia marca, vocabulario, productos y segmentos. El vocabulario es lo que más pesa: en una
          cooperativa la persona del otro lado es un socio copropietario; en un banco es un cliente. Cambiar solo el
          color produce una demostración que suena falsa en los primeros segundos.
        </div>

        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          <Cascada retardo={40}>
            {INSTITUCIONES.map((i) => {
              const sel = institucionId === i.id;
              return (
                <button key={i.id} onClick={() => { setInstitucion(i.id); aplicarTema(i); }}
                  className="text-left"
                  style={{
                    border: `1px solid ${sel ? i.colores.rojo : M.linea}`,
                    background: sel ? `${i.colores.rojo}0A` : "#fff",
                    borderRadius: 12, padding: 13, cursor: "pointer", width: "100%",
                    transition: "all .18s ease",
                  }}>
                  <div className="flex items-center gap-2">
                    <span style={{ width: 22, height: 22, borderRadius: 7, background: i.colores.rojo, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{i.nombre}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <Chip color={M.gris}>{i.tipo}</Chip>
                    <Chip color={i.tratamiento === "socio" ? M.ok : M.gris}>{i.persona}</Chip>
                    {i.sector === "gas" && <Chip color={M.alerta}>set gas</Chip>}
                  </div>
                </button>
              );
            })}
          </Cascada>
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-4" style={{ borderTop: `1px solid ${M.niebla}`, paddingTop: 14 }}>
          <Boton onClick={aplicar} icono="✓">Aplicar a la demostración</Boton>
          {guardado && <Chip color={M.ok} punto>tema aplicado</Chip>}
          <span className="font-mono" style={{ fontSize: 10, color: M.gris, marginLeft: "auto" }}>
            enlace directo: {url}
          </span>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-3 items-start">
        <Panel titulo="Marca" acento={inst.colores.rojo}>
          <div className="flex items-center gap-3 mb-4" style={{ background: M.niebla, borderRadius: 12, padding: 12 }}>
            <Logo alto={26} src={inst.logo} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{inst.nombre}</div>
              <div className="font-mono" style={{ fontSize: 9.5, color: M.gris }}>{inst.logo}</div>
            </div>
          </div>

          <Campo etiqueta="Nombre" valor={inst.nombre} onChange={(v: string) => actualizarInstitucion({ nombre: v })} />
          <div className="flex gap-2 flex-wrap mb-3">
            <Chip color={M.gris}>sector {inst.sector}</Chip>
            <Chip color={M.gris}>{inst.setReglas}</Chip>
            <Chip color={M.gris}>{inst.app}</Chip>
          </div>
          <Campo etiqueta="Archivo del logo en /public" valor={inst.logo} mono
            onChange={(v: string) => actualizarInstitucion({ logo: v })}
            ayuda="El nombre debe coincidir exactamente, incluidas mayúsculas: Linux distingue y Windows no." />

          <Etiqueta color={M.tinta}>Colores</Etiqueta>
          <div className="grid gap-2 mt-2">
            {([["rojo", "Principal"], ["rojoOsc", "Principal oscuro"], ["niebla", "Fondo"], ["linea", "Líneas"]] as const).map(([k, n]) => (
              <div key={k} className="flex items-center gap-2">
                <input type="color" value={inst.colores[k]} onChange={(e) => cambiarColor(k, e.target.value)}
                  style={{ width: 34, height: 30, border: `1px solid ${M.linea}`, borderRadius: 8, background: "#fff", cursor: "pointer", padding: 2 }} />
                <span style={{ fontSize: 12, flex: 1 }}>{n}</span>
                <input value={inst.colores[k]} onChange={(e) => cambiarColor(k, e.target.value)}
                  className="campo font-mono" style={{ fontSize: 11, padding: "5px 9px", border: `1px solid ${M.linea}`, borderRadius: 8, width: 96 }} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel titulo="Vocabulario" acento={M.rojo}>
          <div className="grid gap-3 md:grid-cols-3">
            <Campo etiqueta="Singular" valor={inst.persona} onChange={(v: string) => actualizarInstitucion({ persona: v })} />
            <Campo etiqueta="Plural" valor={inst.personaPlural} onChange={(v: string) => actualizarInstitucion({ personaPlural: v })} />
            <Campo etiqueta="Femenino" valor={inst.personaFem} onChange={(v: string) => actualizarInstitucion({ personaFem: v })} />
          </div>
          <Campo etiqueta="Voz de marca" valor={inst.voz} filas={6} onChange={(v: string) => actualizarInstitucion({ voz: v })} />
          <Etiqueta color={M.tinta}>Palabras vetadas</Etiqueta>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {inst.vetadas.map((p) => (
              <Chip key={p} color={M.falla}>{p}</Chip>
            ))}
          </div>
        </Panel>

        <Panel titulo="Contexto y catálogo" acento={M.rojo}>
          <Campo etiqueta="Contexto de la institución" valor={inst.contexto} filas={6}
            onChange={(v: string) => actualizarInstitucion({ contexto: v })}
            ayuda="Viaja en cada llamada a los agentes." />
          <Etiqueta color={M.tinta}>Productos ({inst.productos.length})</Etiqueta>
          <div className="flex flex-wrap gap-1.5 mt-2 mb-3">
            {inst.productos.map((p) => <Chip key={p}>{p}</Chip>)}
          </div>
          <Etiqueta color={M.tinta}>Segmentos ({inst.segmentos.length})</Etiqueta>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {inst.segmentos.map((p) => <Chip key={p}>{p}</Chip>)}
          </div>
        </Panel>
      </div>

      <Panel titulo="Qué cambia y qué no al cambiar de institución" acento={M.alerta}>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Etiqueta color={M.ok}>Se adapta</Etiqueta>
            <div style={{ fontSize: 12.5, lineHeight: 1.7, marginTop: 6, color: M.gris }}>
              Colores y logo · vocabulario (socio o cliente) · contexto y voz de marca que reciben los agentes ·
              catálogo de productos y segmentos del Caso custom · set normativo del sector · panel de perfiles ·
              plantillas de contenido del motor local.
            </div>
          </div>
          <div>
            <Etiqueta color={M.alerta}>No se adapta</Etiqueta>
            <div style={{ fontSize: 12.5, lineHeight: 1.7, marginTop: 6, color: M.gris }}>
              Los tres casos base están guionados sobre hechos verificables de Coopeuch y no se traducen: para otra
              institución hay que escribir sus propios casos. Hoy hay dos sectores implementados: financiero, con el
              set de la CMF y el SERNAC Financiero, y gas, con el set de la SEC, el SERNAC y las bases de promoción.
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
