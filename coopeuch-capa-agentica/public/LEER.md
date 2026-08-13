# Assets de marca

Esta carpeta va con los archivos reales de Coopeuch:

- `logo-coopeuch.png` — se usa en la cabecera y en las piezas de correo.
- `favicon.ico`

**No vienen en el paquete a propósito.** En iteraciones anteriores se incluían marcadores de
posición generados, y al descomprimir sobrescribían los archivos correctos. Si estos dos archivos
faltan, la app funciona igual: el logo simplemente no se dibuja (hay un `onError` que lo oculta).
