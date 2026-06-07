# ¿Qué comemos? 🍽️

App PWA para planificar comidas saludables según tu **enfoque** (3x1 de Frank Suárez,
animal-based de Paul Saladino, o balanceado). Sugiere platos con su preparación,
arma la semana, controla la despensa por cantidades, genera la lista de compras y
**escanea productos** para evaluarlos contra tu enfoque. Estética de recetario
vintage escrito a mano.

**En vivo:** https://cocina-practica.netlify.app

📄 [Diagramas de flujo](docs/FLUJO.md) · 📈 [Progreso y roadmap](docs/PROGRESO.md)

---

## Tabla de contenido

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Desarrollo local](#desarrollo-local)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos (Supabase)](#base-de-datos-supabase)
- [Funciones serverless (Netlify)](#funciones-serverless-netlify)
- [Despliegue](#despliegue)
- [Temas y estilos](#temas-y-estilos)
- [Cómo editar el contenido](#cómo-editar-el-contenido)
- [Seguridad](#seguridad)

---

## Funcionalidades

- **3 enfoques** (3x1 / Animal / Balanceado) — selector global.
- **Sugerencias**: 3 ideas con su preparación + feedback de tipo de alimento (🟢 Tipo A · 🟡 Fruta · 🟠 Tipo E).
- **Sugerencias con IA** (Groq) — solo usuarios registrados, con límite diario por usuario.
- **Filtros**: "Solo rápidas" y "Cocinar con lo que tengo" (prioriza tu despensa).
- **Despensa** por cantidades reales (kg/unid/latas), estado Tengo/Poco/Agotado derivado del stock, "Lo cociné" descuenta porción × personas.
- **Compras**: lista editable (boleta), agregar/quitar ingredientes, cargar a despensa.
- **Escáner de productos** (código de barras → Open Food Facts; o foto de etiqueta → IA visión) con veredicto según el enfoque.
- **Favoritos y despensa sincronizados** entre dispositivos (Supabase + login Google).
- **PWA**: instalable y offline (el contenido local funciona sin red).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite 5 |
| PWA | vite-plugin-pwa (Workbox) |
| Hosting / CI | Netlify (deploy automático desde GitHub) |
| Serverless | Netlify Functions |
| Auth + DB | Supabase (Postgres + Auth, login Google) |
| IA | Groq (Llama 3.3 texto · Llama 4 Scout visión) |
| Datos de productos | Open Food Facts (API abierta) |
| Escaneo barcode | @zxing/browser |

> **Node 20+** requerido (Vite 5). Fijado en `netlify.toml` (`NODE_VERSION = "20"`).

## Arquitectura

```
Navegador (React PWA)
  │  localStorage  ──► estado offline (favoritos, despensa, compras…)
  │
  ├─► Supabase (directo, anon key + RLS)  ──► favoritos / despensa por usuario
  │
  └─► Netlify Functions (con JWT del usuario)
        ├─ /sugerir   → Groq (texto)   → 3 recetas
        └─ /etiqueta  → Groq (visión)  → datos de la etiqueta
              │ verifican el JWT contra Supabase
              └ rate limit por usuario/día (RPC increment_ai_usage, service_role)
```

- **Offline-first**: todo vive en `localStorage`; al iniciar sesión se sincroniza con Supabase.
- **Las features de IA exigen sesión** y se limitan por usuario/día en el servidor (no se confía en el frontend).

## Estructura del proyecto

```
src/
  App.jsx              # UI principal y estado
  Scanner.jsx          # Overlay del escáner (lazy-loaded)
  main.jsx             # Entrada React
  theme.js             # ⭐ Tokens de diseño (colores, fuentes, radios, sombras) → :root
  styles.js            # CSS de la app (usa variables de theme.js)
  index.css            # Reset mínimo
  data/
    config.js          # Enfoques, momentos, personas, días, íconos
    recipes.js         # Recetas por enfoque
    foodTypes.js       # Clasificación Tipo A/E + consejos
    pantry.js          # Catálogo de ingredientes + lógica de despensa/cantidades
    shopping.js        # Frutas (guía) e ingredientes base
    diets.js           # Motor de reglas del escáner (veredicto por enfoque)
  hooks/
    useLocalStorage.js # Estado persistente
    useFavorites.js    # Favoritos offline + sync Supabase
    usePantry.js       # Despensa offline + sync Supabase
  lib/
    supabase.js        # Cliente Supabase (anon)
    suggest.js         # Generación de sugerencias / semana
    scan.js            # Consulta a Open Food Facts
netlify/functions/
  sugerir.js           # Proxy a Groq (texto) + auth + rate limit
  etiqueta.js          # Proxy a Groq (visión) + auth + rate limit
supabase/
  schema.sql           # Tablas, RLS y RPC (versionado)
netlify.toml           # Build, Node 20, carpeta de functions, redirects SPA
```

## Desarrollo local

Requiere Node 20+.

```bash
npm install
npm run dev      # http://localhost:5173
```

> Las **funciones** (IA) no corren con `npm run dev`. Para probarlas localmente:
> ```bash
> npm i -g netlify-cli
> netlify dev
> ```
> y define las variables de entorno (ver abajo) en un archivo `.env`.

Build de producción:

```bash
npm run build    # genera dist/
npm run preview  # sirve dist/ localmente
```

## Variables de entorno

Ver `.env.example`. Se configuran en **Netlify → Site configuration → Environment variables**
(y en `.env` local solo para `netlify dev`).

| Variable | Dónde se usa | Secreta |
|---|---|---|
| `VITE_SUPABASE_URL` | Frontend + functions | No (pública) |
| `VITE_SUPABASE_ANON_KEY` | Frontend + functions | No (pública, protegida por RLS) |
| `GROQ_API_KEY` | Functions | **Sí** |
| `SUPABASE_SERVICE_ROLE_KEY` | Functions (rate limit) | **Sí** (nunca en el frontend) |

> Las `VITE_*` se inyectan en build. `GROQ_API_KEY` y `SUPABASE_SERVICE_ROLE_KEY`
> solo viven del lado servidor (Netlify Functions).

## Base de datos (Supabase)

1. Crea un proyecto en https://supabase.com
2. **SQL Editor** → ejecuta [`supabase/schema.sql`](supabase/schema.sql) (tablas `favorites`, `pantry`, `ai_usage`, sus políticas RLS y la función `increment_ai_usage`).
3. **Authentication → Providers → Google**: habilita y pega Client ID/Secret (OAuth de Google Cloud; redirect URI = `https://<TU-REF>.supabase.co/auth/v1/callback`).
4. **Authentication → URL Configuration**: Site URL = tu dominio Netlify.
5. Copia **Project URL** y **anon key** a las variables de entorno. La **service_role** key va solo en Netlify.

Cada usuario solo lee/escribe sus filas (RLS `auth.uid() = user_id`). La tabla `ai_usage`
solo la toca el servidor (service_role) para el límite diario.

## Funciones serverless (Netlify)

- **`/.netlify/functions/sugerir`** — recibe `{approach, meal, ingredients, people, quick}` + `Authorization: Bearer <jwt>`; verifica sesión, aplica rate limit, llama a Groq y devuelve `{sugerencias[], usage}`.
- **`/.netlify/functions/etiqueta`** — recibe `{image}` (dataURL); igual gating; usa Groq visión para extraer nombre/nutrientes/sellos.

Límite por usuario/día: `DAILY_LIMIT` en cada función (default 15).

## Despliegue

Conectado a GitHub → Netlify despliega en cada push a `main`.

```bash
git add -A && git commit -m "..." && git push
```

`netlify.toml` define build (`npm run build`), `dist`, Node 20, carpeta de functions
y el redirect SPA. (También se puede arrastrar `dist/` a https://app.netlify.com/drop.)

## Temas y estilos

**Fuente única de verdad: `src/theme.js`.** Cambia un token y afecta toda la app:

- `colors` — paleta (pergamino, sepia, tomate, oliva…).
- `fonts` — `head` (manuscrita), `serif`, `body`, `mono` (boleta).
- `radius`, `shadowCard`, `shadowPress`, `paperNoise`, `--sheet-bg` (fondo de hoja).

`styles.js` genera `:root` desde esos tokens y todo el CSS usa `var(--…)`.
Estética: hoja con renglones de fondo, tarjetas tipo nota (rotación + cinta),
texto manuscrito; la boleta de Compras es blanca tipo ticket (monoespaciada).

## Cómo editar el contenido

- **Recetas**: `src/data/recipes.js` (`i("Nombre", "Preparación")` por enfoque).
- **Ingredientes / despensa**: `src/data/pantry.js` (`CATALOG`: unidad, porción, base).
- **Reglas del escáner**: `src/data/diets.js` (un objeto por enfoque; agregar uno nuevo = añadir entrada).
- **Tipos de alimento**: `src/data/foodTypes.js`.

## Seguridad

- Claves sensibles (`GROQ_API_KEY`, `service_role`) solo en Netlify Functions, nunca en el bundle.
- `anon key` es pública por diseño; los datos se protegen con **RLS** en Supabase.
- Las features de IA exigen sesión y se limitan por usuario en el servidor.
- Solo educativa; no reemplaza a un médico o nutricionista.

---

🤖 Construida con [Claude Code](https://claude.com/claude-code)
