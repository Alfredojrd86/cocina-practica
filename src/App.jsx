import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { STYLES } from "./styles.js";
import { SHOPPING, FRUTAS } from "./data/shopping.js";
import { APPROACHES, APPROACH_META, CATEGORY_ICONS, MEALS, PEOPLE, DAYS } from "./data/config.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { usePantry } from "./hooks/usePantry.js";
import { supabase, supabaseReady } from "./lib/supabase.js";
import { suggestN, buildWeek, names, fmtQty } from "./lib/suggest.js";
import { analyzeSuggestion, TIPO_INFO } from "./data/foodTypes.js";
import { CATALOG, PANTRY_CATS, PANTRY_INFO, statusOf, qtyOf, restockAll, adjustQty, stepFor, servingFor, extractItems, itemsFromNames, splitByPantry, applyCooked, findItem, getItem } from "./data/pantry.js";
const Scanner = lazy(() => import("./Scanner.jsx"));

// Evita la pantalla en blanco si el escáner (o su chunk) falla al cargar.
class ScannerBoundary extends React.Component {
  constructor(p) { super(p); this.state = { err: false }; }
  static getDerivedStateFromError() { return { err: true }; }
  componentDidCatch() {}
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

// Ingredientes disponibles, derivados de la lista de compras (sin paréntesis ni duplicados).
const INGREDIENTS = [...new Set(SHOPPING.map((s) => s.item.replace(/\s*\(.*?\)/g, "").trim()))];

const favKey = (s) => s.titulo;

// Fila de badges de tipo + consejo para una sugerencia.
function TypeFeedback({ sug, approach }) {
  const { badges, consejo } = analyzeSuggestion(sug.pasos, approach);
  return (
    <>
      <div className="cm-badges">
        {badges.map((b, k) => {
          const info = TIPO_INFO[b.tipo];
          return (
            <span key={k} className="cm-badge" style={{ background: info.bg, color: info.color }}>
              <span className="dot" style={{ background: info.color }} />
              {b.n}{b.tipo !== "A" ? ` · ${info.label}` : ""}
            </span>
          );
        })}
      </div>
      <p className="cm-consejo">{consejo}</p>
    </>
  );
}

function PantryMatch({ sug, pantry, people }) {
  const items = sug.ingredientes && sug.ingredientes.length ? itemsFromNames(sug.ingredientes) : extractItems(sug);
  if (!items.length) return null;
  const { have, missing } = splitByPantry(items, pantry, people);
  return (
    <div className="cm-pantry-match">
      {have.length > 0 && (
        <p className="pm-line"><span className="pm-tag have">Tienes</span> {have.map((i) => i.label).join(", ")}</p>
      )}
      {missing.length > 0 && (
        <p className="pm-line"><span className="pm-tag miss">Te falta</span> {missing.map((i) => i.label).join(", ")}</p>
      )}
    </div>
  );
}

function SuggestionCard({ sug, approach, pantry, people, isOpen, onToggle, isFav, onFav, onCook }) {
  const { badges } = analyzeSuggestion(sug.pasos, approach);
  return (
    <div className={"cm-sug" + (isOpen ? " open" : "")} onClick={onToggle}>
      <div className="cm-sug-top">
        <span className="cm-sug-title">{sug.titulo}</span>
        <button
          className={"cm-fav" + (isFav ? " on" : "")}
          aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
          onClick={(e) => { e.stopPropagation(); onFav(); }}
        >★</button>
      </div>
      {!isOpen ? (
        <div className="cm-dots">
          {badges.slice(0, 8).map((b, k) => (<span key={k} className="cm-dot" style={{ background: TIPO_INFO[b.tipo].color }} />))}
          <span className="cm-dots-hint">ver ▾</span>
        </div>
      ) : (
        <>
          <TypeFeedback sug={sug} approach={approach} />
          <PantryMatch sug={sug} pantry={pantry} people={people} />
          <div className="cm-sug-steps">
            {sug.pasos.map((s, k) => (<div key={k} className="st"><b>{s.n}:</b> {s.p}</div>))}
          </div>
          <button className="cm-cooked" onClick={(e) => { e.stopPropagation(); onCook(sug); }}>🍳 Lo cociné — descontar de mi despensa</button>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useLocalStorage("cm_tab", "inicio");
  const [onboarded, setOnboarded] = useLocalStorage("cm_onboarded", false);
  const [approach, setApproach] = useLocalStorage("cm_approach", "metabolismo");
  const [people, setPeople] = useLocalStorage("cm_people", 2);
  const [meal, setMeal] = useLocalStorage("cm_meal", "Almuerzo");
  const [quick, setQuick] = useLocalStorage("cm_quick", false);
  const [cookWith, setCookWith] = useLocalStorage("cm_cookwith", false);
  const [sugs, setSugs] = useLocalStorage("cm_sugs", null);
  const [week, setWeek] = useLocalStorage("cm_week", null);
  const [open, setOpen] = useLocalStorage("cm_open", {});
  const [checked, setChecked] = useLocalStorage("cm_checked", {});
  const [buy, setBuy] = useLocalStorage("cm_buy", {});
  const [hidden, setHidden] = useLocalStorage("cm_hidden", []);
  const [custom, setCustom] = useLocalStorage("cm_custom", []);
  const [newItem, setNewItem] = useState("");
  const [newUnit, setNewUnit] = useState("unid.");
  const [showHidden, setShowHidden] = useState(false);
  const [catOpen, setCatOpen] = useLocalStorage("cm_catopen", {});
  const [pantryFilter, setPantryFilter] = useState("all");
  const [enfPicker, setEnfPicker] = useState(false);
  const [optsOpen, setOptsOpen] = useState(false);
  const [theme, setTheme] = useLocalStorage("cm_theme", "paper");
  const { favs, add: addFav, remove: removeFav, session, syncing } = useFavorites();
  const { pantry, setPantry } = usePantry(session);
  const [openSug, setOpenSug] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(null);
  const [aiUsage, setAiUsage] = useState(null);
  const [email, setEmail] = useLocalStorage("cm_email", "");
  const [authMsg, setAuthMsg] = useState(null);
  const [confirmOut, setConfirmOut] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);
  const [toast, setToast] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const toastTimer = useRef(null);

  const showToast = (msg, kind = "ok", action = null) => {
    setToast({ msg, kind, action, id: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), action ? 4000 : 2200);
  };
  const buzz = (p = 12) => { try { navigator.vibrate?.(p); } catch {} };

  useEffect(() => {
    const l = document.createElement("style");
    l.textContent = STYLES;
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);

  // Al entrar a "Ahora" sin ideas, genera 3 automáticamente (pantalla nunca vacía).
  useEffect(() => {
    if (tab === "ahora" && !sugs) setSugs(suggestN(approach, meal, 3, { practical: quick }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const rollLocal = () => {
    setAiErr(null);
    setOpenSug({});
    if (cookWith) {
      const pool = suggestN(approach, meal, 12, { practical: quick });
      const ranked = pool
        .map((s) => { const { have, missing } = splitByPantry(extractItems(s), pantry, people); return { s, miss: missing.length, have: have.length }; })
        .sort((a, b) => a.miss - b.miss || b.have - a.have)
        .slice(0, 3)
        .map((x) => x.s);
      setSugs(ranked.length ? ranked : suggestN(approach, meal, 3, { practical: quick }));
    } else {
      setSugs(suggestN(approach, meal, 3, { practical: quick }));
    }
  };

  const rollAI = async () => {
    if (!session) { setTab("favoritos"); showToast("Inicia sesión para usar la IA", "rm"); return; }
    setAiLoading(true);
    setAiErr(null);
    try {
      const token = session?.access_token;
      const ingredients = cookWith
        ? CATALOG.filter((c) => statusOf(c.key, pantry, people) !== "agotado").map((c) => c.label)
        : INGREDIENTS;
      const r = await fetch("/.netlify/functions/sugerir", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approach, meal, ingredients, people, quick }),
      });
      const d = await r.json();
      if (r.status === 401) { setTab("favoritos"); showToast("Inicia sesión para usar la IA", "rm"); return; }
      if (r.status === 429) { setAiErr(d.error || "Llegaste a tu límite diario de IA. Vuelve mañana."); if (d.max) setAiUsage({ used: d.used, max: d.max }); return; }
      if (!r.ok) throw new Error(d.error || "Error");
      const arr = Array.isArray(d.sugerencias) ? d.sugerencias : [d];
      setOpenSug({});
      setSugs(arr);
      if (d.usage) setAiUsage(d.usage);
    } catch (e) {
      setAiErr("No se pudo generar con IA. Intenta de nuevo en un momento.");
    } finally {
      setAiLoading(false);
    }
  };

  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });
  const toggleSug = (key) => setOpenSug({ ...openSug, [key]: !openSug[key] });
  const isFav = (s) => favs.some((f) => favKey(f) === favKey(s));
  const toggleFav = async (s) => {
    if (isFav(s)) { return removeFavWithToast(s.titulo); }
    buzz(14);
    const r = await addFav({ titulo: s.titulo, pasos: s.pasos, approach, meal });
    if (session) showToast(r.error ? "Guardado local · no sincronizó" : "★ Guardado y sincronizado", r.error ? "rm" : "ok");
    else if (supabaseReady) showToast("Guardado en este equipo", "ok", { label: "Iniciar sesión", fn: () => setTab("favoritos") });
    else showToast("★ Guardado en favoritos", "ok");
  };
  const removeFavWithToast = async (titulo) => {
    const r = await removeFav(titulo);
    showToast(session && r.error ? "Quitado local · no sincronizó" : "Quitado de favoritos", "rm");
  };
  const onCook = (sug) => {
    const items = sug.ingredientes && sug.ingredientes.length ? itemsFromNames(sug.ingredientes) : extractItems(sug);
    const used = items.filter((it) => !it.condiment);
    if (!used.length) { showToast("No detecté ingredientes para descontar", "rm"); return; }
    buzz(18);
    setPantry(applyCooked(items, pantry, people));
    const resumen = used.slice(0, 3).map((it) => `${servingFor(it, people)} ${it.unit} ${it.label.toLowerCase()}`).join(", ");
    showToast(`🍳 Desconté ${resumen}${used.length > 3 ? "…" : ""}`, "ok");
  };

  const sendMagicLink = async () => {
    setAuthMsg(null);
    if (!supabaseReady) { setAuthMsg("Sync no configurado (faltan variables Supabase)."); return; }
    if (!email.includes("@")) { setAuthMsg("Escribe un correo válido."); return; }
    if (cooldown > 0) return;
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (!error) {
      setAuthMsg("✓ Enlace enviado. Revisa tu correo (y la carpeta spam) y ábrelo para entrar.");
      setCooldown(60);
    } else {
      const m = error.message || "";
      if (/rate limit/i.test(m)) setAuthMsg("Demasiados envíos seguidos. Espera unos minutos e intenta de nuevo.");
      else if (/invalid/i.test(m)) setAuthMsg("Correo inválido. Revísalo e intenta de nuevo.");
      else setAuthMsg("No se pudo enviar: " + m);
      setCooldown(30);
    }
  };
  const signInGoogle = async () => {
    setAuthMsg(null);
    if (!supabaseReady) { setAuthMsg("Sync no configurado (faltan variables Supabase)."); return; }
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (error) setAuthMsg("No se pudo iniciar con Google: " + error.message);
  };
  const signOut = async () => {
    if (supabase) await supabase.auth.signOut();
    setConfirmOut(false);
    showToast("Sesión cerrada · tu correo quedó guardado", "rm");
  };
  const agotadosLabels = CATALOG.filter((c) => statusOf(c.key, pantry, people) === "agotado").map((c) => c.label);

  // Carga la despensa con las cantidades de la compra (lo que realmente compraste).
  const loadPantryFromBuy = () => {
    const next = {};
    for (const c of CATALOG) if (!hidden.includes(c.key)) next[c.key] = qtyOf(c.key, buy, people);
    for (const c of custom) next[c.key] = typeof buy[c.key] === "number" ? buy[c.key] : 0;
    buzz(18);
    setPantry(next);
    showToast("🧺 Despensa cargada con tu compra", "ok");
    setTab("despensa");
  };

  const catKey = (where, cat) => `${where}:${cat}`;
  const isCatOpen = (where, cat) => !!catOpen[catKey(where, cat)];
  const toggleCat = (where, cat) => setCatOpen({ ...catOpen, [catKey(where, cat)]: !isCatOpen(where, cat) });

  const hideItem = (key) => setHidden([...hidden, key]);
  const unhideItem = (key) => setHidden(hidden.filter((k) => k !== key));
  const addCustom = () => {
    const label = newItem.trim();
    if (!label) return;
    const key = "c_" + label.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + (custom.length + 1);
    setCustom([...custom, { key, label, unit: newUnit, cat: "Otros" }]);
    setNewItem("");
  };
  const delCustom = (key) => {
    setCustom(custom.filter((c) => c.key !== key));
    const b = { ...buy }; delete b[key]; setBuy(b);
  };
  // Cantidad simple para ítems personalizados (no escala por personas).
  const customQty = (key, map) => (typeof map[key] === "number" ? map[key] : 0);
  const adjCustomBuy = (key, d) => setBuy({ ...buy, [key]: Math.max(0, customQty(key, buy) + d) });

  const renderPantryRow = (c) => {
    const st = statusOf(c.key, pantry, people);
    const info = PANTRY_INFO[st];
    const qty = qtyOf(c.key, pantry, people);
    const step = stepFor(c);
    return (
      <div key={c.key} className="cm-pantry-item">
        <span className="cm-pantry-name">{c.label}{c.condiment && <span className="cm-pantry-cond">básico</span>}</span>
        <div className="cm-qty">
          <button className="cm-qty-btn" aria-label="Restar" onClick={() => setPantry({ ...pantry, [c.key]: adjustQty(c.key, pantry, people, -step) })}>−</button>
          <span className="cm-qty-val">{qty} <i>{c.unit}</i></span>
          <button className="cm-qty-btn" aria-label="Sumar" onClick={() => setPantry({ ...pantry, [c.key]: adjustQty(c.key, pantry, people, step) })}>+</button>
        </div>
        <span className="cm-pantry-badge" style={{ background: info.bg, color: info.color }}>
          <span className="dot" style={{ background: info.color }} />{info.label}
        </span>
      </div>
    );
  };
  const renderCustomPantryRow = (c) => {
    const qty = customQty(c.key, pantry);
    const info = PANTRY_INFO[qty > 0 ? "tengo" : "agotado"];
    return (
      <div key={c.key} className="cm-pantry-item">
        <span className="cm-pantry-name">{c.label}</span>
        <div className="cm-qty">
          <button className="cm-qty-btn" aria-label="Restar" onClick={() => setPantry({ ...pantry, [c.key]: Math.max(0, customQty(c.key, pantry) - 1) })}>−</button>
          <span className="cm-qty-val">{qty} <i>{c.unit}</i></span>
          <button className="cm-qty-btn" aria-label="Sumar" onClick={() => setPantry({ ...pantry, [c.key]: customQty(c.key, pantry) + 1 })}>+</button>
        </div>
        <span className="cm-pantry-badge" style={{ background: info.bg, color: info.color }}>
          <span className="dot" style={{ background: info.color }} />{info.label}
        </span>
      </div>
    );
  };

  // Agrega un producto escaneado a la compra usando su peso neto real.
  const addScannedToBuy = (product, { amount = 1, unit = "unid.", target = "match", matchedKey = null } = {}) => {
    buzz(14);
    const item = target === "new" ? null : (matchedKey ? getItem(matchedKey) : findItem(`${product.name} ${product.ingredients}`));
    if (item) {
      // A la unidad del ítem: peso (g/ml) -> kg/L; resto, la cantidad tal cual.
      let amt = (unit === "g" || unit === "ml") ? amount / 1000 : amount;
      amt = Math.max(0, Math.round(amt * 100) / 100);
      setBuy({ ...buy, [item.key]: adjustQty(item.key, buy, people, amt) });
      showToast(`➕ ${amt} ${item.unit} de ${item.label}`, "ok");
      return;
    }
    const baseName = product.brand ? `${product.name} (${product.brand})` : product.name;
    const label = (baseName || "Producto").slice(0, 40);
    const existing = custom.find((c) => c.label === label);
    if (existing) {
      setBuy({ ...buy, [existing.key]: customQty(existing.key, buy) + amount });
    } else {
      const key = "c_" + label.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_" + (custom.length + 1);
      setCustom([...custom, { key, label, unit, cat: "Otros" }]);
      setBuy({ ...buy, [key]: amount });
    }
    showToast(`➕ ${amount} ${unit} · ${label}`, "ok");
  };

  const Slot = ({ dk, slot, label, prepItems }) => {
    const key = dk + slot;
    const isOpen = !!open[key];
    return (
      <>
        <div className="cm-slot" onClick={() => toggle(key)}>
          <span className="sl">{label}</span>
          <span className="sv">{slot === "d" ? prepItems[0].n : names(prepItems)}</span>
          <span className="ch">{isOpen ? "▾" : "▸"}</span>
        </div>
        {isOpen && <div className="cm-prep">{prepItems.map((it, ii) => (<p key={ii} className="pl"><b>{it.n}:</b> {it.p}</p>))}</div>}
      </>
    );
  };

  return (
    <div className={"cm-root" + (theme === "paper" ? " theme-paper" : "")}><div className="cm-app">
      <div className="cm-topbar">
        <span className="cm-brand" onClick={() => setTab("inicio")}>¿Qué <em>comemos</em>?</span>
        <button className="cm-enfchip" onClick={() => setEnfPicker(true)} aria-label="Cambiar enfoque">
          <span className="e">{APPROACH_META[approach]?.emoji}</span>{APPROACH_META[approach]?.name}<span className="cv">▾</span>
        </button>
      </div>

      {enfPicker && (
        <div className="cm-sheet" onClick={() => setEnfPicker(false)}>
          <div className="cm-sheet-card" onClick={(e) => e.stopPropagation()}>
            <p className="cm-mini" style={{ marginBottom: 10 }}>Tu enfoque</p>
            {APPROACHES.map(([id]) => (
              <button key={id} className={"cm-onb-opt" + (approach === id ? " on" : "")} onClick={() => { setApproach(id); setWeek(null); setSugs(null); setEnfPicker(false); }}>
                <span className="emo">{APPROACH_META[id].emoji}</span>
                <span className="t">{APPROACH_META[id].name}</span>
                <span className="d">{APPROACH_META[id].desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === "inicio" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <div className="cm-home-enfoque">
            <span className="emo">{APPROACH_META[approach]?.emoji}</span>
            <div>
              <div className="lbl">Enfoque: {APPROACH_META[approach]?.name}</div>
              <div className="sub">{APPROACH_META[approach]?.desc}</div>
            </div>
          </div>
          <div className="cm-home-grid">
            <button className="cm-home-btn" onClick={() => setTab("ahora")}><span className="ic">🍽</span><span className="t">¿Qué como?</span><span className="d">Ideas para tu próxima comida</span></button>
            <button className="cm-home-btn" onClick={() => setTab("despensa")}><span className="ic">🧺</span><span className="t">Mi despensa</span><span className="d">{agotadosLabels.length ? `${agotadosLabels.length} por reponer` : "Lo que tienes en casa"}</span></button>
            <button className="cm-home-btn" onClick={() => setShowScanner(true)}><span className="ic">📷</span><span className="t">Escanear</span><span className="d">¿Este producto me sirve?</span></button>
            <button className="cm-home-btn" onClick={() => setTab("compras")}><span className="ic">🛒</span><span className="t">Comprar</span><span className="d">Tu lista del mes</span></button>
          </div>
          <button className="cm-theme-toggle" onClick={() => setTheme(theme === "paper" ? "default" : "paper")}>
            🎨 Tema: {theme === "paper" ? "Receta (papel)" : "Clásico"} · cambiar
          </button>
        </div>
      )}

      {tab === "ahora" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">¿Qué comemos?</h2>
          <div className="cm-pills" style={{ marginTop: 4 }}>{MEALS.map((m) => (<button key={m} className={"cm-pill" + (meal === m ? " on" : "")} onClick={() => { setMeal(m); }}>{m}</button>))}</div>

          <button className="cm-opts-toggle" onClick={() => setOptsOpen(!optsOpen)} aria-expanded={optsOpen}>⚙ Opciones {optsOpen ? "▾" : "▸"}</button>
          {optsOpen && (
            <div className="cm-opts">
              <div className="cm-toggle" onClick={() => setQuick(!quick)} role="switch" aria-checked={quick}>
                <span className={"cm-switch" + (quick ? " on" : "")} />
                <span className="lbl">Solo rápidas</span>
              </div>
              <div className="cm-toggle" onClick={() => setCookWith(!cookWith)} role="switch" aria-checked={cookWith}>
                <span className={"cm-switch" + (cookWith ? " on" : "")} />
                <span className="lbl">Cocinar con lo que tengo</span>
              </div>
              <p className="cm-consejo" style={{ border: "none", padding: 0, margin: "2px 0 0" }}>🟢 Tipo A · 🟡 Fruta · 🟠 Tipo E (modera)</p>
            </div>
          )}
          {cookWith && agotadosLabels.length > 0 && (
            <p className="cm-hint" style={{ marginTop: 4, marginBottom: 4 }}>Excluyendo agotado: {agotadosLabels.join(", ")}.</p>
          )}

          {aiLoading ? (
            <div className="cm-cards">
              {[0, 1, 2].map((k) => (<div key={k} className="cm-skel"><div className="cm-skel-line w70" /><div className="cm-skel-line w90" /><div className="cm-skel-line w45" /></div>))}
            </div>
          ) : sugs && sugs.length ? (
            <div className="cm-cards">
              {sugs.map((s, k) => (
                <SuggestionCard key={s.titulo + k} sug={s} approach={approach} pantry={pantry} people={people}
                  isOpen={!!openSug[s.titulo + k]} onToggle={() => toggleSug(s.titulo + k)}
                  isFav={isFav(s)} onFav={() => toggleFav(s)} onCook={onCook} />
              ))}
            </div>
          ) : (
            <div className="cm-res"><p className="placeholder">Toca un botón para 3 sugerencias con su tipo de alimento…</p></div>
          )}

          <button className="cm-roll" onClick={rollLocal}>🍽 {sugs ? "Otras 3 ideas" : "Sugerir 3 ideas"}</button>
          <button className="cm-outline" onClick={rollAI} disabled={aiLoading}>
            {aiLoading ? "✨ Pensando…" : session ? "✨ Sugerir con IA" : "🔒 Inicia sesión para usar la IA"}
          </button>
          {session && aiUsage && !aiErr && (
            <p className="cm-hint" style={{ marginTop: 8, textAlign: "center" }}>Te quedan {Math.max(0, aiUsage.max - aiUsage.used)} de {aiUsage.max} consultas de IA hoy.</p>
          )}
          {aiErr && <p className="cm-hint" style={{ color: "var(--terra)", marginTop: 10 }}>{aiErr}</p>}
        </div>
      )}

      {tab === "favoritos" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">Tus favoritos</h2>
          <p className="cm-p">{session ? "Sincronizados en tu cuenta: los ves en cualquier dispositivo." : "Guardados en este teléfono. Inicia sesión para verlos en todos tus dispositivos."}</p>

          <div className="cm-auth">
            {session ? (
              <div className="cm-auth-row">
                <span className="cm-auth-mail">✓ {session.user.email}{syncing ? " · sincronizando…" : ""}</span>
                {confirmOut ? (
                  <>
                    <button className="cm-auth-out" style={{ borderColor: "var(--terra)", color: "var(--terra)" }} onClick={signOut}>Confirmar</button>
                    <button className="cm-auth-out" onClick={() => setConfirmOut(false)}>Cancelar</button>
                  </>
                ) : (
                  <button className="cm-auth-out" onClick={() => setConfirmOut(true)}>Salir</button>
                )}
              </div>
            ) : (
              <>
                <p className="cm-mini" style={{ margin: "0 0 8px" }}>Sincronizar mis favoritos</p>
                <button className="cm-google" onClick={signInGoogle}>
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.57 2.68-3.89 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
                  Continuar con Google
                </button>
                <p className="cm-hint" style={{ marginTop: 8 }}>Solo la primera vez en este dispositivo. Después entras solo: este equipo te recuerda (salvo que toques “Salir”).</p>
              </>
            )}
            {authMsg && <p className="cm-hint" style={{ marginTop: 8 }}>{authMsg}</p>}
          </div>

          {favs.length === 0 ? (
            <p className="cm-empty">Aún no guardas recetas. Toca la ★ en cualquier sugerencia.</p>
          ) : (
            <div className="cm-cards">
              {favs.map((s, k) => (
                <div key={favKey(s) + k} className="cm-sug open">
                  <div className="cm-sug-top">
                    <span className="cm-sug-title">{s.titulo}</span>
                    <button className="cm-fav on" aria-label="Quitar de favoritos" onClick={() => removeFavWithToast(s.titulo)}>★</button>
                  </div>
                  <p className="cm-fav-meta">{APPROACHES.find((a) => a[0] === s.approach)?.[1] || s.approach} · {s.meal}</p>
                  <TypeFeedback sug={s} approach={s.approach} />
                  <div className="cm-sug-steps">
                    {s.pasos.map((p, i) => (<div key={i} className="st"><b>{p.n}:</b> {p.p}</div>))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "despensa" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">Mi despensa</h2>
          <p className="cm-p">Lo que tienes en casa. Al cocinar se descuenta solo.</p>
          <p className="cm-mini">¿Para cuántas personas?</p>
          <div className="cm-seg" style={{ marginBottom: 14 }}>
            {PEOPLE.map(([lab, n]) => (<button key={n} className={"cm-pill" + (people === n ? " on" : "")} onClick={() => setPeople(n)}>{lab}</button>))}
          </div>
          <div className="cm-pantry-actions">
            <button className="cm-outline" style={{ marginTop: 0 }} onClick={() => setTab("compras")}>🛒 Editar y cargar desde mis compras</button>
          </div>
          {Object.keys(pantry).length === 0 && (
            <p className="cm-hint" style={{ marginBottom: 8 }}>Aún no cargas tu despensa. Ajusta tu compra y tócala para llenarla.</p>
          )}
          <div className="cm-seg" style={{ marginBottom: 12 }}>
            <button className={"cm-pill" + (pantryFilter === "all" ? " on" : "")} onClick={() => setPantryFilter("all")}>Todos</button>
            <button className={"cm-pill" + (pantryFilter === "low" ? " on" : "")} onClick={() => setPantryFilter("low")}>Por reponer</button>
          </div>
          <div className="cm-card">
            {pantryFilter === "low" ? (() => {
              const low = CATALOG.filter((c) => !hidden.includes(c.key) && !c.condiment && statusOf(c.key, pantry, people) !== "tengo");
              const lowCustom = custom.filter((c) => customQty(c.key, pantry) <= 0);
              if (!low.length && !lowCustom.length) return <p className="cm-empty">✅ Todo en orden. Nada por reponer.</p>;
              return (<>{low.map(renderPantryRow)}{lowCustom.map(renderCustomPantryRow)}</>);
            })() : (<>
              {PANTRY_CATS.map((cat) => {
                const items = CATALOG.filter((c) => c.cat === cat && !hidden.includes(c.key));
                if (!items.length) return null;
                const open = isCatOpen("despensa", cat);
                const lowN = items.filter((c) => !c.condiment && statusOf(c.key, pantry, people) !== "tengo").length;
                return (
                  <div key={cat}>
                    <button className="cm-acc-h" onClick={() => toggleCat("despensa", cat)} aria-expanded={open}>
                      <span className="ic">{CATEGORY_ICONS[cat] || "•"}</span>
                      <span className="t">{cat}</span>
                      {lowN > 0 && <span className="meta low">{lowN} por reponer</span>}
                      <span className="chev">{open ? "▾" : "▸"}</span>
                    </button>
                    {open && items.map(renderPantryRow)}
                  </div>
                );
              })}
              {custom.length > 0 && (() => {
                const open = isCatOpen("despensa", "Otros");
                return (
                  <div>
                    <button className="cm-acc-h" onClick={() => toggleCat("despensa", "Otros")} aria-expanded={open}>
                      <span className="ic">🛒</span><span className="t">Otros (tuyos)</span>
                      <span className="meta">{custom.length}</span><span className="chev">{open ? "▾" : "▸"}</span>
                    </button>
                    {open && custom.map(renderCustomPantryRow)}
                  </div>
                );
              })()}
            </>)}
          </div>
          <p className="cm-foot">Los <b>básicos</b> (aceite, sal, ajo, miel, mantequilla) no se descuentan al cocinar: duran mucho.</p>
        </div>
      )}

      {tab === "semana" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">Tu semana rotada</h2>
          <p className="cm-p">7 días combinados sin repetir, desde la misma base.</p>
          {!week && <button className="cm-roll" onClick={() => { setWeek(buildWeek(approach)); setOpen({}); }}>📋 Generar la semana</button>}
          {week && (<>
            <p className="cm-hint">Toca cualquier comida para ver cómo se prepara.</p>
            {week.map((d, k) => (<div key={k} className="cm-day"><p className="cm-day-h">{d.dia}</p>
              <Slot dk={k} slot="d" label="Desayuno" prepItems={[d.desayuno]} />
              <Slot dk={k} slot="a" label="Almuerzo" prepItems={d.almuerzo} />
              <Slot dk={k} slot="c" label="Cena" prepItems={d.cena} />
            </div>))}
            <button className="cm-outline" onClick={() => { setWeek(buildWeek(approach)); setOpen({}); }}>↻ Mezclar otra vez</button>
          </>)}
        </div>
      )}

      {tab === "compras" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">Lista de compras</h2>
          <p className="cm-p">Ajusta lo que vas a comprar y cárgalo a tu despensa.</p>
          <p className="cm-mini">¿Para cuántas personas?</p>
          <div className="cm-seg" style={{ marginBottom: 14 }}>
            {PEOPLE.map(([lab, n]) => (<button key={n} className={"cm-pill" + (people === n ? " on" : "")} onClick={() => setPeople(n)}>{lab}</button>))}
          </div>
          <button className="cm-roll" onClick={loadPantryFromBuy}>🧺 Cargar esta compra a mi despensa</button>
          <p className="cm-hint" style={{ marginTop: 8 }}>Sustituye el stock actual por estas cantidades.</p>
          <div className="cm-card cm-receipt" style={{ marginTop: 12 }}>
            <div className="cm-rcpt-head">
              <span className="store">🧾 MI MERCADO</span>
              <span className="sub">lista del mes · {people} pers.</span>
            </div>
            <div className="cm-rcpt-rule" />
            <div className="cm-add" style={{ marginTop: 0, paddingTop: 0, borderTop: "none", marginBottom: 6 }}>
              <input className="cm-input" placeholder="Agregar ingrediente…" value={newItem}
                onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addCustom(); }} />
              <select className="cm-add-unit" value={newUnit} onChange={(e) => setNewUnit(e.target.value)}>
                <option value="unid.">unid.</option>
                <option value="kg">kg</option>
                <option value="L">L</option>
                <option value="latas">latas</option>
              </select>
              <button className="cm-add-btn" onClick={addCustom}>＋</button>
            </div>
            {PANTRY_CATS.map((cat) => {
              const items = CATALOG.filter((c) => c.cat === cat && !hidden.includes(c.key));
              if (!items.length) return null;
              const open = isCatOpen("compras", cat);
              const done = items.filter((c) => checked[c.key]).length;
              return (<div key={cat}>
                <button className="cm-acc-h" onClick={() => toggleCat("compras", cat)} aria-expanded={open}>
                  <span className="ic">{CATEGORY_ICONS[cat] || "•"}</span>
                  <span className="t">{cat}</span>
                  <span className="meta">{done}/{items.length}</span>
                  <span className="chev">{open ? "▾" : "▸"}</span>
                </button>
                {open && items.map((c) => {
                  const on = !!checked[c.key];
                  const qty = qtyOf(c.key, buy, people);
                  const step = stepFor(c);
                  return (
                    <div key={c.key} className="cm-shop-item">
                      <span className={"cm-shop-box" + (on ? " on" : "")} onClick={() => setChecked({ ...checked, [c.key]: !on })}>{on ? "✓" : ""}</span>
                      <span className={"cm-shop-name" + (on ? " done" : "")} onClick={() => setChecked({ ...checked, [c.key]: !on })}>{c.label}</span>
                      <div className="cm-qty">
                        <button className="cm-qty-btn" aria-label="Restar" onClick={() => setBuy({ ...buy, [c.key]: adjustQty(c.key, buy, people, -step) })}>−</button>
                        <span className="cm-qty-val">{qty} <i>{c.unit}</i></span>
                        <button className="cm-qty-btn" aria-label="Sumar" onClick={() => setBuy({ ...buy, [c.key]: adjustQty(c.key, buy, people, step) })}>+</button>
                      </div>
                      <button className="cm-row-x" aria-label="Quitar de la lista" onClick={() => hideItem(c.key)}>✕</button>
                    </div>);
                })}
              </div>);
            })}

            {custom.length > 0 && (() => {
              const open = isCatOpen("compras", "Otros");
              return (
                <div>
                  <button className="cm-acc-h" onClick={() => toggleCat("compras", "Otros")} aria-expanded={open}>
                    <span className="ic">🛒</span><span className="t">Otros (tuyos)</span>
                    <span className="meta">{custom.length}</span><span className="chev">{open ? "▾" : "▸"}</span>
                  </button>
                  {open && custom.map((c) => {
                    const on = !!checked[c.key];
                    const qty = customQty(c.key, buy);
                    return (
                      <div key={c.key} className="cm-shop-item">
                        <span className={"cm-shop-box" + (on ? " on" : "")} onClick={() => setChecked({ ...checked, [c.key]: !on })}>{on ? "✓" : ""}</span>
                        <span className={"cm-shop-name" + (on ? " done" : "")} onClick={() => setChecked({ ...checked, [c.key]: !on })}>{c.label}</span>
                        <div className="cm-qty">
                          <button className="cm-qty-btn" aria-label="Restar" onClick={() => adjCustomBuy(c.key, -1)}>−</button>
                          <span className="cm-qty-val">{qty} <i>{c.unit}</i></span>
                          <button className="cm-qty-btn" aria-label="Sumar" onClick={() => adjCustomBuy(c.key, 1)}>+</button>
                        </div>
                        <button className="cm-row-x" aria-label="Eliminar" onClick={() => delCustom(c.key)}>✕</button>
                      </div>);
                  })}
                </div>
              );
            })()}
            <div className="cm-rcpt-rule" />
            <div className="cm-rcpt-foot">
              <span>ÍTEMS</span>
              <span>{CATALOG.filter((c) => !hidden.includes(c.key)).length + custom.length} en lista · {[...CATALOG.filter((c) => !hidden.includes(c.key)), ...custom].filter((c) => checked[c.key]).length} ✓</span>
            </div>
            <div className="cm-rcpt-foot end">· · · ¡buen provecho! · · ·</div>
          </div>

          {hidden.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <button className="cm-link" onClick={() => setShowHidden(!showHidden)}>{showHidden ? "Ocultar" : `Ver ${hidden.length} quitado(s)`}</button>
              {showHidden && (
                <div className="cm-hidden-list">
                  {hidden.map((k) => { const it = CATALOG.find((c) => c.key === k); return it ? (
                    <button key={k} className="cm-chip-restore" onClick={() => unhideItem(k)}>+ {it.label}</button>
                  ) : null; })}
                </div>
              )}
            </div>
          )}
          <h2 className="cm-h2" style={{ marginTop: 26 }}>Guía de frutas</h2>
          <p className="cm-p">El único dulce permitido es el natural.</p>
          <div className="cm-card cm-frutas">
            <p className="cm-shop-cat-h" style={{ marginTop: 0 }}>Con libertad (poco azúcar)</p>
            <p className="list">{FRUTAS.buenas.join("  ·  ")}</p>
            <p className="cm-shop-cat-h">Con moderación (más dulces)</p>
            <p className="list" style={{ color: "var(--muted)" }}>{FRUTAS.moderar.join("  ·  ")}</p>
          </div>
          <p className="cm-foot">Compras → cargas a despensa → al cocinar se descuenta solo. Tu lista queda guardada.<br /><br />Solo educativa; no reemplaza a un médico o nutricionista.</p>
        </div>
      )}

      {!onboarded && (
        <div className="cm-onb">
          <div className="cm-onb-card">
            <h1 className="cm-onb-h">¿Qué <em>comemos</em>?</h1>
            <p className="cm-onb-p">Comidas según tu estilo. Elige uno (lo cambias cuando quieras):</p>
            <div className="cm-onb-opts">
              {APPROACHES.map(([id]) => (
                <button key={id} className={"cm-onb-opt" + (approach === id ? " on" : "")} onClick={() => setApproach(id)}>
                  <span className="emo">{APPROACH_META[id].emoji}</span>
                  <span className="t">{APPROACH_META[id].name}</span>
                  <span className="d">{APPROACH_META[id].desc}</span>
                </button>
              ))}
            </div>
            <p className="cm-onb-p" style={{ marginTop: 16 }}>¿Para cuántas personas cocinas?</p>
            <div className="cm-seg">
              {PEOPLE.map(([lab, n]) => (<button key={n} className={"cm-pill" + (people === n ? " on" : "")} onClick={() => setPeople(n)}>{lab}</button>))}
            </div>
            <button className="cm-roll" style={{ marginTop: 18 }} onClick={() => { setOnboarded(true); setTab("inicio"); }}>Empezar →</button>
          </div>
        </div>
      )}

      {!showScanner && onboarded && (
        <button className="cm-fab" onClick={() => setShowScanner(true)} aria-label="Escanear producto">📷</button>
      )}
      {showScanner && (
        <ScannerBoundary fallback={
          <div className="cm-scan">
            <div className="cm-scan-top"><span className="cm-scan-title">Escáner</span><button className="cm-scan-close" onClick={() => setShowScanner(false)}>✕</button></div>
            <p className="cm-scan-hint">No se pudo abrir el escáner. Recarga la app.</p>
            <button className="cm-roll" onClick={() => window.location.reload()}>↻ Recargar</button>
          </div>
        }>
          <Suspense fallback={<div className="cm-scan"><p className="cm-scan-hint">Abriendo escáner…</p></div>}>
            <Scanner approach={approach} onClose={() => setShowScanner(false)} onAdd={addScannedToBuy} />
          </Suspense>
        </ScannerBoundary>
      )}

      {toast && (
        <div key={toast.id} className={"cm-toast " + toast.kind} role="status" aria-live="polite">
          <span>{toast.msg}</span>
          {toast.action && (
            <button className="cm-toast-btn" onClick={() => { toast.action.fn(); setToast(null); }}>{toast.action.label}</button>
          )}
        </div>
      )}

      <nav className="cm-tabs"><div className="cm-tabs-inner">
        <button className={"cm-tab" + (tab === "inicio" ? " on" : "")} onClick={() => setTab("inicio")}><span className="ic">🏠</span>Inicio</button>
        <button className={"cm-tab" + (tab === "ahora" ? " on" : "")} onClick={() => setTab("ahora")}><span className="ic">🍽</span>Ahora</button>
        <button className={"cm-tab" + (tab === "favoritos" ? " on" : "")} onClick={() => setTab("favoritos")}><span className="ic">⭐</span>Favoritos</button>
        <button className={"cm-tab" + (tab === "despensa" ? " on" : "")} onClick={() => setTab("despensa")}><span className="ic">🧺</span>Despensa</button>
        <button className={"cm-tab" + (tab === "semana" ? " on" : "")} onClick={() => setTab("semana")}><span className="ic">📋</span>Semana</button>
        <button className={"cm-tab" + (tab === "compras" ? " on" : "")} onClick={() => setTab("compras")}><span className="ic">🛒</span>Compras</button>
      </div></nav>
    </div></div>
  );
}
