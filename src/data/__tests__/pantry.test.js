import { describe, it, expect } from "vitest";
import {
  getItem,
  fullStock,
  servingFor,
  stepFor,
  rawToQty,
  qtyOf,
  statusFromQty,
  statusOf,
  restockAll,
  applyCooked,
  adjustQty,
  findItem,
  itemsFromNames,
  missingToCook,
  splitByPantry,
  CATALOG,
} from "../pantry.js";

describe("cantidades base", () => {
  it("fullStock = base × personas", () => {
    const pollo = getItem("pollo"); // base 3
    expect(fullStock(pollo, 1)).toBe(3);
    expect(fullStock(pollo, 2)).toBe(6);
  });

  it("servingFor = serving × personas", () => {
    const pollo = getItem("pollo"); // serving 0.2
    expect(servingFor(pollo, 1)).toBeCloseTo(0.2);
    expect(servingFor(pollo, 3)).toBeCloseTo(0.6);
  });

  it("stepFor: 0.5 para kg/L, 1 para discretos", () => {
    expect(stepFor(getItem("pollo"))).toBe(0.5); // kg
    expect(stepFor(getItem("leche"))).toBe(0.5); // L
    expect(stepFor(getItem("huevos"))).toBe(1); // unid.
  });
});

describe("rawToQty (migración de estados viejos)", () => {
  const pollo = getItem("pollo"); // base 3
  it("número se respeta tal cual", () => {
    expect(rawToQty(2.5, pollo, 1)).toBe(2.5);
  });
  it("'agotado' => 0", () => {
    expect(rawToQty("agotado", pollo, 1)).toBe(0);
  });
  it("'poco' => 40% del stock", () => {
    expect(rawToQty("poco", pollo, 1)).toBeCloseTo(1.2);
  });
  it("'tengo' y sin marcar => lleno (optimista)", () => {
    expect(rawToQty("tengo", pollo, 1)).toBe(3);
    expect(rawToQty(undefined, pollo, 1)).toBe(3);
  });
});

describe("statusFromQty", () => {
  const pollo = getItem("pollo"); // base 3, serving 0.2
  it("0 => agotado", () => {
    expect(statusFromQty(0, pollo, 1)).toBe("agotado");
  });
  it("lleno => tengo", () => {
    expect(statusFromQty(3, pollo, 1)).toBe("tengo");
  });
  it("debajo del umbral => poco", () => {
    expect(statusFromQty(0.3, pollo, 1)).toBe("poco");
  });
  it("condimento siempre 'tengo'", () => {
    expect(statusFromQty(0, getItem("sal"), 1)).toBe("tengo");
  });
});

describe("restockAll", () => {
  it("llena todo el catálogo a base × personas", () => {
    const m = restockAll(2);
    expect(Object.keys(m)).toHaveLength(CATALOG.length);
    expect(m.pollo).toBe(6); // base 3 × 2
  });
});

describe("applyCooked", () => {
  it("descuenta porción × personas", () => {
    const pantry = { pollo: 3 };
    const next = applyCooked([getItem("pollo")], pantry, 2);
    expect(next.pollo).toBeCloseTo(3 - 0.4); // serving 0.2 × 2
  });
  it("no descuenta condimentos", () => {
    const pantry = { sal: 1 };
    const next = applyCooked([getItem("sal")], pantry, 4);
    expect(next.sal).toBe(1);
  });
  it("nunca baja de 0", () => {
    const next = applyCooked([getItem("pollo")], { pollo: 0.1 }, 4);
    expect(next.pollo).toBe(0);
  });
  it("no muta el objeto original", () => {
    const pantry = { pollo: 3 };
    applyCooked([getItem("pollo")], pantry, 1);
    expect(pantry.pollo).toBe(3);
  });
});

describe("adjustQty", () => {
  it("suma delta", () => {
    expect(adjustQty("pollo", { pollo: 2 }, 1, 0.5)).toBe(2.5);
  });
  it("clamp a >= 0", () => {
    expect(adjustQty("pollo", { pollo: 0.2 }, 1, -1)).toBe(0);
  });
});

describe("findItem (matching por keyword)", () => {
  it("encuentra por keyword exacta", () => {
    expect(findItem("Pollo a la plancha").key).toBe("pollo");
  });
  it("prefiere la keyword más larga", () => {
    // 'queso llanero' (13) gana sobre 'queso' (5) dentro del mismo item
    expect(findItem("queso llanero fresco").key).toBe("queso");
    // keyword única => match directo
    expect(findItem("gouda en barra").key).toBe("gouda");
  });

  it("empate de largo: gana el primero del catálogo (ambigüedad conocida)", () => {
    // 'queso'(5) y 'gouda'(5) empatan -> queso está antes en CATALOG y gana.
    // Documenta el comportamiento; ver tarea para desambiguar gouda.
    expect(findItem("queso gouda").key).toBe("queso");
  });
  it("devuelve null si no matchea", () => {
    expect(findItem("xyz inexistente")).toBeNull();
  });
});

describe("itemsFromNames", () => {
  it("dedup por key", () => {
    const items = itemsFromNames(["pollo", "Pollo asado", "huevo"]);
    expect(items.map((i) => i.key).sort()).toEqual(["huevos", "pollo"]);
  });
});

describe("missingToCook", () => {
  const sug = { ingredientes: ["pollo", "brócoli"] };
  it("falta lo agotado", () => {
    const pantry = { pollo: 3, brocoli: 0 };
    const missing = missingToCook(sug, pantry, 1, []);
    expect(missing.map((i) => i.key)).toContain("brocoli");
    expect(missing.map((i) => i.key)).not.toContain("pollo");
  });
  it("falta lo oculto (no en despensa)", () => {
    const missing = missingToCook(sug, { pollo: 3, brocoli: 3 }, 1, ["brocoli"]);
    expect(missing.map((i) => i.key)).toEqual(["brocoli"]);
  });
  it("nada falta si hay suficiente", () => {
    expect(missingToCook(sug, { pollo: 3, brocoli: 3 }, 1, [])).toHaveLength(0);
  });
});

describe("splitByPantry", () => {
  it("separa tengo/poco de agotado", () => {
    const items = [getItem("pollo"), getItem("huevos")];
    const { have, missing } = splitByPantry(items, { pollo: 3, huevos: 0 }, 1);
    expect(have.map((i) => i.key)).toEqual(["pollo"]);
    expect(missing.map((i) => i.key)).toEqual(["huevos"]);
  });
});
