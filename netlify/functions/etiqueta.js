// Netlify Function: lee una FOTO de etiqueta nutricional con Groq (visión) y devuelve datos.
// Mismo gating (login) y rate limit que la función de sugerencias.

const MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"; // multimodal en Groq
const DAILY_LIMIT = 15;

function json(statusCode, obj) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(obj) };
}

async function getUser(token, supaUrl, anon) {
  if (!token || !supaUrl || !anon) return null;
  try {
    const r = await fetch(`${supaUrl}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

async function bumpUsage(userId, supaUrl, service) {
  const r = await fetch(`${supaUrl}/rest/v1/rpc/increment_ai_usage`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_user: userId, p_max: DAILY_LIMIT }),
  });
  if (!r.ok) throw new Error("rpc " + r.status);
  const rows = await r.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Método no permitido" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return json(500, { error: "Falta GROQ_API_KEY." });

  const supaUrl = process.env.VITE_SUPABASE_URL ? (() => { try { return new URL(process.env.VITE_SUPABASE_URL).origin; } catch { return process.env.VITE_SUPABASE_URL; } })() : null;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supaUrl || !anon || !service) return json(503, { error: "Auth de IA no configurada." });

  const token = (event.headers.authorization || event.headers.Authorization || "").replace(/^Bearer\s+/i, "").trim();
  const userObj = await getUser(token, supaUrl, anon);
  if (!userObj || !userObj.id) return json(401, { error: "Inicia sesión para leer etiquetas." });

  let usage;
  try { usage = await bumpUsage(userObj.id, supaUrl, service); } catch { return json(500, { error: "No se pudo verificar el uso." }); }
  if (usage && usage.allowed === false) return json(429, { error: `Llegaste a tu límite diario de IA (${usage.max_n}). Vuelve mañana.` });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "JSON inválido" }); }
  const image = body.image;
  if (!image || typeof image !== "string" || !image.startsWith("data:image")) return json(400, { error: "Falta la imagen." });

  const prompt =
    "Lee esta etiqueta de alimento. Devuelve EXCLUSIVAMENTE JSON válido en español con esta forma: " +
    '{"nombre":"string","sugars":number|null,"carbs":number|null,"proteins":number|null,"fat":number|null,"ingredientes":"string","sellos":["azucar"|"calorias"|"grasas"|"sodio"]}. ' +
    "Los valores nutricionales son por 100 g (número, sin unidad). 'sellos' = sellos negros chilenos visibles (vacío si no hay). Si un dato no aparece, usa null o cadena vacía. Sin texto fuera del JSON.";

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.1,
        response_format: { type: "json_object" },
        messages: [{
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } },
          ],
        }],
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      return json(502, { error: "Error de Groq (visión)", detail: t.slice(0, 500) });
    }
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || "";
    let parsed;
    try { parsed = JSON.parse(text); } catch { return json(502, { error: "Respuesta no parseable", raw: text.slice(0, 300) }); }
    return json(200, parsed);
  } catch (e) {
    return json(500, { error: String(e) });
  }
};
