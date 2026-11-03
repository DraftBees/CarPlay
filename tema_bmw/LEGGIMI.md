# Tema "M Cluster" per il display (Serie 1)

Superfici nere e silenziose, la luce fa la gerarchia. Ciano a sinistra / rosso a destra come nel cluster digitale M,
tricolore come firma minima, il tuo **logo M** per avvio, cruscotto, copertine e uno sfondo. Nessuna foto.

## Cosa contiene
| | |
|---|---|
| **262 immagini** | alle misure esatte degli originali, palette a 256 colori con libimagequant (niente aloni a gradini) |
| **Card della home** | superficie nera con filo di luce, icona Lucide a tratto sottile, tricolore in basso; stato premuto in ciano |
| **Cruscotto** | chevron al neon, barre che salgono dietro le finestre trasparenti (come sul display vero), logo M al centro |
| **Icone** | set Lucide (licenza ISC, vedi `sorgente/LICENZA_lucide.txt`): coerenti, stesso tratto ovunque |
| **91 immagini secondarie** | portate ai colori del tema in automatico (`ricolora.py`): gialli → ciano, blu → ciano/blu, pannelli → nero; radar, linee guida e auto restano originali |
| **Font** | `font.ttf`: caratteri latini sostituiti con Inter Display (SIL OFL); cinese, giapponese, coreano, arabo restano gli originali |
| **Testi** | 130 testi italiani riscritti e verificati contro le caselle vere |
| **Layout** | `dash.ftu`: colori dei numeri, barra giri rossa, testata trasparente |
| **Avvio** | `avvio/avvio_1920x720.mp4` e `avvio/logo_avvio_1920x720.png/.bmp` (vedi sotto) |

## Installazione (Mac)
1. Metti la cartella `platform-tools` (con `adb`) dentro questa cartella, o abbi `adb` nel PATH.
2. Collega il Mac alla WiFi `lylink_DBF07ACC`.
3. Da questa cartella:
   ```bash
   bash installa.sh --solo-immagini
   ```
   Installa testi e immagini: è l'opzione a rischio minore (la barra giri resta blu, font invariato).
   ```bash
   bash installa.sh
   ```
   Installa anche i **file di sistema**: `dash.ftu` e `font.ttf`. Chiede conferma scrivendo "si".

Lo script copia prima dal display **ogni** file che sostituirà in `backup_prima_<data>/` e si ferma se un backup fallisce.
Per tornare indietro: `bash ripristina.sh backup_prima_<data>`, oppure dal display Sistema → Fabbrica.

## Video di avvio: stato
Il video è pronto (1920×720, H.264, 5 s, con audio). **Non viene installato dagli script**: il display non ha
ancora un modo noto per riprodurre un video all'accensione. Il logo di avvio di fabbrica è un'immagine fissa in una zona
separata della memoria. Per sapere se e come sostituirlo, o se si può far partire il video prima dell'interfaccia,
serve l'output di `../strumenti/adb_recon_avvio.sh` (sola lettura). Nel simulatore il video parte a ogni accensione.

## Il cruscotto: come funziona davvero
Le barre di velocità e giri sono immagini (`press_bg_*.png`) che salgono **dietro** lo sfondo `dash_bg_*.png` e si vedono solo dalle
**finestre trasparenti** del PNG. `dash_bg.py` lascia le finestre identiche all'originale e ridisegna tutto intorno.

## Rigenerare il tema
```bash
LUCIDE=<cartella lucide-static/package> bash sorgente/costruisci.sh <cartella backup_...>
```
```bash
bash sorgente/prepara_avvio.sh sorgente/video/avvio_originale.mp4
```
