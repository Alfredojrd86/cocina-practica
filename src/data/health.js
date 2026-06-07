// Chequeo simple de "alimento saludable" para validar lo que el usuario agrega.
// Heurística local (sin red): lista de no-saludables con su razón. Escalable: agregar reglas aquí.

const RULES = [
  { reason: "es un dulce / tiene azúcar añadida", kw: ["azúcar", "azucar", "caramelo", "golosina", "chocolate", "chocolatina", "bombón", "bombon", "dulce de leche", "manjar", "mermelada", "jarabe", "sirope", "nutella", "chicle"] },
  { reason: "es ultraprocesado / snack", kw: ["galleta", "dona", "donut", "ponqué", "ponque", "torta", "pastel", "queque", "brownie", "cereal azucarado", "papas fritas", "papitas", "snack", "doritos", "cheetos", "chetos", "nachos", "chips", "chizitos"] },
  { reason: "es una bebida azucarada", kw: ["refresco", "gaseosa", "soda", "coca", "pepsi", "sprite", "fanta", "jugo de caja", "bebida energ", "red bull", "monster", "frugos", "tang"] },
  { reason: "es frito / comida chatarra", kw: ["frito", "frita", "nugget", "hamburguesa", "pizza", "hot dog", "perro caliente", "salchicha", "vienesa", "embutido", "mortadela", "paté", "pate", "completo"] },
  { reason: "es una grasa/aceite no saludable (de semilla o hidrogenada)", kw: ["margarina", "manteca vegetal", "aceite de maíz", "aceite de maiz", "aceite de girasol", "aceite vegetal", "aceite de canola", "aceite de soya"] },
  { reason: "es un refinado", kw: ["harina blanca", "harina refinada", "pan blanco", "pan de molde", "fideos instant", "ramen", "sopa instant"] },
  { reason: "es alcohol", kw: ["cerveza", "vino", "ron", "whisky", "whiskey", "vodka", "licor", "aguardiente", "tequila", "pisco", "trago"] },
];

// Devuelve { ok:true } o { ok:false, reason }.
export function checkHealthy(name) {
  const n = (name || "").toLowerCase().trim();
  if (!n) return { ok: false, reason: "escribe un alimento" };
  for (const rule of RULES) {
    if (rule.kw.some((k) => n.includes(k))) return { ok: false, reason: rule.reason };
  }
  return { ok: true };
}
