"""Porta nello stile del tema le immagini originali che compaiono nei layout veri ma non sono ridisegnate a mano.
Regole (solo colore: forma, dimensioni e trasparenza restano identiche):
  - giallo (cornici di selezione / fuoco)      -> ciano del tema
  - blu (evidenziazioni del vecchio tema)      -> ciano / blu del tema, stessa luminosità
  - pannelli blu scuro                          -> nero neutro
  - icone bianche                               -> invariate
  - NON si toccano: rendering dell'auto, porte, radar, linee guida (verde/giallo/rosso hanno un significato)
Uso: python3 -I ricolora.py <backup/res/ui> <cartella grezzi> <cartella layout json>"""
import sys, os, json, glob
import numpy as np
from PIL import Image

SRC, RAW, LAY = sys.argv[1:4]
NOMI = ['main', 'dash', 'car', 'doorDisplay', 'airControl', 'backcarwindow', 'bg', 'eq', 'settings', 'factory', 'btMusic', 'btOutgoing', 'calling',
        'btsetting', 'btTransmitWindow', 'music', 'video', 'lylinkview', 'linkhelp', 'linkDisplayAdjust', 'navibar']
ESCLUSI = ('car/car.png', 'car/car_bg.png', 'HomePage/car_n.png', 'HomePage/car_s.png')
ESCLUSI_DIR = ('door/', 'car/f', 'car/r', 'car/t')          # porte, radar anteriore/posteriore, traiettorie

refs = set()
def walk(o):
    if isinstance(o, dict):
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
    elif isinstance(o, str) and o.lower().endswith('.png'): refs.add(o.lstrip('/'))
for n in NOMI: walk(json.load(open(os.path.join(LAY, n + '.json'), encoding='utf-8')))

def rgb2hsv(a):
    r, g, b = a[..., 0], a[..., 1], a[..., 2]; mx = a.max(-1); mn = a.min(-1); d = mx - mn
    h = np.zeros_like(mx)
    m = d > 1e-6
    rr = m & (mx == r); gg = m & (mx == g) & ~rr; bb = m & ~rr & ~gg
    h[rr] = ((g - b)[rr] / d[rr]) % 6; h[gg] = (b - r)[gg] / d[gg] + 2; h[bb] = (r - g)[bb] / d[bb] + 4
    return h * 60, np.where(mx > 0, d / np.maximum(mx, 1e-6), 0), mx
def hsv2rgb(h, s, v):
    c = v * s; hp = (h / 60) % 6; x = c * (1 - np.abs(hp % 2 - 1)); z = np.zeros_like(h)
    conds = [(hp < 1), (hp < 2), (hp < 3), (hp < 4), (hp < 5), (hp >= 5)]
    vals = [(c, x, z), (x, c, z), (z, c, x), (z, x, c), (x, z, c), (c, z, x)]
    r = np.select(conds, [t[0] for t in vals]); g = np.select(conds, [t[1] for t in vals]); b = np.select(conds, [t[2] for t in vals])
    m = v - c
    return np.stack([r + m, g + m, b + m], -1)

done = {'giallo': 0, 'blu': 0, 'scuro': 0}
for rel in sorted(refs):
    if rel in ESCLUSI or rel.startswith(ESCLUSI_DIR): continue
    if os.path.exists(os.path.join(RAW, rel)): continue          # già ridisegnata a mano
    sp = os.path.join(SRC, rel)
    if not os.path.exists(sp): continue
    im = Image.open(sp).convert('RGBA'); a = np.asarray(im).astype(float) / 255.0
    rgb, al = a[..., :3], a[..., 3]
    h, s, v = rgb2hsv(rgb)
    vis = al > 0.12
    if not vis.any(): continue
    colored = vis & (s > 0.35) & (v > 0.3)
    hue = np.median(h[colored]) if colored.sum() > vis.sum() * 0.15 else None
    if hue is not None and 20 < hue < 75: kind = 'giallo'
    elif hue is not None and 160 < hue < 260: kind = 'blu'
    elif np.mean(v[vis]) <= 0.6: kind = 'scuro'
    else: continue                                                # bianco / neutro: invariato
    if kind == 'giallo':
        nh = np.full_like(h, 190.0); ns = np.clip(s * 0.9, 0, 0.78); nv = np.clip(v * 1.05, 0, 1)
    elif kind == 'blu':
        nh = 190 + (h - hue) * 0.6                                 # centrato sul ciano, mantiene le sfumature
        nh = np.where(s > 0.12, nh, h); ns = np.clip(s, 0, 0.85); nv = v
    else:   # scuro: toglie il blu, abbassa leggermente
        nh = h; ns = s * 0.18; nv = v * 0.78
    out = hsv2rgb(nh % 360, ns, nv)
    res = np.dstack([np.clip(out, 0, 1), al])
    dst = os.path.join(RAW, rel); os.makedirs(os.path.dirname(dst), exist_ok=True)
    Image.fromarray((res * 255 + 0.5).astype(np.uint8), 'RGBA').save(dst)
    done[kind] += 1
print('ricolorate:', done)
