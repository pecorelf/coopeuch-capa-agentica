/* Llamada a la capa para el Caso libre. Si no hay backend o clave, el llamador
   usa su motor local: la demo nunca se cae por falta de conexion. */
export async function generar(system: string, user: string, maxTokens = 1200) {
  const r = await fetch("/api/generar", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ system, user, maxTokens }),
  });
  if (!r.ok) throw new Error("sin_ia");
  const { texto } = await r.json();
  const limpio = String(texto || "").replace(/```json/g, "").replace(/```/g, "").trim();
  const i = limpio.indexOf("{");
  const j = limpio.lastIndexOf("}");
  if (i < 0 || j < 0) throw new Error("respuesta_no_json");
  return JSON.parse(limpio.slice(i, j + 1));
}

export async function hayIA(): Promise<boolean> {
  try {
    const r = await fetch("/api/estado");
    if (!r.ok) return false;
    const d = await r.json();
    return Boolean(d.ia);
  } catch {
    return false;
  }
}
