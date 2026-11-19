#!/usr/bin/env python3
"""
Genera la miniatura per a compartir (1200x630) amb el mapa de la província i
els centres com a punts, amb l'estil CGT Castelló.

    python3 miniatura/fer_miniatura.py

Crea miniatura/miniatura.svg (fonts i logo incrustats). Per a passar-la a PNG,
obri miniatura/a_png.html en un navegador (servit des de l'arrel del repositori).
"""
import base64
import json
import math
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
W, H, MARGE = 1200, 630, 56
ROIG, NEGRE, GROC, BLANC, GRIS = "#e42127", "#111111", "#e9e84c", "#ffffff", "#5f5e59"

# --- dades ---
centres = json.loads((RAIZ / "docs/data/centres.json").read_text(encoding="utf-8"))["centres"]
geo = json.loads((RAIZ / "miniatura/castello.geojson").read_text(encoding="utf-8"))

# --- projecció (equirectangular corregida per la latitud) ---
anells = []
for f in geo["features"]:
    g = f["geometry"]
    polis = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    for p in polis:
        if min(x for x, _ in p[0]) > 0.55:  # deixa fora les Columbretes (lluny de la costa)
            continue
        anells.append(p[0])
lons = [x for a in anells for x, _ in a]
lats = [y for a in anells for _, y in a]
k = math.cos(math.radians((min(lats) + max(lats)) / 2))
caixa = (600, 30, W - MARGE, H - MARGE - 76 - 16)  # x0, y0, x1, y1 on va el mapa
ample, alt = (max(lons) - min(lons)) * k, max(lats) - min(lats)
esc = min((caixa[2] - caixa[0]) / ample, (caixa[3] - caixa[1]) / alt)
ox = caixa[0] + ((caixa[2] - caixa[0]) - ample * esc) / 2
oy = caixa[1] + ((caixa[3] - caixa[1]) - alt * esc) / 2


def pr(lon, lat):
    return ox + (lon - min(lons)) * k * esc, oy + (max(lats) - lat) * esc


camins = []
for a in anells:
    pts = [pr(x, y) for x, y in a]
    camins.append("M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z")

ordre = {"Privat no concertat": 0, "Privat concertat": 1, "Públic": 2}
punts = []
for c in sorted(centres, key=lambda c: ordre.get(c["regim"], 0)):
    if not c.get("lat"):
        continue
    x, y = pr(c["lng"], c["lat"])
    if c["regim"] == "Públic":
        punts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="{ROIG}" stroke="{BLANC}" stroke-width="1.2"/>')
    elif c["regim"] == "Privat concertat":
        punts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="{NEGRE}" stroke="{BLANC}" stroke-width="1.2"/>')
    else:
        punts.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4.2" fill="{BLANC}" stroke="{NEGRE}" stroke-width="1.8"/>')

# --- recursos incrustats ---
b64 = lambda p: base64.b64encode((RAIZ / p).read_bytes()).decode()
anton, osb, osx = b64("docs/assets/fonts/Anton-Regular.ttf"), b64("docs/assets/fonts/OpenSans-Bold.ttf"), b64("docs/assets/fonts/OpenSans-ExtraBold.ttf")
logo = b64("docs/assets/cgt-castello-color.png")
logo_h = 64
logo_w = logo_h * 1077 / 637

n = len(centres)
y_filet = H - MARGE - 76

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs><style>
@font-face {{ font-family: "Anton"; src: url(data:font/ttf;base64,{anton}) format("truetype"); }}
@font-face {{ font-family: "OS"; font-weight: 700; src: url(data:font/ttf;base64,{osb}) format("truetype"); }}
@font-face {{ font-family: "OS"; font-weight: 800; src: url(data:font/ttf;base64,{osx}) format("truetype"); }}
.a {{ font-family: Anton; text-transform: uppercase; }}
.o {{ font-family: OS; }}
</style></defs>
<rect width="{W}" height="{H}" fill="{BLANC}"/>

<!-- Mapa -->
<path d="{' '.join(camins)}" fill="{BLANC}" stroke="{NEGRE}" stroke-width="3" stroke-linejoin="round"/>
{''.join(punts)}

<!-- Etiqueta -->
<rect x="{MARGE}" y="{MARGE}" width="292" height="54" fill="{GROC}"/>
<text class="a" x="{MARGE + 18}" y="{MARGE + 41}" font-size="36" letter-spacing="1" fill="{NEGRE}">MAPA DE CENTRES</text>

<!-- Kicker -->
<text class="o" x="{MARGE}" y="{MARGE + 104}" font-size="19" font-weight="800" letter-spacing="2.6" fill="{GRIS}">CGT CASTELLÓ · ENSENYAMENT</text>

<!-- Titular -->
<text class="a" font-size="78" fill="{NEGRE}">
  <tspan x="{MARGE}" y="{MARGE + 186}">CENTRES</tspan>
  <tspan x="{MARGE}" y="{MARGE + 262}">EDUCATIUS DE</tspan>
  <tspan x="{MARGE}" y="{MARGE + 338}" fill="{ROIG}">CASTELLÓ</tspan>
</text>

<!-- Cos -->
<text class="o" font-size="24" font-weight="700" fill="{NEGRE}">
  <tspan x="{MARGE}" y="{MARGE + 386}">Totes les dades dels {n} centres,</tspan>
  <tspan x="{MARGE}" y="{MARGE + 418}">en un sol mapa.</tspan>
</text>

<!-- Peu -->
<rect x="{MARGE}" y="{y_filet}" width="{W - 2 * MARGE}" height="4" fill="{NEGRE}"/>
<text class="a" x="{MARGE}" y="{H - MARGE + 2}" font-size="38" letter-spacing="0.8" fill="{NEGRE}">CGTCASTELLO.ORG</text>
<image x="{W - MARGE - logo_w:.1f}" y="{H - MARGE - logo_h + 6}" width="{logo_w:.1f}" height="{logo_h}" xlink:href="data:image/png;base64,{logo}"/>
</svg>'''

(RAIZ / "miniatura/miniatura.svg").write_text(svg, encoding="utf-8")
print("miniatura/miniatura.svg", len(svg) // 1024, "KB ·", n, "centres")
