# Capa Agéntica de Marketing · Coopeuch

Maqueta funcional para la conversación con Coopeuch sobre el POV *Capacidad Agéntica de Marketing*.
Ambiente Deloitte. Sin conexión a sistemas de la cooperativa y sin envío a socios.

## Desplegar

Para publicarlo en Vercel: ver `DESPLIEGUE.md`. Las funciones de `/api` reemplazan al `server.cjs`
en producción; localmente no cambia nada.

## Correr

```bash
npm install
npm run dev            # http://localhost:5173
```

Modo presentación (un solo proceso, como en las otras demos):

```bash
npm run build
node server.cjs         # http://localhost:3003
```

## Marca

### Assets

`/public` **no trae** `logo-coopeuch.png` ni `favicon.ico`: son los archivos reales de Coopeuch y
no viajan en el paquete para no sobrescribirlos al descomprimir. Si faltan, la app funciona igual
(el logo se oculta solo). El componente `<Logo>` prueba `logo-coopeuch.png`, `.jpg`, `.svg` y
`logo.png` en ese orden, así que sirve cualquiera de esos nombres sin tocar el código. Ver
`public/LEER.md`.

Los colores están en `src/datos/marca.ts` (un solo archivo). El rojo actual (`#E4032E`) está
aproximado del sitio público; ajustar al manual de marca cuando esté disponible.

## Estructura de la demo

| Estación | Qué muestra |
|---|---|
| 02 Casos base | Tres campañas reales de Coopeuch, reproducidas paso a paso como un recorrido: se ve trabajar a cada agente. |
| 03 Caso custom | Brief propio con selección múltiple de productos, segmentos y canales. Cada salida de los agentes es editable y se pueden relanzar los siguientes. Al final, descarga o transferencia a Marketing Cloud. |
| 06 Bitácora de campañas | Refleja la última corrida real (caso reproducido o caso libre): pieza activada, paquete, bitácora y biblioteca. |
| 04 Producción | Una campaña desplegada en los formatos reales de cada plataforma, test de diseño y ciclo de aprendizaje. |
| 05 Audiencias sintéticas | Panel de socios sintéticos con ficha por socio, y la métrica de legibilidad. |
| 01 Configuración | Fuentes conectadas, contexto y voz de marca, brand book, fuente de imágenes y objetivo de comprensión. |

## IA en vivo

Los tres casos guiados **no necesitan clave ni conexión**: el guion está fijo para que la
presentación sea siempre idéntica. El Caso libre usa Claude si existe `ANTHROPIC_API_KEY`
(ver `.env.example`); si no la hay, cae a un motor local determinista y lo indica en pantalla.

## Datos usados

Información pública de Coopeuch (sitio web, comunicados, prensa) al 28 de julio de 2026.
Ver `src/datos/casos.ts`, donde cada caso declara su fuente. Las reglas de compliance son una
aproximación de trabajo: se reemplazan por el set real de la cooperativa en la primera etapa.

## IA en vivo

Copiar la clave en `.env` (ya viene el archivo listo, solo falta el valor) y levantar el servidor:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3003
```

```bash
npm run build
node server.cjs      # http://localhost:3003
```

En desarrollo, `npm run dev` (5173) proxea `/api` al 3003, así que hay que tener los dos corriendo
para usar la IA, o simplemente trabajar sobre la versión compilada.

Qué usa la IA y qué no:

| Agente | Con clave | Sin clave |
|---|---|---|
| A1 Estrategia | genera en vivo | motor local |
| A2 Redacción | genera en vivo | motor local |
| A4 Ilustración | genera el SVG en vivo | ilustración base |
| A3 Compliance | **motor de reglas, nunca generativo** — entrega las obligaciones ANTES de escribir | igual |
| Panel sintético | genera en vivo | motor local determinista |
| Análisis de refinamiento | genera en vivo | comparación local |

El agente de compliance es deliberadamente determinista: en una entidad supervisada, la regla no se
puede dejar a criterio de un modelo. Vale la pena decirlo en la reunión, es un punto a favor.

Los tres casos guionados **no necesitan clave ni conexión**: el guion es fijo para que la
presentación salga siempre igual.

## Test A/B/C

Cada caso genera tres variantes con hipótesis distintas —no tres estilos del mismo mensaje—, las
pasa por compliance por separado y las prueba con los socios sintéticos del segmento. Gana la que
mejor responde la objeción real, no la que mejor suena. La pieza final se construye sobre la
ganadora incorporando lo que funcionó de las otras.

## Legibilidad

Cada versión se mide con el índice de Flesch-Szigriszt y se interpreta con la escala INFLESZ, que es
la validada para hábitos lectores en español (Barrio-Cantalejo et al., 2008). Se muestra también el
índice de Fernández Huerta como contraste. El conteo de sílabas es una aproximación por grupos
vocálicos: sirve para comparar piezas entre sí, no para uso académico.

Dónde se ve mejor: en el Caso 2, el bloque de condiciones con CAE queda en zona *muy difícil* y la
pieza final lo deja en *bastante fácil* sin perder ningún dato exigido. Es el mejor argumento
disponible para hablar de comprensión sin sonar a estilo.

## Guion sugerido para la reunión (12-15 min)

1. **Caso 2 primero, no el 1.** Es el que muestra al agente de compliance *deteniendo* la variante A:
   una comunicación crediticia a pensionados sin CAE ni costo total. El punto no es que la IA
   escribe rápido, es que la regla se aplica durante la generación y no tres vueltas después.
2. **Etapa 4, el test A/B/C.** Dejar que corra completo. La objeción de Jorge —lo lee como estafa—
   es la que abre la conversación sobre datos reales de la cooperativa.
3. **Etapa 5, la legibilidad.** El bloque legal pasa de zona muy difícil a bastante fácil con el
   mismo contenido. Suele ser el momento en que alguien de compliance se endereza en la silla.
4. **Estación 03 Resultado.** La biblioteca creciendo: es el Camino B hecho contador.
5. **Caso libre.** Pedirle al cliente que proponga la campaña, y después editar la pieza a mano
   delante de ellos para que la capa analice el cambio. Es la prueba más incómoda y la más
   convincente.

## Después de poner el logo

`public/` se copia a `dist/` en cada build, y `vite build` limpia `dist/` antes de escribir. Deja
`logo-coopeuch.png` y `favicon.ico` en `public/` y corre `npm run build`; nunca solo en `dist/`.

## Qué falta para llevarlo a proyecto

- Set de reglas real de la cooperativa (hoy es una aproximación de 8 reglas).
- Base de socios real para reconstruir el panel con anclaje verificable.
- Inventario de módulos y templates existentes en Marketing Cloud.
- Línea base de tiempos e iteraciones por tramo del ciclo actual.


## Entrega de las piezas

Desde el Caso libre y desde Resultado:

- **Descargar piezas** — genera el correo en `.html` (ilustración vectorial embebida, tablas
  compatibles con clientes de correo, listo para subir como asset) y el paquete de activación en
  `.json`.
- **Transferir a Salesforce Marketing Cloud** — muestra la secuencia exacta que se ejecutaría
  contra Marketing Cloud. Es una simulación: no hay conexión ni envío. En un entorno conectado, el
  paso siguiente sería la aprobación del responsable de campaña dentro de la plataforma.

## Iterar sobre lo que genera la IA

En el Caso libre, la estrategia (ángulo, promesa, riesgo, KPI) se edita con el lápiz y con
«Relanzar agentes siguientes» se vuelven a ejecutar redacción, ilustración, compliance y panel
tomando el texto corregido como entrada. La versión original queda registrada en la cinta de
trazabilidad. La pieza, además, se edita campo a campo y «Analizar cambios» compara ambas
versiones, revisa las reglas sobre el texto nuevo, vuelve a pasar el panel y mide la legibilidad.

Nota sobre la voz: la «nota interna del solicitante» es contexto para los agentes y nunca se copia
a la pieza. Lo que se genera es el mensaje que recibe el socio, no el encargo que se le hizo al
equipo de marketing.


## Cómo trabaja el agente de compliance

No revisa la pieza al final: le entrega al redactor la lista de obligaciones que corresponden por
producto, canal y segmento, y esas obligaciones son parte del encargo de escritura. Si el redactor
omite algo obligatorio, la capa lo inserta antes de mostrar la pieza (`asegurarConformidad`), de
modo que lo que sale del proceso ya cumple.

La revisión regla por regla aparece **solo cuando una persona edita el texto a mano**. Ahí corre la
calibración: compara contra la versión original, verifica si la edición mantuvo o rompió lo que la
capa había garantizado, vuelve a pasar el panel y mide la comprensión.

En los tres casos guionados el veredicto sí se muestra por variante, a propósito: sirve para
enseñar qué habría violado cada hipótesis escrita sin la capa. Es el retrabajo que hoy aparece
después de tres vueltas entre marketing, diseño y legal.

## Variantes y canales en el Caso libre

El caso libre genera tres variantes conformes (Directa, Explicativa, Cooperativa), las prueba con
el panel del segmento y marca la ganadora. Cada variante se puede editar por separado y en Entrega
hay un botón de descarga por variante más uno para las tres; cada descarga sale con las ediciones
aplicadas a esa variante.

Los cinco parámetros del brief son de selección múltiple, con lo elegido como etiquetas removibles
y un desplegable para agregar. Cada campo acepta **Otro…** para escribir un valor que no está en la
lista (aparece con borde punteado). Los valores propios llegan tal cual a los agentes; las
plantillas de respaldo sin IA no los reconocen y caen a la plantilla genérica.

Las piezas se previsualizan según los canales elegidos en el brief: correo en su marco de inbox,
WhatsApp dentro de un teléfono con cuenta de empresa verificada, push en pantalla bloqueada y
sitio privado en un marco de navegador. La adaptación por canal la hace la capa en la generación,
no es el mismo texto recortado.

## Ilustración

Las escenas son SVG que escribe el agente de diseño con una dirección de arte fija
(`DIRECCION_ARTE` en `src/datos/ilustraciones.ts`): ilustración plana editorial, personas
estilizadas en situaciones cotidianas, paleta cálida con el rojo de marca como acento.

Reglas del sistema, que son las que separan una ilustración de un ícono:

- **Tres planos de profundidad**: fondo con plano de color y un elemento de contexto (ventana,
  repisa), línea de suelo o mesón, y primer plano.
- **Composición a un tercio**, nunca centrada, con aire al otro lado.
- **Figuras asimétricas**: un hombro más alto, cabeza inclinada, un brazo con recorrido que
  termina en mano.
- **El pelo se dibuja detrás de la cabeza** para que enmarque el rostro. Dibujarlo encima le tapa
  el mentón y parece barba: es el error más común.
- **Sin rasgos faciales**. Un ojo o una boca mal puestos arruinan la figura completa.

**El techo de esta técnica.** Un SVG escrito por un modelo de lenguaje no compite con un generador
de imágenes: son formas geométricas, no ilustración de autor. A cambio no tiene costo por imagen,
no tiene problema de derechos y respeta la paleta exacta. Si se quiere fotografía o ilustración de
banco, el punto de conexión es la función `correrImagen` en `src/vistas/CasoLibre.tsx`: se cambia
la llamada por un proveedor de imágenes y el resto del flujo no se toca. La estación Configuración
ya plantea esa decisión como una de las cuatro fuentes de imagen posibles.


## Cómo puntúa el panel

Con IA activa, las tres variantes se evalúan **en una sola consulta comparativa**: cada socio
sintético lee las tres y las contrasta, con la instrucción explícita de diferenciarlas. Evaluarlas
por separado era el error original — tres llamadas independientes sobre el mismo brief devuelven
puntajes casi idénticos porque nada obliga al modelo a distinguirlas.

El panel reacciona al **texto de la pieza**, no al brief. Extrae rasgos medibles —índice de
legibilidad, cantidad de palabras, si hay cifra concreta, si trae CAE, si aparece el aviso
antifraude, si el encuadre es cooperativo, si el llamado a la acción pide ejecutar o solo mirar— y
los cruza con los sesgos estables de cada socio sintético: edad, nivel de uso digital y
sensibilidades declaradas.

Por eso las tres variantes dan resultados distintos, y distintos en la dirección correcta: la
Directa gana apertura con los socios digitales y pierde comprensión con los mayores; la Explicativa
gana intención con quienes buscan el número (Héctor, Luis); la Cooperativa gana confianza con la
socia cooperativista (Fernanda). El ruido es determinista: la misma pieza da siempre el mismo
número, así que la presentación es reproducible.

En pruebas sobre cuatro escenarios, la diferencia de intención entre la mejor y la peor variante
queda entre 10 y 19 puntos, y la ganadora cambia según el segmento: la Directa gana con socios
jóvenes y digitales, la Explicativa con pensionados y con quienes buscan la cifra, la Cooperativa
con la socia cooperativista. El panel muestra esa diferencia en pantalla y, cuando es menor a 8
puntos, lo dice: las tres son equivalentes y la palanca no está en el copy.


## Envío a revisión (emulado)

En Entrega y en Resultado hay dos botones que abren un correo redactado y editable dentro de la
app. No abre el cliente de correo ni sale nada de la demo:

- **Enviar a negocio para revisión** — resume las tres variantes con su intención de actuar, marca
  la recomendación, adjunta las piezas y pide tres confirmaciones concretas (variante, segmento,
  condiciones comerciales).
- **Revisión y auditoría legal** — le dice al abogado qué contempló la capa (set normativo aplicado,
  obligación por obligación, elementos insertados automáticamente, índice de comprensión) y separa
  explícitamente lo que **requiere su criterio**: suficiencia del ejemplo representativo, vigencia
  de las condiciones citadas, normativa sectorial reciente y compromisos que puedan leerse como
  oferta vinculante. El texto nunca afirma que la pieza está aprobada; queda a la espera de su
  confirmación.

Tras enviar a legal, el botón de activación cambia de estado y aparece la advertencia de que en
operación la campaña quedaría bloqueada hasta la respuesta. En la demo se puede transferir igual.

## Componentes animados

Ocho piezas reutilizables en `src/componentes/Animados.tsx`, cada una en el momento donde el
movimiento explica algo:

| Componente | Dónde | Por qué |
|---|---|---|
| `Contador` | métricas de Resultado | el número se construye a la vista y se mira |
| `Anillo` | legibilidad, cobertura de fuentes | un 0-100 legible de un vistazo y compacto |
| `AgentePulso` | sala de agentes | comunica "esto está pasando ahora" sin barra genérica |
| `TextoEscrito` | salidas del redactor | hace visible que la pieza se genera, no que estaba guardada |
| `BarraComparada` | test A/B/C | comparación en filas densas sin recurrir a un gráfico |
| `FlujoEtapas` | avance del Caso libre | las etapas conectadas, con la actual latiendo |
| `Cascada` | listas largas | los ítems entran uno tras otro en vez de aparecer de golpe |
| `Progresion` | transferencia y envío de correo | pasos que se completan con su estado final |

Todos respetan `prefers-reduced-motion`: con esa preferencia activa, las animaciones se desactivan
por completo.

## Configuración

La estación 05 muestra de qué se alimenta la capa: ocho fuentes con su estado (Marketing Cloud,
base de socios, brand book, set normativo, biblioteca de módulos, voz del socio, archivo
fotográfico, resultados históricos), el contexto y la voz de marca que viajan en cada llamada a los
agentes, la paleta y las palabras vetadas, la fuente de imágenes y el objetivo de comprensión.

Las conexiones son simuladas y se pueden alternar en pantalla; el contexto y la voz **sí son
reales**: se editan ahí y afectan lo que generan los agentes en el Caso libre. El anillo de
cobertura es deliberado — mientras esté incompleto, lo que produce la capa es una aproximación de
trabajo, y eso es exactamente lo que cierra la primera etapa del proyecto.


## De dónde salen las cuatro medidas del panel

Abre, entiende, confía y actúa **no son un modelo entrenado con datos de Coopeuch**: son funciones
de reglas que cruzan rasgos medibles del texto con los atributos declarados de cada perfil. La
pantalla lo dice explícitamente, con un panel (i) junto al gráfico A/B/C en Casos base y en Caso
custom, y en versión completa en Audiencias sintéticas.

| Medida | En qué se apoya | Hasta dónde alcanza |
|---|---|---|
| Abre | Reglas de asunto de benchmarks de email marketing | Ordena asuntos entre sí, no predice apertura real |
| Entiende | Flesch-Szigriszt + escala INFLESZ (Barrio-Cantalejo et al., 2008) | Mide la forma del texto, no la familiaridad con el concepto |
| Confía | Patrones de suplantación Ley 20.009 y criterios Ley 19.496 | Detecta retrocesos entre versiones, no confianza absoluta |
| Actúa | Función compuesta, lógica de teoría del comportamiento planificado | Intención declarada no es conversión |

Es la respuesta a la pregunta que aparece siempre en las reuniones. Conviene abrir ese panel antes
de que la formulen.


## Producción multiformato

La sección que responde al feedback de la primera presentación: el dolor del equipo de marketing no
es escribir, es producir la misma campaña en todos los formatos.

**Doce formatos con dimensiones y límites reales**: email, banner de sitio privado, push, WhatsApp,
Meta feed 1:1, Meta story, Meta reel, TikTok, y Google Display 300×250, 728×90, 160×600 y 320×50.
Cada uno declara su máximo de caracteres para titular, cuerpo y llamado, y si admite el bloque de
condiciones.

**Tres esquemas de diseño**, que son reglas de composición y no estilos:

| Esquema | Cuándo | Qué pierde |
|---|---|---|
| Franja de marca | La estructura normada: banda arriba y bajada ordenada | Menos impacto visual |
| Imagen dominante | Social y display, donde compite por atención | Capacidad de carga legal |
| Texto dominante | Piezas con condiciones o poco espacio | Impacto visual |

En modo automático cada formato toma el esquema que le corresponde.

**Lo que hace útil la sección** es la clasificación de restricciones. Con la campaña de portabilidad
—que lleva CAE y costo total— once de doce formatos quedan marcados con "versión sin cifras":
pueden publicarse, pero solo con el enlace a las condiciones. Es la revisión que hoy aparece cuando
la pieza ya está diseñada.

**Test de diseño**: el A/B/C del Caso base compara textos; este compara estructuras con el mismo
mensaje. La imagen dominante gana en perfiles digitales y pierde fuerte en baja actividad y senior.

**Ciclo de aprendizaje**: qué vuelve de las plataformas, desempeño por estructura y segmento, y las
reglas que la biblioteca deriva del cruce entre lo que el panel predijo y lo que la campaña midió.
Los datos de esa pestaña son de referencia: el circuito real se cierra al conectar las plataformas.


## Sectores e instituciones

La demostración soporta dos sectores, y la diferencia no es cosmética:

| | Financiero | Gas |
|---|---|---|
| Set normativo | `cl-cmf-2026.07` — CMF, SERNAC Financiero, CAE, Ley 20.009 | `cl-sec-sernac-2026.08` — SEC, SERNAC, precio y despacho, bases de promoción, canal de emergencia |
| Panel | 10 perfiles de banca de personas | 10 perfiles de clientes de gas (cilindro, granel, medidor, LipiVecino, convenio municipal, comercio) |
| Plantillas | crédito, depósito, seguros, cuenta | cilindro, granel y medidor, beneficios y convenios |
| Reglas propias | CAE y costo total en toda oferta crediticia | nunca inducir a intervenir la instalación; canal de emergencia en piezas operativas |

Presets: Coopeuch, Banco de Chile, Santander, Itaú, Bci, BancoEstado, Banco Falabella, **Lipigas** e
Institución A1 (neutro).

### Casos base por sector

Cada sector trae sus propios casos base. En gas son tres campañas construidas sobre hechos públicos
de la industria del GLP:

| Caso | Qué muestra |
|---|---|
| Convenio municipal sin usar | Compliance bloquea «el gas más barato»; el panel muestra que la urgencia comercial se lee como estafa en clientes mayores |
| Anticipar la carga de invierno | El dato de consumo propio del cliente convierte más que la advertencia genérica; hay que aclarar que el alza es de consumo y no de precio |
| Cliente que dejó de pedir | El descuento sin reconocer la incidencia previa resta credibilidad: la campaña se separa en dos audiencias con piezas distintas |

### Lipigas

El preset está construido con información pública de la compañía y de la industria: alrededor de
34% de participación en GLP, formatos de cilindro de 5, 11, 15 y 45 kilos, granel y medidor, la red
LipiVecino de retiro sin costo de despacho, LipiApp MiCilindro y MiCuenta, Lipibolsas, convenios
municipales y con AMUCH, y la emergencia 600 600 9200.

Dos reglas del sector que no existen en banca y que se ven funcionando en la demostración:

- **SEC · seguridad de instalaciones**: una pieza que diga «desconecta tu cilindro y cámbialo tú
  mismo» queda bloqueada. La capa deriva a instalador autorizado.
- **Canal de emergencia**: toda pieza operativa sobre suministro lleva el número de emergencia; una
  pieza puramente promocional no lo exige.

También cambia el discurso de precio: la voz de marca declara que el precio del GLP depende del
mercado internacional, así que expresiones como «el gas más barato» o «precio congelado» están
vetadas y la capa las reemplaza durante la generación.

**Paleta**, tomada del logo oficial: azul Minsk `#2E2E84`, amarillo `#FCDB00`, azul del círculo
`#2078BF` y verde de la mezcla `#549543`. En la interfaz el acento principal es el azul, porque el
amarillo con texto blanco no alcanza contraste legible; el amarillo queda para destacados y para el
cilindro de la ilustración. Se ajusta en `/admin` si el manual indica otra cosa.

**Vocabulario**: la persona es *cliente*, nunca socio. «Socio» está en la lista de palabras vetadas
del preset, la regla R-07 la marca como bloqueo y la capa la reemplaza durante la generación.
