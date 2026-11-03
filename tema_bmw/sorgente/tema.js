/* Tema "M Cluster" per il display FlyThings 1920×720.
   Direzione: superfici nere e silenziose, la luce fa la gerarchia. Accento ciano a sinistra / rosso a destra solo dove serve
   (stato attivo, cruscotto, linee di base); tricolore come firma minima; logo M fornito dall'utente per avvio, copertine e sfondo.
   Icone: Lucide (ISC), tratto sottile e coerente. Nessuna foto.
   Ogni voce di ASSETS disegna un PNG alle dimensioni ESATTE dell'originale (build.js le verifica sul backup).
   Il cruscotto (finestre trasparenti) è generato da dash_bg.py. */
const C = {
  ink: '#05070a', cyan: '#3de4ff', hot: '#cdf6ff', blue: '#1f46ff', red: '#ff3345', rhot: '#ffd2d7', green: '#22c96e',
  white: '#f2f7fb', dim: 'rgba(242,247,251,.72)', hair: 'rgba(255,255,255,.09)', hair2: 'rgba(255,255,255,.16)',
};
const GL = (c, r) => `drop-shadow(0 0 ${r}px ${c})`;

/* ---------------------------------------------------------------- icone */
const CUSTOM = {   // nello stesso stile di Lucide (griglia 24, tratto arrotondato)
  'usb-plug': '<path d="M9 2h6v5H9z"/><path d="M6 7h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5z"/><path d="M12 18v4"/>',
  'sd-card': '<path d="M8 3h7l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M10 7v3M13 7v3M16 8v2"/>',
  seatbelt: '<circle cx="12" cy="4" r="2"/><path d="M8.5 21 9 11a3 3 0 0 1 6 0l.5 10"/><path d="M15 9.5 9.2 17.5"/><path d="M7 21h10"/>',
};
const ICONS = Object.assign({}, window.LUCIDE, CUSTOM);
const LU = (name, size, color, sw = 1.5, glow = '') => {
  if (!ICONS[name]) throw new Error('icona mancante: ' + name);
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="${glow ? `filter:${glow}` : ''}">${ICONS[name]}</svg>`;
};
const center = (inner) => `<div style="position:absolute;inset:0;display:grid;place-items:center">${inner}</div>`;
const icon = (name, size, color, sw, glow) => center(LU(name, size, color, sw, glow));
const TRI = (x, y, w = 22, h = 3, a = 0.9) => `<div style="position:absolute;left:${x}px;top:${y}px;display:flex;gap:4px;transform:skewX(-20deg);opacity:${a}">
  <i style="width:${w}px;height:${h}px;background:${C.cyan}"></i><i style="width:${w}px;height:${h}px;background:${C.blue}"></i><i style="width:${w}px;height:${h}px;background:${C.red}"></i></div>`;

/* superficie "tile": nero con gradiente quasi impercettibile, filo di luce in alto, bordo sottile */
function tile(x, y, w, h, o = {}) {
  const { r = 18, on = false, fill = 'linear-gradient(180deg, #10161d 0%, #070a0e 55%, #030406 100%)' } = o;
  return `<div style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:${r}px;background:${fill};
    box-shadow: inset 0 1px 0 rgba(255,255,255,.11), inset 0 0 0 1px ${on ? 'rgba(61,228,255,.78)' : C.hair}${on ? ', 0 0 22px rgba(61,228,255,.28)' : ''}"></div>`;
}

/* ---------------------------------------------------------------- card della home (410×580) */
function card(name, on) {
  const w = 410, h = 580;
  return `${tile(8, 8, w - 16, h - 16, { r: 22, on, fill: on ? 'linear-gradient(180deg, #102030 0%, #08121b 50%, #030609 100%)' : undefined })}
    <div style="position:absolute;left:44px;right:44px;bottom:10px;height:150px;border-radius:0 0 22px 22px;background:radial-gradient(ellipse at 50% 100%, ${on ? 'rgba(61,228,255,.30)' : 'rgba(31,70,255,.20)'}, rgba(0,0,0,0) 70%)"></div>
    <div style="position:absolute;left:0;right:0;top:250px;height:160px;display:grid;place-items:center">${LU(name, 136, on ? C.hot : C.white, 1.15, on ? `${GL('rgba(61,228,255,.75)', 10)} ${GL('rgba(61,228,255,.35)', 26)}` : GL('rgba(61,228,255,.22)', 12))}</div>
    ${TRI(36, h - 46, 20, 3, on ? 1 : 0.75)}`;
}
const CARDS = { home_icon_wiredcarplay: 'monitor-smartphone', home_icon_androidauto: 'navigation', home_icon_bluetooth: 'bluetooth', za_home_icon_music: 'music',
  home_icon_hidvideo: 'clapperboard', home_icon_dashboard: 'gauge', home_icon_carinfo: 'car-front', home_bg: 'image', home_sound: 'sliders-vertical',
  home_icon_zlink: 'settings', home_icon_dvr: 'cctv', home_icon_miracast: 'cast', home_icon_airplay: 'cast', home_icon_hicar: 'link-2', home_icon_carlife: 'circle-dot' };

/* ---------------------------------------------------------------- barre */
const bar = () => `<div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,.86), rgba(0,0,0,.4))"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg, rgba(61,228,255,.55), rgba(255,255,255,.08) 30%, rgba(255,255,255,.08) 70%, rgba(255,51,69,.55))"></div>`;

/* ---------------------------------------------------------------- sfondi (canvas) */
const CY = '61,228,255', RD = '255,51,69', BL = '31,70,255';
function glowAt(ctx, x, y, rx, ry, rgb, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(rx / ry, 1);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, ry, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
const black = (ctx, w, h) => { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h); };
function baseLines(ctx, w, h, y = h - 20, a = 0.9) {   // le linee di base del cluster: ciano da sinistra, rosso da destra
  for (const [x0, x1, c, rgb, left] of [[0, w * 0.47, C.cyan, CY, true], [w * 0.53, w, C.red, RD, false]]) {
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, `rgba(${rgb},${left ? a : 0})`); g.addColorStop(1, `rgba(${rgb},${left ? 0 : a})`);
    ctx.save(); ctx.shadowColor = c; ctx.shadowBlur = 10; ctx.fillStyle = g; ctx.fillRect(x0, y, x1 - x0, 1.6); ctx.restore();
  }
}
function chevronLines(ctx, w, h, a) {   // grandi chevron del cruscotto, appena accennati
  const draw = (pts, col) => { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.shadowColor = col; ctx.shadowBlur = 16; ctx.globalAlpha = a; ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); };
  draw([[620, 70], [300, 70], [110, 360], [300, 650], [880, 650]], C.cyan);
  draw([[1300, 70], [1620, 70], [1810, 360], [1620, 650], [1040, 650]], C.red);
}
function logoAt(ctx, cx, cy, hgt, alpha = 1) {
  const img = window.LOGO_IMG; const s = hgt / img.height;
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'lighter';
  ctx.drawImage(img, cx - img.width * s / 2, cy - hgt / 2, img.width * s, hgt); ctx.restore();
}
const BG = {
  1(ctx, w, h) { black(ctx, w, h); glowAt(ctx, w * 0.1, h + 30, 700, 200, CY, 0.12); glowAt(ctx, w * 0.9, h + 30, 700, 200, RD, 0.11); baseLines(ctx, w, h); },
  2(ctx, w, h) { // Orizzonte
    black(ctx, w, h); const y = 470;
    const g = ctx.createLinearGradient(0, 0, w, 0); g.addColorStop(0, `rgba(${CY},0)`); g.addColorStop(0.32, `rgba(${CY},.9)`); g.addColorStop(0.5, 'rgba(235,250,255,.95)'); g.addColorStop(0.68, `rgba(${RD},.9)`); g.addColorStop(1, `rgba(${RD},0)`);
    ctx.save(); ctx.shadowColor = C.cyan; ctx.shadowBlur = 18; ctx.fillStyle = g; ctx.fillRect(0, y, w, 1.6); ctx.restore();
    glowAt(ctx, w * 0.32, y, 760, 110, CY, 0.10); glowAt(ctx, w * 0.68, y, 760, 110, RD, 0.09);
    for (let i = 1; i < 22; i++) { const yy = y + i * i * 0.85; if (yy > h) break; ctx.fillStyle = `rgba(170,220,255,${Math.max(0.085 - i * 0.004, 0)})`; ctx.fillRect(0, yy, w, 1); }
  },
  3(ctx, w, h) { // M: il logo dell'utente, a destra, con dissolvenza
    black(ctx, w, h); logoAt(ctx, w * 0.62, h * 0.5, h * 1.0, 0.95);
    const v = ctx.createLinearGradient(0, 0, w, 0); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.28, 'rgba(0,0,0,.92)'); v.addColorStop(0.5, 'rgba(0,0,0,.25)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    const t = ctx.createLinearGradient(0, 0, 0, h); t.addColorStop(0, 'rgba(0,0,0,.6)'); t.addColorStop(0.25, 'rgba(0,0,0,0)'); t.addColorStop(0.8, 'rgba(0,0,0,0)'); t.addColorStop(1, 'rgba(0,0,0,.65)');
    ctx.fillStyle = t; ctx.fillRect(0, 0, w, h); baseLines(ctx, w, h, h - 20, 0.7);
  },
  4(ctx, w, h) { // Carbonio
    black(ctx, w, h); const s = 12;
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
      const odd = ((x / s) + (y / s)) % 2; const g = odd ? ctx.createLinearGradient(x, y, x + s, y) : ctx.createLinearGradient(x, y, x, y + s);
      g.addColorStop(0, '#040507'); g.addColorStop(0.5, '#0d1116'); g.addColorStop(1, '#040507'); ctx.fillStyle = g; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    }
    const v = ctx.createRadialGradient(w / 2, h * 0.45, 200, w / 2, h / 2, 1100); v.addColorStop(0, 'rgba(0,0,0,.15)'); v.addColorStop(1, 'rgba(0,0,0,.94)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    baseLines(ctx, w, h);
  },
  5(ctx, w, h) { // Scie (sfumate verso sinistra per non disturbare il testo)
    black(ctx, w, h);
    const lay = document.createElement('canvas'); lay.width = w; lay.height = h; const l = lay.getContext('2d'); l.globalCompositeOperation = 'lighter';
    const trail = (y0, amp, col, wdt, a, ph) => { l.beginPath(); for (let x = -20; x <= w + 20; x += 6) { const y = y0 + Math.sin(x / 520 + ph) * amp + (x / w) * -130; x < 0 ? l.moveTo(x, y) : l.lineTo(x, y); } l.strokeStyle = col; l.lineWidth = wdt; l.globalAlpha = a; l.filter = `blur(${wdt / 2}px)`; l.stroke(); };
    for (let i = 0; i < 9; i++) { trail(540 + i * 14, 60, C.cyan, 2.5 + (i % 3) * 1.5, 0.5 - i * 0.04, i * 0.15); trail(540 + i * 14, 60, '#ffffff', 0.8, 0.26, i * 0.15); }
    for (let i = 0; i < 7; i++) trail(630 + i * 15, 70, C.red, 2.5 + (i % 2) * 2.5, 0.45 - i * 0.05, 1.2 + i * 0.1);
    l.filter = 'none'; l.globalAlpha = 1; l.globalCompositeOperation = 'destination-in';
    const m = l.createLinearGradient(0, 0, w, 0); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(0.34, 'rgba(0,0,0,.06)'); m.addColorStop(0.62, 'rgba(0,0,0,.75)'); m.addColorStop(1, 'rgba(0,0,0,1)');
    l.fillStyle = m; l.fillRect(0, 0, w, h); ctx.drawImage(lay, 0, 0); baseLines(ctx, w, h);
  },
  6(ctx, w, h) { // Chevron: l'eco del cruscotto
    black(ctx, w, h); chevronLines(ctx, w, h, 0.35); glowAt(ctx, 200, 360, 300, 380, CY, 0.06); glowAt(ctx, w - 200, 360, 300, 380, RD, 0.06);
  },
  music(ctx, w, h) { black(ctx, w, h); glowAt(ctx, 360, 330, 560, 420, BL, 0.16); glowAt(ctx, w * 0.84, h + 40, 820, 240, RD, 0.10); baseLines(ctx, w, h, h - 20, 0.6); },
};

/* ---------------------------------------------------------------- elenco asset */
const A = [];
const add = (path, w, h, html) => A.push({ path, w, h, html });
const addCv = (path, w, h, draw) => A.push({ path, w, h, canvas: draw });

// home
Object.entries(CARDS).forEach(([n, ic]) => { add(`HomePage/${n}_n.png`, 410, 580, card(ic, false)); add(`HomePage/${n}_s.png`, 410, 580, card(ic, true)); });
add('HomePage/home_left_bg.png', 166, 620, `<div style="position:absolute;inset:0;background:linear-gradient(90deg, rgba(0,0,0,.94), rgba(0,0,0,.78))"></div>
  <div style="position:absolute;right:0;top:0;width:1px;height:100%;background:linear-gradient(180deg, rgba(61,228,255,.6), rgba(255,255,255,.07) 35%, rgba(255,255,255,.07) 65%, rgba(255,51,69,.6))"></div>`);
[['home_icon_s_music', 'music'], ['home_icon_s_dail', 'phone'], ['home_icon_s_video', 'clapperboard'], ['home_icon_s_set', 'settings']].forEach(([n, ic]) => {
  add(`HomePage/${n}_n.png`, 80, 80, icon(ic, 46, C.white, 1.6));
  add(`HomePage/${n}_f.png`, 80, 80, `<div style="position:absolute;inset:2px;border-radius:50%;background:radial-gradient(circle, rgba(61,228,255,.24), rgba(61,228,255,0) 70%)"></div>` + icon(ic, 46, C.hot, 1.6, GL('rgba(61,228,255,.8)', 6)));
});
add('HomePage/home_top_bg.png', 1920, 100, bar());
// icone del cruscotto (stesse posizioni del layout)
add('HomePage/dash_consumption.png', 80, 80, icon('fuel', 46, C.hot, 1.6, GL('rgba(61,228,255,.6)', 6)));
add('HomePage/dash_safety.png', 80, 80, icon('seatbelt', 46, C.rhot, 1.6, GL('rgba(255,51,69,.7)', 6)));
add('HomePage/dash_p.png', 80, 80, icon('circle-parking', 46, C.rhot, 1.6, GL('rgba(255,51,69,.7)', 6)));
// barra di stato
[['home_back', 'undo-2'], ['home_home', 'house']].forEach(([n, ic]) => {
  add(`status/${n}_n.png`, 154, 92, icon(ic, 40, C.white, 1.7));
  add(`status/${n}_f.png`, 154, 92, tile(33, 14, 88, 64, { r: 16, on: true, fill: 'rgba(61,228,255,.12)' }) + icon(ic, 40, C.hot, 1.7, GL('rgba(61,228,255,.7)', 5)));
});
add('status/home_bt.png', 66, 64, icon('bluetooth', 36, C.white, 1.7));
add('status/home_bt_f.png', 66, 64, icon('bluetooth', 36, C.hot, 1.7, GL('rgba(61,228,255,.8)', 5)));
add('status/sd.png', 66, 64, icon('sd-card', 34, C.white, 1.7));
[1, 2].forEach((n) => add(`status/usb${n}.png`, 66, 64, `<div style="position:absolute;left:6px;top:8px">${LU('usb-plug', 30, C.white, 1.7)}</div><div style="position:absolute;right:8px;bottom:8px;font:600 16px Inter, sans-serif;color:${C.white}">${n}</div>`));
// cornici di fuoco (rotella/selezione): stesse forme delle card e dei pulsanti
add('HomePage/home_right_biao.png', 410, 580, `<div style="position:absolute;left:8px;top:8px;right:8px;bottom:8px;border-radius:22px;box-shadow:inset 0 0 0 2px ${C.cyan}, 0 0 18px rgba(61,228,255,.5)"></div>`);
add('HomePage/home_menu_select.png', 100, 100, `<div style="position:absolute;inset:6px;border-radius:18px;background:rgba(61,228,255,.10);box-shadow:inset 0 0 0 1.5px ${C.cyan}, 0 0 12px rgba(61,228,255,.45)"></div>`);
add('status/u.png', 66, 64, icon('usb', 36, C.white, 1.7));
// sfondi + miniature
[1, 2, 3, 4, 5, 6].forEach((n) => {
  addCv(`bg/bg${n}.png`, 1920, 720, (ctx, w, h) => BG[n](ctx, w, h));
  ['n', 'f'].forEach((st) => addCv(`bg/home_bg${n}_${st}.png`, 310, 116, (ctx, w, h) => {
    const c = document.createElement('canvas'); c.width = 1920; c.height = 720; BG[n](c.getContext('2d'), 1920, 720);
    const act = st === 'f', r = 12;
    ctx.save(); ctx.beginPath(); ctx.roundRect(5, 5, w - 10, h - 10, r); ctx.clip();
    ctx.filter = 'brightness(1.8) contrast(1.06)'; ctx.drawImage(c, 5, 5, w - 10, h - 10); ctx.filter = 'none'; ctx.restore();
    ctx.beginPath(); ctx.roundRect(act ? 4 : 5.5, act ? 4 : 5.5, w - (act ? 8 : 11), h - (act ? 8 : 11), r);
    ctx.lineWidth = act ? 2.5 : 1; ctx.strokeStyle = act ? C.cyan : 'rgba(255,255,255,.16)';
    if (act) { ctx.shadowColor = C.cyan; ctx.shadowBlur = 10; } ctx.stroke(); ctx.shadowBlur = 0;
    if (act) { ctx.fillStyle = C.cyan; ctx.beginPath(); ctx.arc(w - 26, h - 24, 12, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#00141c'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(w - 31.5, h - 24); ctx.lineTo(w - 27, h - 19.5); ctx.lineTo(w - 20, h - 28); ctx.stroke(); }
  }));
});
// impostazioni
add('setting/set_base_bg.png', 1920, 112, bar());
add('bt/bt_base_bg.png', 1920, 112, bar());
[['set_ic_common', 'settings', 124], ['set_ic_eq', 'sliders-vertical', 125], ['set_ic_wallpaper', 'image', 125], ['set_ic_factory', 'wrench', 124]].forEach(([n, ic, w]) => {
  add(`setting/${n}_n.png`, w, 80, icon(ic, 38, C.dim, 1.7));
  add(`setting/${n}_f.png`, w, 80, icon(ic, 38, C.hot, 1.7, GL('rgba(61,228,255,.75)', 6)));
});
[['set_light', 'sun'], ['set_audio', 'volume-2'], ['set_language', 'globe'], ['set_date', 'clock'], ['set_back', 'camera'], ['set_system', 'info']].forEach(([n, ic]) => {
  add(`setting/${n}_n.png`, 50, 50, icon(ic, 30, C.dim, 1.8));
  add(`setting/${n}_s.png`, n === 'set_audio' ? 52 : 50, n === 'set_audio' ? 52 : 50, icon(ic, 30, C.hot, 1.8, GL('rgba(61,228,255,.75)', 5)));
});
const selRow = () => `<div style="position:absolute;left:0;right:0;top:4px;bottom:4px;border-radius:0 10px 10px 0;background:linear-gradient(90deg, rgba(61,228,255,.22), rgba(61,228,255,.06) 55%, rgba(61,228,255,0))"></div>
  <div style="position:absolute;left:0;top:14px;bottom:14px;width:3px;border-radius:2px;background:${C.cyan};box-shadow:0 0 10px ${C.cyan}"></div>`;
add('setting/set_second_menu_select_f.png', 1300, 80, selRow());
add('setting/set_first_menu_select.png', 368, 68, selRow());
add('setting/set_second_menu_select_n.png', 1300, 80, `<div style="position:absolute;left:24px;right:24px;bottom:1px;height:1px;background:linear-gradient(90deg, ${C.hair2}, rgba(255,255,255,0))"></div>`);
const btn = (w, h, on) => tile(3, 3, w - 6, h - 6, { r: 12, on, fill: on ? 'linear-gradient(180deg, #17407e 0%, #0c2552 100%)' : 'linear-gradient(180deg, #11161c, #0a0d11)' });
add('setting/set_btn_n.png', 354, 68, btn(354, 68, false)); add('setting/set_btn_f.png', 354, 68, btn(354, 68, true));
add('MusicPlayer/file_btn_n.png', 354, 68, btn(354, 68, false)); add('MusicPlayer/file_btn_f.png', 354, 68, btn(354, 68, true));
const sw = (on) => `<div style="position:absolute;left:4px;top:6px;width:65px;height:27px;border-radius:14px;background:${on ? 'linear-gradient(90deg, #1f46ff, #3de4ff)' : '#1a1f26'};box-shadow:inset 0 0 0 1px ${on ? 'rgba(255,255,255,.2)' : C.hair2}${on ? ', 0 0 10px rgba(61,228,255,.45)' : ''}"></div>
  <div style="position:absolute;top:9px;left:${on ? 43 : 7}px;width:21px;height:21px;border-radius:50%;background:${on ? '#fff' : '#8a94a1'};box-shadow:0 1px 3px rgba(0,0,0,.6)"></div>`;
add('setting/on.png', 73, 39, sw(true)); add('setting/off.png', 73, 39, sw(false));
add('setting/set_adjust_bg.png', 1200, 42, `<div style="position:absolute;left:8px;right:8px;top:19px;height:4px;border-radius:2px;background:rgba(255,255,255,.13)"></div>`);
add('setting/set_adjust.png', 1200, 42, `<div style="position:absolute;left:8px;right:8px;top:19px;height:4px;border-radius:2px;background:linear-gradient(90deg, #1f46ff, #3de4ff);box-shadow:0 0 8px rgba(61,228,255,.55)"></div>`);
add('setting/set_adjust_click.png', 101, 57, center(`<div style="width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(61,228,255,.9), 0 0 12px rgba(61,228,255,.6), 0 2px 4px rgba(0,0,0,.6)"></div>`));
add('setting/set_line.png', 1307, 12, `<div style="position:absolute;left:0;right:0;top:5px;height:1px;background:linear-gradient(90deg, rgba(255,255,255,.14), rgba(255,255,255,.03))"></div>`);
add('setting/popwbag.png', 654, 357, tile(4, 4, 646, 349, { r: 22, fill: 'linear-gradient(180deg, #121820, #07090d)' }) + TRI(281, 26, 24, 3, 1));
const panel = (w, h) => tile(2, 2, w - 4, h - 4, { r: 20, fill: 'rgba(8,11,15,.72)' });
add('setting/set_right_bg.png', 1424, 464, panel(1424, 464));
add('setting/set_fullscreen_bg.png', 1802, 462, panel(1802, 462));
add('bt/set_fullscreen_bg.png', 1802, 462, panel(1802, 462));
// bluetooth
[['bt_dail', 'grid-3x3'], ['bt_contacts', 'contact-round'], ['bt_record', 'history'], ['bt_music', 'audio-lines'], ['bt_set', 'settings']].forEach(([n, ic]) => {
  add(`bt/${n}_n.png`, 125, 80, icon(ic, 36, C.dim, 1.7));
  add(`bt/${n}_f.png`, 125, 80, `<div style="position:absolute;inset:6px 6px;border-radius:14px;background:rgba(61,228,255,.12);box-shadow:inset 0 0 0 1px rgba(61,228,255,.65)"></div>` + icon(ic, 36, C.hot, 1.7, GL('rgba(61,228,255,.7)', 5)));
});
const callBtn = (ic, col, on) => tile(12, 12, 156, 134, { r: 30, on: false, fill: on ? col : 'linear-gradient(180deg, #12171d, #080a0d)' })
  + `<div style="position:absolute;left:12px;top:12px;width:156px;height:134px;border-radius:30px;box-shadow:inset 0 0 0 1.5px ${col}${on ? `, 0 0 26px ${col}88` : ''}"></div>` + icon(ic, 58, on ? '#fff' : col, 1.8);
add('bt/bt_call_btn1_n.png', 180, 158, callBtn('phone', C.green, false)); add('bt/bt_call_btn1_f.png', 180, 158, callBtn('phone', C.green, true));
add('bt/bt_call_btn2_n.png', 180, 158, callBtn('phone-off', C.red, false)); add('bt/bt_call_btn2_f.png', 180, 158, callBtn('phone-off', C.red, true));
// musica
addCv('MusicPlayer/music_bg.png', 1920, 720, (ctx, w, h) => BG.music(ctx, w, h));
[['music_btn_previous', 'skip-back'], ['music_btn_next', 'skip-forward'], ['music_btn_play', 'play'], ['music_btn_pause', 'pause'], ['music_btn_list', 'list-music'], ['music_btn_random', 'shuffle'], ['music_btn_single', 'repeat']].forEach(([n, ic]) => {
  const big = ic === 'play' || ic === 'pause';
  add(`MusicPlayer/${n}_n.png`, 80, 80, (big ? `<div style="position:absolute;inset:3px;border-radius:50%;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.28)"></div>` : '') + icon(ic, big ? 34 : 36, C.white, 1.7));
  add(`MusicPlayer/${n}_f.png`, 80, 80, `<div style="position:absolute;inset:3px;border-radius:50%;background:radial-gradient(circle, rgba(61,228,255,.32), rgba(61,228,255,.08));box-shadow:inset 0 0 0 1.5px rgba(61,228,255,.85), 0 0 14px rgba(61,228,255,.4)"></div>` + icon(ic, big ? 34 : 36, '#fff', 1.7));
});
add('MusicPlayer/music_slide_bg.png', 1060, 32, `<div style="position:absolute;left:4px;right:4px;top:14px;height:4px;border-radius:2px;background:rgba(255,255,255,.13)"></div>`);
add('MusicPlayer/music_slide.png', 1411, 32, `<div style="position:absolute;left:4px;right:4px;top:14px;height:4px;border-radius:2px;background:linear-gradient(90deg, #1f46ff, #3de4ff);box-shadow:0 0 8px rgba(61,228,255,.55)"></div>`);
add('MusicPlayer/video_slide.png', 1058, 8, `<div style="position:absolute;left:0;right:0;top:2px;height:4px;border-radius:2px;background:linear-gradient(90deg, #1f46ff, #3de4ff);box-shadow:0 0 6px rgba(61,228,255,.55)"></div>`);
add('MusicPlayer/video_slide_btn.png', 32, 32, center(`<div style="width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(61,228,255,.9), 0 0 8px rgba(61,228,255,.6)"></div>`));
add('MusicPlayer/file_choice.png', 1312, 62, `<div style="position:absolute;left:0;right:0;top:3px;bottom:3px;border-radius:0 10px 10px 0;background:linear-gradient(90deg, rgba(61,228,255,.22), rgba(61,228,255,.05) 60%, rgba(61,228,255,0))"></div><div style="position:absolute;left:0;top:12px;bottom:12px;width:3px;border-radius:2px;background:${C.cyan};box-shadow:0 0 10px ${C.cyan}"></div>`);
add('MusicPlayer/music_slide_btn.png', 32, 32, center(`<div style="width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(61,228,255,.9), 0 0 8px rgba(61,228,255,.6)"></div>`));
[['music_title', 'music'], ['music_artist', 'user-round'], ['music_albunm', 'disc-3']].forEach(([n, ic]) => add(`MusicPlayer/${n}.png`, 76, 76, icon(ic, 34, C.cyan, 1.7)));
const cover = (w, h, imgW, left, top) => `<div style="position:absolute;inset:3px;border-radius:22px;overflow:hidden;background:#000;box-shadow:inset 0 0 0 1px ${C.hair}">
  <img src="${window.LOGO_DATA}" style="position:absolute;left:${left}px;top:${top}px;width:${imgW}px;max-width:none"></div>
  <div style="position:absolute;inset:3px;border-radius:22px;box-shadow:inset 0 1px 0 rgba(255,255,255,.12), inset 0 0 0 1px ${C.hair}"></div>`;
add('MusicPlayer/music_defaultcover.png', 458, 466, cover(458, 466, 670, -106, 6));
add('bt/za_btmusic_defaultcover.png', 270, 270, cover(270, 270, 395, -62, 3));
// icone secondarie
[['bt_tmusic_previous_n', 'skip-back'], ['bt_tmusic_play_n', 'play'], ['bt_tmusic_pause_n', 'pause'], ['bt_tmusic_next_n', 'skip-forward']].forEach(([n, ic]) =>
  add(`bt/${n}.png`, 148, 74, tile(4, 4, 140, 66, { r: 16 }) + icon(ic, 30, C.white, 1.8)));
[['bt_s_call_callin', 'phone-incoming', C.green], ['bt_s_call_callout', 'phone-outgoing', C.cyan], ['bt_s_call_callmiss', 'phone-missed', C.red], ['bt_s_contacts', 'contact-round', C.cyan]].forEach(([n, ic, col]) =>
  add(`bt/${n}.png`, 52, 52, icon(ic, 30, col, 1.8)));
add('bt/head.png', 80, 80, `<div style="position:absolute;inset:4px;border-radius:50%;background:#0b1016;box-shadow:inset 0 0 0 1.5px rgba(61,228,255,.7)"></div>` + icon('user-round', 38, C.white, 1.6));
add('bt/bt_contacts_download_n.png', 116, 116, `<div style="position:absolute;inset:10px;border-radius:50%;background:#0b1016;box-shadow:inset 0 0 0 1.5px ${C.hair2}"></div>` + icon('download', 40, C.white, 1.7));
[['file_music', 'music', C.cyan], ['file_usbr_n', 'usb', C.dim], ['file_usbr_s', 'usb', C.cyan], ['file_local_n', 'disc-3', C.dim], ['file_local_s', 'disc-3', C.cyan]].forEach(([n, ic, col]) =>
  add(`MusicPlayer/${n}.png`, 48, 48, icon(ic, 30, col, 1.8)));
add('media/video_load.png', 680, 431, tile(4, 4, 672, 423, { r: 26 }) + icon('clapperboard', 120, C.white, 1.2, GL('rgba(61,228,255,.3)', 12)) + TRI(296, 384, 24, 3));
window.ASSETS = A;
window.renderAsset = (i) => {
  const a = A[i], root = document.getElementById('root');
  root.innerHTML = ''; const el = document.createElement('div'); el.id = 'a';
  el.style.cssText = `position:relative;width:${a.w}px;height:${a.h}px;overflow:hidden`;
  root.append(el);
  if (a.canvas) { const c = document.createElement('canvas'); c.width = a.w; c.height = a.h; c.style.display = 'block'; el.append(c); a.canvas(c.getContext('2d'), a.w, a.h); } else el.innerHTML = a.html;
  return a.path;
};
