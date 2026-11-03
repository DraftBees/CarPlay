# Tema BMW per il display

Tema grafico completo, ispirato ai colori BMW (nero notte, blu BMW, tricolore azzurro / blu scuro / rosso),
alle **stesse dimensioni** degli originali. Non contiene loghi o marchi: se vuoi aggiungerli, mandami le immagini.

## Cosa cambia
- **157 immagini**: card della home, barra laterale e scorciatoie, barra di stato, 6 sfondi + miniature,
  cruscotto (versione km/h 0–160 e 0–330, quadranti nella stessa posizione dell'originale, zona rossa 6.500 giri),
  impostazioni (icone, pulsanti, interruttori, cursori, popup), telefono, musica, video.
- **129 testi italiani** riscritti (es. "Impstz." → "Impostazioni", "Veicolo Originale" → "Info veicolo",
  "disgiunzioni" → "Disconnetti", "night" → "Notte", istruzioni CarPlay/Android Auto in italiano corretto).
- **Peso**: 2,6 MB contro 4,5 MB degli originali sostituiti (−42%), meno spazio sulla flash SPI.

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
