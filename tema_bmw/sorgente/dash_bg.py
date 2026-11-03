"""Genera gli sfondi del cruscotto in stile "cluster" (nero, neon ciano a sinistra, rosso a destra).

IMPORTANTE (verificato sul backup): sul display il riempimento delle barre NON è disegnato sopra lo sfondo.
Le due barre (SpeedDisplayTextView / RotateDisplayTextView, immagine press_bg_*.png) salgono DIETRO lo sfondo
e si vedono solo attraverso le finestre trasparenti dello sfondo. Perciò la forma e la posizione delle finestre
(canale alfa) restano identiche all'originale; cambiano solo i pixel opachi intorno.

Uso: python3 -I dash_bg.py <backup/res/ui/dash> <uscita res/ui/dash> [logo.webp]"""
import sys, os
import numpy as np
from scipy import ndimage as ndi
from PIL import Image, ImageDraw, ImageFont

SRC, DST = sys.argv[1], sys.argv[2]
LOGO = sys.argv[3] if len(sys.argv) > 3 else None   # logo su sfondo nero (opzionale)
os.makedirs(DST, exist_ok=True)
W, H = 1920, 720
STRETCH = 720 / 620   # HomeBgWindow del layout è 1920×620: il PNG viene compresso in verticale
FONT = '/usr/share/fonts/opentype/inter/Inter-Light.otf'

CYAN = np.array([61, 228, 255]) / 255.0; CYAN_HOT = np.array([215, 251, 255]) / 255.0; BLUE = np.array([31, 70, 255]) / 255.0
RED = np.array([255, 51, 69]) / 255.0;   RED_HOT = np.array([255, 214, 218]) / 255.0;  RDEEP = np.array([150, 14, 38]) / 255.0
g = lambda a, s: ndi.gaussian_filter(a, s)


def analyse(alpha, side):
    win = alpha < 20
    half = np.zeros_like(win)
    if side == 'L': half[:, :960] = win[:, :960]
    else: half[:, 960:] = win[:, 960:]
    flip = side == 'R'
    if flip: half = half[:, ::-1]
    hull = ndi.binary_fill_holes(ndi.binary_closing(half, structure=np.ones((9, 9))))
    return half, hull, flip


def streak(canvas, x0, y0, x1, y1, w0, w1, color, a0=1.0):
    """linea rastremata con dissolvenza lungo la lunghezza (come le scie dell'emblema di riferimento)."""
    n = int(np.hypot(x1 - x0, y1 - y0)); yy, xx = np.mgrid[0:H, 0:W]
    dx, dy = (x1 - x0) / n, (y1 - y0) / n
    t = ((xx - x0) * dx + (yy - y0) * dy) / n
    d = np.abs(-(xx - x0) * dy + (yy - y0) * dx)
    width = w0 + (w1 - w0) * np.clip(t, 0, 1)
    m = (t >= 0) & (t <= 1) & (d < width + 1)
    a = np.where(m, np.clip(1 - d / (width + 1), 0, 1), 0) * (a0 * np.clip(1 - t, 0, 1) ** 1.4)
    canvas += a[..., None] * np.asarray(color)[None, None, :]


def build(variant, labels_left, top_left, labels_right, top_right):
    alpha = np.asarray(Image.open(os.path.join(SRC, f'dash_bg_{variant}.png')).convert('RGBA'))[..., 3]
    yy, xx = np.mgrid[0:H, 0:W]
    out = np.zeros((H, W, 3))
    glow = np.zeros((H, W, 3))
    hull_final = np.zeros((H, W), bool); ticks_final = np.zeros((H, W), bool); tick_col = np.zeros((H, W, 3))
    jobs = []

    for side in ('L', 'R'):
        half, hull, flip = analyse(alpha, side)
        ticks = hull & ~half
        rows = np.where(hull.any(1))[0]; top, bot = int(rows.min()), int(rows.max())
        minx = np.full(H, 10 ** 6); maxx = np.full(H, -1)
        for y in rows:
            xs = np.where(hull[y])[0]; minx[y], maxx[y] = xs.min(), xs.max()
        dist = ndi.distance_transform_edt(~hull)
        inrow = (yy >= top - 2) & (yy <= bot + 2)
        mn = minx[np.clip(yy, 0, H - 1)]; mx = maxx[np.clip(yy, 0, H - 1)]
        body = ((dist >= 7) & (dist <= 12.5) & (xx < mn) & inrow).astype(float)
        thin = ((dist >= 17) & (dist <= 19.2) & (xx > mx) & inrow).astype(float)
        xt0 = int(minx[top]) - 4; xb0 = int(minx[bot]) - 4
        hl = np.zeros((H, W))
        hl[top - 8:top - 2, xt0:xt0 + 360] = 1.0
        fade_t = np.clip((xt0 + 360 - xx) / 330.0, 0, 1) ** 1.2
        hl[top - 8:top - 2] *= fade_t[top - 8:top - 2]
        hl[bot + 2:bot + 8, xb0:xb0 + 560] = 1.0
        fade_b = np.clip((xb0 + 560 - xx) / 520.0, 0, 1) ** 1.1
        hl[bot + 2:bot + 8] *= fade_b[bot + 2:bot + 8]
        lines = np.clip(body + hl, 0, 1)
        if flip:
            lines, thin = lines[:, ::-1], thin[:, ::-1]
            hull_g, ticks_g = hull[:, ::-1], ticks[:, ::-1]
        else:
            hull_g, ticks_g = hull, ticks
        main, hot = (RED, RED_HOT) if side == 'R' else (CYAN, CYAN_HOT)
        core = g(lines, 0.9)
        out += main * (np.clip(g(lines, 0.6) * 1.25, 0, 1)[..., None]) + hot * (np.clip(core * 1.6 - 0.7, 0, 1)[..., None])
        out += main * (np.clip(g(thin, 0.6) * 1.5, 0, 1)[..., None] * 0.95)
        glow += main * ((g(lines, 4) * 1.1 + g(lines, 13) * 0.75 + g(lines, 34) * 0.38)[..., None])
        glow += main * (g(thin, 4) [..., None] * 0.6)
        # chiazza di luce appena sotto la linea di base, vicino al chevron
        xc = (xb0 + 110) if side == 'L' else (W - 1 - (xb0 + 110))
        pool = np.exp(-(((xx - xc) / 150.0) ** 2 + ((yy - (bot + 16)) / 14.0) ** 2))
        glow += (BLUE if side == 'L' else RED) * (pool[..., None] * 0.9)
        hull_final |= hull_g; ticks_final |= ticks_g
        lab, n = ndi.label(ticks)
        sizes = ndi.sum(ticks, lab, range(1, n + 1))
        majors = sorted(int(np.mean(np.where(lab == i)[0])) for i in range(1, n + 1) if sizes[i - 1] >= 200)
        for i in range(1, n + 1):
            if sizes[i - 1] >= 60:
                m = (lab == i)
                m_g = m[:, ::-1] if flip else m
                tick_col[m_g] = (RED_HOT if side == 'R' else CYAN_HOT)
        jobs.append((side, majors[::-1], top, bot, minx))

    # --- emblema centrale: il logo fornito dall'utente (sfondo nero -> si somma alla luce), con bordi sfumati
    em = np.zeros((H, W, 3))
    if LOGO:
        lg = Image.open(LOGO).convert('RGB')
        crop = lg.crop((120, 230, 1120, 780))                       # barre + lettera, senza le scie più lontane
        tw = 380; th = int(crop.height * tw / crop.width * STRETCH)   # pre-allungato: la finestra comprime in verticale
        crop = crop.resize((tw, th), Image.LANCZOS)
        a = np.asarray(crop, float) / 255.0
        yy2, xx2 = np.mgrid[0:th, 0:tw]
        mask = np.clip(1.25 - (((xx2 - tw / 2) / (tw / 2)) ** 2 + ((yy2 - th / 2) / (th / 2)) ** 2) ** 1.5, 0, 1)[..., None]
        x0, y0 = 960 - tw // 2, 168 - th // 2                         # sopra la riga dei numeri, tra i due indicatori
        em[y0:y0 + th, x0:x0 + tw] = a * mask
    out += em

    comp = out + np.clip(glow, 0, 1.6)
    comp = 1 - np.exp(-comp * 1.75)           # compressione morbida: niente bianco "bruciato"
    img = Image.fromarray((np.clip(comp, 0, 1) * 255).astype('uint8'))
    dr = ImageDraw.Draw(img); f = ImageFont.truetype(FONT, 30)
    for side, majors, top, bot, minx in jobs:
        labs, topv = (labels_left, top_left) if side == 'L' else (labels_right, top_right)
        vals = labs if side == 'L' else labs
        # i maggiori sono già ordinati dal basso verso l'alto; per il destro i valori 1..7 hanno una tacca maggiore ciascuno
        seq = [('0', bot - 4)] + [(str(v), y) for v, y in zip(vals, majors)] + [(str(topv), top + 8)]
        for txt, y in seq:
            hotv = side == 'R' and txt in ('7', '8')
            col = (255, 80, 96, 240) if hotv else ((250, 252, 255, 235) if side == 'R' else (236, 252, 255, 235))
            yc = min(max(y, top), bot)
            tw = int(dr.textlength(txt, font=f)) + 4
            tmp = Image.new('RGBA', (tw, 44), (0, 0, 0, 0)); ImageDraw.Draw(tmp).text((2, 2), txt, font=f, fill=col)
            tmp = tmp.resize((tw, int(44 * STRETCH)), Image.LANCZOS)   # compensa lo schiacciamento verticale della finestra (620/720)
            if side == 'L':
                x0 = int(minx[yc]) - 34 - tw
            else:
                x0 = W - 1 - int(minx[yc]) + 34   # il bordo esterno del destro è a destra: indice specchiato
            img.paste(tmp, (x0, int(y - 22 * STRETCH)), tmp)
    rgb = np.asarray(img).astype(np.uint8).copy()

    rgba = np.dstack([rgb, np.full((H, W), 255, np.uint8)])
    rgba[..., 3] = np.where(hull_final, alpha, 255)
    rgba[hull_final & (alpha < 235), :3] = 0
    tk = ticks_final & (alpha >= 235)
    rgba[tk, :3] = np.clip(tick_col[tk] * 255, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(os.path.join(DST, f'dash_bg_{variant}.png'), optimize=True)


def fills():
    def grad(stops):
        t = np.linspace(0, 1, 720); a = np.zeros((720, 810, 4), np.uint8)
        pos = np.array([s[0] for s in stops], float); cols = np.array([s[1] for s in stops], float)
        for c in range(3): a[:, :, c] = np.interp(t, pos, cols[:, c])[:, None]
        a[..., 3] = 255
        return Image.fromarray(a, 'RGBA')
    blue = grad([(0, (190, 250, 255)), (0.025, (61, 228, 255)), (0.16, (31, 120, 255)), (0.5, (22, 52, 232)), (1, (8, 18, 110))])
    red = grad([(0, (255, 215, 220)), (0.025, (255, 70, 86)), (0.16, (232, 32, 56)), (0.5, (150, 14, 40)), (1, (58, 5, 18))])
    blue.save(os.path.join(DST, 'press_bg_yellow.png'), optimize=True)   # stesso nome dell'originale: funziona anche senza toccare i layout
    blue.save(os.path.join(DST, 'press_bg_blue.png'), optimize=True)
    red.save(os.path.join(DST, 'press_bg_red.png'), optimize=True)


build('english', [25, 50, 75, 100, 125, 150], 160, [1, 2, 3, 4, 5, 6, 7], 8)
build('china', [50, 100, 150, 200, 250, 300], 330, [1, 2, 3, 4, 5, 6, 7], 8)
fills()
print('ok', sorted(os.listdir(DST)))
