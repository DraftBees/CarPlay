"""Sfondo del cruscotto direttamente dall'immagine fornita dall'utente (dash/cluster.webp, 2000×1116).

L'immagine NON viene ridimensionata: è una semplice traslazione (x -40, y -124) nel quadro 1920×720, quindi i pixel restano
quelli originali. Dall'immagine si ricavano, con la segmentazione dei colori, le fasce delle due barre (banda scura + barra
sfumata in alto): lì lo sfondo diventa una finestra, da cui si vede la barra che sale DIETRO (come sul display vero).

Vincoli del display (dedotti dal layout originale): la barra sale da y=676 (zero) a y=146 (massimo) e copre
x 100–500 (velocità) e 1450–1850 (giri): le finestre vengono limitate a queste zone.
Le scale di carburante e temperatura nell'immagine mostrano segmenti accesi: li spengo (grigio), altrimenti indicherebbero un livello falso.

Uso: python3 -I dash_da_immagine.py <dash/cluster.webp> <uscita res/ui/dash>"""
import sys, os
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC, DST = sys.argv[1], sys.argv[2]
os.makedirs(DST, exist_ok=True)
OX, OY, W, H = 40, 124, 1920, 720                     # x_schermo = x_img - OX ; y_schermo = y_img - OY
img = Image.open(SRC).convert('RGB')
a = np.asarray(img).astype(int)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
hh, ww = R.shape
yy, xx = np.mgrid[0:hh, 0:ww]

def largest(mask, keep=1, minsize=150):
    lab, n = ndi.label(mask)
    if n == 0: return mask
    sizes = ndi.sum(mask, lab, range(1, n + 1)); idx = np.argsort(sizes)[::-1][:keep] + 1
    return np.isin(lab, idx[sizes[idx - 1] >= minsize])

# --- fasce (coordinate immagine)
band_l = (R < 40) & (G > 28) & (G < 100) & (B > 55) & (B < 170) & (B > G + 18) & (xx > 215) & (xx < 545) & (yy > 270) & (yy < 815)
band_l = largest(ndi.binary_closing(band_l, np.ones((5, 5))))
arc_l = (B > 45) & (R < 110) & (B > R + 30) & (xx > 420) & (xx < 770) & (yy > 268) & (yy < 325) & ~((R > 40) & (G > 140))
arc_l = largest(ndi.binary_opening(arc_l, np.ones((3, 3))), 1, 200)
band_r = (R > 70) & (R < 140) & (G < 35) & (B < 45) & (xx > 1530) & (xx < 1810) & (yy > 270) & (yy < 815)
band_r = largest(ndi.binary_closing(band_r, np.ones((5, 5))))
arc_r = (R > 60) & (G < 60) & (B < 60) & (R > G + 30) & (xx > 1240) & (xx < 1580) & (yy > 268) & (yy < 325) & ~(R > 200)
arc_r = largest(ndi.binary_opening(arc_r, np.ones((3, 3))), 2, 150)
# limiti della barra sul display: x 100–500 (sx) e 1450–1850 (dx)
win = band_l | (arc_l & (xx - OX <= 500)) | band_r | (arc_r & (xx - OX >= 1450))
win &= (yy - OY >= 146) & (yy - OY <= 676)

# --- scale carburante e temperatura: spengo i segmenti accesi
def dim(box, hot=True):
    x0, y0, x1, y1 = box
    sub = a[y0:y1, x0:x1].copy()
    white = (sub.min(2) > 140)
    red = (sub[..., 0] > 140) & (sub[..., 1] < 90) & (sub[..., 2] < 90)
    teal = (sub[..., 1] > 120) & (sub[..., 0] < 90) & (sub[..., 2] > 100) & ~white
    sub[white] = (66, 72, 82); sub[red] = (96, 26, 30); sub[teal] = (40, 70, 80)
    a[y0:y1, x0:x1] = sub
dim((360, 585, 530, 795)); dim((1480, 590, 1635, 800))
base = np.clip(a, 0, 255).astype(np.uint8)

# --- finestre: velo con opacità >= 0.45; il colore è riscalato così a riposo l'aspetto resta quello dell'immagine
m = ndi.gaussian_filter(win.astype(float), 0.7)[..., None]
c = base.astype(float)
alpha_w = np.clip(c.max(2, keepdims=True) / 255.0, 0.45, 1.0)
col = c * (1 - m) + np.clip(c / alpha_w, 0, 255) * m
alpha = 1 - m * (1 - alpha_w)
rgba = np.dstack([col, alpha * 255]).astype(np.uint8)
out = Image.fromarray(rgba, 'RGBA').crop((OX, OY, OX + W, OY + H))
assert out.size == (W, H)
for name in ('dash_bg_china.png', 'dash_bg_english.png'):    # l'immagine non ha numeri: stessa per le due scale
    out.save(os.path.join(DST, name), optimize=True)
print('ok', int(win.sum()), 'px di finestra')
