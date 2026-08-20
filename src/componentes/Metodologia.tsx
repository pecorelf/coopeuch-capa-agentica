import React, { useState } from "react";
import { MARCA as M } from "../datos/marca";
import { Etiqueta, Chip, Modal } from "./UI";

/* De dónde salen abre, entiende, confía y actúa. La pregunta aparece siempre en
   las reuniones y merece una respuesta precisa, no una promesa de precisión. */

export const DIMENSIONES = [
  {
    id: "abre",
    nombre: "Abre",
    escala: "0 a 100",
    que: "Probabilidad estimada de que el socio abra el mensaje.",
    entradas: "Largo del asunto, presencia de cifra, urgencia en la redacción, canal elegido y hábito declarado del perfil.",
    base:
      "Regresión simple sobre reglas de asunto documentadas en benchmarks de email marketing (largo, personalización, presencia de número). No es un modelo entrenado con datos de Coopeuch.",
    limite: "No predice la apertura real. Ordena qué asunto tiene más probabilidades que otro dentro del mismo segmento.",
  },
  {
    id: "entiende",
    nombre: "Entiende",
    escala: "1 a 5",
    que: "Qué tan comprensible resulta el mensaje para ese perfil.",
    entradas: "Índice de legibilidad de la pieza, cantidad de palabras, densidad de tecnicismos financieros y nivel lector atribuido al perfil.",
    base:
      "Es la dimensión con base metodológica más firme: parte del índice de Flesch-Szigriszt interpretado con la escala INFLESZ, validada para hábitos lectores en español (Barrio-Cantalejo et al., 2008, An Sist Sanit Navar 31-2), y lo cruza con el nivel lector del perfil.",
    limite: "Mide la forma del texto, no si el concepto financiero de fondo es familiar para el socio.",
  },
  {
    id: "confia",
    nombre: "Confía",
    escala: "1 a 5",
    que: "Cuánta credibilidad le da el socio al mensaje.",
    entradas: "Presencia del aviso antifraude, si hay cifras sin condiciones a la vista, si se declara permanencia, encuadre cooperativo y sensibilidad al fraude del perfil.",
    base:
      "Reglas derivadas de literatura de confianza en comunicación financiera y de patrones de suplantación documentados bajo la Ley 20.009. La ponderación por perfil es una hipótesis del equipo, no un parámetro medido.",
    limite: "No sustituye una medición de confianza con socios reales. Su valor está en detectar retrocesos entre versiones, no en el número absoluto.",
  },
  {
    id: "actua",
    nombre: "Actúa",
    escala: "0 a 100",
    que: "Intención declarada de hacer lo que pide la pieza.",
    entradas: "Comprensión y confianza calculadas, tipo de llamado a la acción, fricción del paso pedido y afinidad canal-perfil.",
    base:
      "Función compuesta sobre las dos dimensiones anteriores. Sigue la lógica de los modelos de intención tipo teoría del comportamiento planificado: sin comprensión ni confianza, la intención no se sostiene por más atractiva que sea la oferta.",
    limite: "Intención declarada no es conversión. La brecha entre ambas se calibra con resultados reales de campaña.",
  },
];

export function MetodologiaDimensiones({ compacto = false }: { compacto?: boolean }) {
  const [abierto, setAbierto] = useState(false);

  if (compacto) {
    return (
      <>
        <button onClick={() => setAbierto(true)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{
            width: 15, height: 15, borderRadius: 999, border: `1px solid ${M.gris}`, color: M.gris,
            fontSize: 9.5, display: "inline-flex", alignItems: "center", justifyContent: "center", fontStyle: "italic", fontWeight: 700,
          }}>i</span>
          <span className="font-mono" style={{ fontSize: 9.5, color: M.gris, letterSpacing: ".06em" }}>
            CÓMO SE CALCULAN ESTAS CUATRO MEDIDAS
          </span>
        </button>
        <Modal abierto={abierto} onCerrar={() => setAbierto(false)} ancho={880}
          titulo="De dónde salen abre, entiende, confía y actúa"
          subtitulo="Qué entra en cada medida, en qué se apoya y hasta dónde alcanza.">
          <Contenido />
        </Modal>
      </>
    );
  }
  return <Contenido />;
}

function Contenido() {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: M.gris, lineHeight: 1.7, marginBottom: 16 }}>
        Ninguna de las cuatro es un modelo entrenado con datos de Coopeuch: son funciones de reglas que cruzan rasgos
        medibles del texto con los atributos declarados de cada perfil. Sirven para comparar versiones entre sí, no para
        pronosticar el resultado de una campaña. La calibración con datos reales de desempeño es parte de la primera
        etapa del proyecto.
      </div>

      <div className="grid gap-3">
        {DIMENSIONES.map((d) => (
          <div key={d.id} style={{ border: `1px solid ${M.linea}`, borderRadius: 12, padding: 14 }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>{d.nombre}</span>
              <Chip>{d.escala}</Chip>
            </div>
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.6 }}>{d.que}</div>

            <div className="grid gap-3 md:grid-cols-3 mt-3">
              <div>
                <Etiqueta>Qué entra</Etiqueta>
                <div style={{ fontSize: 11.5, color: M.gris, marginTop: 3, lineHeight: 1.55 }}>{d.entradas}</div>
              </div>
              <div>
                <Etiqueta>En qué se apoya</Etiqueta>
                <div style={{ fontSize: 11.5, color: M.gris, marginTop: 3, lineHeight: 1.55 }}>{d.base}</div>
              </div>
              <div>
                <Etiqueta color={M.alerta}>Hasta dónde alcanza</Etiqueta>
                <div style={{ fontSize: 11.5, color: M.gris, marginTop: 3, lineHeight: 1.55 }}>{d.limite}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: 13, background: M.niebla, borderRadius: 12 }}>
        <Etiqueta color={M.tinta}>Marcos de referencia</Etiqueta>
        <div style={{ fontSize: 11.5, color: M.gris, marginTop: 6, lineHeight: 1.7 }}>
          Legibilidad: Flesch-Szigriszt (Szigriszt-Pazos, 1993) y Fernández Huerta (1959), interpretados con la escala
          INFLESZ (Barrio-Cantalejo et al., 2008). · Intención: lógica de la teoría del comportamiento planificado
          (Ajzen, 1991), donde la intención depende de actitud y control percibido. · Confianza en comunicación
          financiera: patrones de suplantación documentados bajo la Ley 20.009 y criterios de publicidad de la Ley
          19.496. · Simulación con perfiles sintéticos: práctica emergente en investigación de mercado, útil para
          ordenar hipótesis antes del trabajo de campo y no para reemplazarlo.
        </div>
      </div>
    </div>
  );
}
