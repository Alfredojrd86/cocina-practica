import { describe, it, expect } from "vitest";
import { MACROS, kcalOf, macrosForItems, macrosForSuggestion } from "../macros.js";
import { getItem } from "../pantry.js";

describe("kcalOf", () => {
  it("usa factores Atwater (4/4/9)", () => {
    expect(kcalOf({ p: 10, c: 10, f: 10 })).toBe(10 * 4 + 10 * 4 + 10 * 9);
  });
});

describe("macrosForItems", () => {
  it("suma macros de items con entrada y cuenta matched", () => {
    const items = [getItem("pollo"), getItem("brocoli")];
    const m = macrosForItems(items);
    expect(m.p).toBe(MACROS.pollo.p + MACROS.brocoli.p);
    expect(m.f).toBe(MACROS.pollo.f + MACROS.brocoli.f);
    expect(m.c).toBe(MACROS.pollo.c + MACROS.brocoli.c);
    expect(m.matched).toBe(2);
    expect(m.kcal).toBeGreaterThan(0);
  });

  it("ignora items sin entrada (sal, ajo) y los cuenta como no-matched", () => {
    const items = [getItem("pollo"), getItem("sal"), getItem("ajo")];
    const m = macrosForItems(items);
    expect(m.matched).toBe(1); // solo pollo
    expect(m.p).toBe(MACROS.pollo.p);
  });

  it("lista vacía => ceros, matched 0", () => {
    expect(macrosForItems([])).toEqual({ p: 0, f: 0, c: 0, kcal: 0, matched: 0 });
  });
});

describe("macrosForSuggestion", () => {
  it("estima desde ingredientes nombrados", () => {
    const sug = { titulo: "x", ingredientes: ["pollo", "brócoli"], pasos: [] };
    const m = macrosForSuggestion(sug);
    expect(m.matched).toBe(2);
    expect(m.kcal).toBeGreaterThan(0);
  });

  it("estima desde pasos (extractItems) si no hay ingredientes", () => {
    const sug = { titulo: "Pollo a la plancha", pasos: [{ n: "Pollo a la plancha", p: "Sella" }] };
    const m = macrosForSuggestion(sug);
    expect(m).not.toBeNull();
    expect(m.matched).toBeGreaterThanOrEqual(1);
  });

  it("null si nada reconocido", () => {
    const sug = { titulo: "xyz", pasos: [{ n: "ingrediente raro", p: "..." }] };
    expect(macrosForSuggestion(sug)).toBeNull();
  });

  it("null ante entrada vacía", () => {
    expect(macrosForSuggestion(undefined)).toBeNull();
  });
});

describe("integridad de la tabla MACROS", () => {
  it("todas las entradas tienen p/f/c numéricos >= 0", () => {
    for (const [k, m] of Object.entries(MACROS)) {
      for (const key of ["p", "f", "c"]) {
        expect(typeof m[key], `${k}.${key}`).toBe("number");
        expect(m[key]).toBeGreaterThanOrEqual(0);
      }
    }
  });

  it("todas las keys existen en el catálogo", () => {
    for (const k of Object.keys(MACROS)) {
      expect(getItem(k), `key ${k} no está en CATALOG`).toBeTruthy();
    }
  });
});
