// Configuración de la app: enfoques, momentos del día, personas, días.

export const APPROACHES = [
  ["metabolismo", "3x1"],
  ["animal", "Animal"],
  ["balanceado", "Balanceado"],
  ["keto", "Keto"],
  ["mediterraneo", "Mediterráneo"],
];

// Metadatos para onboarding e inicio (íconos + descripción simple).
export const APPROACH_META = {
  metabolismo: { emoji: "🍽", name: "3x1", desc: "Controla el azúcar en sangre (Frank Suárez)" },
  animal: { emoji: "🥩", name: "Animal", desc: "Carne, huevos y grasa (Paul Saladino)" },
  balanceado: { emoji: "🥗", name: "Balanceado", desc: "Una mezcla equilibrada" },
  keto: { emoji: "🥓", name: "Keto", desc: "Muy bajo en carbohidratos, alto en grasa" },
  mediterraneo: { emoji: "🫒", name: "Mediterráneo", desc: "Pescado, aceite de oliva, vegetales y legumbres" },
};

// Íconos por categoría de alimento (un ícono lee más rápido que el texto).
export const CATEGORY_ICONS = {
  "Proteínas": "🍗",
  "Lácteos": "🧀",
  "Frutas": "🍎",
  "Vegetales": "🥦",
  "Carbohidratos": "🍠",
  "Grasas y otros": "🥑",
  "Otros": "🛒",
  "Otros (tuyos)": "🛒",
};

export const MEALS = ["Desayuno", "Almuerzo", "Cena", "Snack"];

export const PEOPLE = [["1", 1], ["2", 2], ["3", 3], ["4+", 4]];

export const DAYS = [
  "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo",
];
