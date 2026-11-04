"""Immagini delle portiere dalla vista dall'alto dell'auto dell'utente (auto/auto_top.webp, trasparente, 848×1264).

Il display (layout doorDisplay, 664×480) sovrappone: la base dell'auto SENZA cofano (vano motore visibile), il cofano chiuso,
e per ogni parte aperta un livello "open". Qui:
  - alert_car.png          base: auto con portiere e portellone chiusi, cofano tolto (vano motore dipinto)
  - alert_car_engine.png   cofano chiuso
  - *_open.png             parte aperta, in rosso di allerta: ogni livello contiene anche l'apertura scura che copre la parte chiusa
                           sottostante, così il risultato è corretto qualunque sia l'ordine in cui il programma mostra i livelli
  - *_door.png / alert_car_rear.png   parti chiuse (identiche alla base: innocue se mostrate)
Le portiere aperte sono la ROTAZIONE della vera sagoma della portiera attorno al cardine (la vista dall'alto non cambia forma
ruotando attorno a un asse verticale); cofano e portellone sono accorciati attorno alla cerniera (prospettiva).
Uso: python3 -I porte.py <auto_top.webp> <uscita res/ui>"""
import sys, os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage as ndi

SRC, DST = sys.argv[1], sys.argv[2]
car = Image.open(SRC).convert('RGBA')
CW, CH = car.size
S = 413 / 1160.0                      # altezza dell'auto 413 px come l'originale (alert_car.png)
CX_T, TOP_T = 329.5, 33               # centro e bordo alto dell'auto nel quadro 664×480
CX_I, TOP_I = 428, 30                 # centro e bordo alto nell'immagine
RED_D, RED_L = np.array([46, 2, 8]), np.array([255, 96, 104])

def mask_poly(pts, ss=3):
    m = Image.new('L', (CW * ss, CH * ss), 0)
    ImageDraw.Draw(m).polygon([(x * ss, y * ss) for x, y in pts], fill=255)
    return m.resize((CW, CH), Image.LANCZOS)
def mirror(pts): return [(2 * CX_I - x, y) for x, y in pts]
def rotate_pts(pts, hinge, deg):
    r = math.radians(deg); c, s = math.cos(r), math.sin(r)
    return [(hinge[0] + (x - hinge[0]) * c - (y - hinge[1]) * s, hinge[1] + (x - hinge[0]) * s + (y - hinge[1]) * c) for x, y in pts]
def cut(img, mask):
    out = img.copy(); a = np.minimum(np.asarray(img)[..., 3], np.asarray(mask)); out.putalpha(Image.fromarray(a.astype('uint8'))); return out
def tint_red(img, glow=True):
    a = np.asarray(img).astype(float); l = (a[..., 0] * .3 + a[..., 1] * .5 + a[..., 2] * .2) / 255.0
    l = np.clip((l - 0.05) * 1.5, 0, 1)[..., None]
    rgb = RED_D * (1 - l) + RED_L * l
    out = Image.fromarray(np.dstack([rgb, a[..., 3]]).astype('uint8'), 'RGBA')
    if glow:
        al = np.asarray(out)[..., 3] / 255.0; g = ndi.gaussian_filter(al, 9) * 0.9
        base = np.zeros(al.shape + (4,)); base[..., 0] = 255; base[..., 1] = 40; base[..., 2] = 55; base[..., 3] = np.clip(g, 0, 1) * 255
        bg = Image.fromarray(base.astype('uint8'), 'RGBA'); bg.alpha_composite(out); return bg
    return out
def shadow(img, dx=10, dy=14, blur=10, op=0.55):
    a = np.asarray(img)[..., 3] / 255.0; s = ndi.gaussian_filter(np.roll(np.roll(a, dy, 0), dx, 1), blur) * op
    sh = np.zeros(a.shape + (4,)); sh[..., 3] = np.clip(s, 0, 1) * 255
    return Image.fromarray(sh.astype('uint8'), 'RGBA')
def to_target(img):
    """riporta un livello (spazio immagine) nel quadro 664×480 dell'originale."""
    w, h = int(round(CW * S)), int(round(CH * S))
    small = img.resize((w, h), Image.LANCZOS)
    out = Image.new('RGBA', (664, 480), (0, 0, 0, 0))
    out.alpha_composite(small, (int(round(CX_T - CX_I * S)), int(round(TOP_T - TOP_I * S))))
    return out

# ---------------- geometria (coordinate immagine) ----------------
HOOD = [(258, 96), (596, 96), (650, 398), (610, 372), (540, 350), (430, 338), (320, 348), (250, 375), (210, 398)]
HINGE_HOOD_Y = 352
TAIL = [(252, 966), (430, 960), (600, 966), (630, 1010), (640, 1060), (610, 1110), (430, 1130), (250, 1112), (222, 1060), (228, 1010)]
HINGE_TAIL_Y = 966
DOORS = {   # (poligono sinistro, cardine, angolo di apertura)
    'left_front': ([(188, 478), (222, 468), (268, 496), (268, 660), (205, 668), (172, 664), (168, 600), (172, 520)], (205, 474), 42),
    'left_rear': ([(205, 690), (268, 694), (268, 935), (235, 935), (205, 925), (185, 880), (170, 800), (168, 722)], (205, 692), 40),
}
DARK_IN = (10, 14, 20, 255)

hood_mask = mask_poly(HOOD); tail_mask = mask_poly(TAIL)
car_alpha = car.getchannel('A')
hood_in = Image.fromarray(np.minimum(np.asarray(hood_mask), np.asarray(car_alpha)).astype('uint8'))
tail_in = Image.fromarray(np.minimum(np.asarray(tail_mask), np.asarray(car_alpha)).astype('uint8'))

# ---------------- vano motore ----------------
bay = Image.new('RGBA', car.size, (0, 0, 0, 0)); d = ImageDraw.Draw(bay)
d.rectangle((0, 0, CW, CH), fill=(12, 16, 22, 255))
for cx in (300, 556): d.ellipse((cx - 46, 214, cx + 46, 306), fill=(26, 33, 44, 255), outline=(52, 70, 92, 255), width=3)
d.rounded_rectangle((345, 150, 511, 300), 22, fill=(20, 27, 37, 255), outline=(40, 160, 200, 255), width=3)
d.rectangle((250, 100, 606, 128), fill=(30, 38, 50, 255)); d.line((250, 128, 606, 128), fill=(61, 228, 255, 200), width=2)
for x in range(360, 500, 28): d.line((x, 170, x, 280), fill=(34, 44, 58, 255), width=3)
bay = cut(bay, hood_in)

hood_piece = cut(car, hood_in)
car_nohood = car.copy(); hole = Image.new('RGBA', car.size, (0, 0, 0, 0)); car_nohood.paste(Image.new('RGBA', car.size, (0, 0, 0, 0)), mask=hood_in)
base = car.copy(); base_a = np.asarray(base).copy(); hm = np.asarray(hood_in) / 255.0
base_img = Image.alpha_composite(Image.composite(Image.new('RGBA', car.size, (0, 0, 0, 0)), car, hood_in), bay)

# ---------------- livelli ----------------
layers = {}
layers['alert_car.png'] = base_img
layers['alert_car_engine.png'] = hood_piece

# cofano aperto: apertura scura sul cofano chiuso + cofano raccorciato attorno alla cerniera
def squash(piece, y_h, k):
    bb = piece.getbbox(); crop = piece.crop(bb); nh = max(1, int(round((bb[3] - bb[1]) * k)))
    sq = crop.resize((crop.width, nh), Image.LANCZOS); out = Image.new('RGBA', car.size, (0, 0, 0, 0))
    out.alpha_composite(sq, (bb[0], int(round(y_h - (y_h - bb[1]) * k)) if False else int(round(y_h - nh + (bb[3] - y_h) * k))))
    return out
hood_raised = squash(hood_piece, HINGE_HOOD_Y, 0.58)
hole_h = cut(Image.new('RGBA', car.size, DARK_IN), hood_in)
open_hood = Image.alpha_composite(Image.alpha_composite(hole_h, bay), Image.alpha_composite(shadow(hood_raised), tint_red(hood_raised)))
layers['alert_car_engine_open.png'] = open_hood

# portellone
tail_piece = cut(car, tail_in)
tail_raised = squash(tail_piece, HINGE_TAIL_Y, 0.5) if False else None
bb = tail_piece.getbbox(); crop = tail_piece.crop(bb); nh = int(round((bb[3] - bb[1]) * 0.52))
sq = crop.resize((crop.width, nh), Image.LANCZOS); tail_raised = Image.new('RGBA', car.size, (0, 0, 0, 0)); tail_raised.alpha_composite(sq, (bb[0], bb[1]))
hole_t = cut(Image.new('RGBA', car.size, DARK_IN), tail_in)
layers['alert_car_rear_open.png'] = Image.alpha_composite(hole_t, Image.alpha_composite(shadow(tail_raised, 0, 18), tint_red(tail_raised)))
layers['alert_car_rear.png'] = tail_piece

# portiere
for name, (poly, hinge, ang) in DOORS.items():
    for side in ('left', 'right'):
        pts = poly if side == 'left' else mirror(poly); hg = hinge if side == 'left' else (2 * CX_I - hinge[0], hinge[1])
        m = mask_poly(pts); mm = Image.fromarray(np.minimum(np.asarray(m), np.asarray(car_alpha)).astype('uint8'))
        piece = cut(car, mm)
        # sagoma ruotata: stesso contenuto, ruotato attorno al cardine (verso l'esterno)
        sign = 1 if side == 'left' else -1
        rot = piece.rotate(-sign * ang, resample=Image.BICUBIC, center=hg)
        hole_d = cut(Image.new('RGBA', car.size, DARK_IN), mm)
        n = name.replace('left', side)
        layers[f'alert_car_{n}_door_open.png'] = Image.alpha_composite(hole_d, Image.alpha_composite(shadow(rot, -sign * 8, 12), tint_red(rot)))
        layers[f'alert_car_{n}_door.png'] = piece

os.makedirs(os.path.join(DST, 'door'), exist_ok=True)
for fn, im in layers.items():
    fn_out = fn.replace('left_front_door_open', 'left_front_door_open')
    to_target(im).save(os.path.join(DST, 'door', fn_out), optimize=True)
print('ok', sorted(layers))

# ---------------- schermata "Info veicolo": auto dall'alto (231×338, sagoma 153×331 come l'originale) ----------------
def fit_car(img, w, h, bbox):
    x0, y0, x1, y1 = bbox; bh = y1 - y0 + 1; k = bh / float(img.getbbox()[3] - img.getbbox()[1])
    bb = img.getbbox(); crop = img.crop(bb); nw, nh = int(round(crop.width * k)), bh
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0)); out.alpha_composite(crop.resize((nw, nh), Image.LANCZOS), (int(round((x0 + x1) / 2.0 - nw / 2.0)), y0)); return out
os.makedirs(os.path.join(DST, 'car'), exist_ok=True)
fit_car(car, 231, 338, (36, 2, 189, 333)).save(os.path.join(DST, 'car', 'car.png'), optimize=True)

# ---------------- sfondo del pannello delle portiere (664×480): nero con filo di luce ciano → rosso ----------------
def panel(w, h, r=24, ss=3):
    W2, H2 = w * ss, h * ss
    m = Image.new('L', (W2, H2), 0); ImageDraw.Draw(m).rounded_rectangle((2 * ss, 2 * ss, W2 - 2 * ss, H2 - 2 * ss), r * ss, fill=255)
    base = np.zeros((H2, W2, 4), np.uint8); yy = np.linspace(0, 1, H2)[:, None]
    for c, (a, b) in enumerate([(10, 2), (14, 3), (20, 5)]): base[..., c] = (a + (b - a) * yy).astype(np.uint8)
    base[..., 3] = np.asarray(m)
    img = Image.fromarray(base, 'RGBA')
    ring = Image.new('L', (W2, H2), 0); d = ImageDraw.Draw(ring); d.rounded_rectangle((2 * ss, 2 * ss, W2 - 2 * ss, H2 - 2 * ss), r * ss, outline=255, width=int(1.6 * ss))
    xx = np.linspace(0, 1, W2)[None, :] + np.zeros((H2, 1)); gy = np.linspace(0, 1, H2)[:, None] + np.zeros((1, W2)); t = (xx * 0.7 + gy * 0.3)
    col = np.zeros((H2, W2, 4), np.uint8)
    col[..., 0] = np.clip(61 + (255 - 61) * t, 0, 255); col[..., 1] = np.clip(228 + (51 - 228) * t, 0, 255); col[..., 2] = np.clip(255 + (69 - 255) * t, 0, 255); col[..., 3] = (np.asarray(ring) * 0.55).astype(np.uint8)
    img.alpha_composite(Image.fromarray(col, 'RGBA'))
    return img.resize((w, h), Image.LANCZOS)
panel(664, 480).save(os.path.join(DST, 'door', 'alert_carinfo_bg.png'), optimize=True)
print('ok car + pannello')

