import type { Pieza } from "./tipos";
import { medirPieza } from "./legibilidad";
import { SET_REGLAS } from "../datos/marca";

/* Exportadores del paquete. El HTML es un correo real, con la ilustración
   vectorial embebida: se abre en el navegador y se puede subir tal cual a
   Marketing Cloud como asset. */

export function piezaAHtml(p: Pieza, imagen?: string, nombre = "Coopeuch") {
  const cuerpo = (p.cuerpo || [])
    .map((x) => `<p style="margin:0 0 14px;font:400 15px/1.7 Arial,Helvetica,sans-serif;color:#141414">${escapar(x)}</p>`)
    .join("\n        ");

  return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapar(p.asunto)}</title>
</head>
<body style="margin:0;padding:0;background:#F2F1EF">
  <!-- preheader -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapar(p.preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F1EF">
    <tr>
      <td align="center" style="padding:24px 12px">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;background:#ffffff;border:1px solid #DCD8D3">
          <tr><td style="height:4px;background:#E4032E;font-size:0;line-height:0">&nbsp;</td></tr>
          <tr>
            <td style="padding:22px 26px 8px">
              <div style="font:700 15px/1 Arial,Helvetica,sans-serif;color:#E4032E;letter-spacing:.04em">${escapar(nombre).toUpperCase()}</div>
            </td>
          </tr>
          ${imagen ? `<tr><td style="padding:8px 26px">${imagen}</td></tr>` : ""}
          <tr>
            <td style="padding:14px 26px 0">
              <h1 style="margin:0 0 14px;font:600 24px/1.28 Arial,Helvetica,sans-serif;color:#141414">${escapar(p.titular)}</h1>
              ${cuerpo}
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 4px">
                <tr><td style="background:#E4032E">
                  <a href="#" style="display:inline-block;padding:13px 26px;font:700 14px/1 Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none">${escapar(p.cta)}</a>
                </td></tr>
              </table>
              ${p.legal ? `<div style="margin:18px 0 0;padding:12px;background:#F2F1EF;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#141414">${escapar(p.legal)}</div>` : ""}
            </td>
          </tr>
          <tr>
            <td style="padding:18px 26px 24px">
              <div style="border-top:1px solid #DCD8D3;padding-top:12px;font:400 11px/1.6 Arial,Helvetica,sans-serif;color:#6B6663">
                Coopeuch nunca solicita claves ni datos personales por correo, WhatsApp o teléfono.<br>
                Infórmese sobre la garantía estatal de los depósitos en su cooperativa o en www.cmfchile.cl
              </div>
            </td>
          </tr>
        </table>
        <div style="margin-top:12px;font:400 10px/1.5 Arial,Helvetica,sans-serif;color:#6B6663">
          Demo Deloitte Digital · data no real · sin conexión a sistemas Coopeuch
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const escapar = (t: string) =>
  String(t || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function payloadSfmc(opts: {
  clave: string; nombre: string; canal: string; pieza: Pieza; segmentos: string[];
  modulos?: string[]; veredicto?: string; panelN?: number; extra?: Record<string, any>;
}) {
  const l = medirPieza(opts.pieza).total;
  return {
    definitionKey: opts.clave,
    assetType: { name: "htmlemail", id: 208 },
    name: opts.nombre,
    channel: opts.canal,
    subjectLine: opts.pieza.asunto,
    preheader: opts.pieza.preheader,
    dataExtension: `DE_${opts.segmentos.join("_").replace(/[^A-Za-z0-9]+/g, "_")}`.slice(0, 90),
    audienceFilter: { segmentos: opts.segmentos, excluir: ["opt_out", "mora_90", "sin_consentimiento"] },
    modulos: opts.modulos || [],
    compliance: { reglaSetVersion: SET_REGLAS, veredicto: opts.veredicto },
    legibilidad: { escala: "INFLESZ", indice: l.ifsz, banda: l.banda, nivelLector: l.nivel },
    pruebaPrevia: opts.panelN ? { tipo: "panel sintético", n: opts.panelN } : undefined,
    trazabilidad: { datosReales: false, conexionSistemas: false, ambiente: "deloitte-demo", ...(opts.extra || {}) },
  };
}

export function descargar(nombre: string, contenido: string, tipo = "text/plain") {
  const blob = new Blob([contenido], { type: `${tipo};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export const slug = (t: string) =>
  String(t || "pieza").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

/* Simulacion del traspaso al motor de activacion. No hay conexion: la demo
   muestra exactamente lo que se enviaria y en que orden. */
export const PASOS_TRANSFERENCIA = [
  "Validando estructura del asset",
  "Creando Content Block en Marketing Cloud",
  "Vinculando Data Extension de audiencia",
  "Aplicando exclusiones de la audiencia",
  "Registrando versión y set de reglas",
  "Asset disponible en Email Studio",
];
