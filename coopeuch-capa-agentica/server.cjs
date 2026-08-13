/* Servidor unico: sirve la app compilada y proxea las llamadas del Caso libre.
   CommonJS a proposito. node server.js -> http://localhost:3003            */
const express = require("express");
const path = require("path");
const fs = require("fs");

try { require("dotenv").config(); } catch (e) {}

const app = express();
const PORT = process.env.PORT || 3003;
const KEY = process.env.ANTHROPIC_API_KEY || "";

app.use(express.json({ limit: "1mb" }));

app.get("/api/estado", (_req, res) => res.json({ ok: true, ia: Boolean(KEY) }));

app.post("/api/generar", async (req, res) => {
  const { system, user, maxTokens } = req.body || {};
  if (!KEY) return res.status(503).json({ error: "sin_clave" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: maxTokens || 1200,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await r.json();
    const texto = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    res.json({ texto });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

const dist = path.join(__dirname, "dist");
if (fs.existsSync(dist)) {
  app.use(express.static(dist));
  app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));
} else {
  app.get("/", (_req, res) =>
    res.send("Falta compilar. Ejecuta: npm run build (o npm run dev en el puerto 5173).")
  );
}

app.listen(PORT, () => console.log("Capa Agentica Coopeuch en http://localhost:" + PORT));
