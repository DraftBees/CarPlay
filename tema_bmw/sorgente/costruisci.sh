#!/bin/bash
# Ricostruisce tutto il tema dal backup.  Uso: bash costruisci.sh <cartella backup_...>   (quella che contiene res/ e data/)
# Richiede: node + playwright, python3 con pillow/numpy/scipy.
set -e
BK="$1"; [ -d "$BK/res/ui" ] || { echo "Uso: bash costruisci.sh <backup_.../>"; exit 1; }
HERE="$(cd "$(dirname "$0")" && pwd)"; cd "$HERE"
RAW="$(mktemp -d)"
python3 -I foto_auto.py
node build.js "$RAW"                                   # icone, card, pulsanti, sfondi (PNG alle misure originali)
python3 -I dash_bg.py "$BK/res/ui/dash" "$RAW/dash"    # cruscotto: finestre trasparenti identiche all'originale
python3 -I ottimizza.py "$RAW" ../res/ui "$BK/res/ui"  # palette + dimensioni, controlla le misure
python3 -I layout_mod.py "$BK/res/ui/dash.ftu"         # layout del cruscotto (.ftu)
python3 -I pacchetto.py "$BK/res"                      # testi, installa.sh, ripristina.sh, dati del simulatore
