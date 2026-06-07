import { describe, it, expect } from "vitest";
import { DIETS, evaluateProduct, VERDICT_INFO } from "../diets.js";

// Producto base "limpio" (comida real, sin nada que penalice).
const clean = (over = {}) => ({
  nova: 1,
  additives: [],
  ingredients: "carne de res, sal",
  sugars: 0,
  carbs: 0,
  seals: [],
  ...over,
});

describe("evaluateProduct", () => {
  it("producto limpio => ok en todos los enfoques", () => {
    for (const ap of Object.keys(DIETS)) {
      expect(evaluateProduct(ap, clean()).verdict).toBe("ok");
    }
  });

  it("enfoque desconocido cae a balanceado", () => {
    const r = evaluateProduct("inexistente", clean());
    expect(r.dietLabel).toBe(DIETS.balanceado.label);
  });

  it("incluye dietLabel y reasons", () => {
    const r = evaluateProduct("keto", clean());
    expect(r.dietLabel).toBe("Keto");
    expect(Array.isArray(r.reasons)).toBe(true);
    expect(r.reasons.length).toBeGreaterThan(0);
  });
});

describe("metabolismo (3x1)", () => {
  it("azúcar añadida => evita", () => {
    expect(evaluateProduct("metabolismo", clean({ ingredients: "harina, azúcar" })).verdict).toBe("evita");
  });
  it("carbohidratos altos => moderar", () => {
    expect(evaluateProduct("metabolismo", clean({ carbs: 30 })).verdict).toBe("moderar");
  });
  it("sello azúcar => evita", () => {
    expect(evaluateProduct("metabolismo", clean({ seals: ["azucar"] })).verdict).toBe("evita");
  });
});

describe("animal", () => {
  it("aceites de semilla => evita", () => {
    expect(evaluateProduct("animal", clean({ ingredients: "aceite de girasol" })).verdict).toBe("evita");
  });
  it("granos => evita", () => {
    expect(evaluateProduct("animal", clean({ ingredients: "harina de trigo" })).verdict).toBe("evita");
  });
  it("legumbres => evita", () => {
    expect(evaluateProduct("animal", clean({ ingredients: "lenteja" })).verdict).toBe("evita");
  });
  it("grasa saturada NO penaliza (acepta animal)", () => {
    expect(evaluateProduct("animal", clean({ seals: ["grasas"] })).verdict).toBe("ok");
  });
});

describe("keto", () => {
  it("carbohidratos > 10 => evita", () => {
    expect(evaluateProduct("keto", clean({ carbs: 12 })).verdict).toBe("evita");
  });
  it("carbohidratos bajos => ok", () => {
    expect(evaluateProduct("keto", clean({ carbs: 4 })).verdict).toBe("ok");
  });
  it("almidones => evita", () => {
    expect(evaluateProduct("keto", clean({ ingredients: "papa" })).verdict).toBe("evita");
  });
});

describe("mediterraneo", () => {
  it("aceite de oliva NO penaliza", () => {
    expect(evaluateProduct("mediterraneo", clean({ ingredients: "aceite de oliva" })).verdict).toBe("ok");
  });
  it("aceite de semilla => moderar (no evita)", () => {
    expect(evaluateProduct("mediterraneo", clean({ ingredients: "aceite de girasol" })).verdict).toBe("moderar");
  });
});

describe("worst() acumula la peor severidad", () => {
  it("moderar + evita => evita", () => {
    // ultraprocesado (moderar) + azúcar añadida (evita)
    const p = clean({ nova: 4, ingredients: "azúcar" });
    expect(evaluateProduct("metabolismo", p).verdict).toBe("evita");
  });
});

describe("VERDICT_INFO", () => {
  it("tiene los 3 veredictos", () => {
    expect(Object.keys(VERDICT_INFO).sort()).toEqual(["evita", "moderar", "ok"]);
  });
});
