import type { Regla } from "../lib/tipos";

/* Aproximacion de trabajo del set normativo. Se reemplaza por el set real de la
   cooperativa en la primera etapa del proyecto. */
export const REGLAS: Regla[] = [
  { id: "R-01", norma: "Ley 21.398", texto: "Características generales del producto informadas y accesibles" },
  { id: "R-02", norma: "Ley 19.496 · SERNAC Financiero", texto: "Sin publicidad engañosa; condiciones esenciales visibles" },
  { id: "R-03", norma: "CMF · garantía estatal", texto: "Leyenda de garantía estatal de depósitos cuando aplique" },
  { id: "R-04", norma: "CAE y costo total del crédito", texto: "CAE, costo total y plazo cuando se comunica una oferta crediticia" },
  { id: "R-05", norma: "Ley 20.009", texto: "Sin solicitud de claves ni datos sensibles por canal digital" },
  { id: "R-06", norma: "Publicidad financiera", texto: "Ejemplo representativo, no un caso excepcional" },
  { id: "R-07", norma: "Marca Coopeuch", texto: "Trato de socio, nunca cliente; sin superlativos no verificables" },
  { id: "R-08", norma: "Consentimiento y audiencia", texto: "Exclusión de opt-out, mora 90+ y socios sin consentimiento" },
];

export const regla = (id: string) => REGLAS.find((r) => r.id === id)!;
