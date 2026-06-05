// Clasificación de alimentos para dar feedback al usuario.
// Frank Suárez: Tipo A (no sube glucosa) / Tipo E (sube glucosa, moderar) / MOD (fruta, moderar).
// Saladino: marca granos y legumbres que su enfoque evita.

// Palabras clave por categoría. Se buscan dentro del nombre del componente (en minúsculas).
const E_KEYWORDS = ["batata", "plátano", "platano", "yuca", "caraota", "lenteja", "arepa", "arroz", "avena", "maíz", "maiz", "miel", "cambur", "uva", "sweet potato"];
const MOD_KEYWORDS = ["manzana", "fresa", "arándano", "arandano", "kiwi", "pera", "naranja", "mandarina", "durazno", "fruta"];
const EVITA_SALADINO = ["caraota", "lenteja", "arepa", "arroz", "avena", "maíz", "maiz"];

const has = (name, list) => list.some((k) => name.includes(k));

// Devuelve { tipo: 'A' | 'E' | 'MOD', evitaSaladino: boolean }
export function classifyComponent(nombre) {
  const n = (nombre || "").toLowerCase();
  const evitaSaladino = has(n, EVITA_SALADINO);
  if (has(n, E_KEYWORDS)) return { tipo: "E", evitaSaladino };
  if (has(n, MOD_KEYWORDS)) return { tipo: "MOD", evitaSaladino };
  return { tipo: "A", evitaSaladino };
}

export const TIPO_INFO = {
  A: { label: "Tipo A", color: "#2F7D32", bg: "rgba(47,125,50,0.13)", desc: "No sube la glucosa. Come con libertad." },
  E: { label: "Tipo E", color: "#BF5B3C", bg: "rgba(191,91,60,0.13)", desc: "Sube la glucosa. Modera: máximo 1/4 del plato." },
  MOD: { label: "Fruta", color: "#B8860B", bg: "rgba(184,134,11,0.14)", desc: "Azúcar natural. Con moderación." },
};

// Analiza una lista de componentes [{n,p}] y devuelve badges + resumen + consejo.
export function analyzeSuggestion(items, approach) {
  const badges = items.map((it) => ({ n: it.n, ...classifyComponent(it.n) }));
  const nE = badges.filter((b) => b.tipo === "E").length;
  const nMod = badges.filter((b) => b.tipo === "MOD").length;
  const evita = badges.filter((b) => b.evitaSaladino).map((b) => b.n);

  let consejo = "";
  if (approach === "metabolismo") {
    if (nE === 0) consejo = "Plato mayormente Tipo A: ideal para controlar la glucosa.";
    else consejo = `Incluye ${nE} alimento(s) Tipo E. Sírvelos como máximo 1/4 del plato.`;
  } else if (approach === "animal") {
    if (evita.length) consejo = `Saladino evita: ${evita.join(", ")}. Cámbialo por carne, huevo o fruta si sigues su enfoque estricto.`;
    else consejo = "Encaja con el enfoque animal-based.";
  } else {
    if (nE === 0) consejo = "Plato equilibrado y bajo en glucosa.";
    else consejo = `Equilibrado. Modera la porción de los ${nE} alimento(s) Tipo E.`;
  }
  if (nMod && approach === "metabolismo") consejo += " La fruta, con moderación.";

  return { badges, consejo };
}
