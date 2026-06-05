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
.cm-tab{ flex:1; background:none; border:none; padding:9px 2px; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; color:var(--muted); font-family:'Karla'; font-size:11px; font-weight:700; min-height:60px; justify-content:center; transition:color .14s; -webkit-tap-highlight-color:transparent; }
.cm-tab .ic{ font-size:21px; line-height:1; }
.cm-tab.on{ color:var(--terra); }
.cm-tab.on .ic{ transform:translateY(-1px); }

.cm-foot{ text-align:center; font-size:11.5px; color:var(--muted); margin-top:24px; line-height:1.6; }
.cm-foot b{ color:var(--green); }
`;
