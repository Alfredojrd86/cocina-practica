export const STYLES = `
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
.cm-tag.nuevo{ color:var(--sage); background:rgba(138,154,91,0.16); }
.cm-frutas p.list{ font-size:15px; line-height:1.8; margin:0 0 4px; }

.cm-tabs{ position:fixed; left:0; right:0; bottom:0; z-index:50; background:rgba(251,247,239,0.94); backdrop-filter:saturate(1.4) blur(10px); -webkit-backdrop-filter:saturate(1.4) blur(10px); border-top:1px solid var(--line); padding-bottom:env(safe-area-inset-bottom); box-shadow:0 -8px 26px -16px rgba(47,61,46,0.4); }
.cm-tabs-inner{ max-width:620px; margin:0 auto; display:flex; }
.cm-tab{ position:relative; flex:1; background:none; border:none; padding:9px 2px 7px; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; color:var(--muted); font-family:'Karla'; font-size:11px; font-weight:700; min-height:60px; justify-content:center; transition:color .16s; -webkit-tap-highlight-color:transparent; }
.cm-tab .ic{ font-size:20px; line-height:1; display:grid; place-items:center; width:46px; height:30px; border-radius:999px; transition:background .2s, transform .18s cubic-bezier(.2,1.2,.4,1); }
.cm-tab.on{ color:var(--terra); }
.cm-tab.on .ic{ background:rgba(191,91,60,0.15); transform:translateY(-1px) scale(1.06); }
.cm-tab:active .ic{ transform:scale(.92); }
/* indicador superior deslizante */
.cm-tab::after{ content:""; position:absolute; top:0; left:50%; width:24px; height:3px; border-radius:0 0 3px 3px; background:var(--terra); transform:translateX(-50%) scaleX(0); transform-origin:center; transition:transform .22s cubic-bezier(.2,1,.4,1); }
.cm-tab.on::after{ transform:translateX(-50%) scaleX(1); }

.cm-foot{ text-align:center; font-size:11.5px; color:var(--muted); margin-top:24px; line-height:1.6; }
.cm-foot b{ color:var(--green); }

/* Toggle "Rápida" */
.cm-toggle{ display:flex; align-items:center; gap:10px; margin:4px 0 14px; cursor:pointer; -webkit-tap-highlight-color:transparent; user-select:none; }
.cm-switch{ width:44px; height:26px; border-radius:999px; background:var(--line); position:relative; transition:background .16s; flex-shrink:0; }
.cm-switch.on{ background:var(--sage); }
.cm-switch::after{ content:""; position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#fff; box-shadow:0 1px 3px rgba(0,0,0,0.25); transition:transform .16s; }
.cm-switch.on::after{ transform:translateX(18px); }
.cm-toggle .lbl{ font-size:14px; font-weight:600; color:var(--ink); }
.cm-toggle .sub{ font-size:12px; color:var(--muted); }

/* Tarjetas de sugerencia (3) */
.cm-cards{ display:grid; gap:12px; margin:16px 0; }
.cm-sug{ background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:15px 16px; cursor:pointer; transition:border-color .14s, transform .12s; animation:cm-pop .35s both; -webkit-tap-highlight-color:transparent; }
.cm-sug:active{ transform:scale(0.995); }
.cm-sug.open{ border-color:var(--sage); }
.cm-sug-top{ display:flex; align-items:flex-start; gap:10px; }
.cm-sug-title{ font-family:'Fraunces',serif; font-weight:600; font-size:16.5px; line-height:1.3; color:var(--green); flex:1; }
.cm-fav{ border:none; background:none; font-size:21px; line-height:1; cursor:pointer; padding:0; flex-shrink:0; -webkit-tap-highlight-color:transparent; filter:grayscale(1) opacity(0.45); transition:filter .14s, transform .12s; }
.cm-fav.on{ filter:none; }
.cm-fav:active{ transform:scale(1.2); }
.cm-badges{ display:flex; flex-wrap:wrap; gap:6px; margin-top:10px; }
.cm-badge{ display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; border-radius:999px; padding:3px 9px; }
.cm-badge .dot{ width:7px; height:7px; border-radius:50%; }
.cm-consejo{ font-size:12.5px; color:var(--muted); line-height:1.45; margin-top:10px; padding-top:10px; border-top:1px dashed var(--line); }
.cm-consejo b{ color:var(--ink); }
.cm-sug-steps{ margin-top:12px; padding-top:12px; border-top:1px solid var(--line); display:grid; gap:9px; animation:cm-fade .25s both; }
.cm-sug-steps .st{ font-size:13.5px; line-height:1.5; color:var(--ink); }
.cm-sug-steps .st b{ color:var(--green); font-weight:700; }
.cm-sug-hint{ font-size:11px; color:var(--muted); font-style:italic; margin-top:8px; }
.cm-cooked{ width:100%; margin-top:12px; border:1.5px solid var(--sage); background:rgba(138,154,91,0.10); color:var(--green); border-radius:12px; min-height:44px; font-family:'Karla'; font-weight:700; font-size:13.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:transform .12s; }
.cm-cooked:active{ transform:scale(.98); background:rgba(138,154,91,0.18); }

/* Skeleton de carga IA */
.cm-skel{ background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:16px; }
.cm-skel-line{ height:13px; border-radius:7px; background:linear-gradient(90deg,var(--line) 25%,#efe7d6 37%,var(--line) 63%); background-size:400% 100%; animation:cm-shimmer 1.3s infinite; margin-bottom:10px; }
.cm-skel-line.w70{ width:70%; } .cm-skel-line.w45{ width:45%; } .cm-skel-line.w90{ width:90%; }
@keyframes cm-shimmer{ 0%{ background-position:100% 0 } 100%{ background-position:0 0 } }

/* Favoritos */
.cm-empty{ text-align:center; color:var(--muted); font-style:italic; padding:36px 16px; font-size:14px; }
.cm-fav-row{ display:flex; align-items:center; gap:10px; }
.cm-fav-meta{ font-size:11px; color:var(--sage); font-weight:700; text-transform:uppercase; letter-spacing:0.04em; margin-top:4px; }

/* Panel de auth (sync) */
.cm-auth{ background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:14px 16px; margin-bottom:16px; }
.cm-auth-row{ display:flex; gap:8px; align-items:center; }
.cm-input{ flex:1; min-height:44px; border:1.5px solid var(--line); border-radius:12px; padding:0 14px; font-family:'Karla'; font-size:14px; color:var(--ink); background:#fff; }
.cm-input:focus{ outline:none; border-color:var(--sage); }
.cm-auth-send{ border:none; background:var(--green); color:var(--cream); border-radius:12px; min-height:44px; padding:0 16px; font-family:'Karla'; font-weight:700; font-size:14px; cursor:pointer; white-space:nowrap; -webkit-tap-highlight-color:transparent; }
.cm-auth-send:active{ transform:scale(0.97); }
.cm-auth-send:disabled{ background:var(--muted); opacity:0.7; cursor:default; }
.cm-google{ width:100%; display:flex; align-items:center; justify-content:center; gap:10px; min-height:48px; border:1.5px solid var(--line); background:#fff; color:#3c4043; border-radius:12px; font-family:'Karla'; font-weight:700; font-size:14.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:transform .12s, box-shadow .14s; }
.cm-google:active{ transform:scale(.98); }
.cm-google svg{ flex-shrink:0; }
.cm-divider{ display:flex; align-items:center; gap:10px; margin:12px 0; }
.cm-divider::before, .cm-divider::after{ content:""; flex:1; height:1px; background:var(--line); }
.cm-divider span{ font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
.cm-auth-mail{ flex:1; font-size:13.5px; font-weight:600; color:var(--green); }
.cm-auth-out{ border:1.5px solid var(--line); background:#fff; color:var(--muted); border-radius:12px; min-height:40px; padding:0 14px; font-family:'Karla'; font-weight:700; font-size:13px; cursor:pointer; -webkit-tap-highlight-color:transparent; }

/* Toast de feedback (guardar/quitar favorito) */
.cm-toast{ position:fixed; left:50%; bottom:calc(env(safe-area-inset-bottom) + 80px); transform:translateX(-50%); z-index:60; display:inline-flex; align-items:center; gap:8px; background:var(--green); color:var(--cream); padding:12px 20px; border-radius:999px; font-size:13.5px; font-weight:700; box-shadow:0 14px 34px -12px rgba(47,61,46,0.8); animation:cm-toast-in .26s cubic-bezier(.2,1.2,.4,1) both; max-width:88%; text-align:center; pointer-events:none; }
.cm-toast.rm{ background:var(--terra); box-shadow:0 14px 34px -12px rgba(191,91,60,0.7); }
@keyframes cm-toast-in{ from{ opacity:0; transform:translate(-50%,16px) scale(.92) } to{ opacity:1; transform:translate(-50%,0) scale(1) } }

/* Pop de la estrella al marcar favorito */
@keyframes cm-star-pop{ 0%{ transform:scale(1) } 40%{ transform:scale(1.35) } 70%{ transform:scale(.9) } 100%{ transform:scale(1) } }
.cm-fav.on{ animation:cm-star-pop .34s ease; }

.cm-toast-btn{ border:none; background:rgba(255,255,255,0.22); color:#fff; border-radius:999px; padding:6px 12px; font-family:'Karla'; font-weight:700; font-size:12.5px; cursor:pointer; pointer-events:auto; white-space:nowrap; -webkit-tap-highlight-color:transparent; }
.cm-toast-btn:active{ transform:scale(.95); }

/* Nudge para registrar correo */
.cm-nudge{ display:block; width:100%; text-align:left; border:1px dashed var(--sage); background:rgba(138,154,91,0.10); color:var(--green); border-radius:13px; padding:11px 14px; font-family:'Karla'; font-size:12.5px; line-height:1.45; cursor:pointer; margin:8px 0 4px; -webkit-tap-highlight-color:transparent; }
.cm-nudge b{ color:var(--terra); }
.cm-nudge:active{ transform:scale(.99); }

/* Despensa */
.cm-pantry-actions{ margin-bottom:14px; }
.cm-pantry-item{ display:flex; align-items:center; justify-content:space-between; gap:12px; padding:13px 0; border-bottom:1px dashed var(--line); cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-pantry-item{ flex-wrap:wrap; }
.cm-pantry-name{ font-size:14.5px; color:var(--ink); flex:1; min-width:120px; }
.cm-pantry-cond{ font-size:9.5px; font-weight:700; text-transform:uppercase; letter-spacing:0.03em; color:var(--muted); background:var(--cream); border:1px solid var(--line); border-radius:5px; padding:1px 5px; margin-left:7px; }
.cm-qty{ display:inline-flex; align-items:center; gap:8px; }
.cm-qty-btn{ width:30px; height:30px; border:1.5px solid var(--line); background:#fff; color:var(--green); border-radius:9px; font-size:18px; line-height:1; font-weight:700; cursor:pointer; display:grid; place-items:center; -webkit-tap-highlight-color:transparent; }
.cm-qty-btn:active{ transform:scale(.92); background:var(--cream); }
.cm-qty-val{ min-width:64px; text-align:center; font-size:13.5px; font-weight:700; color:var(--ink); }
.cm-qty-val i{ font-style:normal; font-weight:500; color:var(--muted); font-size:12px; }
.cm-pantry-badge{ display:inline-flex; align-items:center; gap:6px; font-size:11.5px; font-weight:700; border-radius:999px; padding:5px 11px; min-width:74px; justify-content:center; transition:background .14s, color .14s; }
.cm-pantry-badge .dot{ width:7px; height:7px; border-radius:50%; }

/* Fila tienes/falta en cards */
.cm-pantry-match{ margin-top:10px; padding-top:10px; border-top:1px dashed var(--line); display:grid; gap:5px; }
.cm-pantry-match .pm-line{ margin:0; font-size:12.5px; line-height:1.45; color:var(--ink); }
.cm-pantry-match .pm-tag{ display:inline-block; font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:0.03em; border-radius:6px; padding:2px 7px; margin-right:6px; }
.cm-pantry-match .pm-tag.have{ color:#2F7D32; background:rgba(47,125,50,0.13); }
.cm-pantry-match .pm-tag.miss{ color:var(--terra); background:rgba(191,91,60,0.13); }

/* 5 tabs: ajuste de espacio */
.cm-tab{ font-size:10px; }
.cm-tab .ic{ width:42px; }

/* Quitar/agregar en compras */
.cm-row-x{ border:none; background:none; color:var(--muted); font-size:14px; cursor:pointer; padding:4px 6px; border-radius:8px; line-height:1; -webkit-tap-highlight-color:transparent; }
.cm-row-x:active{ background:rgba(191,91,60,0.12); color:var(--terra); }
.cm-add{ display:flex; gap:8px; align-items:center; margin-top:16px; padding-top:14px; border-top:1px solid var(--line); }
.cm-add .cm-input{ flex:1; min-height:42px; }
.cm-add-unit{ min-height:42px; border:1.5px solid var(--line); border-radius:11px; background:#fff; font-family:'Karla'; font-size:13px; color:var(--ink); padding:0 8px; }
.cm-add-btn{ width:42px; height:42px; border:none; background:var(--green); color:var(--cream); border-radius:11px; font-size:22px; line-height:1; cursor:pointer; flex-shrink:0; -webkit-tap-highlight-color:transparent; }
.cm-add-btn:active{ transform:scale(.94); }
.cm-link{ border:none; background:none; color:var(--terra); font-family:'Karla'; font-weight:700; font-size:13px; cursor:pointer; text-decoration:underline; padding:4px 0; }
.cm-hidden-list{ display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.cm-chip-restore{ border:1.5px dashed var(--sage); background:rgba(138,154,91,0.10); color:var(--green); border-radius:999px; padding:6px 12px; font-family:'Karla'; font-weight:700; font-size:12.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-chip-restore:active{ transform:scale(.96); }
`;
