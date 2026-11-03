"""Font del display: sostituisce i caratteri latini del font di sistema (Gen Shin Gothic Monospace, che resta per
cinese, giapponese, coreano, arabo...) con Inter Display (licenza SIL OFL 1.1), un sans moderno e pulito.

Il display usa un solo file, /res/ui/font.ttf (vedi res/etc/EasyUI.cfg). Qui si cambiano solo i contorni e le
larghezze dei glifi latini; tabelle, nomi, metriche verticali e tutti gli altri glifi restano quelli originali.

Uso: python3 -I font_merge.py <backup/res/ui/font.ttf> <Inter-Display.otf> <uscita font.ttf>"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen

src_base, src_latin, out = sys.argv[1:4]
base = TTFont(src_base)
lat = TTFont(src_latin)
k = base['head'].unitsPerEm / lat['head'].unitsPerEm
bcm, lcm, gs = base.getBestCmap(), lat.getBestCmap(), lat.getGlyphSet()

cps = list(range(0x20, 0x7F)) + list(range(0xA0, 0x180)) + [0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2026, 0x20AC, 0x2122, 0x2039, 0x203A]
done, skipped = 0, []
seen = set()
for cp in cps:
    if cp not in bcm or cp not in lcm:
        skipped.append(hex(cp)); continue
    gname, sname = bcm[cp], lcm[cp]
    if gname in seen: continue
    seen.add(gname)
    pen = TTGlyphPen(None)
    gs[sname].draw(TransformPen(Cu2QuPen(pen, max_err=0.5, reverse_direction=True), (k, 0, 0, k, 0, 0)))
    g = pen.glyph()
    g.recalcBounds(base['glyf'])
    base['glyf'][gname] = g
    adv = round(gs[sname].width * k)
    base['hmtx'][gname] = (adv, g.xMin if g.numberOfContours else 0)
    done += 1

base['post'].isFixedPitch = 0           # non è più a spaziatura fissa
base['OS/2'].panose.bProportion = 0
base.save(out)
print(f'{done} glifi latini sostituiti (fattore {k}); mancanti nell\'uno o nell\'altro font: {len(skipped)}')
