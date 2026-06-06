import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { fetchProduct } from "./lib/scan.js";
import { evaluateProduct, VERDICT_INFO } from "./data/diets.js";
import { findItem } from "./data/pantry.js";

export default function Scanner({ approach, onClose, onAdd, onReadLabel, hasSession }) {
  const [added, setAdded] = useState(false);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const controlsRef = useRef(null);
  const lockRef = useRef(false);
  const [phase, setPhase] = useState("scan"); // scan | loading | result | error
  const [product, setProduct] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [err, setErr] = useState(null);
  const [manual, setManual] = useState("");
  const [mName, setMName] = useState("");
  const [mIng, setMIng] = useState("");
  const [mSeals, setMSeals] = useState([]);
  const [addAmount, setAddAmount] = useState("");
  const [addUnit, setAddUnit] = useState("unid.");
  const [addTarget, setAddTarget] = useState("new"); // "match" | "new"

  const initAdd = (p) => {
    const m = findItem(`${p.name} ${p.ingredients}`);
    setAddTarget(m ? "match" : "new");
    if (m && (m.unit === "kg" || m.unit === "L")) { setAddUnit("g"); setAddAmount(p.grams != null ? String(p.grams) : ""); }
    else if (m) { setAddUnit(m.unit); setAddAmount("1"); }
    else { setAddUnit("unid."); setAddAmount("1"); }
  };
  const toggleSeal = (s) => setMSeals((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const stop = () => { try { controlsRef.current?.stop(); } catch {} };

  const lookup = async (code) => {
    setAdded(false);
    setPhase("loading");
    const p = await fetchProduct(code);
    if (!p) { setManual(code); setErr("No está en la base. Toma una foto de la etiqueta o ingresa los datos."); setPhase("error"); return; }
    setProduct(p);
    initAdd(p);
    const vd = evaluateProduct(approach, p);
    setVerdict(vd);
    setPhase("result");
    try { navigator.vibrate?.(vd.verdict === "evita" ? [40, 40, 40] : vd.verdict === "moderar" ? [15, 60, 15] : 18); } catch {}
  };

  const start = async () => {
    setErr(null); setProduct(null); setVerdict(null); setAdded(false); lockRef.current = false; setPhase("scan");
    if (!readerRef.current) readerRef.current = new BrowserMultiFormatReader();
    try {
      controlsRef.current = await readerRef.current.decodeFromConstraints(
        { video: { facingMode: "environment" } },
        videoRef.current,
        (res, e, controls) => {
          if (res && !lockRef.current) {
            lockRef.current = true;
            controls.stop();
            lookup(res.getText());
          }
        }
      );
    } catch {
      setErr("No se pudo abrir la cámara. Permite el acceso o ingresa el código a mano.");
      setPhase("error");
    }
  };

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => { stop(); onClose(); };
  const submitManual = () => { const c = manual.trim(); if (c) { stop(); lookup(c); } };

  // Foto de la etiqueta -> IA visión -> rellena datos.
  const compress = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 900;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.6));
    };
    img.onerror = reject;
    img.src = url;
  });
  const numOrNull = (v) => (typeof v === "number" && !Number.isNaN(v) ? Math.round(v * 100) / 100 : null);
  const handlePhoto = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    e.target.value = "";
    if (!hasSession) { setErr("Inicia sesión (en ★ Favoritos) para leer etiquetas con foto."); setPhase("error"); return; }
    stop(); setErr(null); setPhase("loading");
    try {
      const dataUrl = await compress(file);
      const d = await onReadLabel(dataUrl);
      const p = {
        name: d.nombre || "Producto", brand: "",
        ingredients: (d.ingredientes || "").toLowerCase(),
        sugars: numOrNull(d.sugars), carbs: numOrNull(d.carbs), proteins: numOrNull(d.proteins), fat: numOrNull(d.fat),
        additives: [], nova: null, nutriscore: null, image: dataUrl, quantity: "", grams: null,
        seals: Array.isArray(d.sellos) ? d.sellos : [],
      };
      setProduct(p); setAdded(false); initAdd(p);
      setVerdict({ ...evaluateProduct(approach, p), foto: true });
      setPhase("result");
    } catch (err) {
      if (err && (err.code === "login" || err.code === 401)) setErr("Inicia sesión (en ★ Favoritos) para leer etiquetas con foto.");
      else if (err && err.code === 429) setErr(err.message);
      else setErr("No se pudo leer la etiqueta. Prueba con buena luz y enfoque.");
      setPhase("error");
    }
  };

  // Evaluación manual por etiqueta (cuando el producto no está en la base).
  const evalManual = () => {
    const p = {
      name: mName.trim() || "Producto", brand: "",
      ingredients: mIng.trim().toLowerCase(),
      sugars: null, carbs: null, proteins: null, fat: null, additives: [], nova: null,
      seals: mSeals,
    };
    setProduct(p); setVerdict({ ...evaluateProduct(approach, p), manual: true }); setAdded(false); initAdd(p); setPhase("result");
  };

  const v = verdict ? VERDICT_INFO[verdict.verdict] : null;

  return (
    <div className="cm-scan">
      <div className="cm-scan-top">
        <span className="cm-scan-title">🧾 Escanear producto</span>
        <button className="cm-scan-close" onClick={close} aria-label="Cerrar">✕</button>
      </div>
      <div className="cm-rcpt-rule" />
      <input type="file" accept="image/*" capture="environment" hidden ref={fileRef} onChange={handlePhoto} />

      <div className="cm-scan-stage">
        <video ref={videoRef} className="cm-scan-video" muted playsInline />
        {phase === "scan" && <div className="cm-scan-frame" />}
        {phase === "loading" && <div className="cm-scan-msg">Buscando producto…</div>}
      </div>

      {phase === "scan" && (
        <p className="cm-scan-hint">Apunta al código de barras. Enfoque actual: <b>{verdictApproachLabel(approach)}</b></p>
      )}

      {phase === "result" && product && v && (
        <div className="cm-scan-result cm-scan-card">
          <div className="cm-scan-verdict" style={{ background: v.bg, color: v.color }}>
            <span className="big">{v.emoji}</span>
            <div>
              <div className="vl">{v.label}</div>
              <div className="vd">según tu enfoque {verdict.dietLabel}</div>
            </div>
          </div>
          <div className="cm-scan-prod">
            {product.image && <img className="cm-scan-img" src={product.image} alt="" />}
            <p className="cm-scan-pname">{product.name}{product.brand ? ` · ${product.brand}` : ""}{product.quantity ? ` · ${product.quantity}` : ""}</p>
          </div>

          {(product.nutriscore || product.nova || (product.additives && product.additives.length > 0)) && (
            <div className="cm-scan-facts">
              {product.nutriscore && <span className={"fact ns ns-" + product.nutriscore}>Nutri-Score {product.nutriscore.toUpperCase()}</span>}
              {product.nova && <span className="fact">{novaLabel(product.nova)}</span>}
              {product.additives && product.additives.length > 0 && <span className="fact">{product.additives.length} aditivo(s)</span>}
            </div>
          )}

          <ul className="cm-scan-reasons">
            {verdict.reasons.map((r, k) => (<li key={k}>{r}</li>))}
          </ul>
          {verdict.manual && <p className="cm-scan-nutri">Evaluado por los ingredientes que ingresaste (sin datos de azúcar exactos).</p>}
          {(product.sugars != null || product.proteins != null || product.fat != null) && (
            <p className="cm-scan-nutri">
              {product.sugars != null && <>Azúcar {product.sugars}g · </>}
              {product.carbs != null && <>Carbos {product.carbs}g · </>}
              {product.proteins != null && <>Proteína {product.proteins}g · </>}
              {product.fat != null && <>Grasa {product.fat}g</>}
              <span className="per"> /100g</span>
            </p>
          )}
          {onAdd && (() => {
            const matched = findItem(`${product.name} ${product.ingredients}`);
            const useMatch = matched && addTarget === "match";
            const isWeight = useMatch && (matched.unit === "kg" || matched.unit === "L");
            const a = Number(addAmount) || 0;
            return (
              <>
                {matched && (
                  <div className="cm-scan-weight">
                    <label>Agregar a</label>
                    <select className="cm-add-unit" style={{ width: "100%" }} value={addTarget}
                      onChange={(e) => { const t = e.target.value; setAddTarget(t); setAdded(false); if (t === "match") { if (matched.unit === "kg" || matched.unit === "L") { setAddUnit("g"); setAddAmount(product.grams != null ? String(product.grams) : ""); } else { setAddUnit(matched.unit); setAddAmount("1"); } } else { setAddUnit("unid."); setAddAmount("1"); } }}>
                      <option value="match">{matched.label} (existente)</option>
                      <option value="new">Nuevo: {product.name.slice(0, 28)}</option>
                    </select>
                  </div>
                )}
                <div className="cm-scan-weight">
                  <label>{isWeight ? "Peso que compraste" : "Cantidad"}</label>
                  <div className="cm-scan-wrow">
                    <input className="cm-input" inputMode="decimal" placeholder={isWeight ? "g" : "1"} value={addAmount}
                      onChange={(e) => { setAddAmount(e.target.value.replace(/[^0-9.]/g, "")); setAdded(false); }} />
                    {useMatch ? (
                      <span className="u">{isWeight ? "g" : matched.unit}</span>
                    ) : (
                      <select className="cm-add-unit" value={addUnit} onChange={(e) => { setAddUnit(e.target.value); setAdded(false); }}>
                        <option value="unid.">unid.</option>
                        <option value="paquete">paquete</option>
                        <option value="latas">latas</option>
                        <option value="kg">kg</option>
                        <option value="g">g</option>
                        <option value="L">L</option>
                      </select>
                    )}
                  </div>
                </div>
                <button className="cm-outline" style={{ marginTop: 0, marginBottom: 6 }} disabled={added || !(a > 0)}
                  onClick={() => { if (!added && a > 0) { onAdd(product, { amount: a, unit: addUnit, target: addTarget, matchedKey: matched ? matched.key : null }); setAdded(true); } }}>
                  {added ? "✓ Agregado a tu compra" : "➕ Agregar a mi compra"}
                </button>
                {!added && !(a > 0) && <p className="cm-hint" style={{ marginTop: 0, marginBottom: 10 }}>Indica la cantidad para agregarlo.</p>}
              </>
            );
          })()}
          <button className="cm-roll" onClick={start}>📷 Escanear otro</button>
        </div>
      )}

      {phase === "error" && (
        <div className="cm-scan-result">
          <p className="cm-scan-err">{err}</p>
          <button className="cm-roll" style={{ marginBottom: 8 }} onClick={() => fileRef.current?.click()}>📸 Foto de la etiqueta</button>
          <button className="cm-outline" style={{ marginTop: 0 }} onClick={start}>📷 Reintentar cámara</button>
          <div className="cm-scan-manual">
            <input className="cm-input" inputMode="numeric" placeholder="o ingresa el código…" value={manual}
              onChange={(e) => setManual(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitManual(); }} />
            <button className="cm-auth-send" onClick={submitManual}>Buscar</button>
          </div>

          <div className="cm-divider"><span>¿No está? Evalúalo por su etiqueta</span></div>
          <input className="cm-input" placeholder="Nombre del producto" value={mName} onChange={(e) => setMName(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
          <p className="cm-mini" style={{ margin: "0 0 6px" }}>Sellos negros del producto</p>
          <div className="cm-seals">
            {[["azucar", "Alto en azúcares"], ["calorias", "Alto en calorías"], ["grasas", "Alto en grasas sat."], ["sodio", "Alto en sodio"]].map(([k, lab]) => (
              <button key={k} className={"cm-seal" + (mSeals.includes(k) ? " on" : "")} onClick={() => toggleSeal(k)}>{mSeals.includes(k) ? "⬛ " : ""}{lab}</button>
            ))}
          </div>
          <textarea className="cm-input cm-textarea" placeholder="(opcional) pega los ingredientes de la etiqueta…" value={mIng} onChange={(e) => setMIng(e.target.value)} style={{ marginTop: 10 }} />
          <button className="cm-roll" style={{ marginTop: 10 }} onClick={evalManual}>Evaluar</button>
        </div>
      )}

      {phase === "scan" && (
        <>
          <button className="cm-outline" style={{ marginTop: 12 }} onClick={() => fileRef.current?.click()}>📸 Leer etiqueta con foto</button>
          <div className="cm-scan-manual">
            <input className="cm-input" inputMode="numeric" placeholder="o ingresa el código…" value={manual}
              onChange={(e) => setManual(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitManual(); }} />
            <button className="cm-auth-send" onClick={submitManual}>Buscar</button>
          </div>
        </>
      )}
    </div>
  );
}

function verdictApproachLabel(approach) {
  return approach === "metabolismo" ? "3x1" : approach === "animal" ? "Animal" : "Balanceado";
}

function novaLabel(n) {
  return n === 1 ? "Sin procesar" : n === 2 ? "Ingrediente culinario" : n === 3 ? "Procesado" : "Ultraprocesado";
}
