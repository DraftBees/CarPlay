"""Applica al layout del cruscotto le modifiche del tema e ricodifica dash.ftu.
Si cambiano SOLO colori, immagini di riempimento, sfondo della testata e valori numerici ammessi:
id, caption, tipi e struttura restano identici (il programma li cerca per nome).

Uso: python3 -I layout_mod.py <backup/res/ui/dash.ftu>
Scrive: tema_bmw/layout_mod/dash.json (leggibile) e tema_bmw/res/ui/dash.ftu"""
import sys, os, json, copy
HERE = os.path.dirname(os.path.abspath(__file__)); TEMA = os.path.dirname(HERE); ROOT = os.path.dirname(TEMA)
sys.path.insert(0, os.path.join(ROOT, 'strumenti'))
import ftu

rgb = lambda h: int(h.lstrip('#'), 16)
orig_path = sys.argv[1]
d = json.load(open(os.path.join(ROOT, 'layout', 'dash.json'), encoding='utf-8'))
m = copy.deepcopy(d)

def by_caption(o, cap):
    if isinstance(o, dict):
        if o.get('caption') == cap: return o
        for v in o.values():
            r = by_caption(v, cap)
            if r: return r
    return None

m['backgroundColor'] = rgb('#020405')                                   # fondo dietro le finestre (barra a riposo)
by_caption(m, 'RotateDisplayTextView')['backgroundPic'] = '/dash/press_bg_red.png'   # barra giri rossa (la velocità resta blu)
by_caption(m, 'headWindow')['backgroundPic'] = ''                       # testata trasparente: il neon in alto resta visibile
for cap, col in [('speedTextView', '#e8fcff'), ('speedRemindTextView', '#3de4ff'), ('rotateTextView', '#ffecee'), ('rotateRemindTextView', '#ff3345'),
                 ('tempTextView', '#d7fbff'), ('consumptionTextView', '#d7fbff')]:
    by_caption(m, cap)['colorTab']['color0'] = rgb(col)

# controllo: solo i campi ammessi sono cambiati
def diff(a, b, path=''):
    out = []
    if isinstance(a, dict):
        for k in set(a) | set(b):
            if k not in a or k not in b: out.append(path + '/' + k + ' (struttura!)')
            else: out += diff(a[k], b[k], path + '/' + k)
    elif a != b: out.append((path, a, b))
    return out
ALLOWED = ('backgroundColor', 'backgroundPic', 'color0')
ch = diff(d, m)
bad = [c for c in ch if isinstance(c, str) or c[0].split('/')[-1] not in ALLOWED]
assert not bad, bad
os.makedirs(os.path.join(TEMA, 'layout_mod'), exist_ok=True); os.makedirs(os.path.join(TEMA, 'res', 'ui'), exist_ok=True)
json.dump(m, open(os.path.join(TEMA, 'layout_mod', 'dash.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)

raw0, n = ftu.parse(open(orig_path, 'rb').read())
assert json.loads(raw0.decode('utf-8')) == d, 'il layout decodificato non coincide con quello originale'
data = ftu.build(json.dumps(m, ensure_ascii=False, separators=(',', ':')).encode('utf-8'), n)
ftu.parse(data)
open(os.path.join(TEMA, 'res', 'ui', 'dash.ftu'), 'wb').write(data)
print(f'{len(ch)} campi cambiati, dash.ftu {len(data)} byte')
