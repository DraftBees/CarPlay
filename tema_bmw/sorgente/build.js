// Genera i PNG del tema alle dimensioni originali.  Uso: node build.js <cartella_uscita_grezza>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const out = process.argv[2];
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 2000, height: 800 }, deviceScaleFactor: 1 });
  await p.setContent(`<!doctype html><html><head><style>html,body{margin:0;background:transparent;font-family:Inter,sans-serif}*{box-sizing:border-box}i{display:block}</style></head><body><div id="root"></div></body></html>`);
  await p.evaluate(() => { window.NO_NOISE = true; }); // il rumore pesa molto nei PNG: l'anti-banding lo fa il dithering
  await p.addScriptTag({ path: path.join(__dirname, 'tema.js') });
  // le dimensioni vere vengono dal backup: ogni PNG deve avere ESATTAMENTE la misura dell'originale
  const sizes = JSON.parse(fs.readFileSync(path.join(__dirname, 'dimensioni_originali.json'), 'utf8'));
  const fixed = await p.evaluate((sz) => window.ASSETS.map((a) => { const s = sz[a.path]; if (!s) return 'MANCA ' + a.path; if (s[0] !== a.w || s[1] !== a.h) { const m = `${a.path} ${a.w}x${a.h} -> ${s[0]}x${s[1]}`; a.w = s[0]; a.h = s[1]; return m; } return null; }).filter(Boolean), sizes);
  if (fixed.length) console.log('dimensioni corrette:\n ' + fixed.join('\n '));
  const n = await p.evaluate(() => window.ASSETS.length);
  for (let i = 0; i < n; i++) {
    const rel = await p.evaluate((j) => window.renderAsset(j), i);
    const dst = path.join(out, rel); fs.mkdirSync(path.dirname(dst), { recursive: true });
    await p.locator('#a').screenshot({ path: dst, omitBackground: true });
  }
  console.log('generati', n);
  await b.close();
})();
