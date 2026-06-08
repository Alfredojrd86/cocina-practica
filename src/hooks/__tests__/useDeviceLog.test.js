import { describe, it, expect } from "vitest";
import { parseUA } from "../useDeviceLog.js";

describe("parseUA", () => {
  it("iPhone Safari", () => {
    const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(parseUA(ua)).toEqual({ platform: "iOS", browser: "Safari" });
  });

  it("iPhone Chrome (CriOS)", () => {
    const ua = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/120 Mobile/15E148 Safari/604.1";
    expect(parseUA(ua)).toEqual({ platform: "iOS", browser: "Chrome" });
  });

  it("Android Chrome (con modelo)", () => {
    const ua = "Mozilla/5.0 (Linux; Android 12; moto e22i) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36";
    expect(parseUA(ua)).toEqual({ platform: "Android", browser: "Chrome" });
  });

  it("Android Samsung Internet", () => {
    const ua = "Mozilla/5.0 (Linux; Android 13; SM-S918B) AppleWebKit/537.36 SamsungBrowser/23 Chrome/115 Mobile Safari/537.36";
    expect(parseUA(ua)).toEqual({ platform: "Android", browser: "Samsung Internet" });
  });

  it("Desktop Edge", () => {
    const ua = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36 Edg/120";
    expect(parseUA(ua)).toEqual({ platform: "Desktop", browser: "Edge" });
  });

  it("Desktop Firefox (Mac)", () => {
    const ua = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0";
    expect(parseUA(ua)).toEqual({ platform: "Desktop", browser: "Firefox" });
  });

  it("desconocido => Otro/Otro", () => {
    expect(parseUA("algo raro")).toEqual({ platform: "Otro", browser: "Otro" });
  });

  it("tolera vacío", () => {
    expect(parseUA("")).toEqual({ platform: "Otro", browser: "Otro" });
  });
});
