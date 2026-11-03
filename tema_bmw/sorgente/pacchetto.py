"""Crea il pacchetto installabile del tema e i dati per il simulatore.
Uso: python3 -I pacchetto.py <backup/res>   (es. .../backup_20261103_214808/res)
Scrive: tema_bmw/res/tr/<file italiano>, tema_bmw/installa.sh, tema_bmw/ripristina.sh, simulatore/data/tema.js"""
import sys, os, json, glob, base64, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
TEMA = os.path.dirname(HERE)
SIM = os.path.join(os.path.dirname(TEMA), 'simulatore')
ORIG_RES = sys.argv[1]
ORIG_ROOT = os.path.dirname(ORIG_RES)
IT = 'yi_IT-意大利语.json'

# --- testi: stesso formato del file originale (tab, "k":"v", nessun a-capo finale)
orig = json.load(open(os.path.join(ORIG_RES, 'tr', IT), encoding='utf-8'))
nuovi = json.load(open(os.path.join(HERE, 'testi_it.json'), encoding='utf-8'))
ignote = [k for k in nuovi if k not in orig]
assert not ignote, f'chiavi inesistenti: {ignote}'
cambiati = {k: v for k, v in nuovi.items() if orig[k] != v}
merged = {k: cambiati.get(k, v) for k, v in orig.items()}
os.makedirs(os.path.join(TEMA, 'res', 'tr'), exist_ok=True)
with open(os.path.join(TEMA, 'res', 'tr', IT), 'w', encoding='utf-8') as f:
    f.write('{\n' + ',\n'.join(f'\t{json.dumps(k, ensure_ascii=False)}:{json.dumps(v, ensure_ascii=False)}' for k, v in merged.items()) + '\n}')

# --- elenco file: immagini, layout (.ftu), testi
RES_UI = os.path.join(TEMA, 'res', 'ui')
imgs = sorted(os.path.relpath(p, RES_UI) for p in glob.glob(os.path.join(RES_UI, '**', '*.png'), recursive=True))
ftus = sorted(os.path.relpath(p, RES_UI) for p in glob.glob(os.path.join(RES_UI, '*.ftu')))
if os.path.exists(os.path.join(RES_UI, 'font.ttf')): ftus.append('font.ttf')   # font: file di sistema, solo nell'installazione completa
img_files = [f'res/ui/{p}' for p in imgs]
ftu_files = [f'res/ui/{p}' for p in ftus]
txt_files = [f'res/tr/{IT}']
allf = txt_files + img_files + ftu_files
esistenti = [f for f in allf if os.path.exists(os.path.join(ORIG_ROOT, f))]
nuovi_f = [f for f in allf if f not in esistenti]
print('nuovi sul display (senza backup):', nuovi_f)

q = lambda s: '"' + s.replace('\\', '\\\\').replace('"', '\\"').replace('$', '\\$').replace('`', '\\`') + '"'
dirs = sorted({os.path.dirname(f) for f in esistenti})
pull = lambda f: f'"$ADB" -s $IP pull {q("/" + f)} "$BK/{f}" >/dev/null || {{ echo "Backup fallito: /{f}. Interrompo senza toccare nulla."; exit 1; }}'
def push(f):
    src = '"$FONT_SRC"' if f == 'res/ui/font.ttf' else q(f)   # il font personale (non versionato) ha la precedenza
    return f'"$ADB" -s $IP push {src} {q("/" + f)} >/dev/null || {{ echo "Invio fallito: /{f}"; ERR=1; }}'

inst = f'''#!/bin/bash
# Installa il tema sul display: {len(txt_files)} file di testi + {len(img_files)} immagini + {len(ftu_files)} file di sistema (layout .ftu e font).
#   bash installa.sh                    tema completo (con layout del cruscotto e font)
#   bash installa.sh --solo-immagini    solo testi e immagini, niente layout né font: il rischio minore
# 1) Collega il Mac alla WiFi lylink_DBF07ACC   2) lancia lo script
# Prima di sovrascrivere ogni file esistente viene copiato dal display in backup_prima_<data>/ (serve a ripristina.sh).
cd "$(dirname "$0")"
FONT_SRC="res/ui/font.ttf"; [ -f personale/font.ttf ] && FONT_SRC="personale/font.ttf"   # font personale, se presente
SOLO_IMG=0; [ "$1" = "--solo-immagini" ] && SOLO_IMG=1
ADB="./platform-tools/adb"; [ -x "$ADB" ] || ADB="$(command -v adb)"
[ -n "$ADB" ] || {{ echo "adb non trovato: copia la cartella platform-tools qui accanto"; exit 1; }}
IP=192.168.43.1:5555
STAMP=$(date +%Y%m%d_%H%M%S)
BK="backup_prima_$STAMP"
exec > >(tee "installa_log_$STAMP.txt") 2>&1
"$ADB" kill-server >/dev/null 2>&1
"$ADB" disconnect $IP >/dev/null 2>&1
"$ADB" connect $IP
"$ADB" -s $IP wait-for-device || {{ echo "Display non raggiungibile"; exit 1; }}

if [ $SOLO_IMG = 0 ]; then
  echo "Questo installa anche {len(ftu_files)} file di sistema (layout del cruscotto e font). Se il display non dovesse partire:"
  echo "  bash ripristina.sh $BK   (se adb resta raggiungibile) oppure dal menu Sistema -> di Fabbrica."
  read -r -p "Digita si per continuare, qualsiasi altro tasto per annullare: " OK
  [ "$OK" = "si" ] || {{ echo "Annullato. Puoi usare:  bash installa.sh --solo-immagini"; exit 0; }}
fi

echo "=== 1. backup degli originali in $BK ==="
''' + '\n'.join(f'mkdir -p "$BK/{d}"' for d in dirs) + '\n' + '\n'.join(pull(f) for f in esistenti if f not in ftu_files) + '''
if [ $SOLO_IMG = 0 ]; then
''' + '\n'.join('  ' + pull(f) for f in ftu_files if f in esistenti) + '''
fi
echo "Backup completato."

echo "=== 2. invio: testi e immagini ==="
ERR=0
''' + '\n'.join(push(f) for f in txt_files + img_files) + '''
if [ $SOLO_IMG = 0 ]; then
  echo "=== 3. invio: layout e font ==="
''' + '\n'.join('  ' + push(f) for f in ftu_files) + '''
fi
"$ADB" -s $IP shell sync >/dev/null 2>&1 || true
if [ $ERR = 1 ]; then echo "Qualcosa non è andato: rimetti gli originali con  bash ripristina.sh $BK"; exit 1; fi
echo "Fatto. Backup in: $BK"
read -r -p "Riavviare ora il display? [s/N] " R
[ "$R" = "s" ] || [ "$R" = "S" ] && "$ADB" -s $IP reboot
exit 0
'''
rest = '''#!/bin/bash
# Rimette sul display i file originali salvati da installa.sh.
# Uso: bash ripristina.sh backup_prima_AAAAMMGG_HHMMSS
cd "$(dirname "$0")"
BK="$1"; [ -d "$BK" ] || { echo "Indica la cartella di backup, es: bash ripristina.sh backup_prima_20261103_220000"; exit 1; }
ADB="./platform-tools/adb"; [ -x "$ADB" ] || ADB="$(command -v adb)"
IP=192.168.43.1:5555
"$ADB" connect $IP; "$ADB" -s $IP wait-for-device
# prima i layout (.ftu), poi immagini e testi
''' + '\n'.join(f'[ -f "$BK/{f}" ] && "$ADB" -s $IP push "$BK/{f}" {q("/" + f)} >/dev/null' for f in ftu_files + [x for x in esistenti if x not in ftu_files]) + '''
"$ADB" -s $IP shell sync >/dev/null 2>&1 || true
echo "Originali ripristinati. Riavvio il display."
"$ADB" -s $IP reboot
'''
for name, txt in [('installa.sh', inst), ('ripristina.sh', rest)]:
    p = os.path.join(TEMA, name); open(p, 'w', encoding='utf-8').write(txt); os.chmod(p, 0o755)

# --- dati per il simulatore: immagini in data URL (funziona anche aprendo index.html come file)
data = {p: 'data:image/png;base64,' + base64.b64encode(open(os.path.join(RES_UI, p), 'rb').read()).decode() for p in imgs}
layouts = {}
for p in glob.glob(os.path.join(TEMA, 'layout_mod', '*.json')):
    layouts[os.path.basename(p)[:-5]] = json.load(open(p, encoding='utf-8'))
with open(os.path.join(SIM, 'data', 'tema.js'), 'w', encoding='utf-8') as f:
    f.write('// Generato da tema_bmw/sorgente/pacchetto.py: tema (immagini + testi italiani + layout modificati)\n')
    f.write('window.THEME=' + json.dumps({'name': 'Cluster', 'images': data, 'strings': {'yi_IT': cambiati}, 'layouts': layouts}, ensure_ascii=False, separators=(',', ':')) + ';\n')
tot = sum(os.path.getsize(os.path.join(RES_UI, p)) for p in imgs)
print(f'{len(imgs)} immagini ({tot // 1024} KB), {len(ftus)} layout, {len(cambiati)} testi cambiati, tema.js {os.path.getsize(os.path.join(SIM, "data", "tema.js")) // 1024} KB')

# font personale (non versionato) per l'anteprima del simulatore
if os.path.exists(os.path.join(TEMA, 'personale', 'font.ttf')):
    os.makedirs(os.path.join(SIM, 'tema'), exist_ok=True); shutil.copy2(os.path.join(TEMA, 'personale', 'font.ttf'), os.path.join(SIM, 'tema', 'font_personale.ttf'))
# font per l'anteprima del simulatore
import shutil
if os.path.exists(os.path.join(RES_UI, 'font.ttf')):
    os.makedirs(os.path.join(SIM, 'tema'), exist_ok=True); shutil.copy2(os.path.join(RES_UI, 'font.ttf'), os.path.join(SIM, 'tema', 'font.ttf'))
