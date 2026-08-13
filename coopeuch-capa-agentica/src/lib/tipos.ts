export type EstadoRegla = "cumple" | "ajustar" | "bloquea" | "no aplica";

export interface Regla { id: string; norma: string; texto: string; }

export interface EvaluacionRegla { id: string; estado: EstadoRegla; evidencia: string; }

export interface Pieza {
  asunto: string;
  preheader: string;
  titular: string;
  cuerpo: string[];
  cta: string;
  legal?: string;
}

export interface Persona {
  id: string; nombre: string; edad: number; ciudad: string; perfil: string;
  anclaje: string; validez: "Alta" | "Media" | "Baja"; rasgo: string;
  antiguedad: string;
  productos: string[];
  canales: string[];
  digital: "Alta" | "Media" | "Baja";
  sensibilidades: string[];
  motivaciones: string[];
  frenos: string[];
  comoLee: string;
  fuentes: string[];
  representa: string;
}

export interface Reaccion {
  id: string; abre: number; entiende: number; confia: number; actua: number;
  objecion: string; frase: string;
}

export interface Modulo {
  id: string; nombre: string; origen: "biblioteca" | "nuevo"; usos?: number; tipo?: string;
}

export type Veredicto = "apto" | "apto con ajustes" | "no apto";

export interface Variante {
  id: "A" | "B" | "C";
  nombre: string;
  hipotesis: string;
  pieza: Pieza;
  imagen: string;
  veredicto: Veredicto;
  hallazgos: EvaluacionRegla[];
}

export interface Caso {
  id: string; nombre: string; producto: string; segmento: string; objetivo: string;
  canal: string; tono: string; contexto: string; fuente: string; brief: string; riesgo: string;
  estrategia: { angulo: string; promesa: string; riesgo: string; kpi: string };
  variantes: Variante[];
  notaCompliance: string;
  panelSegmento: string[];
  reacciones: Record<string, Reaccion[]>;
  ganador: "A" | "B" | "C";
  razonGanador: string;
  correcciones: string[];
  piezaFinal: Pieza;
  imagenFinal: string;
  cambios: string[];
  reaccionesFinal: Reaccion[];
  reglasFinal: EvaluacionRegla[];
  modulos: Modulo[];
  activacion: {
    dataExtension: string; journey: string; excluir: string[];
    personalizacion: string[]; ventana: string;
  };
  aprendizaje: { tipo: string; nombre: string }[];
}
