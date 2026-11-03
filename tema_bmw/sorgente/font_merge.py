"""Font del display: sostituisce i caratteri latini del font di sistema (Gen Shin Gothic Monospace, che resta per
cinese, giapponese, coreano, arabo...) con Inter Display (licenza SIL OFL 1.1), un sans moderno e pulito.

Il display usa un solo file, /res/ui/font.ttf (vedi res/etc/EasyUI.cfg). Qui si cambiano solo i contorni e le
larghezze dei glifi latini; tabelle, nomi, metriche verticali e tutti gli altri glifi restano quelli originali.

Uso: python3 -I font_merge.py <backup/res/ui/font.ttf> <font latino.ttf/.otf> <uscita font.ttf> [font di riserva.otf]
Il font di riserva (es. Inter, SIL OFL) fornisce i caratteri che il font principale non ha (es. il segno ° ).
Le maiuscole di ogni font sono portate alla stessa altezza del font di sistema."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import DecomposingRecordingPen

src_base, src_latin, out = sys.argv[1:4]
src_fb = sys.argv[4] if len(sys.argv) > 4 else None
base = TTFont(src_base)
lat = TTFont(src_latin)
def cap_of(font):
    os2 = font['OS/2']; c = getattr(os2, 'sCapHeight', 0)
    if c: return c
    gs = font.getGlyphSet(); from fontTools.pens.boundsPen import BoundsPen
    bp = BoundsPen(gs); gs[font.getBestCmap()[ord('H')]].draw(bp); return bp.bounds[3]
base_cap = cap_of(base)
def prep(path):
    ft = TTFont(path); k = base_cap / cap_of(ft)
    return ft, ft.getBestCmap(), ft.getGlyphSet(), k
lat, lcm, gs, k = prep(src_latin)
fb = prep(src_fb) if src_fb else None
bcm = base.getBestCmap()

cps = list(range(0x20, 0x7F)) + list(range(0xA0, 0x180)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC, 0x2122, 0x2039, 0x203A]
done, fell, skipped = 0, [], []
seen = set()
for cp in cps:
    if cp not in bcm: skipped.append(hex(cp)); continue
    if cp in lcm: _, cm_, gset, kk = lat, lcm, gs, k
    elif fb and cp in fb[1]: _, cm_, gset, kk = fb; fell.append(chr(cp))
    else: skipped.append(hex(cp)); continue
    gname, sname = bcm[cp], cm_[cp]
    if gname in seen: continue
    seen.add(gname)
    pen = TTGlyphPen(None)
    rp = DecomposingRecordingPen(gset); gset[sname].draw(rp)      # scompone gli accenti (glifi composti)
    rp.replay(TransformPen(Cu2QuPen(pen, max_err=0.5, reverse_direction=True), (kk, 0, 0, kk, 0, 0)))
    g = pen.glyph(); g.recalcBounds(base['glyf'])
    base['glyf'][gname] = g
    base['hmtx'][gname] = (round(gset[sname].width * kk), g.xMin if g.numberOfContours else 0)
    done += 1

base['post'].isFixedPitch = 0           # non è più a spaziatura fissa
base['OS/2'].panose.bProportion = 0
base.save(out)
print(f'{done} glifi latini sostituiti; dal font di riserva: {"".join(fell) or "-"}; non sostituiti: {len(skipped)}')
