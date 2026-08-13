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
| 01 Casos | Tres campañas reales de Coopeuch, reproducidas paso a paso como un recorrido: se ve trabajar a cada agente. |
| 02 Caso libre | Brief propio con selección múltiple de productos, segmentos y canales. Cada salida de los agentes es editable y se pueden relanzar los siguientes. Al final, descarga o transferencia a Marketing Cloud. |
| 03 Resultado | Refleja la última corrida real (caso reproducido o caso libre): pieza activada, paquete, bitácora y biblioteca. |
| 04 Método | Panel de socios sintéticos con ficha por socio, y la métrica de legibilidad. |
| 05 Configuración | Fuentes conectadas, contexto y voz de marca, brand book, fuente de imágenes y objetivo de comprensión. |

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
estilizadas en situaciones cotidianas, paleta cálida con el rojo de marca como acento. No es un
modelo de imagen fotorrealista: si se quiere fotografía o ilustración de banco, el punto de
conexión es esa misma función `correrImagen`, cambiando la llamada por un proveedor de imágenes.


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
