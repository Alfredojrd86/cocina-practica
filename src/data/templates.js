// Plantillas de alimentos sugeridos por enfoque.
// Referencian el catálogo único (keys de src/data/pantry.js CATALOG).
// Escalable: agregar un enfoque = añadir una entrada aquí.
//
// DB-READY: la app SIEMPRE consume getTemplate(). Hoy lee de código; mañana esta
// función puede leer de Supabase (plantillas editables / enfoques propios / compartir)
// sin tocar el resto de la app.

export const TEMPLATES = {
  // 3x1 (Frank Suárez): proteína + grasa + vegetales Tipo A; sin almidones/azúcar Tipo E.
  metabolismo: {
    sugeridos: [
      "pollo", "res", "cerdo", "higado", "atun", "sardinas", "huevos",
      "queso", "gouda", "yogur", "mantequilla",
      "aguacate", "manzana_verde", "manzana_roja",
      "brocoli", "espinaca", "pimenton", "tomate", "cebolla", "ajo",
      "aceite", "frutos_secos",
    ],
  },
  // Animal-based (Saladino): carnes/vísceras, huevos, lácteos, fruta y miel.
  animal: {
    sugeridos: [
      "res", "higado", "cerdo", "pollo", "atun", "sardinas", "huevos",
      "queso", "gouda", "yogur", "leche", "mantequilla",
      "aguacate", "manzana_verde", "manzana_roja", "miel",
      "aceite", "sal",
    ],
  },
  // Balanceado: mezcla amplia (incluye almidones con moderación).
  balanceado: {
    sugeridos: [
      "pollo", "res", "cerdo", "higado", "atun", "sardinas", "huevos",
      "queso", "gouda", "yogur", "leche", "mantequilla",
      "aguacate", "manzana_verde", "manzana_roja",
      "brocoli", "espinaca", "pimenton", "tomate", "cebolla", "ajo",
      "batata", "platano", "yuca", "caraotas", "lentejas", "arepa",
      "aceite", "frutos_secos", "miel", "sal",
    ],
  },
};

// Punto único de acceso (hoy código, mañana puede ser async/DB).
export function getTemplate(approach) {
  return TEMPLATES[approach] || TEMPLATES.balanceado;
}
