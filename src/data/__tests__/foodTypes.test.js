import { describe, it, expect } from "vitest";
import { classifyComponent, analyzeSuggestion } from "../foodTypes.js";

describe("classifyComponent", () => {
  it("clasifica Tipo E por keyword (sube glucosa)", () => {
    expect(classifyComponent("Arroz blanco").tipo).toBe("E");
    expect(classifyComponent("Batata al horno").tipo).toBe("E");
    expect(classifyComponent("Avena").tipo).toBe("E");
  });

  it("clasifica Fruta (MOD)", () => {
    expect(classifyComponent("Manzana verde").tipo).toBe("MOD");
    expect(classifyComponent("Kiwi").tipo).toBe("MOD");
  });

  it("default Tipo A cuando no matchea nada", () => {
    expect(classifyComponent("Pollo a la plancha").tipo).toBe("A");
    expect(classifyComponent("Huevos").tipo).toBe("A");
  });

  it("marca evitaSaladino para granos/legumbres", () => {
    expect(classifyComponent("Lenteja guisada").evitaSaladino).toBe(true);
    expect(classifyComponent("Arepa de queso").evitaSaladino).toBe(true);
    expect(classifyComponent("Pollo").evitaSaladino).toBe(false);
  });

  it("E tiene prioridad sobre MOD", () => {
    // 'uva' está en E_KEYWORDS -> E aunque sea fruta
    expect(classifyComponent("Uvas").tipo).toBe("E");
  });

  it("maneja entrada vacía/undefined sin romper", () => {
    expect(classifyComponent("").tipo).toBe("A");
    expect(classifyComponent(undefined).tipo).toBe("A");
  });

  it("es case-insensitive", () => {
    expect(classifyComponent("ARROZ").tipo).toBe("E");
  });
});

describe("analyzeSuggestion", () => {
  const items = [{ n: "Pollo" }, { n: "Arroz" }, { n: "Brócoli" }];

  it("devuelve un badge por componente", () => {
    const { badges } = analyzeSuggestion(items, "balanceado");
    expect(badges).toHaveLength(3);
    expect(badges.map((b) => b.n)).toEqual(["Pollo", "Arroz", "Brócoli"]);
  });

  it("metabolismo: avisa de Tipo E presente", () => {
    const { consejo } = analyzeSuggestion(items, "metabolismo");
    expect(consejo).toMatch(/Tipo E/);
  });

  it("metabolismo: sin Tipo E felicita", () => {
    const { consejo } = analyzeSuggestion([{ n: "Pollo" }, { n: "Brócoli" }], "metabolismo");
    expect(consejo).toMatch(/Tipo A|controlar la glucosa/);
  });

  it("animal: lista lo que Saladino evita", () => {
    const { consejo } = analyzeSuggestion([{ n: "Lentejas" }], "animal");
    expect(consejo).toMatch(/Saladino evita/);
    expect(consejo).toMatch(/Lentejas/);
  });

  it("animal: sin conflictos confirma encaje", () => {
    const { consejo } = analyzeSuggestion([{ n: "Carne" }, { n: "Huevos" }], "animal");
    expect(consejo).toMatch(/animal-based/);
  });
});
