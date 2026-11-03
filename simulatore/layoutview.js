/* Visualizzatore dei layout reali (.ftu decodificati) del display.
   Disegna ogni elemento alla posizione, dimensione, immagine e colore scritti nel file.
   Le interpretazioni dedotte (non documentate) sono segnate con "DEDOTTO". */
(() => {
'use strict';
const L = window.LAYOUTS || {};
const S = () => window.SIM;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KIND = /^([a-z]+)__\d+$/;
let PICMAP = {};

/* colori: -1 = nessuno; 0..0xFFFFFF = RGB; oltre = ARGB (DEDOTTO) */
function col(v) {
  if (v == null || v < 0) return null;
  if (v > 0xFFFFFF) return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${(((v >>> 24) & 255) / 255).toFixed(3)})`;
  return '#' + v.toString(16).padStart(6, '0');
}
/* allineamento: 32 + riga*4 + colonna, righe 0 alto/1 centro/2 basso, colonne 0 sinistra/1 centro/2 destra (DEDOTTO dai dati) */
function align(a) {
  if (a == null || a < 32) return { v: 'center', h: 'center' };
  const n = a - 32, r = n >> 2, c = n & 3;
  return { v: ['flex-start', 'center', 'flex-end'][r] || 'center', h: ['flex-start', 'center', 'flex-end'][c] || 'center' };
}
const pos = (p, extra = '') => p ? `left:${p.left || 0}px;top:${p.top || 0}px;width:${p.width || 0}px;height:${p.height || 0}px;${extra}` : extra;
const img = (p0, style, extra = '') => { const p = p0 && (PICMAP[String(p0).replace(/^\//, '')] || p0); return p ? `<img src="${esc(S().src(String(p).replace(/^\//, '')))}" data-img="${esc(String(p).replace(/^\//, ''))}" style="position:absolute;${style}" draggable="false" alt="" onerror="this.style.visibility='hidden'" ${extra}>` : ''; };

function textOf(raw, fallback) {
  if (raw == null || raw === '') return { html: fallback ? esc(fallback) : '', key: null };
  if (typeof raw === 'string' && raw[0] === '@') { const k = raw.slice(1); return { html: esc(S().t(k)), key: k }; }
  return { html: esc(raw), key: null };
}
function label(o, p, opts = {}) {
  const raw = o.text; const tt = textOf(raw, opts.fallback);
  if (!tt.html) return '';
  const al = align(o.alignment);
  const ct = o.colorTab || {};
  const colr = col(opts.checked && ct.color2 != null && ct.color2 >= 0 ? ct.color2 : ct.color0) || (opts.color || '#ffffff');
  const tp = o.textPosition || null;
  const fs = o.fontSize || 16, box = tp || p, single = (box.height || 0) < fs * 2.1;
  return `<div class="lv-t" ${single ? 'data-single="1"' : ''} ${tt.key ? `data-k="${esc(tt.key)}"` : ''} style="${single ? 'white-space:nowrap;' : ''}${pos(tp || { left: 0, top: 0, width: p.width, height: p.height })};display:flex;align-items:${al.v};justify-content:${al.h};text-align:${al.h === 'flex-start' ? 'left' : al.h === 'flex-end' ? 'right' : 'center'};font-size:${o.fontSize || 16}px;color:${colr};${o.bold ? 'font-weight:700;' : ''}${o.italic ? 'font-style:italic;' : ''}${o.iconTextPadding ? `padding:${o.iconTextPadding.top || 0}px ${o.iconTextPadding.right || 0}px ${o.iconTextPadding.bottom || 0}px ${o.iconTextPadding.left || 0}px;box-sizing:border-box;` : ''}">${tt.html}</div>`;
}
function bgOf(o) {
  let h = '';
  const c = col(o.backgroundColor);
  const bc = o.bgColorTab && col(o.bgColorTab.color0);
  if (c || bc) h += `<div style="position:absolute;inset:0;background:${c || bc}"></div>`;
  if (o.backgroundPic) h += img(o.backgroundPic, 'left:0;top:0;width:100%;height:100%');
  return h;
}

const SAMPLE_ROWS = ['Anna Rossi', 'Marco Bianchi', 'Officina', 'Casa', 'Ufficio', 'Luca Verdi', 'Giulia', 'Paolo'];

function render(name, o, ctx, depth = 0) {
  const m = KIND.exec(name); const kind = m ? m[1] : 'window';
  // Il programma decide a runtime quale gruppo di schermata mostrare: qui lo sceglie ctx.variant
  const forced = ctx.variant && o.caption === ctx.variant;
  if (o.visible === false && !ctx.showHidden && !forced) return '';
  const p = o.position || { left: 0, top: 0, width: 0, height: 0 };
  const cap = o.caption || name;
  const attrs = `data-cap="${esc(cap)}" data-lid="${o.id != null ? o.id : ''}" data-kind="${kind}" data-pos="${p.left},${p.top} ${p.width}×${p.height}" ${o.visible === false ? 'data-hidden="1"' : ''}`;
  const st = `position:absolute;${pos(p)}`;
  let inner = '';
  const kids = () => Object.entries(o).filter(([k, v]) => KIND.test(k) && v && typeof v === 'object').map(([k, v]) => render(k, v, ctx, depth + 1)).join('');

  switch (kind) {
    case 'button': {
      const pt = o.picTab || {};
      const ip = o.iconPosition;
      inner += bgOf(o);
      if (pt.pic0) inner += img(pt.pic0, ip ? pos(ip) : 'left:0;top:0;width:100%;height:100%', pt.pic1 ? `data-n="${esc(pt.pic0.replace(/^\//, ''))}" data-p="${esc(pt.pic1.replace(/^\//, ''))}"` : '');
      inner += label(o, p);
      break;
    }
    case 'textview':
      inner += bgOf(o) + label(o, p);
      break;
    case 'digitalclock': {
      const d = new Date(); const h24 = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
      const h12 = String(d.getHours() % 12 || 12).padStart(2, '0');
      const colon = (o.format || '').includes('MM') ? ':' : ':';
      const txt = (o.format || '').startsWith('hh') ? `${h12}${colon}${mm}` : `${h24}${colon}${mm}`;
      inner += `<div class="lv-t" data-lvclock="${(o.format || '').startsWith('hh') ? 12 : 24}" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:${o.fontSize || 32}px;color:${col(o.clockColor) || '#fff'}">${txt}</div>`;
      break;
    }
    case 'seekbar': {
      const f = Math.max(0, Math.min(1, (o.defProgress || 0) / (o.max || 100) || ctx.demoFill));
      const th = o.thumb || {}; const ts = th.size || { width: 32, height: 32 };
      const horiz = (o.orientation || 0) === 0;
      inner += img(o.backgroundPic, 'left:0;top:0;width:100%;height:100%');
      inner += `<div style="position:absolute;left:0;top:0;${horiz ? `width:${f * 100}%;height:100%` : `width:100%;height:${f * 100}%`};overflow:hidden">${img(o.progressPic, `left:0;top:0;width:${p.width}px;height:${p.height}px`)}</div>`;
      inner += img(th.normalPic, `left:${horiz ? f * p.width - ts.width / 2 : (p.width - ts.width) / 2}px;top:${horiz ? (p.height - ts.height) / 2 : f * p.height - ts.height / 2}px;width:${ts.width}px;height:${ts.height}px`);
      break;
    }
    case 'radiogroup': {
      inner += bgOf(o);
      inner += (o.radiobuttons || []).map((b, i) => {
        if (b.visible === false && !ctx.showHidden) return '';
        const bp = b.position || { left: 0, top: 0, width: 0, height: 0 }; const pt = b.picTab || {};
        const checked = !!b.checked || (ctx.checkFirst && i === 0 && !(o.radiobuttons || []).some((x) => x.checked));
        const pic = checked ? (pt.pic2 || pt.pic1 || pt.pic0) : pt.pic0;
        return `<div data-cap="${esc(b.caption || '')}" data-lid="${b.id != null ? b.id : ''}" data-kind="radiobutton" data-pos="${bp.left},${bp.top} ${bp.width}×${bp.height}" style="position:absolute;${pos(bp)}">
          ${bgOf(b)}${img(pic, b.iconPosition ? pos(b.iconPosition) : 'left:0;top:0;width:100%;height:100%')}${label(b, bp, { checked })}</div>`;
      }).join('');
      break;
    }
    case 'listview': {
      const it = o.item || {}; const ip = it.position || { width: p.width, height: 60 };
      const rows = Math.min(o.rows || 5, 8), cols = o.cols || 1, vert = (o.orientation || 0) === 1;
      let cells = '';
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const idx = r * cols + c; const x = c * (ip.width + (o.colSpacing || 0)), y = r * (ip.height + (o.rowSpacing || 0));
        if (x + ip.width > p.width + 2 && c > 0) continue; if (y + ip.height > p.height + 2 && r > 0) continue;
        const subs = (it.subItem || []).map((s) => {
          const sp = s.position || {}; const pt = s.picTab || {};
          return `<div style="position:absolute;${pos(sp)}">${img(pt.pic0, s.iconPosition ? pos(s.iconPosition) : 'left:0;top:0;width:100%;height:100%')}${s.text && s.text !== 'ListSubItem' ? label(s, sp) : ''}</div>`;
        }).join('');
        const t = it.text && !['item', 'number', 'ListSubItem', ''].includes(it.text) ? it.text : (it.text === 'number' ? `0${idx}  555 01${idx}2` : SAMPLE_ROWS[idx % SAMPLE_ROWS.length]);
        inner += `<div style="position:absolute;left:${x}px;top:${y}px;width:${ip.width}px;height:${ip.height}px">${bgOf(it)}${img((it.picTab || {}).pic0, it.iconPosition ? pos(it.iconPosition) : 'left:0;top:0;width:100%;height:100%')}${subs}${label({ ...it, text: t }, ip)}</div>`;
      }
      break;
    }
    case 'slidewindow': {
      const cols = o.cols || 4, rows = o.rows || 2, is = o.iconSize || { width: 334, height: 250 };
      const gx = (p.width - cols * is.width) / Math.max(1, cols + 1), gy = (p.height - rows * is.height) / Math.max(1, rows + 1);
      inner += (o.items || []).slice(0, cols * rows).map((it, i) => {
        const r = Math.floor(i / cols), c = i % cols; const x = gx + c * (is.width + gx), y = gy + r * (is.height + gy);
        const pt = it.picTab || {};
        return `<div style="position:absolute;left:${x}px;top:${y}px;width:${is.width}px;height:${is.height}px" data-cap="item ${i + 1}" data-kind="slideitem" data-pos="${Math.round(x)},${Math.round(y)} ${is.width}×${is.height}">${img(pt.pic0, 'left:0;top:0;width:100%;height:100%')}${label({ ...it, alignment: o.iconTextAlignment, fontSize: o.fontSize, colorTab: it.colorTab, iconTextPadding: o.iconTextPadding }, { width: is.width, height: is.height })}</div>`;
      }).join('');
      break;
    }
    case 'scrollwindow':
      inner += bgOf(o) + kids();
      return `<div class="lv-n lv-scroll" ${attrs} style="${st};overflow-x:auto;overflow-y:hidden;scrollbar-width:none">${inner}</div>`;
    case 'pointer':
      inner += img(o.pointerPic, 'left:0;top:0;width:100%;height:100%', 'class="lv-spin"');
      break;
    case 'circlebar':
      inner += `<div style="position:absolute;inset:0;border-radius:50%;box-shadow:inset 0 0 0 6px rgba(255,255,255,.25)"></div>`;
      break;
    case 'cameraview':
      inner += `<div class="lv-ph" style="background:linear-gradient(135deg,#1d2430,#0a0d12)">CAMERA</div>`;
      break;
    case 'videoview':
      inner += `<div class="lv-ph" style="background:#000">VIDEO</div>`;
      break;
    case 'qrcode':
      inner += `<div class="lv-ph" style="background:#fff;color:#000">QR</div>`;
      break;
    case 'edittext':
      inner += bgOf(o) + `<div class="lv-t" style="position:absolute;inset:0;display:flex;align-items:center;padding:0 8px;font-size:${o.fontSize || 20}px;color:${col(o.hintTextColor) || 'rgba(255,255,255,.5)'}">${esc(o.hintText || '')}</div>`;
      break;
    default: // window
      inner += bgOf(o) + kids();
  }
  return `<div class="lv-n" ${attrs} style="${st}">${inner}</div>`;
}

window.LayoutView = {
  names: () => Object.keys(L),
  /* gruppi alternativi della home (il programma ne mostra uno a seconda di modalità e modello) */
  variants: (name) => {
    const d = L[name]; if (!d) return [];
    const out = []; const walk = (o) => { Object.entries(o).forEach(([k, v]) => { if (v && typeof v === 'object' && !Array.isArray(v)) { if (/^(scrollwindow|slidewindow|listview)__/.test(k)) out.push(v.caption); if (/^window__/.test(k)) walk(v); } }); };
    walk(d); return out;
  },
  /* testi a riga singola che non entrano nella loro casella: sul display verrebbero tagliati */
  audit(root) {
    const bad = [];
    root.querySelectorAll('.lv-t[data-k]').forEach((el) => {
      const over = el.scrollWidth > el.clientWidth + 1; el.classList.toggle('lv-over', over);
      if (over) bad.push({ cap: (el.closest('[data-cap]') || {}).dataset ? el.closest('[data-cap]').dataset.cap : '', text: el.textContent, key: el.dataset.k || '', need: el.scrollWidth, have: el.clientWidth });
    });
    return bad;
  },
  html(name, opts = {}) {
    const d = L[name]; if (!d) return `<div class="lv-ph" style="position:absolute;inset:0;background:#000">Layout "${esc(name)}" non trovato</div>`;
    const bgc = col(d.backgroundColor);
    PICMAP = opts.picMap || {};
    const ctx = { showHidden: !!opts.showHidden, demoFill: 0.4, checkFirst: true, variant: opts.variant || null };
    const kids = Object.entries(d).filter(([k, v]) => KIND.test(k) && v && typeof v === 'object').map(([k, v]) => render(k, v, ctx)).join('');
    return `<div class="lv-root ${opts.outline ? 'lv-outline' : ''}" style="position:absolute;left:0;top:0;width:${d.resolution.width}px;height:${d.resolution.height}px;overflow:hidden;background:${bgc || '#000'}">${kids}</div>`;
  },
};
})();
