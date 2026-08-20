import type { Caso, Reaccion } from "../lib/tipos";
import { ESC_GAS } from "./ilustraciones";

/* Casos base del sector gas, construidos sobre hechos públicos y verificables
   de Lipigas y de la industria del GLP en Chile. Mismo formato que los casos
   financieros: tres variantes con hipótesis distintas, probadas con el panel
   del segmento antes de elegir. */

const r = (id: string, abre: number, entiende: number, confia: number, actua: number, objecion: string, frase: string): Reaccion =>
  ({ id, abre, entiende, confia, actua, objecion, frase });

export const CASOS_GAS: Caso[] = [
  /* ============ CASO 1 · Convenio municipal ============ */
  {
    id: "G-C1",
    nombre: "Convenio municipal sin usar",
    producto: "Convenios municipales",
    segmento: "Clientes con convenio municipal",
    objetivo: "Activar un beneficio ya disponible",
    canal: "WhatsApp + Email",
    tono: "Cercano y claro",
    contexto:
      "Lipigas tiene convenio con más de 200 municipalidades y con la Asociación de Municipalidades de Chile. El cliente se inscribe en su municipio y luego usa su RUT como código de descuento al pedir. El problema no es la falta de beneficio: es que una parte de los inscritos nunca lo aplica, porque no sabe que el código es su propio RUT.",
    fuente: "Sitio público Lipigas · convenios municipales y AMUCH · prensa nacional",
    brief:
      "Avisar a los clientes que ya están inscritos en el convenio de su municipalidad y no están usando el descuento, explicando cómo se aplica.",
    riesgo:
      "Es el segmento con más exposición a estafas por suplantación. Un mensaje que pida datos, o que se parezca a uno que los pide, se lee como fraude y destruye la confianza en el canal.",

    estrategia: {
      angulo: "No es una promoción nueva: es un descuento que ya le corresponde y no está usando.",
      promesa: "Su RUT es el código. No hay trámite adicional.",
      riesgo: "Que el mensaje se confunda con un intento de estafa y el cliente lo descarte.",
      kpi: "Clientes inscritos que aplican el descuento en los siguientes 30 días.",
    },

    variantes: [
      {
        id: "A",
        nombre: "Urgencia",
        hipotesis: "Marcar que está perdiendo dinero cada compra activa la acción.",
        imagen: ESC_GAS,
        veredicto: "no apto",
        hallazgos: [
          { id: "R-01", estado: "bloquea", evidencia: "«El gas más barato» no es verificable" },
          { id: "R-06", estado: "ajustar", evidencia: "Sin vigencia ni tope por RUT" },
        ],
        pieza: {
          asunto: "Estás pagando de más por tu gas",
          preheader: "Aprovecha ya el gas más barato con tu convenio.",
          titular: "Estás pagando de más",
          cuerpo: [
            "Tienes un descuento municipal activo y no lo estás usando. Cada carga que pides sin él te cuesta más de lo que deberías.",
            "Actívalo ahora y consigue el gas más barato.",
          ],
          cta: "Activar mi descuento",
        },
      },
      {
        id: "B",
        nombre: "Instructiva",
        hipotesis: "El obstáculo es no saber cómo se aplica, no la falta de interés.",
        imagen: ESC_GAS,
        veredicto: "apto",
        hallazgos: [
          { id: "R-06", estado: "cumple", evidencia: "Tope y vigencia declarados" },
          { id: "R-04", estado: "cumple", evidencia: "Distingue despacho de retiro en punto" },
        ],
        pieza: {
          asunto: "Tu RUT es el código de descuento",
          preheader: "Ya estás inscrito en el convenio de tu municipalidad. Así se aplica.",
          titular: "Tu RUT es el código",
          cuerpo: [
            "Estás inscrito en el convenio de tu municipalidad, así que tienes descuento en cada carga. El código es tu RUT, sin puntos ni guion pero con el dígito verificador.",
            "Lo puedes usar pidiendo por la LipiApp, por WhatsApp, llamando al 600 600 6200 o retirando en un punto LipiVecino.",
          ],
          cta: "Ver cómo se aplica",
          legal:
            "Tope de dos cargas con descuento al mes por RUT. No acumulable con otras promociones. Sujeto a disponibilidad del servicio en tu comuna.",
        },
      },
      {
        id: "C",
        nombre: "Confianza",
        hipotesis: "En un segmento que teme el fraude, primero hay que despejar la sospecha.",
        imagen: ESC_GAS,
        veredicto: "apto",
        hallazgos: [
          { id: "R-05", estado: "cumple", evidencia: "Canal de emergencia y aviso antifraude presentes" },
          { id: "R-06", estado: "ajustar", evidencia: "Las bases quedan en segundo plano" },
        ],
        pieza: {
          asunto: "Este mensaje no te pide ningún dato",
          preheader: "Tu descuento municipal ya está activo. Te explicamos cómo usarlo.",
          titular: "No te vamos a pedir nada",
          cuerpo: [
            "Sabemos que circulan mensajes falsos a nombre nuestro. Por eso partimos por acá: nunca te vamos a pedir claves, ni datos personales, ni que ingreses a un enlace para recibir un beneficio.",
            "Tu descuento municipal ya está activo y el código es tu propio RUT. Lo aplicas al pedir, por el canal que prefieras.",
          ],
          cta: "Ver cómo se aplica",
          legal:
            "Tope de dos cargas con descuento al mes por RUT. Ante emergencia de gas, corta el suministro y llama al 600 600 9200.",
        },
      },
    ],
    notaCompliance:
      "La variante A queda detenida por una expresión de precio que la compañía no puede sostener: el valor del GLP depende del mercado internacional. No es un matiz de estilo, es una afirmación que no se puede probar.",

    panelSegmento: ["G2", "G7", "G1"],
    reacciones: {
      A: [
        r("G2", 24, 3, 1, 6, "Lo lee como estafa", "Me dicen que pago de más y me apuran, eso es cuento."),
        r("G7", 41, 4, 2, 18, "Desconfía de la promesa de precio", "¿Más barato que quién? Yo comparo en el local."),
        r("G1", 52, 4, 2, 27, "La urgencia le suena a venta", "Si fuera tan bueno no me lo dirían así."),
      ],
      B: [
        r("G2", 58, 5, 4, 44, "Quiere confirmarlo con alguien", "Ah, era mi RUT nomás. Eso no lo sabía."),
        r("G7", 63, 5, 4, 39, "Prefiere aplicarlo en el punto", "Sirve igual en el local, entonces me acomoda."),
        r("G1", 67, 5, 4, 52, "Ninguna relevante", "Claro y sin vueltas, así lo entiendo."),
      ],
      C: [
        r("G2", 66, 5, 5, 47, "Ninguna relevante", "Eso me tranquiliza, porque me llegan puras estafas."),
        r("G7", 58, 4, 5, 34, "Le falta el paso concreto", "Bueno que lo aclaren, pero ¿cómo lo uso?"),
        r("G1", 59, 4, 4, 41, "Tarda en llegar al beneficio", "Mucho preámbulo antes de decirme lo importante."),
      ],
    },
    ganador: "B",
    razonGanador:
      "B convierte mejor de forma pareja porque resuelve el obstáculo real: nadie sabía que el código era su propio RUT. C gana en confianza con el cliente mayor, que es el más expuesto a suplantación, y esa apertura vale la pena incorporarla.",

    correcciones: [
      "Abrir con el aviso antifraude de C, en una línea, antes de explicar el mecanismo.",
      "Mantener las bases de la promoción visibles: tope por RUT y no acumulable.",
      "Incorporar el canal de emergencia en el pie.",
    ],
    piezaFinal: {
      asunto: "Tu RUT es el código de descuento",
      preheader: "No te pedimos datos por este medio. Ya estás inscrito en el convenio de tu municipalidad.",
      titular: "Tu RUT es el código",
      cuerpo: [
        "Nunca te vamos a pedir claves ni datos por mensaje. Dicho eso: estás inscrito en el convenio de tu municipalidad y tienes descuento en cada carga.",
        "El código es tu RUT, sin puntos ni guion y con el dígito verificador. Lo usas pidiendo por la LipiApp, por WhatsApp, llamando al 600 600 6200 o retirando en un punto LipiVecino.",
      ],
      cta: "Ver cómo se aplica",
      legal:
        "Tope de dos cargas con descuento al mes por RUT. No acumulable con otras promociones. Ante emergencia de gas, corta el suministro y llama al 600 600 9200.",
    },
    imagenFinal: ESC_GAS,
    cambios: [
      "Se abre con el aviso antifraude, que era lo que más movía al cliente mayor.",
      "Se mantiene la explicación del código, que resolvía el obstáculo real.",
      "Las bases quedan visibles en vez de diluidas.",
      "Se agrega el canal de emergencia al pie.",
    ],
    reaccionesFinal: [
      r("G2", 68, 5, 5, 56, "Ninguna relevante", "Ahora sí entiendo y además me quedo tranquilo."),
      r("G7", 66, 5, 5, 44, "Ninguna relevante", "Me sirve para el local, y no me piden nada."),
      r("G1", 69, 5, 5, 57, "Ninguna relevante", "Corto, claro y sé exactamente qué hacer."),
    ],
    reglasFinal: [
      { id: "R-01", estado: "cumple", evidencia: "Sin afirmaciones de precio no verificables" },
      { id: "R-02", estado: "cumple", evidencia: "Condiciones accesibles en la pieza" },
      { id: "R-03", estado: "no aplica", evidencia: "No induce maniobras sobre la instalación" },
      { id: "R-04", estado: "cumple", evidencia: "Distingue pedido a domicilio de retiro en punto" },
      { id: "R-05", estado: "cumple", evidencia: "Aviso antifraude y canal de emergencia" },
      { id: "R-06", estado: "cumple", evidencia: "Tope por RUT y acumulabilidad declarados" },
      { id: "R-07", estado: "cumple", evidencia: "Trato de cliente, voz de marca" },
      { id: "R-08", estado: "cumple", evidencia: "Exclusiones de audiencia aplicadas" },
    ],
    modulos: [
      { id: "M-101", nombre: "Encabezado cliente + saludo nominal", origen: "biblioteca" },
      { id: "M-118", nombre: "Aviso antifraude · no pedimos datos", origen: "biblioteca" },
      { id: "M-126", nombre: "Explicador del código de descuento", origen: "nuevo" },
      { id: "M-133", nombre: "Pie con canal de emergencia", origen: "biblioteca" },
    ],
    activacion: {
      dataExtension: "DE_Convenio_Municipal_Sin_Uso_2026",
      journey: "JB_Activacion_Convenio_H2_2026",
      excluir: ["opt_out", "sin_consentimiento", "sin_convenio_vigente"],
      personalizacion: ["%%NombreCliente%%", "%%Municipalidad%%", "%%UltimaCarga%%"],
      ventana: "Martes a jueves, 11:00-13:00",
    },
    aprendizaje: [
      { tipo: "Módulo HTML", nombre: "Explicador del código de descuento" },
      { tipo: "Regla de tono", nombre: "En segmentos expuestos a fraude, el aviso antifraude abre la pieza" },
      { tipo: "Hallazgo de panel", nombre: "La urgencia comercial se lee como estafa en clientes mayores" },
    ],
  },

  /* ============ CASO 2 · Invierno y granel ============ */
  {
    id: "G-C2",
    nombre: "Anticipar la carga de invierno",
    producto: "Gas granel (tanque)",
    segmento: "Clientes granel residencial",
    objetivo: "Anticipar el consumo estacional",
    canal: "Email + Sitio privado",
    tono: "Cercano y claro",
    contexto:
      "El consumo de gas en Chile tiene una estacionalidad muy marcada: en el sur el invierno multiplica el uso por calefacción. Para el cliente granel, quedarse sin carga en julio significa esperar en el peor momento. Lipigas tiene la app MiCuenta y la Sucursal Virtual para programar la carga y revisar el consumo.",
    fuente: "Sitio público Lipigas · estudios de mercado del gas (CNE, FNE)",
    brief:
      "Avisar a clientes granel del sur que su consumo va a subir con el invierno y que conviene programar la carga antes del alza estacional.",
    riesgo:
      "Comunicar el alza de consumo puede leerse como aviso de alza de precio. Y prometer un precio fijo por adelantado sería insostenible: el valor del GLP depende del mercado internacional.",

    estrategia: {
      angulo: "El consumo sube por el frío, no por el precio: anticipar la carga evita el quiebre, no el alza.",
      promesa: "Puede programar la carga antes de que el tanque baje.",
      riesgo: "Que se entienda como aviso de alza de precio o como promesa de precio congelado.",
      kpi: "Cargas programadas antes de junio sobre la base contactada.",
    },

    variantes: [
      {
        id: "A",
        nombre: "Alerta",
        hipotesis: "Advertir del riesgo de quedarse sin gas mueve más que cualquier beneficio.",
        imagen: ESC_GAS,
        veredicto: "apto con ajustes",
        hallazgos: [
          { id: "R-01", estado: "ajustar", evidencia: "El tono de alarma sugiere desabastecimiento" },
          { id: "R-05", estado: "ajustar", evidencia: "Falta el canal de emergencia" },
        ],
        pieza: {
          asunto: "Tu tanque no va a llegar a agosto",
          preheader: "Programa tu carga antes de que se acabe.",
          titular: "Tu tanque no llega a agosto",
          cuerpo: [
            "Con el frío, el consumo de tu tanque sube fuerte. Si mantienes el ritmo actual, te vas a quedar sin gas en pleno invierno.",
            "Programa tu carga ahora y evita el problema.",
          ],
          cta: "Programar mi carga",
        },
      },
      {
        id: "B",
        nombre: "Datos propios",
        hipotesis: "Mostrarle su propio consumo del invierno pasado convence más que una advertencia.",
        imagen: ESC_GAS,
        veredicto: "apto",
        hallazgos: [
          { id: "R-01", estado: "cumple", evidencia: "Sin afirmaciones sobre el precio" },
          { id: "R-04", estado: "cumple", evidencia: "No comunica precio, sino programación" },
        ],
        pieza: {
          asunto: "El invierno pasado tu consumo subió al doble",
          preheader: "Con ese dato puedes programar la carga antes de que el tanque baje.",
          titular: "Tu consumo de invierno",
          cuerpo: [
            "Entre junio y agosto del año pasado tu consumo subió más del doble respecto de los meses de primavera. Es lo normal cuando se calefacciona con gas.",
            "Con ese dato puedes programar la próxima carga desde la app o la Sucursal Virtual, eligiendo el día de entrega que te acomode.",
          ],
          cta: "Ver mi consumo",
          legal:
            "Ante emergencia de gas, corta el suministro y llama al 600 600 9200. Las instalaciones solo debe intervenirlas un instalador autorizado por la SEC.",
        },
      },
      {
        id: "C",
        nombre: "Servicio",
        hipotesis: "Ofrecer que la compañía se haga cargo del calendario reduce la fricción a cero.",
        imagen: ESC_GAS,
        veredicto: "apto",
        hallazgos: [
          { id: "R-02", estado: "cumple", evidencia: "Condición del servicio explicada" },
          { id: "R-01", estado: "cumple", evidencia: "Sin promesas de precio" },
        ],
        pieza: {
          asunto: "¿Prefieres que nosotros llevemos la cuenta?",
          preheader: "Programamos tu carga de invierno y te avisamos antes.",
          titular: "Nosotros llevamos la cuenta",
          cuerpo: [
            "Si prefieres no estar revisando el tanque, podemos programar tu carga de invierno y avisarte unos días antes de la entrega.",
            "Lo activas una vez y lo puedes cambiar o suspender cuando quieras, desde la app o la Sucursal Virtual.",
          ],
          cta: "Activar el aviso",
          legal:
            "Ante emergencia de gas, corta el suministro y llama al 600 600 9200.",
        },
      },
    ],
    notaCompliance:
      "Ninguna variante está bloqueada, pero A instala una idea que la compañía no quiere sostener: que puede haber desabastecimiento. El problema no es normativo, es de consecuencia — genera llamadas al call center que nadie pidió.",

    panelSegmento: ["G4", "G5", "G9"],
    reacciones: {
      A: [
        r("G4", 71, 4, 3, 38, "Le suena a que van a subir el precio", "¿Y esto es porque va a subir el gas?"),
        r("G5", 44, 4, 3, 21, "La alarma le molesta", "No me gusta que me metan miedo."),
        r("G9", 39, 3, 2, 14, "Confirma su distancia con la marca", "Ahora se acuerdan de avisarme."),
      ],
      B: [
        r("G4", 74, 5, 5, 58, "Ninguna relevante", "Me muestran mi propio dato, eso sí me sirve."),
        r("G5", 52, 5, 4, 34, "No revisa su consumo normalmente", "Interesante, no sabía que subía tanto."),
        r("G9", 47, 4, 4, 29, "Quiere que reconozcan lo anterior", "Está bien el dato, pero yo tuve un problema antes."),
      ],
      C: [
        r("G4", 68, 5, 5, 51, "Quiere poder cambiarlo", "Me gusta, siempre que lo pueda suspender."),
        r("G5", 58, 5, 5, 44, "Ninguna relevante", "Eso es justo lo que necesito, no quiero estar pendiente."),
        r("G9", 44, 4, 4, 26, "Sigue con la distancia", "Suena bien, pero prefiero manejarlo yo."),
      ],
    },
    ganador: "B",
    razonGanador:
      "B gana porque usa el dato del propio cliente en vez de una advertencia genérica. C la sigue de cerca y es mejor para el cliente de bajo involucramiento, que no quiere estar pendiente. La final combina ambas: el dato propio y la opción de que la compañía lleve el calendario.",

    correcciones: [
      "Agregar la opción de programación asistida que traía C, como cierre.",
      "Explicitar que el alza de consumo es estacional y no un aviso de precio.",
      "Mantener el canal de emergencia en el pie.",
    ],
    piezaFinal: {
      asunto: "El invierno pasado tu consumo subió al doble",
      preheader: "Es estacional, no un aviso de precio. Con ese dato puedes programar la carga.",
      titular: "Tu consumo de invierno",
      cuerpo: [
        "Entre junio y agosto del año pasado tu consumo subió más del doble respecto de la primavera. Es lo que pasa cuando se calefacciona con gas: sube el uso, no estamos avisando de un cambio de precio.",
        "Puedes programar la próxima carga desde la app o la Sucursal Virtual, eligiendo el día. Y si prefieres no estar pendiente, activas el aviso y te recordamos antes de que el tanque baje.",
      ],
      cta: "Ver mi consumo",
      legal:
        "Ante emergencia de gas, corta el suministro y llama al 600 600 9200. Las instalaciones solo debe intervenirlas un instalador autorizado por la SEC.",
    },
    imagenFinal: ESC_GAS,
    cambios: [
      "Se aclara que el alza es de consumo y no de precio: era la objeción número uno.",
      "Se incorpora la programación asistida de C como cierre.",
      "El dato propio se mantiene como apertura, que fue lo que más convirtió.",
      "Se conserva el canal de emergencia y la advertencia sobre instalador autorizado.",
    ],
    reaccionesFinal: [
      r("G4", 76, 5, 5, 63, "Ninguna relevante", "Ahora queda claro que no es alza de precio."),
      r("G5", 59, 5, 5, 47, "Ninguna relevante", "Y además me pueden avisar, mejor todavía."),
      r("G9", 49, 5, 4, 33, "Sigue esperando que reconozcan su caso", "El dato sirve. Lo otro lo veré después."),
    ],
    reglasFinal: [
      { id: "R-01", estado: "cumple", evidencia: "Sin afirmaciones sobre el precio" },
      { id: "R-02", estado: "cumple", evidencia: "Condición del servicio explicada" },
      { id: "R-03", estado: "cumple", evidencia: "Deriva a instalador autorizado" },
      { id: "R-04", estado: "no aplica", evidencia: "No comunica precio" },
      { id: "R-05", estado: "cumple", evidencia: "Canal de emergencia informado" },
      { id: "R-06", estado: "no aplica", evidencia: "No comunica una promoción" },
      { id: "R-07", estado: "cumple", evidencia: "Trato de cliente, voz de marca" },
      { id: "R-08", estado: "cumple", evidencia: "Exclusiones de audiencia aplicadas" },
    ],
    modulos: [
      { id: "M-101", nombre: "Encabezado cliente + saludo nominal", origen: "biblioteca" },
      { id: "M-141", nombre: "Gráfico de consumo estacional propio", origen: "nuevo" },
      { id: "M-133", nombre: "Pie con canal de emergencia", origen: "biblioteca" },
      { id: "M-137", nombre: "Advertencia de instalador autorizado", origen: "biblioteca" },
    ],
    activacion: {
      dataExtension: "DE_Granel_Sur_Estacional_2026",
      journey: "JB_Invierno_Granel_2026",
      excluir: ["opt_out", "sin_consentimiento", "contrato_suspendido"],
      personalizacion: ["%%NombreCliente%%", "%%ConsumoInviernoAnterior%%", "%%SaldoTanque%%"],
      ventana: "Lunes a miércoles, 10:00-12:00",
    },
    aprendizaje: [
      { tipo: "Módulo HTML", nombre: "Gráfico de consumo estacional propio" },
      { tipo: "Regla de compliance", nombre: "Todo aviso de alza de consumo aclara que no es alza de precio" },
      { tipo: "Hallazgo de panel", nombre: "El dato propio del cliente convierte más que la advertencia genérica" },
    ],
  },

  /* ============ CASO 3 · Cliente en fuga ============ */
  {
    id: "G-C3",
    nombre: "Cliente que dejó de pedir",
    producto: "Cilindro 15 kg",
    segmento: "Clientes en riesgo de fuga a la competencia",
    objetivo: "Recuperar frecuencia de compra",
    canal: "WhatsApp + Email",
    tono: "Directo y breve",
    contexto:
      "El GLP es un producto homogéneo con tres distribuidores mayoristas de participación similar: Lipigas, Abastible y Gasco. El cliente cambia de marca sin costo y sin aviso. La fuga más frecuente no llega como reclamo: es una caída silenciosa de frecuencia después de una mala experiencia de entrega.",
    fuente: "Estudio de mercado del gas de la FNE · sitio público Lipigas",
    brief:
      "Reconectar con clientes cuya frecuencia de compra cayó a la mitad en los últimos seis meses y que tuvieron una entrega con problemas.",
    riesgo:
      "Mandar una promoción a alguien que tuvo un mal servicio y nunca recibió respuesta confirma que no lo escucharon. El descuento, mal puesto, acelera la fuga en vez de frenarla.",

    estrategia: {
      angulo: "Primero hacerse cargo de lo que pasó; el beneficio viene después, no en lugar de.",
      promesa: "Sabemos que la última entrega falló y queremos que la próxima no.",
      riesgo: "Que una promoción sin reconocimiento previo confirme la sensación de no ser escuchado.",
      kpi: "Clientes que vuelven a pedir dentro de 45 días, no la tasa de canje del descuento.",
    },

    variantes: [
      {
        id: "A",
        nombre: "Descuento",
        hipotesis: "Un beneficio concreto es lo más eficaz para recuperar a un cliente que se fue.",
        imagen: ESC_GAS,
        veredicto: "apto con ajustes",
        hallazgos: [
          { id: "R-06", estado: "ajustar", evidencia: "Vigencia y tope no declarados" },
          { id: "R-04", estado: "ajustar", evidencia: "No declara si el precio incluye despacho" },
        ],
        pieza: {
          asunto: "Te echamos de menos: $3.000 de descuento",
          preheader: "Vuelve a pedir con nosotros y ahorra en tu próxima carga.",
          titular: "$3.000 en tu próxima carga",
          cuerpo: [
            "Hace tiempo que no pides con nosotros. Para que vuelvas, te dejamos $3.000 de descuento en tu próxima carga de 15 kilos.",
            "Pídela por la app o por WhatsApp y el descuento se aplica solo.",
          ],
          cta: "Pedir con descuento",
        },
      },
      {
        id: "B",
        nombre: "Reconocimiento",
        hipotesis: "Hacerse cargo del problema pesa más que cualquier descuento.",
        imagen: ESC_GAS,
        veredicto: "apto",
        hallazgos: [
          { id: "R-07", estado: "cumple", evidencia: "Trato de cliente, sin lenguaje comercial" },
          { id: "R-01", estado: "cumple", evidencia: "Sin afirmaciones de precio" },
        ],
        pieza: {
          asunto: "Tu última entrega no salió bien",
          preheader: "Lo revisamos. Te contamos qué cambió.",
          titular: "Tu última entrega no salió bien",
          cuerpo: [
            "Revisamos tu último pedido y la entrega no salió como corresponde. No nos escribiste, pero igual quedó registrado y lo miramos.",
            "Cambiamos la ruta que atiende tu dirección y ahora puedes seguir el camión desde la app para saber a qué hora llega.",
          ],
          cta: "Ver cómo funciona",
          legal:
            "Ante emergencia de gas, corta el suministro y llama al 600 600 9200.",
        },
      },
      {
        id: "C",
        nombre: "Cercanía",
        hipotesis: "Mostrarle el punto de retiro más cercano baja la fricción y el precio final.",
        imagen: ESC_GAS,
        veredicto: "apto",
        hallazgos: [
          { id: "R-04", estado: "cumple", evidencia: "Distingue retiro en punto de despacho" },
          { id: "R-02", estado: "cumple", evidencia: "Condición del canal explicada" },
        ],
        pieza: {
          asunto: "Tienes un punto de retiro a tres cuadras",
          preheader: "Sin costo de despacho, llevando tu cilindro vacío.",
          titular: "Un punto a tres cuadras",
          cuerpo: [
            "Hay un punto LipiVecino cerca de tu dirección. Llevando tu cilindro vacío compras ahí mismo y no pagas despacho.",
            "Si prefieres que te llegue a la casa, la app te muestra el precio final antes de confirmar.",
          ],
          cta: "Ver el punto más cercano",
          legal:
            "Ante emergencia de gas, corta el suministro y llama al 600 600 9200.",
        },
      },
    ],
    notaCompliance:
      "A es publicable, pero el panel muestra un efecto que ninguna regla detecta: en un cliente con mala experiencia no resuelta, el descuento sin reconocimiento previo empeora la percepción. Es un riesgo de negocio, no normativo, y por eso conviene que quede registrado.",

    panelSegmento: ["G9", "G1", "G8"],
    reacciones: {
      A: [
        r("G9", 46, 4, 2, 11, "El descuento sin disculpa lo irrita", "Me ofrecen plata pero nadie me preguntó qué pasó."),
        r("G1", 61, 5, 3, 44, "Compara el descuento con la competencia", "Tres mil está bien, pero el otro me deja igual."),
        r("G8", 66, 5, 3, 51, "Solo le importa el precio final", "Si me sale más barato, pido. Si no, no."),
      ],
      B: [
        r("G9", 62, 5, 5, 48, "Ninguna relevante", "No esperaba que se dieran cuenta solos."),
        r("G1", 54, 5, 4, 36, "Quiere también el beneficio", "Está bien que lo digan, ¿y el descuento?"),
        r("G8", 47, 4, 4, 27, "Sin precio no la considera", "Bonito, pero yo decido por precio."),
      ],
      C: [
        r("G9", 51, 4, 4, 31, "Sigue esperando que reconozcan lo anterior", "Sirve, aunque no me hablan de lo que pasó."),
        r("G1", 68, 5, 5, 57, "Ninguna relevante", "Tres cuadras y sin despacho, eso me conviene."),
        r("G8", 71, 5, 5, 62, "Ninguna relevante", "Ahí sí me ahorro el reparto, lo voy a probar."),
      ],
    },
    ganador: "C",
    razonGanador:
      "C gana en promedio porque resuelve el precio final sin prometer nada, pero el promedio esconde lo importante: con el cliente en fuga real es B la que funciona, y A directamente lo empeora. Este caso no tiene una sola pieza ganadora, tiene dos segmentos con motivaciones opuestas.",

    correcciones: [
      "Separar la campaña en dos: reconocimiento para quien tuvo una entrega fallida, cercanía para quien se fue por precio.",
      "Retirar el descuento de la pieza de reconocimiento: ahí resta en vez de sumar.",
      "Mantener el canal de emergencia en ambas.",
    ],
    piezaFinal: {
      asunto: "Tu última entrega no salió bien",
      preheader: "Lo revisamos y cambiamos la ruta. Además, tienes un punto de retiro cerca.",
      titular: "Tu última entrega no salió bien",
      cuerpo: [
        "Revisamos tu último pedido y la entrega no salió como corresponde. No nos escribiste, pero quedó registrado y lo miramos.",
        "Cambiamos la ruta que atiende tu dirección y ahora puedes seguir el camión desde la app. Y si prefieres no esperar, hay un punto LipiVecino cerca donde compras sin costo de despacho.",
      ],
      cta: "Ver cómo funciona",
      legal:
        "Ante emergencia de gas, corta el suministro y llama al 600 600 9200.",
    },
    imagenFinal: ESC_GAS,
    cambios: [
      "Se descarta el descuento: en este segmento resta credibilidad en vez de sumar conversión.",
      "Se mantiene el reconocimiento como apertura, que fue lo que movió al cliente en fuga.",
      "Se incorpora el punto de retiro de C como alternativa, sin desplazar lo anterior.",
      "La campaña se separa en dos audiencias con piezas distintas.",
    ],
    reaccionesFinal: [
      r("G9", 64, 5, 5, 54, "Ninguna relevante", "Se hicieron cargo y además me dan una opción."),
      r("G1", 63, 5, 5, 49, "Ninguna relevante", "Bien, y el punto cerca me sirve igual."),
      r("G8", 58, 5, 4, 41, "Sigue decidiendo por precio", "Lo del punto me interesa, lo demás no tanto."),
    ],
    reglasFinal: [
      { id: "R-01", estado: "cumple", evidencia: "Sin afirmaciones de precio no verificables" },
      { id: "R-02", estado: "cumple", evidencia: "Condición del canal explicada" },
      { id: "R-03", estado: "no aplica", evidencia: "No induce maniobras sobre la instalación" },
      { id: "R-04", estado: "cumple", evidencia: "Distingue retiro en punto de despacho a domicilio" },
      { id: "R-05", estado: "cumple", evidencia: "Canal de emergencia informado" },
      { id: "R-06", estado: "no aplica", evidencia: "No comunica una promoción" },
      { id: "R-07", estado: "cumple", evidencia: "Trato de cliente, voz de marca" },
      { id: "R-08", estado: "cumple", evidencia: "Exclusiones de audiencia aplicadas" },
    ],
    modulos: [
      { id: "M-101", nombre: "Encabezado cliente + saludo nominal", origen: "biblioteca" },
      { id: "M-155", nombre: "Bloque de reconocimiento de incidencia", origen: "nuevo" },
      { id: "M-149", nombre: "Punto LipiVecino más cercano", origen: "biblioteca" },
      { id: "M-133", nombre: "Pie con canal de emergencia", origen: "biblioteca" },
    ],
    activacion: {
      dataExtension: "DE_Fuga_Silenciosa_Cilindro_2026",
      journey: "JB_Recuperacion_Frecuencia_H2_2026",
      excluir: ["opt_out", "sin_consentimiento", "reclamo_abierto"],
      personalizacion: ["%%NombreCliente%%", "%%FechaUltimaEntrega%%", "%%PuntoLipiVecinoCercano%%"],
      ventana: "Jueves y viernes, 17:00-19:00",
    },
    aprendizaje: [
      { tipo: "Módulo HTML", nombre: "Bloque de reconocimiento de incidencia" },
      { tipo: "Regla de tono", nombre: "Sin reconocer la incidencia previa, el descuento resta credibilidad" },
      { tipo: "Hallazgo de panel", nombre: "La fuga por servicio y la fuga por precio necesitan piezas distintas" },
    ],
  },
];
