# Simulatore DisplayAuto

Versione navigabile del display aftermarket (FlyThings V2.1 / ZKOS, 1920×720), costruita con le
**immagini originali** del backup (`res/ui`) e i **testi reali** di tutte le 15 lingue (`res/tr`).

## Aprirlo
- **Doppio clic su `index.html`**: funziona offline in qualsiasi browser.
- **Doppio clic su `avvia.command`** (Mac): stesso simulatore servito da un piccolo server locale.
  Serve solo per il *ritocco colore* delle immagini originali, che il browser blocca sui file aperti direttamente.

## Cosa si può fare
- Usarlo come il display: home a scorrimento, CarPlay/Android Auto/Hicar/Mirror (schermate di collegamento),
  Bluetooth (tastiera, chiamata, rubrica, registro, musica BT), Musica, Video, Cruscotto animato,
  Veicolo originale (porte/radar), DVR, Impostazioni (luminosità, volume, lingua, data, retrocamera, sistema,
  EQ, sfondo, menu fabbrica protetto). Sotto lo schermo ci sono comandi per simulare retromarcia,
  chiamata in arrivo, riavvio, velocità del cruscotto e porte aperte.
- **Modifica sullo schermo** (tasto `E`): clic su una scritta → cambi il testo; clic su un'immagine →
  la sostituisci (viene portata alle dimensioni originali) o ne ritocchi tonalità/saturazione/luminosità.
  Per il cruscotto c'è la guida delle due aree dove il sistema disegna le lancette.
- **Esporta per ADB**: scarica `personalizzazione_display.zip` con i file nei percorsi giusti,
  `installa.sh` (fa `adb pull` di backup di ogni file prima del `push`), `ripristina.sh` e un LEGGIMI.

## Cosa è approssimato
- La disposizione esatta degli elementi è ricostruita: i layout veri sono nei `.ftu` cifrati.
- Le lancette del cruscotto sono simulate come riempimento delle due bande.
- Brani, contatti e chiamate sono esempi. Il menu di fabbrica non è riprodotto apposta.
- `screen_bg = 4` in `zkapp.cfg` è interpretato come `bg5` (indice da 0, come `language_select = 8` → italiano).

## Rigenerare i dati
`data/strings.js` e `data/images.js` sono generati dal backup; le immagini in `res/ui/` sono copie degli originali.
