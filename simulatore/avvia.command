#!/bin/bash
# Doppio clic su Mac: avvia il simulatore con un piccolo server locale e lo apre nel browser.
# (Aprendo index.html direttamente funziona quasi tutto; il server serve solo per il ritocco colore delle immagini originali.)
cd "$(dirname "$0")"
PORT=8765
if command -v python3 >/dev/null 2>&1; then
  (sleep 1; open "http://localhost:$PORT/index.html") &
  python3 -m http.server $PORT
elif command -v ruby >/dev/null 2>&1; then
  (sleep 1; open "http://localhost:$PORT/index.html") &
  ruby -run -e httpd . -p $PORT
else
  echo "Né python3 né ruby trovati: apro index.html direttamente."
  open index.html
fi
