"""Prepara la foto dell'auto per tema.js: la incorpora come data URL (window.CAR_PHOTO).
Uso: python3 -I foto_auto.py   (legge foto/auto.jpg, scrive foto/auto_foto.js)"""
import base64, io, os
from PIL import Image, ImageEnhance
here = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(here, 'foto', 'auto.jpg')).convert('RGB')
im = ImageEnhance.Contrast(im).enhance(1.08)   # appena più contrasto per reggere sul fondo scuro
b = io.BytesIO(); im.save(b, 'JPEG', quality=90)
open(os.path.join(here, 'foto', 'auto_foto.js'), 'w').write(
    f'window.CAR_PHOTO="data:image/jpeg;base64,{base64.b64encode(b.getvalue()).decode()}";window.CAR_SIZE=[{im.width},{im.height}];\n')
print('foto', im.size, len(b.getvalue()) // 1024, 'KB')
