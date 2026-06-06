// ===== Tokens de diseño — FUENTE ÚNICA DE VERDAD =====
// Cambia aquí colores, fuentes, radios o sombras y se aplica a TODA la app.
// (Las fuentes se cargan con @import en styles.js; si cambias una familia, ajusta también ese @import.)

export const THEME = {
  colors: {
    cream: "#EFE6D2",   // fondo
    paper: "#FCF7EC",   // tarjetas
    ink: "#39322A",     // texto principal
    muted: "#6B5E49",   // texto secundario
    green: "#3C4A2E",   // acento títulos
    terra: "#B23A2E",   // acento / acciones
    sage: "#7E8B52",    // acento suave
    line: "#D9C8A6",    // bordes / líneas
  },
  fonts: {
    head: "'Caveat', cursive",         // títulos manuscritos
    serif: "'Fraunces', serif",        // títulos serif / botones
    body: "'Karla', sans-serif",       // texto general
    mono: "'Courier Prime', monospace", // boletas / datos
  },
  radius: "14px",
  radiusSm: "8px",
  shadowCard: "2px 3px 0 rgba(57,50,42,0.07), 0 14px 30px -22px rgba(57,50,42,0.5)",
  shadowPress: "2px 3px 0 rgba(57,50,42,0.25)",
  // Textura de papel (ruido SVG) reutilizable en fondos.
  paperNoise: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")",
};

// Variables CSS generadas desde los tokens (se inyectan en :root).
export const rootVars = `:root{
  --cream:${THEME.colors.cream}; --paper:${THEME.colors.paper}; --ink:${THEME.colors.ink};
  --muted:${THEME.colors.muted}; --green:${THEME.colors.green}; --terra:${THEME.colors.terra};
  --sage:${THEME.colors.sage}; --line:${THEME.colors.line};
  --font-head:${THEME.fonts.head}; --font-serif:${THEME.fonts.serif}; --font-body:${THEME.fonts.body}; --font-mono:${THEME.fonts.mono};
  --radius:${THEME.radius}; --radius-sm:${THEME.radiusSm};
  --shadow-card:${THEME.shadowCard}; --shadow-press:${THEME.shadowPress};
  --paper-noise:${THEME.paperNoise};
}`;
