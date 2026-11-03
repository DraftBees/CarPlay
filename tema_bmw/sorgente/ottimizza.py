"""Riduce i PNG generati (palette 256 colori con trasparenza) e li copia nel tema.
Uso: python3 -I ottimizza.py <grezzi> <tema_bmw/res/ui> <backup/res/ui originale>"""
import sys, os, glob
from PIL import Image
raw, dst, orig = sys.argv[1:4]
tot_o = tot_n = 0
rows = []
for f in sorted(glob.glob(raw + '/**/*.png', recursive=True)):
    rel = os.path.relpath(f, raw)
    im = Image.open(f).convert('RGBA')
    op = os.path.join(orig, rel)
    if os.path.exists(op):
        assert Image.open(op).size == im.size, (rel, Image.open(op).size, im.size)
    if rel.startswith('dash/dash_bg'):   # finestre trasparenti: palette a 255 colori con dithering + indice 255 trasparente
        import numpy as np
        a = np.asarray(im)[..., 3] >= 128
        rgb = im.convert('RGB'); pal = rgb.quantize(255, method=Image.Quantize.MEDIANCUT)
        qq = rgb.quantize(palette=pal, dither=Image.Dither.FLOYDSTEINBERG)
        arr = np.asarray(qq).copy(); arr[~a] = 255
        q = Image.fromarray(arr, 'P'); pl = qq.getpalette()[:765]; pl += [0] * (768 - len(pl)); q.putpalette(pl)
        q.info['transparency'] = 255
        out = os.path.join(dst, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
        q.save(out, optimize=True, transparency=255)
        so = os.path.getsize(op) if os.path.exists(op) else 0; sn = os.path.getsize(out); tot_o += so; tot_n += sn; rows.append((rel, so, sn)); continue
    if im.getextrema()[3][0] == 255:  # opaca: palette con dithering
        rgb = im.convert('RGB'); pal = rgb.quantize(256, method=Image.Quantize.MEDIANCUT)
        q = rgb.quantize(palette=pal, dither=Image.Dither.FLOYDSTEINBERG)
    else:
        q = im.quantize(256, method=Image.Quantize.FASTOCTREE)
    out = os.path.join(dst, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
    q.save(out, optimize=True)
    # se la palette peggiora troppo un'icona piccola, tieni RGBA (pesa poco comunque)
    if os.path.getsize(out) > os.path.getsize(f): im.save(out, optimize=True)
    so, sn = (os.path.getsize(op) if os.path.exists(op) else 0), os.path.getsize(out)
    tot_o += so; tot_n += sn; rows.append((rel, so, sn))
for r in rows:
    if r[2] > 300_000: print('GRANDE', r)
print(f'{len(rows)} file: originali {tot_o/1024:.0f} KB -> tema {tot_n/1024:.0f} KB')
