import type { Caso, Reaccion } from "../lib/tipos";
import { ILU_TRANSFERENCIA, ILU_CREDITO, ILU_REMANENTE } from "./ilustraciones";

/* Tres campañas construidas sobre hechos publicos y verificables de Coopeuch al
   28-07-2026. Cada caso declara su fuente. El guion es fijo a proposito: la
   presentacion tiene que salir igual todas las veces.
   Cada caso genera tres variantes (A/B/C) con hipotesis distintas y las prueba
   con el panel del segmento antes de elegir. */

const r = (id: string, abre: number, entiende: number, confia: number, actua: number, objecion: string, frase: string): Reaccion =>
  ({ id, abre, entiende, confia, actua, objecion, frase });

export const CASOS: Caso[] = [
  /* ============ CASO 1 · Transferencias sin costo ============ */
  {
    id: "C1",
    nombre: "Transferencias sin costo",
    producto: "Cuenta Vista",
    segmento: "Socios con Cuenta Vista de baja transaccionalidad",
    objetivo: "Activar uso del producto",
    canal: "Email + Push AppCoopeuch",
    tono: "Cooperativo cercano",
    contexto:
      "Desde el 1 de julio de 2026 los socios pueden hacer transferencias electrónicas sin costo. No es una promoción: es un cambio permanente de tarifa, con el objetivo declarado de que la Cuenta Vista pase a ser el centro de la gestión financiera del socio.",
    fuente: "Comunicado Coopeuch, julio 2026 · prensa nacional",
    brief:
      "Comunicar la eliminación del cobro por transferencias electrónicas a los socios que tienen Cuenta Vista pero casi no la usan, e invitarlos a mover ahí su operación diaria.",
    riesgo:
      "El socio de baja actividad ya decidió que su cuenta principal es otra. Un correo que suene a promoción refuerza la sospecha de que el beneficio tiene letra chica o fecha de término.",

    estrategia: {
      angulo: "No es una oferta que vence: es una tarifa que cambió y se queda.",
      promesa: "Sus transferencias desde la Cuenta Vista ya no tienen costo.",
      riesgo: "Que se lea como promoción temporal y el socio archive el correo sin actuar.",
      kpi: "Socios con primera transferencia en 30 días sobre la base contactada.",
    },

    variantes: [
      {
        id: "A",
        nombre: "Beneficio",
        hipotesis: "Enmarcarlo como beneficio de ser socio genera más apertura.",
        imagen: ILU_TRANSFERENCIA,
        veredicto: "apto con ajustes",
        hallazgos: [
          { id: "R-02", estado: "ajustar", evidencia: "«Gratis» sin precisar alcance ni permanencia" },
          { id: "R-07", estado: "ajustar", evidencia: "Habla del socio en tercera persona" },
        ],
        pieza: {
          asunto: "Nelson, transferir desde tu Cuenta Vista ahora es gratis",
          preheader: "Un beneficio más de pertenecer a la cooperativa.",
          titular: "Transferencias gratis para nuestros socios",
          cuerpo: [
            "Como socio de Coopeuch, ahora puedes transferir sin pagar comisión desde tu Cuenta Vista. Un beneficio más de pertenecer a la cooperativa.",
            "Entra a AppCoopeuch y haz tu primera transferencia hoy mismo.",
          ],
          cta: "Transferir ahora",
        },
      },
      {
        id: "B",
        nombre: "Cambio de tarifa",
        hipotesis: "Declararlo como cambio permanente resuelve la desconfianza de origen.",
        imagen: ILU_TRANSFERENCIA,
        veredicto: "apto",
        hallazgos: [
          { id: "R-02", estado: "cumple", evidencia: "Declara alcance y permanencia" },
          { id: "R-03", estado: "ajustar", evidencia: "Falta leyenda de garantía estatal en el pie" },
        ],
        pieza: {
          asunto: "Nelson, tus transferencias ya no tienen comisión",
          preheader: "Cambio permanente de tarifa, sin tope de operaciones.",
          titular: "Ya no cobramos comisión por transferir",
          cuerpo: [
            "Desde el 1 de julio, las transferencias electrónicas desde tu Cuenta Vista no tienen comisión. No es una promoción con fecha de término: es la tarifa que rige de aquí en adelante.",
            "Aplica a cuentas de Coopeuch y de otras instituciones, sin límite de operaciones.",
          ],
          cta: "Ver mi Cuenta Vista",
        },
      },
      {
        id: "C",
        nombre: "Cooperativa",
        hipotesis: "Explicar la decisión desde el modelo cooperativo construye vínculo, no solo uso.",
        imagen: ILU_TRANSFERENCIA,
        veredicto: "apto con ajustes",
        hallazgos: [
          { id: "R-01", estado: "ajustar", evidencia: "El cambio concreto queda en segundo plano" },
          { id: "R-07", estado: "cumple", evidencia: "Voz cooperativa consistente" },
        ],
        pieza: {
          asunto: "Nelson, por qué dejamos de cobrarle a los socios por transferir",
          preheader: "Una decisión que se toma cuando los dueños son los socios.",
          titular: "Dejamos de cobrar por transferir",
          cuerpo: [
            "En una cooperativa los socios son los dueños, así que cobrarles por mover su propio dinero deja de tener sentido. Por eso, desde julio, las transferencias electrónicas no tienen comisión.",
            "Es un cambio permanente y aplica a todas tus transferencias, dentro y fuera de Coopeuch.",
          ],
          cta: "Ver mi Cuenta Vista",
        },
      },
    ],
    notaCompliance:
      "Las tres variantes son publicables, pero solo una declara el alcance y la permanencia. En una comunicación de tarifa eso no es un matiz de estilo: es lo que después evita el reclamo.",

    panelSegmento: ["P10", "P3", "P8", "P9"],
    reacciones: {
      A: [
        r("P10", 38, 4, 2, 12, "No cree que sea permanente", "Gratis por ahora, después empiezan a cobrar igual."),
        r("P3", 44, 4, 3, 27, "Da por hecho que transferir es gratis", "Eso en mi otra cuenta lo tengo hace años."),
        r("P8", 51, 3, 3, 31, "No sabe si aplica a lo que él hace", "¿Sirve para pagarle a mi arrendador o no?"),
        r("P9", 62, 4, 4, 34, "Quiere confirmarlo antes de cambiar su rutina", "Voy a preguntar en la sucursal, por si acaso."),
      ],
      B: [
        r("P10", 55, 5, 4, 44, "Aún compara con su banco principal", "Si es permanente de verdad, me sirve para el arriendo."),
        r("P3", 49, 5, 4, 38, "Quiere verlo en la app, no en el correo", "Al menos ahora sé que no hay tope."),
        r("P8", 58, 5, 4, 53, "Resuelta la duda de alcance", "Perfecto, entonces le puedo transferir a cualquiera."),
        r("P9", 66, 5, 5, 46, "Prefiere igual confirmar en sucursal", "Está claro, pero igual paso a preguntar."),
      ],
      C: [
        r("P10", 47, 4, 4, 33, "El argumento no le cambia la decisión", "Bonito el discurso, pero yo miro si me sirve."),
        r("P3", 58, 4, 4, 35, "El encuadre le gusta más que el beneficio", "Esto sí suena distinto a un banco."),
        r("P8", 44, 3, 4, 28, "Tarda en llegar a lo concreto", "Me perdí un poco antes de entender qué cambió."),
        r("P9", 61, 4, 5, 37, "Le da confianza el tono", "Me gusta que expliquen por qué lo hacen."),
      ],
    },
    ganador: "B",
    razonGanador:
      "B gana en las cuatro dimensiones del segmento. No es la que mejor suena: es la que responde la objeción real, que era la permanencia. C tiene mejor confianza en dos perfiles y sirve para socios con vínculo cooperativo fuerte, no para este segmento.",

    correcciones: [
      "Insertar módulo M-031 con la leyenda de garantía estatal de depósitos.",
      "Aplicar filtro de audiencia con exclusión de opt-out, mora 90+ y sin consentimiento.",
      "Incorporar de C la explicación del porqué, en una línea, sin desplazar el dato.",
    ],
    piezaFinal: {
      asunto: "Nelson, tus transferencias en Coopeuch ya no tienen comisión",
      preheader: "Cambio permanente de tarifa. Aplica a transferencias electrónicas, sin tope de operaciones.",
      titular: "Ya no cobramos comisión por transferir",
      cuerpo: [
        "Desde el 1 de julio, transferir desde tu Cuenta Vista no tiene comisión. No es una promoción: es la tarifa que rige de ahora en adelante.",
        "Vale para cuentas de Coopeuch y de otros bancos, sin tope. Lo decidimos así porque acá los dueños son los socios.",
      ],
      cta: "Ver mi Cuenta Vista",
    },
    imagenFinal: ILU_TRANSFERENCIA,
    cambios: [
      "Se toma la estructura de B, que resolvió la objeción de permanencia.",
      "Se suma una línea del encuadre cooperativo de C, en frases más cortas.",
      "Se agrega el pie con garantía estatal que faltaba.",
      "El CTA baja la fricción: mirar la cuenta, no ejecutar una transferencia.",
    ],
    reaccionesFinal: [
      r("P10", 57, 5, 4, 48, "Aún compara con su banco principal", "Ahora sí entiendo qué cambió y por qué."),
      r("P3", 53, 5, 4, 41, "Quiere verlo en la app", "Corto y claro, esto sí lo leo."),
      r("P8", 60, 5, 5, 56, "Ninguna relevante", "Queda claro que sirve para todo."),
      r("P9", 69, 5, 5, 49, "Confirmaría igual en sucursal", "Está bien explicado, lo entiendo sola."),
    ],
    reglasFinal: [
      { id: "R-01", estado: "cumple", evidencia: "Producto y operación afectada identificados" },
      { id: "R-02", estado: "cumple", evidencia: "Alcance y permanencia declarados" },
      { id: "R-03", estado: "cumple", evidencia: "Leyenda de garantía estatal incorporada" },
      { id: "R-04", estado: "no aplica", evidencia: "No comunica oferta crediticia" },
      { id: "R-05", estado: "cumple", evidencia: "No solicita claves ni datos por el canal" },
      { id: "R-06", estado: "cumple", evidencia: "Sin ejemplo numérico que requiera representatividad" },
      { id: "R-07", estado: "cumple", evidencia: "Trato directo al socio, voz cooperativa" },
      { id: "R-08", estado: "cumple", evidencia: "Exclusiones de audiencia aplicadas" },
    ],
    modulos: [
      { id: "M-011", nombre: "Encabezado socio + saludo nominal", origen: "biblioteca" },
      { id: "M-058", nombre: "Tabla comparativa antes / después", origen: "biblioteca" },
      { id: "M-071", nombre: "Bloque de alcance de tarifa", origen: "nuevo" },
      { id: "M-031", nombre: "Pie con garantía estatal CMF", origen: "biblioteca" },
    ],
    activacion: {
      dataExtension: "DE_CuentaVista_BajaTransaccionalidad_2026",
      journey: "JB_TEF_SinCosto_H2_2026",
      excluir: ["opt_out", "mora_90", "sin_consentimiento", "cuenta_bloqueada"],
      personalizacion: ["%%NombreSocio%%", "%%UltimaTransferencia%%", "%%CanalPreferido%%"],
      ventana: "Martes a jueves, 10:00-12:00",
    },
    aprendizaje: [
      { tipo: "Módulo HTML", nombre: "Bloque de alcance de tarifa" },
      { tipo: "Regla de tono", nombre: "Un cambio permanente se declara como tarifa, no como beneficio" },
      { tipo: "Hallazgo de panel", nombre: "Baja transaccionalidad objeta permanencia, no precio" },
    ],
  },

  /* ============ CASO 2 · Portabilidad para pensionados ============ */
  {
    id: "C2",
    nombre: "Portabilidad para pensionados",
    producto: "Crédito de Consumo · Portabilidad Financiera",
    segmento: "Socios pensionados con crédito vigente en otra institución",
    objetivo: "Captar operación de crédito",
    canal: "Email",
    tono: "Institucional sobrio",
    contexto:
      "Coopeuch tiene un producto específico de Crédito Pensionados y ofrece portabilidad financiera. Es el segmento donde la cooperativa tiene más profundidad histórica y, a la vez, el que concentra la mayor exposición a fraudes por suplantación.",
    fuente: "Sitio público Coopeuch · Ley 21.236 de portabilidad financiera",
    brief:
      "Invitar a socios pensionados que tienen un crédito en otra institución a portar su deuda a Coopeuch, mostrando el ahorro posible en la cuota mensual.",
    riesgo:
      "Es una comunicación crediticia dirigida a un segmento protegido. Cualquier cifra sin CAE ni costo total expone a la cooperativa, y el segmento es el más propenso a leer el correo como intento de estafa.",

    estrategia: {
      angulo: "La portabilidad como un trámite que la cooperativa hace por el socio, no como una oferta.",
      promesa: "Podemos revisar si le conviene traer su crédito, sin compromiso.",
      riesgo: "Prometer un ahorro específico antes de evaluar convierte la pieza en publicidad engañosa.",
      kpi: "Simulaciones iniciadas y contactos verificados por canal seguro.",
    },

    variantes: [
      {
        id: "A",
        nombre: "Cifra grande",
        hipotesis: "Un número alto en el asunto maximiza la apertura.",
        imagen: ILU_CREDITO,
        veredicto: "no apto",
        hallazgos: [
          { id: "R-04", estado: "bloquea", evidencia: "Falta CAE, costo total y plazo" },
          { id: "R-06", estado: "bloquea", evidencia: "Sin ejemplo representativo del ahorro" },
          { id: "R-05", estado: "bloquea", evidencia: "Pide ingresar datos desde un enlace de correo" },
        ],
        pieza: {
          asunto: "Rosa, baja tu cuota hasta en un 40% con Coopeuch",
          preheader: "Trae tu crédito a tu cooperativa y paga menos cada mes.",
          titular: "Paga hasta 40% menos al mes",
          cuerpo: [
            "Sabemos que tienes un crédito en otra institución. Tráelo a Coopeuch con portabilidad financiera y podrías bajar tu cuota hasta en un 40%.",
            "Solo tienes que hacer clic e ingresar tus datos para conocer tu oferta preaprobada.",
          ],
          cta: "Ver mi oferta preaprobada",
        },
      },
      {
        id: "B",
        nombre: "Ejemplo representativo",
        hipotesis: "Mostrar un caso completo con CAE convierte mejor que una promesa.",
        imagen: ILU_CREDITO,
        veredicto: "apto",
        hallazgos: [
          { id: "R-04", estado: "cumple", evidencia: "CAE, costo total y plazo en la pieza" },
          { id: "R-06", estado: "cumple", evidencia: "Ejemplo declarado como referencial" },
        ],
        pieza: {
          asunto: "Rosa, así se ve una portabilidad en Coopeuch",
          preheader: "Un ejemplo con tasa, cuota y costo total. Sin ingresar datos por este correo.",
          titular: "Un ejemplo, para que compare",
          cuerpo: [
            "Si tiene un crédito en otra institución, puede traerlo a su cooperativa. Para que compare con lo suyo, este es un caso de referencia con todas sus condiciones a la vista.",
            "La evaluación es gratuita y se hace en sucursal, por AppCoopeuch o llamando al número del reverso de su tarjeta.",
          ],
          cta: "Cómo pedir la evaluación",
          legal:
            "Ejemplo representativo correspondiente a un crédito de $3.000.000 a 36 meses, con una tasa de interés de 1,35% mensual y una Carga Anual Equivalente de 21,4%, resultando en una cuota mensual de $122.400 y un costo total del crédito de $4.406.400, valores referenciales sujetos a evaluación comercial.",
        },
      },
      {
        id: "C",
        nombre: "Sin cifra",
        hipotesis: "En un segmento que teme el fraude, no prometer nada genera más confianza.",
        imagen: ILU_CREDITO,
        veredicto: "apto",
        hallazgos: [
          { id: "R-04", estado: "no aplica", evidencia: "No comunica condiciones de una oferta" },
          { id: "R-05", estado: "cumple", evidencia: "Deriva a canales verificables por el socio" },
        ],
        pieza: {
          asunto: "Rosa, podemos revisar si le conviene traer su crédito",
          preheader: "Sin compromiso y sin ingresar datos por este correo.",
          titular: "¿Le conviene traer su crédito a Coopeuch?",
          cuerpo: [
            "Si tiene un crédito en otra institución, la portabilidad le permite traerlo a su cooperativa. Si le conviene depende de su tasa, del plazo que le queda y del saldo: por eso no le anticipamos un número.",
            "La revisión es gratuita. Puede pedirla en cualquier sucursal, por AppCoopeuch o llamando al número del reverso de su tarjeta. Coopeuch nunca le pedirá claves por correo.",
          ],
          cta: "Cómo pedir la evaluación",
        },
      },
    ],
    notaCompliance:
      "La variante A queda detenida antes de salir del área. Hoy ese freno llega después de tres vueltas entre marketing, diseño y legal; acá ocurre en el momento de la generación y con la regla citada.",

    panelSegmento: ["P1", "P2", "P6", "P9"],
    reacciones: {
      A: [
        r("P1", 66, 3, 2, 9, "El 40% le suena a promesa imposible", "Cuarenta por ciento menos, ¿y dónde está la trampa?"),
        r("P2", 54, 4, 2, 14, "No hay tasa ni cuota concreta", "Sin la tasa esto no me dice nada."),
        r("P6", 19, 3, 1, 3, "Lo clasifica como estafa", "Me piden datos por un link, ni loco."),
        r("P9", 58, 4, 3, 16, "Quiere que se lo expliquen en persona", "Prefiero que me lo digan en la sucursal."),
      ],
      B: [
        r("P1", 61, 4, 4, 38, "El bloque de condiciones le cuesta", "Veo la tasa, pero esa letra chica es dura."),
        r("P2", 68, 5, 5, 51, "Ninguna relevante", "Ahora sí puedo comparar con lo que pago."),
        r("P6", 41, 4, 4, 27, "Verifica igual antes de actuar", "Me tranquiliza que no me pidan nada."),
        r("P9", 63, 4, 5, 44, "La letra chica es difícil de leer", "Está todo, pero hay que leerlo dos veces."),
      ],
      C: [
        r("P1", 69, 5, 4, 33, "Le falta algo concreto para decidir", "Me explican por qué no me dan el monto."),
        r("P2", 57, 5, 4, 36, "Sin cifra no puede compararlo", "Está claro, pero no me dice cuánto."),
        r("P6", 46, 5, 5, 31, "Ninguna relevante", "Este correo sí parece de la cooperativa."),
        r("P9", 66, 5, 5, 47, "Ninguna relevante", "Sé exactamente adónde tengo que ir."),
      ],
    },
    ganador: "B",
    razonGanador:
      "B convierte más que C y resuelve el bloqueo normativo, pero arrastra un problema que el panel detecta y que la métrica de legibilidad confirma: el bloque de condiciones es mucho más difícil de leer que el resto de la pieza. La final toma B y le aplica el trabajo de C sobre la confianza.",

    correcciones: [
      "Reescribir el bloque de condiciones en frases cortas, sin perder ningún dato exigido.",
      "Incorporar el aviso antifraude explícito que C tenía y B había perdido.",
      "Restringir la audiencia a socios con evaluación crediticia vigente.",
    ],
    piezaFinal: {
      asunto: "Rosa, así se ve una portabilidad en Coopeuch",
      preheader: "Con tasa, cuota y costo total a la vista. No pedimos datos por este correo.",
      titular: "Un ejemplo, para que compare",
      cuerpo: [
        "Si tiene un crédito en otra institución, puede traerlo a su cooperativa. Para que lo compare con lo suyo, acá va un caso de referencia con todas las condiciones a la vista.",
        "La evaluación es gratuita y se hace en sucursal, por AppCoopeuch o llamando al número del reverso de su tarjeta. Coopeuch nunca le pide claves ni datos por correo.",
      ],
      cta: "Cómo pedir la evaluación",
      legal:
        "Ejemplo de referencia. El crédito es de $3.000.000 a 36 meses. La cuota es de $122.400. La tasa es 1,35% al mes y la CAE es 21,4%. En total paga $4.406.400. Su caso puede ser distinto: depende de su evaluación.",
    },
    imagenFinal: ILU_CREDITO,
    cambios: [
      "El bloque legal se reescribe en frases cortas: el dato es el mismo, la lectura no.",
      "Vuelve el aviso antifraude que C tenía y que B había perdido.",
      "Se explicita que el ejemplo es de referencia y que el caso propio puede diferir.",
      "La audiencia se restringe a socios con evaluación vigente.",
    ],
    reaccionesFinal: [
      r("P1", 64, 5, 5, 44, "Quiere su número propio", "Ahora entiendo la letra chica sin lentes."),
      r("P2", 70, 5, 5, 55, "Ninguna relevante", "Comparo al tiro con lo que estoy pagando."),
      r("P6", 48, 5, 5, 36, "Verifica igual, por costumbre", "Dice que no piden claves, eso me deja tranquilo."),
      r("P9", 68, 5, 5, 52, "Ninguna relevante", "Está todo, y se entiende."),
    ],
    reglasFinal: [
      { id: "R-01", estado: "cumple", evidencia: "Mecánica de portabilidad explicada" },
      { id: "R-02", estado: "cumple", evidencia: "Sin promesa sin sustento" },
      { id: "R-03", estado: "no aplica", evidencia: "No comunica producto de depósito" },
      { id: "R-04", estado: "cumple", evidencia: "CAE, costo total y plazo presentes" },
      { id: "R-05", estado: "cumple", evidencia: "Deriva a canales verificables" },
      { id: "R-06", estado: "cumple", evidencia: "Ejemplo declarado como referencial" },
      { id: "R-07", estado: "cumple", evidencia: "Trato de usted, consistente con el segmento" },
      { id: "R-08", estado: "cumple", evidencia: "Audiencia con evaluación vigente" },
    ],
    modulos: [
      { id: "M-011", nombre: "Encabezado socio + saludo nominal", origen: "biblioteca" },
      { id: "M-023", nombre: "Bloque de condiciones con CAE y costo total", origen: "biblioteca" },
      { id: "M-044", nombre: "Aviso antifraude · no pedimos claves", origen: "biblioteca" },
      { id: "M-079", nombre: "Ejemplo representativo legible", origen: "nuevo" },
      { id: "M-031", nombre: "Pie con garantía estatal CMF", origen: "biblioteca" },
    ],
    activacion: {
      dataExtension: "DE_Pensionados_Portabilidad_2026",
      journey: "JB_Portabilidad_Pensionados_H2_2026",
      excluir: ["opt_out", "mora_90", "sin_consentimiento", "sin_evaluacion_vigente", "deuda_alimentos"],
      personalizacion: ["%%NombreSocio%%", "%%SucursalCercana%%"],
      ventana: "Lunes a miércoles, 11:00-13:00",
    },
    aprendizaje: [
      { tipo: "Módulo HTML", nombre: "Ejemplo representativo legible" },
      { tipo: "Regla de compliance", nombre: "Cifra de ahorro exige ejemplo representativo en la misma pieza" },
      { tipo: "Hallazgo de panel", nombre: "En pensionados, la promesa alta baja la confianza" },
    ],
  },

  /* ============ CASO 3 · Cuotas de participación ============ */
  {
    id: "C3",
    nombre: "Cuotas de participación",
    producto: "Cuotas de participación · Remanente",
    segmento: "Socios activos con capital social bajo",
    objetivo: "Educar y fortalecer vínculo",
    canal: "Email + WhatsApp",
    tono: "Cooperativo cercano",
    contexto:
      "En 2026 Coopeuch distribuyó $72.178 millones de Remanente entre 1.284.000 socios vigentes al cierre de 2025, sobre un resultado total de $94.047 millones. El cálculo combina capital social y uso de productos. El proceso 2027 se define con lo que ocurra durante 2026 y lo aprueba la Junta de Delegados en abril.",
    fuente: "Comunicado Coopeuch abril 2026 · sitio público · prensa nacional",
    brief:
      "Explicar a los socios con capital social bajo cómo se calcula el Remanente y qué relación tiene con sus cuotas de participación, antes del cierre del ejercicio 2026.",
    riesgo:
      "Es el terreno más delicado de la cooperativa: hablar de aumentar cuotas puede leerse como venderle al socio algo que ya es suyo, y el Remanente es el gancho más usado por las estafas que suplantan a Coopeuch.",

    estrategia: {
      angulo: "Explicar el mecanismo, no empujar el producto: el socio decide con la regla a la vista.",
      promesa: "Puede entender exactamente de qué depende su Remanente.",
      riesgo: "Prometer un monto futuro. El Remanente depende del resultado del ejercicio y lo aprueba la Junta.",
      kpi: "Lectura completa y consultas informadas, no aumento inmediato de cuotas.",
    },

    variantes: [
      {
        id: "A",
        nombre: "Incentivo",
        hipotesis: "Vincular aporte y retorno mueve la aguja del capital social.",
        imagen: ILU_REMANENTE,
        veredicto: "no apto",
        hallazgos: [
          { id: "R-02", estado: "bloquea", evidencia: "«Asegura tu Remanente» sugiere resultado garantizado" },
          { id: "R-01", estado: "ajustar", evidencia: "Describe el cálculo de forma incompleta" },
        ],
        pieza: {
          asunto: "Fernanda, aumenta tus cuotas y recibe más Remanente en 2027",
          preheader: "Mientras más aportas, más recibes el próximo abril.",
          titular: "Más cuotas, más Remanente",
          cuerpo: [
            "El Remanente se reparte según tu capital social. Si aumentas tus cuotas de participación este año, en abril de 2027 vas a recibir más.",
            "Aumenta tu cuota mensual hoy y asegura tu Remanente del próximo año.",
          ],
          cta: "Aumentar mi cuota",
        },
      },
      {
        id: "B",
        nombre: "Explicativa",
        hipotesis: "Explicar la regla completa produce mejores decisiones y menos reclamos.",
        imagen: ILU_REMANENTE,
        veredicto: "apto con ajustes",
        hallazgos: [
          { id: "R-01", estado: "cumple", evidencia: "Los dos factores del cálculo declarados" },
          { id: "R-05", estado: "ajustar", evidencia: "Falta aviso antifraude en pieza sobre Remanente" },
        ],
        pieza: {
          asunto: "Fernanda, de qué depende su Remanente: la regla completa",
          preheader: "Capital social y uso de productos. Sin proyectar montos.",
          titular: "Cómo se calcula su Remanente",
          cuerpo: [
            "El Remanente se distribuye según dos factores: el capital social que mantiene en cuotas de participación y el uso que hace de los productos durante el año. En 2026 se distribuyeron $72.178 millones entre 1.284.000 socios.",
            "Lo que ocurra este año define el proceso de 2027, que aprueba la Junta de Delegados en abril. No podemos anticiparle un monto: depende del resultado del ejercicio.",
          ],
          cta: "Ver cómo se calcula",
        },
      },
      {
        id: "C",
        nombre: "Pertenencia",
        hipotesis: "Recordar que el socio es copropietario activa más que cualquier cifra.",
        imagen: ILU_REMANENTE,
        veredicto: "apto con ajustes",
        hallazgos: [
          { id: "R-07", estado: "cumple", evidencia: "Voz cooperativa fuerte" },
          { id: "R-01", estado: "ajustar", evidencia: "El mecanismo queda implícito" },
        ],
        pieza: {
          asunto: "Fernanda, usted es dueña de esta cooperativa",
          preheader: "Y por eso recibe parte de su resultado cada año.",
          titular: "Su parte del resultado",
          cuerpo: [
            "Cuando entró a Coopeuch no se hizo clienta: se hizo copropietaria. Por eso, cada año, parte del resultado de la cooperativa vuelve a usted y no a un accionista.",
            "Cuánto le corresponde depende de su participación y de cuánto usa la cooperativa durante el año.",
          ],
          cta: "Ver cómo se calcula",
        },
      },
    ],
    notaCompliance:
      "El problema de la variante A no es de estilo: describe mal el mecanismo y promete un resultado que la Junta todavía no aprueba. La corrección no es suavizarla, es corregir el hecho.",

    panelSegmento: ["P7", "P4", "P5", "P9"],
    reacciones: {
      A: [
        r("P7", 74, 4, 3, 22, "Le molesta que le vendan lo que ya es suyo", "El Remanente es mío por ser socia, no un producto."),
        r("P4", 57, 3, 3, 19, "No sabe cuánto tendría que aportar", "¿Más cuotas cuánto? Sin número no evalúo."),
        r("P5", 49, 3, 3, 15, "Duda de que sea solo el capital", "Me dijeron que también cuenta cuánto uso los productos."),
        r("P9", 63, 4, 4, 28, "Quiere saber si puede volver atrás", "Si subo la cuota, ¿después la puedo bajar?"),
      ],
      B: [
        r("P7", 78, 5, 5, 41, "Ninguna relevante", "Esto sí es hablarle a una socia."),
        r("P4", 62, 5, 4, 37, "Aún quiere simular su caso", "Entiendo la regla, me falta mi número."),
        r("P5", 58, 5, 5, 40, "Ninguna relevante", "Ah, entonces sí contaba el uso."),
        r("P9", 67, 4, 5, 38, "Sigue con la duda de reversibilidad", "Falta decir si uno puede bajar la cuota."),
      ],
      C: [
        r("P7", 84, 5, 5, 46, "Ninguna relevante", "Me leyeron la cabeza, esto es la cooperativa."),
        r("P4", 54, 4, 4, 24, "Le falta la mecánica concreta", "Bonito, pero no me dice cómo se calcula."),
        r("P5", 61, 4, 4, 29, "Se queda a medio camino", "Me gustó, aunque igual no entendí el cálculo."),
        r("P9", 65, 4, 5, 31, "Quiere el detalle operativo", "Lindo el mensaje, ¿y los números?"),
      ],
    },
    ganador: "B",
    razonGanador:
      "C es la que más gusta y la que menos sirve: gana en confianza con la socia cooperativista y pierde en comprensión con todos los demás. B convierte mejor de forma pareja. La final es B abriendo con la primera línea de C.",

    correcciones: [
      "Insertar módulo M-044 con el aviso antifraude, obligatorio en toda pieza sobre Remanente.",
      "Abrir con el encuadre de copropiedad de C antes de entrar al cálculo.",
      "Excluir del envío a socios con cuotas de participación en mora.",
    ],
    piezaFinal: {
      asunto: "Fernanda, de qué depende su Remanente",
      preheader: "Capital social y uso de productos. Le explicamos la regla, sin proyectar montos.",
      titular: "Cómo se calcula su Remanente",
      cuerpo: [
        "Usted no es clienta de Coopeuch: es copropietaria. Por eso cada año parte del resultado vuelve a los socios. En 2026 se repartieron $72.178 millones entre 1.284.000 personas.",
        "Su parte depende de dos cosas: el capital que mantiene en cuotas y cuánto usa la cooperativa durante el año. Lo de 2027 lo aprueba la Junta en abril, así que no podemos anticiparle un monto.",
      ],
      cta: "Ver cómo se calcula",
      legal:
        "Coopeuch nunca le pide claves ni datos personales por correo, WhatsApp o teléfono para entregarle el Remanente. Si tiene dudas, verifique en AppCoopeuch o en una sucursal.",
    },
    imagenFinal: ILU_REMANENTE,
    cambios: [
      "Abre con la copropiedad, que era lo que más movía a la socia cooperativista.",
      "Mantiene los dos factores del cálculo y la cifra real de 2026.",
      "El aviso antifraude sube de pie de página a contenido.",
      "Frases más cortas: el índice de lectura sube sin perder ningún dato.",
    ],
    reaccionesFinal: [
      r("P7", 83, 5, 5, 49, "Ninguna relevante", "Empieza por lo que importa y después explica."),
      r("P4", 64, 5, 5, 42, "Quiere simular su caso", "Ahora sí entiendo de qué depende."),
      r("P5", 62, 5, 5, 44, "Ninguna relevante", "Clarísimo, y sin promesas raras."),
      r("P9", 70, 5, 5, 43, "Duda de reversibilidad pendiente", "Me falta saber si puedo bajar la cuota después."),
    ],
    reglasFinal: [
      { id: "R-01", estado: "cumple", evidencia: "Los dos factores del cálculo declarados" },
      { id: "R-02", estado: "cumple", evidencia: "Sin promesa de resultado futuro" },
      { id: "R-03", estado: "no aplica", evidencia: "No comunica producto de depósito" },
      { id: "R-04", estado: "no aplica", evidencia: "No comunica oferta crediticia" },
      { id: "R-05", estado: "cumple", evidencia: "Aviso antifraude en el cuerpo" },
      { id: "R-06", estado: "cumple", evidencia: "Cifra institucional verificable, no proyección" },
      { id: "R-07", estado: "cumple", evidencia: "Voz cooperativa y trato de socia" },
      { id: "R-08", estado: "cumple", evidencia: "Excluye cuotas en mora" },
    ],
    modulos: [
      { id: "M-011", nombre: "Encabezado socio + saludo nominal", origen: "biblioteca" },
      { id: "M-085", nombre: "Explicador del cálculo capital / uso", origen: "nuevo" },
      { id: "M-044", nombre: "Aviso antifraude · no pedimos claves", origen: "biblioteca" },
      { id: "M-031", nombre: "Pie con garantía estatal CMF", origen: "biblioteca" },
    ],
    activacion: {
      dataExtension: "DE_Socios_CapitalSocialBajo_2026",
      journey: "JB_Educacion_Remanente_H2_2026",
      excluir: ["opt_out", "cuotas_en_mora", "sin_consentimiento", "socio_retirado"],
      personalizacion: ["%%NombreSocio%%", "%%AntiguedadSocio%%"],
      ventana: "Jueves, 09:00-11:00",
    },
    aprendizaje: [
      { tipo: "Módulo HTML", nombre: "Explicador del cálculo capital / uso" },
      { tipo: "Regla de compliance", nombre: "Toda pieza sobre Remanente lleva aviso antifraude en el cuerpo" },
      { tipo: "Hallazgo de panel", nombre: "El encuadre comercial del Remanente genera rechazo en socios cooperativistas" },
    ],
  },
];

export const caso = (id: string) => CASOS.find((c) => c.id === id)!;
