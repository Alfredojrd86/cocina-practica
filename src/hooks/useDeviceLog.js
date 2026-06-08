import { useEffect } from "react";
import { supabase } from "../lib/supabase.js";

// Deriva plataforma y navegador del User-Agent (sin guardar el UA crudo).
export function parseUA(ua) {
  const platform = /iphone|ipad|ipod/i.test(ua)
    ? "iOS"
    : /android/i.test(ua)
    ? "Android"
    : /windows|macintosh|mac os|linux|cros/i.test(ua)
    ? "Desktop"
    : "Otro";
  let browser = "Otro";
  if (/edg\//i.test(ua)) browser = "Edge";
  else if (/samsungbrowser/i.test(ua)) browser = "Samsung Internet";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/crios|chrome|chromium/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua)) browser = "Safari";
  return { platform, browser };
}

// ID estable por dispositivo/navegador, guardado en localStorage.
function getDeviceId() {
  try {
    let id = localStorage.getItem("cm_device_id");
    if (!id) {
      id = crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem("cm_device_id", id);
    }
    return id;
  } catch {
    return null;
  }
}

// Registra (upsert) el dispositivo del usuario al iniciar sesión.
// Silencioso: solo escribe; los datos se consultan desde Supabase (admin).
export function useDeviceLog(session) {
  useEffect(() => {
    if (!supabase || !session) return;
    const deviceId = getDeviceId();
    if (!deviceId) return;
    const ua = (typeof navigator !== "undefined" && navigator.userAgent) || "";
    const { platform, browser } = parseUA(ua);
    const installed = !!(window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true);
    const screen = `${window.screen?.width || 0}x${window.screen?.height || 0}`;
    // first_seen se omite: queda en su default al insertar y se preserva al actualizar.
    const row = { user_id: session.user.id, device_id: deviceId, platform, browser, installed, screen, last_seen: new Date().toISOString() };
    supabase.from("devices").upsert(row, { onConflict: "user_id,device_id" }).then(() => {}, () => {});
  }, [session]);
}
