import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Legend,
} from "recharts";
import { MARCA as M } from "../datos/marca";
import { BANDAS, OBJETIVO, escala, type Legibilidad } from "../lib/legibilidad";
import type { Reaccion } from "../lib/tipos";

/* La variante B toma el color de la marca activa; las otras dos son neutros
   estables para que la comparación se lea igual en cualquier institución. */
const colorVar = (): Record<string, string> => ({ A: "#B9B3AE", B: M.rojo, C: "#1F5F8B" });

const prom = (rs: Reaccion[], k: keyof Reaccion) =>
  rs?.length ? Math.round(rs.reduce((a, x) => a + (x[k] as number), 0) / rs.length) : 0;

const ejeTooltip = {
  contentStyle: { border: `1px solid ${M.linea}`, borderRadius: 0, fontSize: 12, fontFamily: "Poppins, sans-serif" },
  cursor: { fill: "rgba(0,0,0,0.03)" },
};

/* Comparación A/B/C en las cuatro dimensiones del panel */
export function GraficoABC({ reacciones, ganador }: { reacciones: Record<string, Reaccion[]>; ganador?: string }) {
  const datos = [
    { dim: "Abre", A: prom(reacciones.A, "abre"), B: prom(reacciones.B, "abre"), C: prom(reacciones.C, "abre") },
    { dim: "Entiende", A: prom(reacciones.A, "entiende") * 20, B: prom(reacciones.B, "entiende") * 20, C: prom(reacciones.C, "entiende") * 20 },
    { dim: "Confía", A: prom(reacciones.A, "confia") * 20, B: prom(reacciones.B, "confia") * 20, C: prom(reacciones.C, "confia") * 20 },
    { dim: "Actúa", A: prom(reacciones.A, "actua"), B: prom(reacciones.B, "actua"), C: prom(reacciones.C, "actua") },
  ];
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={datos} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={M.niebla} vertical={false} />
          <XAxis dataKey="dim" tick={{ fontSize: 11, fill: M.gris }} axisLine={{ stroke: M.linea }} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: M.gris }} axisLine={false} tickLine={false} />
          <Tooltip {...ejeTooltip} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {(["A", "B", "C"] as const).map((k) => (
            <Bar key={k} dataKey={k} fill={colorVar()[k]} opacity={ganador && ganador !== k ? 0.45 : 1} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Perfil de cada variante, útil para ver que la ganadora no gana en todo */
export function RadarABC({ reacciones }: { reacciones: Record<string, Reaccion[]> }) {
  const datos = [
    { dim: "Abre", ...vals(reacciones, "abre", 1) },
    { dim: "Entiende", ...vals(reacciones, "entiende", 20) },
    { dim: "Confía", ...vals(reacciones, "confia", 20) },
    { dim: "Actúa", ...vals(reacciones, "actua", 1) },
  ];
  return (
    <div style={{ width: "100%", height: 240 }}>
      <ResponsiveContainer>
        <RadarChart data={datos} outerRadius="72%">
          <PolarGrid stroke={M.linea} />
          <PolarAngleAxis dataKey="dim" tick={{ fontSize: 11, fill: M.gris }} />
          {(["A", "B", "C"] as const).map((k) => (
            <Radar key={k} dataKey={k} stroke={colorVar()[k]} fill={colorVar()[k]} fillOpacity={0.12} strokeWidth={2} />
          ))}
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip {...ejeTooltip} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

function vals(r: Record<string, Reaccion[]>, k: keyof Reaccion, f: number) {
  return { A: prom(r.A, k) * f, B: prom(r.B, k) * f, C: prom(r.C, k) * f };
}

/* Antes y después del refinamiento */
export function GraficoAntesDespues({ antes, despues }: { antes: Reaccion[]; despues: Reaccion[] }) {
  const datos = [
    { dim: "Abre", antes: prom(antes, "abre"), despues: prom(despues, "abre") },
    { dim: "Entiende", antes: prom(antes, "entiende") * 20, despues: prom(despues, "entiende") * 20 },
    { dim: "Confía", antes: prom(antes, "confia") * 20, despues: prom(despues, "confia") * 20 },
    { dim: "Actúa", antes: prom(antes, "actua"), despues: prom(despues, "actua") },
  ];
  return (
    <div style={{ width: "100%", height: 210 }}>
      <ResponsiveContainer>
        <BarChart data={datos} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={M.niebla} vertical={false} />
          <XAxis dataKey="dim" tick={{ fontSize: 11, fill: M.gris }} axisLine={{ stroke: M.linea }} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: M.gris }} axisLine={false} tickLine={false} />
          <Tooltip {...ejeTooltip} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar dataKey="antes" name="Variante ganadora" fill="#B9B3AE" />
          <Bar dataKey="despues" name="Pieza final" fill={M.rojo} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutCompliance({ reglas }: { reglas: { estado: string }[] }) {
  const cuenta: Record<string, number> = {};
  reglas.forEach((r) => (cuenta[r.estado] = (cuenta[r.estado] || 0) + 1));
  const col: Record<string, string> = { cumple: M.ok, ajustar: M.alerta, bloquea: M.falla, "no aplica": M.linea };
  const datos = Object.entries(cuenta).map(([k, v]) => ({ name: k, value: v }));
  return (
    <div style={{ width: "100%", height: 190 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={datos} dataKey="value" nameKey="name" innerRadius="52%" outerRadius="80%" paddingAngle={2}>
            {datos.map((d) => <Cell key={d.name} fill={col[d.name] || M.gris} />)}
          </Pie>
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip {...ejeTooltip} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* Barra de legibilidad con las bandas de la escala INFLESZ */
export function BarraLegibilidad({ valor, comparar, etiqueta }: { valor: number; comparar?: number; etiqueta?: string }) {
  const pos = (v: number) => Math.max(0, Math.min(100, v));
  const e = escala(valor);
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{etiqueta || "Legibilidad"}</span>
        <span style={{ fontSize: 12, color: e.color, fontWeight: 600 }}>
          {valor} · {e.banda}
        </span>
      </div>
      <div style={{ position: "relative", height: 26 }}>
        <div className="flex" style={{ height: 12 }}>
          {BANDAS.map((b) => (
            <div key={b.nombre} title={b.nombre} style={{ width: `${b.hasta - b.desde}%`, background: b.color, opacity: 0.28 }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute", left: `${OBJETIVO.min}%`, width: `${OBJETIVO.max - OBJETIVO.min}%`,
            top: 0, height: 12, border: `1px solid ${M.ok}`,
          }}
        />
        {comparar !== undefined && (
          <div style={{ position: "absolute", left: `${pos(comparar)}%`, top: -2, width: 2, height: 16, background: M.gris }} />
        )}
        <div style={{ position: "absolute", left: `${pos(valor)}%`, top: -4, width: 3, height: 20, background: e.color }} />
        <div className="font-mono flex justify-between" style={{ fontSize: 8.5, color: M.gris, marginTop: 14 }}>
          <span>0 muy difícil</span>
          <span style={{ color: M.ok }}>objetivo 65-85</span>
          <span>100 muy fácil</span>
        </div>
      </div>
    </div>
  );
}

export function FichaLegibilidad({ l, titulo, comparar }: { l: Legibilidad; titulo?: string; comparar?: number }) {
  return (
    <div>
      <BarraLegibilidad valor={l.ifsz} etiqueta={titulo} comparar={comparar} />
      <div className="grid grid-cols-4 gap-2 mt-3">
        {[
          ["Nivel lector", l.nivel],
          ["Palabras / frase", l.palabrasPorFrase],
          ["Sílabas / palabra", l.silabasPorPalabra],
          ["Fernández Huerta", l.fernandezHuerta],
        ].map(([k, v]) => (
          <div key={k as string}>
            <div className="font-mono" style={{ fontSize: 9, color: M.gris, letterSpacing: "0.08em" }}>{String(k).toUpperCase()}</div>
            <div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>
      {l.palabrasLargas.length > 0 && (
        <div style={{ fontSize: 11, color: M.gris, marginTop: 8, lineHeight: 1.5 }}>
          Palabras que más pesan: {l.palabrasLargas.join(", ")}
        </div>
      )}
    </div>
  );
}

/* Uso de la biblioteca */
export function GraficoBiblioteca({ items }: { items: { nombre: string; usos?: number }[] }) {
  const datos = items.slice(0, 8).map((i) => ({ nombre: i.nombre.length > 26 ? i.nombre.slice(0, 26) + "…" : i.nombre, usos: i.usos || 0 }));
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 16, left: 130, bottom: 0 }}>
          <CartesianGrid stroke={M.niebla} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 10, fill: M.gris }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="nombre" tick={{ fontSize: 10.5, fill: M.tinta }} axisLine={false} tickLine={false} width={130} />
          <Tooltip {...ejeTooltip} />
          <Bar dataKey="usos" fill={M.rojo} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
