// Netlify Function: proxy seguro a Groq (OpenAI-compatible).
// El key vive aquí (lado servidor) en process.env.GROQ_API_KEY.
// El navegador llama a /.netlify/functions/sugerir y nunca ve el key.

const MODEL = "llama-3.3-70b-versatile";
const DAILY_LIMIT = 15; // consultas de IA por usuario por día

// Verifica el token de Supabase y devuelve el usuario, o null si inválido.
async function getUser(token, supaUrl, anon) {
  if (!token || !supaUrl || !anon) return null;
  try {
    const r = await fetch(`${supaUrl}/auth/v1/user`, {
      headers: { apikey: anon, Authorization: `Bearer ${token}` },
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// Incrementa el uso diario de forma atómica (RPC con service role). Devuelve {allowed, used, max_n}.
async function bumpUsage(userId, supaUrl, service) {
  const r = await fetch(`${supaUrl}/rest/v1/rpc/increment_ai_usage`, {
    method: "POST",
    headers: { apikey: service, Authorization: `Bearer ${service}`, "Content-Type": "application/json" },
    body: JSON.stringify({ p_user: userId, p_max: DAILY_LIMIT }),
  });
  if (!r.ok) throw new Error("rpc " + r.status + " " + (await r.text()).slice(0, 200));
  const rows = await r.json();
  return Array.isArray(rows) ? rows[0] : rows;
}

const APPROACH_LABEL = {
  metabolismo:
    "la Dieta 3x1 de Frank Suárez: controlar la glucosa, mucha proteína y vegetales Tipo A, pocos almidones Tipo E (máximo 1/4 del plato), sin azúcar añadida",
  animal:
    "la dieta animal-based de Paul Saladino: carnes, vísceras (hígado), huevos, lácteos, pescado, fruta y miel; evita granos y legumbres",
  balanceado:
    "una mezcla equilibrada del enfoque 3x1 de Frank Suárez y el animal-based de Paul Saladino",
};

function json(statusCode, obj) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Método no permitido" });

  const key = process.env.GROQ_API_KEY;
  if (!key) return json(500, { error: "Falta GROQ_API_KEY en las variables de entorno de Netlify." });

  // --- Auth + rate limit (solo usuarios registrados) ---
  const supaUrl = process.env.VITE_SUPABASE_URL ? (() => { try { return new URL(process.env.VITE_SUPABASE_URL).origin; } catch { return process.env.VITE_SUPABASE_URL; } })() : null;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supaUrl || !anon || !service) return json(503, { error: "Autenticación de IA no configurada en el servidor." });

  const authHeader = event.headers.authorization || event.headers.Authorization || "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const userObj = await getUser(token, supaUrl, anon);
  if (!userObj || !userObj.id) return json(401, { error: "Inicia sesión para usar la IA." });

  let usage;
  try {
    usage = await bumpUsage(userObj.id, supaUrl, service);
  } catch (e) {
    return json(500, { error: "No se pudo verificar el uso de IA.", detail: String(e).slice(0, 200) });
  }
  if (usage && usage.allowed === false) {
    return json(429, { error: `Llegaste a tu límite diario de IA (${usage.max_n}). Vuelve mañana.`, used: usage.used, max: usage.max_n });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "JSON inválido" });
  }

  const { approach = "balanceado", meal = "Almuerzo", ingredients = [], people = 1, quick = false } = body;
  const enfoque = APPROACH_LABEL[approach] || APPROACH_LABEL.balanceado;
  const lista = Array.isArray(ingredients) && ingredients.length ? ingredients.join(", ") : "ingredientes saludables comunes";
  const personas = Number(people) > 0 ? Number(people) : 1;
  const rapida = quick ? " Que sean RÁPIDAS: sin horno, pocos pasos y pocos ingredientes." : "";

  const sys =
    "Eres un asistente de cocina saludable. Respondes EXCLUSIVAMENTE en JSON válido, en español. " +
    'La forma exacta es: {"sugerencias":[{"titulo":"string","pasos":[{"n":"nombre del componente","p":"preparación breve con cantidades"}]}]}. ' +
    "Devuelve EXACTAMENTE 3 sugerencias distintas, cada una con 1 a 4 pasos. Sin texto fuera del JSON.";

  const user =
    `Sugiere 3 ideas distintas de ${meal} siguiendo ${enfoque}. ` +
    `Usa SOLO estos ingredientes disponibles: ${lista}. Sin azúcar añadida. ` +
    `Indica cantidades aproximadas para ${personas} persona(s).${rapida} ` +
    `Reglas: la cebolla SIEMPRE cocida o salteada, nunca cruda. NUNCA combines queso con ninguna fruta.`;

  try {
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: sys },
          { role: "user", content: user },
        ],
      }),
    });

    if (!r.ok) {
      const t = await r.text();
      return json(502, { error: "Error de Groq", detail: t.slice(0, 800) });
    }

    const data = await r.json();
    const text = data?.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return json(502, { error: "Respuesta no parseable", raw: text.slice(0, 300) });
    }

    // Acepta {sugerencias:[...]} o una sola receta {titulo,pasos}.
    let sugerencias = Array.isArray(parsed?.sugerencias) ? parsed.sugerencias : (parsed?.titulo ? [parsed] : null);
    sugerencias = (sugerencias || []).filter((s) => s && s.titulo && Array.isArray(s.pasos));
    if (!sugerencias.length) {
      return json(502, { error: "Formato inesperado", raw: parsed });
    }

    return json(200, { sugerencias, usage: usage ? { used: usage.used, max: usage.max_n } : null });
  } catch (e) {
    return json(500, { error: String(e) });
  }
};
