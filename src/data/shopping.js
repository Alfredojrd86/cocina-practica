// Lista de compras mensual. base = cantidad para 1 persona/mes; se multiplica por personas.
// flag "moderar" -> alimento Tipo E (Frank) o azúcar; "nuevo" -> sugerido para completar Saladino/Frank.

export const SHOPPING = [
  // Proteínas
  { cat: "Proteínas", item: "Pollo", base: 3, unit: "kg" },
  { cat: "Proteínas", item: "Carne de res", base: 1.5, unit: "kg" },
  { cat: "Proteínas", item: "Cerdo", base: 1.5, unit: "kg" },
  { cat: "Proteínas", item: "Hígado de res", base: 0.5, unit: "kg", flag: "nuevo" },
  { cat: "Proteínas", item: "Atún en lata", base: 8, unit: "latas" },
  { cat: "Proteínas", item: "Sardinas en lata", base: 6, unit: "latas", flag: "nuevo" },
  { cat: "Proteínas", item: "Huevos", base: 30, unit: "unid." },

  // Lácteos
  { cat: "Lácteos", item: "Queso blanco llanero", base: 1, unit: "kg" },
  { cat: "Lácteos", item: "Queso gouda", base: 0.5, unit: "kg" },
  { cat: "Lácteos", item: "Yogur griego", base: 1, unit: "kg" },
  { cat: "Lácteos", item: "Leche", base: 4, unit: "litros" },
  { cat: "Lácteos", item: "Mantequilla", base: 0.5, unit: "kg" },

  // Frutas
  { cat: "Frutas", item: "Manzana verde", base: 8, unit: "unid." },
  { cat: "Frutas", item: "Manzana roja", base: 6, unit: "unid." },
  { cat: "Frutas", item: "Aguacate (palta)", base: 8, unit: "unid." },
  { cat: "Frutas", item: "Cambur (moderar)", base: 8, unit: "unid." },
  { cat: "Frutas", item: "Uvas verdes/rojas (moderar)", base: 1, unit: "kg" },

  // Vegetales
  { cat: "Vegetales", item: "Brócoli", base: 4, unit: "unid." },
  { cat: "Vegetales", item: "Espinaca", base: 1, unit: "kg", flag: "nuevo" },
  { cat: "Vegetales", item: "Pimentón verde/rojo", base: 6, unit: "unid." },
  { cat: "Vegetales", item: "Tomate", base: 2, unit: "kg" },
  { cat: "Vegetales", item: "Cebolla", base: 1.5, unit: "kg" },
  { cat: "Vegetales", item: "Ajo", base: 0.25, unit: "kg" },

  // Carbohidratos (Tipo E - moderar)
  { cat: "Carbohidratos", item: "Batata rosada (moderar)", base: 2, unit: "kg" },
  { cat: "Carbohidratos", item: "Plátano verde (moderar)", base: 6, unit: "unid." },
  { cat: "Carbohidratos", item: "Yuca (moderar)", base: 2, unit: "kg" },
  { cat: "Carbohidratos", item: "Caraotas negras (moderar)", base: 1, unit: "kg" },
  { cat: "Carbohidratos", item: "Lentejas (moderar)", base: 1, unit: "kg" },
  { cat: "Carbohidratos", item: "Harina de maíz (arepa)", base: 1, unit: "kg" },

  // Grasas y otros
  { cat: "Grasas y otros", item: "Aceite de oliva", base: 1, unit: "botella" },
  { cat: "Grasas y otros", item: "Frutos secos", base: 0.5, unit: "kg" },
  { cat: "Grasas y otros", item: "Miel (único endulzante)", base: 1, unit: "frasco" },
  { cat: "Grasas y otros", item: "Sal marina", base: 1, unit: "paquete", flag: "nuevo" },
];

export const FRUTAS = {
  buenas: ["Manzana verde", "Manzana roja", "Fresa", "Arándanos", "Aguacate", "Kiwi", "Pera"],
  moderar: ["Cambur (plátano)", "Uvas verdes", "Uvas rojas"],
};
