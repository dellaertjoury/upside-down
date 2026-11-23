# Christmas-light bulbs from the "string of three" sprite (blue, red, green on one cord):
#   python3 tools/make_bulbs.py path/to/lights_string.png
# Cuts each bulb below the cord (socket + glass), recolours the red one for yellow, orange,
# pink and gold, and writes assets/bulb_<colour>.png at 6 x 9 game px (18 x 27 px).
# The cord itself is drawn by the game between the bulbs of one string.
import os, sys, colorsys
from PIL import Image
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
src = Image.open(sys.argv[1]).convert("RGBA")
W, H = src.size
cuts = {"blue": (0.273, 0.374, 0.394, 0.661), "red": (0.432, 0.455, 0.556, 0.751), "green": (0.6, 0.388, 0.727, 0.671)}  # fractions of the image
out = {}
for n, (a, b, c, d) in cuts.items():
    im = src.crop((round(a * W), round(b * H), round(c * W), round(d * H))); im = im.crop(im.getbbox())
    px = im.load()   # drop any bit of cord poking in at the top corners
    for y in range(int(im.height * 0.1)):
        for x in range(im.width):
            if x < im.width * 0.2 or x > im.width * 0.75: px[x, y] = (0, 0, 0, 0)
    out[n] = im.crop(im.getbbox())
def shift(im, hue, sat=1.0, val=1.0):
    im = im.copy(); px = im.load()
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if not a: continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            if (s > 0.35 and v > 0.25) or ((h < 0.08 or h > 0.9) and s > 0.08 and v > 0.75):  # glass + highlights
                r, g, b = [int(k * 255) for k in colorsys.hsv_to_rgb(hue, min(1, s * sat), min(1, v * val))]
                px[x, y] = (r, g, b, a)
    return im
out["yellow"] = shift(out["red"], 0.145, 1.0, 1.1); out["orange"] = shift(out["red"], 0.075, 1.0, 1.06)
out["pink"] = shift(out["red"], 0.89, 0.8, 1.08); out["gold"] = shift(out["red"], 0.125, 0.85, 1.2)
for n, im in out.items():
    s = min(18 / im.width, 27 / im.height)
    r = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    c = Image.new("RGBA", (18, 27), (0, 0, 0, 0)); c.paste(r, ((18 - r.width) // 2, 0), r)
    c.save(os.path.join(A, "bulb_%s.png" % n), optimize=True)
print("bulbs:", ", ".join(out))
