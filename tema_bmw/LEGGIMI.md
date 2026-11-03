# Tema BMW per il display (Serie 1 Estoril Blue)

Tema grafico completo, ispirato ai colori BMW (nero notte, blu BMW, tricolore azzurro / blu scuro / rosso),
alle **stesse dimensioni** degli originali. Non contiene loghi o marchi: se vuoi aggiungerli, mandami le immagini.

## La tua auto nel tema
- Il blu degli accenti è campionato dalla vernice della tua auto (circa `#3d6ed1`, luci `#5a95f6`).
- **Card "Info veicolo"** con la tua foto, **copertina musica** (display e Bluetooth) con il frontale dell'auto,
  e lo **sfondo 6 "La mia Serie 1"**: foto sfumata con l'auto nitida a destra.
- La foto sta in `sorgente/foto/auto.jpg`; per cambiarla sostituiscila e rilancia `foto_auto.py`, `build.js`, `ottimizza.py`, `pacchetto.py`.

## Cosa cambia
- **157 immagini**: card della home, barra laterale e scorciatoie, barra di stato, 6 sfondi + miniature,
  cruscotto (versione km/h 0–160 e 0–330, quadranti nella stessa posizione dell'originale, zona rossa 6.500 giri),
  impostazioni (icone, pulsanti, interruttori, cursori, popup), telefono, musica, video.
- **129 testi italiani** riscritti (es. "Impstz." → "Impostazioni", "Veicolo Originale" → "Info veicolo",
  "disgiunzioni" → "Disconnetti", "night" → "Notte", istruzioni CarPlay/Android Auto in italiano corretto).
- **Peso**: 3,0 MB contro 4,5 MB degli originali sostituiti (−42%), meno spazio sulla flash SPI.

Layout, animazioni e velocità dell'interfaccia stanno nei file `.ftu` cifrati e non cambiano.

## Installazione (Mac)
1. Metti la cartella `platform-tools` (con `adb`) dentro questa cartella, o abbi `adb` nel PATH.
2. Collega il Mac alla WiFi `lylink_DBF07ACC`.
3. Nel Terminale, da questa cartella:
   ```bash
   bash installa.sh
   ```
   Lo script copia prima dal display **ogni** file che sostituirà (in `backup_prima_<data>/`) e si ferma
   se anche un solo backup fallisce. Poi invia i file e chiede se riavviare.

## Tornare all'originale
```bash
bash ripristina.sh backup_prima_<data>
```
Oppure, dal display: Sistema → Fabbrica (ripristino di emergenza).

## Rigenerare il tema
In `sorgente/`: `tema.js` (disegni), `testi_it.json` (testi), `build.js` → `ottimizza.py` → `pacchetto.py`.
