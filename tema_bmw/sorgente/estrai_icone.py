"""Estrae dal pacchetto lucide-static (licenza ISC) solo le icone usate dal tema.
Uso: python3 -I estrai_icone.py <cartella lucide-static/package>   -> icone_lucide.js + LICENZA_lucide.txt"""
import sys, os, re, json
PKG = sys.argv[1]; HERE = os.path.dirname(os.path.abspath(__file__))
NOMI = ['music', 'phone', 'clapperboard', 'settings', 'bluetooth', 'monitor-smartphone', 'navigation', 'cast', 'link-2', 'cctv', 'car-front',
        'gauge', 'image', 'sliders-vertical', 'audio-lines', 'grid-3x3', 'contact-round', 'history', 'download', 'fuel', 'circle-parking',
        'repeat', 'shuffle', 'list-music', 'skip-back', 'skip-forward', 'play', 'pause', 'sun', 'volume-2', 'globe', 'clock', 'camera', 'info',
        'wrench', 'house', 'undo-2', 'usb', 'disc-3', 'phone-off', 'phone-incoming', 'phone-outgoing', 'phone-missed', 'user-round', 'smartphone',
        'circle-dot', 'mic', 'list', 'radio', 'thermometer', 'user-check', 'square-play', 'wifi', 'car']
out = {}
for n in NOMI:
    s = open(os.path.join(PKG, 'icons', n + '.svg'), encoding='utf-8').read()
    body = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    body = re.sub(r'\s+', ' ', body).strip()
    assert '<script' not in body.lower() and 'on' not in re.findall(r'\s(on\w+)=', body)
    out[n] = body
ver = json.load(open(os.path.join(PKG, 'package.json')))['version']
with open(os.path.join(HERE, 'icone_lucide.js'), 'w', encoding='utf-8') as f:
    f.write(f'// Icone Lucide v{ver} (licenza ISC, vedi LICENZA_lucide.txt). Solo il sottoinsieme usato dal tema.\n')
    f.write('window.LUCIDE=' + json.dumps(out, ensure_ascii=False) + ';\n')
open(os.path.join(HERE, 'LICENZA_lucide.txt'), 'w', encoding='utf-8').write(open(os.path.join(PKG, 'LICENSE'), encoding='utf-8').read())
print(len(out), 'icone')
