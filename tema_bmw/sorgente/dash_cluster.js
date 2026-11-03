/* Cruscotto in stile cluster BMW, ricostruito dalla foto di riferimento (geometria misurata, scala 0.82).
   Uso: node dash_cluster.js <uscita res/ui/dash> [font numeri .ttf]

   VINCOLI DEL DISPLAY (verificati sul backup):
   - le due barre dinamiche (SpeedDisplayTextView / RotateDisplayTextView) salgono DIETRO lo sfondo e si vedono solo dalle
     finestre trasparenti del PNG; il loro tratto utile è y 676 (valore 0) → 146 (valore massimo), x 100..500 (velocità) e 1450..1850 (giri)
   - le finestre qui sono "binari": una fascia lungo il chevron che sale fino a un arco in alto (come il riferimento),
     con y sempre decrescente lungo il percorso, così il riempimento a salita la percorre tutta.
   - la finestra non è trasparente al 100%: ha un velo scuro (alfa 0.30) che fa da "binario" quando la barra è a zero.
   Lo sfondo è 1920×720 in pixel 1:1 (dash.ftu porta HomeBgWindow a 0,0 1920×720). */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const out = process.argv[2]; const fontPath = process.argv[3];
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 720 } });
  await p.setContent('<!doctype html><body style="margin:0;background:#000"><canvas id="c" width="1920" height="720"></canvas></body>');
  if (fontPath) { const f64 = fs.readFileSync(fontPath).toString('base64'); await p.evaluate(async (d) => { const ff = new FontFace('Num', `url(data:font/ttf;base64,${d})`); await ff.load(); document.fonts.add(ff); }, f64); }
  const variants = { china: '330', english: '160' };
  for (const [name, top] of Object.entries(variants)) {
    const b64 = await p.evaluate(({ top, hasFont }) => {
      const W = 1920, H = 720, cv = document.getElementById('c'), ctx = cv.getContext('2d');
      const FONT = hasFont ? 'Num' : 'Inter, sans-serif';
      /* ---------- colori ---------- */
      const BLUE = '#26a0ff', BLUE_L = '#8fd2ff', BLUE_T = '#2a8be8', RED = '#ff3b36', RED_L = '#ffb0aa', FAC_T = '#2a78d8', FAC_B = '#123f8c';
      /* ---------- geometria (coordinate foto -> schermo), lato SINISTRO ---------- */
      const T = (x, y) => [100 + 0.82 * (x - 92), 146 + 0.82 * (y - 160)];
      const mir = ([x, y]) => [W - x, y];
      // binario della fascia di avanzamento (centro): dal basso, vertice, angolo in alto, arco che sale fino a y=152
      const P0 = [287, 676], P1 = T(135, 440), P2 = T(300, 232), P3 = [466, 154];
      const arcCtrl = [(P2[0] + P3[0]) / 2 - 10, (P2[1] + P3[1]) / 2 - 8];
      const arc = []; for (let i = 0; i <= 24; i++) { const t = i / 24; arc.push([(1 - t) ** 2 * P2[0] + 2 * (1 - t) * t * arcCtrl[0] + t * t * P3[0], (1 - t) ** 2 * P2[1] + 2 * (1 - t) * t * arcCtrl[1] + t * t * P3[1]]); }
      // percorso unico: la banda larga si assottiglia gradualmente nell'arco (raccordo continuo)
      const center = [P0, P1, P2, ...arc.slice(1)];
      let acc = 0; const hw = [28, 28, 28];
      for (let i = 1; i < arc.length; i++) { acc += Math.hypot(arc[i][0] - arc[i - 1][0], arc[i][1] - arc[i - 1][1]); hw.push(7 + 21 * Math.max(0, 1 - acc / 120) ** 1.6); }
      /* offset di una polilinea (miter): d>0 = lato ESTERNO (sinistra/alto) */
      const offsetPoly = (pts, dd) => {
        const n = (a, c) => { const dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy); return [dy / L, -dx / L]; };
        return pts.map((q, i) => {
          const d = typeof dd === 'function' ? dd(i) : dd;
          const a = i > 0 ? n(pts[i - 1], q) : null, c = i < pts.length - 1 ? n(q, pts[i + 1]) : null;
          const m = a && c ? [a[0] + c[0], a[1] + c[1]] : (a || c); const L = Math.hypot(m[0], m[1]); const u = [m[0] / L, m[1] / L];
          const k = a && c ? 1 / Math.max(0.35, u[0] * a[0] + u[1] * a[1]) : 1;
          return [q[0] + u[0] * d * k, q[1] + u[1] * d * k];
        });
      };
      const stroke = (pts, col, w, glow, alpha = 1, join = 'round') => { ctx.save(); ctx.globalAlpha = alpha; ctx.lineJoin = join; ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = w; if (glow) { ctx.shadowColor = glow[0]; ctx.shadowBlur = glow[1]; } ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); ctx.restore(); };
      const poly = (pts, fill, o = {}) => { ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); if (o.round) { ctx.lineJoin = 'round'; ctx.lineWidth = o.round; ctx.strokeStyle = fill; ctx.stroke(); } ctx.fillStyle = fill; ctx.fill(); ctx.restore(); };

      /* ---------- sfondo ---------- */
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);

      /* ---------- faccette blu (riquadri decorativi del riferimento) ---------- */
      const facets = [   // coordinate foto, lato sinistro
        [[232, 456], [338, 258], [466, 252], [380, 408], [342, 456]],
        [[392, 400], [488, 253], [528, 253], [612, 398]],
        [[632, 403], [780, 403], [965, 742], [822, 746]],
        [[372, 516], [694, 516], [820, 744], [478, 744], [372, 530]],
      ];
      const drawFacet = (pts) => {
        const ys = pts.map((q) => q[1]); const g = ctx.createLinearGradient(0, Math.min(...ys), 0, Math.max(...ys)); g.addColorStop(0, FAC_T); g.addColorStop(1, FAC_B);
        ctx.save(); ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.lineJoin = 'round'; ctx.lineWidth = 12; ctx.strokeStyle = g; ctx.fillStyle = g; ctx.stroke(); ctx.fill();
        ctx.globalAlpha = 0.22; ctx.strokeStyle = '#9fd0ff'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); ctx.lineTo(pts[2][0], pts[2][1]); ctx.stroke(); ctx.restore();
      };
      const inset = (pts, d) => { const cx = pts.reduce((s, q) => s + q[0], 0) / pts.length, cy = pts.reduce((s, q) => s + q[1], 0) / pts.length; return pts.map(([x, y]) => { const dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy); return [x + dx / L * d, y + dy / L * d]; }); };
      facets.forEach((f) => { const a = inset(f.map(([x, y]) => T(x, y)), 11); drawFacet(a); drawFacet(a.map(mir)); });

      /* ---------- linee del telaio ---------- */
      const outer = offsetPoly(center, (i) => hw[i] + 8);
      const inner = offsetPoly(center, (i) => -(hw[i] + 22));
      const foot = [T(340, 805), T(1005, 805), T(1035, 765)];
      const vdiag = [T(760, 312), T(1032, 768)];
      const frame = (m, col, colL, colT) => {
        const f = (pts) => (m ? pts.map(mir) : pts);
        // linea esterna spessa con alone + anima chiara
        stroke(f(outer), col, 7, [col, 22]); stroke(f(outer), col, 7, [col, 9]); stroke(f(outer), colL, 2.2, null, 0.9);
        // linea interna sottile
        stroke(f(inner), colT, 2.2, [col, 8]);
        // base e diagonale a V
        stroke(f([[outer[0][0], 675], ...foot]), col, 5, [col, 16]); stroke(f([[outer[0][0], 675], ...foot.slice(1)]), colL, 1.6, null, 0.8);
        stroke(f(vdiag), colT, 2.6, [col, 10]);
      };
      frame(false, BLUE, BLUE_L, BLUE_T); frame(true, RED, RED_L, '#ff5a52');

      /* ---------- scala in alto (linea bianca con tacche e finale) ---------- */
      const scaleTop = (m, label, col) => {
        const f = (q) => (m ? mir(q) : q);
        const A = T(420, 192), B = [P3[0] + 22, P3[1] - 22];
        ctx.save(); ctx.strokeStyle = 'rgba(235,245,255,.92)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...f([A[0], A[1] - 2])); ctx.quadraticCurveTo(...f([(A[0] + B[0]) / 2, (A[1] + B[1]) / 2 - 8]), ...f(B)); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(...f(B)); ctx.lineTo(...f([B[0], B[1] + 14])); ctx.stroke();
        for (let i = 1; i <= 4; i++) { const t = i / 5, x = A[0] + (B[0] - A[0]) * t, y = A[1] + (B[1] - A[1]) * t - 6 * Math.sin(Math.PI * t); ctx.beginPath(); ctx.moveTo(...f([x, y])); ctx.lineTo(...f([x, y + 9])); ctx.stroke(); }
        ctx.fillStyle = col; ctx.font = `26px ${FONT}`; ctx.textAlign = m ? 'right' : 'left'; ctx.textBaseline = 'middle'; const lp = f([B[0] + 10, B[1] + 18]); ctx.fillText(label, lp[0], lp[1]); ctx.restore();
      };
      scaleTop(false, top, '#f2f8ff'); scaleTop(true, '8', '#ff6a63');

      /* ---------- tacche lungo il bordo esterno e numeri dei giri ---------- */
      const yOf = (v, max) => 676 - 530 * v / max;
      const xOnOuter = (y, pts) => { for (let i = 0; i < pts.length - 1; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; if ((y0 - y) * (y1 - y) <= 0 && y0 !== y1) return x0 + (x1 - x0) * (y - y0) / (y1 - y0); } return null; };
      const ticks = (m, max, step, col, label) => {
        const out = offsetPoly(center, (i) => hw[i] + 8);
        for (let v = step; v < max - 1e-6; v += step) {
          const y = yOf(v, max); const x = xOnOuter(y, out.slice(0, 3)); if (x == null) continue;
          const q = m ? mir([x, y]) : [x, y]; const dir = m ? -1 : 1;
          ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(q[0] + dir * 6, q[1]); ctx.lineTo(q[0] + dir * 26, q[1]); ctx.stroke(); ctx.restore();
          if (label) { ctx.save(); ctx.font = `italic 40px ${FONT}`; ctx.fillStyle = '#ff4a44'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.shadowColor = '#ff2a24'; ctx.shadowBlur = 8; ctx.transform(1, 0, -0.18, 1, 0, 0); ctx.fillText(String(Math.round(v)), q[0] * 1 + 34 + 0.18 * q[1] - 0.18 * 0, q[1]); ctx.restore(); }
        }
      };
      ticks(false, +top, top === '330' ? 30 : 20, 'rgba(160,215,255,.85)', false);
      ticks(true, 8, 1, 'rgba(255,170,165,.9)', true);

      /* ---------- parallelogrammi in basso al centro ---------- */
      const para = [[790, 690], [900, 690], [885, 714], [775, 714]];
      for (let i = 0; i < 4; i++) { const dx = i * 90 + 0; poly(para.map(([x, y]) => [x + dx + 60, y]), i % 2 ? '#1b5fb8' : '#2377d6'); }

      /* ---------- finestre (binari) e tacche: costruisco la maschera ---------- */
      const mk = document.createElement('canvas'); mk.width = W; mk.height = H; const m = mk.getContext('2d');
      const strokeMask = (mirror) => {
        const f = (q) => (mirror ? mir(q) : q);
        const L = offsetPoly(center, (i) => hw[i]).map(f), R = offsetPoly(center, (i) => -hw[i]).map(f);
        m.fillStyle = '#fff'; m.beginPath(); L.forEach(([x, y], i) => (i ? m.lineTo(x, y) : m.moveTo(x, y))); R.reverse().forEach(([x, y]) => m.lineTo(x, y)); m.closePath(); m.fill();
      };
      strokeMask(false); strokeMask(true);
      const mask = m.getImageData(0, 0, W, H).data;
      const img = ctx.getImageData(0, 0, W, H); const d = img.data;
      const ALPHA = 0.45, TRK_L = [46, 160, 225], TRK_R = [225, 46, 52];   // opacità del velo e tinta: a riposo si vede un binario azzurro/rosso scuro
      for (let i = 0; i < W * H; i++) {
        const a = mask[i * 4] / 255; if (a <= 0) continue;
        const x = i % W; const trk = x < W / 2 ? TRK_L : TRK_R;
        d[i * 4] = d[i * 4] * (1 - a) + trk[0] * a; d[i * 4 + 1] = d[i * 4 + 1] * (1 - a) + trk[1] * a; d[i * 4 + 2] = d[i * 4 + 2] * (1 - a) + trk[2] * a;
        d[i * 4 + 3] = Math.round(255 * (1 - a * (1 - ALPHA)));
      }
      ctx.putImageData(img, 0, 0);
      return cv.toDataURL('image/png');
    }, { top, hasFont: !!fontPath });
    fs.writeFileSync(path.join(out, `dash_bg_${name}.png`), Buffer.from(b64.split(',')[1], 'base64'));
  }
  await b.close();
  console.log('ok');
})();
