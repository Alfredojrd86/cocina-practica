import { describe, it, expect } from "vitest";
import { recordCook, topCooked, prioritize } from "../history.js";

const sug = (t) => ({ titulo: t, pasos: [{ n: t, p: "..." }] });

describe("recordCook", () => {
  it("crea una entrada nueva con count 1", () => {
    const h = recordCook([], sug("Pollo"), "Almuerzo", "animal", 100);
    expect(h).toHaveLength(1);
    expect(h[0]).toMatchObject({ titulo: "Pollo", count: 1, meal: "Almuerzo", approach: "animal", last: 100 });
  });

  it("incrementa el contador de una receta existente", () => {
    let h = recordCook([], sug("Pollo"), "Almuerzo", "animal", 100);
    h = recordCook(h, sug("Pollo"), "Almuerzo", "animal", 200);
    expect(h).toHaveLength(1);
    expect(h[0].count).toBe(2);
    expect(h[0].last).toBe(200);
  });

  it("no muta el array original", () => {
    const h0 = recordCook([], sug("Pollo"), "Almuerzo", "animal", 1);
    const h1 = recordCook(h0, sug("Atún"), "Almuerzo", "animal", 2);
    expect(h0).toHaveLength(1);
    expect(h1).toHaveLength(2);
  });

  it("tolera sug inválida", () => {
    expect(recordCook([], null, "Almuerzo")).toEqual([]);
    expect(recordCook([{ titulo: "x", count: 1 }], {}, "Almuerzo")).toHaveLength(1);
  });
});

describe("topCooked", () => {
  const h = [
    { titulo: "A", count: 5, meal: "Almuerzo", last: 10 },
    { titulo: "B", count: 9, meal: "Cena", last: 20 },
    { titulo: "C", count: 9, meal: "Almuerzo", last: 30 },
    { titulo: "D", count: 0, meal: "Almuerzo", last: 40 },
  ];

  it("ordena por count desc, desempata por last desc", () => {
    const top = topCooked(h, null, 10).map((x) => x.titulo);
    expect(top).toEqual(["C", "B", "A"]); // C y B empatan en 9, C más reciente; D excluido (count 0)
  });

  it("filtra por comida", () => {
    expect(topCooked(h, "Almuerzo", 10).map((x) => x.titulo)).toEqual(["C", "A"]);
  });

  it("respeta el límite n", () => {
    expect(topCooked(h, null, 1).map((x) => x.titulo)).toEqual(["C"]);
  });

  it("historial vacío => []", () => {
    expect(topCooked([], "Almuerzo")).toEqual([]);
    expect(topCooked(undefined)).toEqual([]);
  });
});

describe("prioritize", () => {
  const base = [sug("X"), sug("Y"), sug("Z")];
  const hist = [{ titulo: "Fav", pasos: [], count: 3, meal: "Almuerzo", last: 9 }];

  it("antepone la más cocinada y mantiene el tamaño", () => {
    const out = prioritize(base, hist, "Almuerzo", 2);
    expect(out).toHaveLength(3);
    expect(out[0].titulo).toBe("Fav");
    expect(out[0].cookedCount).toBe(3);
    expect(out.map((s) => s.titulo)).toEqual(["Fav", "X", "Y"]); // Z se cae para mantener 3
  });

  it("no antepone si no alcanza minCount", () => {
    const out = prioritize(base, [{ titulo: "Fav", count: 1, meal: "Almuerzo" }], "Almuerzo", 2);
    expect(out.map((s) => s.titulo)).toEqual(["X", "Y", "Z"]);
  });

  it("no duplica si ya está en las sugerencias", () => {
    const out = prioritize([sug("Fav"), sug("Y")], hist, "Almuerzo", 2);
    expect(out.map((s) => s.titulo)).toEqual(["Fav", "Y"]);
    expect(out[0].cookedCount).toBeUndefined();
  });

  it("filtra por comida (no usa la de otra comida)", () => {
    const out = prioritize(base, [{ titulo: "Cena1", count: 5, meal: "Cena" }], "Almuerzo", 2);
    expect(out.map((s) => s.titulo)).toEqual(["X", "Y", "Z"]);
  });

  it("lista vacía => vacía", () => {
    expect(prioritize([], hist, "Almuerzo")).toEqual([]);
  });
});
