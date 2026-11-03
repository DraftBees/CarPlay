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
    if rel.startswith('dash/dash_bg'):   # finestre con trasparenza parziale e bordi morbidi: RGBA, senza palette
        out = os.path.join(dst, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
        im.save(out, optimize=True)
        so = os.path.getsize(op) if os.path.exists(op) else 0; sn = os.path.getsize(out); tot_o += so; tot_n += sn; rows.append((rel, so, sn)); continue
    # libimagequant: palette 256 colori con dithering di qualità e alfa (niente aloni a gradini, niente bande)
    import imagequant
    q = imagequant.quantize_pil_image(im if im.getextrema()[3][0] < 255 else im.convert('RGB').convert('RGBA'), dithering_level=1.0, max_colors=256, min_quality=80, max_quality=100)
    out = os.path.join(dst, rel); os.makedirs(os.path.dirname(out), exist_ok=True)
    q.save(out, optimize=True)
    # se la palette peggiora troppo un'icona piccola, tieni RGBA (pesa poco comunque)
    if os.path.getsize(out) > os.path.getsize(f): im.save(out, optimize=True)
    so, sn = (os.path.getsize(op) if os.path.exists(op) else 0), os.path.getsize(out)
    tot_o += so; tot_n += sn; rows.append((rel, so, sn))
for r in rows:
    if r[2] > 300_000: print('GRANDE', r)
print(f'{len(rows)} file: originali {tot_o/1024:.0f} KB -> tema {tot_n/1024:.0f} KB')
