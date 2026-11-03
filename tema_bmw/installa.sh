#!/bin/bash
# Installa il tema sul display: 1 file di testi + 262 immagini + 2 file di sistema (layout .ftu e font).
#   bash installa.sh                    tema completo (con layout del cruscotto e font)
#   bash installa.sh --solo-immagini    solo testi e immagini, niente layout né font: il rischio minore
# 1) Collega il Mac alla WiFi lylink_DBF07ACC   2) lancia lo script
# Prima di sovrascrivere ogni file esistente viene copiato dal display in backup_prima_<data>/ (serve a ripristina.sh).
cd "$(dirname "$0")"
FONT_SRC="res/ui/font.ttf"; [ -f personale/font.ttf ] && FONT_SRC="personale/font.ttf"   # font personale, se presente
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
  echo "Questo installa anche 2 file di sistema (layout del cruscotto e font). Se il display non dovesse partire:"
  echo "  bash ripristina.sh $BK   (se adb resta raggiungibile) oppure dal menu Sistema -> di Fabbrica."
  read -r -p "Digita si per continuare, qualsiasi altro tasto per annullare: " OK
  [ "$OK" = "si" ] || { echo "Annullato. Puoi usare:  bash installa.sh --solo-immagini"; exit 0; }
fi

echo "=== 1. backup degli originali in $BK ==="
mkdir -p "$BK/res/tr"
mkdir -p "$BK/res/ui"
mkdir -p "$BK/res/ui/HomePage"
mkdir -p "$BK/res/ui/MusicPlayer"
mkdir -p "$BK/res/ui/aircontrol"
mkdir -p "$BK/res/ui/back"
mkdir -p "$BK/res/ui/bg"
mkdir -p "$BK/res/ui/bt"
mkdir -p "$BK/res/ui/car"
mkdir -p "$BK/res/ui/dash"
mkdir -p "$BK/res/ui/link"
mkdir -p "$BK/res/ui/media"
mkdir -p "$BK/res/ui/setting"
mkdir -p "$BK/res/ui/status"
mkdir -p "$BK/res/ui/wifi"
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
"$ADB" -s $IP pull "/res/ui/HomePage/home_menu_select.png" "$BK/res/ui/HomePage/home_menu_select.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_menu_select.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_right_biao.png" "$BK/res/ui/HomePage/home_right_biao.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_right_biao.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_sound_n.png" "$BK/res/ui/HomePage/home_sound_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_sound_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_sound_s.png" "$BK/res/ui/HomePage/home_sound_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_sound_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/home_top_bg.png" "$BK/res/ui/HomePage/home_top_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/home_top_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/za_home_icon_music_n.png" "$BK/res/ui/HomePage/za_home_icon_music_n.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/za_home_icon_music_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/HomePage/za_home_icon_music_s.png" "$BK/res/ui/HomePage/za_home_icon_music_s.png" >/dev/null || { echo "Backup fallito: /res/ui/HomePage/za_home_icon_music_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_btn_f.png" "$BK/res/ui/MusicPlayer/file_btn_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_btn_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_btn_n.png" "$BK/res/ui/MusicPlayer/file_btn_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_btn_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_choice.png" "$BK/res/ui/MusicPlayer/file_choice.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_choice.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_local_n.png" "$BK/res/ui/MusicPlayer/file_local_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_local_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_local_s.png" "$BK/res/ui/MusicPlayer/file_local_s.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_local_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_music.png" "$BK/res/ui/MusicPlayer/file_music.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_music.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_music_f.png" "$BK/res/ui/MusicPlayer/file_music_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_music_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_usbr_n.png" "$BK/res/ui/MusicPlayer/file_usbr_n.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_usbr_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/file_usbr_s.png" "$BK/res/ui/MusicPlayer/file_usbr_s.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/file_usbr_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_albunm.png" "$BK/res/ui/MusicPlayer/music_albunm.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_albunm.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_artist.png" "$BK/res/ui/MusicPlayer/music_artist.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_artist.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/music_base_bg.png" "$BK/res/ui/MusicPlayer/music_base_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/music_base_bg.png. Interrompo senza toccare nulla."; exit 1; }
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
"$ADB" -s $IP pull "/res/ui/MusicPlayer/video_btn_screen_f.png" "$BK/res/ui/MusicPlayer/video_btn_screen_f.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/video_btn_screen_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/video_slide.png" "$BK/res/ui/MusicPlayer/video_slide.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/video_slide.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/MusicPlayer/video_slide_btn.png" "$BK/res/ui/MusicPlayer/video_slide_btn.png" >/dev/null || { echo "Backup fallito: /res/ui/MusicPlayer/video_slide_btn.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/aircontrol/ac_on.png" "$BK/res/ui/aircontrol/ac_on.png" >/dev/null || { echo "Backup fallito: /res/ui/aircontrol/ac_on.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/aircontrol/airinfobg.png" "$BK/res/ui/aircontrol/airinfobg.png" >/dev/null || { echo "Backup fallito: /res/ui/aircontrol/airinfobg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/aircontrol/line.png" "$BK/res/ui/aircontrol/line.png" >/dev/null || { echo "Backup fallito: /res/ui/aircontrol/line.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/back/set_ic_common_f.png" "$BK/res/ui/back/set_ic_common_f.png" >/dev/null || { echo "Backup fallito: /res/ui/back/set_ic_common_f.png. Interrompo senza toccare nulla."; exit 1; }
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
"$ADB" -s $IP pull "/res/ui/bt/bt_btn1_f.png" "$BK/res/ui/bt/bt_btn1_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_btn1_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_btn1_n.png" "$BK/res/ui/bt/bt_btn1_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_btn1_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_btn2_f.png" "$BK/res/ui/bt/bt_btn2_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_btn2_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_btn2_n.png" "$BK/res/ui/bt/bt_btn2_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_btn2_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_btn_off.png" "$BK/res/ui/bt/bt_btn_off.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_btn_off.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn1_f.png" "$BK/res/ui/bt/bt_call_btn1_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn1_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn1_n.png" "$BK/res/ui/bt/bt_call_btn1_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn1_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn2_f.png" "$BK/res/ui/bt/bt_call_btn2_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn2_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btn2_n.png" "$BK/res/ui/bt/bt_call_btn2_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btn2_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_btnbg.png" "$BK/res/ui/bt/bt_call_btnbg.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_btnbg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_callin_f.png" "$BK/res/ui/bt/bt_call_callin_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_callin_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_callin_n.png" "$BK/res/ui/bt/bt_call_callin_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_callin_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_callmiss_f.png" "$BK/res/ui/bt/bt_call_callmiss_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_callmiss_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_callout_f.png" "$BK/res/ui/bt/bt_call_callout_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_callout_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_keykeyboard_f.png" "$BK/res/ui/bt/bt_call_keykeyboard_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_keykeyboard_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_keykeyboard_n.png" "$BK/res/ui/bt/bt_call_keykeyboard_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_keykeyboard_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_voice_f.png" "$BK/res/ui/bt/bt_call_voice_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_voice_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_call_voice_n.png" "$BK/res/ui/bt/bt_call_voice_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_call_voice_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_choice.png" "$BK/res/ui/bt/bt_choice.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_choice.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_download_f.png" "$BK/res/ui/bt/bt_contacts_download_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_download_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_download_n.png" "$BK/res/ui/bt/bt_contacts_download_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_download_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_f.png" "$BK/res/ui/bt/bt_contacts_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_contacts_n.png" "$BK/res/ui/bt/bt_contacts_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_contacts_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_dail_f.png" "$BK/res/ui/bt/bt_dail_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_dail_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_dail_n.png" "$BK/res/ui/bt/bt_dail_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_dail_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_hang_up_f.png" "$BK/res/ui/bt/bt_hang_up_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_hang_up_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_hang_up_n.png" "$BK/res/ui/bt/bt_hang_up_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_hang_up_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_icon.png" "$BK/res/ui/bt/bt_icon.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_icon.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_keyboard_f.png" "$BK/res/ui/bt/bt_keyboard_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_keyboard_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_load0.png" "$BK/res/ui/bt/bt_load0.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_load0.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_music.png" "$BK/res/ui/bt/bt_music.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_music.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_music_f.png" "$BK/res/ui/bt/bt_music_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_music_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_music_n.png" "$BK/res/ui/bt/bt_music_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_music_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_record_f.png" "$BK/res/ui/bt/bt_record_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_record_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_record_n.png" "$BK/res/ui/bt/bt_record_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_record_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_refresh_s.png" "$BK/res/ui/bt/bt_refresh_s.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_refresh_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_call_callin.png" "$BK/res/ui/bt/bt_s_call_callin.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_call_callin.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_call_callmiss.png" "$BK/res/ui/bt/bt_s_call_callmiss.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_call_callmiss.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_call_callout.png" "$BK/res/ui/bt/bt_s_call_callout.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_call_callout.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_s_contacts.png" "$BK/res/ui/bt/bt_s_contacts.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_s_contacts.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_connect_f.png" "$BK/res/ui/bt/bt_set_connect_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_connect_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_delete_f.png" "$BK/res/ui/bt/bt_set_delete_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_delete_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_f.png" "$BK/res/ui/bt/bt_set_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_n.png" "$BK/res/ui/bt/bt_set_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_set_unconnect_f.png" "$BK/res/ui/bt/bt_set_unconnect_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_set_unconnect_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_next_n.png" "$BK/res/ui/bt/bt_tmusic_next_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_next_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_pause_n.png" "$BK/res/ui/bt/bt_tmusic_pause_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_pause_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_play_n.png" "$BK/res/ui/bt/bt_tmusic_play_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_play_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_tmusic_previous_n.png" "$BK/res/ui/bt/bt_tmusic_previous_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_tmusic_previous_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/bt_update_f.png" "$BK/res/ui/bt/bt_update_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/bt_update_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/btcall_update_f.png" "$BK/res/ui/bt/btcall_update_f.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/btcall_update_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/btcall_update_n.png" "$BK/res/ui/bt/btcall_update_n.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/btcall_update_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/find_p.png" "$BK/res/ui/bt/find_p.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/find_p.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/head.png" "$BK/res/ui/bt/head.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/head.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/set_fullscreen_bg.png" "$BK/res/ui/bt/set_fullscreen_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/set_fullscreen_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/bt/za_btmusic_defaultcover.png" "$BK/res/ui/bt/za_btmusic_defaultcover.png" >/dev/null || { echo "Backup fallito: /res/ui/bt/za_btmusic_defaultcover.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_bg.png" "$BK/res/ui/car/car_adjust_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_down_f.png" "$BK/res/ui/car/car_adjust_down_f.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_down_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_down_n.png" "$BK/res/ui/car/car_adjust_down_n.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_down_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_left_f.png" "$BK/res/ui/car/car_adjust_left_f.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_left_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_left_n.png" "$BK/res/ui/car/car_adjust_left_n.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_left_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_ok_f.png" "$BK/res/ui/car/car_adjust_ok_f.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_ok_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_ok_n.png" "$BK/res/ui/car/car_adjust_ok_n.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_ok_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_right_f.png" "$BK/res/ui/car/car_adjust_right_f.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_right_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_right_n.png" "$BK/res/ui/car/car_adjust_right_n.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_right_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_up_f.png" "$BK/res/ui/car/car_adjust_up_f.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_up_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_adjust_up_n.png" "$BK/res/ui/car/car_adjust_up_n.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_adjust_up_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_close.png" "$BK/res/ui/car/car_close.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_close.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_list_bg.png" "$BK/res/ui/car/car_list_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_list_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/car/car_open.png" "$BK/res/ui/car/car_open.png" >/dev/null || { echo "Backup fallito: /res/ui/car/car_open.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/dash/dash_bg_china.png" "$BK/res/ui/dash/dash_bg_china.png" >/dev/null || { echo "Backup fallito: /res/ui/dash/dash_bg_china.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/dash/dash_bg_english.png" "$BK/res/ui/dash/dash_bg_english.png" >/dev/null || { echo "Backup fallito: /res/ui/dash/dash_bg_english.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/dash/press_bg_yellow.png" "$BK/res/ui/dash/press_bg_yellow.png" >/dev/null || { echo "Backup fallito: /res/ui/dash/press_bg_yellow.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/link/incom_remind.png" "$BK/res/ui/link/incom_remind.png" >/dev/null || { echo "Backup fallito: /res/ui/link/incom_remind.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/file_vedio_f.png" "$BK/res/ui/media/file_vedio_f.png" >/dev/null || { echo "Backup fallito: /res/ui/media/file_vedio_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/musicBtn.png" "$BK/res/ui/media/musicBtn.png" >/dev/null || { echo "Backup fallito: /res/ui/media/musicBtn.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/musicBtnP.png" "$BK/res/ui/media/musicBtnP.png" >/dev/null || { echo "Backup fallito: /res/ui/media/musicBtnP.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/music_btn_list_f.png" "$BK/res/ui/media/music_btn_list_f.png" >/dev/null || { echo "Backup fallito: /res/ui/media/music_btn_list_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/vedio_btn_bg.png" "$BK/res/ui/media/vedio_btn_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/media/vedio_btn_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/video_btn_next_f.png" "$BK/res/ui/media/video_btn_next_f.png" >/dev/null || { echo "Backup fallito: /res/ui/media/video_btn_next_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/video_btn_previous_f.png" "$BK/res/ui/media/video_btn_previous_f.png" >/dev/null || { echo "Backup fallito: /res/ui/media/video_btn_previous_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/media/video_load.png" "$BK/res/ui/media/video_load.png" >/dev/null || { echo "Backup fallito: /res/ui/media/video_load.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/language_confir_select.png" "$BK/res/ui/setting/language_confir_select.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/language_confir_select.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/language_menu_select_f.png" "$BK/res/ui/setting/language_menu_select_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/language_menu_select_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/language_menu_select_n.png" "$BK/res/ui/setting/language_menu_select_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/language_menu_select_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/off.png" "$BK/res/ui/setting/off.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/off.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/on.png" "$BK/res/ui/setting/on.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/on.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/ota_bg.png" "$BK/res/ui/setting/ota_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/ota_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/popwbag.png" "$BK/res/ui/setting/popwbag.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/popwbag.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust.png" "$BK/res/ui/setting/set_adjust.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust_934.png" "$BK/res/ui/setting/set_adjust_934.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust_934.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust_bg.png" "$BK/res/ui/setting/set_adjust_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_adjust_click.png" "$BK/res/ui/setting/set_adjust_click.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_adjust_click.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_audio_n.png" "$BK/res/ui/setting/set_audio_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_audio_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_audio_s.png" "$BK/res/ui/setting/set_audio_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_audio_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_back_n.png" "$BK/res/ui/setting/set_back_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_back_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_back_s.png" "$BK/res/ui/setting/set_back_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_back_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_base_bg.png" "$BK/res/ui/setting/set_base_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_base_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_btn_f.png" "$BK/res/ui/setting/set_btn_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_btn_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_btn_n.png" "$BK/res/ui/setting/set_btn_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_btn_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_btn_s_f.png" "$BK/res/ui/setting/set_btn_s_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_btn_s_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_btn_s_n.png" "$BK/res/ui/setting/set_btn_s_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_btn_s_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_date_n.png" "$BK/res/ui/setting/set_date_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_date_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_date_s.png" "$BK/res/ui/setting/set_date_s.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_date_s.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_factory_btn3_f.png" "$BK/res/ui/setting/set_factory_btn3_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_factory_btn3_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_factory_btn3_n.png" "$BK/res/ui/setting/set_factory_btn3_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_factory_btn3_n.png. Interrompo senza toccare nulla."; exit 1; }
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
"$ADB" -s $IP pull "/res/ui/setting/set_language_btn_f.png" "$BK/res/ui/setting/set_language_btn_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_language_btn_f.png. Interrompo senza toccare nulla."; exit 1; }
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
"$ADB" -s $IP pull "/res/ui/setting/set_time_bg.png" "$BK/res/ui/setting/set_time_bg.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_time_bg.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_time_select_f.png" "$BK/res/ui/setting/set_time_select_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_time_select_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/set_time_select_n.png" "$BK/res/ui/setting/set_time_select_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/set_time_select_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/setfactory_btn1_f.png" "$BK/res/ui/setting/setfactory_btn1_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/setfactory_btn1_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/setfactory_btn1_n.png" "$BK/res/ui/setting/setfactory_btn1_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/setfactory_btn1_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/setfactory_btn2_f.png" "$BK/res/ui/setting/setfactory_btn2_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/setfactory_btn2_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/setfactory_btn2_n.png" "$BK/res/ui/setting/setfactory_btn2_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/setfactory_btn2_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/time_menu_select_f.png" "$BK/res/ui/setting/time_menu_select_f.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/time_menu_select_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/setting/time_menu_select_n.png" "$BK/res/ui/setting/time_menu_select_n.png" >/dev/null || { echo "Backup fallito: /res/ui/setting/time_menu_select_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_back_f.png" "$BK/res/ui/status/home_back_f.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_back_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_back_n.png" "$BK/res/ui/status/home_back_n.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_back_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_bt.png" "$BK/res/ui/status/home_bt.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_bt.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_bt_f.png" "$BK/res/ui/status/home_bt_f.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_bt_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_home_f.png" "$BK/res/ui/status/home_home_f.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_home_f.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/home_home_n.png" "$BK/res/ui/status/home_home_n.png" >/dev/null || { echo "Backup fallito: /res/ui/status/home_home_n.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/sd.png" "$BK/res/ui/status/sd.png" >/dev/null || { echo "Backup fallito: /res/ui/status/sd.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/u.png" "$BK/res/ui/status/u.png" >/dev/null || { echo "Backup fallito: /res/ui/status/u.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/usb1.png" "$BK/res/ui/status/usb1.png" >/dev/null || { echo "Backup fallito: /res/ui/status/usb1.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/status/usb2.png" "$BK/res/ui/status/usb2.png" >/dev/null || { echo "Backup fallito: /res/ui/status/usb2.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_lock_signal_0_teal.png" "$BK/res/ui/wifi/ic_wifi_lock_signal_0_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_lock_signal_0_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_lock_signal_1_teal.png" "$BK/res/ui/wifi/ic_wifi_lock_signal_1_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_lock_signal_1_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_lock_signal_2_teal.png" "$BK/res/ui/wifi/ic_wifi_lock_signal_2_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_lock_signal_2_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_lock_signal_3_teal.png" "$BK/res/ui/wifi/ic_wifi_lock_signal_3_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_lock_signal_3_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_lock_signal_4_teal.png" "$BK/res/ui/wifi/ic_wifi_lock_signal_4_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_lock_signal_4_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_signal_0_teal.png" "$BK/res/ui/wifi/ic_wifi_signal_0_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_signal_0_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_signal_1_teal.png" "$BK/res/ui/wifi/ic_wifi_signal_1_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_signal_1_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_signal_2_teal.png" "$BK/res/ui/wifi/ic_wifi_signal_2_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_signal_2_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_signal_3_teal.png" "$BK/res/ui/wifi/ic_wifi_signal_3_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_signal_3_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/ic_wifi_signal_4_teal.png" "$BK/res/ui/wifi/ic_wifi_signal_4_teal.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/ic_wifi_signal_4_teal.png. Interrompo senza toccare nulla."; exit 1; }
"$ADB" -s $IP pull "/res/ui/wifi/toggle-on.png" "$BK/res/ui/wifi/toggle-on.png" >/dev/null || { echo "Backup fallito: /res/ui/wifi/toggle-on.png. Interrompo senza toccare nulla."; exit 1; }
if [ $SOLO_IMG = 0 ]; then
  "$ADB" -s $IP pull "/res/ui/dash.ftu" "$BK/res/ui/dash.ftu" >/dev/null || { echo "Backup fallito: /res/ui/dash.ftu. Interrompo senza toccare nulla."; exit 1; }
  "$ADB" -s $IP pull "/res/ui/font.ttf" "$BK/res/ui/font.ttf" >/dev/null || { echo "Backup fallito: /res/ui/font.ttf. Interrompo senza toccare nulla."; exit 1; }
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
"$ADB" -s $IP push "res/ui/HomePage/home_menu_select.png" "/res/ui/HomePage/home_menu_select.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_menu_select.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_right_biao.png" "/res/ui/HomePage/home_right_biao.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_right_biao.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_sound_n.png" "/res/ui/HomePage/home_sound_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_sound_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_sound_s.png" "/res/ui/HomePage/home_sound_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_sound_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/home_top_bg.png" "/res/ui/HomePage/home_top_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/home_top_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/za_home_icon_music_n.png" "/res/ui/HomePage/za_home_icon_music_n.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/za_home_icon_music_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/HomePage/za_home_icon_music_s.png" "/res/ui/HomePage/za_home_icon_music_s.png" >/dev/null || { echo "Invio fallito: /res/ui/HomePage/za_home_icon_music_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_btn_f.png" "/res/ui/MusicPlayer/file_btn_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_btn_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_btn_n.png" "/res/ui/MusicPlayer/file_btn_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_btn_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_choice.png" "/res/ui/MusicPlayer/file_choice.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_choice.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_local_n.png" "/res/ui/MusicPlayer/file_local_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_local_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_local_s.png" "/res/ui/MusicPlayer/file_local_s.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_local_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_music.png" "/res/ui/MusicPlayer/file_music.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_music.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_music_f.png" "/res/ui/MusicPlayer/file_music_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_music_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_usbr_n.png" "/res/ui/MusicPlayer/file_usbr_n.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_usbr_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/file_usbr_s.png" "/res/ui/MusicPlayer/file_usbr_s.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/file_usbr_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_albunm.png" "/res/ui/MusicPlayer/music_albunm.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_albunm.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_artist.png" "/res/ui/MusicPlayer/music_artist.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_artist.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/music_base_bg.png" "/res/ui/MusicPlayer/music_base_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/music_base_bg.png"; ERR=1; }
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
"$ADB" -s $IP push "res/ui/MusicPlayer/video_btn_screen_f.png" "/res/ui/MusicPlayer/video_btn_screen_f.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/video_btn_screen_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/video_slide.png" "/res/ui/MusicPlayer/video_slide.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/video_slide.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/MusicPlayer/video_slide_btn.png" "/res/ui/MusicPlayer/video_slide_btn.png" >/dev/null || { echo "Invio fallito: /res/ui/MusicPlayer/video_slide_btn.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/aircontrol/ac_on.png" "/res/ui/aircontrol/ac_on.png" >/dev/null || { echo "Invio fallito: /res/ui/aircontrol/ac_on.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/aircontrol/airinfobg.png" "/res/ui/aircontrol/airinfobg.png" >/dev/null || { echo "Invio fallito: /res/ui/aircontrol/airinfobg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/aircontrol/line.png" "/res/ui/aircontrol/line.png" >/dev/null || { echo "Invio fallito: /res/ui/aircontrol/line.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/back/set_ic_common_f.png" "/res/ui/back/set_ic_common_f.png" >/dev/null || { echo "Invio fallito: /res/ui/back/set_ic_common_f.png"; ERR=1; }
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
"$ADB" -s $IP push "res/ui/bt/bt_btn1_f.png" "/res/ui/bt/bt_btn1_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_btn1_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_btn1_n.png" "/res/ui/bt/bt_btn1_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_btn1_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_btn2_f.png" "/res/ui/bt/bt_btn2_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_btn2_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_btn2_n.png" "/res/ui/bt/bt_btn2_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_btn2_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_btn_off.png" "/res/ui/bt/bt_btn_off.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_btn_off.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn1_f.png" "/res/ui/bt/bt_call_btn1_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn1_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn1_n.png" "/res/ui/bt/bt_call_btn1_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn1_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn2_f.png" "/res/ui/bt/bt_call_btn2_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn2_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btn2_n.png" "/res/ui/bt/bt_call_btn2_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btn2_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_btnbg.png" "/res/ui/bt/bt_call_btnbg.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_btnbg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_callin_f.png" "/res/ui/bt/bt_call_callin_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_callin_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_callin_n.png" "/res/ui/bt/bt_call_callin_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_callin_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_callmiss_f.png" "/res/ui/bt/bt_call_callmiss_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_callmiss_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_callout_f.png" "/res/ui/bt/bt_call_callout_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_callout_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_keykeyboard_f.png" "/res/ui/bt/bt_call_keykeyboard_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_keykeyboard_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_keykeyboard_n.png" "/res/ui/bt/bt_call_keykeyboard_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_keykeyboard_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_voice_f.png" "/res/ui/bt/bt_call_voice_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_voice_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_call_voice_n.png" "/res/ui/bt/bt_call_voice_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_call_voice_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_choice.png" "/res/ui/bt/bt_choice.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_choice.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_download_f.png" "/res/ui/bt/bt_contacts_download_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_download_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_download_n.png" "/res/ui/bt/bt_contacts_download_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_download_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_f.png" "/res/ui/bt/bt_contacts_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_contacts_n.png" "/res/ui/bt/bt_contacts_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_contacts_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_dail_f.png" "/res/ui/bt/bt_dail_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_dail_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_dail_n.png" "/res/ui/bt/bt_dail_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_dail_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_hang_up_f.png" "/res/ui/bt/bt_hang_up_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_hang_up_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_hang_up_n.png" "/res/ui/bt/bt_hang_up_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_hang_up_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_icon.png" "/res/ui/bt/bt_icon.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_icon.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_keyboard_f.png" "/res/ui/bt/bt_keyboard_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_keyboard_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_load0.png" "/res/ui/bt/bt_load0.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_load0.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_music.png" "/res/ui/bt/bt_music.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_music.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_music_f.png" "/res/ui/bt/bt_music_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_music_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_music_n.png" "/res/ui/bt/bt_music_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_music_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_record_f.png" "/res/ui/bt/bt_record_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_record_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_record_n.png" "/res/ui/bt/bt_record_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_record_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_refresh_s.png" "/res/ui/bt/bt_refresh_s.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_refresh_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_call_callin.png" "/res/ui/bt/bt_s_call_callin.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_call_callin.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_call_callmiss.png" "/res/ui/bt/bt_s_call_callmiss.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_call_callmiss.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_call_callout.png" "/res/ui/bt/bt_s_call_callout.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_call_callout.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_s_contacts.png" "/res/ui/bt/bt_s_contacts.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_s_contacts.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_connect_f.png" "/res/ui/bt/bt_set_connect_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_connect_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_delete_f.png" "/res/ui/bt/bt_set_delete_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_delete_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_f.png" "/res/ui/bt/bt_set_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_n.png" "/res/ui/bt/bt_set_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_set_unconnect_f.png" "/res/ui/bt/bt_set_unconnect_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_set_unconnect_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_next_n.png" "/res/ui/bt/bt_tmusic_next_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_next_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_pause_n.png" "/res/ui/bt/bt_tmusic_pause_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_pause_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_play_n.png" "/res/ui/bt/bt_tmusic_play_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_play_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_tmusic_previous_n.png" "/res/ui/bt/bt_tmusic_previous_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_tmusic_previous_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/bt_update_f.png" "/res/ui/bt/bt_update_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/bt_update_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/btcall_update_f.png" "/res/ui/bt/btcall_update_f.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/btcall_update_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/btcall_update_n.png" "/res/ui/bt/btcall_update_n.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/btcall_update_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/find_p.png" "/res/ui/bt/find_p.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/find_p.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/head.png" "/res/ui/bt/head.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/head.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/set_fullscreen_bg.png" "/res/ui/bt/set_fullscreen_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/set_fullscreen_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/bt/za_btmusic_defaultcover.png" "/res/ui/bt/za_btmusic_defaultcover.png" >/dev/null || { echo "Invio fallito: /res/ui/bt/za_btmusic_defaultcover.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_bg.png" "/res/ui/car/car_adjust_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_down_f.png" "/res/ui/car/car_adjust_down_f.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_down_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_down_n.png" "/res/ui/car/car_adjust_down_n.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_down_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_left_f.png" "/res/ui/car/car_adjust_left_f.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_left_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_left_n.png" "/res/ui/car/car_adjust_left_n.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_left_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_ok_f.png" "/res/ui/car/car_adjust_ok_f.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_ok_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_ok_n.png" "/res/ui/car/car_adjust_ok_n.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_ok_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_right_f.png" "/res/ui/car/car_adjust_right_f.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_right_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_right_n.png" "/res/ui/car/car_adjust_right_n.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_right_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_up_f.png" "/res/ui/car/car_adjust_up_f.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_up_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_adjust_up_n.png" "/res/ui/car/car_adjust_up_n.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_adjust_up_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_close.png" "/res/ui/car/car_close.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_close.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_list_bg.png" "/res/ui/car/car_list_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_list_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/car/car_open.png" "/res/ui/car/car_open.png" >/dev/null || { echo "Invio fallito: /res/ui/car/car_open.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/dash_bg_china.png" "/res/ui/dash/dash_bg_china.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/dash_bg_china.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/dash_bg_english.png" "/res/ui/dash/dash_bg_english.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/dash_bg_english.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/press_bg_blue.png" "/res/ui/dash/press_bg_blue.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/press_bg_blue.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/press_bg_red.png" "/res/ui/dash/press_bg_red.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/press_bg_red.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/dash/press_bg_yellow.png" "/res/ui/dash/press_bg_yellow.png" >/dev/null || { echo "Invio fallito: /res/ui/dash/press_bg_yellow.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/link/incom_remind.png" "/res/ui/link/incom_remind.png" >/dev/null || { echo "Invio fallito: /res/ui/link/incom_remind.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/file_vedio_f.png" "/res/ui/media/file_vedio_f.png" >/dev/null || { echo "Invio fallito: /res/ui/media/file_vedio_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/musicBtn.png" "/res/ui/media/musicBtn.png" >/dev/null || { echo "Invio fallito: /res/ui/media/musicBtn.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/musicBtnP.png" "/res/ui/media/musicBtnP.png" >/dev/null || { echo "Invio fallito: /res/ui/media/musicBtnP.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/music_btn_list_f.png" "/res/ui/media/music_btn_list_f.png" >/dev/null || { echo "Invio fallito: /res/ui/media/music_btn_list_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/vedio_btn_bg.png" "/res/ui/media/vedio_btn_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/media/vedio_btn_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/video_btn_next_f.png" "/res/ui/media/video_btn_next_f.png" >/dev/null || { echo "Invio fallito: /res/ui/media/video_btn_next_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/video_btn_previous_f.png" "/res/ui/media/video_btn_previous_f.png" >/dev/null || { echo "Invio fallito: /res/ui/media/video_btn_previous_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/media/video_load.png" "/res/ui/media/video_load.png" >/dev/null || { echo "Invio fallito: /res/ui/media/video_load.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/language_confir_select.png" "/res/ui/setting/language_confir_select.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/language_confir_select.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/language_menu_select_f.png" "/res/ui/setting/language_menu_select_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/language_menu_select_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/language_menu_select_n.png" "/res/ui/setting/language_menu_select_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/language_menu_select_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/off.png" "/res/ui/setting/off.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/off.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/on.png" "/res/ui/setting/on.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/on.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/ota_bg.png" "/res/ui/setting/ota_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/ota_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/popwbag.png" "/res/ui/setting/popwbag.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/popwbag.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust.png" "/res/ui/setting/set_adjust.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust_934.png" "/res/ui/setting/set_adjust_934.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust_934.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust_bg.png" "/res/ui/setting/set_adjust_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_adjust_click.png" "/res/ui/setting/set_adjust_click.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_adjust_click.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_audio_n.png" "/res/ui/setting/set_audio_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_audio_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_audio_s.png" "/res/ui/setting/set_audio_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_audio_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_back_n.png" "/res/ui/setting/set_back_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_back_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_back_s.png" "/res/ui/setting/set_back_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_back_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_base_bg.png" "/res/ui/setting/set_base_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_base_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_btn_f.png" "/res/ui/setting/set_btn_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_btn_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_btn_n.png" "/res/ui/setting/set_btn_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_btn_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_btn_s_f.png" "/res/ui/setting/set_btn_s_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_btn_s_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_btn_s_n.png" "/res/ui/setting/set_btn_s_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_btn_s_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_date_n.png" "/res/ui/setting/set_date_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_date_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_date_s.png" "/res/ui/setting/set_date_s.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_date_s.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_factory_btn3_f.png" "/res/ui/setting/set_factory_btn3_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_factory_btn3_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_factory_btn3_n.png" "/res/ui/setting/set_factory_btn3_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_factory_btn3_n.png"; ERR=1; }
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
"$ADB" -s $IP push "res/ui/setting/set_language_btn_f.png" "/res/ui/setting/set_language_btn_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_language_btn_f.png"; ERR=1; }
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
"$ADB" -s $IP push "res/ui/setting/set_time_bg.png" "/res/ui/setting/set_time_bg.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_time_bg.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_time_select_f.png" "/res/ui/setting/set_time_select_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_time_select_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/set_time_select_n.png" "/res/ui/setting/set_time_select_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/set_time_select_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/setfactory_btn1_f.png" "/res/ui/setting/setfactory_btn1_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/setfactory_btn1_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/setfactory_btn1_n.png" "/res/ui/setting/setfactory_btn1_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/setfactory_btn1_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/setfactory_btn2_f.png" "/res/ui/setting/setfactory_btn2_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/setfactory_btn2_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/setfactory_btn2_n.png" "/res/ui/setting/setfactory_btn2_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/setfactory_btn2_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/time_menu_select_f.png" "/res/ui/setting/time_menu_select_f.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/time_menu_select_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/setting/time_menu_select_n.png" "/res/ui/setting/time_menu_select_n.png" >/dev/null || { echo "Invio fallito: /res/ui/setting/time_menu_select_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_back_f.png" "/res/ui/status/home_back_f.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_back_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_back_n.png" "/res/ui/status/home_back_n.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_back_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_bt.png" "/res/ui/status/home_bt.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_bt.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_bt_f.png" "/res/ui/status/home_bt_f.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_bt_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_home_f.png" "/res/ui/status/home_home_f.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_home_f.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/home_home_n.png" "/res/ui/status/home_home_n.png" >/dev/null || { echo "Invio fallito: /res/ui/status/home_home_n.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/sd.png" "/res/ui/status/sd.png" >/dev/null || { echo "Invio fallito: /res/ui/status/sd.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/u.png" "/res/ui/status/u.png" >/dev/null || { echo "Invio fallito: /res/ui/status/u.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/usb1.png" "/res/ui/status/usb1.png" >/dev/null || { echo "Invio fallito: /res/ui/status/usb1.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/status/usb2.png" "/res/ui/status/usb2.png" >/dev/null || { echo "Invio fallito: /res/ui/status/usb2.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_lock_signal_0_teal.png" "/res/ui/wifi/ic_wifi_lock_signal_0_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_lock_signal_0_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_lock_signal_1_teal.png" "/res/ui/wifi/ic_wifi_lock_signal_1_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_lock_signal_1_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_lock_signal_2_teal.png" "/res/ui/wifi/ic_wifi_lock_signal_2_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_lock_signal_2_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_lock_signal_3_teal.png" "/res/ui/wifi/ic_wifi_lock_signal_3_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_lock_signal_3_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_lock_signal_4_teal.png" "/res/ui/wifi/ic_wifi_lock_signal_4_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_lock_signal_4_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_signal_0_teal.png" "/res/ui/wifi/ic_wifi_signal_0_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_signal_0_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_signal_1_teal.png" "/res/ui/wifi/ic_wifi_signal_1_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_signal_1_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_signal_2_teal.png" "/res/ui/wifi/ic_wifi_signal_2_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_signal_2_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_signal_3_teal.png" "/res/ui/wifi/ic_wifi_signal_3_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_signal_3_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/ic_wifi_signal_4_teal.png" "/res/ui/wifi/ic_wifi_signal_4_teal.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/ic_wifi_signal_4_teal.png"; ERR=1; }
"$ADB" -s $IP push "res/ui/wifi/toggle-on.png" "/res/ui/wifi/toggle-on.png" >/dev/null || { echo "Invio fallito: /res/ui/wifi/toggle-on.png"; ERR=1; }
if [ $SOLO_IMG = 0 ]; then
  echo "=== 3. invio: layout e font ==="
  "$ADB" -s $IP push "res/ui/dash.ftu" "/res/ui/dash.ftu" >/dev/null || { echo "Invio fallito: /res/ui/dash.ftu"; ERR=1; }
  "$ADB" -s $IP push "$FONT_SRC" "/res/ui/font.ttf" >/dev/null || { echo "Invio fallito: /res/ui/font.ttf"; ERR=1; }
fi
"$ADB" -s $IP shell sync >/dev/null 2>&1 || true
if [ $ERR = 1 ]; then echo "Qualcosa non è andato: rimetti gli originali con  bash ripristina.sh $BK"; exit 1; fi
echo "Fatto. Backup in: $BK"
read -r -p "Riavviare ora il display? [s/N] " R
[ "$R" = "s" ] || [ "$R" = "S" ] && "$ADB" -s $IP reboot
exit 0
