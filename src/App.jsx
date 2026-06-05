import React, { useState, useEffect } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,900;1,9..144,500&family=Karla:wght@400;500;700&display=swap');

.cm-root{ --cream:#F4EEE2; --paper:#FBF7EF; --ink:#2A2620; --muted:#6E6557; --green:#2F3D2E; --terra:#BF5B3C; --sage:#8A9A5B; --line:#E2D8C4;
  font-family:'Karla',sans-serif; background:var(--cream);
  background-image:radial-gradient(circle at 12% 0%,rgba(138,154,91,0.10),transparent 40%),radial-gradient(circle at 92% 6%,rgba(191,91,60,0.09),transparent 38%);
  color:var(--ink); min-height:100vh; box-sizing:border-box;
  padding:calc(env(safe-area-inset-top) + 18px) 0 0; -webkit-font-smoothing:antialiased; }
.cm-app{ max-width:620px; margin:0 auto; padding:0 16px calc(env(safe-area-inset-bottom) + 96px); }
@media(min-width:640px){ .cm-root{ padding-top:36px; } }

.cm-head h1{ font-family:'Fraunces',serif; font-weight:900; font-size:30px; line-height:1; color:var(--green); margin:0 0 9px; letter-spacing:-0.01em; }
.cm-head h1 em{ font-style:italic; font-weight:500; color:var(--terra); }
.cm-banner{ display:inline-flex; align-items:center; gap:7px; background:rgba(138,154,91,0.16); color:var(--green); border-radius:999px; padding:7px 14px; font-size:12px; font-weight:700; margin-bottom:16px; }

.cm-mini{ margin:0 0 8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-size:11px; color:var(--muted); }
.cm-seg{ display:flex; gap:6px; }
.cm-seg .cm-pill{ flex:1; text-align:center; padding:0 6px; }
.cm-pills{ display:flex; flex-wrap:wrap; gap:8px; }
.cm-pill{ border:1.5px solid var(--line); background:#fff; color:var(--ink); border-radius:13px; min-height:46px; display:inline-flex; align-items:center; justify-content:center; padding:0 16px; font-size:14px; font-weight:600; cursor:pointer; font-family:'Karla'; transition:all .14s; -webkit-tap-highlight-color:transparent; }
.cm-pill:active{ transform:scale(0.97); }
.cm-pill.on{ background:var(--terra); border-color:var(--terra); color:#fff; }

.cm-section{ margin-bottom:22px; animation:cm-fade .35s both; }
@keyframes cm-fade{ from{ opacity:0; transform:translateY(8px) } to{ opacity:1; transform:none } }
.cm-h2{ font-family:'Fraunces',serif; font-weight:900; font-size:23px; color:var(--green); margin:0 0 3px; }
.cm-p{ color:var(--muted); font-size:13.5px; margin:0 0 16px; line-height:1.45; }

.cm-card{ background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:18px; box-shadow:0 1px 0 rgba(0,0,0,0.02),0 16px 36px -28px rgba(47,61,46,0.35); }

.cm-res{ background:linear-gradient(150deg,var(--green),#26321f); color:var(--cream); border-radius:20px; padding:20px; margin:16px 0; min-height:120px; box-shadow:0 18px 44px -22px rgba(47,61,46,0.7); }
.cm-res .placeholder{ font-size:15px; color:rgba(244,238,226,0.6); font-style:italic; text-align:center; margin:24px 0; }
.cm-rescontent{ animation:cm-pop .4s both; }
@keyframes cm-pop{ from{ opacity:0; transform:translateY(6px) } to{ opacity:1; transform:none } }
.cm-restitle{ font-family:'Fraunces',serif; font-weight:600; font-size:19px; line-height:1.3; margin:0 0 14px; color:#fff; }
.cm-steps{ display:grid; gap:10px; }
.cm-step{ font-size:14px; line-height:1.5; color:rgba(244,238,226,0.92); }
.cm-step b{ color:#fff; font-weight:700; }

.cm-roll{ width:100%; border:none; border-radius:16px; min-height:58px; cursor:pointer; font-family:'Fraunces',serif; font-weight:600; font-size:19px; color:var(--cream); background:linear-gradient(135deg,var(--terra),#a4492e); box-shadow:0 14px 30px -12px rgba(191,91,60,0.6); transition:transform .12s; -webkit-tap-highlight-color:transparent; }
.cm-roll:active{ transform:scale(0.98); }
.cm-outline{ width:100%; border:1.5px solid var(--green); background:transparent; color:var(--green); border-radius:15px; min-height:52px; font-family:'Fraunces',serif; font-weight:600; font-size:16px; cursor:pointer; margin-top:12px; transition:all .14s; -webkit-tap-highlight-color:transparent; }
.cm-outline:active{ background:var(--green); color:var(--cream); }
.cm-hint{ font-size:12px; color:var(--muted); font-style:italic; margin:0 0 10px; }

.cm-day{ background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:13px 16px; margin-bottom:10px; }
.cm-day-h{ font-family:'Fraunces',serif; font-weight:600; font-size:16px; color:var(--terra); margin:0 0 6px; }
.cm-slot{ display:flex; gap:10px; padding:11px 0; border-top:1px solid var(--line); cursor:pointer; align-items:flex-start; -webkit-tap-highlight-color:transparent; }
.cm-slot:first-of-type{ border-top:none; }
.cm-slot .sl{ font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:var(--sage); min-width:68px; padding-top:2px; }
.cm-slot .sv{ font-size:14px; color:var(--ink); line-height:1.4; flex:1; }
.cm-slot .ch{ color:var(--muted); font-size:13px; padding-top:1px; }
.cm-prep{ padding:2px 0 10px 78px; }
.cm-prep .pl{ font-size:13px; line-height:1.5; color:var(--muted); padding:3px 0; }
.cm-prep .pl b{ color:var(--ink); font-weight:700; }

.cm-shop-cat-h{ font-family:'Fraunces',serif; font-weight:600; font-size:16px; color:var(--terra); margin:16px 0 2px; }
.cm-shop-cat-h:first-child{ margin-top:0; }
.cm-shop-item{ display:flex; align-items:center; gap:13px; padding:13px 0; border-bottom:1px dashed var(--line); cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-shop-box{ width:24px; height:24px; border:1.6px solid var(--sage); border-radius:7px; flex-shrink:0; display:grid; place-items:center; font-size:14px; color:#fff; transition:all .12s; }
.cm-shop-box.on{ background:var(--sage); }
.cm-shop-name{ flex:1; font-size:15px; }
.cm-shop-name.done{ text-decoration:line-through; color:var(--muted); }
.cm-shop-qty{ font-size:13px; color:var(--muted); font-weight:700; white-space:nowrap; }
.cm-tag{ display:inline-block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--terra); background:rgba(191,91,60,0.12); border-radius:6px; padding:2px 7px; margin-left:8px; }
.cm-frutas p.list{ font-size:15px; line-height:1.8; margin:0 0 4px; }

.cm-tabs{ position:fixed; left:0; right:0; bottom:0; z-index:50; background:rgba(251,247,239,0.94); backdrop-filter:saturate(1.4) blur(10px); -webkit-backdrop-filter:saturate(1.4) blur(10px); border-top:1px solid var(--line); padding-bottom:env(safe-area-inset-bottom); box-shadow:0 -8px 26px -16px rgba(47,61,46,0.4); }
.cm-tabs-inner{ max-width:620px; margin:0 auto; display:flex; }
.cm-tab{ flex:1; background:none; border:none; padding:9px 2px; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; color:var(--muted); font-family:'Karla'; font-size:11px; font-weight:700; min-height:60px; justify-content:center; transition:color .14s; -webkit-tap-highlight-color:transparent; }
.cm-tab .ic{ font-size:21px; line-height:1; }
.cm-tab.on{ color:var(--terra); }
.cm-tab.on .ic{ transform:translateY(-1px); }

.cm-foot{ text-align:center; font-size:11.5px; color:var(--muted); margin-top:24px; line-height:1.6; }
.cm-foot b{ color:var(--green); }
`;

const i = (n,p)=>({n,p});
const DB = {
  metabolismo: {
    desayunos:[
      i("Huevos revueltos con tomate y palta","Bate 2-3 huevos y cuécelos en mantequilla a fuego bajo. Añade tomate picado y sirve con palta en rodajas."),
      i("Tortilla de brócoli y queso","Saltea brócoli, vierte huevos batidos y queso, y cuaja a fuego medio tapado."),
      i("Huevos con tocino y manzana verde","Fríe el tocino, luego los huevos en su grasa. Acompaña con manzana verde en rodajas."),
      i("Yogur natural con fresas y nueces","Mezcla yogur natural con fresas en trozos y un puñado de nueces. Sin azúcar; un toque de miel si quieres."),
      i("Huevos fritos con palta y lechuga","Fríe los huevos en mantequilla y sírvelos sobre lechuga con palta."),
    ],
    proteinas:[
      i("Pollo a la plancha","Sazona con sal, ajo y limón. Cocina 5-6 min por lado a fuego medio hasta dorar."),
      i("Cerdo al horno","Sazona con sal y especias. Hornea a 180°C unos 35-40 min."),
      i("Carne de res a la plancha","Sal y pimienta. Sella 3-4 min por lado a fuego alto al punto que prefieras."),
      i("Atún","Escúrrelo y mézclalo con un chorrito de aceite de oliva y limón."),
      i("Huevos cocidos","Hierve 8-10 min, enfría en agua y pela."),
      i("Pollo al horno con limón","Adoba con limón, ajo y sal. Hornea a 190°C 35-40 min."),
    ],
    carbos:[
      i("Sweet potato al horno","Corta en cubos, un poco de aceite y sal. Hornea a 200°C 25-30 min."),
      i("Plátano verde hervido","Pélalo y hiérvelo 15-20 min hasta que esté tierno."),
      i("Arroz integral (1/3 del plato)","Cuece 1 parte de arroz por 2 de agua, 35-40 min."),
    ],
    vegetales:[
      i("Ensalada de lechuga y tomate","Trocea lechuga y tomate. Aliña con aceite de oliva, limón y sal."),
      i("Brócoli al vapor","Cuece al vapor 5-7 min hasta que esté verde y tierno."),
      i("Zapallo italiano salteado","Corta en rodajas y saltea 4-5 min con aceite y sal."),
      i("Pimentón asado","Ásalo en tiras a fuego alto hasta que se ablande."),
      i("Ensalada de pepino","Corta en rodajas y aliña con limón, sal y aceite de oliva."),
    ],
    grasas:[
      i("Palta","En rodajas o cubos, con un toque de sal y limón."),
      i("Aceite de oliva","Un chorrito en crudo sobre el plato al servir."),
      i("Queso","En cubos o lonjas para acompañar."),
      i("Puñado de almendras","Un puñado al natural, sin sal añadida."),
      i("Mantequilla","Una cucharadita para cocinar o sobre las verduras."),
    ],
    snacks:[
      i("Manzana verde","En rodajas, sola."),
      i("Puñado de almendras","Un puñado al natural."),
      i("Huevo duro","Hervido 8-10 min, con una pizca de sal."),
      i("Queso con nueces","Unos cubos de queso con un puñado de nueces."),
      i("Fresas con yogur natural","Fresas en trozos con yogur natural, sin azúcar."),
    ],
  },
  animal: {
    desayunos:[
      i("Huevos con tocino","Fríe tocino crujiente y los huevos al gusto en la misma sartén."),
      i("Huevos revueltos en mantequilla","Bate y cuécelos a fuego bajo en mantequilla, removiendo."),
      i("Tortilla con queso","Huevos batidos con queso, cuaja a fuego medio."),
      i("Cerdo con huevos","Saltea cerdo en trozos y añade huevos hasta cuajar."),
      i("Huevos fritos con palta","Fríe en mantequilla y sirve con palta en rodajas."),
    ],
    proteinas:[
      i("Carne de res","Sella a fuego alto con sal, 3-4 min por lado."),
      i("Cerdo al horno","Sal y especias. Hornea a 180°C 35-40 min."),
      i("Pollo con piel","Hornea con piel a 200°C 35 min hasta dorar y crujir."),
      i("Atún","Con un chorrito de aceite de oliva y limón."),
      i("Huevos","Al gusto: revueltos, fritos o cocidos."),
      i("Tocino con huevos","Fríe el tocino y cuece los huevos en su grasa."),
    ],
    carbos:[
      i("Manzana verde","En rodajas, fresca."),
      i("Fresas","Lavadas, al natural."),
      i("Sweet potato (poca cantidad)","Cubos pequeños al horno, 200°C 20 min."),
    ],
    vegetales:[
      i("Brócoli con mantequilla","Al vapor y luego salteado con una nuez de mantequilla."),
      i("Lechuga con aceite de oliva","Trocea y aliña con aceite de oliva y sal."),
      i("Zapallo italiano salteado","En rodajas, salteado en mantequilla 4-5 min."),
    ],
    grasas:[
      i("Mantequilla","Para cocinar o derretir sobre la carne."),
      i("Palta","En rodajas con sal."),
      i("Queso","En lonjas o cubos."),
      i("Aceite de oliva","Un chorrito en crudo."),
      i("Tocino","Frito hasta crujir, como acento."),
    ],
    snacks:[
      i("Huevo duro","Hervido 8-10 min con una pizca de sal."),
      i("Queso","Unos cubos."),
      i("Tocino","Un par de lonjas crujientes."),
      i("Puñado de nueces","Al natural."),
      i("Fresas","Lavadas, solas."),
    ],
  },
  balanceado: {
    desayunos:[
      i("Avena con fresas y nueces","Cuece avena en agua o leche. Añade fresas y nueces. Sin azúcar; endulza con un poco de miel si quieres."),
      i("Huevos con palta y tomate","Huevos al gusto con palta en rodajas y tomate."),
      i("Yogur natural con arándanos","Yogur natural con arándanos frescos. Un toque de miel opcional."),
      i("Tortilla de vegetales","Huevos batidos con vegetales picados, cuaja en sartén."),
      i("Huevos con lentejas y palta","Huevos al gusto con lentejas cocidas y palta."),
    ],
    proteinas:[
      i("Pollo a la plancha","Sazona con sal y limón. 5-6 min por lado a fuego medio."),
      i("Cerdo magro","A la plancha con sal y especias, 5 min por lado."),
      i("Carne de res","Sella con sal y pimienta, 3-4 min por lado."),
      i("Atún","Con aceite de oliva y limón."),
      i("Huevos","Al gusto."),
      i("Lentejas","Cuece con cebolla y ajo 25-30 min hasta tiernas."),
    ],
    carbos:[
      i("Arroz integral","1 parte de arroz por 2 de agua, 35-40 min."),
      i("Sweet potato","En cubos al horno, 200°C 25-30 min."),
      i("Lentejas","Cocidas con cebolla y ajo."),
      i("Avena","Cocida en agua, sin azúcar."),
      i("Plátano verde","Hervido 15-20 min."),
    ],
    vegetales:[
      i("Ensalada mixta","Lechuga, tomate y pepino. Aliña con aceite de oliva y limón."),
      i("Brócoli al vapor","Al vapor 5-7 min."),
      i("Zapallo italiano","En rodajas, salteado con aceite y sal."),
      i("Pimentón","Asado o salteado en tiras."),
      i("Zanahoria","Cruda en bastones o al vapor."),
    ],
    grasas:[
      i("Palta","En rodajas con sal y limón."),
      i("Aceite de oliva","Un chorrito en crudo."),
      i("Frutos secos","Un puñado al natural."),
      i("Queso","En cubos o lonjas."),
      i("Mantequilla","Una cucharadita para cocinar."),
    ],
    snacks:[
      i("Manzana verde","En rodajas, sola."),
      i("Yogur natural","Solo o con fresas."),
      i("Puñado de almendras","Al natural."),
      i("Huevo duro","Con una pizca de sal."),
      i("Zanahoria con palta","Bastones de zanahoria con palta para untar."),
    ],
  },
};

const FRUTAS = {
  buenas:["Manzana verde","Fresa","Arándanos","Kiwi","Naranja","Mandarina","Pera"],
  moderar:["Cambur (plátano)","Uvas verdes","Uvas rojas"],
};

const SHOPPING = [
  {cat:"Proteínas", item:"Pollo", base:3, unit:"kg"},
  {cat:"Proteínas", item:"Cerdo", base:1.5, unit:"kg"},
  {cat:"Proteínas", item:"Carne de res", base:1.5, unit:"kg"},
  {cat:"Proteínas", item:"Atún en lata", base:8, unit:"latas"},
  {cat:"Proteínas", item:"Tocino", base:0.5, unit:"kg"},
  {cat:"Proteínas", item:"Huevos", base:30, unit:"unid."},
  {cat:"Frutas", item:"Manzana verde", base:12, unit:"unid."},
  {cat:"Frutas", item:"Fresa", base:1, unit:"kg"},
  {cat:"Frutas", item:"Arándanos", base:0.5, unit:"kg"},
  {cat:"Frutas", item:"Naranja / mandarina", base:12, unit:"unid."},
  {cat:"Frutas", item:"Cambur (moderar)", base:8, unit:"unid."},
  {cat:"Frutas", item:"Uvas (moderar)", base:1, unit:"kg"},
  {cat:"Vegetales", item:"Lechuga", base:4, unit:"unid."},
  {cat:"Vegetales", item:"Brócoli", base:4, unit:"unid."},
  {cat:"Vegetales", item:"Tomate", base:2, unit:"kg"},
  {cat:"Vegetales", item:"Cebolla", base:1.5, unit:"kg"},
  {cat:"Vegetales", item:"Zapallo italiano", base:6, unit:"unid."},
  {cat:"Vegetales", item:"Pimentón", base:6, unit:"unid."},
  {cat:"Grasas y otros", item:"Palta", base:8, unit:"unid."},
  {cat:"Grasas y otros", item:"Mantequilla", base:0.5, unit:"kg"},
  {cat:"Grasas y otros", item:"Aceite de oliva", base:1, unit:"botella"},
  {cat:"Grasas y otros", item:"Queso", base:1, unit:"kg"},
  {cat:"Grasas y otros", item:"Almendras / nueces", base:0.5, unit:"kg"},
  {cat:"Grasas y otros", item:"Miel (único endulzante)", base:1, unit:"frasco"},
  {cat:"Carbohidratos", item:"Sweet potato", base:2, unit:"kg"},
  {cat:"Carbohidratos", item:"Avena", base:1, unit:"kg"},
  {cat:"Carbohidratos", item:"Arroz integral", base:1, unit:"kg"},
  {cat:"Carbohidratos", item:"Lentejas", base:0.5, unit:"kg"},
];

const APPROACHES = [["metabolismo","3x1"],["animal","Animal"],["balanceado","Balanceado"]];
const MEALS = ["Desayuno","Almuerzo","Cena","Snack"];
const PEOPLE = [["1",1],["2",2],["3",3],["4+",4]];
const DAYS = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];

const rnd = a => a[Math.floor(Math.random()*a.length)];
function suggest(approach, type){
  const d = DB[approach];
  if(type==="Desayuno"){ const x=rnd(d.desayunos); return {titulo:x.n, pasos:[x]}; }
  if(type==="Snack"){ const x=rnd(d.snacks); return {titulo:x.n, pasos:[x]}; }
  const items=[rnd(d.proteinas)];
  if(d.carbos && d.carbos.length) items.push(rnd(d.carbos));
  items.push(rnd(d.vegetales), rnd(d.grasas));
  return {titulo: items.map(x=>x.n).join("  ·  "), pasos: items};
}
function shuffle(a){ const x=[...a]; for(let k=x.length-1;k>0;k--){ const j=Math.floor(Math.random()*(k+1)); [x[k],x[j]]=[x[j],x[k]]; } return x; }
const pick=(arr,k)=>(arr&&arr.length)?arr[k%arr.length]:null;
function buildWeek(approach){
  const d=DB[approach];
  const P=shuffle(d.proteinas),C=shuffle(d.carbos),V=shuffle(d.vegetales),F=shuffle(d.grasas),B=shuffle(d.desayunos);
  return DAYS.map((day,k)=>({ dia:day, desayuno:pick(B,k),
    almuerzo:[pick(P,k),pick(C,k),pick(V,k),pick(F,k)].filter(Boolean),
    cena:[pick(P,k+2),pick(C,k+1),pick(V,k+3),pick(F,k+1)].filter(Boolean) }));
}
const names = arr => arr.map(x=>x.n).join("  ·  ");
function fmtQty(base,n,unit){ const v=base*n; const s=Number.isInteger(v)?v:v.toFixed(1); return `${s} ${unit}`; }

export default function App(){
  const [tab,setTab]=useState("ahora");
  const [approach,setApproach]=useState("metabolismo");
  const [people,setPeople]=useState(2);
  const [meal,setMeal]=useState("Almuerzo");
  const [res,setRes]=useState(null);
  const [week,setWeek]=useState(null);
  const [open,setOpen]=useState({});
  const [checked,setChecked]=useState({});

  useEffect(()=>{ const l=document.createElement("style"); l.textContent=STYLES; document.head.appendChild(l); return ()=>document.head.removeChild(l); },[]);

  const roll=()=>{ let s=suggest(approach,meal); if(res && s.titulo===res.titulo) s=suggest(approach,meal); setRes(s); };
  const toggle=(key)=>setOpen({...open,[key]:!open[key]});
  const cats=[...new Set(SHOPPING.map(s=>s.cat))];

  const Slot = ({dk,slot,label,prepItems})=>{ const key=dk+slot; const isOpen=!!open[key]; return (
    <>
      <div className="cm-slot" onClick={()=>toggle(key)}>
        <span className="sl">{label}</span>
        <span className="sv">{slot==="d"?prepItems[0].n:names(prepItems)}</span>
        <span className="ch">{isOpen?"▾":"▸"}</span>
      </div>
      {isOpen && <div className="cm-prep">{prepItems.map((it,ii)=>(<p key={ii} className="pl"><b>{it.n}:</b> {it.p}</p>))}</div>}
    </>
  ); };

  return (
    <div className="cm-root"><div className="cm-app">
      <div className="cm-head">
        <h1>¿Qué <em>comemos</em>?</h1>
        <div className="cm-banner">🍯 Sin azúcar añadida · solo lo natural</div>
        <p className="cm-mini">Enfoque</p>
        <div className="cm-seg">
          {APPROACHES.map(([id,lab])=>(<button key={id} className={"cm-pill"+(approach===id?" on":"")} onClick={()=>{ setApproach(id); setWeek(null); setRes(null); }}>{lab}</button>))}
        </div>
      </div>

      {tab==="ahora" && (
        <div className="cm-section" style={{marginTop:20}}>
          <h2 className="cm-h2">¿Qué comemos ahora?</h2>
          <p className="cm-p">Elige el momento y toca para una idea, con su preparación.</p>
          <p className="cm-mini">Momento</p>
          <div className="cm-pills">{MEALS.map(m=>(<button key={m} className={"cm-pill"+(meal===m?" on":"")} onClick={()=>{ setMeal(m); setRes(null); }}>{m}</button>))}</div>
          <div className="cm-res">{res ? (
            <div className="cm-rescontent" key={res.titulo}>
              <p className="cm-restitle">{res.titulo}</p>
              <div className="cm-steps">{res.pasos.map((s,k)=>(<div key={k} className="cm-step"><b>{s.n}:</b> {s.p}</div>))}</div>
            </div>
          ) : <p className="placeholder">Toca el botón para una sugerencia con su preparación…</p>}</div>
          <button className="cm-roll" onClick={roll}>🍽 {res?"Otra sugerencia":"Sugerir "+meal.toLowerCase()}</button>
        </div>
      )}

      {tab==="semana" && (
        <div className="cm-section" style={{marginTop:20}}>
          <h2 className="cm-h2">Tu semana rotada</h2>
          <p className="cm-p">7 días combinados sin repetir, desde la misma base.</p>
          {!week && <button className="cm-roll" onClick={()=>{ setWeek(buildWeek(approach)); setOpen({}); }}>📅 Generar la semana</button>}
          {week && (<>
            <p className="cm-hint">Toca cualquier comida para ver cómo se prepara.</p>
            {week.map((d,k)=>(<div key={k} className="cm-day"><p className="cm-day-h">{d.dia}</p>
              <Slot dk={k} slot="d" label="Desayuno" prepItems={[d.desayuno]} />
              <Slot dk={k} slot="a" label="Almuerzo" prepItems={d.almuerzo} />
              <Slot dk={k} slot="c" label="Cena" prepItems={d.cena} />
            </div>))}
            <button className="cm-outline" onClick={()=>{ setWeek(buildWeek(approach)); setOpen({}); }}>↻ Mezclar otra vez</button>
          </>)}
        </div>
      )}

      {tab==="compras" && (
        <div className="cm-section" style={{marginTop:20}}>
          <h2 className="cm-h2">Lista de compras</h2>
          <p className="cm-p">Cantidades del mes — tócalas para tacharlas.</p>
          <p className="cm-mini">¿Para cuántas personas?</p>
          <div className="cm-seg" style={{marginBottom:16}}>
            {PEOPLE.map(([lab,n])=>(<button key={n} className={"cm-pill"+(people===n?" on":"")} onClick={()=>setPeople(n)}>{lab}</button>))}
          </div>
          <div className="cm-card">
            {cats.map(cat=>(<div key={cat}>
              <p className="cm-shop-cat-h">{cat}</p>
              {SHOPPING.filter(s=>s.cat===cat).map((s,k)=>{ const key=cat+k; const on=!!checked[key]; const mod=s.item.includes("moderar"); return (
                <div key={k} className="cm-shop-item" onClick={()=>setChecked({...checked,[key]:!on})}>
                  <span className={"cm-shop-box"+(on?" on":"")}>{on?"✓":""}</span>
                  <span className={"cm-shop-name"+(on?" done":"")}>{s.item.replace(" (moderar)","")}{mod && <span className="cm-tag">moderar</span>}</span>
                  <span className="cm-shop-qty">{fmtQty(s.base,people,s.unit)}</span>
                </div>); })}
            </div>))}
          </div>
          <h2 className="cm-h2" style={{marginTop:26}}>Guía de frutas</h2>
          <p className="cm-p">El único dulce permitido es el natural.</p>
          <div className="cm-card cm-frutas">
            <p className="cm-shop-cat-h" style={{marginTop:0}}>Con libertad (poco azúcar)</p>
            <p className="list">{FRUTAS.buenas.join("  ·  ")}</p>
            <p className="cm-shop-cat-h">Con moderación (más dulces)</p>
            <p className="list" style={{color:"var(--muted)"}}>{FRUTAS.moderar.join("  ·  ")}</p>
          </div>
          <p className="cm-foot"><b>Funciona sola</b>, sin internet ni costo. Para usarla sincronizada entre dos teléfonos, el siguiente paso es Netlify Blobs.<br/><br/>Solo educativa; no reemplaza a un médico o nutricionista.</p>
        </div>
      )}

      <nav className="cm-tabs"><div className="cm-tabs-inner">
        <button className={"cm-tab"+(tab==="ahora"?" on":"")} onClick={()=>setTab("ahora")}><span className="ic">🍽</span>Ahora</button>
        <button className={"cm-tab"+(tab==="semana"?" on":"")} onClick={()=>setTab("semana")}><span className="ic">📅</span>Semana</button>
        <button className={"cm-tab"+(tab==="compras"?" on":"")} onClick={()=>setTab("compras")}><span className="ic">🛒</span>Compras</button>
      </div></nav>
    </div></div>
  );
}
