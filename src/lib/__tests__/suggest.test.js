import { describe, it, expect } from "vitest";
import {
  shuffle,
  pick,
  names,
  suggest,
  isPractical,
  suggestN,
  suggestPool,
  buildWeek,
  fmtQty,
} from "../suggest.js";
import { DB } from "../../data/recipes.js";
import { DAYS } from "../../data/config.js";

describe("shuffle", () => {
  it("mantiene mismos elementos (permutación)", () => {
    const a = [1, 2, 3, 4, 5];
    expect(shuffle(a).sort()).toEqual([1, 2, 3, 4, 5]);
  });
  it("no muta el original", () => {
    const a = [1, 2, 3];
    shuffle(a);
    expect(a).toEqual([1, 2, 3]);
  });
});

describe("pick (índice circular)", () => {
  it("envuelve con módulo", () => {
    const a = ["a", "b", "c"];
    expect(pick(a, 0)).toBe("a");
    expect(pick(a, 3)).toBe("a");
    expect(pick(a, 4)).toBe("b");
  });
  it("array vacío => null", () => {
    expect(pick([], 0)).toBeNull();
    expect(pick(undefined, 0)).toBeNull();
  });
});

describe("names", () => {
  it("une nombres con separador", () => {
    expect(names([{ n: "Pollo" }, { n: "Arroz" }])).toBe("Pollo  ·  Arroz");
  });
});

describe("suggest", () => {
  it("Desayuno: un solo paso", () => {
    const s = suggest("metabolismo", "Desayuno");
    expect(s.pasos).toHaveLength(1);
    expect(s.titulo).toBe(s.pasos[0].n);
  });
  it("Snack: un solo paso", () => {
    const s = suggest("metabolismo", "Snack");
    expect(s.pasos).toHaveLength(1);
  });
  it("Almuerzo: proteína + vegetal + grasa (+carbo si hay)", () => {
    const s = suggest("metabolismo", "Almuerzo");
    expect(s.pasos.length).toBeGreaterThanOrEqual(3);
    expect(s.titulo).toContain("·");
  });
  it("enfoque sin recetario propio usa fallback (keto->animal)", () => {
    const s = suggest("keto", "Almuerzo");
    expect(s.pasos.length).toBeGreaterThanOrEqual(3);
  });
});

describe("isPractical", () => {
  it("sin horno y <=3 pasos => práctica", () => {
    const sug = { pasos: [{ n: "Atún", p: "Escurre y sirve" }] };
    expect(isPractical(sug)).toBe(true);
  });
  it("con horno => no práctica", () => {
    const sug = { pasos: [{ n: "Pollo", p: "Hornea a 200°C" }] };
    expect(isPractical(sug)).toBe(false);
  });
  it("> 3 pasos => no práctica", () => {
    const sug = { pasos: [{ n: "a", p: "x" }, { n: "b", p: "x" }, { n: "c", p: "x" }, { n: "d", p: "x" }] };
    expect(isPractical(sug)).toBe(false);
  });
});

describe("suggestN", () => {
  it("devuelve N sugerencias con títulos únicos", () => {
    const out = suggestN("metabolismo", "Almuerzo", 3);
    expect(out).toHaveLength(3);
    const titulos = out.map((s) => s.titulo);
    expect(new Set(titulos).size).toBe(titulos.length);
  });
  it("practical=true: prioriza rápidas (completa si faltan)", () => {
    const out = suggestN("metabolismo", "Almuerzo", 3, { practical: true });
    expect(out).toHaveLength(3);
  });
});

describe("suggestPool", () => {
  it("mezcla enfoques y devuelve únicos", () => {
    const out = suggestPool("Almuerzo", 8);
    const titulos = out.map((s) => s.titulo);
    expect(new Set(titulos).size).toBe(titulos.length);
    expect(out.length).toBeLessThanOrEqual(8);
  });
});

describe("buildWeek", () => {
  it("una entrada por día de la semana", () => {
    const w = buildWeek("metabolismo");
    expect(w).toHaveLength(DAYS.length);
    expect(w.map((d) => d.dia)).toEqual(DAYS);
  });
  it("cada día tiene desayuno, almuerzo y cena", () => {
    for (const d of buildWeek("metabolismo")) {
      expect(d.desayuno).toBeTruthy();
      expect(Array.isArray(d.almuerzo)).toBe(true);
      expect(d.almuerzo.length).toBeGreaterThan(0);
      expect(Array.isArray(d.cena)).toBe(true);
    }
  });
});

describe("fmtQty", () => {
  it("entero sin decimales", () => {
    expect(fmtQty(3, 2, "kg")).toBe("6 kg");
  });
  it("no entero con 1 decimal", () => {
    expect(fmtQty(0.2, 1, "kg")).toBe("0.2 kg");
  });
});

// Sanity: todos los enfoques de config tienen recetario o fallback funcional
describe("cobertura de enfoques", () => {
  it("DB tiene metabolismo, animal, balanceado", () => {
    expect(Object.keys(DB)).toEqual(expect.arrayContaining(["metabolismo", "animal", "balanceado"]));
  });
});
