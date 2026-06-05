import React, { useEffect, useState } from "react";
import { STYLES } from "./styles.js";
import { DB } from "./data/recipes.js";
import { SHOPPING, FRUTAS } from "./data/shopping.js";
import { APPROACHES, MEALS, PEOPLE, DAYS } from "./data/config.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";

const rnd = (a) => a[Math.floor(Math.random() * a.length)];

function suggest(approach, type) {
  const d = DB[approach];
  if (type === "Desayuno") { const x = rnd(d.desayunos); return { titulo: x.n, pasos: [x] }; }
  if (type === "Snack") { const x = rnd(d.snacks); return { titulo: x.n, pasos: [x] }; }
  const items = [rnd(d.proteinas)];
  if (d.carbos && d.carbos.length) items.push(rnd(d.carbos));
  items.push(rnd(d.vegetales), rnd(d.grasas));
  return { titulo: items.map((x) => x.n).join("  ·  "), pasos: items };
}

function shuffle(a) {
  const x = [...a];
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
}

const pick = (arr, k) => (arr && arr.length ? arr[k % arr.length] : null);

function buildWeek(approach) {
  const d = DB[approach];
  const P = shuffle(d.proteinas), C = shuffle(d.carbos), V = shuffle(d.vegetales), F = shuffle(d.grasas), B = shuffle(d.desayunos);
  return DAYS.map((day, k) => ({
    dia: day,
    desayuno: pick(B, k),
    almuerzo: [pick(P, k), pick(C, k), pick(V, k), pick(F, k)].filter(Boolean),
    cena: [pick(P, k + 2), pick(C, k + 1), pick(V, k + 3), pick(F, k + 1)].filter(Boolean),
  }));
}

const names = (arr) => arr.map((x) => x.n).join("  ·  ");

// Ingredientes disponibles, derivados de la lista de compras (sin paréntesis ni duplicados).
const INGREDIENTS = [...new Set(SHOPPING.map((s) => s.item.replace(/\s*\(.*?\)/g, "").trim()))];

function fmtQty(base, n, unit) {
  const v = base * n;
  const s = Number.isInteger(v) ? v : v.toFixed(1);
  return `${s} ${unit}`;
}

export default function App() {
  const [tab, setTab] = useLocalStorage("cm_tab", "ahora");
  const [approach, setApproach] = useLocalStorage("cm_approach", "metabolismo");
  const [people, setPeople] = useLocalStorage("cm_people", 2);
  const [meal, setMeal] = useLocalStorage("cm_meal", "Almuerzo");
  const [res, setRes] = useLocalStorage("cm_res", null);
  const [week, setWeek] = useLocalStorage("cm_week", null);
  const [open, setOpen] = useLocalStorage("cm_open", {});
  const [checked, setChecked] = useLocalStorage("cm_checked", {});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr] = useState(null);

  useEffect(() => {
    const l = document.createElement("style");
    l.textContent = STYLES;
    document.head.appendChild(l);
    return () => document.head.removeChild(l);
  }, []);

  const roll = () => { let s = suggest(approach, meal); if (res && s.titulo === res.titulo) s = suggest(approach, meal); setRes(s); };

  const rollAI = async () => {
    setAiLoading(true);
    setAiErr(null);
    try {
      const r = await fetch("/.netlify/functions/sugerir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approach, meal, ingredients: INGREDIENTS }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Error");
      setRes(d);
    } catch (e) {
      setAiErr("No se pudo generar con IA. Revisa que GEMINI_API_KEY esté configurada en Netlify (no funciona en local sin netlify dev).");
    } finally {
      setAiLoading(false);
    }
  };
  const toggle = (key) => setOpen({ ...open, [key]: !open[key] });
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
          {APPROACHES.map(([id, lab]) => (<button key={id} className={"cm-pill" + (approach === id ? " on" : "")} onClick={() => { setApproach(id); setWeek(null); setRes(null); }}>{lab}</button>))}
        </div>
      </div>

      {tab === "ahora" && (
        <div className="cm-section" style={{ marginTop: 20 }}>
          <h2 className="cm-h2">¿Qué comemos ahora?</h2>
          <p className="cm-p">Elige el momento y toca para una idea, con su preparación.</p>
          <p className="cm-mini">Momento</p>
          <div className="cm-pills">{MEALS.map((m) => (<button key={m} className={"cm-pill" + (meal === m ? " on" : "")} onClick={() => { setMeal(m); setRes(null); }}>{m}</button>))}</div>
          <div className="cm-res">{res ? (
            <div className="cm-rescontent" key={res.titulo}>
              <p className="cm-restitle">{res.titulo}</p>
              <div className="cm-steps">{res.pasos.map((s, k) => (<div key={k} className="cm-step"><b>{s.n}:</b> {s.p}</div>))}</div>
            </div>
          ) : <p className="placeholder">Toca el botón para una sugerencia con su preparación…</p>}</div>
          <button className="cm-roll" onClick={roll}>🍽 {res ? "Otra sugerencia" : "Sugerir " + meal.toLowerCase()}</button>
          <button className="cm-outline" onClick={rollAI} disabled={aiLoading}>{aiLoading ? "✨ Pensando…" : "✨ Sugerir con IA"}</button>
          {aiErr && <p className="cm-hint" style={{ color: "var(--terra)", marginTop: 10 }}>{aiErr}</p>}
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

      <nav className="cm-tabs"><div className="cm-tabs-inner">
        <button className={"cm-tab" + (tab === "ahora" ? " on" : "")} onClick={() => setTab("ahora")}><span className="ic">🍽</span>Ahora</button>
        <button className={"cm-tab" + (tab === "semana" ? " on" : "")} onClick={() => setTab("semana")}><span className="ic">📅</span>Semana</button>
        <button className={"cm-tab" + (tab === "compras" ? " on" : "")} onClick={() => setTab("compras")}><span className="ic">🛒</span>Compras</button>
      </div></nav>
    </div></div>
  );
}
