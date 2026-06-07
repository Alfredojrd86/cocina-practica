// ===== Tokens de diseño — FUENTE ÚNICA DE VERDAD =====
// Cambia aquí colores, fuentes, radios o sombras y se aplica a TODA la app.
// (Las fuentes se cargan con @import en styles.js; si cambias una familia, ajusta también ese @import.)

export const THEME = {
  // Paleta vintage — recetario de abuela italiana (pergamino envejecido, sepia, tomate y oliva).
  colors: {
    cream: "#E7D8B6",   // fondo pergamino envejecido
    paper: "#F3E8CC",   // tarjetas / ficha
    ink: "#3A2D1E",     // sepia oscuro (texto)
    muted: "#7A6647",   // sepia suave (secundario)
    green: "#566A2C",   // oliva / albahaca (títulos)
    terra: "#A4382A",   // tomate / vino (acciones)
    sage: "#9C7A3C",    // ocre / mostaza (acento)
    line: "#C7AE82",    // línea envejecida
  },
  fonts: {
    head: "'Caveat', cursive",          // títulos manuscritos
    serif: "'Fraunces', serif",         // serif vintage / botones
    body: "'Karla', sans-serif",        // texto general (legible)
    mono: "'Courier Prime', monospace", // boletas / máquina de escribir
  },
  radius: "7px",
  radiusSm: "4px",
  shadowCard: "2px 3px 0 rgba(58,45,30,0.10), 0 14px 28px -22px rgba(58,45,30,0.55)",
  shadowPress: "2px 3px 0 rgba(58,45,30,0.3)",
  // Textura de papel (ruido SVG) reutilizable en fondos.
  paperNoise: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\")",
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
  --sheet-bg:
    repeating-linear-gradient(180deg, transparent 0 31px, rgba(58,45,30,0.12) 31px 32px),
    radial-gradient(ellipse at 50% 30%, transparent 62%, rgba(58,45,30,0.10) 100%),
    radial-gradient(circle at 15% 0%, rgba(86,106,44,0.08), transparent 42%),
    radial-gradient(circle at 88% 8%, rgba(164,56,42,0.07), transparent 40%),
    ${THEME.paperNoise};
}`;
