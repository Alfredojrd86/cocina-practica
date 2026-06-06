// Motor de reglas escalable: cada enfoque evalúa un producto y devuelve { verdict, reasons }.
// Agregar un enfoque futuro = añadir una entrada a DIETS. No se toca el resto.

const has = (t, words) => words.some((w) => t.includes(w));

const SUGAR = ["azúcar", "azucar", "jarabe", "sirope", "glucosa", "fructosa", "dextrosa", "maltodextrina", "sugar", "syrup", "miel de maíz"];
const SEED_OILS = ["girasol", "canola", "colza", "soya", "soja", "maíz", "maiz", "palma", "sunflower", "rapeseed", "soybean", "palm oil", "vegetal"];
const GRAINS = ["trigo", "harina", "arroz", "avena", "cebada", "centeno", "wheat", "flour", "rice", "oat", "barley", "maicena"];
const LEGUMES = ["lenteja", "garbanzo", "frijol", "caraota", "poroto", "soya", "soja", "lentil", "bean", "chickpea"];

function signals(p) {
  return {
    ultra: p.nova === 4,
    addCount: (p.additives || []).length,
    sugarIng: has(p.ingredients, SUGAR),
    sugarHigh: p.sugars != null && p.sugars > 15,
    sugarMod: p.sugars != null && p.sugars > 5,
    carbHigh: p.carbs != null && p.carbs > 25,
  };
}

const ORDER = { ok: 0, moderar: 1, evita: 2 };
const worst = (a, b) => (ORDER[a] >= ORDER[b] ? a : b);

export const DIETS = {
  metabolismo: {
    label: "3x1",
    evaluate(p) {
      const b = signals(p); let v = "ok"; const r = [];
      if (b.sugarIng) { v = worst(v, "evita"); r.push("Tiene azúcar añadida"); }
      if (b.sugarHigh) { v = worst(v, "evita"); r.push(`Alto en azúcar (${p.sugars} g/100g)`); }
      else if (b.sugarMod) { v = worst(v, "moderar"); r.push(`Algo de azúcar (${p.sugars} g/100g)`); }
      if (b.carbHigh) { v = worst(v, "moderar"); r.push("Alto en carbohidratos (Tipo E)"); }
      if (b.ultra) { v = worst(v, "moderar"); r.push("Ultraprocesado (NOVA 4)"); }
      if (v === "ok") r.push("Bajo en azúcar: encaja con el 3x1");
      return { verdict: v, reasons: r };
    },
  },
  animal: {
    label: "Animal",
    evaluate(p) {
      const b = signals(p); let v = "ok"; const r = [];
      if (has(p.ingredients, SEED_OILS)) { v = worst(v, "evita"); r.push("Aceites de semilla / vegetales"); }
      if (has(p.ingredients, GRAINS)) { v = worst(v, "evita"); r.push("Contiene granos o harinas"); }
      if (has(p.ingredients, LEGUMES)) { v = worst(v, "evita"); r.push("Contiene legumbres"); }
      if (b.sugarIng || b.sugarHigh) { v = worst(v, "evita"); r.push("Azúcar añadida"); }
      if (b.addCount >= 1) { v = worst(v, "moderar"); r.push(`${b.addCount} aditivo(s)`); }
      if (b.ultra) { v = worst(v, "moderar"); r.push("Ultraprocesado (NOVA 4)"); }
      if (v === "ok") r.push("Comida simple: encaja con animal-based");
      return { verdict: v, reasons: r };
    },
  },
  balanceado: {
    label: "Balanceado",
    evaluate(p) {
      const b = signals(p); let v = "ok"; const r = [];
      if (b.sugarHigh) { v = worst(v, "evita"); r.push(`Alto en azúcar (${p.sugars} g/100g)`); }
      else if (b.sugarIng || b.sugarMod) { v = worst(v, "moderar"); r.push("Tiene algo de azúcar"); }
      if (has(p.ingredients, SEED_OILS)) { v = worst(v, "moderar"); r.push("Aceites de semilla"); }
      if (b.ultra) { v = worst(v, "moderar"); r.push("Ultraprocesado (NOVA 4)"); }
      if (v === "ok") r.push("Comida real y equilibrada");
      return { verdict: v, reasons: r };
    },
  },
};

export const VERDICT_INFO = {
  ok: { label: "Encaja", emoji: "✅", color: "#2F7D32", bg: "rgba(47,125,50,0.13)" },
  moderar: { label: "Modera", emoji: "⚠️", color: "#B8860B", bg: "rgba(184,134,11,0.15)" },
  evita: { label: "Evita", emoji: "⛔", color: "#BF5B3C", bg: "rgba(191,91,60,0.14)" },
};

export function evaluateProduct(approach, product) {
  const diet = DIETS[approach] || DIETS.balanceado;
  return { dietLabel: diet.label, ...diet.evaluate(product) };
}
