// Plantillas de alimentos sugeridos por enfoque (keys de src/data/pantry.js CATALOG).
// Predeterminados de fábrica basados en lo que recomienda cada autor/enfoque.
// Escalable: agregar un enfoque = añadir una entrada aquí (+ config, diets).
//
// DB-READY: la app SIEMPRE consume getTemplate(); hoy lee de código, mañana puede leer
// de Supabase (editar sin deploy / enfoques propios / compartir) sin tocar la app.

export const TEMPLATES = {
  // 3x1 (Frank Suárez): proteína + grasa + vegetales Tipo A; sin almidones/azúcar (Tipo E).
  metabolismo: {
    sugeridos: [
      "pollo", "res", "cerdo", "higado", "atun", "sardinas", "salmon", "huevos",
      "queso", "gouda", "yogur", "mantequilla",
      "aguacate", "manzana_verde", "manzana_roja",
      "brocoli", "espinaca", "lechuga", "pepino", "calabacin", "coliflor", "esparragos", "apio",
      "pimenton", "tomate", "cebolla", "ajo",
      "aceite", "frutos_secos",
    ],
  },
  // Animal-based (Saladino): carnes, vísceras (hígado/tuétano), huevos, pescado/mariscos,
  // lácteos, fruta y miel. Sin granos, legumbres, vegetales ni frutos secos.
  animal: {
    sugeridos: [
      "res", "higado", "tuetano", "cerdo", "pollo", "atun", "sardinas", "salmon", "mariscos", "huevos",
      "queso", "gouda", "yogur", "leche", "mantequilla",
      "aguacate", "manzana_verde", "manzana_roja", "miel",
      "aceite", "sal",
    ],
  },
  // Balanceado: mezcla amplia (incluye almidones y legumbres con moderación).
  balanceado: {
    sugeridos: [
      "pollo", "res", "cerdo", "higado", "atun", "sardinas", "salmon", "mariscos", "huevos",
      "queso", "gouda", "yogur", "leche", "mantequilla",
      "aguacate", "manzana_verde", "manzana_roja",
      "brocoli", "espinaca", "lechuga", "pepino", "calabacin", "coliflor", "esparragos", "apio",
      "pimenton", "tomate", "cebolla", "ajo",
      "batata", "platano", "yuca", "caraotas", "lentejas", "garbanzos", "arepa",
      "aceite", "aceitunas", "frutos_secos", "miel", "sal",
    ],
  },
  // Keto: muy bajo en carbohidratos, alto en grasa. Sin fruta dulce, almidón, grano, legumbre ni miel.
  keto: {
    sugeridos: [
      "pollo", "res", "cerdo", "higado", "tuetano", "atun", "sardinas", "salmon", "mariscos", "huevos",
      "queso", "gouda", "mantequilla",
      "aguacate", "brocoli", "espinaca", "lechuga", "pepino", "calabacin", "coliflor", "esparragos", "apio",
      "pimenton", "tomate", "cebolla", "ajo",
      "aceite", "aceitunas", "frutos_secos",
    ],
  },
  // Mediterráneo: pescado, aceite de oliva, vegetales, legumbres, fruta; poca carne roja.
  mediterraneo: {
    sugeridos: [
      "salmon", "sardinas", "atun", "mariscos", "pollo", "huevos",
      "queso", "yogur", "aceite", "aceitunas",
      "brocoli", "espinaca", "lechuga", "pepino", "calabacin", "coliflor", "esparragos", "apio",
      "pimenton", "tomate", "cebolla", "ajo",
      "lentejas", "caraotas", "garbanzos",
      "manzana_verde", "manzana_roja", "uvas", "frutos_secos",
    ],
  },
};

// Punto único de acceso (hoy código, mañana puede ser async/DB).
export function getTemplate(approach) {
  return TEMPLATES[approach] || TEMPLATES.balanceado;
}
