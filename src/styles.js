import { rootVars } from "./theme.js";

export const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,900;1,9..144,500&family=Karla:wght@400;500;700&family=Caveat:wght@500;700&family=Courier+Prime:wght@400;700&display=swap');
${rootVars}

.cm-root{
  font-family:var(--font-body); color:var(--ink); min-height:100vh; box-sizing:border-box;
  padding:calc(env(safe-area-inset-top) + 18px) 0 0; -webkit-font-smoothing:antialiased;
  background-color:var(--cream);
  background-image:
    radial-gradient(ellipse at 50% 35%, transparent 52%, rgba(58,45,30,0.14) 100%),
    repeating-linear-gradient(180deg, transparent 0 31px, rgba(58,45,30,0.05) 31px 32px),
    radial-gradient(circle at 15% 0%, rgba(86,106,44,0.10), transparent 42%),
    radial-gradient(circle at 88% 8%, rgba(164,56,42,0.09), transparent 40%),
    var(--paper-noise);
  background-attachment:fixed;
}
.cm-app{ max-width:620px; margin:0 auto; padding:0 16px calc(env(safe-area-inset-bottom) + 96px); }
@media(min-width:640px){ .cm-root{ padding-top:36px; } }

/* Barra superior compacta */
.cm-topbar{ display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:18px; }
.cm-brand{ font-family:var(--font-serif); font-weight:900; font-size:20px; color:var(--green); cursor:pointer; line-height:1; }
.cm-brand em{ font-style:italic; font-weight:500; color:var(--terra); }
.cm-enfchip{ display:inline-flex; align-items:center; gap:6px; background:#fff; border:1.5px solid var(--line); border-radius:999px; padding:7px 13px; font-family:var(--font-body); font-weight:700; font-size:13px; color:var(--green); cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-enfchip .e{ font-size:15px; }
.cm-enfchip .cv{ color:var(--muted); font-size:11px; }

/* Bottom sheet (selector de enfoque) */
.cm-sheet{ position:fixed; inset:0; z-index:85; background:rgba(42,38,32,0.4); display:flex; align-items:flex-end; justify-content:center; animation:cm-fade .2s both; }
.cm-sheet-card{ width:100%; max-width:620px; background:var(--cream); border-radius:22px 22px 0 0; padding:20px 16px calc(env(safe-area-inset-bottom) + 20px); display:grid; gap:10px; animation:cm-sheet-up .26s cubic-bezier(.2,1,.4,1) both; }
@keyframes cm-sheet-up{ from{ transform:translateY(100%) } to{ transform:none } }

/* Opciones plegables en Ahora */
.cm-opts-toggle{ border:none; background:none; color:var(--muted); font-family:var(--font-body); font-weight:700; font-size:13px; cursor:pointer; padding:14px 0 6px; -webkit-tap-highlight-color:transparent; }
.cm-opts{ display:grid; gap:10px; padding:4px 0 6px; animation:cm-fade .2s both; }
.cm-opts .cm-toggle{ margin:0; }
.cm-opts .lbl{ font-size:14px; font-weight:600; color:var(--ink); }

/* Puntitos de tipo en card plegada */
.cm-dots{ display:flex; align-items:center; gap:6px; margin-top:10px; }
.cm-dot{ width:9px; height:9px; border-radius:50%; }
.cm-dots-hint{ margin-left:auto; font-size:11px; color:var(--muted); font-style:italic; }

.cm-head h1{ font-family:var(--font-serif); font-weight:900; font-size:30px; line-height:1; color:var(--green); margin:0 0 9px; letter-spacing:-0.01em; }
.cm-head h1 em{ font-style:italic; font-weight:500; color:var(--terra); }
.cm-banner{ display:inline-flex; align-items:center; gap:7px; background:rgba(138,154,91,0.16); color:var(--green); border-radius:999px; padding:7px 14px; font-size:12px; font-weight:700; margin-bottom:16px; }

.cm-mini{ margin:0 0 8px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; font-size:11px; color:var(--muted); }
.cm-seg{ display:flex; gap:6px; }
.cm-seg .cm-pill{ flex:1; text-align:center; padding:0 6px; }
.cm-pills{ display:flex; flex-wrap:wrap; gap:8px; }
.cm-pill{ border:1.5px solid var(--line); background:#fff; color:var(--ink); border-radius:13px; min-height:46px; display:inline-flex; align-items:center; justify-content:center; padding:0 16px; font-size:14px; font-weight:600; cursor:pointer; font-family:var(--font-body); transition:all .14s; -webkit-tap-highlight-color:transparent; }
.cm-pill:active{ transform:scale(0.97); }
.cm-pill.on{ background:var(--terra); border-color:var(--terra); color:#fff; }

.cm-section{ margin-bottom:22px; animation:cm-fade .35s both; }
@keyframes cm-fade{ from{ opacity:0; transform:translateY(8px) } to{ opacity:1; transform:none } }
.cm-h2{ font-family:var(--font-serif); font-weight:900; font-size:23px; color:var(--green); margin:0 0 3px; }
.cm-p{ color:var(--muted); font-size:13.5px; margin:0 0 16px; line-height:1.45; font-style:italic; }

.cm-card{ background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:18px; box-shadow:0 1px 0 rgba(0,0,0,0.02),0 16px 36px -28px rgba(47,61,46,0.35); }

.cm-res{ background:var(--paper); border:1.5px dashed var(--line); color:var(--ink); border-radius:var(--radius-sm); padding:20px; margin:16px 0; min-height:110px; display:grid; place-items:center; box-shadow:var(--shadow-card); }
.cm-res .placeholder{ font-size:14.5px; color:var(--muted); font-style:italic; text-align:center; margin:0; }
.cm-rescontent{ animation:cm-pop .4s both; }
@keyframes cm-pop{ from{ opacity:0; transform:translateY(6px) } to{ opacity:1; transform:none } }
.cm-restitle{ font-family:var(--font-serif); font-weight:600; font-size:19px; line-height:1.3; margin:0 0 14px; color:#fff; }
.cm-steps{ display:grid; gap:10px; }
.cm-step{ font-size:14px; line-height:1.5; color:rgba(244,238,226,0.92); }
.cm-step b{ color:#fff; font-weight:700; }

.cm-roll{ width:100%; border:none; border-radius:16px; min-height:58px; cursor:pointer; font-family:var(--font-serif); font-weight:600; font-size:19px; color:var(--cream); background:linear-gradient(135deg,var(--terra),#a4492e); box-shadow:0 14px 30px -12px rgba(191,91,60,0.6); transition:transform .12s; -webkit-tap-highlight-color:transparent; }
.cm-roll:active{ transform:scale(0.98); }
.cm-outline{ width:100%; border:1.5px solid var(--green); background:transparent; color:var(--green); border-radius:15px; min-height:52px; font-family:var(--font-serif); font-weight:600; font-size:16px; cursor:pointer; margin-top:12px; transition:all .14s; -webkit-tap-highlight-color:transparent; }
.cm-outline:active{ background:var(--green); color:var(--cream); }
.cm-outline:disabled{ opacity:0.45; cursor:default; box-shadow:none; }
.cm-outline:disabled:active{ background:transparent; color:var(--green); transform:none; }
.cm-hint{ font-size:12px; color:var(--muted); font-style:italic; margin:0 0 10px; }

.cm-day{ background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:13px 16px; margin-bottom:10px; }
.cm-day-h{ font-family:var(--font-serif); font-weight:600; font-size:16px; color:var(--terra); margin:0 0 6px; }
.cm-slot{ display:flex; gap:10px; padding:11px 0; border-top:1px solid var(--line); cursor:pointer; align-items:flex-start; -webkit-tap-highlight-color:transparent; }
.cm-slot:first-of-type{ border-top:none; }
.cm-slot .sl{ font-size:11px; font-weight:700; letter-spacing:0.04em; text-transform:uppercase; color:var(--sage); min-width:68px; padding-top:2px; }
.cm-slot .sv{ font-size:14px; color:var(--ink); line-height:1.4; flex:1; }
.cm-slot .ch{ color:var(--muted); font-size:13px; padding-top:1px; }
.cm-prep{ padding:2px 0 10px 78px; }
.cm-prep .pl{ font-size:13px; line-height:1.5; color:var(--muted); padding:3px 0; }
.cm-prep .pl b{ color:var(--ink); font-weight:700; }

.cm-shop-cat-h{ font-family:var(--font-serif); font-weight:600; font-size:16px; color:var(--terra); margin:16px 0 2px; }
.cm-shop-cat-h:first-child{ margin-top:0; }

/* Acordeón de categorías */
.cm-acc-h{ width:100%; display:flex; align-items:center; gap:10px; background:none; border:none; border-top:1px solid var(--line); padding:14px 2px; cursor:pointer; font-family:var(--font-body); -webkit-tap-highlight-color:transparent; }
.cm-acc-h:first-child{ border-top:none; }
.cm-acc-h .ic{ font-size:19px; }
.cm-acc-h .t{ flex:1; text-align:left; font-family:var(--font-serif); font-weight:600; font-size:16px; color:var(--green); }
.cm-acc-h .meta{ font-size:12px; font-weight:700; color:var(--muted); }
.cm-acc-h .meta.low{ color:var(--terra); background:rgba(191,91,60,0.12); border-radius:999px; padding:2px 9px; }
.cm-acc-h .chev{ color:var(--muted); font-size:13px; width:14px; text-align:center; }

.cm-theme-toggle{ width:100%; margin-top:14px; border:1px dashed var(--line); background:transparent; color:var(--muted); border-radius:13px; padding:11px; font-family:var(--font-body); font-weight:700; font-size:12.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-theme-toggle:active{ transform:scale(.99); }

/* ===== Estilo Receta (papel) — tema único ===== */
/* Títulos manuscritos */
.cm-brand,
.cm-h2,
.cm-onb-h,
.cm-restitle,
.cm-sug-title,
.cm-day-h,
.cm-home-btn .t,
.cm-home-enfoque .lbl,
.cm-scan-title{ font-family:var(--font-head); font-weight:700; letter-spacing:0.2px; }
.cm-brand{ font-size:27px; }
.cm-h2{ font-size:30px; }
.cm-onb-h{ font-size:40px; }
.cm-sug-title{ font-size:21px; }
.cm-home-btn .t{ font-size:21px; }
.cm-day-h{ font-size:21px; }
/* Tarjetas tipo ficha de receta: papel rayado + línea roja de margen + sombra desplazada */
.cm-card,
.cm-sug,
.cm-day,
.cm-home-btn,
.cm-home-enfoque,
.cm-auth,
.cm-sheet-card,
.cm-skel{
  background-image:repeating-linear-gradient(180deg, transparent 0 30px, rgba(120,92,48,0.17) 30px 31px);
  background-color:var(--paper);
  border:1px solid var(--line);
  border-radius:8px;
  box-shadow:2px 3px 0 rgba(57,50,42,0.07), 0 14px 30px -22px rgba(57,50,42,0.5);
  position:relative;
}
.cm-card::before,
.cm-sug::before,
.cm-day::before{
  content:""; position:absolute; left:14px; top:8px; bottom:8px; width:1.5px; background:rgba(178,58,46,0.35);
}
.cm-card, .cm-day{ padding-left:30px; }
.cm-roll{ border-radius:10px; }
/* Botones estilo papel: sello con sombra desplazada que se hunde al tocar */
.cm-roll{ border-radius:11px; box-shadow:2px 3px 0 rgba(57,50,42,0.28); }
.cm-roll:active{ transform:translate(1px,2px); box-shadow:1px 1px 0 rgba(57,50,42,0.28); }
.cm-outline{ border-radius:11px; box-shadow:2px 3px 0 rgba(57,50,42,0.12); }
.cm-outline:active{ transform:translate(1px,2px); box-shadow:none; }
.cm-pill{ border-radius:10px; }
.cm-pill.on{ box-shadow:1px 2px 0 rgba(57,50,42,0.22); }
.cm-roll, .cm-outline{ font-family:var(--font-serif); }
.cm-tabs{ background:rgba(252,247,236,0.95); }
.cm-fab{ border-radius:14px; box-shadow:2px 4px 0 rgba(57,50,42,0.3); }
.cm-fab:active{ transform:translate(1px,2px); box-shadow:1px 2px 0 rgba(57,50,42,0.3); }
.cm-input, .cm-textarea, .cm-add-unit{ background:var(--paper); border-color:var(--line); color:var(--ink); border-radius:10px; }
.cm-input:focus, .cm-textarea:focus{ border-color:var(--terra); outline:none; }
.cm-auth-send{ border-radius:10px; box-shadow:2px 3px 0 rgba(57,50,42,0.22); }
.cm-auth-send:active{ transform:translate(1px,2px); box-shadow:1px 1px 0 rgba(57,50,42,0.22); }

/* Boleta de supermercado (Compras) */
.cm-receipt .cm-rcpt-head{ text-align:center; padding:2px 0 8px; }
.cm-receipt .store{ display:block; font-family:var(--font-mono); font-weight:700; font-size:16px; letter-spacing:2px; color:var(--ink); }
.cm-receipt .sub{ display:block; font-family:var(--font-mono); font-size:11px; color:var(--muted); letter-spacing:1px; text-transform:uppercase; margin-top:2px; }
.cm-rcpt-rule{ height:0; border-top:1.5px dashed var(--line); margin:6px 0; }
.cm-receipt .cm-shop-name, .cm-receipt .cm-qty-val, .cm-receipt .cm-acc-h .t, .cm-receipt .cm-acc-h .meta{ font-family:var(--font-mono); }
.cm-receipt .cm-shop-name{ font-size:13.5px; letter-spacing:0.3px; }
.cm-receipt .cm-acc-h .t{ font-size:14px; text-transform:uppercase; letter-spacing:1px; }
.cm-rcpt-foot{ display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:12.5px; font-weight:700; color:var(--ink); letter-spacing:0.5px; padding:2px 0; }
.cm-rcpt-foot.end{ justify-content:center; color:var(--muted); font-weight:400; letter-spacing:2px; margin-top:4px; }
.cm-receipt::before{ display:none; }
.cm-receipt{ padding-left:16px; }

/* Escáner con detalle papel */
.cm-scan{
  background-color:var(--cream);
  background-image:
    radial-gradient(circle at 15% 0%, rgba(126,139,82,0.10), transparent 42%),
    radial-gradient(circle at 88% 8%, rgba(178,58,46,0.08), transparent 40%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
}
.cm-scan-title{ font-size:26px; }
.cm-scan-stage{ border:2px solid var(--ink); box-shadow:2px 3px 0 rgba(57,50,42,0.2); }
/* Panel de resultado como ficha de receta */
.cm-scan-card{
  background-image:repeating-linear-gradient(180deg, transparent 0 30px, rgba(120,92,48,0.17) 30px 31px);
  background-color:var(--paper);
  border:1px solid var(--line); border-radius:8px; padding:16px 16px 16px 30px;
  box-shadow:2px 3px 0 rgba(57,50,42,0.07), 0 14px 30px -22px rgba(57,50,42,0.5);
  position:relative;
}
.cm-scan-card::before{ content:""; position:absolute; left:14px; top:8px; bottom:8px; width:1.5px; background:rgba(178,58,46,0.35); }
/* Veredicto tipo sello */
.cm-scan-verdict{
  background:transparent !important; border:2.5px dashed currentColor; border-radius:12px;
  transform:rotate(-1.2deg); padding:12px 16px;
}
.cm-scan-verdict .vl{ font-family:var(--font-head); font-size:30px; text-transform:uppercase; letter-spacing:1px; line-height:1; }
.cm-scan-verdict .vd{ font-family:var(--font-mono); font-size:11px; text-transform:uppercase; letter-spacing:0.5px; }
.cm-scan-pname{ font-family:var(--font-head); font-size:21px; color:var(--green); }
.cm-scan-reasons li{ font-family:var(--font-body); }
.cm-scan-nutri{ font-family:var(--font-mono); font-size:11.5px; letter-spacing:0.3px; }
.cm-scan-hint b{ font-family:var(--font-head); font-size:16px; }
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
.cm-tab{ position:relative; flex:1; background:none; border:none; padding:9px 2px 7px; display:flex; flex-direction:column; align-items:center; gap:4px; cursor:pointer; color:var(--muted); font-family:var(--font-body); font-size:11px; font-weight:700; min-height:60px; justify-content:center; transition:color .16s; -webkit-tap-highlight-color:transparent; }
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
.cm-sug-title{ font-family:var(--font-serif); font-weight:600; font-size:16.5px; line-height:1.3; color:var(--green); flex:1; }
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
.cm-cooked{ width:100%; margin-top:12px; border:1.5px solid var(--sage); background:rgba(138,154,91,0.10); color:var(--green); border-radius:12px; min-height:44px; font-family:var(--font-body); font-weight:700; font-size:13.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:transform .12s; }
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
.cm-input{ flex:1; min-height:44px; border:1.5px solid var(--line); border-radius:12px; padding:0 14px; font-family:var(--font-body); font-size:14px; color:var(--ink); background:#fff; }
.cm-input:focus{ outline:none; border-color:var(--sage); }
.cm-auth-send{ border:none; background:var(--green); color:var(--cream); border-radius:12px; min-height:44px; padding:0 16px; font-family:var(--font-body); font-weight:700; font-size:14px; cursor:pointer; white-space:nowrap; -webkit-tap-highlight-color:transparent; }
.cm-auth-send:active{ transform:scale(0.97); }
.cm-auth-send:disabled{ background:var(--muted); opacity:0.7; cursor:default; }
.cm-google{ width:100%; display:flex; align-items:center; justify-content:center; gap:10px; min-height:48px; border:1.5px solid var(--line); background:#fff; color:#3c4043; border-radius:12px; font-family:var(--font-body); font-weight:700; font-size:14.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:transform .12s, box-shadow .14s; }
.cm-google:active{ transform:scale(.98); }
.cm-google svg{ flex-shrink:0; }
.cm-divider{ display:flex; align-items:center; gap:10px; margin:12px 0; }
.cm-divider::before, .cm-divider::after{ content:""; flex:1; height:1px; background:var(--line); }
.cm-divider span{ font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
.cm-auth-mail{ flex:1; font-size:13.5px; font-weight:600; color:var(--green); }
.cm-auth-out{ border:1.5px solid var(--line); background:#fff; color:var(--muted); border-radius:12px; min-height:40px; padding:0 14px; font-family:var(--font-body); font-weight:700; font-size:13px; cursor:pointer; -webkit-tap-highlight-color:transparent; }

/* Toast de feedback (guardar/quitar favorito) */
.cm-toast{ position:fixed; left:50%; bottom:calc(env(safe-area-inset-bottom) + 80px); transform:translateX(-50%); z-index:60; display:inline-flex; align-items:center; gap:8px; background:var(--green); color:var(--cream); padding:12px 20px; border-radius:999px; font-size:13.5px; font-weight:700; box-shadow:0 14px 34px -12px rgba(47,61,46,0.8); animation:cm-toast-in .26s cubic-bezier(.2,1.2,.4,1) both; max-width:88%; text-align:center; pointer-events:none; }
.cm-toast.rm{ background:var(--terra); box-shadow:0 14px 34px -12px rgba(191,91,60,0.7); }
@keyframes cm-toast-in{ from{ opacity:0; transform:translate(-50%,16px) scale(.92) } to{ opacity:1; transform:translate(-50%,0) scale(1) } }

/* Pop de la estrella al marcar favorito */
@keyframes cm-star-pop{ 0%{ transform:scale(1) } 40%{ transform:scale(1.35) } 70%{ transform:scale(.9) } 100%{ transform:scale(1) } }
.cm-fav.on{ animation:cm-star-pop .34s ease; }

.cm-toast-btn{ border:none; background:rgba(255,255,255,0.22); color:#fff; border-radius:999px; padding:6px 12px; font-family:var(--font-body); font-weight:700; font-size:12.5px; cursor:pointer; pointer-events:auto; white-space:nowrap; -webkit-tap-highlight-color:transparent; }
.cm-toast-btn:active{ transform:scale(.95); }

/* Nudge para registrar correo */
.cm-nudge{ display:block; width:100%; text-align:left; border:1px dashed var(--sage); background:rgba(138,154,91,0.10); color:var(--green); border-radius:13px; padding:11px 14px; font-family:var(--font-body); font-size:12.5px; line-height:1.45; cursor:pointer; margin:8px 0 4px; -webkit-tap-highlight-color:transparent; }
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

/* 6 tabs: ajuste de espacio */
.cm-tab{ font-size:9.5px; gap:3px; }
.cm-tab .ic{ width:36px; font-size:19px; }

/* Controles de cantidad más grandes (fáciles de tocar) */
.cm-qty-btn{ width:36px; height:36px; font-size:20px; }
.cm-qty-val{ min-width:68px; }

/* Inicio */
.cm-home-enfoque{ display:flex; align-items:center; gap:12px; background:var(--paper); border:1px solid var(--line); border-radius:16px; padding:14px 16px; margin-bottom:16px; }
.cm-home-enfoque .emo{ font-size:30px; }
.cm-home-enfoque .lbl{ font-family:var(--font-serif); font-weight:900; font-size:17px; color:var(--green); }
.cm-home-enfoque .sub{ font-size:12.5px; color:var(--muted); line-height:1.4; }
.cm-home-grid{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.cm-home-btn{ display:flex; flex-direction:column; align-items:flex-start; gap:4px; text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:18px 16px; cursor:pointer; min-height:118px; justify-content:center; box-shadow:0 14px 30px -26px rgba(47,61,46,0.5); transition:transform .12s; -webkit-tap-highlight-color:transparent; }
.cm-home-btn:active{ transform:scale(.97); }
.cm-home-btn .ic{ font-size:30px; line-height:1; }
.cm-home-btn .t{ font-family:var(--font-serif); font-weight:900; font-size:17px; color:var(--green); }
.cm-home-btn .d{ font-size:11.5px; color:var(--muted); line-height:1.35; }

/* Onboarding */
.cm-onb{ position:fixed; inset:0; z-index:90; background:var(--cream); display:flex; align-items:center; justify-content:center; padding:24px 16px calc(env(safe-area-inset-bottom) + 16px); overflow-y:auto; }
.cm-onb-card{ width:100%; max-width:460px; }
.cm-onb-h{ font-family:var(--font-serif); font-weight:900; font-size:30px; color:var(--green); margin:0 0 6px; }
.cm-onb-h em{ font-style:italic; font-weight:500; color:var(--terra); }
.cm-onb-p{ color:var(--muted); font-size:14px; margin:0 0 12px; line-height:1.45; }
.cm-onb-opts{ display:grid; gap:10px; }
.cm-onb-opt{ display:grid; grid-template-columns:auto 1fr; grid-template-rows:auto auto; column-gap:12px; align-items:center; text-align:left; background:#fff; border:2px solid var(--line); border-radius:16px; padding:14px 16px; cursor:pointer; -webkit-tap-highlight-color:transparent; transition:border-color .14s, transform .12s; }
.cm-onb-opt:active{ transform:scale(.99); }
.cm-onb-opt.on{ border-color:var(--terra); background:rgba(191,91,60,0.06); }
.cm-onb-opt .emo{ grid-row:1/3; font-size:30px; }
.cm-onb-opt .t{ font-family:var(--font-serif); font-weight:900; font-size:17px; color:var(--green); }
.cm-onb-opt .d{ font-size:12.5px; color:var(--muted); line-height:1.35; }

/* Quitar/agregar en compras */
.cm-row-x{ border:none; background:none; color:var(--muted); font-size:14px; cursor:pointer; padding:4px 6px; border-radius:8px; line-height:1; -webkit-tap-highlight-color:transparent; }
.cm-row-x:active{ background:rgba(191,91,60,0.12); color:var(--terra); }
.cm-add{ display:flex; gap:8px; align-items:center; margin-top:16px; padding-top:14px; border-top:1px solid var(--line); }
.cm-add .cm-input{ flex:1; min-height:42px; }
.cm-add-unit{ min-height:42px; border:1.5px solid var(--line); border-radius:11px; background:#fff; font-family:var(--font-body); font-size:13px; color:var(--ink); padding:0 8px; }
.cm-add-btn{ width:42px; height:42px; border:none; background:var(--green); color:var(--cream); border-radius:11px; font-size:22px; line-height:1; cursor:pointer; flex-shrink:0; -webkit-tap-highlight-color:transparent; }
.cm-add-btn:active{ transform:scale(.94); }
.cm-link{ border:none; background:none; color:var(--terra); font-family:var(--font-body); font-weight:700; font-size:13px; cursor:pointer; text-decoration:underline; padding:4px 0; }
.cm-hidden-list{ display:flex; flex-wrap:wrap; gap:8px; margin-top:8px; }
.cm-chip-restore{ border:1.5px dashed var(--sage); background:rgba(138,154,91,0.10); color:var(--green); border-radius:999px; padding:6px 12px; font-family:var(--font-body); font-weight:700; font-size:12.5px; cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-chip-restore:active{ transform:scale(.96); }

/* FAB escáner */
.cm-fab{ position:fixed; right:16px; bottom:calc(env(safe-area-inset-bottom) + 76px); z-index:55; width:56px; height:56px; border-radius:50%; border:none; background:linear-gradient(135deg,var(--terra),#a4492e); color:#fff; font-size:24px; cursor:pointer; box-shadow:0 12px 28px -8px rgba(191,91,60,0.7); -webkit-tap-highlight-color:transparent; transition:transform .12s; }
.cm-fab:active{ transform:scale(.92); }

/* Overlay escáner */
.cm-scan{ position:fixed; inset:0; z-index:80; background:var(--cream); display:flex; flex-direction:column; padding:calc(env(safe-area-inset-top) + 12px) 16px calc(env(safe-area-inset-bottom) + 16px); overflow-y:auto; }
.cm-scan-top{ display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.cm-scan-title{ font-family:var(--font-serif); font-weight:900; font-size:20px; color:var(--green); }
.cm-scan-close{ border:none; background:#fff; border:1.5px solid var(--line); color:var(--muted); width:36px; height:36px; border-radius:50%; font-size:15px; cursor:pointer; -webkit-tap-highlight-color:transparent; }
.cm-scan-stage{ position:relative; width:100%; aspect-ratio:4/3; background:#000; border-radius:18px; overflow:hidden; }
.cm-scan-video{ width:100%; height:100%; object-fit:cover; }
.cm-scan-frame{ position:absolute; inset:18% 12%; border:3px solid rgba(255,255,255,0.9); border-radius:14px; box-shadow:0 0 0 9999px rgba(0,0,0,0.25); }
.cm-scan-msg{ position:absolute; inset:0; display:grid; place-items:center; color:#fff; font-weight:700; font-size:15px; background:rgba(0,0,0,0.4); }
.cm-scan-hint{ font-size:13px; color:var(--muted); text-align:center; margin:12px 0; }
.cm-scan-hint b{ color:var(--terra); }
.cm-scan-result{ margin-top:14px; }
.cm-scan-verdict{ display:flex; align-items:center; gap:12px; border-radius:16px; padding:14px 16px; margin-bottom:12px; }
.cm-scan-verdict .big{ font-size:30px; line-height:1; }
.cm-scan-verdict .vl{ font-family:var(--font-serif); font-weight:900; font-size:20px; }
.cm-scan-verdict .vd{ font-size:12.5px; opacity:0.85; }
.cm-scan-pname{ font-weight:700; font-size:15px; color:var(--ink); margin:0 0 8px; }
.cm-scan-prod{ display:flex; align-items:center; gap:12px; }
.cm-scan-prod .cm-scan-pname{ margin:0; flex:1; }
.cm-scan-img{ width:54px; height:54px; object-fit:cover; border-radius:8px; border:1px solid var(--line); background:#fff; flex-shrink:0; }
.cm-scan-facts{ display:flex; flex-wrap:wrap; gap:7px; margin:10px 0; }
.cm-scan-facts .fact{ font-size:11.5px; font-weight:700; color:var(--ink); background:rgba(0,0,0,0.05); border:1px solid var(--line); border-radius:999px; padding:3px 10px; }
.cm-scan-facts .ns{ color:#fff; border:none; }
.cm-scan-facts .ns-a{ background:#2E7D32; } .cm-scan-facts .ns-b{ background:#7CB342; } .cm-scan-facts .ns-c{ background:#F9A825; } .cm-scan-facts .ns-d{ background:#EF6C00; } .cm-scan-facts .ns-e{ background:#C62828; }

/* ===== Notas de papel escritas a mano: rotación leve + cinta adhesiva ===== */
.cm-sug, .cm-home-btn, .cm-day, .cm-home-enfoque, .cm-scan-card{ position:relative; }
.cm-sug{ transform:rotate(-0.5deg); }
.cm-sug:nth-of-type(even){ transform:rotate(0.55deg); }
.cm-sug.open{ transform:none; }
.cm-day:nth-of-type(odd){ transform:rotate(-0.4deg); }
.cm-day:nth-of-type(even){ transform:rotate(0.4deg); }
.cm-home-btn:nth-child(odd){ transform:rotate(-0.7deg); }
.cm-home-btn:nth-child(even){ transform:rotate(0.7deg); }
.cm-home-btn:active{ transform:scale(.97); }
/* cinta adhesiva translúcida arriba de cada nota */
.cm-sug::after, .cm-home-btn::after{
  content:""; position:absolute; top:-7px; left:50%;
  width:56px; height:16px; transform:translateX(-50%) rotate(-3deg);
  background:rgba(199,174,130,0.45); border:1px dashed rgba(58,45,30,0.22);
  box-shadow:0 1px 2px rgba(58,45,30,0.15); pointer-events:none; z-index:2;
}
.cm-home-btn:nth-child(even)::after{ transform:translateX(-50%) rotate(3deg); }

/* ===== Texto de las cards escrito a mano (sobre los renglones) ===== */
.cm-sug-steps .st, .cm-sug-steps .st b,
.cm-prep .pl, .cm-prep .pl b,
.cm-step, .cm-step b,
.cm-scan-reasons li,
.cm-consejo, .cm-consejo b,
.cm-slot .sv,
.cm-p{
  font-family:var(--font-head);
}
.cm-sug-steps .st{ font-size:17px; line-height:1.55; color:var(--ink); }
.cm-sug-steps .st b{ color:var(--terra); font-weight:700; }
.cm-prep .pl{ font-size:16px; line-height:1.5; }
.cm-scan-reasons li{ font-size:16px; line-height:1.5; }
.cm-consejo{ font-size:15px; line-height:1.4; }
.cm-slot .sv{ font-size:16px; }
.cm-p{ font-size:16px; font-style:normal; line-height:1.4; }
.cm-home-btn .d, .cm-home-enfoque .sub{ font-family:var(--font-head); font-size:14px; line-height:1.3; }

/* Títulos generales y etiquetas del bottombar en manuscrita */
.cm-shop-cat-h, .cm-acc-h .t{ font-family:var(--font-head); font-size:19px; }
.cm-brand{ font-family:var(--font-head); }
.cm-tab{ font-family:var(--font-head); font-size:13.5px; font-weight:700; gap:1px; }
.cm-scan-reasons{ margin:0 0 10px; padding-left:18px; }
.cm-scan-reasons li{ font-size:13.5px; color:var(--ink); line-height:1.5; }
.cm-scan-nutri{ font-size:12.5px; color:var(--muted); margin:0 0 14px; }
.cm-scan-nutri .per{ opacity:0.7; }
.cm-scan-err{ font-size:14px; color:var(--terra); text-align:center; margin:18px 0; }
.cm-scan-weight{ margin:10px 0; }
.cm-scan-weight label{ display:block; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; color:var(--muted); margin-bottom:5px; }
.cm-scan-wrow{ display:flex; align-items:center; gap:8px; }
.cm-scan-wrow .cm-input{ flex:1; }
.cm-scan-wrow .u{ font-weight:700; color:var(--muted); font-size:14px; }
.cm-photo-link{ display:block; width:100%; margin-top:14px; border:none; background:none; color:var(--muted); font-family:var(--font-body); font-size:13px; cursor:pointer; text-decoration:underline; text-align:center; padding:6px; -webkit-tap-highlight-color:transparent; }
.cm-scan-manual{ display:flex; gap:8px; margin-top:14px; }
.cm-scan-manual .cm-input{ flex:1; }
.cm-textarea{ width:100%; min-height:90px; padding:10px 12px; font-family:var(--font-body); font-size:14px; line-height:1.4; resize:vertical; }
/* Sellos negros chilenos (octágono) */
.cm-seals{ display:flex; flex-wrap:wrap; gap:10px; }
.cm-seal{ width:80px; height:80px; padding:0; border:none; background:none; cursor:pointer; position:relative; display:grid; place-items:center; color:var(--muted); -webkit-tap-highlight-color:transparent; transition:transform .12s; }
.cm-seal::before{ content:""; position:absolute; inset:0; clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%); background:#D9C8A6; transition:background .15s; }
.cm-seal::after{ content:""; position:absolute; inset:6px; clip-path:polygon(30% 0,70% 0,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%); border:2px solid rgba(255,255,255,0.0); }
.cm-seal.on{ color:#fff; }
.cm-seal.on::before{ background:#141414; }
.cm-seal.on::after{ border-color:rgba(255,255,255,0.55); }
.cm-seal b, .cm-seal span{ position:relative; z-index:1; color:inherit; font-family:var(--font-body); font-weight:800; line-height:1.05; text-align:center; text-transform:uppercase; }
.cm-seal b{ font-size:8.5px; letter-spacing:0.5px; }
.cm-seal span{ font-size:10.5px; letter-spacing:0.2px; padding:0 4px; }
.cm-seal:active{ transform:scale(.94); }
`;
