# Avvio: cosa si può fare e come

## Logo di avvio fisso — via supportata dal costruttore (da provare)
Nel programma del display, il gestore degli aggiornamenti (`UpgradeManager`) cerca su chiavetta USB o scheda i file
`extupdate.img`, `MISC.bin`, `ts.cfg` e **`boot_logo.JPG`**, e conosce gli errori
«la risoluzione dell'immagine di avvio supera quella dello schermo» e «aggiornamento del logo di avvio non supportato».
Quindi un `boot_logo.JPG` ≤ 1920×720 messo nella cartella principale di una chiavetta dovrebbe cambiare il logo di avvio.

1. Copia `boot_logo.JPG` (qui accanto, 1920×720) nella cartella principale di una chiavetta USB (FAT32) o di una scheda SD.
2. Con l'auto accesa e **alimentazione stabile**, inserisci la chiavetta nel display.
3. Dovrebbe comparire il messaggio di aggiornamento e riavviarsi. Se compare un errore, copialo e mandamelo.
4. Finito, **togli il file dalla chiavetta**: il display potrebbe ripetere l'aggiornamento a ogni inserimento.

**Rischi:** è una scrittura di sistema in una zona di memoria separata: non va interrotta (niente spegnimento durante l'aggiornamento).
Non ho potuto provarla e non conosco il formato esatto che il display si aspetta: è la strada del costruttore, non una garanzia.

## Video di avvio — non realizzabile con i soli file
Il display ha il lettore video (`ZKVideoView::play`), ma si avvia solo da codice del programma; nessun file di layout può farlo partire.
Servirebbe una libreria aggiuntiva (da provare con molta cautela). Prima serve `adb_out_avvio.txt` (vedi `leggi_display.sh`).
Il video è pronto in `avvio_1920x720.mp4` e nel simulatore parte a ogni accensione.
