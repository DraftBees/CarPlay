#!/bin/bash
# SOLO LETTURA (copia file dal display sul Mac, non scrive nulla sul display): scopre come si avvia il display (logo di avvio, script di init, chi lancia fbviewer).
# Non scrive niente sul display. Lancialo connesso alla WiFi lylink_DBF07ACC: bash adb_recon_avvio.sh
DIR="$(cd "$(dirname "$0")" && pwd)"
ADB="$DIR/platform-tools/adb"; [ -x "$ADB" ] || ADB="$(command -v adb)"
IP=192.168.43.1:5555
OUT="$DIR/adb_out_avvio.txt"
BK="$DIR/avvio_pull_$(date +%Y%m%d_%H%M%S)"
exec > "$OUT" 2>&1
sh() { "$ADB" -s $IP shell "$@"; }

"$ADB" kill-server >/dev/null 2>&1
"$ADB" disconnect $IP >/dev/null 2>&1
"$ADB" connect $IP
"$ADB" -s $IP wait-for-device
echo "########## RECON AVVIO $(date) ##########"

echo "=== partizioni flash (/proc/mtd): cerco logo / boot ==="
sh cat /proc/mtd
echo "=== riga di avvio del kernel ==="
sh cat /proc/cmdline
echo "=== framebuffer ==="
sh cat /sys/class/graphics/fb0/virtual_size
sh cat /sys/class/graphics/fb0/bits_per_pixel
echo "=== /etc e script di init ==="
sh ls -la /etc
sh ls -la /etc/init.d
echo "=== programmi disponibili ==="
sh ls -la /bin /sbin /usr/bin /usr/sbin /res/bin
echo "=== processi in esecuzione (riga di comando) ==="
sh 'for p in /proc/[0-9]*; do echo "$p $(cat $p/cmdline 2>/dev/null)"; done'
echo "=== spazio libero ==="
sh df

echo "=== copia di /etc sul Mac (per leggere gli script con calma) ==="
mkdir -p "$BK"
"$ADB" -s $IP pull /etc "$BK/etc"
echo "=== librerie e programmi di sistema (libeasyui.so, libzkhardware.so, adbd...) ==="
for d in /lib /usr/lib /bin /sbin /usr/bin /usr/sbin /system/bin /system/lib; do
  sh ls -d $d >/dev/null 2>&1 && "$ADB" -s $IP pull $d "$BK$d" 2>&1 | tail -1
done
echo "=== chi avvia adbd e l'interfaccia (serve a sapere se adb resta vivo se la UI non parte) ==="
grep -rnI -E "adbd|5555|libzkgui|EasyUI|zkgui|/res/bin|startup" "$BK/etc" 2>/dev/null
echo "=== chi usa fbviewer / home.png / logo (ricerca sul Mac) ==="
grep -rnI -E "fbviewer|home\.png|logo|zkgui|EasyUI|boot" "$BK/etc" 2>/dev/null
echo "########## FINE: output in $OUT, copia di /etc in $BK ##########"
