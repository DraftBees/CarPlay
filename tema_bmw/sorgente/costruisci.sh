#!/bin/bash
# Ricostruisce tutto il tema dal backup.  Uso: bash costruisci.sh <cartella backup_...>   (quella che contiene res/ e data/)
# Richiede: node + playwright, python3 con pillow/numpy/scipy.
set -e
BK="$1"; [ -d "$BK/res/ui" ] || { echo "Uso: bash costruisci.sh <backup_.../>"; exit 1; }
HERE="$(cd "$(dirname "$0")" && pwd)"; cd "$HERE"
RAW="$(mktemp -d)"
python3 -I prepara_logo.py
[ -n "$LUCIDE" ] && python3 -I estrai_icone.py "$LUCIDE"   # opzionale: cartella lucide-static/package
node build.js "$RAW"                                   # icone, card, pulsanti, sfondi (PNG alle misure originali)
python3 -I porte.py auto/auto_top.webp "$RAW"                  # portiere, cofano, portellone e auto dall'alto dalla TUA immagine
python3 -I ricolora.py "$BK/res/ui" "$RAW" ../../layout                # immagini originali rimaste: portate ai colori del tema
python3 -I dash_da_immagine.py dash/cluster.webp "$RAW/dash"   # cruscotto: la TUA immagine, con finestre per le barre dinamiche
python3 -I dash_fill.py "$RAW/dash"                    # riempimenti delle barre
python3 -I ottimizza.py "$RAW" ../res/ui "$BK/res/ui"  # palette + dimensioni, controlla le misure
python3 -I font_merge.py "$BK/res/ui/font.ttf" /usr/share/fonts/opentype/inter/InterDisplay-Regular.otf ../res/ui/font.ttf
python3 -I layout_mod.py "$BK/res/ui/dash.ftu"         # layout del cruscotto (.ftu)
python3 -I pacchetto.py "$BK/res"                      # testi, installa.sh, ripristina.sh, dati del simulatore
