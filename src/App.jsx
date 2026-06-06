import React, { useEffect, useState, useRef } from "react";
import { STYLES } from "./styles.js";
import { SHOPPING, FRUTAS } from "./data/shopping.js";
import { APPROACHES, MEALS, PEOPLE, DAYS } from "./data/config.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { useFavorites } from "./hooks/useFavorites.js";
import { supabase, supabaseReady } from "./lib/supabase.js";
import { suggestN, buildWeek, names, fmtQty } from "./lib/suggest.js";
import { analyzeSuggestion, TIPO_INFO } from "./data/foodTypes.js";

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

function SuggestionCard({ sug, approach, isOpen, onToggle, isFav, onFav }) {
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
  const { favs, add: addFav, remove: removeFav, session, syncing } = useFavorites();
  const [openSug, setOpenSug] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(null);
  const [email, setEmail] = useState("");
  const [authMsg, setAuthMsg] = useState(null);
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
    setAiLoading(true);
    setAiErr(null);
    try {
      const r = await fetch("/.netlify/functions/sugerir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approach, meal, ingredients: INGREDIENTS, people, quick }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      const arr = Array.isArray(d.sugerencias) ? d.sugerencias : [d];
      setOpenSug({});
      setSugs(arr);
    } catch (e) {
      setAiErr("No se pudo generar con IA. Revisa que GROQ_API_KEY esté configurada en Netlify (no funciona en local sin netlify dev).");
    } finally {
      setAiLoading(false);
    }
  };

  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });
  const toggleSug = (key) => setOpenSug({ ...openSug, [key]: !openSug[key] });
  const isFav = (s) => favs.some((f) => favKey(f) === favKey(s));
  const toggleFav = (s) => {
    if (isFav(s)) { removeFav(s.titulo); showToast("Quitado de favoritos", "rm"); return; }
    addFav({ titulo: s.titulo, pasos: s.pasos, approach, meal });
    if (supabaseReady && !session) {
      showToast("Guardado en este equipo", "ok", { label: "Registrar correo", fn: () => setTab("favoritos") });
    } else {
      showToast("★ Guardado en favoritos", "ok");
    }
  };
  const removeFavWithToast = (titulo) => { removeFav(titulo); showToast("Quitado de favoritos", "rm"); };

  const sendMagicLink = async () => {
    setAuthMsg(null);
    if (!supabaseReady) { setAuthMsg("Sync no configurado (faltan variables Supabase)."); return; }
    if (!email.includes("@")) { setAuthMsg("Escribe un correo válido."); return; }
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setAuthMsg(error ? "Error: " + error.message : "Revisa tu correo y abre el enlace para entrar.");
  };
  const signOut = async () => { if (supabase) await supabase.auth.signOut(); };
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
              💡 Registra tu correo en <b>★ Favoritos</b> para guardar tus platos en todos tus dispositivos →
            </button>
          )}

          {aiLoading ? (
            <div className="cm-cards">
              {[0, 1, 2].map((k) => (<div key={k} className="cm-skel"><div className="cm-skel-line w70" /><div className="cm-skel-line w90" /><div className="cm-skel-line w45" /></div>))}
            </div>
          ) : sugs && sugs.length ? (
            <div className="cm-cards">
              {sugs.map((s, k) => (
                <SuggestionCard key={s.titulo + k} sug={s} approach={approach}
                  isOpen={!!openSug[s.titulo + k]} onToggle={() => toggleSug(s.titulo + k)}
                  isFav={isFav(s)} onFav={() => toggleFav(s)} />
              ))}
            </div>
          ) : (
            <div className="cm-res"><p className="placeholder">Toca un botón para 3 sugerencias con su tipo de alimento…</p></div>
          )}

          <button className="cm-roll" onClick={rollLocal}>🍽 {sugs ? "Otras 3 ideas" : "Sugerir 3 ideas"}</button>
          <button className="cm-outline" onClick={rollAI} disabled={aiLoading}>{aiLoading ? "✨ Pensando…" : "✨ Sugerir con IA"}</button>
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
                <button className="cm-auth-out" onClick={signOut}>Salir</button>
              </div>
            ) : (
              <>
                <p className="cm-mini" style={{ margin: "0 0 8px" }}>Sincronizar mis favoritos</p>
                <div className="cm-auth-row">
                  <input className="cm-input" type="email" inputMode="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  <button className="cm-auth-send" onClick={sendMagicLink}>Enviar enlace</button>
                </div>
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
        <button className={"cm-tab" + (tab === "semana" ? " on" : "")} onClick={() => setTab("semana")}><span className="ic">📅</span>Semana</button>
        <button className={"cm-tab" + (tab === "compras" ? " on" : "")} onClick={() => setTab("compras")}><span className="ic">🛒</span>Compras</button>
      </div></nav>
    </div></div>
  );
}
