#!/bin/bash
# Installa il tema sul display: 1 file di testi + 164 immagini + 1 layout (.ftu).
#   bash installa.sh                    tema completo (con il layout del cruscotto)
#   bash installa.sh --solo-immagini    solo testi e immagini, nessun layout (.ftu): il rischio minore
# 1) Collega il Mac alla WiFi lylink_DBF07ACC   2) lancia lo script
# Prima di sovrascrivere ogni file esistente viene copiato dal display in backup_prima_<data>/ (serve a ripristina.sh).
cd "$(dirname "$0")"
SOLO_IMG=0; [ "$1" = "--solo-immagini" ] && SOLO_IMG=1
ADB="./platform-tools/adb"; [ -x "$ADB" ] || ADB="$(command -v adb)"
[ -n "$ADB" ] || { echo "adb non trovato: copia la cartella platform-tools qui accanto"; exit 1; }
IP=192.168.43.1:5555
STAMP=$(date +%Y%m%d_%H%M%S)
BK="backup_prima_$STAMP"
exec > >(tee "installa_log_$STAMP.txt") 2>&1
"$ADB" kill-server >/dev/null 2>&1
"$ADB" disconnect $IP >/dev/null 2>&1
"$ADB" connect $IP
"$ADB" -s $IP wait-for-device || { echo "Display non raggiungibile"; exit 1; }

if [ $SOLO_IMG = 0 ]; then
  echo "Questo installa anche 1 layout (.ftu) del cruscotto. Se il display non dovesse partire:"
  echo "  bash ripristina.sh $BK   (se adb resta raggiungibile) oppure dal menu Sistema -> di Fabbrica."
  read -r -p "Digita si per continuare, qualsiasi altro tasto per annullare: " OK
  [ "$OK" = "si" ] || { echo "Annullato. Puoi usare:  bash installa.sh --solo-immagini"; exit 0; }
fi

echo "=== 1. backup degli originali in $BK ==="
mkdir -p "$BK/res/tr"
mkdir -p "$BK/res/ui"
mkdir -p "$BK/res/ui/HomePage"
mkdir -p "$BK/res/ui/MusicPlayer"
mkdir -p "$BK/res/ui/bg"
mkdir -p "$BK/res/ui/bt"
mkdir -p "$BK/res/ui/dash"
mkdir -p "$BK/res/ui/media"
mkdir -p "$BK/res/ui/setting"
mkdir -p "$BK/res/ui/status"
"$ADB" -s $IP pull "/res/tr/yi_IT-意大利语.json" "$BK/res/tr/yi_IT-意大利语.json" >/dev/null || { echo "Backup fallito: /res/tr/yi_IT-意大利语.json. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/dash_consumption.png" "$BK/res/ui/HomePage/dash_consumption.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/dash_consumption.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/dash_p.png" "$BK/res/ui/HomePage/dash_p.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/dash_p.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/dash_safety.png" "$BK/res/ui/HomePage/dash_safety.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/dash_safety.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_bg_n.png" "$BK/res/ui/HomePage/home_bg_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_bg_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_bg_s.png" "$BK/res/ui/HomePage/home_bg_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_bg_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_airplay_n.png" "$BK/res/ui/HomePage/home_icon_airplay_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_airplay_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_airplay_s.png" "$BK/res/ui/HomePage/home_icon_airplay_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_airplay_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_androidauto_n.png" "$BK/res/ui/HomePage/home_icon_androidauto_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_androidauto_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_androidauto_s.png" "$BK/res/ui/HomePage/home_icon_androidauto_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_androidauto_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_bluetooth_n.png" "$BK/res/ui/HomePage/home_icon_bluetooth_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_bluetooth_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_bluetooth_s.png" "$BK/res/ui/HomePage/home_icon_bluetooth_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_bluetooth_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_carinfo_n.png" "$BK/res/ui/HomePage/home_icon_carinfo_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_carinfo_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_carinfo_s.png" "$BK/res/ui/HomePage/home_icon_carinfo_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_carinfo_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_carlife_n.png" "$BK/res/ui/HomePage/home_icon_carlife_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_carlife_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_carlife_s.png" "$BK/res/ui/HomePage/home_icon_carlife_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_carlife_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_dashboard_n.png" "$BK/res/ui/HomePage/home_icon_dashboard_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_dashboard_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_dashboard_s.png" "$BK/res/ui/HomePage/home_icon_dashboard_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_dashboard_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_dvr_n.png" "$BK/res/ui/HomePage/home_icon_dvr_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_dvr_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_dvr_s.png" "$BK/res/ui/HomePage/home_icon_dvr_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_dvr_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_hicar_n.png" "$BK/res/ui/HomePage/home_icon_hicar_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_hicar_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_hicar_s.png" "$BK/res/ui/HomePage/home_icon_hicar_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_hicar_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_hidvideo_n.png" "$BK/res/ui/HomePage/home_icon_hidvideo_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_hidvideo_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_hidvideo_s.png" "$BK/res/ui/HomePage/home_icon_hidvideo_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_hidvideo_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_miracast_n.png" "$BK/res/ui/HomePage/home_icon_miracast_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_miracast_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_miracast_s.png" "$BK/res/ui/HomePage/home_icon_miracast_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_miracast_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_dail_f.png" "$BK/res/ui/HomePage/home_icon_s_dail_f.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_dail_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_dail_n.png" "$BK/res/ui/HomePage/home_icon_s_dail_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_dail_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_music_f.png" "$BK/res/ui/HomePage/home_icon_s_music_f.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_music_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_music_n.png" "$BK/res/ui/HomePage/home_icon_s_music_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_music_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_set_f.png" "$BK/res/ui/HomePage/home_icon_s_set_f.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_set_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_set_n.png" "$BK/res/ui/HomePage/home_icon_s_set_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_set_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_video_f.png" "$BK/res/ui/HomePage/home_icon_s_video_f.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_video_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_s_video_n.png" "$BK/res/ui/HomePage/home_icon_s_video_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_s_video_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_wiredcarplay_n.png" "$BK/res/ui/HomePage/home_icon_wiredcarplay_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_wiredcarplay_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_wiredcarplay_s.png" "$BK/res/ui/HomePage/home_icon_wiredcarplay_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_wiredcarplay_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_zlink_n.png" "$BK/res/ui/HomePage/home_icon_zlink_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_zlink_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_icon_zlink_s.png" "$BK/res/ui/HomePage/home_icon_zlink_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_icon_zlink_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_left_bg.png" "$BK/res/ui/HomePage/home_left_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_left_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_sound_n.png" "$BK/res/ui/HomePage/home_sound_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_sound_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_sound_s.png" "$BK/res/ui/HomePage/home_sound_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_sound_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_top_bg.png" "$BK/res/ui/HomePage/home_top_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_top_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/za_home_icon_music_n.png" "$BK/res/ui/HomePage/za_home_icon_music_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/za_home_icon_music_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/za_home_icon_music_s.png" "$BK/res/ui/HomePage/za_home_icon_music_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/za_home_icon_music_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_btn_f.png" "$BK/res/ui/MusicPlayer/file_btn_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_btn_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_btn_n.png" "$BK/res/ui/MusicPlayer/file_btn_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_btn_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_local_n.png" "$BK/res/ui/MusicPlayer/file_local_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_local_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_local_s.png" "$BK/res/ui/MusicPlayer/file_local_s.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_local_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_music.png" "$BK/res/ui/MusicPlayer/file_music.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_music.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_usbr_n.png" "$BK/res/ui/MusicPlayer/file_usbr_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_usbr_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_usbr_s.png" "$BK/res/ui/MusicPlayer/file_usbr_s.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_usbr_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_albunm.png" "$BK/res/ui/MusicPlayer/music_albunm.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_albunm.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_artist.png" "$BK/res/ui/MusicPlayer/music_artist.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_artist.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_bg.png" "$BK/res/ui/MusicPlayer/music_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_list_f.png" "$BK/res/ui/MusicPlayer/music_btn_list_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_list_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_list_n.png" "$BK/res/ui/MusicPlayer/music_btn_list_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_list_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_next_f.png" "$BK/res/ui/MusicPlayer/music_btn_next_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_next_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_next_n.png" "$BK/res/ui/MusicPlayer/music_btn_next_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_next_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_pause_f.png" "$BK/res/ui/MusicPlayer/music_btn_pause_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_pause_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_pause_n.png" "$BK/res/ui/MusicPlayer/music_btn_pause_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_pause_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_play_f.png" "$BK/res/ui/MusicPlayer/music_btn_play_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_play_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_play_n.png" "$BK/res/ui/MusicPlayer/music_btn_play_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_play_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_previous_f.png" "$BK/res/ui/MusicPlayer/music_btn_previous_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_previous_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_previous_n.png" "$BK/res/ui/MusicPlayer/music_btn_previous_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_previous_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_random_f.png" "$BK/res/ui/MusicPlayer/music_btn_random_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_random_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_random_n.png" "$BK/res/ui/MusicPlayer/music_btn_random_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_random_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_single_f.png" "$BK/res/ui/MusicPlayer/music_btn_single_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_single_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_btn_single_n.png" "$BK/res/ui/MusicPlayer/music_btn_single_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_btn_single_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_defaultcover.png" "$BK/res/ui/MusicPlayer/music_defaultcover.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_defaultcover.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_slide.png" "$BK/res/ui/MusicPlayer/music_slide.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_slide.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_slide_bg.png" "$BK/res/ui/MusicPlayer/music_slide_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_slide_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_slide_btn.png" "$BK/res/ui/MusicPlayer/music_slide_btn.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_slide_btn.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_title.png" "$BK/res/ui/MusicPlayer/music_title.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_title.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/bg1.png" "$BK/res/ui/bg/bg1.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/bg1.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/bg2.png" "$BK/res/ui/bg/bg2.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/bg2.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/bg3.png" "$BK/res/ui/bg/bg3.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/bg3.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/bg4.png" "$BK/res/ui/bg/bg4.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/bg4.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/bg5.png" "$BK/res/ui/bg/bg5.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/bg5.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/bg6.png" "$BK/res/ui/bg/bg6.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/bg6.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg1_f.png" "$BK/res/ui/bg/home_bg1_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg1_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg1_n.png" "$BK/res/ui/bg/home_bg1_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg1_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg2_f.png" "$BK/res/ui/bg/home_bg2_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg2_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg2_n.png" "$BK/res/ui/bg/home_bg2_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg2_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg3_f.png" "$BK/res/ui/bg/home_bg3_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg3_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg3_n.png" "$BK/res/ui/bg/home_bg3_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg3_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg4_f.png" "$BK/res/ui/bg/home_bg4_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg4_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg4_n.png" "$BK/res/ui/bg/home_bg4_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg4_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg5_f.png" "$BK/res/ui/bg/home_bg5_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg5_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg5_n.png" "$BK/res/ui/bg/home_bg5_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg5_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg6_f.png" "$BK/res/ui/bg/home_bg6_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg6_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bg/home_bg6_n.png" "$BK/res/ui/bg/home_bg6_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bg/home_bg6_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_base_bg.png" "$BK/res/ui/bt/bt_base_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_base_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn1_f.png" "$BK/res/ui/bt/bt_call_btn1_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn1_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn1_n.png" "$BK/res/ui/bt/bt_call_btn1_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn1_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn2_f.png" "$BK/res/ui/bt/bt_call_btn2_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn2_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn2_n.png" "$BK/res/ui/bt/bt_call_btn2_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn2_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_download_n.png" "$BK/res/ui/bt/bt_contacts_download_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_download_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_f.png" "$BK/res/ui/bt/bt_contacts_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_n.png" "$BK/res/ui/bt/bt_contacts_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_dail_f.png" "$BK/res/ui/bt/bt_dail_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_dail_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_dail_n.png" "$BK/res/ui/bt/bt_dail_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_dail_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_music_f.png" "$BK/res/ui/bt/bt_music_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_music_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_music_n.png" "$BK/res/ui/bt/bt_music_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_music_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_record_f.png" "$BK/res/ui/bt/bt_record_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_record_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_record_n.png" "$BK/res/ui/bt/bt_record_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_record_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_call_callin.png" "$BK/res/ui/bt/bt_s_call_callin.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_call_callin.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_call_callmiss.png" "$BK/res/ui/bt/bt_s_call_callmiss.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_call_callmiss.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_call_callout.png" "$BK/res/ui/bt/bt_s_call_callout.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_call_callout.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_contacts.png" "$BK/res/ui/bt/bt_s_contacts.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_contacts.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_f.png" "$BK/res/ui/bt/bt_set_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_n.png" "$BK/res/ui/bt/bt_set_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_next_n.png" "$BK/res/ui/bt/bt_tmusic_next_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_next_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_pause_n.png" "$BK/res/ui/bt/bt_tmusic_pause_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_pause_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_play_n.png" "$BK/res/ui/bt/bt_tmusic_play_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_play_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_previous_n.png" "$BK/res/ui/bt/bt_tmusic_previous_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_previous_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/head.png" "$BK/res/ui/bt/head.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/head.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/set_fullscreen_bg.png" "$BK/res/ui/bt/set_fullscreen_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/set_fullscreen_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/za_btmusic_defaultcover.png" "$BK/res/ui/bt/za_btmusic_defaultcover.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/za_btmusic_defaultcover.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/dash/dash_bg_china.png" "$BK/res/ui/dash/dash_bg_china.png" >/dev/null || { echo "Backup fallito: /res/ui/dash/dash_bg_china.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/dash/dash_bg_english.png" "$BK/res/ui/dash/dash_bg_english.png" >/dev/null || { echo "Backup fallito: /res/ui/dash/dash_bg_english.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/dash/press_bg_yellow.png" "$BK/res/ui/dash/press_bg_yellow.png" >/dev/null || { echo "Backup fallito: /res/ui/dash/press_bg_yellow.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/video_load.png" "$BK/res/ui/media/video_load.png" >/dev/null || { echo "Backup fallito: /res/ui/media/video_load.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/off.png" "$BK/res/ui/setting/off.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/off.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/on.png" "$BK/res/ui/setting/on.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/on.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/popwbag.png" "$BK/res/ui/setting/popwbag.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/popwbag.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust.png" "$BK/res/ui/setting/set_adjust.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust_bg.png" "$BK/res/ui/setting/set_adjust_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust_click.png" "$BK/res/ui/setting/set_adjust_click.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust_click.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_audio_n.png" "$BK/res/ui/setting/set_audio_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_audio_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_audio_s.png" "$BK/res/ui/setting/set_audio_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_audio_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_back_n.png" "$BK/res/ui/setting/set_back_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_back_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_back_s.png" "$BK/res/ui/setting/set_back_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_back_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_base_bg.png" "$BK/res/ui/setting/set_base_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_base_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_btn_f.png" "$BK/res/ui/setting/set_btn_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_btn_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_btn_n.png" "$BK/res/ui/setting/set_btn_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_btn_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_date_n.png" "$BK/res/ui/setting/set_date_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_date_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_date_s.png" "$BK/res/ui/setting/set_date_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_date_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_first_menu_select.png" "$BK/res/ui/setting/set_first_menu_select.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_first_menu_select.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_fullscreen_bg.png" "$BK/res/ui/setting/set_fullscreen_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_fullscreen_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_common_f.png" "$BK/res/ui/setting/set_ic_common_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_common_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_common_n.png" "$BK/res/ui/setting/set_ic_common_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_common_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_eq_f.png" "$BK/res/ui/setting/set_ic_eq_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_eq_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_eq_n.png" "$BK/res/ui/setting/set_ic_eq_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_eq_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_factory_f.png" "$BK/res/ui/setting/set_ic_factory_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_factory_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_factory_n.png" "$BK/res/ui/setting/set_ic_factory_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_factory_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_wallpaper_f.png" "$BK/res/ui/setting/set_ic_wallpaper_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_wallpaper_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_ic_wallpaper_n.png" "$BK/res/ui/setting/set_ic_wallpaper_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_ic_wallpaper_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_language_n.png" "$BK/res/ui/setting/set_language_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_language_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_language_s.png" "$BK/res/ui/setting/set_language_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_language_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_light_n.png" "$BK/res/ui/setting/set_light_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_light_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_light_s.png" "$BK/res/ui/setting/set_light_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_light_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_line.png" "$BK/res/ui/setting/set_line.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_line.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_right_bg.png" "$BK/res/ui/setting/set_right_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_right_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_second_menu_select_f.png" "$BK/res/ui/setting/set_second_menu_select_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_second_menu_select_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_second_menu_select_n.png" "$BK/res/ui/setting/set_second_menu_select_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_second_menu_select_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_system_n.png" "$BK/res/ui/setting/set_system_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_system_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_system_s.png" "$BK/res/ui/setting/set_system_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_system_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_back_f.png" "$BK/res/ui/status/home_back_f.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_back_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_back_n.png" "$BK/res/ui/status/home_back_n.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_back_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_bt.png" "$BK/res/ui/status/home_bt.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_bt.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_home_f.png" "$BK/res/ui/status/home_home_f.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_home_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_home_n.png" "$BK/res/ui/status/home_home_n.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_home_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/u.png" "$BK/res/ui/status/u.png" >/dev/null || { echo "Backup fallito: /res/ui/status/u.png. Interrompo senza toccare nulla."; exit 1; }
if [ $SOLO_IMG = 0 ]; then
  "$ADB" -s $IP pull "/res/ui/dash.ftu" "$BK/res/ui/dash.ftu" >/dev/null || { echo "Backup fallito: /res/ui/dash.ftu. Interrompo senza toccare nulla."; exit 1; }
fi
echo "Backup completato."

echo "=== 2. invio: testi e immagini ==="
ERR=0
"$ADB" -s $IP push "res/tr/yi_IT-意大利语.json" "/res/tr/yi_IT-意大利语.json" >/dev/null || { echo "Invio fallito: /res/tr/yi_IT-意大利语.json"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/dash_consumption.png" "/res/ui/HomePage/dash_consumption.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/dash_consumption.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/dash_p.png" "/res/ui/HomePage/dash_p.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/dash_p.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/dash_safety.png" "/res/ui/HomePage/dash_safety.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/dash_safety.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_bg_n.png" "/res/ui/HomePage/home_bg_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_bg_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_bg_s.png" "/res/ui/HomePage/home_bg_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_bg_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_airplay_n.png" "/res/ui/HomePage/home_icon_airplay_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_airplay_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_airplay_s.png" "/res/ui/HomePage/home_icon_airplay_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_airplay_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_androidauto_n.png" "/res/ui/HomePage/home_icon_androidauto_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_androidauto_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_androidauto_s.png" "/res/ui/HomePage/home_icon_androidauto_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_androidauto_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_bluetooth_n.png" "/res/ui/HomePage/home_icon_bluetooth_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_bluetooth_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_bluetooth_s.png" "/res/ui/HomePage/home_icon_bluetooth_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_bluetooth_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_carinfo_n.png" "/res/ui/HomePage/home_icon_carinfo_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_carinfo_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_carinfo_s.png" "/res/ui/HomePage/home_icon_carinfo_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_carinfo_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_carlife_n.png" "/res/ui/HomePage/home_icon_carlife_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_carlife_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_carlife_s.png" "/res/ui/HomePage/home_icon_carlife_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_carlife_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_dashboard_n.png" "/res/ui/HomePage/home_icon_dashboard_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_dashboard_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_dashboard_s.png" "/res/ui/HomePage/home_icon_dashboard_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_dashboard_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_dvr_n.png" "/res/ui/HomePage/home_icon_dvr_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_dvr_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_dvr_s.png" "/res/ui/HomePage/home_icon_dvr_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_dvr_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_hicar_n.png" "/res/ui/HomePage/home_icon_hicar_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_hicar_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_hicar_s.png" "/res/ui/HomePage/home_icon_hicar_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_hicar_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_hidvideo_n.png" "/res/ui/HomePage/home_icon_hidvideo_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_hidvideo_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_hidvideo_s.png" "/res/ui/HomePage/home_icon_hidvideo_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_hidvideo_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_miracast_n.png" "/res/ui/HomePage/home_icon_miracast_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_miracast_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_miracast_s.png" "/res/ui/HomePage/home_icon_miracast_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_miracast_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_dail_f.png" "/res/ui/HomePage/home_icon_s_dail_f.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_dail_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_dail_n.png" "/res/ui/HomePage/home_icon_s_dail_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_dail_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_music_f.png" "/res/ui/HomePage/home_icon_s_music_f.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_music_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_music_n.png" "/res/ui/HomePage/home_icon_s_music_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_music_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_set_f.png" "/res/ui/HomePage/home_icon_s_set_f.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_set_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_set_n.png" "/res/ui/HomePage/home_icon_s_set_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_set_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_video_f.png" "/res/ui/HomePage/home_icon_s_video_f.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_video_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_s_video_n.png" "/res/ui/HomePage/home_icon_s_video_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_s_video_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_wiredcarplay_n.png" "/res/ui/HomePage/home_icon_wiredcarplay_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_wiredcarplay_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_wiredcarplay_s.png" "/res/ui/HomePage/home_icon_wiredcarplay_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_wiredcarplay_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_zlink_n.png" "/res/ui/HomePage/home_icon_zlink_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_zlink_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_icon_zlink_s.png" "/res/ui/HomePage/home_icon_zlink_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_icon_zlink_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_left_bg.png" "/res/ui/HomePage/home_left_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_left_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_sound_n.png" "/res/ui/HomePage/home_sound_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_sound_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_sound_s.png" "/res/ui/HomePage/home_sound_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_sound_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_top_bg.png" "/res/ui/HomePage/home_top_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_top_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/za_home_icon_music_n.png" "/res/ui/HomePage/za_home_icon_music_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/za_home_icon_music_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/za_home_icon_music_s.png" "/res/ui/HomePage/za_home_icon_music_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/za_home_icon_music_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_btn_f.png" "/res/ui/MusicPlayer/file_btn_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_btn_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_btn_n.png" "/res/ui/MusicPlayer/file_btn_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_btn_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_local_n.png" "/res/ui/MusicPlayer/file_local_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_local_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_local_s.png" "/res/ui/MusicPlayer/file_local_s.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_local_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_music.png" "/res/ui/MusicPlayer/file_music.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_music.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_usbr_n.png" "/res/ui/MusicPlayer/file_usbr_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_usbr_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_usbr_s.png" "/res/ui/MusicPlayer/file_usbr_s.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_usbr_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_albunm.png" "/res/ui/MusicPlayer/music_albunm.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_albunm.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_artist.png" "/res/ui/MusicPlayer/music_artist.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_artist.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_bg.png" "/res/ui/MusicPlayer/music_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_list_f.png" "/res/ui/MusicPlayer/music_btn_list_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_list_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_list_n.png" "/res/ui/MusicPlayer/music_btn_list_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_list_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_next_f.png" "/res/ui/MusicPlayer/music_btn_next_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_next_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_next_n.png" "/res/ui/MusicPlayer/music_btn_next_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_next_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_pause_f.png" "/res/ui/MusicPlayer/music_btn_pause_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_pause_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_pause_n.png" "/res/ui/MusicPlayer/music_btn_pause_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_pause_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_play_f.png" "/res/ui/MusicPlayer/music_btn_play_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_play_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_play_n.png" "/res/ui/MusicPlayer/music_btn_play_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_play_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_previous_f.png" "/res/ui/MusicPlayer/music_btn_previous_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_previous_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_previous_n.png" "/res/ui/MusicPlayer/music_btn_previous_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_previous_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_random_f.png" "/res/ui/MusicPlayer/music_btn_random_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_random_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_random_n.png" "/res/ui/MusicPlayer/music_btn_random_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_random_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_single_f.png" "/res/ui/MusicPlayer/music_btn_single_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_single_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_btn_single_n.png" "/res/ui/MusicPlayer/music_btn_single_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_btn_single_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_defaultcover.png" "/res/ui/MusicPlayer/music_defaultcover.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_defaultcover.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_slide.png" "/res/ui/MusicPlayer/music_slide.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_slide.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_slide_bg.png" "/res/ui/MusicPlayer/music_slide_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_slide_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_slide_btn.png" "/res/ui/MusicPlayer/music_slide_btn.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_slide_btn.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_title.png" "/res/ui/MusicPlayer/music_title.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_title.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/bg1.png" "/res/ui/bg/bg1.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/bg1.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/bg2.png" "/res/ui/bg/bg2.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/bg2.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/bg3.png" "/res/ui/bg/bg3.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/bg3.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/bg4.png" "/res/ui/bg/bg4.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/bg4.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/bg5.png" "/res/ui/bg/bg5.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/bg5.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/bg6.png" "/res/ui/bg/bg6.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/bg6.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg1_f.png" "/res/ui/bg/home_bg1_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg1_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg1_n.png" "/res/ui/bg/home_bg1_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg1_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg2_f.png" "/res/ui/bg/home_bg2_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg2_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg2_n.png" "/res/ui/bg/home_bg2_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg2_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg3_f.png" "/res/ui/bg/home_bg3_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg3_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg3_n.png" "/res/ui/bg/home_bg3_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg3_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg4_f.png" "/res/ui/bg/home_bg4_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg4_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg4_n.png" "/res/ui/bg/home_bg4_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg4_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg5_f.png" "/res/ui/bg/home_bg5_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg5_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg5_n.png" "/res/ui/bg/home_bg5_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg5_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg6_f.png" "/res/ui/bg/home_bg6_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg6_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bg/home_bg6_n.png" "/res/ui/bg/home_bg6_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bg/home_bg6_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_base_bg.png" "/res/ui/bt/bt_base_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_base_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn1_f.png" "/res/ui/bt/bt_call_btn1_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn1_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn1_n.png" "/res/ui/bt/bt_call_btn1_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn1_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn2_f.png" "/res/ui/bt/bt_call_btn2_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn2_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn2_n.png" "/res/ui/bt/bt_call_btn2_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn2_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_download_n.png" "/res/ui/bt/bt_contacts_download_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_download_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_f.png" "/res/ui/bt/bt_contacts_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_n.png" "/res/ui/bt/bt_contacts_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_dail_f.png" "/res/ui/bt/bt_dail_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_dail_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_dail_n.png" "/res/ui/bt/bt_dail_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_dail_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_music_f.png" "/res/ui/bt/bt_music_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_music_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_music_n.png" "/res/ui/bt/bt_music_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_music_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_record_f.png" "/res/ui/bt/bt_record_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_record_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_record_n.png" "/res/ui/bt/bt_record_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_record_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_call_callin.png" "/res/ui/bt/bt_s_call_callin.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_call_callin.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_call_callmiss.png" "/res/ui/bt/bt_s_call_callmiss.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_call_callmiss.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_call_callout.png" "/res/ui/bt/bt_s_call_callout.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_call_callout.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_contacts.png" "/res/ui/bt/bt_s_contacts.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_contacts.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_f.png" "/res/ui/bt/bt_set_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_n.png" "/res/ui/bt/bt_set_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_next_n.png" "/res/ui/bt/bt_tmusic_next_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_next_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_pause_n.png" "/res/ui/bt/bt_tmusic_pause_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_pause_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_play_n.png" "/res/ui/bt/bt_tmusic_play_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_play_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_previous_n.png" "/res/ui/bt/bt_tmusic_previous_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_previous_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/head.png" "/res/ui/bt/head.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/head.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/set_fullscreen_bg.png" "/res/ui/bt/set_fullscreen_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/set_fullscreen_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/za_btmusic_defaultcover.png" "/res/ui/bt/za_btmusic_defaultcover.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/za_btmusic_defaultcover.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/dash_bg_china.png" "/res/ui/dash/dash_bg_china.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/dash_bg_china.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/dash_bg_english.png" "/res/ui/dash/dash_bg_english.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/dash_bg_english.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/press_bg_blue.png" "/res/ui/dash/press_bg_blue.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/press_bg_blue.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/press_bg_red.png" "/res/ui/dash/press_bg_red.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/press_bg_red.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/press_bg_yellow.png" "/res/ui/dash/press_bg_yellow.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/press_bg_yellow.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/video_load.png" "/res/ui/media/video_load.png" >/dev/null || { echo "Invio fallito: /res/ui/media/video_load.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/off.png" "/res/ui/setting/off.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/off.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/on.png" "/res/ui/setting/on.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/on.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/popwbag.png" "/res/ui/setting/popwbag.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/popwbag.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust.png" "/res/ui/setting/set_adjust.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust_bg.png" "/res/ui/setting/set_adjust_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust_click.png" "/res/ui/setting/set_adjust_click.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust_click.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_audio_n.png" "/res/ui/setting/set_audio_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_audio_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_audio_s.png" "/res/ui/setting/set_audio_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_audio_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_back_n.png" "/res/ui/setting/set_back_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_back_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_back_s.png" "/res/ui/setting/set_back_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_back_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_base_bg.png" "/res/ui/setting/set_base_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_base_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_btn_f.png" "/res/ui/setting/set_btn_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_btn_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_btn_n.png" "/res/ui/setting/set_btn_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_btn_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_date_n.png" "/res/ui/setting/set_date_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_date_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_date_s.png" "/res/ui/setting/set_date_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_date_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_first_menu_select.png" "/res/ui/setting/set_first_menu_select.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_first_menu_select.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_fullscreen_bg.png" "/res/ui/setting/set_fullscreen_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_fullscreen_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_common_f.png" "/res/ui/setting/set_ic_common_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_common_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_common_n.png" "/res/ui/setting/set_ic_common_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_common_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_eq_f.png" "/res/ui/setting/set_ic_eq_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_eq_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_eq_n.png" "/res/ui/setting/set_ic_eq_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_eq_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_factory_f.png" "/res/ui/setting/set_ic_factory_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_factory_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_factory_n.png" "/res/ui/setting/set_ic_factory_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_factory_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_wallpaper_f.png" "/res/ui/setting/set_ic_wallpaper_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_wallpaper_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_ic_wallpaper_n.png" "/res/ui/setting/set_ic_wallpaper_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_ic_wallpaper_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_language_n.png" "/res/ui/setting/set_language_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_language_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_language_s.png" "/res/ui/setting/set_language_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_language_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_light_n.png" "/res/ui/setting/set_light_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_light_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_light_s.png" "/res/ui/setting/set_light_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_light_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_line.png" "/res/ui/setting/set_line.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_line.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_right_bg.png" "/res/ui/setting/set_right_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_right_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_second_menu_select_f.png" "/res/ui/setting/set_second_menu_select_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_second_menu_select_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_second_menu_select_n.png" "/res/ui/setting/set_second_menu_select_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_second_menu_select_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_system_n.png" "/res/ui/setting/set_system_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_system_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_system_s.png" "/res/ui/setting/set_system_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_system_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_back_f.png" "/res/ui/status/home_back_f.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_back_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_back_n.png" "/res/ui/status/home_back_n.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_back_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_bt.png" "/res/ui/status/home_bt.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_bt.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_home_f.png" "/res/ui/status/home_home_f.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_home_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_home_n.png" "/res/ui/status/home_home_n.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_home_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/u.png" "/res/ui/status/u.png" >/dev/null || { echo "Invio fallito: /res/ui/status/u.png"; ERR=1; }
if [ $SOLO_IMG = 0 ]; then
  echo "=== 3. invio: layout (.ftu) ==="
  "$ADB" -s $IP push "res/ui/dash.ftu" "/res/ui/dash.ftu" >/dev/null || { echo "Invio fallito: /res/ui/dash.ftu"; ERR=1; }
fi
"$ADB" -s $IP shell sync >/dev/null 2>&1 || true
if [ $ERR = 1 ]; then echo "Qualcosa non è andato: rimetti gli originali con  bash ripristina.sh $BK"; exit 1; fi
echo "Fatto. Backup in: $BK"
read -r -p "Riavviare ora il display? [s/N] " R
[ "$R" = "s" ] || [ "$R" = "S" ] && "$ADB" -s $IP reboot
exit 0
