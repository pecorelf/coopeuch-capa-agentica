# Assets de marca

Logos que la aplicación busca en esta carpeta:

| Archivo | Dónde se usa | Estado |
|---|---|---|
| `logo-deloitte.png` | pantalla de acceso | falta |
| `logo-coopeuch.png` | cabecera y piezas, preset Coopeuch | incluido |
| `logo-lipigas.png` | preset Lipigas | incluido |

| `logo-santander.png`, `logo-banco-chile.png`, `logo-itau.png`, `logo-bci.png`, `logo-bancoestado.png`, `logo-falabella.png` | presets de bancos | faltan |

El **favicon no va acá**: lo dibuja la aplicación con el color y la inicial de la institución
activa (`src/lib/favicon.ts`). Si se carga un logo desde /admin, ese logo pasa a ser el favicon.

**Todo en minúsculas.** Windows no distingue mayúsculas en los nombres de archivo y Linux sí: un
archivo `Logo-Coopeuch.PNG` funciona en local y devuelve 404 en producción.

Si un logo falta, la aplicación funciona igual: el componente `<Logo>` prueba varias grafías y, si
no encuentra ninguna, no dibuja nada.
