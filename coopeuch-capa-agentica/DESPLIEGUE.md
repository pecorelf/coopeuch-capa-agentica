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
- `api/generar.js` está configurada con `maxDuration: 60`. En Hobby el techo son 60 s; si alguna
  llamada se corta, la app cae sola al motor local y sigue funcionando.
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
