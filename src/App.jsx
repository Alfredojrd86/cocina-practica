import React, { useEffect, useState, useRef } from "react";
import { STYLES } from "./styles.js";
import { SHOPPING, FRUTAS } from "./data/shopping.js";
import { APPROACHES, MEALS, PEOPLE, DAYS } from "./data/config.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { supabase, supabaseReady } from "./lib/supabase.js";
import { suggestN, buildWeek, names, fmtQty } from "./lib/suggest.js";
import { analyzeSuggestion, TIPO_INFO } from "./data/foodTypes.js";
import { CATALOG, PANTRY_CATS, PANTRY_INFO, statusOf, nextStatus, extractItems, itemsFromNames, splitByPantry } from "./data/pantry.js";

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

function PantryMatch({ sug, pantry }) {
  const items = sug.ingredientes && sug.ingredientes.length ? itemsFromNames(sug.ingredientes) : extractItems(sug);
  if (!items.length) return null;
  const { have, missing } = splitByPantry(items, pantry);
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

function SuggestionCard({ sug, approach, pantry, isOpen, onToggle, isFav, onFav }) {
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
      <TypeFeedback sug={sug} approach={approach} />
      <PantryMatch sug={sug} pantry={pantry} />
      {isOpen ? (
        <div className="cm-sug-steps">
          {sug.pasos.map((s, k) => (<div key={k} className="st"><b>{s.n}:</b> {s.p}</div>))}
        </div>
      ) : <p className="cm-sug-hint">Toca para ver la preparación ▾</p>}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useLocalStorage("cm_tab", "ahora");
  const [approach, setApproach] = useLocalStorage("cm_approach", "metabolismo");
  const [people, setPeople] = useLocalStorage("cm_people", 2);
  const [meal, setMeal] = useLocalStorage("cm_meal", "Almuerzo");
  const [quick, setQuick] = useLocalStorage("cm_quick", false);
  const [sugs, setSugs] = useLocalStorage("cm_sugs", null);
  const [week, setWeek] = useLocalStorage("cm_week", null);
  const [open, setOpen] = useLocalStorage("cm_open", {});
  const [checked, setChecked] = useLocalStorage("cm_checked", {});
  const [pantry, setPantry] = useLocalStorage("cm_pantry", {});
  const { favs, add: addFav, remove: removeFav, session, syncing } = useFavorites();
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
  const toastTimer = useRef(null);

  const showToast = (msg, kind = "ok", action = null) => {
    setToast({ msg, kind, action, id: Date.now() });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), action ? 4000 : 2200);
  };

  useEffect(() => {
    const l = document.createElement("style");
    l.textContent = STYLES;
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);

  const rollLocal = () => { setAiErr(null); setOpenSug({}); setSugs(suggestN(approach, meal, 3, { practical: quick })); };

  const rollAI = async () => {
    if (!session) { setTab("favoritos"); showToast("Inicia sesión para usar la IA", "rm"); return; }
    setAiLoading(true);
    setAiErr(null);
    try {
      const token = session?.access_token;
      const r = await fetch("/.netlify/functions/sugerir", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ approach, meal, ingredients: INGREDIENTS, people, quick }),
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
    const r = await addFav({ titulo: s.titulo, pasos: s.pasos, approach, meal });
    if (session) showToast(r.error ? "Guardado local · no sincronizó" : "★ Guardado y sincronizado", r.error ? "rm" : "ok");
    else if (supabaseReady) showToast("Guardado en este equipo", "ok", { label: "Iniciar sesión", fn: () => setTab("favoritos") });
    else showToast("★ Guardado en favoritos", "ok");
  };
  const removeFavWithToast = async (titulo) => {
    const r = await removeFav(titulo);
    showToast(session && r.error ? "Quitado local · no sincronizó" : "Quitado de favoritos", "rm");
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
  const cats = [...new Set(SHOPPING.map((s) => s.cat))];

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
    <div className="cm-root"><div className="cm-app">
      <div className="cm-head">
        <h1>¿Qué <em>comemos</em>?</h1>
        <div className="cm-banner">🍯 Sin azúcar añadida · solo lo natural</div>
        <p className="cm-mini">Enfoque</p>
        <div className="cm-seg">
          {APPROACHES.map(([id, lab]) => (<button key={id} className={"cm-pill" + (approach === id ? " on" : "")} onClick={() => { setApproach(id); setWeek(null); setSugs(null); }}>{lab}</button>))}
        </div>
      </div>

      {tab === "ahora" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">¿Qué comemos ahora?</h2>
          <p className="cm-p">Elige el momento. Te damos 3 ideas con su tipo de alimento y preparación.</p>
          <p className="cm-mini">Momento</p>
          <div className="cm-pills">{MEALS.map((m) => (<button key={m} className={"cm-pill" + (meal === m ? " on" : "")} onClick={() => { setMeal(m); }}>{m}</button>))}</div>

          <div className="cm-toggle" onClick={() => setQuick(!quick)} role="switch" aria-checked={quick}>
            <span className={"cm-switch" + (quick ? " on" : "")} />
            <span><span className="lbl">Solo rápidas</span> <span className="sub">— sin horno, pocos ingredientes</span></span>
          </div>

          <div className="cm-legend cm-consejo" style={{ border: "none", padding: 0, marginTop: 0, marginBottom: 4 }}>
            🟢 Tipo A (libre) · 🟡 Fruta (moderar) · 🟠 Tipo E (modera porción)
          </div>

          {supabaseReady && !session && (
            <button className="cm-nudge" onClick={() => setTab("favoritos")}>
              💡 Inicia sesión con Google en <b>★ Favoritos</b> para guardar tus platos en todos tus dispositivos →
            </button>
          )}

          {aiLoading ? (
            <div className="cm-cards">
              {[0, 1, 2].map((k) => (<div key={k} className="cm-skel"><div className="cm-skel-line w70" /><div className="cm-skel-line w90" /><div className="cm-skel-line w45" /></div>))}
            </div>
          ) : sugs && sugs.length ? (
            <div className="cm-cards">
              {sugs.map((s, k) => (
                <SuggestionCard key={s.titulo + k} sug={s} approach={approach} pantry={pantry}
                  isOpen={!!openSug[s.titulo + k]} onToggle={() => toggleSug(s.titulo + k)}
                  isFav={isFav(s)} onFav={() => toggleFav(s)} />
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
          <p className="cm-p">Marca lo que te queda. Las sugerencias muestran qué tienes y qué falta. Toca para cambiar: Tengo → Poco → Agotado.</p>
          <div className="cm-pantry-actions">
            <button className="cm-outline" style={{ marginTop: 0 }} onClick={() => setPantry({})}>↺ Reiniciar (todo: Tengo)</button>
          </div>
          <div className="cm-card">
            {PANTRY_CATS.map((cat) => (
              <div key={cat}>
                <p className="cm-shop-cat-h">{cat}</p>
                {CATALOG.filter((c) => c.cat === cat).map((c) => {
                  const st = statusOf(c.key, pantry);
                  const info = PANTRY_INFO[st];
                  return (
                    <div key={c.key} className="cm-pantry-item" onClick={() => setPantry({ ...pantry, [c.key]: nextStatus(st) })}>
                      <span className="cm-pantry-name">{c.label}</span>
                      <span className="cm-pantry-badge" style={{ background: info.bg, color: info.color }}>
                        <span className="dot" style={{ background: info.color }} />{info.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "semana" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">Tu semana rotada</h2>
          <p className="cm-p">7 días combinados sin repetir, desde la misma base.</p>
          {!week && <button className="cm-roll" onClick={() => { setWeek(buildWeek(approach)); setOpen({}); }}>📅 Generar la semana</button>}
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
          <p className="cm-p">Cantidades del mes — tócalas para tacharlas.</p>
          <p className="cm-mini">¿Para cuántas personas?</p>
          <div className="cm-seg" style={{ marginBottom: 16 }}>
            {PEOPLE.map(([lab, n]) => (<button key={n} className={"cm-pill" + (people === n ? " on" : "")} onClick={() => setPeople(n)}>{lab}</button>))}
          </div>
          <div className="cm-card">
            {cats.map((cat) => (<div key={cat}>
              <p className="cm-shop-cat-h">{cat}</p>
              {SHOPPING.filter((s) => s.cat === cat).map((s, k) => {
                const key = cat + k;
                const on = !!checked[key];
                const mod = s.flag === "moderar" || s.item.includes("moderar");
                const nuevo = s.flag === "nuevo";
                const clean = s.item.replace(" (moderar)", "");
                return (
                  <div key={k} className="cm-shop-item" onClick={() => setChecked({ ...checked, [key]: !on })}>
                    <span className={"cm-shop-box" + (on ? " on" : "")}>{on ? "✓" : ""}</span>
                    <span className={"cm-shop-name" + (on ? " done" : "")}>{clean}
                      {mod && <span className="cm-tag">moderar</span>}
                      {nuevo && <span className="cm-tag nuevo">nuevo</span>}
                    </span>
                    <span className="cm-shop-qty">{fmtQty(s.base, people, s.unit)}</span>
                  </div>);
              })}
            </div>))}
          </div>
          <h2 className="cm-h2" style={{ marginTop: 26 }}>Guía de frutas</h2>
          <p className="cm-p">El único dulce permitido es el natural.</p>
          <div className="cm-card cm-frutas">
            <p className="cm-shop-cat-h" style={{ marginTop: 0 }}>Con libertad (poco azúcar)</p>
            <p className="list">{FRUTAS.buenas.join("  ·  ")}</p>
            <p className="cm-shop-cat-h">Con moderación (más dulces)</p>
            <p className="list" style={{ color: "var(--muted)" }}>{FRUTAS.moderar.join("  ·  ")}</p>
          </div>
          <p className="cm-foot"><b>Funciona sola</b>, sin internet ni costo. Tu lista y semana quedan guardadas en este teléfono.<br /><br />Solo educativa; no reemplaza a un médico o nutricionista.</p>
        </div>
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
        <button className={"cm-tab" + (tab === "ahora" ? " on" : "")} onClick={() => setTab("ahora")}><span className="ic">🍽</span>Ahora</button>
        <button className={"cm-tab" + (tab === "favoritos" ? " on" : "")} onClick={() => setTab("favoritos")}><span className="ic">⭐</span>Favoritos</button>
        <button className={"cm-tab" + (tab === "despensa" ? " on" : "")} onClick={() => setTab("despensa")}><span className="ic">🧺</span>Despensa</button>
        <button className={"cm-tab" + (tab === "semana" ? " on" : "")} onClick={() => setTab("semana")}><span className="ic">📅</span>Semana</button>
        <button className={"cm-tab" + (tab === "compras" ? " on" : "")} onClick={() => setTab("compras")}><span className="ic">🛒</span>Compras</button>
      </div></nav>
    </div></div>
  );
}
