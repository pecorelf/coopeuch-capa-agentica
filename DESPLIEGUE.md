# Desplegar en Vercel

La app ya viene lista: hay dos funciones serverless en `/api` que reemplazan al `server.cjs`
local, y `vercel.json` con la configuración de build. No hay que tocar código.

---

## Opción A · desde GitHub (recomendada)

Es la que conviene si vas a seguir iterando: cada `git push` publica solo.

```powershell
cd C:\Users\fpecorella\proyectos-pocs\coopeuch-capa-agentica

git init
git add .
git commit -m "Capa Agentica de Marketing - Coopeuch"

gh repo create coopeuch-capa-agentica --private --source=. --push
```

Después, en https://vercel.com/new:

1. **Add New → Project** e importa el repo.
2. Vercel detecta Vite solo. No cambies nada de Framework, Build Command ni Output Directory.
3. Antes de darle Deploy, abre **Environment Variables** y agrega:

   | Name | Value | Environments |
   |---|---|---|
   | `ANTHROPIC_API_KEY` | tu clave `sk-ant-...` | Production, Preview, Development |

4. **Deploy**. En ~1 minuto queda en `https://coopeuch-capa-agentica.vercel.app`.

## Opción B · desde la terminal, sin GitHub

Más rápido si solo quieres publicarlo una vez.

```powershell
npm i -g vercel
cd C:\Users\fpecorella\proyectos-pocs\coopeuch-capa-agentica

vercel login
vercel            # primer deploy, responde las preguntas con los valores por defecto

vercel env add ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY preview

vercel --prod     # publica con la clave ya cargada
```

---

## Antes de subir

- **El logo.** `public/` no trae `logo-coopeuch.png` ni `favicon.ico` a propósito. Ponlos ahí
  antes del deploy o la cabecera saldrá sin logo. No hay que tocar código: el componente prueba
  `logo-coopeuch.png`, `.jpg`, `.svg` y `logo.png`.
- **La clave.** No la pongas en el `.env` del repo. `.gitignore` ya lo excluye, pero conviene
  revisarlo: `git status` no debería listar `.env`.
- **Node.** El proyecto pide Node 20 o superior (`engines` en `package.json`). Vercel usa 22 por
  defecto, así que no hay que configurar nada.

## Cómo verificar que quedó bien

1. Abre la URL. Arriba a la derecha, en el Caso libre, debe decir **IA en vivo** (chip verde). Si
   dice *motor local*, la variable de entorno no quedó cargada o el deploy es anterior a haberla
   agregado — agrégala y vuelve a desplegar con `vercel --prod` o un push nuevo.
2. Prueba directo el endpoint: `https://TU-URL.vercel.app/api/estado` debe devolver
   `{"ok":true,"ia":true}`.
3. Ejecuta la capa en el Caso libre. Si genera las tres variantes con texto distinto al de las
   plantillas, la IA está corriendo.

## Costo y límites

- El plan Hobby de Vercel alcanza de sobra para una demo de cliente.
- `api/generar.js` declara su propio `maxDuration: 60` con `export const config` dentro del
  archivo, no en `vercel.json`. En Hobby el techo son 60 s; si alguna llamada se corta, la app cae
  sola al motor local y sigue funcionando.
- El consumo de la API de Anthropic corre por tu cuenta: cada corrida del Caso libre son ~6
  llamadas. Los tres casos guionados no consumen nada.

## Si la demo es para una reunión con el cliente

Vale la pena proteger la URL para que no quede pública mientras la propuesta está abierta:
**Project → Settings → Deployment Protection → Vercel Authentication**, o
**Password Protection** si quieres compartirla con Coopeuch sin que tengan cuenta de Vercel.

## Local, sin cambios

El `server.cjs` sigue funcionando igual para trabajar sin conexión:

```powershell
npm run build
node server.cjs     # http://localhost:3003
```

o `npm run dev` en el 5173, que proxea `/api` al 3003.


## Errores frecuentes

**`The pattern "api/generar.js" defined in functions doesn't match...`**
Sobra la clave `functions` en `vercel.json`. El límite de duración ya viaja dentro del propio
archivo (`export const config = { maxDuration: 60 }`), así que `vercel.json` debe quedar solo con
framework, buildCommand y outputDirectory.

**`404 DEPLOYMENT_NOT_FOUND`**
El proyecto existe pero no tiene ningún deploy exitoso. Suele pasar cuando se creó desde un repo
de GitHub vacío: hay que subir un commit o desplegar con `vercel --prod`.

**`Command "vite build" exited with 127`**
127 es "comando no encontrado": Vercel no instaló las herramientas de build. Por eso `vite`,
`@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer` y `typescript` están en
`dependencies` y no en `devDependencies` — así se instalan siempre, sin depender de cómo quede
configurado el Install Command del proyecto.

**`404 NOT_FOUND`**
El deploy existe pero no encuentra `index.html`. Casi siempre es una carpeta anidada
(`proyecto\proyecto\`): hay que desplegar desde la carpeta que contiene `package.json`, o poner
esa subcarpeta en Settings → General → Root Directory.

## Assets que van en /public

| Archivo | Dónde se usa |
|---|---|
| `logo-deloitte.png` | pantalla de acceso |
| `logo-coopeuch.png` | cabecera y piezas de correo |
| `favicon.ico` o `favicon.png` | pestaña del navegador |
| `logo-santander.png`, `logo-banco-chile.png`, … | presets de otras instituciones |

**El error más común: mayúsculas.** Windows no distingue mayúsculas en los nombres de archivo y
Linux sí. Un archivo guardado como `Logo-Coopeuch.PNG` funciona en local y devuelve 404 en Vercel.
El componente `<Logo>` prueba varias grafías, pero lo correcto es dejarlos en minúsculas.

Después de copiar los archivos a `public/`, hay que **volver a compilar y desplegar**: `public/` se
copia a `dist/` durante el build, y `vercel --prod` sube lo que hay en el repositorio, no lo que
quedó en `dist/` de una compilación anterior.

## Acceso

Pantalla de clave compartida con cuatro usuarios (Italo Pinochet, Luz Elena Parra, Francisco
Pecorella, Greshy Moreno) y la clave `deloitte-2026`, definida en `src/estado/sesion.ts`.

Es una barrera de presentación, no un control de seguridad: la clave viaja en el código del
navegador y cualquiera con las herramientas de desarrollo puede leerla. Para que la URL no quede
pública, lo que corresponde es **Settings → Deployment Protection → Password Protection** en Vercel.

## Multi-institución

`/admin` permite cambiar la institución con la que corre la demostración: marca, colores,
vocabulario, productos, segmentos y el contexto que reciben los agentes. Presets incluidos:
Coopeuch, Banco de Chile, Santander, Itaú, Bci, BancoEstado, Banco Falabella e Institución A1
(neutro).

También se puede abrir ya configurada por URL: `?institucion=santander`.

Lo que **no** se traduce automáticamente son los tres casos base: están guionados sobre hechos
verificables de Coopeuch. Para otra institución hay que escribir sus propios casos. El Caso custom,
las audiencias y el set de reglas sí se adaptan.


## Cambiar la URL del proyecto

La URL viene del nombre del proyecto en Vercel. Como la demostración ahora sirve a varias
instituciones, conviene un nombre neutro: `capa-agentica-marketing`.

**Opción 1 · renombrar el proyecto existente (conserva el historial)**

En Vercel: **Settings → General → Project Name** → `capa-agentica-marketing` → Save.
La URL pasa a `https://capa-agentica-marketing.vercel.app`. La anterior deja de responder.

**Opción 2 · agregar un dominio y dejar los dos**

**Settings → Domains → Add** → `capa-agentica-marketing.vercel.app`. Quedan ambas activas y se
puede marcar la nueva como principal. Útil si ya compartiste la anterior con alguien.

**Opción 3 · desplegar como proyecto nuevo**

```powershell
rmdir /s /q .vercel
vercel --prod
```

Cuando pregunte por el nombre, escribir `capa-agentica-marketing`. Hay que volver a cargar la
variable `ANTHROPIC_API_KEY`.

Para abrir la demostración ya configurada por cliente:
`https://capa-agentica-marketing.vercel.app/?institucion=santander`
