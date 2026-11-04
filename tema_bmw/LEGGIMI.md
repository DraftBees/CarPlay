# Tema "M Cluster" per il display (Serie 1)

Superfici nere e silenziose, la luce fa la gerarchia. Ciano a sinistra / rosso a destra come nel cluster digitale M,
tricolore come firma minima, il tuo **logo M** per avvio, cruscotto, copertine e uno sfondo. Nessuna foto.

## Cosa contiene
| | |
|---|---|
| **262 immagini** | alle misure esatte degli originali, palette a 256 colori con libimagequant (niente aloni a gradini) |
| **Card della home** | superficie nera con filo di luce, icona Lucide a tratto sottile, tricolore in basso; stato premuto in ciano |
| **Cruscotto** | **la tua immagine** (`sorgente/dash/cluster.webp`) usata tale e quale, con i numeri veri sopra; barre dinamiche dalle sue fasce (vedi sotto) |
| **Auto e portiere** | la **tua auto vista dall'alto** (`sorgente/auto/auto_top.webp`): schermata "Info veicolo" (`car/car.png`) e le 13 immagini di cofano, 4 portiere e portellone aperti (`door/`), più il pannello di sfondo nel tema |
| **Icone** | set Lucide (licenza ISC, vedi `sorgente/LICENZA_lucide.txt`): coerenti, stesso tratto ovunque |
| **91 immagini secondarie** | portate ai colori del tema in automatico (`ricolora.py`): gialli → ciano, blu → ciano/blu, pannelli → nero; radar, linee guida e auto restano originali |
| **Font** | `font.ttf`: latini sostituiti con Inter Display (SIL OFL). **Font personale** (es. Sakana): vedi sotto; cinese, giapponese, coreano, arabo restano gli originali |
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

## Font personale (Sakana)
Il tuo `Sakana.ttf` ha nella licenza **"Personal Use Only"** (Drizy Studio): non l'ho messo nel repository né nel simulatore online.
Lo applichi tu, in locale, con una copia del file:
```bash
python3 -I sorgente/font_merge.py <backup/res/ui/font.ttf> Sakana.ttf personale/font.ttf <Inter-Display-Regular.otf>
bash sorgente/costruisci.sh <backup>      # opzionale: FONT_NUMERI=Sakana.ttf per le cifre della scala del cruscotto
```
`installa.sh` usa `personale/font.ttf` se esiste (cartella ignorata da Git). È **solo maiuscolo**: ogni testo appare in maiuscolo.
Il segno ° e i caratteri che manca vengono dal font di riserva. Con questo font ho accorciato 8 testi che non entravano nelle caselle
(Telefono→Chiama, Luminosità→Luce, Bluetooth→BT, Auto-connetti→Auto, Standard→Base, Classica→Classic, Personale→Utente).

## Il cruscotto: come funziona davvero
Lo sfondo è **la tua immagine, senza ridimensionarla**: la traslo nel quadro 1920×720 (x −40, y −124), quindi i pixel restano gli originali.
Il fondo inferiore (la riga di parallelogrammi) resta fuori schermo.
Sul display le barre di velocità e giri sono immagini (`press_bg_*.png`) che salgono **dietro** lo sfondo e si vedono solo dalle **finestre trasparenti** del PNG.
`dash_da_immagine.py` ricava le finestre dai colori della tua immagine (la banda scura lungo il telaio e la barra sfumata in alto, a sinistra e a destra),
con un velo di opacità ≥ 0,45 così a riposo l'aspetto è quello dell'immagine e, quando la barra sale, si vede il riempimento blu (velocità) o rosso (giri).
- **Dinamico:** barra velocità, barra giri, numeri. **Fisso:** tutto il resto.
- **Spenti apposta:** i segmenti accesi delle scale carburante e temperatura nell'immagine (ora grigi): il programma non li alimenta, e un livello di carburante fisso sarebbe falso.
- **Limiti della barra (dedotti dal layout originale, da verificare sul display):** sale da y=676 (zero) a y=146 (massimo), x 100–500 (velocità) e 1450–1850 (giri).
  Le finestre sono dentro questi limiti; la parte dell'arco in alto oltre x=500 (e prima di x=1450) resta statica.
- Il layout (`dash.ftu`) porta `HomeBgWindow` a schermo intero, posiziona i numeri nelle due strisce nere e le informazioni (temperatura, carburante, spie) al centro.

## Portiere, cofano e portellone
Il display mostra, in un riquadro 664×480: la base dell'auto **senza cofano** (vano motore visibile), il cofano chiuso e, per ogni parte aperta, un livello "open".
`porte.py` produce tutti i livelli dalla tua immagine, nelle stesse misure e con gli stessi nomi dell'originale:
- le **portiere aperte** sono la rotazione della vera sagoma di ciascuna portiera attorno al suo cardine (la vista dall'alto non cambia forma);
- **cofano e portellone** sono accorciati attorno alla cerniera, come in prospettiva; il vano motore è dipinto;
- le parti aperte sono **rosse** (allerta, come l'originale); ogni livello "open" contiene anche l'apertura scura che copre la parte chiusa sotto, così il risultato è corretto
  qualunque sia l'ordine con cui il programma mostra i livelli.
**Da verificare sul display:** non conosco la logica del programma che accende i livelli; l'ho dedotta dai nomi e dalla visibilità nel layout. Gli specchietti restano fermi.

## Rigenerare il tema
```bash
LUCIDE=<cartella lucide-static/package> bash sorgente/costruisci.sh <cartella backup_...>
```
```bash
bash sorgente/prepara_avvio.sh sorgente/video/avvio_originale.mp4
```
