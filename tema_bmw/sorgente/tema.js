/* Tema "BMW" per il display FlyThings 1920×720.
   Ogni voce di ASSETS disegna un PNG alle dimensioni ESATTE dell'originale.
   Palette: nero notte, blu BMW, azzurro/blu scuro/rosso "M", acciaio. */
const C = {
  night: '#04070c', deep: '#081120', panel: '#0c1628', steel: '#1b2638', line: '#2c3d57',
  blue: '#2a62cc', ice: '#5f9bff', mblue: '#1d4e8f', red: '#e3242b', white: '#f2f5f9', chrome: '#c8d2df',
};

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
  repeat: '<path d="M12 30v-4a8 8 0 0 1 8-8h32"/><path d="M46 12l6 6-6 6"/><path d="M52 34v4a8 8 0 0 1-8 8H12"/><path d="M18 52l-6-6 6-6"/><path d="M30 26l4-2v16" />',
  title: '<path d="M24 46V15l26-6v31"/><circle cx="18" cy="46" r="6.5"/><circle cx="44" cy="40" r="6.5"/>',
  disc: '<circle cx="32" cy="32" r="23"/><circle cx="32" cy="32" r="6"/><path d="M32 14a18 18 0 0 1 18 18"/>',
  hang: '<path d="M8 36c14-12 34-12 48 0l-4 8-10-3v-6c-6-2-14-2-20 0v6l-10 3z" class="f"/>',
  call: '<path d="M21 9h-7a4 4 0 0 0-4 4c0 23 18 42 41 42a4 4 0 0 0 4-4v-7l-11-5-5 5c-7-3-13-9-16-16l5-5z" class="f"/>',
  download: '<path d="M32 10v30M20 28l12 12 12-12"/><path d="M12 46v6h40v-6"/>',
};
const svgIcon = (name, size, color, sw = 3, extra = '') =>
  `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="${extra}"><style>.f{fill:${color};stroke:none}.r{fill:${C.red}}</style>${ICON[name]}</svg>`;

/* ---------------------------------------------------------------- elementi base */
const STRIPE = (w, x, y, h = 4) => `<div style="position:absolute;left:${x}px;top:${y}px;display:flex;gap:3px;transform:skewX(-20deg)">
  <i style="width:${w}px;height:${h}px;background:${C.ice}"></i><i style="width:${w}px;height:${h}px;background:${C.mblue}"></i><i style="width:${w}px;height:${h}px;background:${C.red}"></i></div>`;

function card(icon, pressed) {
  const glow = pressed ? C.ice : C.blue;
  return `<div style="position:absolute;inset:0;border-radius:18px;overflow:hidden;
      background:linear-gradient(180deg, ${pressed ? '#13274a' : '#0d1830'} 0%, ${pressed ? '#0a1526' : '#070d18'} 62%, #04070c 100%);
      box-shadow: inset 0 0 0 ${pressed ? 3 : 1.5}px ${pressed ? 'rgba(95,155,255,.85)' : 'rgba(150,180,220,.16)'};">
    <div style="position:absolute;inset:0;background:linear-gradient(115deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 70%, rgba(95,155,255,.05) 100%)"></div>
    <div style="position:absolute;left:36px;right:36px;top:95px;height:1.5px;background:linear-gradient(90deg, transparent, rgba(200,210,223,.55) 20%, rgba(200,210,223,.55) 80%, transparent)"></div>
    ${STRIPE(16, 171, 91, 9)}
    <div style="position:absolute;left:205px;top:318px;width:248px;height:248px;margin:-124px 0 0 -124px;border-radius:50%;
      background:radial-gradient(circle at 50% 35%, ${pressed ? '#1b3a6b' : '#13233f'} 0%, #0a1323 60%, #060b14 100%);
      box-shadow: 0 0 0 2px rgba(200,210,223,.35), 0 0 0 7px rgba(10,18,32,.9), 0 0 0 8.5px ${pressed ? 'rgba(95,155,255,.9)' : 'rgba(42,98,204,.55)'}, 0 0 ${pressed ? 70 : 40}px ${pressed ? 'rgba(95,155,255,.55)' : 'rgba(42,98,204,.30)'};
      display:grid;place-items:center">${svgIcon(icon, 128, pressed ? C.ice : C.white, 2.6, `filter:drop-shadow(0 0 ${pressed ? 14 : 6}px ${glow})`)}</div>
    <div style="position:absolute;left:55px;right:55px;bottom:-60px;height:130px;border-radius:50%;background:radial-gradient(ellipse, ${pressed ? 'rgba(95,155,255,.45)' : 'rgba(42,98,204,.28)'}, transparent 70%)"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg, transparent, ${glow}, transparent)"></div>
  </div>`;
}
/* card con la FOTO dell'auto (Info veicolo) */
function photoCard(pressed) {
  const glow = pressed ? C.ice : C.blue;
  return `<div style="position:absolute;inset:0;border-radius:18px;overflow:hidden;
      background:linear-gradient(180deg, ${pressed ? '#13274a' : '#0d1830'} 0%, ${pressed ? '#0a1526' : '#070d18'} 62%, #04070c 100%);
      box-shadow: inset 0 0 0 ${pressed ? 3 : 1.5}px ${pressed ? 'rgba(95,155,255,.85)' : 'rgba(150,180,220,.16)'};">
    <div style="position:absolute;left:36px;right:36px;top:95px;height:1.5px;background:linear-gradient(90deg, transparent, rgba(200,210,223,.55) 20%, rgba(200,210,223,.55) 80%, transparent)"></div>
    ${STRIPE(16, 171, 91, 9)}
    <div style="position:absolute;left:22px;top:128px;width:366px;height:360px;border-radius:14px;overflow:hidden;box-shadow:inset 0 0 0 1.5px rgba(200,210,223,.4), 0 0 ${pressed ? 44 : 24}px ${glow}66">
      <div style="position:absolute;inset:0;overflow:hidden;${pressed ? 'filter:brightness(1.12) saturate(1.1);' : ''}"><img src="${window.CAR_PHOTO}" style="position:absolute;left:-116px;top:-132px;width:800px;max-width:none"></div>
      <div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(4,7,12,0) 55%, rgba(4,7,12,.88))"></div>
    </div>
    <div style="position:absolute;left:55px;right:55px;bottom:-60px;height:130px;border-radius:50%;background:radial-gradient(ellipse, ${pressed ? 'rgba(95,155,255,.45)' : 'rgba(42,98,204,.28)'}, transparent 70%)"></div>
    <div style="position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg, transparent, ${glow}, transparent)"></div>
  </div>`;
}
const center = (inner) => `<div style="position:absolute;inset:0;display:grid;place-items:center">${inner}</div>`;
const iconAsset = (icon, size, color, glow, sw) => center(svgIcon(icon, size, color, sw, glow ? `filter:drop-shadow(0 0 6px ${glow})` : ''));
const pill = (w, h, active, r) => `<div style="position:absolute;inset:4px;border-radius:${r || (h - 8) / 2}px;${active ? `background:linear-gradient(180deg, rgba(42,98,204,.55), rgba(42,98,204,.25));box-shadow:inset 0 0 0 1.5px rgba(95,155,255,.8), 0 0 18px rgba(42,98,204,.5)` : ''}"></div>`;
const bar = (h, alpha) => `<div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(4,7,12,${alpha}) 0%, rgba(4,7,12,${alpha * 0.7}) 100%)"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:1.5px;background:linear-gradient(90deg, transparent, rgba(200,210,223,.35) 15%, ${C.blue} 50%, rgba(200,210,223,.35) 85%, transparent)"></div>`;

/* ---------------------------------------------------------------- sfondi (canvas) */
function noise(ctx, w, h, a) { if (window.NO_NOISE) return;
  const id = ctx.getImageData(0, 0, w, h), p = id.data;
  let s = 1234567;
  for (let i = 0; i < p.length; i += 4) { s = (s * 1103515245 + 12345) & 0x7fffffff; const n = ((s >> 8) % 255) / 255 - 0.5; const v = n * a; p[i] += v; p[i + 1] += v; p[i + 2] += v; }
  ctx.putImageData(id, 0, 0);
}
function baseBg(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#03060b'); g.addColorStop(1, '#070e1b'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
}
function glow(ctx, x, y, rx, ry, color, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(rx / ry, 1);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, color.replace('A', a)); g.addColorStop(1, color.replace('A', 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, ry, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
const BG = {
  1(ctx, w, h) { // Notte: nero con vignetta blu
    baseBg(ctx, w, h); glow(ctx, w / 2, h * 1.05, 1100, 420, 'rgba(42,98,204,A)', 0.28); noise(ctx, w, h, 5);
  },
  2(ctx, w, h) { // Orizzonte: linea di luce
    baseBg(ctx, w, h);
    glow(ctx, w / 2, 470, 1200, 240, 'rgba(42,98,204,A)', 0.35);
    const g = ctx.createLinearGradient(0, 0, w, 0); g.addColorStop(0, 'rgba(95,155,255,0)'); g.addColorStop(0.5, 'rgba(160,210,255,.95)'); g.addColorStop(1, 'rgba(95,155,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 468, w, 2);
    glow(ctx, w / 2, 470, 500, 30, 'rgba(200,230,255,A)', 0.5);
    for (let i = 0; i < 26; i++) { const y = 480 + i * i * 0.9; ctx.fillStyle = `rgba(95,155,255,${0.10 - i * 0.0035})`; ctx.fillRect(0, y, w, 1); }
    noise(ctx, w, h, 5);
  },
  3(ctx, w, h) { // Strisce: tre fasce di luce diagonali azzurro / blu / rosso
    baseBg(ctx, w, h);
    glow(ctx, 1500, 650, 900, 380, 'rgba(42,98,204,A)', 0.22);
    ctx.save(); ctx.filter = 'blur(10px)';
    [[C.ice, 0], [C.mblue, 74], [C.red, 148]].forEach(([c, o]) => {
      ctx.beginPath(); ctx.moveTo(700 + o, h + 40); ctx.lineTo(1200 + o, -40); ctx.lineTo(1262 + o, -40); ctx.lineTo(762 + o, h + 40); ctx.closePath();
      const g = ctx.createLinearGradient(0, h, 0, 0); g.addColorStop(0, c); g.addColorStop(0.7, c + '55'); g.addColorStop(1, c + '00'); ctx.fillStyle = g; ctx.globalAlpha = 0.9; ctx.fill();
    });
    ctx.restore();
    ctx.globalAlpha = 1; noise(ctx, w, h, 5);
  },
  4(ctx, w, h) { // Carbonio
    ctx.fillStyle = '#05080e'; ctx.fillRect(0, 0, w, h);
    const s = 16;
    for (let y = 0; y < h; y += s) for (let x = 0; x < w; x += s) {
      const odd = ((x / s) + (y / s)) % 2;
      const g = odd ? ctx.createLinearGradient(x, y, x + s, y) : ctx.createLinearGradient(x, y, x, y + s);
      g.addColorStop(0, '#0b1019'); g.addColorStop(0.5, '#1a2230'); g.addColorStop(1, '#0b1019'); ctx.fillStyle = g; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
    }
    const v = ctx.createRadialGradient(w / 2, h / 2, 200, w / 2, h / 2, 1100); v.addColorStop(0, 'rgba(4,7,12,0)'); v.addColorStop(1, 'rgba(4,7,12,.8)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    glow(ctx, w / 2, h + 60, 900, 300, 'rgba(42,98,204,A)', 0.35);
  },
  5(ctx, w, h) { // Scie: luci di una strada notturna
    baseBg(ctx, w, h);
    glow(ctx, w * 0.55, h * 0.9, 1100, 320, 'rgba(42,98,204,A)', 0.25);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const trail = (y0, amp, col, wdt, a, ph) => {
      ctx.beginPath();
      for (let x = -20; x <= w + 20; x += 8) { const y = y0 + Math.sin(x / 520 + ph) * amp + (x / w) * -120; x < 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.strokeStyle = col; ctx.lineWidth = wdt; ctx.globalAlpha = a; ctx.filter = `blur(${wdt / 2}px)`; ctx.stroke();
    };
    for (let i = 0; i < 9; i++) { trail(520 + i * 14, 60, C.ice, 3 + (i % 3) * 2, 0.55 - i * 0.04, i * 0.15); trail(520 + i * 14, 60, '#ffffff', 1, 0.35, i * 0.15); }
    for (let i = 0; i < 6; i++) trail(600 + i * 16, 70, C.red, 3 + (i % 2) * 3, 0.5 - i * 0.06, 1.2 + i * 0.1);
    ctx.restore(); ctx.filter = 'none'; ctx.globalAlpha = 1; noise(ctx, w, h, 5);
  },
  6(ctx, w, h) { // La mia Serie 1: foto dell'auto con dissolvenza
    baseBg(ctx, w, h);
    const img = window.CAR_IMG;
    ctx.save(); ctx.filter = 'blur(34px) brightness(.6) saturate(1.25)';
    const sc = Math.max(w / img.width, h / img.height) * 1.25;
    ctx.drawImage(img, (w - img.width * sc) / 2, (h - img.height * sc) / 2, img.width * sc, img.height * sc);
    ctx.restore(); ctx.filter = 'none';
    ctx.fillStyle = 'rgba(3,6,12,.62)'; ctx.fillRect(0, 0, w, h);
    const oc = document.createElement('canvas'); oc.width = img.width; oc.height = img.height; const o = oc.getContext('2d');
    o.drawImage(img, 0, 0); o.globalCompositeOperation = 'destination-in';
    let g = o.createLinearGradient(0, 0, img.width, 0);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.32, 'rgba(0,0,0,1)'); g.addColorStop(0.9, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    o.fillStyle = g; o.fillRect(0, 0, img.width, img.height);
    g = o.createLinearGradient(0, 0, 0, img.height); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.12, 'rgba(0,0,0,1)'); g.addColorStop(0.86, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    o.fillStyle = g; o.fillRect(0, 0, img.width, img.height);
    ctx.drawImage(oc, w - img.width - 30, (h - img.height) / 2 + 22);
    const v = ctx.createRadialGradient(w * 0.62, h * 0.5, 160, w / 2, h / 2, 1150); v.addColorStop(0, 'rgba(4,7,12,0)'); v.addColorStop(1, 'rgba(4,7,12,.78)'); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h);
    glow(ctx, w / 2, h + 60, 900, 260, 'rgba(42,98,204,A)', 0.3);
  },
  music(ctx, w, h) {
    baseBg(ctx, w, h); glow(ctx, 360, 360, 520, 420, 'rgba(42,98,204,A)', 0.22); glow(ctx, w * 0.7, h + 80, 1100, 300, 'rgba(95,155,255,A)', 0.14); noise(ctx, w, h, 5);
  },
};

/* ---------------------------------------------------------------- cruscotto */
const DASH = {
  english: { speed: { max: 160, split: 100 / 160, labels: [0, 25, 50, 75, 100, 125, 150, 160] } },
  china: { speed: { max: 330, split: 200 / 330, labels: [0, 50, 100, 150, 200, 250, 300, 330] } },
  geom: {
    L: { outer: [[345, 670], [130, 290], [318, 50]], inner: [[460, 670], [270, 290], [425, 52]] },
    R: { outer: [[1615, 670], [1845, 288], [1640, 50]], inner: [[1495, 670], [1685, 290], [1530, 52]] },
  },
};
function dash(ctx, w, h, variant) {
  baseBg(ctx, w, h);
  glow(ctx, w / 2, h + 30, 1000, 260, 'rgba(42,98,204,A)', 0.35);
  glow(ctx, 330, 600, 300, 160, 'rgba(227,36,43,A)', 0.10);
  glow(ctx, 1590, 600, 300, 160, 'rgba(227,36,43,A)', 0.10);
  const lerp = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  const at = (pts, split, f) => (f <= split ? lerp(pts[0], pts[1], f / split) : lerp(pts[1], pts[2], (f - split) / (1 - split)));
  const gauge = (g, split, labels, max, right, redFrom, unit) => {
    const O = g.outer, N = g.inner;
    // banda
    ctx.beginPath(); [...O, ...[...N].reverse()].forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    const bg = ctx.createLinearGradient(O[1][0], 0, N[1][0], 0); bg.addColorStop(0, '#1a2332'); bg.addColorStop(1, '#0b111b');
    ctx.fillStyle = bg; ctx.fill();
    ctx.save(); ctx.clip();
    for (let i = 0; i < 40; i++) { ctx.strokeStyle = `rgba(255,255,255,${0.012})`; ctx.beginPath(); const f = i / 40; const a = at(O, split, f), b = at(N, split, f); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); }
    ctx.restore();
    // bordo esterno cromato
    const edge = (pts, wdt, col) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.lineWidth = wdt; ctx.strokeStyle = col; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); };
    const chrome = ctx.createLinearGradient(0, 40, 0, 680); chrome.addColorStop(0, '#8d9aac'); chrome.addColorStop(0.45, '#eef3f9'); chrome.addColorStop(1, '#6d7a8c');
    edge(O, 7, chrome);
    edge(N, 2, 'rgba(95,155,255,.75)');
    ctx.save(); ctx.shadowColor = C.blue; ctx.shadowBlur = 18; edge(N, 1, 'rgba(95,155,255,.6)'); ctx.restore();
    // accento interno sottile parallelo
    const off = right ? -26 : 26;
    edge(N.map(([x, y]) => [x + off, y]), 1.5, 'rgba(42,98,204,.35)');
    // zona rossa
    if (redFrom != null) {
      ctx.beginPath(); const steps = 30; for (let i = 0; i <= steps; i++) { const f = redFrom + (1 - redFrom) * (i / steps); const p = at(O, split, f); i ? ctx.lineTo(...p) : ctx.moveTo(...p); }
      ctx.lineWidth = 7; ctx.strokeStyle = C.red; ctx.stroke();
    }
    // tacche
    const tick = (f, len, wdt, col) => {
      const a = at(O, split, f), b = at(N, split, f); const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
      ctx.beginPath(); ctx.moveTo(a[0] + dx / L * 6, a[1] + dy / L * 6); ctx.lineTo(a[0] + dx / L * len, a[1] + dy / L * len); ctx.lineWidth = wdt; ctx.strokeStyle = col; ctx.lineCap = 'butt'; ctx.stroke();
    };
    const minor = right ? 0.5 : (max > 200 ? 10 : 5);
    for (let v = 0; v <= max + 0.001; v += minor) { const f = v / max; tick(f, 22, 2, redFrom != null && f >= redFrom ? 'rgba(227,36,43,.9)' : 'rgba(220,228,238,.55)'); }
    labels.forEach((v) => { const f = v / max; tick(f, 44, 4, redFrom != null && f >= redFrom ? C.red : '#f2f5f9'); });
    // numeri
    ctx.font = '500 34px Inter, sans-serif'; ctx.textBaseline = 'middle';
    labels.forEach((v) => {
      const f = v / max, a = at(O, split, f), b = at(N, split, f); const dx = a[0] - b[0], dy = a[1] - b[1], L = Math.hypot(dx, dy);
      const p = [a[0] + dx / L * 34, a[1] + dy / L * 34];
      ctx.textAlign = right ? 'left' : 'right'; ctx.fillStyle = redFrom != null && f >= redFrom ? C.red : 'rgba(242,245,249,.92)';
      ctx.fillText(String(v), p[0] + (right ? 2 : -2), Math.min(690, Math.max(28, p[1])));
    });
    // unità
    ctx.font = '500 22px Inter, sans-serif'; ctx.fillStyle = 'rgba(160,190,225,.75)'; ctx.textAlign = right ? 'right' : 'left';
    ctx.fillText(unit, right ? N[2][0] - 14 : N[2][0] + 14, 72);
    // base orizzontale
    const by = 670; const bx0 = right ? O[0][0] - 200 : O[0][0], bx1 = right ? O[0][0] : O[0][0] + 200;
    const bl = ctx.createLinearGradient(bx0, 0, bx1, 0); bl.addColorStop(right ? 0 : 1, 'rgba(200,210,223,0)'); bl.addColorStop(right ? 1 : 0, 'rgba(200,210,223,.8)');
    ctx.fillStyle = bl; ctx.fillRect(Math.min(bx0, bx1), by - 1, 200, 2.5);
  };
  const sp = DASH[variant].speed;
  gauge(DASH.geom.L, sp.split, sp.labels, sp.max, false, null, 'km/h');
  gauge(DASH.geom.R, 5 / 8, [0, 1, 2, 3, 4, 5, 6, 7, 8], 8, true, 6.5 / 8, '×1000 r/min');
  // linea centrale e strisce
  const g = ctx.createLinearGradient(560, 0, 1360, 0); g.addColorStop(0, 'rgba(200,210,223,0)'); g.addColorStop(0.5, 'rgba(200,210,223,.35)'); g.addColorStop(1, 'rgba(200,210,223,0)');
  ctx.fillStyle = g; ctx.fillRect(560, 650, 800, 1.5);
  ctx.save(); ctx.translate(960 - 40, 640); ctx.transform(1, 0, -0.35, 1, 0, 0);
  [[C.ice, 0], [C.mblue, 27], [C.red, 54]].forEach(([c, x]) => { ctx.fillStyle = c; ctx.fillRect(x, 0, 24, 5); });
  ctx.restore();
  noise(ctx, w, h, 4);
}

/* ---------------------------------------------------------------- elenco asset */
const A = [];
const add = (path, w, h, html) => A.push({ path, w, h, html });
const addCv = (path, w, h, draw) => A.push({ path, w, h, canvas: draw });

// home: card 410×580
const CARDS = { home_icon_wiredcarplay: 'carplay', home_icon_androidauto: 'aa', home_icon_bluetooth: 'bt', za_home_icon_music: 'music', home_icon_hidvideo: 'video',
  home_icon_dashboard: 'gauge', home_icon_carinfo: 'car', home_bg: 'image', home_sound: 'eq', home_icon_zlink: 'gear', home_icon_dvr: 'dvr',
  home_icon_miracast: 'mirror', home_icon_airplay: 'mirror', home_icon_hicar: 'link', home_icon_carlife: 'wheel' };
Object.entries(CARDS).forEach(([n, ic]) => { const f = n === 'home_icon_carinfo' ? photoCard : (pr) => card(ic, pr); add(`HomePage/${n}_n.png`, 410, 580, f(false)); add(`HomePage/${n}_s.png`, 410, 580, f(true)); });
// barra laterale + scorciatoie
add('HomePage/home_left_bg.png', 166, 620, `<div style="position:absolute;inset:0 6px 0 0;border-radius:0 22px 22px 0;background:linear-gradient(180deg, rgba(10,18,32,.86), rgba(6,10,18,.92));box-shadow:inset -1.5px 0 0 rgba(95,155,255,.35), 8px 0 30px rgba(0,0,0,.4)"></div>
  <div style="position:absolute;right:6px;top:120px;width:2px;height:380px;background:linear-gradient(180deg, transparent, ${C.blue}, transparent)"></div>`);
[['home_icon_s_music', 'music'], ['home_icon_s_dail', 'phone'], ['home_icon_s_video', 'video'], ['home_icon_s_set', 'gear']].forEach(([n, ic]) => {
  add(`HomePage/${n}_n.png`, 80, 80, iconAsset(ic, 60, C.white, null, 3));
  add(`HomePage/${n}_f.png`, 80, 80, `<div style="position:absolute;inset:2px;border-radius:50%;background:radial-gradient(circle, rgba(42,98,204,.45), rgba(42,98,204,0) 70%)"></div>` + iconAsset(ic, 60, C.ice, C.blue, 3));
});
add('HomePage/home_top_bg.png', 1920, 100, bar(100, 0.85));
// barra di stato
[['home_back', 'back'], ['home_home', 'home']].forEach(([n, ic]) => {
  add(`status/${n}_n.png`, 154, 92, iconAsset(ic, 52, C.white, null, 3.2));
  add(`status/${n}_f.png`, 154, 92, pill(154, 92, true, 30) + iconAsset(ic, 52, C.ice, C.blue, 3.2));
});
add('status/home_bt.png', 66, 64, iconAsset('bt', 44, C.white, null, 3.4));
add('status/u.png', 66, 64, iconAsset('usb', 44, C.white, null, 3.4));
// sfondi
[1, 2, 3, 4, 5, 6].forEach((n) => {
  addCv(`bg/bg${n}.png`, 1920, 720, (ctx, w, h) => BG[n](ctx, w, h));
  ['n', 'f'].forEach((st) => addCv(`bg/home_bg${n}_${st}.png`, 310, 116, (ctx, w, h) => {
    const c = document.createElement('canvas'); c.width = 1920; c.height = 720; BG[n](c.getContext('2d'), 1920, 720);
    ctx.save(); ctx.beginPath(); ctx.roundRect(3, 3, w - 6, h - 6, 10); ctx.clip(); ctx.drawImage(c, 3, 3, w - 6, h - 6); ctx.restore();
    ctx.beginPath(); ctx.roundRect(st === 'f' ? 2.5 : 1.5, st === 'f' ? 2.5 : 1.5, w - (st === 'f' ? 5 : 3), h - (st === 'f' ? 5 : 3), 11);
    ctx.lineWidth = st === 'f' ? 4 : 1.5; ctx.strokeStyle = st === 'f' ? C.ice : 'rgba(200,210,223,.35)'; ctx.stroke();
    if (st === 'f') { ctx.fillStyle = C.blue; ctx.beginPath(); ctx.arc(w - 26, h - 24, 14, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(w - 33, h - 24); ctx.lineTo(w - 28, h - 19); ctx.lineTo(w - 19, h - 29); ctx.stroke(); }
  }));
});
// cruscotto
addCv('dash/dash_bg_english.png', 1920, 720, (ctx, w, h) => dash(ctx, w, h, 'english'));
addCv('dash/dash_bg_china.png', 1920, 720, (ctx, w, h) => dash(ctx, w, h, 'china'));
// impostazioni
add('setting/set_base_bg.png', 1920, 112, bar(112, 0.85));
add('bt/bt_base_bg.png', 1920, 112, bar(112, 0.85));
[['set_ic_common', 'gear', 124], ['set_ic_eq', 'eq', 125], ['set_ic_wallpaper', 'image', 125], ['set_ic_factory', 'wrench', 124]].forEach(([n, ic, w]) => {
  add(`setting/${n}_n.png`, w, 80, iconAsset(ic, 50, 'rgba(242,245,249,.85)', null, 3.2));
  add(`setting/${n}_f.png`, w, 80, iconAsset(ic, 50, C.ice, C.blue, 3.2));
});
[['set_light', 'sun'], ['set_audio', 'speaker'], ['set_language', 'globe'], ['set_date', 'clock'], ['set_back', 'camera'], ['set_system', 'info']].forEach(([n, ic]) => {
  add(`setting/${n}_n.png`, 50, 50, iconAsset(ic, 40, 'rgba(242,245,249,.85)', null, 3.4));
  add(`setting/${n}_s.png`, n === 'set_audio' ? 52 : 50, n === 'set_audio' ? 52 : 50, iconAsset(ic, 40, C.ice, C.blue, 3.4));
});
add('setting/set_second_menu_select_f.png', 1300, 80, `<div style="position:absolute;inset:4px 0;border-radius:10px;background:linear-gradient(90deg, rgba(42,98,204,.62), rgba(42,98,204,.18) 60%, rgba(42,98,204,0))"></div><div style="position:absolute;left:0;top:14px;bottom:14px;width:5px;border-radius:3px;background:${C.ice};box-shadow:0 0 12px ${C.ice}"></div>`);
add('setting/set_second_menu_select_n.png', 1300, 80, `<div style="position:absolute;left:20px;right:20px;bottom:2px;height:1px;background:linear-gradient(90deg, rgba(200,210,223,.25), rgba(200,210,223,0))"></div>`);
const btn = (active) => `<div style="position:absolute;inset:3px;border-radius:10px;
  background:${active ? `linear-gradient(180deg, ${C.blue}, #1c4596)` : 'linear-gradient(180deg, rgba(27,38,56,.92), rgba(12,22,40,.92))'};
  box-shadow:inset 0 0 0 1.5px ${active ? 'rgba(130,195,255,.9)' : 'rgba(150,180,220,.22)'}, inset 0 1px 0 rgba(255,255,255,.12)${active ? ', 0 0 16px rgba(42,98,204,.5)' : ''}"></div>`;
add('setting/set_btn_n.png', 354, 68, btn(false)); add('setting/set_btn_f.png', 354, 68, btn(true));
add('MusicPlayer/file_btn_n.png', 354, 68, btn(false)); add('MusicPlayer/file_btn_f.png', 354, 68, btn(true));
const sw = (on) => `<div style="position:absolute;left:3px;top:5px;width:67px;height:29px;border-radius:15px;background:${on ? C.blue : '#2a3446'};box-shadow:inset 0 0 0 1.5px ${on ? 'rgba(130,195,255,.8)' : 'rgba(150,180,220,.25)'}"></div>
  <div style="position:absolute;top:8px;left:${on ? 44 : 6}px;width:23px;height:23px;border-radius:50%;background:${on ? '#fff' : '#9aa6b8'};box-shadow:0 1px 3px rgba(0,0,0,.5)"></div>`;
add('setting/on.png', 73, 39, sw(true)); add('setting/off.png', 73, 39, sw(false));
add('setting/set_adjust_bg.png', 1200, 42, `<div style="position:absolute;left:8px;right:8px;top:18px;height:6px;border-radius:3px;background:#222c3c;box-shadow:inset 0 0 0 1px rgba(150,180,220,.2)"></div>`);
add('setting/set_adjust.png', 1200, 42, `<div style="position:absolute;left:8px;right:8px;top:18px;height:6px;border-radius:3px;background:linear-gradient(90deg, ${C.mblue}, ${C.blue} 50%, ${C.ice});box-shadow:0 0 10px rgba(95,155,255,.6)"></div>`);
add('setting/set_adjust_click.png', 101, 57, center(`<div style="width:34px;height:34px;border-radius:50%;background:radial-gradient(circle at 40% 35%, #fff, #cfd8e4);box-shadow:0 0 0 4px rgba(42,98,204,.9), 0 0 16px rgba(95,155,255,.8)"></div>`));
add('setting/set_line.png', 1307, 12, `<div style="position:absolute;left:0;right:0;top:5px;height:1.5px;background:linear-gradient(90deg, rgba(200,210,223,.3), rgba(200,210,223,.08))"></div>`);
add('setting/popwbag.png', 654, 357, `<div style="position:absolute;inset:2px;border-radius:18px;background:linear-gradient(180deg, #13213a, #0a1220);box-shadow:inset 0 0 0 1.5px rgba(150,180,220,.3), 0 20px 50px rgba(0,0,0,.6)"></div>${STRIPE(26, 270, 20, 5)}`);
add('setting/set_right_bg.png', 1424, 464, `<div style="position:absolute;inset:2px;border-radius:16px;background:rgba(8,14,26,.72);box-shadow:inset 0 0 0 1px rgba(150,180,220,.16)"></div>`);
add('setting/set_fullscreen_bg.png', 1802, 462, `<div style="position:absolute;inset:2px;border-radius:16px;background:rgba(8,14,26,.72);box-shadow:inset 0 0 0 1px rgba(150,180,220,.16)"></div>`);
add('bt/set_fullscreen_bg.png', 1802, 462, `<div style="position:absolute;inset:2px;border-radius:16px;background:rgba(8,14,26,.72);box-shadow:inset 0 0 0 1px rgba(150,180,220,.16)"></div>`);
// bluetooth
[['bt_dail', 'keypad'], ['bt_contacts', 'person'], ['bt_record', 'history'], ['bt_music', 'btmusic'], ['bt_set', 'gear']].forEach(([n, ic]) => {
  add(`bt/${n}_n.png`, 125, 80, iconAsset(ic, 50, 'rgba(242,245,249,.85)', null, 3.2));
  add(`bt/${n}_f.png`, 125, 80, pill(125, 80, true, 16) + iconAsset(ic, 50, C.ice, C.blue, 3.2));
});
const callBtn = (ic, col, pressed) => `<div style="position:absolute;inset:6px;border-radius:24px;background:linear-gradient(180deg, ${pressed ? col : 'rgba(27,38,56,.95)'}, ${pressed ? col : 'rgba(10,18,32,.95)'});box-shadow:inset 0 0 0 2px ${col}, 0 0 ${pressed ? 30 : 14}px ${col}88"></div>` + iconAsset(ic, 74, pressed ? '#fff' : col, null, 3);
add('bt/bt_call_btn1_n.png', 180, 158, callBtn('call', '#2fc06a', false)); add('bt/bt_call_btn1_f.png', 180, 158, callBtn('call', '#2fc06a', true));
add('bt/bt_call_btn2_n.png', 180, 158, callBtn('hang', C.red, false)); add('bt/bt_call_btn2_f.png', 180, 158, callBtn('hang', C.red, true));
// musica
addCv('MusicPlayer/music_bg.png', 1920, 720, (ctx, w, h) => BG.music(ctx, w, h));
[['music_btn_previous', 'prev', 44], ['music_btn_next', 'next', 44], ['music_btn_play', 'play', 46], ['music_btn_pause', 'pause', 46], ['music_btn_list', 'list', 44], ['music_btn_random', 'shuffle', 44], ['music_btn_single', 'repeat', 44]].forEach(([n, ic, s]) => {
  const big = ic === 'play' || ic === 'pause';
  add(`MusicPlayer/${n}_n.png`, 80, 80, (big ? `<div style="position:absolute;inset:3px;border-radius:50%;box-shadow:inset 0 0 0 2px rgba(200,210,223,.6)"></div>` : '') + iconAsset(ic, big ? 36 : s, C.white, null, 3.2));
  add(`MusicPlayer/${n}_f.png`, 80, 80, `<div style="position:absolute;inset:3px;border-radius:50%;background:radial-gradient(circle, rgba(42,98,204,.6), rgba(42,98,204,.15));box-shadow:inset 0 0 0 2px ${C.ice}"></div>` + iconAsset(ic, big ? 36 : s, '#fff', C.ice, 3.2));
});
add('MusicPlayer/music_slide_bg.png', 1060, 32, `<div style="position:absolute;left:4px;right:4px;top:13px;height:6px;border-radius:3px;background:#222c3c"></div>`);
add('MusicPlayer/music_slide.png', 1411, 32, `<div style="position:absolute;left:4px;right:4px;top:13px;height:6px;border-radius:3px;background:linear-gradient(90deg, ${C.mblue}, ${C.blue} 40%, ${C.ice});box-shadow:0 0 10px rgba(95,155,255,.6)"></div>`);
add('MusicPlayer/music_slide_btn.png', 32, 32, center(`<div style="width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px ${C.blue}, 0 0 10px ${C.ice}"></div>`));
[['music_title', 'title'], ['music_artist', 'person'], ['music_albunm', 'disc']].forEach(([n, ic]) => add(`MusicPlayer/${n}.png`, 76, 76, iconAsset(ic, 46, C.ice, null, 3)));
add('MusicPlayer/music_defaultcover.png', 458, 466, `<div style="position:absolute;inset:4px;border-radius:22px;overflow:hidden;box-shadow:inset 0 0 0 1.5px rgba(150,180,220,.3), 0 20px 40px rgba(0,0,0,.5)"><div style="position:absolute;inset:0;overflow:hidden;"><img src="${window.CAR_PHOTO}" style="position:absolute;left:-146px;top:-166px;width:1004px;max-width:none"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(4,7,12,0) 60%, rgba(4,7,12,.8))"></div></div>${STRIPE(30, 180, 420, 5)}`);
add('bt/za_btmusic_defaultcover.png', 270, 270, `<div style="position:absolute;inset:3px;border-radius:18px;overflow:hidden;box-shadow:inset 0 0 0 1.5px rgba(150,180,220,.3)"><div style="position:absolute;inset:0;overflow:hidden;"><img src="${window.CAR_PHOTO}" style="position:absolute;left:-86px;top:-98px;width:592px;max-width:none"></div><div style="position:absolute;inset:0;background:linear-gradient(180deg, rgba(4,7,12,0) 62%, rgba(4,7,12,.8))"></div></div>`);
// icone secondarie (liste, musica BT, chiamata, video)
[['bt_tmusic_previous_n', 'prev'], ['bt_tmusic_play_n', 'play'], ['bt_tmusic_pause_n', 'pause'], ['bt_tmusic_next_n', 'next']].forEach(([n, ic]) =>
  add(`bt/${n}.png`, 148, 74, `<div style="position:absolute;inset:4px;border-radius:14px;background:linear-gradient(180deg, rgba(27,38,56,.92), rgba(12,22,40,.92));box-shadow:inset 0 0 0 1.5px rgba(150,180,220,.22)"></div>` + iconAsset(ic, 34, C.white, null, 3.2)));
[['bt_s_call_callin', 'phone', '#2fc06a'], ['bt_s_call_callout', 'phone', C.ice], ['bt_s_call_callmiss', 'phone', C.red], ['bt_s_contacts', 'person', C.ice]].forEach(([n, ic, col]) =>
  add(`bt/${n}.png`, 52, 52, iconAsset(ic, 38, col, null, 3.4)));
add('bt/head.png', 80, 80, `<div style="position:absolute;inset:2px;border-radius:50%;background:radial-gradient(circle at 50% 35%, #1b3a6b, #0a1323);box-shadow:inset 0 0 0 2px rgba(95,155,255,.7)"></div>` + iconAsset('person', 46, C.white, null, 3));
add('bt/bt_contacts_download_n.png', 116, 116, `<div style="position:absolute;inset:6px;border-radius:50%;background:rgba(12,22,40,.9);box-shadow:inset 0 0 0 2px rgba(95,155,255,.6)"></div>` + iconAsset('download', 52, C.white, null, 3.2));
[['file_music', 'music', C.ice], ['file_usbr_n', 'usb', 'rgba(242,245,249,.85)'], ['file_usbr_s', 'usb', C.ice], ['file_local_n', 'disc', 'rgba(242,245,249,.85)'], ['file_local_s', 'disc', C.ice]].forEach(([n, ic, col]) =>
  add(`MusicPlayer/${n}.png`, 48, 48, iconAsset(ic, 38, col, null, 3.4)));
add('media/video_load.png', 680, 431, `<div style="position:absolute;inset:4px;border-radius:22px;background:linear-gradient(150deg, #13233f, #070d18 70%);box-shadow:inset 0 0 0 1.5px rgba(150,180,220,.22)"></div>` + center(svgIcon('video', 170, 'rgba(242,245,249,.9)', 2.4, `filter:drop-shadow(0 0 14px ${C.blue})`)) + STRIPE(30, 290, 395, 5));
window.ASSETS = A;
window.renderAsset = (i) => {
  const a = A[i], root = document.getElementById('root');
  root.innerHTML = ''; const el = document.createElement('div'); el.id = 'a';
  el.style.cssText = `position:relative;width:${a.w}px;height:${a.h}px;overflow:hidden`;
  root.append(el);
  if (a.canvas) { const c = document.createElement('canvas'); c.width = a.w; c.height = a.h; c.style.display = 'block'; el.append(c); a.canvas(c.getContext('2d'), a.w, a.h); } else el.innerHTML = a.html;
  return a.path;
};
