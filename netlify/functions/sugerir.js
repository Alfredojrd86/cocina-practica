// Netlify Function: proxy seguro a Gemini.
// El key vive aquí (lado servidor) en process.env.GEMINI_API_KEY.
// El navegador llama a /.netlify/functions/sugerir y nunca ve el key.

const MODEL = "gemini-1.5-flash";

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

  const key = process.env.GEMINI_API_KEY;
  if (!key) return json(500, { error: "Falta GEMINI_API_KEY en las variables de entorno de Netlify." });

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "JSON inválido" });
  }

  const { approach = "balanceado", meal = "Almuerzo", ingredients = [] } = body;
  const enfoque = APPROACH_LABEL[approach] || APPROACH_LABEL.balanceado;
  const lista = Array.isArray(ingredients) && ingredients.length ? ingredients.join(", ") : "ingredientes saludables comunes";

  const prompt =
    `Eres un asistente de cocina saludable. Sugiere UNA idea de ${meal} siguiendo ${enfoque}. ` +
    `Usa SOLO estos ingredientes disponibles: ${lista}. Sin azúcar añadida. ` +
    `Responde EXCLUSIVAMENTE en JSON válido con esta forma exacta: ` +
    `{"titulo":"string","pasos":[{"n":"nombre del componente","p":"preparación breve en una o dos frases"}]}. ` +
    `Todo en español. Entre 1 y 4 pasos.`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.9, responseMimeType: "application/json" },
        }),
      }
    );

    if (!r.ok) {
      const t = await r.text();
      return json(502, { error: "Error de Gemini", detail: t.slice(0, 300) });
    }

    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      return json(502, { error: "Respuesta no parseable", raw: text.slice(0, 300) });
    }

    if (!parsed?.titulo || !Array.isArray(parsed?.pasos)) {
      return json(502, { error: "Formato inesperado", raw: parsed });
    }

    return json(200, parsed);
  } catch (e) {
    return json(500, { error: String(e) });
  }
};
