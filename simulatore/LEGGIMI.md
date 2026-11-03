# Simulatore DisplayAuto

Versione navigabile del display aftermarket (FlyThings V2.1 / ZKOS, 1920×720), costruita con le
**immagini originali** del backup (`res/ui`) e i **testi reali** di tutte le 15 lingue (`res/tr`).

## Tema Cluster
In alto c'è l'interruttore **Originale / Tema Cluster**. Con il tema attivo, l'export include tutto il tema
più le tue modifiche. Il tema pronto da installare da solo è in `../tema_bmw/`.

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

## Layout reali
La vista **Layout reali** (in alto) disegna le 24 schermate 1920×720 direttamente dai file `.ftu` decodificati
(`../layout/`): ogni elemento è alla posizione, dimensione, immagine e colore scritti nel file.
- Menu a tendina con le schermate; "mostra riquadri" e "mostra elementi nascosti"; passando il mouse si leggono nome, id e misure.
- Il programma sceglie a runtime quale gruppo di card mostrare nella home: qui lo scegli tu (`bwmScrollWindow` è la home con proiezione).
- Segna in rosso i testi che non entrano nella loro casella (sul display verrebbero tagliati).
- La **home** e il **cruscotto** della vista Interattiva sono ora costruiti da questi layout; le altre schermate interattive sono ancora disegnate a mano.
- Dedotto dai dati, non documentato: allineamento del testo = `32 + riga*4 + colonna`; colori `-1` = nessuno.

## Animazioni (anteprima)
Il pulsante **Animazioni** mostra cosa si potrebbe fare con una libreria aggiuntiva (tappa 3): avvio con la foto
dell'auto e le tre strisce, ingresso a scaglioni delle card, transizioni tra schermate, giro di lancetta del
cruscotto all'accensione, barre dell'equalizzatore nella musica.
**Sul display, con i soli file `.ftu` e il tema, queste animazioni non ci sono.** Servono la libreria aggiuntiva e il test di sicurezza.

## Cruscotto: correzione importante
Il simulatore ora riproduce il meccanismo vero: le barre salgono **dietro** lo sfondo e si vedono dalle finestre trasparenti del PNG
(prima le disegnavo sopra, e con uno sfondo opaco sul display non si sarebbero viste).
