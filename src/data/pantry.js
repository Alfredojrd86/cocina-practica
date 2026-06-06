// Catálogo único de ingredientes (base escalable).
// Despensa, matching de recetas y sugerencias de IA apuntan aquí.
// key: id estable · label: display · cat: categoría · kw: palabras para detectar en texto.

export const CATALOG = [
  // Proteínas
  { key: "pollo", label: "Pollo", cat: "Proteínas", kw: ["pollo"] },
  { key: "res", label: "Carne de res", cat: "Proteínas", kw: ["carne de res", "res"] },
  { key: "cerdo", label: "Cerdo", cat: "Proteínas", kw: ["cerdo", "tocino"] },
  { key: "higado", label: "Hígado de res", cat: "Proteínas", kw: ["hígado", "higado"] },
  { key: "atun", label: "Atún", cat: "Proteínas", kw: ["atún", "atun"] },
  { key: "sardinas", label: "Sardinas", cat: "Proteínas", kw: ["sardina"] },
  { key: "huevos", label: "Huevos", cat: "Proteínas", kw: ["huevo"] },
  // Lácteos
  { key: "queso", label: "Queso llanero", cat: "Lácteos", kw: ["queso llanero", "queso blanco", "queso"] },
  { key: "gouda", label: "Queso gouda", cat: "Lácteos", kw: ["gouda"] },
  { key: "yogur", label: "Yogur griego", cat: "Lácteos", kw: ["yogur"] },
  { key: "leche", label: "Leche", cat: "Lácteos", kw: ["leche"] },
  { key: "mantequilla", label: "Mantequilla", cat: "Lácteos", kw: ["mantequilla"] },
  // Frutas
  { key: "manzana_verde", label: "Manzana verde", cat: "Frutas", kw: ["manzana verde"] },
  { key: "manzana_roja", label: "Manzana roja", cat: "Frutas", kw: ["manzana roja"] },
  { key: "aguacate", label: "Aguacate", cat: "Frutas", kw: ["aguacate", "palta"] },
  { key: "cambur", label: "Cambur", cat: "Frutas", kw: ["cambur"] },
  { key: "uvas", label: "Uvas", cat: "Frutas", kw: ["uva"] },
  // Vegetales
  { key: "brocoli", label: "Brócoli", cat: "Vegetales", kw: ["brócoli", "brocoli"] },
  { key: "espinaca", label: "Espinaca", cat: "Vegetales", kw: ["espinaca"] },
  { key: "pimenton", label: "Pimentón", cat: "Vegetales", kw: ["pimentón", "pimenton"] },
  { key: "tomate", label: "Tomate", cat: "Vegetales", kw: ["tomate"] },
  { key: "cebolla", label: "Cebolla", cat: "Vegetales", kw: ["cebolla"] },
  { key: "ajo", label: "Ajo", cat: "Vegetales", kw: ["ajo"] },
  // Carbohidratos
  { key: "batata", label: "Batata rosada", cat: "Carbohidratos", kw: ["batata", "sweet potato"] },
  { key: "platano", label: "Plátano verde", cat: "Carbohidratos", kw: ["plátano", "platano"] },
  { key: "yuca", label: "Yuca", cat: "Carbohidratos", kw: ["yuca"] },
  { key: "caraotas", label: "Caraotas negras", cat: "Carbohidratos", kw: ["caraota"] },
  { key: "lentejas", label: "Lentejas", cat: "Carbohidratos", kw: ["lenteja"] },
  { key: "arepa", label: "Harina de maíz (arepa)", cat: "Carbohidratos", kw: ["arepa", "maíz", "maiz"] },
  // Grasas y otros
  { key: "aceite", label: "Aceite de oliva", cat: "Grasas y otros", kw: ["aceite de oliva", "aceite"] },
  { key: "frutos_secos", label: "Frutos secos", cat: "Grasas y otros", kw: ["fruto seco", "frutos secos", "nuez", "nueces", "almendra"] },
  { key: "miel", label: "Miel", cat: "Grasas y otros", kw: ["miel"] },
  { key: "sal", label: "Sal marina", cat: "Grasas y otros", kw: ["sal marina", "sal"] },
];

export const PANTRY_CATS = [...new Set(CATALOG.map((c) => c.cat))];

// Estados de despensa. Por defecto (sin marcar) se asume "tengo".
export const PANTRY_STATES = ["tengo", "poco", "agotado"];
export const PANTRY_INFO = {
  tengo: { label: "Tengo", color: "#2F7D32", bg: "rgba(47,125,50,0.13)" },
  poco: { label: "Poco", color: "#B8860B", bg: "rgba(184,134,11,0.15)" },
  agotado: { label: "Agotado", color: "#BF5B3C", bg: "rgba(191,91,60,0.14)" },
};

export const statusOf = (key, pantry) => pantry?.[key] || "tengo";
export const nextStatus = (s) => PANTRY_STATES[(PANTRY_STATES.indexOf(s) + 1) % PANTRY_STATES.length];

// Encuentra el ítem del catálogo mencionado en un texto.
export function findItem(text) {
  const t = (text || "").toLowerCase();
  // Prioriza coincidencias de keyword más largas (más específicas).
  let best = null, bestLen = 0;
  for (const item of CATALOG) {
    for (const k of item.kw) {
      if (t.includes(k) && k.length > bestLen) { best = item; bestLen = k.length; }
    }
  }
  return best;
}

// Ingredientes del catálogo presentes en una sugerencia (por su texto).
export function extractItems(sug) {
  const found = new Map();
  for (const p of sug.pasos || []) {
    for (const item of CATALOG) {
      const hay = item.kw.some((k) => `${p.n} ${p.p}`.toLowerCase().includes(k));
      if (hay) found.set(item.key, item);
    }
  }
  return [...found.values()];
}

// Dada una lista de nombres libres (p. ej. de la IA), mapea a ítems del catálogo.
export function itemsFromNames(names) {
  const found = new Map();
  for (const n of names || []) {
    const item = findItem(n);
    if (item) found.set(item.key, item);
  }
  return [...found.values()];
}

// Baja un nivel: tengo -> poco -> agotado (agotado se queda).
export function stepDown(s) {
  if (s === "tengo") return "poco";
  if (s === "poco") return "agotado";
  return "agotado";
}

// Aplica "lo cociné": baja un nivel cada ingrediente usado. Devuelve nuevo mapa.
export function applyCooked(items, pantry) {
  const next = { ...pantry };
  for (const it of items) next[it.key] = stepDown(statusOf(it.key, pantry));
  return next;
}

// Separa ítems en los que tienes (tengo/poco) y los que faltan (agotado).
export function splitByPantry(items, pantry) {
  const have = [], missing = [];
  for (const it of items) {
    if (statusOf(it.key, pantry) === "agotado") missing.push(it);
    else have.push(it);
  }
  return { have, missing };
}
