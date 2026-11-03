"""Crea il pacchetto installabile del tema e i dati per il simulatore.
Uso: python3 -I pacchetto.py <backup/res>   (es. .../backup_20261103_214808/res)
Scrive: tema_bmw/res/tr/<file italiano>, tema_bmw/installa.sh, tema_bmw/ripristina.sh,
        simulatore/data/tema.js"""
import sys, os, json, glob, base64

HERE = os.path.dirname(os.path.abspath(__file__))
TEMA = os.path.dirname(HERE)
SIM = os.path.join(os.path.dirname(TEMA), 'simulatore')
ORIG_RES = sys.argv[1]
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

# --- elenco file da installare
imgs = sorted(os.path.relpath(p, os.path.join(TEMA, 'res', 'ui')) for p in glob.glob(os.path.join(TEMA, 'res', 'ui', '**', '*.png'), recursive=True))
files = [f'res/tr/{IT}'] + [f'res/ui/{p}' for p in imgs]
for f in files:  # ogni file deve esistere anche sul display (nel backup): non creiamo file nuovi
    assert os.path.exists(os.path.join(os.path.dirname(ORIG_RES), f)), f

q = lambda s: '"' + s.replace('\\', '\\\\').replace('"', '\\"').replace('$', '\\$').replace('`', '\\`') + '"'
dirs = sorted({os.path.dirname(f) for f in files})
inst = f'''#!/bin/bash
# Installa il TEMA BMW sul display ({len(files)} file: {len(imgs)} immagini + testi italiani).
# 1) Collega il Mac alla WiFi lylink_DBF07ACC   2) bash installa.sh
# Prima di sovrascrivere, ogni file viene copiato dal display in backup_prima_<data>/ (serve a ripristina.sh).
cd "$(dirname "$0")"
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

echo "=== 1. backup degli originali in $BK ==="
''' + '\n'.join(f'mkdir -p "$BK/{d}"' for d in dirs) + '\n' + '\n'.join(
    f'"$ADB" -s $IP pull {q("/" + f)} "$BK/{f}" >/dev/null || {{ echo "Backup fallito: /{f}. Interrompo senza toccare nulla."; exit 1; }}' for f in files) + '''
echo "Backup completato."

echo "=== 2. invio dei file del tema ==="
ERR=0
''' + '\n'.join(f'"$ADB" -s $IP push {q(f)} {q("/" + f)} >/dev/null || {{ echo "Invio fallito: /{f}"; ERR=1; }}' for f in files) + '''
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
''' + '\n'.join(f'[ -f "$BK/{f}" ] && "$ADB" -s $IP push "$BK/{f}" {q("/" + f)} >/dev/null' for f in files) + '''
"$ADB" -s $IP shell sync >/dev/null 2>&1 || true
echo "Originali ripristinati. Riavvio il display."
"$ADB" -s $IP reboot
'''
for name, txt in [('installa.sh', inst), ('ripristina.sh', rest)]:
    p = os.path.join(TEMA, name); open(p, 'w', encoding='utf-8').write(txt); os.chmod(p, 0o755)

# --- dati per il simulatore: immagini in data URL (funziona anche aprendo index.html come file)
data = {p: 'data:image/png;base64,' + base64.b64encode(open(os.path.join(TEMA, 'res', 'ui', p), 'rb').read()).decode() for p in imgs}
with open(os.path.join(SIM, 'data', 'tema.js'), 'w', encoding='utf-8') as f:
    f.write('// Generato da tema_bmw/sorgente/pacchetto.py: tema BMW (immagini + testi italiani)\n')
    f.write('window.THEME=' + json.dumps({'name': 'BMW', 'images': data, 'strings': {'yi_IT': cambiati}}, ensure_ascii=False) + ';\n')
tot = sum(os.path.getsize(os.path.join(TEMA, 'res', 'ui', p)) for p in imgs)
print(f'{len(imgs)} immagini ({tot // 1024} KB), {len(cambiati)} testi cambiati, tema.js {os.path.getsize(os.path.join(SIM, "data", "tema.js")) // 1024} KB')
