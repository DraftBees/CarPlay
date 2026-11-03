"""Prepara i dati dei layout reali per il simulatore.
Uso: python3 -I prepara_simulatore.py <backup/res/ui>
 - legge i layout 1920x720 decodificati in layout/*.json (vedi ftu.py)
 - scrive simulatore/data/layouts.js (layout compatti + dimensioni immagini)
 - copia dal backup le immagini referenziate dai layout che mancano ancora nel simulatore"""
import sys, os, json, glob, shutil, re
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1]
SIM = os.path.join(ROOT, 'simulatore')

NOMI = {
    'main_1920_720_1': 'Home (versione con card BMW)', 'main_1920_720_2': 'Home (variante 2)', 'main_1920_720_3': 'Home (variante 3)',
    'main': 'Home (versione base)', 'dash': 'Cruscotto', 'car': 'Veicolo originale', 'doorDisplay': 'Porte aperte', 'airControl': 'Aria condizionata',
    'backcarwindow': 'Retrocamera', 'bg': 'Scelta sfondo', 'eq': 'Equalizzatore', 'settings': 'Impostazioni', 'factory': 'Menu di fabbrica',
    'btMusic': 'Musica Bluetooth', 'btOutgoing': 'Chiamata in uscita', 'calling': 'In chiamata', 'btsetting': 'Impostazioni Bluetooth',
    'btTransmitWindow': 'Trasmissione Bluetooth', 'music': 'Musica', 'video': 'Video', 'lylinkview': 'Proiezione CarPlay / Android Auto',
    'linkhelp': 'Aiuto collegamento', 'linkDisplayAdjust': 'Regolazione area CarPlay', 'navibar': 'Barra di navigazione',
}
names = [n for n in NOMI if os.path.exists(os.path.join(ROOT, 'layout', n + '.json'))]
layouts = {n: json.load(open(os.path.join(ROOT, 'layout', n + '.json'), encoding='utf-8')) for n in names}
for n, d in layouts.items():
    r = d.get('resolution', {})
    assert (r.get('width'), r.get('height')) in ((1920, 720), (1920, 100)), (n, r)

# immagini referenziate (percorsi con o senza "/" iniziale)
refs = set()
def walk(o):
    if isinstance(o, dict):
        for v in o.values(): walk(v)
    elif isinstance(o, list):
        for v in o: walk(v)
    elif isinstance(o, str) and re.search(r'\.(png|jpg|bmp)$', o, re.I):
        refs.add(o.lstrip('/'))
walk(list(layouts.values()))

sizes, copied, missing = {}, 0, []
for rel in sorted(refs):
    s = os.path.join(SRC, rel)
    if not os.path.exists(s): missing.append(rel); continue
    d = os.path.join(SIM, 'res', 'ui', rel)
    if not os.path.exists(d):
        os.makedirs(os.path.dirname(d), exist_ok=True); shutil.copy2(s, d); copied += 1
    try: sizes[rel] = Image.open(s).size
    except Exception: pass

with open(os.path.join(SIM, 'data', 'layouts.js'), 'w', encoding='utf-8') as f:
    f.write('// Generato da strumenti/prepara_simulatore.py dai layout .ftu reali (decodificati)\n')
    f.write('window.LAYOUTS=' + json.dumps(layouts, ensure_ascii=False, separators=(',', ':')) + ';\n')
    f.write('window.LAYOUT_NAMES=' + json.dumps({n: NOMI[n] for n in names}, ensure_ascii=False) + ';\n')
    f.write('window.IMAGES=Object.assign(window.IMAGES||{},' + json.dumps({k: list(v) for k, v in sizes.items()}, separators=(',', ':')) + ');\n')
print(f'{len(names)} layout, {len(refs)} immagini referenziate, {copied} copiate, mancanti: {missing}')
print('layouts.js', os.path.getsize(os.path.join(SIM, 'data', 'layouts.js')) // 1024, 'KB')
