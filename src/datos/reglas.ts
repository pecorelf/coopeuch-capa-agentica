import type { Regla } from "../lib/tipos";
import { useSesion } from "../estado/sesion";

/* Sets normativos por sector.
   No son intercambiables: una distribuidora de gas no responde a la CMF y un
   banco no tiene obligaciones de seguridad de instalaciones. Cada institución
   declara cuál le aplica. Ambos son aproximaciones de trabajo construidas con
   normativa pública: se reemplazan por el set real en la primera etapa. */

export const REGLAS_FINANCIERO: Regla[] = [
  { id: "R-01", norma: "Ley 21.398", texto: "Características generales del producto informadas y accesibles" },
  { id: "R-02", norma: "Ley 19.496 · SERNAC Financiero", texto: "Sin publicidad engañosa; condiciones esenciales visibles" },
  { id: "R-03", norma: "CMF · garantía estatal", texto: "Leyenda de garantía estatal de depósitos cuando aplique" },
  { id: "R-04", norma: "CAE y costo total del crédito", texto: "CAE, costo total y plazo cuando se comunica una oferta crediticia" },
  { id: "R-05", norma: "Ley 20.009", texto: "Sin solicitar claves ni datos sensibles por canal digital" },
  { id: "R-06", norma: "Publicidad financiera", texto: "Ejemplo representativo, no un caso excepcional" },
  { id: "R-07", norma: "Marca", texto: "Trato acordado; sin superlativos no verificables" },
  { id: "R-08", norma: "Consentimiento y audiencia", texto: "Exclusión de opt-out, mora 90+ y sin consentimiento" },
];

export const REGLAS_GAS: Regla[] = [
  { id: "R-01", norma: "Ley 19.496 · SERNAC", texto: "Precio final informado; sin publicidad engañosa" },
  { id: "R-02", norma: "Ley 21.398 · Pro Consumidor", texto: "Condiciones del beneficio accesibles antes de la compra" },
  { id: "R-03", norma: "SEC · seguridad de instalaciones", texto: "Nunca inducir a manipular la instalación sin instalador autorizado" },
  { id: "R-04", norma: "Precio y despacho", texto: "Declarar si el precio incluye el despacho o es retiro en punto de venta" },
  { id: "R-05", norma: "Canal de emergencia", texto: "Las piezas operativas informan el canal de emergencia de gas" },
  { id: "R-06", norma: "Bases de promoción", texto: "Vigencia, tope por RUT y acumulabilidad declarados en la pieza" },
  { id: "R-07", norma: "Marca", texto: "Trato acordado; sin superlativos no verificables" },
  { id: "R-08", norma: "Consentimiento y audiencia", texto: "Exclusión de opt-out y de clientes sin consentimiento" },
];

const SETS: Record<string, Regla[]> = {
  financiero: REGLAS_FINANCIERO,
  gas: REGLAS_GAS,
};

/* El set activo depende del sector de la institución seleccionada. */
export function reglasActivas(): Regla[] {
  try {
    const s = useSesion.getState().inst.sector;
    return SETS[s] || REGLAS_FINANCIERO;
  } catch {
    return REGLAS_FINANCIERO;
  }
}

/* Compatibilidad: el código existente importa REGLAS como arreglo.
   Se mantiene como proxy del set activo para no romper las vistas. */
export const REGLAS = new Proxy([] as Regla[], {
  get(_t, prop) {
    const arr = reglasActivas();
    const v = (arr as any)[prop];
    return typeof v === "function" ? v.bind(arr) : v;
  },
}) as Regla[];

export const regla = (id: string) =>
  reglasActivas().find((r) => r.id === id) || { id, norma: id, texto: "" };
