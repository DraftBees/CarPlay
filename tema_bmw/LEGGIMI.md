# Tema "Cluster" per il display (Serie 1 Estoril Blue)

Ridisegnato interamente nello stile del cluster digitale di riferimento: **nero puro**, linee al **neon sottili**,
**ciano a sinistra / rosso a destra**, cornici a chevron e angoli tagliati. Le superfici restano nere; gli stati attivi
si accendono (contorno e alone). Tricolore azzurro / blu / rosso come unica firma. **Nessun logo o marchio**: se vuoi aggiungerne uno, mandami tu l'immagine.

## Cosa contiene
- **164 immagini** alle misure esatte degli originali (controllate dal backup): card della home con chevron e icone a linea,
  barre, pulsanti, interruttori, cursori, popup, telefono, musica, video, 6 sfondi + miniature.
- **Cruscotto** (vedi sotto), con icone di carburante, cintura e parcheggio ridisegnate.
- **La tua auto**: card "Info veicolo" con la tua foto, copertine musica, sfondo 6 "La mia Serie 1".
- **130 testi italiani** riscritti e verificati contro le caselle vere (nessun testo tagliato).
- **1 layout** (`dash.ftu`): solo colori dei numeri, barra giri rossa e testata trasparente.

## Il cruscotto: come funziona davvero (importante)
Sul display le due barre di velocità e giri **non sono disegnate sopra lo sfondo**: sono due immagini (`press_bg_*.png`) che salgono
**dietro** lo sfondo `dash_bg_*.png` e si vedono solo dalle **finestre trasparenti** del PNG. Per questo `dash_bg.py` lascia le finestre
identiche all'originale (stessa forma, stessa posizione) e ridisegna tutto intorno. La finestra del layout è 1920×620, quindi il PNG viene
compresso in verticale: i numeri della scala sono pre-allungati per compensare.
- `press_bg_yellow.png` (stesso nome dell'originale) è ora un gradiente **blu**: funziona anche senza toccare i layout.
- `press_bg_red.png` è usato dalla barra giri **solo** se installi anche `dash.ftu`; senza, la barra giri resta blu.

## Installazione (Mac)
1. Metti la cartella `platform-tools` (con `adb`) dentro questa cartella, o abbi `adb` nel PATH.
2. Collega il Mac alla WiFi `lylink_DBF07ACC`.
3. Da questa cartella:
   ```bash
   bash installa.sh --solo-immagini
   ```
   Installa testi e immagini, **senza** layout (.ftu): è l'opzione a rischio minore. La barra giri resta blu.
   ```bash
   bash installa.sh
   ```
   Installa anche `dash.ftu` (barra giri rossa, numeri colorati). Chiede conferma scrivendo "si".

Lo script copia prima dal display **ogni** file che sostituirà in `backup_prima_<data>/` e si ferma se un backup fallisce.

## Tornare all'originale
```bash
bash ripristina.sh backup_prima_<data>
```
oppure dal display: Sistema → Fabbrica. Non so ancora se `adb` resta raggiungibile se il display non parte: per questo il primo passo
consigliato è `--solo-immagini`, con l'auto ferma e la retrocamera controllata subito dopo.

## Rigenerare il tema
```bash
bash sorgente/costruisci.sh <cartella backup_...>
```
Sorgenti: `tema.js` (disegni), `dash_bg.py` (cruscotto), `layout_mod.py` (layout), `testi_it.json`, `foto/auto.jpg`.
