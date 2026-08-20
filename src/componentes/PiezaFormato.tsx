import React from "react";
import { MARCA as M } from "../datos/marca";
import type { Formato } from "../datos/formatos";
import { adaptar, esquema as buscarEsquema, type Esquema } from "../lib/layouts";
import type { Pieza } from "../lib/tipos";

/* Renderiza la pieza en las dimensiones reales del formato y la escala para
   caber en la grilla. Lo que se ve en pantalla es la proporción exacta que
   tendría publicada: por eso se nota cuándo el texto no cabe. */

export function PiezaFormato({
  pieza, formato: f, esquemaId, imagen, anchoDisponible = 260, mostrarRegla = true,
}: {
  pieza: Pieza;
  formato: Formato;
  esquemaId: string;
  imagen?: string;
  anchoDisponible?: number;
  mostrarRegla?: boolean;
}) {
  const esq = buscarEsquema(esquemaId);
  const a = adaptar(pieza, f, esq);

  /* Escala para que la pieza quepa en la celda sin deformarse */
  const altoMax = 300;
  const escala = Math.min(anchoDisponible / f.w, altoMax / f.h, 1);
  const anchoVisible = Math.round(f.w * escala);
  const altoVisible = Math.round(f.h * escala);

  const chico = f.h <= 120 || f.w <= 200;
  const px = (v: number) => `${v}px`;

  /* Tipografía proporcional al formato, no a la escala: así el recorte se ve */
  const tTitular = Math.max(11, Math.min(f.w * 0.055, f.h * 0.11, 56));
  const tCuerpo = Math.max(8, tTitular * 0.42);
  const tCta = Math.max(8, tTitular * 0.4);
  const pad = Math.max(8, f.w * 0.045);

  const fondo =
    esq.fondo === "marca" ? M.rojo : esq.fondo === "imagen" ? M.tinta : "#fff";
  const textoSobre = esq.fondo === "claro" ? M.tinta : "#fff";

  return (
    <div style={{ width: anchoVisible, flexShrink: 0 }}>
      <div
        style={{
          width: f.w, height: f.h, transform: `scale(${escala})`, transformOrigin: "top left",
          background: fondo, position: "relative", overflow: "hidden",
          border: `1px solid ${M.linea}`,
          marginBottom: altoVisible - f.h,
        }}
      >
        {/* Franja de marca */}
        {esq.franjaSuperior && (
          <div style={{ height: Math.max(6, f.h * 0.035), background: M.rojo, width: "100%" }} />
        )}

        {/* Imagen */}
        {a.conImagen && imagen && esq.imagenDominante && (
          <div style={{
            position: "absolute", left: 0, right: 0, top: 0,
            /* En verticales la escena ocupa la mitad superior y el texto la
               inferior: cubrir todo el alto obligaba a recortes muy agresivos. */
            height: f.h / f.w > 1.4 ? f.h * 0.56 : f.h,
            overflow: "hidden",
          }}
            dangerouslySetInnerHTML={{ __html: escalarSvg(imagen, f.w, f.h / f.w > 1.4 ? f.h * 0.56 : f.h) }} />
        )}
        {a.conImagen && imagen && !esq.imagenDominante && esq.id === "franja" && (
          <div style={{ width: "100%", height: f.h * 0.3, overflow: "hidden" }}
            dangerouslySetInnerHTML={{ __html: escalarSvg(imagen, f.w, f.h * 0.3) }} />
        )}

        {/* Capa de contenido */}
        <div
          style={{
            position: "absolute", inset: 0, padding: pad,
            display: "flex", flexDirection: "column",
            justifyContent: esq.imagenDominante ? "flex-end" : "flex-start",
            gap: Math.max(4, f.h * 0.018),
            background: esq.imagenDominante
              ? f.h / f.w > 1.4
                ? `linear-gradient(to top, ${M.tinta} 0%, ${M.tinta} 42%, rgba(28,25,23,.55) 52%, rgba(28,25,23,0) 62%)`
                : `linear-gradient(to top, rgba(0,0,0,.74) 0%, rgba(0,0,0,.3) 45%, rgba(0,0,0,0) 74%)`
              : "transparent",
            paddingTop: esq.franjaSuperior ? pad + f.h * 0.045 : pad,
          }}
        >
          {/* Logo o nombre de marca */}
          {!chico && (
            <div style={{
              fontSize: px(Math.max(9, tTitular * 0.32)), fontWeight: 700, letterSpacing: ".02em",
              color: esq.imagenDominante ? "#fff" : esq.fondo === "marca" ? "#fff" : M.rojo,
            }}>
              {M.nombre.toUpperCase()}
            </div>
          )}

          <div style={{ flex: esq.imagenDominante ? "none" : 1, display: "flex", flexDirection: "column", gap: Math.max(3, f.h * 0.014), justifyContent: "center" }}>
            <div style={{
              fontSize: px(tTitular), fontWeight: 700, lineHeight: 1.15, letterSpacing: "-.01em",
              color: esq.imagenDominante ? "#fff" : textoSobre,
            }}>
              {a.titular}
            </div>

            {a.cuerpo && (
              <div style={{
                fontSize: px(tCuerpo), lineHeight: 1.45,
                color: esq.imagenDominante ? "rgba(255,255,255,.9)" : esq.fondo === "marca" ? "rgba(255,255,255,.88)" : M.gris,
              }}>
                {a.cuerpo}
              </div>
            )}

            {/* Acento de imagen en esquema de texto */}
            {esq.id === "texto" && a.conImagen && imagen && f.h > 200 && (
              <div style={{ width: "100%", height: f.h * 0.14, overflow: "hidden", opacity: 0.95 }}
                dangerouslySetInnerHTML={{ __html: escalarSvg(imagen, f.w - pad * 2, f.h * 0.14) }} />
            )}
          </div>

          {a.cta && (
            <div style={{
              alignSelf: "flex-start",
              background: esq.fondo === "marca" ? "#fff" : M.rojo,
              color: esq.fondo === "marca" ? M.rojo : "#fff",
              fontSize: px(tCta), fontWeight: 700,
              padding: `${Math.max(4, f.h * 0.018)}px ${Math.max(9, f.w * 0.035)}px`,
              borderRadius: 999,
            }}>
              {a.cta}
            </div>
          )}

          {a.legal && (
            <div style={{
              fontSize: px(Math.max(6.5, tCuerpo * 0.62)), lineHeight: 1.35,
              color: esq.fondo === "marca" ? "rgba(255,255,255,.75)" : M.gris,
            }}>
              {a.legal}
            </div>
          )}
        </div>
      </div>

      {mostrarRegla && (
        <div className="font-mono" style={{ fontSize: 9, color: M.gris, marginTop: 6, letterSpacing: ".04em" }}>
          {f.w} × {f.h}
        </div>
      )}
    </div>
  );
}

/* Reencuadra el SVG al espacio pedido.
   No usa preserveAspectRatio: envuelve la escena en un SVG externo cuyo viewBox
   define exactamente qué región se conserva. Así el recorte es explícito.

   Las escenas están compuestas a un tercio, con la figura a la izquierda y el
   objeto de contexto a la derecha. Un recorte centrado parte justo por la mitad
   y corta las dos cosas que importan: por eso el anclaje depende del destino. */
const ESCENA_W = 620;
const ESCENA_H = 220;

/* Las escenas declaran su foco con data-foco. Las generadas en vivo no lo
   traen: para esas el centro es la mejor apuesta. */
function leerFoco(svg: string) {
  const m = svg.match(/data-foco="([\d.]+)"/);
  const v = m ? Number(m[1]) : 0.5;
  return Number.isFinite(v) && v > 0 && v < 1 ? v : 0.5;
}

function escalarSvg(svg: string, w: number, h: number) {
  const propDestino = w / h;
  const propEscena = ESCENA_W / ESCENA_H;

  let vbX = 0, vbY = 0, vbW = ESCENA_W, vbH = ESCENA_H;

  if (propDestino < propEscena) {
    /* Destino más vertical: se recorta a lo ancho, alrededor del punto focal
       que cada escena declara. Recortar por el centro geométrico parte en dos
       una composición a un tercio y deja fuera lo que importa. */
    vbW = ESCENA_H * propDestino;
    const foco = leerFoco(svg);
    vbX = Math.max(0, Math.min(ESCENA_W - vbW, foco * ESCENA_W - vbW / 2));
  } else {
    /* Destino más horizontal: se recorta en alto, conservando el centro
       vertical, que es donde están las cabezas y el objeto. */
    vbH = ESCENA_W / propDestino;
    vbY = (ESCENA_H - vbH) * 0.42;
  }

  const interior = svg
    .replace(/<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(w)}" height="${Math.round(h)}" viewBox="${vbX.toFixed(1)} ${vbY.toFixed(1)} ${vbW.toFixed(1)} ${vbH.toFixed(1)}">${interior}</svg>`;
}
