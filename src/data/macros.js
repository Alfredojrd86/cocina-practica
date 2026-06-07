// Macros APROXIMADAS por porción (la "serving" de cada item del catálogo), en gramos.
// Son valores de referencia redondeados para una estimación rápida del plato,
// NO una etiqueta nutricional exacta. Items sin entrada (condimentos, sal) no suman.
import { itemsFromNames, extractItems } from "./pantry.js";

// { p: proteína, f: grasa, c: carbohidrato } en gramos por porción típica.
export const MACROS = {
  // Proteínas
  pollo: { p: 58, f: 8, c: 0 },
  res: { p: 52, f: 30, c: 0 },
  cerdo: { p: 50, f: 38, c: 0 },
  higado: { p: 30, f: 6, c: 5 },
  atun: { p: 11, f: 1, c: 0 },
  sardinas: { p: 10, f: 8, c: 0 },
  huevos: { p: 12, f: 10, c: 1 },
  salmon: { p: 30, f: 18, c: 0 },
  mariscos: { p: 28, f: 2, c: 2 },
  tuetano: { p: 1, f: 40, c: 0 },
  // Lácteos
  queso: { p: 11, f: 14, c: 1 },
  gouda: { p: 12, f: 14, c: 1 },
  yogur: { p: 15, f: 8, c: 6 },
  leche: { p: 7, f: 8, c: 10 },
  mantequilla: { p: 0, f: 16, c: 0 },
  // Frutas
  manzana_verde: { p: 0, f: 0, c: 20 },
  manzana_roja: { p: 0, f: 0, c: 22 },
  aguacate: { p: 2, f: 15, c: 9 },
  cambur: { p: 1, f: 0, c: 27 },
  uvas: { p: 0, f: 0, c: 18 },
  // Vegetales
  brocoli: { p: 3, f: 0, c: 6 },
  espinaca: { p: 3, f: 0, c: 4 },
  pimenton: { p: 1, f: 0, c: 4 },
  tomate: { p: 1, f: 0, c: 5 },
  cebolla: { p: 1, f: 0, c: 9 },
  lechuga: { p: 1, f: 0, c: 2 },
  pepino: { p: 0, f: 0, c: 3 },
  calabacin: { p: 1, f: 0, c: 3 },
  coliflor: { p: 2, f: 0, c: 4 },
  esparragos: { p: 2, f: 0, c: 4 },
  apio: { p: 1, f: 0, c: 3 },
  // Carbohidratos
  batata: { p: 3, f: 0, c: 40 },
  platano: { p: 1, f: 0, c: 38 },
  yuca: { p: 2, f: 0, c: 68 },
  caraotas: { p: 9, f: 0, c: 20 },
  lentejas: { p: 9, f: 0, c: 20 },
  arepa: { p: 5, f: 1, c: 50 },
  garbanzos: { p: 9, f: 3, c: 27 },
  // Grasas y otros
  aceite: { p: 0, f: 18, c: 0 },
  frutos_secos: { p: 6, f: 18, c: 6 },
  aceitunas: { p: 0, f: 5, c: 1 },
};

// Calorías estimadas (Atwater): 4 kcal/g proteína y carbo, 9 kcal/g grasa.
export const kcalOf = (m) => Math.round(m.p * 4 + m.c * 4 + m.f * 9);

// Suma macros de una lista de items del catálogo (los que tengan entrada en MACROS).
export function macrosForItems(items) {
  const t = (items || []).reduce(
    (a, it) => {
      const m = MACROS[it.key];
      if (m) { a.p += m.p; a.f += m.f; a.c += m.c; a.matched += 1; }
      return a;
    },
    { p: 0, f: 0, c: 0, matched: 0 }
  );
  return { p: Math.round(t.p), f: Math.round(t.f), c: Math.round(t.c), kcal: kcalOf(t), matched: t.matched };
}

// Macros aproximadas de una sugerencia { titulo, pasos:[{n,p}] } o con `ingredientes`.
// Devuelve null si no se pudo estimar nada (ningún componente reconocido).
export function macrosForSuggestion(sug) {
  if (!sug) return null;
  const items = sug.ingredientes && sug.ingredientes.length ? itemsFromNames(sug.ingredientes) : extractItems(sug);
  const m = macrosForItems(items);
  return m.matched ? m : null;
}
