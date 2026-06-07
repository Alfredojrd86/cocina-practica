// Historial de "lo cocinado": cuántas veces se cocinó cada receta.
// Funciones puras (inmutables) para registrar, rankear y priorizar.
// El estado es un array de { titulo, pasos, meal, approach, count, last }.

// Registra una cocción: incrementa el contador de la receta (por título) o la crea.
// `now` es un timestamp inyectable (testeable). Devuelve un array nuevo.
export function recordCook(history, sug, meal, approach, now = 0) {
  if (!sug || !sug.titulo) return history || [];
  const list = (history || []).slice();
  const i = list.findIndex((h) => h.titulo === sug.titulo);
  if (i >= 0) {
    list[i] = {
      ...list[i],
      count: (list[i].count || 0) + 1,
      last: now,
      meal: meal || list[i].meal,
      approach: approach || list[i].approach,
    };
  } else {
    list.push({ titulo: sug.titulo, pasos: sug.pasos || [], meal: meal || null, approach: approach || null, count: 1, last: now });
  }
  return list;
}

// Recetas más cocinadas (opcionalmente filtradas por comida), de mayor a menor.
// Desempata por la cocción más reciente.
export function topCooked(history, meal = null, n = 5) {
  return (history || [])
    .filter((h) => (h.count || 0) > 0 && (!meal || h.meal === meal))
    .sort((a, b) => (b.count || 0) - (a.count || 0) || (b.last || 0) - (a.last || 0))
    .slice(0, n);
}

// Antepone a las sugerencias la receta más cocinada de esa comida (si se cocinó
// al menos `minCount` veces y no está ya en la lista). Mantiene el tamaño original.
// La receta priorizada lleva `cookedCount` para que la UI la marque.
export function prioritize(suggestions, history, meal, minCount = 2) {
  const list = (suggestions || []).slice();
  if (!list.length) return list;
  const top = topCooked(history, meal, 1)[0];
  if (!top || (top.count || 0) < minCount) return list;
  if (list.some((s) => s.titulo === top.titulo)) return list;
  list.unshift({ titulo: top.titulo, pasos: top.pasos || [], cookedCount: top.count });
  return list.slice(0, suggestions.length);
}
