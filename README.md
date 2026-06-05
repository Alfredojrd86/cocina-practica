# ¿Qué comemos? — App de comidas saludables

App práctica que sugiere comidas (con su preparación), arma una rotación semanal
y genera la lista de compras mensual. Sin azúcar añadida, solo lo natural.
Funciona sin conexión y sin costo: toda la comida está en `src/App.jsx`.

## Probarla en tu computador (opcional)

Necesitas Node.js instalado (https://nodejs.org).

```bash
npm install
npm run dev
```

Abre la dirección que aparece (normalmente http://localhost:5173).

---

## Desplegar en Netlify — 3 caminos

### Opción A — La más fácil: arrastrar (sin Git, sin terminal)

1. En tu computador, dentro de la carpeta del proyecto, corre una vez:
   ```bash
   npm install
   npm run build
   ```
   Eso crea una carpeta `dist/`.
2. Entra a https://app.netlify.com/drop
3. Arrastra la carpeta `dist/` a esa página.
4. ¡Listo! Netlify te da una URL pública al instante.

> Para actualizar después: vuelves a `npm run build` y arrastras `dist/` de nuevo.

### Opción B — Recomendada: conectar con GitHub (se actualiza solo)

1. Sube esta carpeta a un repositorio en GitHub.
2. En Netlify: **Add new site → Import an existing project → GitHub**.
3. Elige el repositorio. Netlify lee el archivo `netlify.toml` y ya sabe:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Dale **Deploy**. Desde ahora, cada cambio que subas a GitHub se publica solo.

### Opción C — Con la terminal de Netlify (CLI)

```bash
npm install
npm install -g netlify-cli
netlify deploy --prod
```
Sigue las preguntas (login y elegir/crear sitio). La carpeta a publicar es `dist`.

---

## Cómo editar la comida

Todo está en `src/App.jsx`, cerca del inicio:

- `DB` — las comidas por enfoque (cada plato tiene `n` = nombre y `p` = preparación).
  Para agregar un plato, copia una línea `i("Nombre", "Preparación...")`.
- `SHOPPING` — la lista de compras con cantidades base por persona.
- `FRUTAS` — la guía de frutas.

No necesitas tocar nada más del código.

---

## Siguiente paso (opcional): que sea compartida entre dos personas

Esta versión guarda todo en memoria (cada teléfono por separado). Para que tú y
tu esposa vean la misma lista sincronizada, el siguiente paso es agregar
**Netlify Blobs** (almacenamiento gratis incluido en Netlify) con una
Netlify Function. Es un cambio que se puede hacer encima de esta misma base.
