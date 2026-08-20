/* Serverless · POST /api/generar
   Proxy a la API de Anthropic. La clave vive en las variables de entorno de
   Vercel y nunca llega al navegador. */
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "metodo_no_permitido" });
  }

  const KEY = process.env.ANTHROPIC_API_KEY;
  if (!KEY) return res.status(503).json({ error: "sin_clave" });

  const { system, user, maxTokens } = req.body || {};
  if (!user) return res.status(400).json({ error: "falta_user" });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.MODELO || "claude-sonnet-4-6",
        max_tokens: Math.min(Number(maxTokens) || 1200, 4000),
        system,
        messages: [{ role: "user", content: user }],
      }),
    });

    if (!r.ok) {
      const detalle = await r.text();
      console.error("Anthropic respondió", r.status, detalle.slice(0, 400));
      return res.status(502).json({ error: "upstream", status: r.status });
    }

    const data = await r.json();
    const texto = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");

    res.status(200).json({ texto });
  } catch (e) {
    console.error("Error en /api/generar:", e);
    res.status(500).json({ error: String(e && e.message ? e.message : e) });
  }
}
