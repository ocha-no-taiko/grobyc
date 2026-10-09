"""ロゴ用フォント（CYBORG by weknow）から、ロゴに使う文字だけを SVG パスとして書き出す。

フォントファイル自体は再配布しないため、リポジトリには含めていない。
使い方:  pip install fonttools
         python3 tools/make-glyphs.py CYBORG.otf
→ assets/glyphs.js を上書きする。
"""
import json
import sys
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

LETTERS = "CYBORG"  # GROBYC はこの6文字の並べ替え

font = TTFont(sys.argv[1])
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
cap = font["OS/2"].sCapHeight

data = {"capHeight": cap, "glyphs": {}}
for ch in LETTERS:
    name = cmap[ord(ch)]
    pen = SVGPathPen(glyph_set, ntos=lambda v: "%.0f" % v)
    # y を反転し、キャップハイトの上端を 0 にそろえる
    glyph_set[name].draw(TransformPen(pen, (1, 0, 0, -1, 0, cap)))
    data["glyphs"][ch] = {"adv": font["hmtx"][name][0], "d": pen.getCommands()}

out = Path(__file__).resolve().parent.parent / "assets" / "glyphs.js"
out.write_text(
    "// tools/make-glyphs.py で生成（フォント: CYBORG by weknow / dafont.com）\n"
    f"window.GROBYC_GLYPHS = {json.dumps(data, separators=(',', ':'))};\n"
)
print(f"wrote {out}")
