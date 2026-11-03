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
    o = Image.open(os.path.join(orig, rel)); assert o.size == im.size, (rel, o.size, im.size)
    if im.getextrema()[3][0] == 255:  # opaca: palette con dithering
        rgb = im.convert('RGB'); pal = rgb.quantize(256, method=Image.Quantize.MEDIANCUT)
        q = rgb.quantize(palette=pal, dither=Image.Dither.FLOYDSTEINBERG)
    else:
        q = im.quantize(256, method=Image.Quantize.FASTOCTREE)
    out = os.path.join(dst, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
    q.save(out, optimize=True)
    # se la palette peggiora troppo un'icona piccola, tieni RGBA (pesa poco comunque)
    if os.path.getsize(out) > os.path.getsize(f): im.save(out, optimize=True)
    so, sn = os.path.getsize(os.path.join(orig, rel)), os.path.getsize(out)
    tot_o += so; tot_n += sn; rows.append((rel, so, sn))
for r in rows:
    if r[2] > 300_000: print('GRANDE', r)
print(f'{len(rows)} file: originali {tot_o/1024:.0f} KB -> tema {tot_n/1024:.0f} KB')
