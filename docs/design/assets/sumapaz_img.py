"""Ilustración pictórica del Páramo de Sumapaz (noche y día) para el hero de BogDev."""
import math, random, sys, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H = 1520, 1440
SS = 2  # supersampling para la vegetación
OUT = '/tmp/claude-0/-home-claude/2e07cd47-49f4-5a31-ae27-098fd44a11c5/scratchpad/sumapaz/'

def hex2(c): c = c.lstrip('#'); return np.array([int(c[i:i + 2], 16) for i in (0, 2, 4)], float)
def mix(a, b, t): return a * (1 - t) + b * t
def rgb(v, a=255): return tuple(int(max(0, min(255, x))) for x in v) + (a,)

def ridge(seed, base, amp, rough=0.45, octaves=5, f0=1.1):
    rnd = random.Random(seed)
    xs = np.linspace(0, 1, W)
    y = np.zeros(W); a, f = 1.0, f0
    for _ in range(octaves):
        ph = rnd.random() * 10
        y += a * np.sin(xs * f * math.tau + ph)
        a *= rough; f *= 2.1
    y = (y - y.min()) / (y.max() - y.min())
    return base - y * amp

PAL = {
    'noche': dict(surface='#0a0c10', sky_top='#060912', sky_hor='#1c2a42', fog='#4a5a73', far='#2b3a52',
                  near='#0d1117', water='#304462', grass='#1a2230', grass_hi='#3b4a5e', leaf='#7e8c94',
                  leaf_hi='#d5dde0', trunk='#2a2620', trunk_hi='#4a4238', flower='#caa23a', moon=True),
    'dia': dict(surface='#f3e9df', sky_top='#e6d9cb', sky_hor='#f7f0e8', fog='#f6efe7', far='#b8aa9d',
                near='#6f6553', water='#c9d3d2', grass='#9c8b5a', grass_hi='#c8b27a', leaf='#8f9c86',
                leaf_hi='#eef1e4', trunk='#5b4a38', trunk_hi='#8a7258', flower='#e3a600', moon=False),
}

def render(name):
    P = {k: (hex2(v) if isinstance(v, str) else v) for k, v in PAL[name].items()}
    night = P['moon']
    Y, X = np.mgrid[0:H, 0:W]
    t = (np.clip(Y / (H * .6), 0, 1) ** 1.25)[:, :, None]
    img = mix(P['sky_top'], P['sky_hor'], t)

    rnd = random.Random(42)
    if night:
        for _ in range(520):
            x, y = rnd.randrange(W), rnd.randrange(int(H * .45))
            img[y, x] = mix(img[y, x], np.array([235, 238, 245.]), rnd.random() ** 3)
        cx, cy, r = 1190, 250, 34
    else:
        cx, cy, r = 1160, 280, 0
    d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    img = mix(img, np.array([196, 208, 232.]) if night else np.array([255, 247, 228.]), (np.exp(-d / (150 if night else 300)) * (.35 if night else .6))[:, :, None])
    if night:
        img = mix(img, np.array([236, 238, 242.]), np.clip((r - d) / 1.5, 0, 1)[:, :, None])

    layers = [(11, 700, 170, .0, .42), (23, 770, 150, .25, .44), (37, 850, 120, .5, .46), (51, 930, 90, .72, .48)]
    for i, (seed, base, amp, tt, rough) in enumerate(layers):
        prof = ridge(seed, base, amp, rough=rough)
        col = mix(P['far'], P['near'], tt * .8)
        m = (Y >= prof[None, :])[:, :, None]
        depth = np.clip((Y - prof[None, :]) / 300, 0, 1)[:, :, None]
        sm = np.convolve(np.gradient(prof), np.ones(61) / 61, mode='same')
        lit = np.clip(-sm[None, :] * 1.6 + 0.5, 0, 1)[:, :, None]
        shade = mix(col * (0.9 if night else 0.95), col * (1.12 if night else 1.05), lit) * (1 - depth * .12)
        img = np.where(m, shade, img)
        fog = np.exp(-np.abs(Y - (base + 18)) / 42.0) * (0.6 - i * 0.1)
        img = mix(img, P['fog'], np.clip(fog, 0, 1)[:, :, None])

    # laguna de orillas irregulares en el valle
    rng = np.random.default_rng(1)
    ang = np.arctan2((Y - 1000) / 40.0, (X - 1000) / 300.0)
    wob = 1 + .12 * np.sin(ang * 3 + 1) + .07 * np.sin(ang * 7 + 2)
    lag = (((X - 1000) / 300.0) ** 2 + ((Y - 1000) / 40.0) ** 2) < wob ** 2
    lag &= Y > 978
    streak = (np.sin(Y * 1.1 + np.sin(X * .015) * 2.5) * .5 + .5) * .1
    water = mix(P['water'], P['sky_hor'], .3)[None, None, :] * (1 - streak[:, :, None])
    img = np.where(lag[:, :, None], water, img)
    if night:
        refl = np.exp(-np.abs(X - cx) / 14.0) * lag * (np.sin(Y * 2.1) * .3 + .7)
        img = mix(img, np.array([215, 224, 240.]), (refl * .45)[:, :, None])

    ground = ridge(91, 1090, 50, rough=.4, octaves=4)
    gm = (Y >= ground[None, :])[:, :, None]
    gshade = mix(P['grass'], P['grass'] * .6, np.clip((Y - 1090) / 400, 0, 1)[:, :, None])
    img = np.where(gm, gshade, img)

    base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))

    # vegetación en supersampling
    V = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
    dr = ImageDraw.Draw(V)
    r2 = random.Random(9)
    S = SS

    def grass(x, y, h, depth):
        col = mix(P['grass'], P['grass_hi'], r2.random() * (.25 + depth * .45))
        n = int(5 + depth * 6)
        for _ in range(n):
            a = math.radians(r2.uniform(-120, -60))
            L = h * r2.uniform(.6, 1)
            dr.line([(x * S, y * S), ((x + math.cos(a) * L) * S, (y + math.sin(a) * L) * S)], fill=rgb(col), width=max(1, int(S * (.6 + depth))))

    def frailejon(x, gy, h, s):
        top = gy - h
        tw = 10 * s
        for k in range(int(h)):
            y = gy - k
            w = tw * (1.0 + .25 * (k / h)) + r2.random() * 3 * s
            c = mix(P['trunk'], P['trunk_hi'], r2.random() * .7)
            dr.line([((x - w / 2) * S, y * S), ((x + w / 2) * S, y * S)], fill=rgb(c), width=S)
            if r2.random() < .5:
                side = r2.choice((-1, 1))
                dr.line([((x + side * w / 2) * S, y * S), ((x + side * (w / 2 + 5 * s)) * S, (y + 7 * s) * S)], fill=rgb(c * .9), width=max(1, int(S * s)))
        # roseta: hojas lanceoladas plateadas, primero sombra y luego luz
        for layer, colf in ((0, .0), (1, 1.0)):
            for _ in range(52 if layer == 0 else 40):
                a = math.radians(r2.uniform(-200, 20) if layer == 0 else r2.uniform(-170, -10))
                L = r2.uniform(28, 50) * s * (1 if layer == 0 else .85)
                wdt = r2.uniform(4, 6.5) * s
                ex, ey = x + math.cos(a) * L, top + math.sin(a) * L * .75
                nx, ny = -math.sin(a) * wdt / 2, math.cos(a) * wdt / 2
                midx, midy = x + math.cos(a) * L * .5, top + math.sin(a) * L * .75 * .5
                col = mix(P['leaf'] * (.75 if layer == 0 else 1), P['leaf_hi'], colf * max(0, -math.sin(a)) * r2.uniform(.4, 1))
                dr.polygon([(x * S, top * S), ((midx + nx) * S, (midy + ny) * S), (ex * S, ey * S), ((midx - nx) * S, (midy - ny) * S)], fill=rgb(col))
        for _ in range(r2.randint(1, 3)):
            a = math.radians(r2.uniform(-120, -60))
            L = r2.uniform(44, 64) * s
            ex, ey = x + math.cos(a) * L, top + math.sin(a) * L
            dr.line([(x * S, top * S), (ex * S, ey * S)], fill=rgb(P['leaf'] * .85), width=max(1, int(2 * s * S / 2)))
            for q in range(r2.randint(2, 4)):
                fx, fy = ex + r2.uniform(-5, 5) * s, ey + r2.uniform(-4, 3) * s
                rr = r2.uniform(2, 3.2) * s
                dr.ellipse([(fx - rr) * S, (fy - rr) * S, (fx + rr) * S, (fy + rr) * S], fill=rgb(P['flower']))

    items = []
    for _ in range(900):  # pajonal
        x = r2.uniform(300, W); dpt = r2.random()
        y = ground[int(min(W - 1, x))] + 6 + dpt ** 1.6 * 330
        items.append((y, 'g', x, 8 + dpt * 26, dpt))
    for _ in range(40):  # frailejones lejanos y medios
        x = r2.uniform(560, W - 10); dpt = r2.random() ** 1.5
        y = ground[int(min(W - 1, x))] + 8 + dpt * 150
        s = .35 + dpt * .55
        items.append((y, 'f', x, r2.uniform(30, 110) * s, s))
    for x, y, h, s in ((1170, 1330, 210, 1.5), (1400, 1300, 150, 1.25), (960, 1270, 120, 1.05), (1290, 1240, 90, .9)):  # primer plano
        items.append((y, 'f', x, h, s))
    for y, kind, x, h, s in sorted(items):
        if kind == 'g': grass(x, y, h, s)
        else: frailejon(x, y, h, s)
    V = V.resize((W, H), Image.LANCZOS)
    base.paste(V, (0, 0), V)

    arr = np.asarray(base).astype(float)
    arr += np.random.default_rng(3).normal(0, 3.5, arr.shape)
    fx = np.clip((X - 200) / 520, 0, 1) ** 1.3
    alpha = (fx * np.clip(Y / 170, 0, 1) * np.clip((H - Y) / 170, 0, 1))[:, :, None]
    arr = mix(P['surface'], arr, alpha)
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(OUT + 'sumapaz-%s.jpg' % name, quality=84, optimize=True, progressive=True)
    print(name, 'ok')

os.makedirs(OUT, exist_ok=True)
for n in sys.argv[1:] or ('noche', 'dia'):
    render(n)
