// Netlify Function: valida con Groq si un alimento es saludable. Mismo gating + rate limit.
const MODEL = "llama-3.3-70b-versatile";
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
  if (!supaUrl || !anon || !service) return json(503, { error: "Auth no configurada." });

  const token = (event.headers.authorization || event.headers.Authorization || "").replace(/^Bearer\s+/i, "").trim();
  const userObj = await getUser(token, supaUrl, anon);
  if (!userObj || !userObj.id) return json(401, { error: "Inicia sesión." });

  let usage;
  try { usage = await bumpUsage(userObj.id, supaUrl, service); } catch { return json(500, { error: "No se pudo verificar el uso." }); }
  if (usage && usage.allowed === false) return json(429, { error: `Límite diario de IA (${usage.max_n}).` });

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "JSON inválido" }); }
  const food = (body.food || "").toString().slice(0, 60);
  if (!food.trim()) return json(400, { error: "Falta el alimento" });

  const prompt =
    `¿"${food}" es un alimento saludable para una dieta de comida real (no procesada)? ` +
    `Responde SOLO JSON: {"ok":boolean,"reason":"motivo corto en español"}. ` +
    `ok=false si es ultraprocesado, dulce, repostería/pan dulce, frito, bebida azucarada, alcohol, refinado o chatarra. ` +
    `ok=true si es comida real (carne, pescado, huevo, verdura, fruta entera, legumbre, fruto seco, lácteo simple, grasa natural).`;

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!r.ok) return json(502, { error: "Error de Groq" });
    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || "";
    let parsed;
    try { parsed = JSON.parse(text); } catch { return json(502, { error: "Respuesta no parseable" }); }
    return json(200, { ok: parsed.ok !== false, reason: parsed.reason || "" });
  } catch (e) {
    return json(500, { error: String(e) });
  }
};
