"""Immagini di riempimento delle barre (gradiente verticale, bordo d'attacco luminoso in alto).
Il velo del binario (opacità 0.45) le attenua: qui sono volutamente luminose.
Uso: python3 -I dash_fill.py <uscita res/ui/dash>"""
import sys, os
import numpy as np
from PIL import Image
DST = sys.argv[1]; os.makedirs(DST, exist_ok=True)
def grad(stops):
    t = np.linspace(0, 1, 720); a = np.zeros((720, 810, 4), np.uint8)
    pos = np.array([s[0] for s in stops], float); cols = np.array([s[1] for s in stops], float)
    for c in range(3): a[:, :, c] = np.clip(np.interp(t, pos, cols[:, c]), 0, 255)[:, None]
    a[..., 3] = 255
    return Image.fromarray(a, 'RGBA')
blue = grad([(0, (235, 252, 255)), (0.02, (120, 225, 255)), (0.12, (40, 165, 255)), (0.5, (20, 95, 255)), (1, (10, 40, 190))])
red = grad([(0, (255, 235, 230)), (0.02, (255, 130, 120)), (0.12, (255, 60, 56)), (0.5, (230, 28, 40)), (1, (150, 10, 28))])
blue.save(os.path.join(DST, 'press_bg_yellow.png'), optimize=True)   # stesso nome dell'originale: funziona anche senza toccare i layout
blue.save(os.path.join(DST, 'press_bg_blue.png'), optimize=True)
red.save(os.path.join(DST, 'press_bg_red.png'), optimize=True)
print('ok')
