import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { fetchProduct } from "./lib/scan.js";
import { evaluateProduct, VERDICT_INFO } from "./data/diets.js";

export default function Scanner({ approach, onClose, onAdd }) {
  const [added, setAdded] = useState(false);
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
  const toggleSeal = (s) => setMSeals((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const stop = () => { try { controlsRef.current?.stop(); } catch {} };

  const lookup = async (code) => {
    setAdded(false);
    setPhase("loading");
    const p = await fetchProduct(code);
    if (!p) { setErr("Producto no encontrado en Open Food Facts. Prueba otro código."); setPhase("error"); return; }
    setProduct(p);
    setVerdict(evaluateProduct(approach, p));
    setPhase("result");
  };

  const start = async () => {
    setErr(null); setProduct(null); setVerdict(null); lockRef.current = false; setPhase("scan");
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

  // Evaluación manual por etiqueta (cuando el producto no está en la base).
  const evalManual = () => {
    const p = {
      name: mName.trim() || "Producto", brand: "",
      ingredients: mIng.trim().toLowerCase(),
      sugars: null, carbs: null, proteins: null, fat: null, additives: [], nova: null,
      seals: mSeals,
    };
    setProduct(p); setVerdict({ ...evaluateProduct(approach, p), manual: true }); setAdded(false); setPhase("result");
  };

  const v = verdict ? VERDICT_INFO[verdict.verdict] : null;

  return (
    <div className="cm-scan">
      <div className="cm-scan-top">
        <span className="cm-scan-title">Escanear producto</span>
        <button className="cm-scan-close" onClick={close} aria-label="Cerrar">✕</button>
      </div>

      <div className="cm-scan-stage">
        <video ref={videoRef} className="cm-scan-video" muted playsInline />
        {phase === "scan" && <div className="cm-scan-frame" />}
        {phase === "loading" && <div className="cm-scan-msg">Buscando producto…</div>}
      </div>

      {phase === "scan" && (
        <p className="cm-scan-hint">Apunta al código de barras. Enfoque actual: <b>{verdictApproachLabel(approach)}</b></p>
      )}

      {phase === "result" && product && v && (
        <div className="cm-scan-result">
          <div className="cm-scan-verdict" style={{ background: v.bg, color: v.color }}>
            <span className="big">{v.emoji}</span>
            <div>
              <div className="vl">{v.label}</div>
              <div className="vd">según tu enfoque {verdict.dietLabel}</div>
            </div>
          </div>
          <p className="cm-scan-pname">{product.name}{product.brand ? ` · ${product.brand}` : ""}{product.quantity ? ` · ${product.quantity}` : ""}</p>
          <ul className="cm-scan-reasons">
            {verdict.reasons.map((r, k) => (<li key={k}>{r}</li>))}
          </ul>
          {verdict.manual && <p className="cm-scan-nutri">Evaluado por los ingredientes que ingresaste (sin datos de azúcar exactos).</p>}
          {(product.sugars != null || product.proteins != null) && (
            <p className="cm-scan-nutri">
              {product.sugars != null && <>Azúcar {product.sugars}g · </>}
              {product.carbs != null && <>Carbos {product.carbs}g · </>}
              {product.proteins != null && <>Proteína {product.proteins}g</>}
              <span className="per"> /100g</span>
            </p>
          )}
          {onAdd && (
            <button className="cm-outline" style={{ marginTop: 0, marginBottom: 10 }} disabled={added}
              onClick={() => { if (!added) { onAdd(product); setAdded(true); } }}>
              {added ? "✓ Agregado a tu compra" : "➕ Agregar a mi compra"}
            </button>
          )}
          <button className="cm-roll" onClick={start}>📷 Escanear otro</button>
        </div>
      )}

      {phase === "error" && (
        <div className="cm-scan-result">
          <p className="cm-scan-err">{err}</p>
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
        <div className="cm-scan-manual">
          <input className="cm-input" inputMode="numeric" placeholder="o ingresa el código…" value={manual}
            onChange={(e) => setManual(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") submitManual(); }} />
          <button className="cm-auth-send" onClick={submitManual}>Buscar</button>
        </div>
      )}
    </div>
  );
}

function verdictApproachLabel(approach) {
  return approach === "metabolismo" ? "3x1" : approach === "animal" ? "Animal" : "Balanceado";
}
