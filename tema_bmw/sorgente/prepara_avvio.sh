#!/bin/bash
# Video di avvio 1920×720 per il display (H.264 Main, 24 fps, AAC) + immagine finale per un eventuale logo di avvio statico.
# Uso: bash prepara_avvio.sh <video.mp4>
set -e
IN="$1"; D="$(cd "$(dirname "$0")/.." && pwd)/avvio"; mkdir -p "$D"
# scala all'altezza dello schermo, centra su nero, schiaccia i neri quasi-neri (puliti al 100% sul pannello)
ffmpeg -v error -y -i "$IN" -vf "scale=-2:720:flags=lanczos,pad=1920:720:(ow-iw)/2:0:black,colorlevels=rimin=0.02:gimin=0.02:bimin=0.02,format=yuv420p" \
  -c:v libx264 -profile:v main -level 4.0 -preset slow -crf 18 -r 24 -c:a aac -b:a 128k -movflags +faststart "$D/avvio_1920x720.mp4"
ffmpeg -v error -y -sseof -0.05 -i "$D/avvio_1920x720.mp4" -frames:v 1 "$D/logo_avvio_1920x720.png"
python3 -I -c "from PIL import Image; Image.open('$D/logo_avvio_1920x720.png').convert('RGB').save('$D/logo_avvio_1920x720.bmp')"
mkdir -p "$D/../../simulatore/tema" && cp "$D/avvio_1920x720.mp4" "$D/../../simulatore/tema/avvio.mp4"
echo "ok: $D"
