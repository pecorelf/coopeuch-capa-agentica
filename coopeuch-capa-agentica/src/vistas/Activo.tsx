import React from "react";
import { MARCA as M } from "../datos/marca";
import { useApp } from "../estado/store";
import { CASOS } from "../datos/casos";
import { Panel, Chip, Fila, Etiqueta, Metrica } from "../componentes/UI";

export default function Activo() {
  const { biblioteca, corridas } = useApp();
  const modulos = biblioteca.filter((b) => b.tipo === "Módulo HTML");
  const reglas = biblioteca.filter((b) => b.tipo === "Regla de tono");
  const totalUsos = biblioteca.reduce((a, b) => a + (b.usos || 0), 0);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Metrica etiqueta="Módulos en biblioteca" valor={modulos.length} sufijo="" color={M.rojo} />
        <Metrica etiqueta="Reglas de tono codificadas" valor={reglas.length} sufijo="" color={M.tinta} />
        <Metrica etiqueta="Reutilizaciones acumuladas" valor={totalUsos} sufijo="" color={M.ok} />
        <Metrica etiqueta="Casos reproducidos" valor={corridas} sufijo="" color={M.alerta} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <Panel titulo="Camino A · uso disperso" acento={M.linea}>
          <Fila izq="Cada pieza" der="Se genera desde cero con la herramienta que cada equipo tenga" ancho={92} />
          <Fila izq="El criterio" der="Vive en el prompt de una persona" ancho={92} />
          <Fila izq="La regla" der="Se revisa al final, manualmente" ancho={92} />
          <Fila izq="El aprendizaje" der="Queda en la cabeza de quien hizo la campaña" ancho={92} />
          <Fila izq="Al terminar" der="Queda la pieza enviada. Nada más" ancho={92} />
        </Panel>

        <Panel titulo="Camino B · capacidad propia" acento={M.rojo}>
          <Fila izq="Cada pieza" der="Se compone con módulos que ya pasaron por revisión" ancho={92} />
          <Fila izq="El criterio" der="Vive en el set de reglas de la cooperativa, versionado" ancho={92} />
          <Fila izq="La regla" der="Se aplica durante la generación, no después" ancho={92} />
          <Fila izq="El aprendizaje" der="Queda como hallazgo del panel y como módulo" ancho={92} />
          <Fila izq="Al terminar" der="Queda la pieza, el módulo, la regla y el hallazgo" ancho={92} />
        </Panel>
      </div>

      <Panel titulo="Biblioteca de la cooperativa" acento={M.rojo} aside={<Chip>{biblioteca.length} elementos</Chip>}>
        <div className="grid gap-1">
          {biblioteca.map((m) => (
            <div key={m.id} className="flex gap-3 items-center py-2" style={{ borderBottom: `1px solid ${M.niebla}` }}>
              <span className="font-mono" style={{ fontSize: 10, color: M.gris, minWidth: 48 }}>{m.id}</span>
              <span style={{ fontSize: 11.5, color: M.gris, minWidth: 110 }}>{m.tipo}</span>
              <span style={{ fontSize: 12.5, flex: 1 }}>{m.nombre}</span>
              {(m.usos || 0) <= 1 && <Chip color={M.rojo}>nuevo</Chip>}
              <span className="font-mono" style={{ fontSize: 11, minWidth: 62, textAlign: "right" }}>
                {m.usos} {m.usos === 1 ? "uso" : "usos"}
              </span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12.5, color: M.gris, marginTop: 14, lineHeight: 1.65 }}>
          Cada caso que se reproduce suma acá: los módulos reutilizados aumentan su contador y los nuevos entran a la
          biblioteca. Es el argumento del documento hecho contador.
        </div>
      </Panel>

      <Panel titulo="Hallazgos sobre el socio que dejaron estos casos" acento={M.ok}>
        <div className="grid gap-2">
          {CASOS.flatMap((c) =>
            c.aprendizaje
              .filter((a) => a.tipo === "Hallazgo de panel")
              .map((a) => ({ caso: c.nombre, nombre: a.nombre }))
          ).map((h, i) => (
            <div key={i} className="flex gap-3 items-baseline py-1" style={{ borderBottom: `1px solid ${M.niebla}` }}>
              <span className="font-mono" style={{ fontSize: 10, color: M.gris, minWidth: 150 }}>{h.caso}</span>
              <span style={{ fontSize: 12.5 }}>{h.nombre}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel titulo="Lo que habría que medir en el trabajo conjunto" acento={M.alerta}>
        <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.65, marginBottom: 12 }}>
          El documento planteó cifras de referencia sin datos de Coopeuch. Estas son las que se levantarían primero para
          reemplazar la hipótesis por evidencia.
        </div>
        <Fila izq="Tiempo por tramo" der="Cuánto del ciclo vive entre diseño, compliance y HTML" ancho={200} />
        <Fila izq="Iteraciones por pieza" der="Cuántas vueltas hay antes de una versión activable" ancho={200} />
        <Fila izq="Reutilización" der="Qué proporción de cada campaña se arma con módulos existentes" ancho={200} />
        <Fila izq="Retrabajo por compliance" der="Cuántos ajustes aparecen recién en la revisión final" ancho={200} />
        <Fila izq="Costo por pieza activable" der="Incluyendo esperas, no solo horas de producción" ancho={200} />
        <Fila izq="Piezas no enviadas" der="Cuántas mueren en el camino y en qué etapa" ancho={200} />
      </Panel>
    </div>
  );
}
