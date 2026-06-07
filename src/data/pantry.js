// Catálogo único de ingredientes (base escalable).
// unit: unidad · serving: cuánto se usa por persona por comida · base: compra por persona/mes ·
// condiment: dura meses, no se descuenta ni se marca como faltante · step: paso de ajuste manual.

export const CATALOG = [
  // Proteínas
  { key: "pollo", label: "Pollo", cat: "Proteínas", unit: "kg", base: 3, serving: 0.2, kw: ["pollo"] },
  { key: "res", label: "Carne de res", cat: "Proteínas", unit: "kg", base: 1.5, serving: 0.2, kw: ["carne de res", "res"] },
  { key: "cerdo", label: "Cerdo", cat: "Proteínas", unit: "kg", base: 1.5, serving: 0.2, kw: ["cerdo", "tocino"] },
  { key: "higado", label: "Hígado de res", cat: "Proteínas", unit: "kg", base: 0.5, serving: 0.15, kw: ["hígado", "higado"] },
  { key: "atun", label: "Atún", cat: "Proteínas", unit: "latas", base: 8, serving: 0.5, kw: ["atún", "atun"] },
  { key: "sardinas", label: "Sardinas", cat: "Proteínas", unit: "latas", base: 6, serving: 0.5, kw: ["sardina"] },
  { key: "huevos", label: "Huevos", cat: "Proteínas", unit: "unid.", base: 30, serving: 2, kw: ["huevo"] },
  // Lácteos
  { key: "queso", label: "Queso llanero", cat: "Lácteos", unit: "kg", base: 1, serving: 0.05, kw: ["queso llanero", "queso blanco", "queso"] },
  { key: "gouda", label: "Queso gouda", cat: "Lácteos", unit: "kg", base: 0.5, serving: 0.05, kw: ["gouda"] },
  { key: "yogur", label: "Yogur griego", cat: "Lácteos", unit: "kg", base: 1, serving: 0.15, kw: ["yogur"] },
  { key: "leche", label: "Leche", cat: "Lácteos", unit: "L", base: 4, serving: 0.2, kw: ["leche"] },
  { key: "mantequilla", label: "Mantequilla", cat: "Lácteos", unit: "kg", base: 0.5, serving: 0.02, condiment: true, kw: ["mantequilla"] },
  // Frutas
  { key: "manzana_verde", label: "Manzana verde", cat: "Frutas", unit: "unid.", base: 8, serving: 1, kw: ["manzana verde"] },
  { key: "manzana_roja", label: "Manzana roja", cat: "Frutas", unit: "unid.", base: 6, serving: 1, kw: ["manzana roja"] },
  { key: "aguacate", label: "Aguacate", cat: "Frutas", unit: "unid.", base: 8, serving: 0.5, kw: ["aguacate", "palta"] },
  { key: "cambur", label: "Cambur", cat: "Frutas", unit: "unid.", base: 8, serving: 1, kw: ["cambur"] },
  { key: "uvas", label: "Uvas", cat: "Frutas", unit: "kg", base: 1, serving: 0.1, kw: ["uva"] },
  // Vegetales
  { key: "brocoli", label: "Brócoli", cat: "Vegetales", unit: "unid.", base: 4, serving: 0.25, kw: ["brócoli", "brocoli"] },
  { key: "espinaca", label: "Espinaca", cat: "Vegetales", unit: "kg", base: 1, serving: 0.1, kw: ["espinaca"] },
  { key: "pimenton", label: "Pimentón", cat: "Vegetales", unit: "unid.", base: 6, serving: 0.5, kw: ["pimentón", "pimenton"] },
  { key: "tomate", label: "Tomate", cat: "Vegetales", unit: "kg", base: 2, serving: 0.15, kw: ["tomate"] },
  { key: "cebolla", label: "Cebolla", cat: "Vegetales", unit: "kg", base: 1.5, serving: 0.1, kw: ["cebolla"] },
  { key: "ajo", label: "Ajo", cat: "Vegetales", unit: "kg", base: 0.25, serving: 0.01, condiment: true, kw: ["ajo"] },
  // Carbohidratos
  { key: "batata", label: "Batata rosada", cat: "Carbohidratos", unit: "kg", base: 2, serving: 0.2, kw: ["batata", "sweet potato"] },
  { key: "platano", label: "Plátano verde", cat: "Carbohidratos", unit: "unid.", base: 6, serving: 1, kw: ["plátano", "platano"] },
  { key: "yuca", label: "Yuca", cat: "Carbohidratos", unit: "kg", base: 2, serving: 0.2, kw: ["yuca"] },
  { key: "caraotas", label: "Caraotas negras", cat: "Carbohidratos", unit: "kg", base: 1, serving: 0.1, kw: ["caraota"] },
  { key: "lentejas", label: "Lentejas", cat: "Carbohidratos", unit: "kg", base: 1, serving: 0.1, kw: ["lenteja"] },
  { key: "arepa", label: "Harina de maíz (arepa)", cat: "Carbohidratos", unit: "kg", base: 1, serving: 0.07, kw: ["arepa", "maíz", "maiz"] },
  // Grasas y otros (condimentos: no se descuentan)
  { key: "aceite", label: "Aceite de oliva", cat: "Grasas y otros", unit: "botella", base: 1, serving: 0.02, condiment: true, kw: ["aceite de oliva", "aceite"] },
  { key: "frutos_secos", label: "Frutos secos", cat: "Grasas y otros", unit: "kg", base: 0.5, serving: 0.03, kw: ["fruto seco", "frutos secos", "nuez", "nueces", "almendra"] },
  { key: "miel", label: "Miel", cat: "Grasas y otros", unit: "frasco", base: 1, serving: 0.05, condiment: true, kw: ["miel"] },
  { key: "sal", label: "Sal marina", cat: "Grasas y otros", unit: "paquete", base: 1, serving: 0.01, condiment: true, kw: ["sal marina", "sal"] },
  // Alimentos sugeridos por los autores (Saladino / Frank / Mediterráneo)
  { key: "salmon", label: "Salmón", cat: "Proteínas", unit: "kg", base: 0.5, serving: 0.15, kw: ["salmón", "salmon"] },
  { key: "mariscos", label: "Mariscos", cat: "Proteínas", unit: "kg", base: 0.5, serving: 0.15, kw: ["marisco", "camar", "langostino", "shrimp"] },
  { key: "tuetano", label: "Tuétano / médula", cat: "Proteínas", unit: "kg", base: 0.3, serving: 0.05, kw: ["tuétano", "tuetano", "médula", "medula"] },
  { key: "lechuga", label: "Lechuga", cat: "Vegetales", unit: "unid.", base: 4, serving: 0.25, kw: ["lechuga"] },
  { key: "pepino", label: "Pepino", cat: "Vegetales", unit: "unid.", base: 4, serving: 0.5, kw: ["pepino"] },
  { key: "calabacin", label: "Calabacín", cat: "Vegetales", unit: "unid.", base: 4, serving: 0.5, kw: ["calabac", "zapallo italiano", "zucchini"] },
  { key: "coliflor", label: "Coliflor", cat: "Vegetales", unit: "unid.", base: 2, serving: 0.25, kw: ["coliflor"] },
  { key: "esparragos", label: "Espárragos", cat: "Vegetales", unit: "kg", base: 0.5, serving: 0.1, kw: ["espárrago", "esparrago"] },
  { key: "apio", label: "Apio", cat: "Vegetales", unit: "unid.", base: 2, serving: 0.2, kw: ["apio"] },
  { key: "garbanzos", label: "Garbanzos", cat: "Carbohidratos", unit: "kg", base: 0.5, serving: 0.1, kw: ["garbanzo"] },
  { key: "aceitunas", label: "Aceitunas", cat: "Grasas y otros", unit: "kg", base: 0.3, serving: 0.03, kw: ["aceituna"] },
];

export const PANTRY_CATS = [...new Set(CATALOG.map((c) => c.cat))];
const BY_KEY = Object.fromEntries(CATALOG.map((c) => [c.key, c]));
export const getItem = (key) => BY_KEY[key];

export const PANTRY_INFO = {
  tengo: { label: "Tengo", color: "#2F7D32", bg: "rgba(47,125,50,0.13)" },
  poco: { label: "Poco", color: "#B8860B", bg: "rgba(184,134,11,0.15)" },
  agotado: { label: "Agotado", color: "#BF5B3C", bg: "rgba(191,91,60,0.14)" },
};

// --- Cantidades ---
const round = (n) => +Number(n).toFixed(2);
export const fullStock = (item, people) => round((item.base || 0) * (people || 1));
export const servingFor = (item, people) => round((item.serving || 0) * (people || 1));
export const stepFor = (item) => (item.unit === "kg" || item.unit === "L" ? 0.5 : 1);

// Convierte un valor crudo (número, estado viejo en texto, o vacío) a cantidad.
export function rawToQty(val, item, people) {
  if (typeof val === "number") return val;
  if (val === "agotado") return 0;
  if (val === "poco") return round(fullStock(item, people) * 0.4);
  if (val === "tengo") return fullStock(item, people);
  return fullStock(item, people); // sin marcar => lleno (optimista)
}

export const qtyOf = (key, pantry, people) => {
  const item = BY_KEY[key];
  return item ? rawToQty(pantry?.[key], item, people) : 0;
};

export function statusFromQty(qty, item, people) {
  if (item.condiment) return "tengo";
  const serv = servingFor(item, people);
  if (qty <= 0.0001) return "agotado";
  if (qty < Math.max(serv, fullStock(item, people) * 0.15)) return "poco";
  return "tengo";
}

export const statusOf = (key, pantry, people) => {
  const item = BY_KEY[key];
  if (!item) return "tengo";
  return statusFromQty(rawToQty(pantry?.[key], item, people), item, people);
};

// Llena todo a la compra del mes (base × personas).
export function restockAll(people) {
  const m = {};
  for (const c of CATALOG) m[c.key] = fullStock(c, people);
  return m;
}

// "Lo cociné": resta porción × personas a cada ingrediente (salta condimentos).
export function applyCooked(items, pantry, people) {
  const next = { ...pantry };
  for (const it of items) {
    if (it.condiment) continue;
    const cur = rawToQty(pantry[it.key], it, people);
    next[it.key] = Math.max(0, round(cur - servingFor(it, people)));
  }
  return next;
}

// Ajuste manual: suma delta (en pasos), clamp a >= 0.
export function adjustQty(key, pantry, people, delta) {
  const item = BY_KEY[key];
  const cur = rawToQty(pantry?.[key], item, people);
  return Math.max(0, round(cur + delta));
}

// --- Matching ---
export function findItem(text) {
  const t = (text || "").toLowerCase();
  let best = null, bestLen = 0;
  for (const item of CATALOG) {
    for (const k of item.kw) {
      if (t.includes(k) && k.length > bestLen) { best = item; bestLen = k.length; }
    }
  }
  return best;
}

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

export function itemsFromNames(names) {
  const found = new Map();
  for (const n of names || []) {
    const item = findItem(n);
    if (item) found.set(item.key, item);
  }
  return [...found.values()];
}

// Ingredientes (del catálogo, sin condimentos) que faltan para cocinar una sugerencia:
// los que no están en tu despensa (ocultos) o no tienen cantidad suficiente para 1 porción × personas.
export function missingToCook(sug, pantry, people, hidden) {
  const hiddenSet = new Set(hidden || []);
  const items = (sug.ingredientes && sug.ingredientes.length ? itemsFromNames(sug.ingredientes) : extractItems(sug)).filter((it) => !it.condiment);
  return items.filter((it) => hiddenSet.has(it.key) || qtyOf(it.key, pantry, people) < servingFor(it, people) - 0.0001);
}

// Separa ítems en los que tienes (tengo/poco) y los que faltan (agotado). Ignora condimentos en "falta".
export function splitByPantry(items, pantry, people) {
  const have = [], missing = [];
  for (const it of items) {
    if (statusOf(it.key, pantry, people) === "agotado") missing.push(it);
    else have.push(it);
  }
  return { have, missing };
}
