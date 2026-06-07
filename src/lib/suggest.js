import { DB } from "../data/recipes.js";
import { DAYS } from "../data/config.js";

// Enfoques sin recetario propio reusan uno existente.
const RECIPE_FALLBACK = { keto: "animal", mediterraneo: "balanceado" };
const recipesFor = (approach) => DB[approach] || DB[RECIPE_FALLBACK[approach]] || DB.balanceado;

export const rnd = (a) => a[Math.floor(Math.random() * a.length)];

export function shuffle(a) {
  const x = [...a];
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
}

export const pick = (arr, k) => (arr && arr.length ? arr[k % arr.length] : null);

export const names = (arr) => arr.map((x) => x.n).join("  ·  ");

// Una sugerencia: { titulo, pasos:[{n,p}] }
export function suggest(approach, type) {
  const d = recipesFor(approach);
  if (type === "Desayuno") { const x = rnd(d.desayunos); return { titulo: x.n, pasos: [x] }; }
  if (type === "Snack") { const x = rnd(d.snacks); return { titulo: x.n, pasos: [x] }; }
  const items = [rnd(d.proteinas)];
  if (d.carbos && d.carbos.length) items.push(rnd(d.carbos));
  items.push(rnd(d.vegetales), rnd(d.grasas));
  return { titulo: items.map((x) => x.n).join("  ·  "), pasos: items };
}

// ¿Es práctica? Sin horno y con pocos componentes.
export function isPractical(sug) {
  const noHorno = !sug.pasos.some((p) => /horno|hornea/i.test(p.p));
  const pocos = sug.pasos.length <= 3;
  return noHorno && pocos;
}

// Devuelve N sugerencias distintas. practical=true filtra a comidas rápidas.
export function suggestN(approach, type, n = 3, { practical = false } = {}) {
  const out = [];
  const seen = new Set();
  let tries = 0;
  while (out.length < n && tries < 60) {
    tries++;
    const s = suggest(approach, type);
    if (seen.has(s.titulo)) continue;
    if (practical && !isPractical(s)) continue;
    seen.add(s.titulo);
    out.push(s);
  }
  // Si el filtro práctico dejó menos de N, completa sin filtrar.
  while (out.length < n && tries < 120) {
    tries++;
    const s = suggest(approach, type);
    if (seen.has(s.titulo)) continue;
    seen.add(s.titulo);
    out.push(s);
  }
  return out;
}

// Pool de sugerencias de TODOS los enfoques con recetario (para "cocinar con lo que tengo",
// orientado por la despensa y no por el enfoque seleccionado).
const ALL_DBS = Object.keys(DB);
export function suggestPool(type, n = 12, { practical = false } = {}) {
  const out = [];
  const seen = new Set();
  let tries = 0;
  while (out.length < n && tries < 240) {
    tries++;
    const ap = ALL_DBS[Math.floor(Math.random() * ALL_DBS.length)];
    const s = suggest(ap, type);
    if (seen.has(s.titulo)) continue;
    if (practical && !isPractical(s)) continue;
    seen.add(s.titulo);
    out.push(s);
  }
  return out;
}

export function buildWeek(approach) {
  const d = recipesFor(approach);
  const P = shuffle(d.proteinas), C = shuffle(d.carbos), V = shuffle(d.vegetales), F = shuffle(d.grasas), B = shuffle(d.desayunos);
  return DAYS.map((day, k) => ({
    dia: day,
    desayuno: pick(B, k),
    almuerzo: [pick(P, k), pick(C, k), pick(V, k), pick(F, k)].filter(Boolean),
    cena: [pick(P, k + 2), pick(C, k + 1), pick(V, k + 3), pick(F, k + 1)].filter(Boolean),
  }));
}

// Enfoques de fábrica (con recetario propio o fallback) para la semana combinada.
export const WEEK_APPROACHES = ["metabolismo", "animal", "balanceado", "keto", "mediterraneo"];

// Semana que COMBINA enfoques: cada día toma un enfoque distinto (rotando), para
// variar el estilo a lo largo de la semana. Cada día lleva su `approach`.
export function buildWeekMixed(approaches = WEEK_APPROACHES) {
  const aps = approaches && approaches.length ? approaches : WEEK_APPROACHES;
  const pools = {};
  for (const ap of aps) {
    const d = recipesFor(ap);
    pools[ap] = { P: shuffle(d.proteinas), C: shuffle(d.carbos || []), V: shuffle(d.vegetales), F: shuffle(d.grasas), B: shuffle(d.desayunos) };
  }
  return DAYS.map((day, k) => {
    const ap = aps[k % aps.length];
    const p = pools[ap];
    return {
      dia: day,
      approach: ap,
      desayuno: pick(p.B, k),
      almuerzo: [pick(p.P, k), pick(p.C, k), pick(p.V, k), pick(p.F, k)].filter(Boolean),
      cena: [pick(p.P, k + 2), pick(p.C, k + 1), pick(p.V, k + 3), pick(p.F, k + 1)].filter(Boolean),
    };
  });
}

export function fmtQty(base, n, unit) {
  const v = base * n;
  const s = Number.isInteger(v) ? v : v.toFixed(1);
  return `${s} ${unit}`;
}
