// Utilidades para compartir una receta (texto plano + enlaces).
// La lógica de UI (navigator.share / clipboard / abrir WhatsApp) vive en App.jsx;
// aquí solo el formateo, que es puro y testeable.

export const APP_URL = "https://cocina-practica.netlify.app";

// Texto legible de una sugerencia: { titulo, pasos:[{n,p}] }.
export function buildShareText(sug, url = APP_URL) {
  const pasos = (sug?.pasos || []).map((p) => `• ${p.n}: ${p.p}`).join("\n");
  const cuerpo = pasos ? `\n\n${pasos}` : "";
  return `🍳 ${sug?.titulo || "Receta"}${cuerpo}\n\nVía Cocina Práctica\n${url}`;
}

// Enlace de WhatsApp con el texto ya codificado.
export function whatsappUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text || "")}`;
}
