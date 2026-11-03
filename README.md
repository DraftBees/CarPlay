# CarPlay / DisplayAuto

- [`simulatore/`](simulatore/LEGGIMI.md): simulatore web del display (apri `index.html`), con interruttore
  Originale / Tema Cluster, editor di testi e immagini ed esportazione per `adb push`.
- [`tema_bmw/`](tema_bmw/LEGGIMI.md): tema "M Cluster" pronto da installare (`bash installa.sh --solo-immagini`), con video di avvio in `tema_bmw/avvio/`.
- `strumenti/`: `ftu.py` (decodifica/ricodifica dei layout .ftu) e script di sola lettura per il display.
- `layout/`: i 134 layout di `/res/ui/*.ftu` decodificati in JSON leggibile (solo consultazione).
