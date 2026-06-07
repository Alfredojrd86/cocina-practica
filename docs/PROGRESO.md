# Progreso del proyecto

> Dónde estamos, qué está hecho y qué sigue. Actualizar al cerrar cada sesión de trabajo.
> Última actualización: 2026-06-06

## Estado actual

App **funcional y desplegada** en https://cocina-practica.netlify.app
MVP completo: enfoques, sugerencias (+IA gated), despensa por cantidades, compras,
escáner (barcode + foto IA), favoritos/despensa sincronizados, PWA, tema recetario vintage.

```mermaid
flowchart LR
  D[Deploy auto] --> F[Features core] --> IA[IA gated] --> SY[Sync Supabase] --> ES[Escáner] --> TE[Tema vintage] --> DOC[Docs]
  DOC --> NEXT[((Siguiente))]
```

## Hecho ✅

**Infra / deploy**
- [x] Vite + React, build con Node 20, `netlify.toml`
- [x] GitHub → Netlify deploy automático en cada push
- [x] PWA instalable + offline (vite-plugin-pwa)

**Contenido / lógica**
- [x] 3 enfoques (3x1 / Animal / Balanceado) + recetas
- [x] Feedback Tipo A/E + consejos por enfoque
- [x] 3 sugerencias, "Solo rápidas", "Cocinar con lo que tengo"
- [x] Semana rotada

**Despensa / compras**
- [x] Despensa por **cantidades reales** (kg/unid/latas), estado derivado
- [x] "Lo cociné" descuenta porción × personas
- [x] Compras editable (boleta) + agregar/quitar ingredientes
- [x] Cargar compra → despensa
- [x] Acordeón + filtro "Por reponer" (sin scroll infinito)
- [x] Plantillas de alimentos por enfoque (`templates.js`, DB-ready vía `getTemplate`)
- [x] Onboarding: "lista sugerida vs armar la mía" + botón "Cargar sugeridos" en Compras

**IA**
- [x] Sugerencias con Groq (texto) vía Netlify Function
- [x] Solo registrados + **rate limit** por usuario/día (RPC)

**Escáner**
- [x] Código de barras (ZXing) → Open Food Facts
- [x] Veredicto por enfoque (motor `diets.js`) + sellos chilenos
- [x] Peso/cantidad editable, mapea a catálogo o crea "Otros"
- [x] Foto de etiqueta → Groq visión (cuando no está en la base)
- [x] Solo registrados; barcode primero, foto bloqueada hasta escanear

**Cuentas / sync**
- [x] Login Google (Supabase Auth)
- [x] Favoritos y despensa sincronizados (RLS por usuario)

**Diseño**
- [x] Tema único "recetario vintage" centralizado en `src/theme.js`
- [x] Fondo de hoja con renglones, tarjetas tipo nota (cinta), texto manuscrito
- [x] Boleta blanca tipo factura; FAB sello; chip enfoque etiqueta

**Docs**
- [x] README, `.env.example`, `supabase/schema.sql`, diagramas (`docs/`)

## Pendiente / ideas 💡

- [ ] **Undo** al quitar favorito / al "Lo cociné"
- [ ] Macros aproximadas por plato (proteína/grasa/carbo)
- [ ] Compartir receta (link / WhatsApp)
- [ ] Semana que combine enfoques
- [ ] Historial "lo más cocinado" + priorizar en sugerencias
- [ ] Caché de productos escaneados (que salgan sin re-consultar)
- [ ] Contribuir productos a Open Food Facts desde la app
- [ ] SMTP propio (Resend/Brevo) para reactivar magic-link por email
- [ ] Tabla `profiles` (preferencias sincronizadas)
- [ ] Bordes rasgados reales en cards (filtro SVG)
- [ ] Tests del core (`suggest`, `foodTypes`, `pantry`, `diets`)

## Decisiones clave (por qué)

- **Supabase > Netlify Blobs**: necesitábamos auth + datos por usuario (RLS).
- **Groq > Gemini**: el free tier de Gemini no está disponible en la región (limit 0).
- **Login Google > magic link**: el email default de Supabase tiene rate limit duro.
- **IA gated + rate limit en el servidor**: no se confía en el frontend (curl-proof).
- **Despensa por cantidades**: el modelo 3-niveles agotaba a los 3 usos (irreal).
- **Tema único centralizado** (`theme.js`): cambiar diseño = editar tokens en 1 archivo.
- **Boleta en otra fuente**: la lista de compras imita una factura a propósito.

## Cómo retomar

```bash
nvm use 20            # o usar Node 20
npm install
npm run dev           # UI (sin funciones IA)
# o: netlify dev      # con funciones (requiere .env, ver .env.example)
```

Para nuevas features: la lógica vive en `src/data/` y `src/hooks/`; el diseño en
`src/theme.js`; las funciones en `netlify/functions/`. Cambios → `git push` despliega.
Al cerrar sesión de trabajo, **marcar lo hecho aquí y mover ideas a Hecho**.
