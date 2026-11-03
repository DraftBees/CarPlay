/* Tema "Cluster" per il display FlyThings 1920×720 (Serie 1 Estoril Blue).
   Linguaggio visivo (dal riferimento del cluster digitale M):
   - nero puro; linee al neon sottili; CIANO a sinistra / ROSSO a destra; cornici a chevron e angoli tagliati
   - gli stati attivi si accendono (contorno + alone), le superfici restano nere
   - tricolore azzurro / blu / rosso come unica firma (nessun logo)
   Ogni voce di ASSETS disegna un PNG alle dimensioni ESATTE dell'originale (le corregge build.js dal backup).
   Il cruscotto (sfondi con finestre trasparenti) è generato da dash_bg.py. */
const C = {
  black: '#000', ink: '#04070a', cyan: '#3de4ff', hot: '#d7fbff', blue: '#1f46ff', deep: '#0a1c8c',
  red: '#ff3345', rhot: '#ffd6da', rdeep: '#96102a', white: '#eef7ff', dim: 'rgba(238,247,255,.62)', hair: 'rgba(190,215,235,.24)', green: '#2fe08a',
};
const GL = (c, r) => `drop-shadow(0 0 ${r}px ${c}) drop-shadow(0 0 ${r * 2.4}px ${c}88)`;

/* ---------------------------------------------------------------- icone (viewBox 64) */
function gearPath(cx, cy, r1, r2, n) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a0 = (i / (n * 2)) * Math.PI * 2, a1 = ((i + 1) / (n * 2)) * Math.PI * 2, r = i % 2 ? r1 : r2;
    const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(2)} ${(cy + Math.sin(a) * rr).toFixed(2)}`;
    d += (i ? 'L' : 'M') + p(a0 + 0.08, r) + 'L' + p(a1 - 0.08, r);
  }
  return d + 'Z';
}
const ICON = {
  music: '<path d="M24 46V15l26-6v31"/><circle cx="18" cy="46" r="6.5"/><circle cx="44" cy="40" r="6.5"/>',
  phone: '<path d="M21 9h-7a4 4 0 0 0-4 4c0 23 18 42 41 42a4 4 0 0 0 4-4v-7l-11-5-5 5c-7-3-13-9-16-16l5-5z"/>',
  video: '<rect x="7" y="14" width="50" height="36" rx="6"/><path d="M28 24l12 8-12 8z" class="f"/>',
  gear: `<path d="${gearPath(32, 32, 19, 24, 8)}"/><circle cx="32" cy="32" r="8"/>`,
  bt: '<path d="M21 21l21 21-10 10V12l10 10-21 21"/>',
  carplay: '<rect x="16" y="6" width="26" height="52" rx="6"/><path d="M26 51h6"/><path d="M25 23l10 7-10 7z" class="f"/><path d="M47 22a10 10 0 0 1 0 16M52 17a17 17 0 0 1 0 26"/>',
  aa: '<rect x="16" y="6" width="26" height="52" rx="6"/><path d="M26 51h6"/><path d="M29 18l8 19-8-4-8 4z" class="f"/><path d="M47 22a10 10 0 0 1 0 16M52 17a17 17 0 0 1 0 26"/>',
  gauge: '<path d="M9 45a23 23 0 1 1 46 0"/><path d="M32 45l13-15"/><circle cx="32" cy="45" r="3.5" class="f"/><path d="M14 33l4 2M20 23l3 3M32 19v4M44 23l-3 3"/>',
  car: '<path d="M6 41v-7l7-2 8-10h20l11 10 6 2v7h-5"/><path d="M6 41h7M27 41h10M51 41h2"/><circle cx="20" cy="41" r="6"/><circle cx="44" cy="41" r="6"/><path d="M23 22l-4 10h31"/>',
  image: '<rect x="7" y="12" width="50" height="40" rx="5"/><path d="M7 44l15-15 10 10 8-8 17 17"/><circle cx="42" cy="24" r="4"/>',
  eq: '<path d="M16 9v46M32 9v46M48 9v46"/><circle cx="16" cy="40" r="5" class="f"/><circle cx="32" cy="22" r="5" class="f"/><circle cx="48" cy="34" r="5" class="f"/>',
  dvr: '<rect x="5" y="18" width="40" height="28" rx="5"/><path d="M45 28l14-8v24l-14-8z"/><circle cx="16" cy="28" r="3" class="f r"/>',
  mirror: '<rect x="5" y="11" width="40" height="28" rx="4"/><rect x="36" y="25" width="20" height="30" rx="4"/><path d="M13 49a8 8 0 0 1 8 8M13 43a14 14 0 0 1 14 14"/>',
  link: '<path d="M26 38l12-12"/><path d="M23 30l-6 6a8.5 8.5 0 0 0 12 12l6-6"/><path d="M41 34l6-6a8.5 8.5 0 0 0-12-12l-6 6"/>',
  wheel: '<circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="6"/><path d="M9 29h17M38 29h17M32 38v17"/>',
  speaker: '<path d="M9 25h10l13-11v36L19 39H9z"/><path d="M41 24a10 10 0 0 1 0 16M47 18a18 18 0 0 1 0 28"/>',
  sun: '<circle cx="32" cy="32" r="9"/><path d="M32 8v7M32 49v7M8 32h7M49 32h7M15 15l5 5M44 44l5 5M15 49l5-5M44 20l5-5"/>',
  globe: '<circle cx="32" cy="32" r="23"/><ellipse cx="32" cy="32" rx="10" ry="23"/><path d="M9 32h46M13 20h38M13 44h38"/>',
  clock: '<circle cx="32" cy="32" r="23"/><path d="M32 17v15l10 7"/>',
  camera: '<rect x="6" y="18" width="52" height="34" rx="6"/><path d="M22 18l4-7h12l4 7"/><circle cx="32" cy="35" r="9"/>',
  info: '<circle cx="32" cy="32" r="23"/><path d="M32 29v15"/><circle cx="32" cy="20" r="2.5" class="f"/>',
  wrench: '<path d="M41 8a13 13 0 0 0-12 17L9 45a5.5 5.5 0 0 0 8 8l20-20a13 13 0 0 0 17-12l-8 7-7-2-2-7z"/>',
  keypad: '<circle cx="18" cy="14" r="3.5" class="f"/><circle cx="32" cy="14" r="3.5" class="f"/><circle cx="46" cy="14" r="3.5" class="f"/><circle cx="18" cy="28" r="3.5" class="f"/><circle cx="32" cy="28" r="3.5" class="f"/><circle cx="46" cy="28" r="3.5" class="f"/><circle cx="18" cy="42" r="3.5" class="f"/><circle cx="32" cy="42" r="3.5" class="f"/><circle cx="46" cy="42" r="3.5" class="f"/><circle cx="32" cy="55" r="3.5" class="f"/>',
  person: '<circle cx="32" cy="21" r="10"/><path d="M11 55c2-12 10-19 21-19s19 7 21 19"/>',
  history: '<path d="M12 32a20 20 0 1 0 6-14"/><path d="M10 10v10h10"/><path d="M32 21v12l8 6"/>',
  btmusic: '<path d="M22 44V16l20-5v27"/><circle cx="17" cy="44" r="5.5"/><circle cx="37" cy="38" r="5.5"/><path d="M47 40l9 9-4.5 4.5V36l4.5 4.5-9 9"/>',
  home: '<path d="M9 31L32 12l23 19"/><path d="M15 26v27h34V26"/><path d="M27 53V39h10v14"/>',
  back: '<path d="M25 15L12 28l13 13"/><path d="M12 28h28a12 12 0 0 1 0 24h-9"/>',
  usb: '<path d="M32 6v44"/><circle cx="32" cy="53" r="5" class="f"/><path d="M32 6l-5 7h10z" class="f"/><path d="M32 38l-12-8v-8M32 32l12-6v-6"/><rect x="40" y="15" width="8" height="6" class="f"/><circle cx="20" cy="20" r="3.5" class="f"/>',
  prev: '<path d="M18 14v36"/><path d="M50 14L24 32l26 18z" class="f"/>',
  next: '<path d="M46 14v36"/><path d="M14 14l26 18-26 18z" class="f"/>',
  play: '<path d="M20 12l32 20-32 20z" class="f"/>',
  pause: '<rect x="17" y="12" width="10" height="40" rx="2" class="f"/><rect x="37" y="12" width="10" height="40" rx="2" class="f"/>',
  list: '<path d="M22 16h32M22 32h32M22 48h32"/><circle cx="11" cy="16" r="3" class="f"/><circle cx="11" cy="32" r="3" class="f"/><circle cx="11" cy="48" r="3" class="f"/>',
  shuffle: '<path d="M8 20h10c10 0 18 24 28 24h10M8 44h10c4 0 7-4 10-9M36 29c3-5 6-9 10-9h10"/><path d="M50 14l6 6-6 6M50 38l6 6-6 6"/>',
  repeat: '<path d="M12 30v-4a8 8 0 0 1 8-8h32"/><path d="M46 12l6 6-6 6"/><path d="M52 34v4a8 8 0 0 1-8 8H12"/><path d="M18 52l-6-6 6-6"/>',
  title: '<path d="M24 46V15l26-6v31"/><circle cx="18" cy="46" r="6.5"/><circle cx="44" cy="40" r="6.5"/>',
  disc: '<circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="6"/><path d="M32 14a18 18 0 0 1 18 18"/>',
  hang: '<path d="M8 36c14-12 34-12 48 0l-4 8-10-3v-6c-6-2-14-2-20 0v6l-10 3z" class="f"/>',
  call: '<path d="M21 9h-7a4 4 0 0 0-4 4c0 23 18 42 41 42a4 4 0 0 0 4-4v-7l-11-5-5 5c-7-3-13-9-16-16l5-5z" class="f"/>',
  download: '<path d="M32 10v30M20 28l12 12 12-12"/><path d="M12 46v6h40v-6"/>',
  fuel: '<path d="M14 54V12a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v42"/><path d="M10 54h36"/><rect x="20" y="15" width="16" height="12" rx="2"/><path d="M42 24h6a4 4 0 0 1 4 4v14a3 3 0 0 0 6 0V22l-6-7"/>',
  belt: '<circle cx="30" cy="12" r="5.5"/><path d="M22 24h14l6 14-6 6v14"/><path d="M22 24l-4 16h12"/><path d="M38 28l8 8"/>',
  park: '<circle cx="32" cy="32" r="24"/><path d="M26 44V20h9a7 7 0 0 1 0 14h-9"/>',
};
const svgIcon = (name, size, color, sw = 3, extra = '') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="${extra}"><style>.f{fill:${color};stroke:none}.r{fill:${C.red}}</style>${ICON[name]}</svg>`;

/* ---------------------------------------------------------------- forme */
const poly = (pts) => pts.map((p) => p.join(',')).join(' ');
const cham = (w, h, c) => [[c, 0], [w, 0], [w, h - c], [w - c, h], [0, h], [0, c]];   // angoli tagliati in alto a sinistra e in basso a destra
let uid = 0;
/* cornice: stroke sfumato ciano→rosso (o colore pieno), alone opzionale, riempimento opzionale */
function frame(w, h, o = {}) {
  const { c = 22, sw = 1.6, glow = 0, fill = 'none', color = null, inset = 2, ga = C.cyan, gb = C.red } = o;
  const id = 'g' + (uid++);
  const pts = cham(w - 2 * inset, h - 2 * inset, c).map(([x, y]) => [x + inset, y + inset]);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="position:absolute;left:0;top:0;overflow:visible;${glow ? `filter:${GL(color || C.cyan, glow)};` : ''}">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${ga}"/><stop offset=".55" stop-color="rgba(238,247,255,.35)"/><stop offset="1" stop-color="${gb}"/></linearGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fill === 'card' ? '#06101a' : fill}"/><stop offset="1" stop-color="${fill === 'card' ? '#000' : fill}"/></linearGradient></defs>
    <polygon points="${poly(pts)}" fill="${fill === 'none' ? 'none' : `url(#${id}f)`}" stroke="${color || `url(#${id})`}" stroke-width="${sw}" stroke-linejoin="round"/></svg>`;
}
/* linea orizzontale sfumata ciano → buio → rosso (firma del tema) */
const split = (x, y, w, th = 2, glow = 6, a = 1) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${th}px;opacity:${a};background:linear-gradient(90deg, ${C.cyan}, ${C.cyan}00 46%, ${C.red}00 54%, ${C.red});filter:${GL(C.cyan, glow)} ;"></div>`;
/* tre barre inclinate (azzurro / blu / rosso) */
const STRIPE = (w, x, y, h = 4) => `<div style="position:absolute;left:${x}px;top:${y}px;display:flex;gap:3px;transform:skewX(-22deg);filter:${GL('#5f9bff', 3)}">
  <i style="width:${w}px;height:${h}px;background:${C.cyan}"></i><i style="width:${w}px;height:${h}px;background:${C.blue}"></i><i style="width:${w}px;height:${h}px;background:${C.red}"></i></div>`;
const chev = (x, y, len, dir, col, sw = 3.2) => { const k = dir * len * 0.52; return `<polyline points="${x - k},${y - len} ${x},${y} ${x - k},${y + len}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" transform="scale(${-dir},1) translate(${-dir * 0},0)"/>`; };
const center = (inner) => `<div style="position:absolute;inset:0;display:grid;place-items:center">${inner}</div>`;
const iconAsset = (icon, size, color, glowC, sw) => center(svgIcon(icon, size, color, sw, glowC ? `filter:${GL(glowC, 5)}` : ''));
const L = (x, y, w, h, bg) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${bg}"></div>`;

/* ---------------------------------------------------------------- card della home (410×580) */
function card(icon, pressed) {
  const w = 410, h = 580;
  const a = pressed ? 1 : 0.8;
  const chevs = `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;overflow:visible">
    <g style="filter:${GL(C.cyan, pressed ? 7 : 4)}"><polyline points="96,262 60,330 96,398" fill="none" stroke="${C.cyan}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g>
    <g style="filter:${GL(C.red, pressed ? 7 : 4)}"><polyline points="314,262 350,330 314,398" fill="none" stroke="${C.red}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
  return `<div style="position:absolute;inset:0">
    ${frame(w, h, { c: 30, sw: pressed ? 3 : 1.7, glow: pressed ? 8 : 3, fill: 'card' })}
    ${pressed ? `<div style="position:absolute;inset:6px;clip-path:polygon(${poly(cham(w - 12, h - 12, 26))});background:radial-gradient(ellipse at 50% 55%, rgba(61,228,255,.16), rgba(0,0,0,0) 68%)"></div>` : ''}
    ${split(40, 92, 330, 1.5, 4, a)}${STRIPE(14, 177, 86, 7)}
    ${chevs}
    <div style="position:absolute;left:205px;top:330px;width:160px;height:160px;margin:-80px 0 0 -80px;display:grid;place-items:center">${svgIcon(icon, 148, pressed ? C.hot : C.white, 2.5, `filter:${GL(pressed ? C.cyan : '#7fdcff', pressed ? 9 : 5)}`)}</div>
    ${split(40, h - 44, 330, 2, 5, a)}
  </div>`;
}
function photoCard(pressed) {
  const w = 410, h = 580, clip = `clip-path:polygon(${poly(cham(366, 330, 22))});`;
  return `<div style="position:absolute;inset:0">
    ${frame(w, h, { c: 30, sw: pressed ? 3 : 1.7, glow: pressed ? 8 : 3, fill: 'card' })}
    ${split(40, 92, 330, 1.5, 4, pressed ? 1 : 0.8)}${STRIPE(14, 177, 86, 7)}
    <div style="position:absolute;left:22px;top:122px;width:366px;height:330px;${clip}overflow:hidden;${pressed ? 'filter:brightness(1.12) saturate(1.1);' : ''}">
      <img src="${window.CAR_PHOTO}" style="position:absolute;left:-116px;top:-122px;width:800px;max-width:none">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,.85))"></div></div>
    <div style="position:absolute;left:22px;top:122px;width:366px;height:330px">${frame(366, 330, { c: 22, sw: pressed ? 2.6 : 1.8, glow: pressed ? 7 : 3 })}</div>
    ${split(40, h - 44, 330, 2, 5, pressed ? 1 : 0.8)}
  </div>`;
}
const CARDS = { home_icon_wiredcarplay: 'carplay', home_icon_androidauto: 'aa', home_icon_bluetooth: 'bt', za_home_icon_music: 'music', home_icon_hidvideo: 'video',
  home_icon_dashboard: 'gauge', home_icon_carinfo: 'car', home_bg: 'image', home_sound: 'eq', home_icon_zlink: 'gear', home_icon_dvr: 'dvr',
  home_icon_miracast: 'mirror', home_icon_airplay: 'mirror', home_icon_hicar: 'link', home_icon_carlife: 'wheel' };

/* ---------------------------------------------------------------- barre */
const bar = (h) => `<div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,.86), rgba(0,0,0,.55))"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:2px;background:linear-gradient(90deg, ${C.cyan}, ${C.cyan}00 42%, ${C.red}00 58%, ${C.red});filter:${GL(C.cyan, 4)}"></div>`;

/* ---------------------------------------------------------------- sfondi (canvas) */
function glowAt(ctx, x, y, rx, ry, rgb, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(rx / ry, 1);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, ry, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
const CY = '61,228,255', RD = '255,51,69', BL = '31,70,255';
function black(ctx, w, h) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); }
function baseLines(ctx, w, h, y = h - 22) {   // le due linee di base ciano/rosso del cluster
  for (const [x0, x1, c, rgb] of [[0, w * 0.46, C.cyan, CY], [w * 0.54, w, C.red, RD]]) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    const [a, b] = x0 === 0 ? [1, 0] : [0, 1];
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},${b})`);
    ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 14; ctx.fillStyle = g; ctx.fillRect(x0, y, x1 - x0, 2.5); ctx.restore();
  }
}
const BG = {
  1(ctx, w, h) { black(ctx, w, h); glowAt(ctx, w * 0.12, h + 40, 700, 220, CY, 0.18); glowAt(ctx, w * 0.88, h + 40, 700, 220, RD, 0.16); baseLines(ctx, w, h); },
  2(ctx, w, h) { // Orizzonte
    black(ctx, w, h);
    const y = 468; const g = ctx.createLinearGradient(0, 0, w, 0); g.addColorStop(0, `rgba(${CY},0)`); g.addColorStop(0.3, `rgba(${CY},1)`); g.addColorStop(0.5, 'rgba(240,252,255,1)'); g.addColorStop(0.7, `rgba(${RD},1)`); g.addColorStop(1, `rgba(${RD},0)`);
    ctx.save(); ctx.shadowColor = C.cyan; ctx.shadowBlur = 24; ctx.fillStyle = g; ctx.fillRect(0, y, w, 2); ctx.restore();
    glowAt(ctx, w * 0.3, y, 700, 120, CY, 0.14); glowAt(ctx, w * 0.7, y, 700, 120, RD, 0.13);
    for (let i = 1; i < 22; i++) { const yy = y + i * i * 0.85; if (yy > h) break; const a = 0.12 - i * 0.005; ctx.fillStyle = `rgba(160,220,255,${Math.max(a, 0)})`; ctx.fillRect(0, yy, w, 1); }
  },
  3(ctx, w, h) { // Strisce: tre fasce inclinate come le scie dell'emblema
    black(ctx, w, h); glowAt(ctx, w * 0.78, h * 0.9, 760, 300, BL, 0.14);
    const bands = [[C.cyan, 0, 40], [C.blue, 70, 56], [C.red, 156, 30]];
    for (const pass of [0, 1]) {
      ctx.save(); if (pass === 0) ctx.filter = 'blur(22px)';
      for (const [c, o, wd] of bands) {
        ctx.beginPath(); ctx.moveTo(900 + o, h + 60); ctx.lineTo(1320 + o, -60); ctx.lineTo(1320 + o + wd, -60); ctx.lineTo(900 + o + wd, h + 60); ctx.closePath();
        const g = ctx.createLinearGradient(0, h, 0, 0); g.addColorStop(0, c); g.addColorStop(0.75, c + '88'); g.addColorStop(1, c + '00'); ctx.fillStyle = g; ctx.globalAlpha = pass === 0 ? 0.8 : 0.95; ctx.fill();
      }
      ctx.restore();
    }
    baseLines(ctx, w, h);
  },
  4(ctx, w, h) { // Carbonio
    black(ctx, w, h); const s = 14;
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
      const odd = ((x / s) + (y / s)) % 2; const g = odd ? ctx.createLinearGradient(x, y, x + s, y) : ctx.createLinearGradient(x, y, x, y + s);
      g.addColorStop(0, '#05070a'); g.addColorStop(0.5, '#10151c'); g.addColorStop(1, '#05070a'); ctx.fillStyle = g; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    }
    const v = ctx.createRadialGradient(w / 2, h / 2, 250, w / 2, h / 2, 1100); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.93)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    glowAt(ctx, 0, h / 2, 380, 420, CY, 0.16); glowAt(ctx, w, h / 2, 380, 420, RD, 0.16); baseLines(ctx, w, h);
  },
  5(ctx, w, h) { // Scie: luci di una strada notturna (sfumate verso sinistra per non disturbare il testo)
    black(ctx, w, h);
    const lay = document.createElement('canvas'); lay.width = w; lay.height = h; const l = lay.getContext('2d');
    l.globalCompositeOperation = 'lighter';
    const trail = (y0, amp, col, wdt, a, ph) => { l.beginPath(); for (let x = -20; x <= w + 20; x += 8) { const y = y0 + Math.sin(x / 520 + ph) * amp + (x / w) * -130; x < 0 ? l.moveTo(x, y) : l.lineTo(x, y); } l.strokeStyle = col; l.lineWidth = wdt; l.globalAlpha = a; l.filter = `blur(${wdt / 2}px)`; l.stroke(); };
    for (let i = 0; i < 9; i++) { trail(540 + i * 14, 60, C.cyan, 3 + (i % 3) * 2, 0.55 - i * 0.04, i * 0.15); trail(540 + i * 14, 60, '#ffffff', 1, 0.3, i * 0.15); }
    for (let i = 0; i < 7; i++) trail(630 + i * 15, 70, C.red, 3 + (i % 2) * 3, 0.5 - i * 0.06, 1.2 + i * 0.1);
    l.filter = 'none'; l.globalAlpha = 1; l.globalCompositeOperation = 'destination-in';
    const m = l.createLinearGradient(0, 0, w, 0); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(0.34, 'rgba(0,0,0,.08)'); m.addColorStop(0.62, 'rgba(0,0,0,.8)'); m.addColorStop(1, 'rgba(0,0,0,1)');
    l.fillStyle = m; l.fillRect(0, 0, w, h);
    ctx.drawImage(lay, 0, 0); baseLines(ctx, w, h);
  },
  6(ctx, w, h) { // La mia Serie 1: foto dell'auto con dissolvenza
    black(ctx, w, h); const img = window.CAR_IMG;
    ctx.save(); ctx.filter = 'blur(34px) brightness(.55) saturate(1.3)';
    const sc = Math.max(w / img.width, h / img.height) * 1.25; ctx.drawImage(img, (w - img.width * sc) / 2, (h - img.height * sc) / 2, img.width * sc, img.height * sc); ctx.restore(); ctx.filter = 'none';
    ctx.fillStyle = 'rgba(0,0,0,.66)'; ctx.fillRect(0, 0, w, h);
    const oc = document.createElement('canvas'); oc.width = img.width; oc.height = img.height; const o = oc.getContext('2d');
    o.drawImage(img, 0, 0); o.globalCompositeOperation = 'destination-in';
    let g = o.createLinearGradient(0, 0, img.width, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.32, 'rgba(0,0,0,1)'); g.addColorStop(0.9, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    o.fillStyle = g; o.fillRect(0, 0, img.width, img.height);
    g = o.createLinearGradient(0, 0, 0, img.height); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.12, 'rgba(0,0,0,1)'); g.addColorStop(0.86, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    o.fillStyle = g; o.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(oc, w - img.width - 30, (h - img.height) / 2 + 22);
    const v = ctx.createRadialGradient(w * 0.62, h * 0.5, 160, w / 2, h / 2, 1150); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.8)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    baseLines(ctx, w, h);
  },
  music(ctx, w, h) { black(ctx, w, h); glowAt(ctx, 350, 330, 520, 420, CY, 0.12); glowAt(ctx, w * 0.82, h + 60, 800, 260, RD, 0.14); baseLines(ctx, w, h); },
};

/* ---------------------------------------------------------------- elenco asset */
const A = [];
const add = (path, w, h, html) => A.push({ path, w, h, html });
const addCv = (path, w, h, draw) => A.push({ path, w, h, canvas: draw });

// home
Object.entries(CARDS).forEach(([n, ic]) => { const f = n === 'home_icon_carinfo' ? photoCard : (pr) => card(ic, pr); add(`HomePage/${n}_n.png`, 410, 580, f(false)); add(`HomePage/${n}_s.png`, 410, 580, f(true)); });
add('HomePage/home_left_bg.png', 166, 620, `<div style="position:absolute;inset:0 0 0 0;background:linear-gradient(90deg, rgba(0,0,0,.92), rgba(0,0,0,.7))"></div>
  <div style="position:absolute;right:4px;top:0;width:2px;height:100%;background:linear-gradient(180deg, ${C.cyan}, ${C.cyan}22 46%, ${C.red}22 54%, ${C.red});filter:${GL(C.cyan, 4)}"></div>`);
[['home_icon_s_music', 'music'], ['home_icon_s_dail', 'phone'], ['home_icon_s_video', 'video'], ['home_icon_s_set', 'gear']].forEach(([n, ic]) => {
  add(`HomePage/${n}_n.png`, 80, 80, iconAsset(ic, 58, C.white, null, 2.8));
  add(`HomePage/${n}_f.png`, 80, 80, `<div style="position:absolute;inset:0;background:radial-gradient(circle, rgba(61,228,255,.28), rgba(61,228,255,0) 68%)"></div>` + iconAsset(ic, 58, C.hot, C.cyan, 2.8));
});
add('HomePage/home_top_bg.png', 1920, 100, bar(100));
// icone del cruscotto (stesse posizioni del layout)
add('HomePage/dash_consumption.png', 80, 80, iconAsset('fuel', 54, C.hot, C.cyan, 2.6));
add('HomePage/dash_safety.png', 80, 80, iconAsset('belt', 54, C.hot, C.cyan, 2.6));
add('HomePage/dash_p.png', 80, 80, iconAsset('park', 54, C.rhot, C.red, 2.6));
// barra di stato
[['home_back', 'back'], ['home_home', 'home']].forEach(([n, ic]) => {
  add(`status/${n}_n.png`, 154, 92, iconAsset(ic, 50, C.white, null, 3));
  add(`status/${n}_f.png`, 154, 92, `<div style="position:absolute;left:30px;top:14px;width:94px;height:64px">${frame(94, 64, { c: 14, sw: 2, glow: 4 })}</div>` + iconAsset(ic, 50, C.hot, C.cyan, 3));
});
add('status/home_bt.png', 66, 64, iconAsset('bt', 42, C.white, null, 3.4));
add('status/u.png', 66, 64, iconAsset('usb', 42, C.white, null, 3.4));
// sfondi
[1, 2, 3, 4, 5, 6].forEach((n) => {
  addCv(`bg/bg${n}.png`, 1920, 720, (ctx, w, h) => BG[n](ctx, w, h));
  ['n', 'f'].forEach((st) => addCv(`bg/home_bg${n}_${st}.png`, 310, 116, (ctx, w, h) => {
    const c = document.createElement('canvas'); c.width = 1920; c.height = 720; BG[n](c.getContext('2d'), 1920, 720);
    ctx.filter = 'brightness(1.9) contrast(1.08)'; ctx.drawImage(c, 6, 6, w - 12, h - 12); ctx.filter = 'none';   // miniature più chiare: gli sfondi sono quasi neri
    const act = st === 'f';
    ctx.lineJoin = 'round'; ctx.lineWidth = act ? 3 : 1.5; const gr = ctx.createLinearGradient(0, 0, w, h); gr.addColorStop(0, C.cyan); gr.addColorStop(0.55, 'rgba(238,247,255,.4)'); gr.addColorStop(1, C.red); ctx.strokeStyle = act ? gr : 'rgba(190,215,235,.4)';
    if (act) { ctx.shadowColor = C.cyan; ctx.shadowBlur = 8; }
    const p = cham(w - 4, h - 4, 14); ctx.beginPath(); p.forEach(([x, y], i) => (i ? ctx.lineTo(x + 2, y + 2) : ctx.moveTo(x + 2, y + 2))); ctx.closePath(); ctx.stroke(); ctx.shadowBlur = 0;
    if (act) { ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(w - 26, h - 24, 13, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#001018'; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(w - 32, h - 24); ctx.lineTo(w - 27, h - 19); ctx.lineTo(w - 19, h - 29); ctx.stroke(); }
  }));
});
// impostazioni
add('setting/set_base_bg.png', 1920, 112, bar(112));
add('bt/bt_base_bg.png', 1920, 112, bar(112));
[['set_ic_common', 'gear', 124], ['set_ic_eq', 'eq', 125], ['set_ic_wallpaper', 'image', 125], ['set_ic_factory', 'wrench', 124]].forEach(([n, ic, w]) => {
  add(`setting/${n}_n.png`, w, 80, iconAsset(ic, 48, 'rgba(238,247,255,.8)', null, 3));
  add(`setting/${n}_f.png`, w, 80, iconAsset(ic, 48, C.hot, C.cyan, 3));
});
[['set_light', 'sun'], ['set_audio', 'speaker'], ['set_language', 'globe'], ['set_date', 'clock'], ['set_back', 'camera'], ['set_system', 'info']].forEach(([n, ic]) => {
  add(`setting/${n}_n.png`, 50, 50, iconAsset(ic, 38, 'rgba(238,247,255,.8)', null, 3.4));
  add(`setting/${n}_s.png`, n === 'set_audio' ? 52 : 50, n === 'set_audio' ? 52 : 50, iconAsset(ic, 38, C.hot, C.cyan, 3.4));
});
const selRow = (w, h) => `<div style="position:absolute;inset:3px 0;background:linear-gradient(90deg, rgba(61,228,255,.34), rgba(61,228,255,.08) 58%, rgba(61,228,255,0))"></div>
  <div style="position:absolute;left:0;top:10px;bottom:10px;width:4px;background:${C.cyan};filter:${GL(C.cyan, 5)}"></div>`;
add('setting/set_second_menu_select_f.png', 1300, 80, selRow(1300, 80));
add('setting/set_first_menu_select.png', 368, 68, selRow(368, 68));
add('setting/set_second_menu_select_n.png', 1300, 80, `<div style="position:absolute;left:20px;right:20px;bottom:2px;height:1px;background:linear-gradient(90deg, ${C.hair}, rgba(190,215,235,0))"></div>`);
const btn = (w, h, on) => (on ? frame(w, h, { c: 14, sw: 2, glow: 5, fill: '#08183c', color: C.cyan }) + `<div style="position:absolute;inset:4px;clip-path:polygon(${poly(cham(w - 8, h - 8, 12))});background:linear-gradient(180deg, rgba(61,228,255,.34), rgba(31,70,255,.28))"></div>` : frame(w, h, { c: 14, sw: 1.4, fill: 'rgba(6,9,13,.9)', color: C.hair }));
add('setting/set_btn_n.png', 354, 68, btn(354, 68, false)); add('setting/set_btn_f.png', 354, 68, btn(354, 68, true));
add('MusicPlayer/file_btn_n.png', 354, 68, btn(354, 68, false)); add('MusicPlayer/file_btn_f.png', 354, 68, btn(354, 68, true));
const sw = (on) => `<div style="position:absolute;left:3px;top:5px;width:67px;height:29px;border-radius:15px;border:1.8px solid ${on ? C.cyan : C.hair};background:${on ? 'rgba(61,228,255,.2)' : 'rgba(4,7,10,.9)'};box-sizing:border-box;${on ? `filter:${GL(C.cyan, 4)}` : ''}"></div>
  <div style="position:absolute;top:9px;left:${on ? 43 : 8}px;width:21px;height:21px;border-radius:50%;background:${on ? C.hot : '#6b7886'}"></div>`;
add('setting/on.png', 73, 39, sw(true)); add('setting/off.png', 73, 39, sw(false));
add('setting/set_adjust_bg.png', 1200, 42, `<div style="position:absolute;left:8px;right:8px;top:19px;height:3px;border-radius:2px;background:rgba(190,215,235,.2)"></div>`);
add('setting/set_adjust.png', 1200, 42, `<div style="position:absolute;left:8px;right:8px;top:18px;height:5px;border-radius:3px;background:linear-gradient(90deg, ${C.blue}, ${C.cyan});filter:${GL(C.cyan, 4)}"></div>`);
add('setting/set_adjust_click.png', 101, 57, center(`<div style="width:30px;height:30px;border-radius:50%;background:${C.white};box-shadow:0 0 0 3px ${C.cyan}, 0 0 16px ${C.cyan}"></div>`));
add('setting/set_line.png', 1307, 12, `<div style="position:absolute;left:0;right:0;top:5px;height:1.5px;background:linear-gradient(90deg, ${C.cyan}88, rgba(190,215,235,.08) 50%, ${C.red}88)"></div>`);
const panel = (w, h, c, glow) => frame(w, h, { c, sw: 1.8, glow, fill: 'rgba(2,4,7,.94)' });
add('setting/popwbag.png', 654, 357, panel(654, 357, 34, 4) + STRIPE(24, 296, 22, 5));
add('setting/set_right_bg.png', 1424, 464, frame(1424, 464, { c: 34, sw: 1.3, fill: 'rgba(0,0,0,.62)', color: C.hair }));
add('setting/set_fullscreen_bg.png', 1802, 462, frame(1802, 462, { c: 34, sw: 1.3, fill: 'rgba(0,0,0,.62)', color: C.hair }));
add('bt/set_fullscreen_bg.png', 1802, 462, frame(1802, 462, { c: 34, sw: 1.3, fill: 'rgba(0,0,0,.62)', color: C.hair }));
// bluetooth
[['bt_dail', 'keypad'], ['bt_contacts', 'person'], ['bt_record', 'history'], ['bt_music', 'btmusic'], ['bt_set', 'gear']].forEach(([n, ic]) => {
  add(`bt/${n}_n.png`, 125, 80, iconAsset(ic, 48, 'rgba(238,247,255,.8)', null, 3));
  add(`bt/${n}_f.png`, 125, 80, `<div style="position:absolute;inset:6px 4px;">${frame(117, 68, { c: 14, sw: 2, glow: 4 })}</div>` + iconAsset(ic, 48, C.hot, C.cyan, 3));
});
const callBtn = (ic, col, pressed) => `<div style="position:absolute;left:10px;top:10px;width:160px;height:138px">${frame(160, 138, { c: 26, sw: 2.4, glow: pressed ? 9 : 4, color: col, fill: pressed ? col + '55' : 'rgba(4,7,10,.95)' })}</div>` + iconAsset(ic, 70, pressed ? '#fff' : col, col, 3);
add('bt/bt_call_btn1_n.png', 180, 158, callBtn('call', C.green, false)); add('bt/bt_call_btn1_f.png', 180, 158, callBtn('call', C.green, true));
add('bt/bt_call_btn2_n.png', 180, 158, callBtn('hang', C.red, false)); add('bt/bt_call_btn2_f.png', 180, 158, callBtn('hang', C.red, true));
// musica
addCv('MusicPlayer/music_bg.png', 1920, 720, (ctx, w, h) => BG.music(ctx, w, h));
[['music_btn_previous', 'prev', 42], ['music_btn_next', 'next', 42], ['music_btn_play', 'play', 46], ['music_btn_pause', 'pause', 46], ['music_btn_list', 'list', 42], ['music_btn_random', 'shuffle', 42], ['music_btn_single', 'repeat', 42]].forEach(([n, ic, s]) => {
  const big = ic === 'play' || ic === 'pause';
  add(`MusicPlayer/${n}_n.png`, 80, 80, (big ? `<div style="position:absolute;inset:4px;border-radius:50%;border:2px solid ${C.hair};box-sizing:border-box"></div>` : '') + iconAsset(ic, big ? 34 : s, C.white, null, 3.2));
  add(`MusicPlayer/${n}_f.png`, 80, 80, `<div style="position:absolute;inset:4px;border-radius:50%;border:2.6px solid ${C.cyan};background:radial-gradient(circle, rgba(61,228,255,.38), rgba(61,228,255,.06));box-sizing:border-box;filter:${GL(C.cyan, 5)}"></div>` + iconAsset(ic, big ? 34 : s, '#fff', C.cyan, 3.2));
});
add('MusicPlayer/music_slide_bg.png', 1060, 32, `<div style="position:absolute;left:4px;right:4px;top:14px;height:3px;border-radius:2px;background:rgba(190,215,235,.2)"></div>`);
add('MusicPlayer/music_slide.png', 1411, 32, `<div style="position:absolute;left:4px;right:4px;top:13px;height:5px;border-radius:3px;background:linear-gradient(90deg, ${C.blue}, ${C.cyan});filter:${GL(C.cyan, 4)}"></div>`);
add('MusicPlayer/music_slide_btn.png', 32, 32, center(`<div style="width:20px;height:20px;border-radius:50%;background:${C.white};box-shadow:0 0 0 3px ${C.cyan}, 0 0 10px ${C.cyan}"></div>`));
[['music_title', 'title'], ['music_artist', 'person'], ['music_albunm', 'disc']].forEach(([n, ic]) => add(`MusicPlayer/${n}.png`, 76, 76, iconAsset(ic, 44, C.cyan, null, 3)));
const cover = (w, h, left, top, wid) => `<div style="position:absolute;inset:0;clip-path:polygon(${poly(cham(w, h, 26))});overflow:hidden"><img src="${window.CAR_PHOTO}" style="position:absolute;left:${left}px;top:${top}px;width:${wid}px;max-width:none"><div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,0) 62%, rgba(0,0,0,.85))"></div></div>${frame(w, h, { c: 26, sw: 2, glow: 4 })}`;
add('MusicPlayer/music_defaultcover.png', 458, 466, cover(458, 466, -146, -166, 1004) + STRIPE(30, 180, 428, 5));
add('bt/za_btmusic_defaultcover.png', 270, 270, cover(270, 270, -86, -98, 592));
// icone secondarie
[['bt_tmusic_previous_n', 'prev'], ['bt_tmusic_play_n', 'play'], ['bt_tmusic_pause_n', 'pause'], ['bt_tmusic_next_n', 'next']].forEach(([n, ic]) =>
  add(`bt/${n}.png`, 148, 74, `<div style="position:absolute;left:4px;top:4px;width:140px;height:66px">${frame(140, 66, { c: 14, sw: 1.4, color: C.hair, fill: 'rgba(6,9,13,.9)' })}</div>` + iconAsset(ic, 32, C.white, null, 3.2)));
[['bt_s_call_callin', 'phone', C.green], ['bt_s_call_callout', 'phone', C.cyan], ['bt_s_call_callmiss', 'phone', C.red], ['bt_s_contacts', 'person', C.cyan]].forEach(([n, ic, col]) => add(`bt/${n}.png`, 52, 52, iconAsset(ic, 36, col, null, 3.4)));
add('bt/head.png', 80, 80, `<div style="position:absolute;inset:3px;border-radius:50%;border:2px solid ${C.cyan};background:#04070a;box-sizing:border-box;filter:${GL(C.cyan, 4)}"></div>` + iconAsset('person', 44, C.white, null, 3));
add('bt/bt_contacts_download_n.png', 116, 116, `<div style="position:absolute;inset:8px;border-radius:50%;border:2px solid ${C.cyan};box-sizing:border-box;background:#04070a"></div>` + iconAsset('download', 50, C.white, null, 3.2));
[['file_music', 'music', C.cyan], ['file_usbr_n', 'usb', 'rgba(238,247,255,.85)'], ['file_usbr_s', 'usb', C.cyan], ['file_local_n', 'disc', 'rgba(238,247,255,.85)'], ['file_local_s', 'disc', C.cyan]].forEach(([n, ic, col]) =>
  add(`MusicPlayer/${n}.png`, 48, 48, iconAsset(ic, 36, col, null, 3.4)));
add('media/video_load.png', 680, 431, frame(680, 431, { c: 40, sw: 1.8, glow: 3, fill: 'card' }) + center(svgIcon('video', 160, C.white, 2.4, `filter:${GL('#7fdcff', 7)}`)) + STRIPE(30, 290, 392, 5));
window.ASSETS = A;
window.renderAsset = (i) => {
  const a = A[i], root = document.getElementById('root');
  root.innerHTML = ''; const el = document.createElement('div'); el.id = 'a';
  el.style.cssText = `position:relative;width:${a.w}px;height:${a.h}px;overflow:hidden`;
  root.append(el);
  if (a.canvas) { const c = document.createElement('canvas'); c.width = a.w; c.height = a.h; c.style.display = 'block'; el.append(c); a.canvas(c.getContext('2d'), a.w, a.h); } else el.innerHTML = a.html;
  return a.path;
};
