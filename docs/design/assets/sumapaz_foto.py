"""Hero de BogDev a partir de una foto del PNN Sumapaz: versión Día (natural, cálida) y Noche (luz de luna)."""
import sys
import numpy as np
from PIL import Image, ImageFilter
SRC = sys.argv[1]; OUT = sys.argv[2]
W, H = 1520, 1440
def hx(c): return np.array([int(c[i:i + 2], 16) for i in (1, 3, 5)], float)
src = Image.open(SRC).convert('RGB')
pw = 1860; ph = round(src.size[1] * pw / src.size[0])
photo = np.asarray(src.resize((pw, ph), Image.LANCZOS)).astype(float)
x0 = pw - W - 20; top = H - ph
Y, X = np.mgrid[0:H, 0:W]
# cielo: prolonga hacia arriba el color del cielo de la foto
skyc = photo[:12, x0:x0 + W].mean(axis=(0, 1))
base = np.broadcast_to(skyc, (H, W, 3)).copy()
base[top:] = photo[:, x0:x0 + W]
blend = np.clip((Y - top) / 60, 0, 1)[:, :, None]
base = skyc * (1 - blend) + base * blend
lum = (base @ np.array([.299, .587, .114]))[:, :, None]
rng = np.random.default_rng(4)
def fade(arr, surf):
    fx = np.clip((X - 200) / 520, 0, 1) ** 1.3
    al = (fx * np.clip(Y / 170, 0, 1) * np.clip((H - Y) / 170, 0, 1))[:, :, None]
    return surf * (1 - al) + arr * al
dia = np.clip((base * np.array([1.03, 1.0, .96]) - 128) * 1.06 + 131, 0, 255)
# noche: exposición baja, casi sin saturación y tinte azul de luna
sky = np.clip((lum - 170) / 50, 0, 1) * np.clip((top + 330 - Y) / 200, 0, 1)[:, :, None]
n = (lum * .7 + base * .3) * np.array([.55, .66, .92]) * .62
skycol = np.array([10, 16, 32.]) + np.clip(Y / (top + 330), 0, 1)[:, :, None] * np.array([22, 32, 52.])
n = n * (1 - sky) + skycol * sky
cx, cy = 1210, 190
d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)[:, :, None]
n = n + np.exp(-d / 170) * np.array([60, 70, 90.]) * .8
n = np.where(d < 30, np.array([232, 236, 242.]), n)
st = (rng.random((H, W)) > .9994) & (sky[:, :, 0] > .7) & (d[:, :, 0] > 60)
n[st] = [225, 230, 240]
water = np.clip((Y - (top + ph * .62)) / 60, 0, 1)[:, :, None]
n = n + water * np.clip(lum - 70, 0, 90) / 90 * np.array([18, 26, 42.])
for name, arr, surf in (('dia', dia, '#f3e9df'), ('noche', n, '#0a0c10')):
    v = fade(arr, hx(surf)) + rng.normal(0, 2.2, (H, W, 3))
    Image.fromarray(np.clip(v, 0, 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(2, 50, 2)).save(OUT + 'sumapaz-foto-%s.jpg' % name, quality=85, optimize=True, progressive=True)
print('ok', top)
