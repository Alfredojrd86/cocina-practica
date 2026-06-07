import { describe, it, expect } from "vitest";
import { buildShareText, whatsappUrl, APP_URL } from "../share.js";

const sug = {
  titulo: "Pollo · Brócoli",
  pasos: [
    { n: "Pollo a la plancha", p: "Sella 5 min por lado" },
    { n: "Brócoli al vapor", p: "Cuece 6 min" },
  ],
};

describe("buildShareText", () => {
  it("incluye título, pasos y URL de la app", () => {
    const txt = buildShareText(sug);
    expect(txt).toContain("Pollo · Brócoli");
    expect(txt).toContain("Pollo a la plancha: Sella 5 min por lado");
    expect(txt).toContain("Brócoli al vapor: Cuece 6 min");
    expect(txt).toContain(APP_URL);
  });

  it("un bullet por paso", () => {
    const bullets = buildShareText(sug).split("\n").filter((l) => l.startsWith("•"));
    expect(bullets).toHaveLength(2);
  });

  it("acepta URL personalizada", () => {
    expect(buildShareText(sug, "https://x.test")).toContain("https://x.test");
  });

  it("tolera sugerencia sin pasos", () => {
    const txt = buildShareText({ titulo: "Solo título" });
    expect(txt).toContain("Solo título");
    expect(txt).toContain(APP_URL);
  });

  it("tolera entrada vacía sin romper", () => {
    expect(() => buildShareText(undefined)).not.toThrow();
    expect(buildShareText(undefined)).toContain("Receta");
  });
});

describe("whatsappUrl", () => {
  it("codifica el texto en el parámetro", () => {
    const url = whatsappUrl("hola mundo & cía");
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(url).toContain(encodeURIComponent("hola mundo & cía"));
  });
  it("tolera texto vacío", () => {
    expect(whatsappUrl()).toBe("https://wa.me/?text=");
  });
});
