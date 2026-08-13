/* Serverless · GET /api/estado
   Le dice a la app si hay clave configurada en el entorno de Vercel.
   Sin clave la demo igual corre: los tres casos son guionados y el Caso libre
   cae a su motor local determinista. */
export default function handler(req, res) {
  res.status(200).json({ ok: true, ia: Boolean(process.env.ANTHROPIC_API_KEY) });
}
