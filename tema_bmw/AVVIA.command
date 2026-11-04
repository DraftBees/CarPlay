#!/bin/bash
# Doppio clic su Mac: percorso guidato, un passo alla volta. Ogni passo chiede conferma.
cd "$(dirname "$0")"
echo "=== TEMA M CLUSTER — percorso guidato ==="
echo "Prima: auto ferma, display acceso, Mac collegato alla WiFi  lylink_DBF07ACC"
[ -x ./platform-tools/adb ] || command -v adb >/dev/null || { echo "Manca adb: metti la cartella platform-tools (di Google) qui accanto e riprova."; read -r -p "Invio per uscire"; exit 1; }
read -r -p "PASSO 1 (sola lettura): leggo come parte il display. Invio per continuare... " _
bash leggi_display.sh && echo "Fatto: manda il file adb_out_avvio.txt (in questa cartella) a Claude."
read -r -p "PASSO 2: installo testi e immagini (con backup di tutto). Digita s per continuare: " R
if [ "$R" = "s" ] || [ "$R" = "S" ]; then
  printf 'n\n' | bash installa.sh --solo-immagini
  echo; echo "Riavvia il display, poi controlla: retrocamera, audio, home, cruscotto, portiere."
  read -r -p "Se TUTTO funziona digita s per il PASSO 3 (layout cruscotto + font), altro per fermarti: " R3
  if [ "$R3" = "s" ] || [ "$R3" = "S" ]; then bash installa.sh; fi
fi
echo; echo "Per tornare agli originali:  bash ripristina.sh"
read -r -p "Invio per chiudere"
