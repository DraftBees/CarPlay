"""Logo fornito dall'utente (sfondo nero) -> logo/logo_data.js con window.LOGO_DATA (data URL PNG).
Uso: python3 -I prepara_logo.py"""
import base64, io, os
from PIL import Image
here = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(here, 'logo', 'logo_m.webp')).convert('RGB')
b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
open(os.path.join(here, 'logo', 'logo_data.js'), 'w').write(f'window.LOGO_DATA="data:image/png;base64,{base64.b64encode(b.getvalue()).decode()}";window.LOGO_SIZE=[{im.width},{im.height}];\n')
print('logo', im.size, len(b.getvalue()) // 1024, 'KB')
