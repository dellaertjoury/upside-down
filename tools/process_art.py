"""Turn raw ChatGPT art into game-ready sprites.

Usage: python3 tools/process_art.py <folder with raw PNGs> assets/

Each raw image is cropped to its visible pixels, scaled down to its in-game
size (3 device pixels per game pixel, matching the canvas), and written as
assets/<key>.png. assets/manifest.json gets [w, h, ox, oy] in game pixels:
draw size plus an offset from the sprite's hitbox, so art can be bigger
than the hitbox without changing gameplay.
"""
import json, sys, os
from PIL import Image, ImageFilter

SC = 3  # device pixels per game pixel (see SCALE in js/game.js)
SRC, OUT = sys.argv[1], sys.argv[2]

def q(v):  # snap to 1/3 game pixel so every edge lands on a device pixel
    return round(v * SC) / SC

def load(name):
    im = Image.open(os.path.join(SRC, name)).convert("RGBA")
    a = im.split()[3].point(lambda v: 255 if v > 40 else 0)
    return im, a.getbbox()

def anchor_x(im, box, lo=0.35, hi=0.75):
    """Median x of opaque pixels in the body band (ignores bat/shield tips)."""
    l, t, r, b = box
    a = im.split()[3]
    xs = []
    for y in range(int(t + (b - t) * lo), int(t + (b - t) * hi), 4):
        for x in range(l, r, 2):
            if a.getpixel((x, y)) > 40:
                xs.append(x)
    xs.sort()
    return xs[len(xs) // 2] - l

manifest = {}

# Readability outlines: dark for the normal world, a pale rim for the dark
# Upside Down, so sprites pop off the detailed backgrounds.
OUTLINE = {"run1": "#1a1124", "run2": "#1a1124", "jump": "#1a1124", "attack": "#1a1124",
           "block": "#1a1124", "idle": "#1a1124", "roll": "#1a1124", "crow1": "#f3e9dc", "crow2": "#f3e9dc",
           "crawl1": "#ff9fb4", "crawl2": "#ff9fb4", "wisp1": "#ff9fb4", "wisp2": "#ff9fb4",
           "pod1": "#ff9fb4", "pod2": "#ff9fb4"}

def outline(img, color, px=2):
    a = img.split()[3].point(lambda v: 255 if v > 90 else 0)
    grown = a.filter(ImageFilter.MaxFilter(px * 2 + 1))
    edge = Image.new("RGBA", img.size, color)
    edge.putalpha(grown.point(lambda v: 200 if v else 0))
    edge.alpha_composite(img)
    return edge

def save(key, im, box, s, ox, oy):
    l, t, r, b = box
    w, h = q((r - l) * s), q((b - t) * s)
    out = im.crop(box).resize((round(w * SC), round(h * SC)), Image.LANCZOS)
    if key in OUTLINE:
        pad = Image.new("RGBA", (out.width + 4, out.height + 4), (0, 0, 0, 0)); pad.paste(out, (2, 2))
        out = outline(pad, OUTLINE[key]).crop((2, 2, out.width + 2, out.height + 2))
    out.save(os.path.join(OUT, key + ".png"), optimize=True)
    manifest[key] = [w, h, q(ox), q(oy)]
    return w, h

# ---------- player (hitbox box is 12 wide, feet on the floor) ----------
PLAYER = {
    "run1": "Nova Running with Shield and Bat-1.png",
    "run2": "Pixel Runner Nova with Shield-2.png",
    "jump": "Leaping Hero with Shield and Club.png",
    "attack": "Pixel-Art Hero#U2019s Bat Swing.png",
    "block": "Determined Boy with Trash Lid Shield.png",
}
TARGET_H = 22  # game pixels for a standing frame
for key, f in PLAYER.items():
    im, box = load(f)
    s = TARGET_H / 1040 if key != "jump" else TARGET_H / 1040
    if key == "run2":  # different canvas: match its height to run1
        s = TARGET_H / (box[3] - box[1]) * (1051 / 1040)
    ax = anchor_x(im, box) * s
    save(key, im, box, s, 6 - ax, 0)

# idle: first figure of the trio sheet
im, _ = load("Retro Sprite Trio_ Stand, Run, Swing.png")
third = im.crop((0, 0, im.width // 3, im.height))
a = third.split()[3].point(lambda v: 255 if v > 40 else 0)
box = a.getbbox()
s = TARGET_H / (box[3] - box[1])
save("idle", third, box, s, 6 - anchor_x(third, box) * s, 0)

# roll: a ball, drawn centred and rotated by the game
im, box = load("Pixel-Art Rolling Boy Sprite.png")
s = 14 / (box[3] - box[1])
save("roll", im, box, s, 0, 0)

# ---------- enemies: pairs share one scale; centred on the hitbox ----------
def pair(keys, files, size, hit_w, hit_h, ground):
    """size = (w or None, h or None) for the first frame."""
    ims = [load(f) for f in files]
    l, t, r, b = ims[0][1]
    s = size[1] / (b - t) if size[1] else size[0] / (r - l)
    first = None
    for key, (im, box) in zip(keys, ims):
        s_k = s if first is None else first[1] / (box[3] - box[1])  # same height as frame 1
        w, h = q((box[2] - box[0]) * s_k), q((box[3] - box[1]) * s_k)
        if first is None:
            ox = (hit_w - w) / 2
            first = (w, h, ox)
        else:  # right-align with frame 1 (spit / wings stick out to the left)
            ox = first[2] + first[0] - w
        oy = 0 if ground else (h - hit_h) / 2
        save(key, im, box, s_k, ox, oy)

pair(["crow1", "crow2"], ["ChatGPT Image Nov 21, 2026, 04_40_10 PM-1.png", "ChatGPT Image Nov 21, 2026, 04_40_11 PM-2.png"], (None, 18), 12, 7, False)
pair(["crawl1", "crawl2"], ["ChatGPT Image Nov 21, 2026, 04_42_56 PM-1.png", "ChatGPT Image Nov 21, 2026, 04_42_57 PM-2.png"], (26, None), 16, 10, True)
pair(["wisp1", "wisp2"], ["Crimson Spore Ghost Sprite-1.png", "Violet Spore Ghost Sprite-2.png"], (None, 18), 10, 7, False)
pair(["pod1", "pod2"], ["Crimson Alien Fungal Pod-1.png", "Fungal Pod Spitting Glowing Spore-2.png"], (None, 18), 12, 12, True)
# wisps: the head is the hitbox, tentacles hang below it
for k in ("wisp1", "wisp2"):
    w, h, ox, oy = manifest[k]
    manifest[k] = [w, h, ox, q(h - 7 - 3)]

# ---------- Hellfire Club (door centre ~47% across) ----------
for key, f in [("club", "Hellfire Club Pixel Art Nightfront.png"), ("club_dark", "Corrupted Hellfire Club Building.png")]:
    im, box = load(f)
    s = 96 / (box[3] - box[1])
    w, h = save(key, im, box, s, 0, 0)
    manifest[key][2] = q(-w * 0.47)  # offset from the door centre

# ---------- backgrounds + floor (opaque, tiled) ----------
FT_H, FB_H, FLOOR_H = 105, 104, 16  # keep in sync with FT / FB in js/game.js
for key, f, hh in [("bg_top", "1980s Suburban Sunset Street.png", FT_H), ("bg_bottom", "Crimson Corruption on Suburban Street.png", FB_H)]:
    im = Image.open(os.path.join(SRC, f)).convert("RGB")
    w = round(im.width * hh / im.height * SC)
    im.resize((w, hh * SC), Image.LANCZOS).save(os.path.join(OUT, key + ".png"), optimize=True)
    manifest[key] = True

im = Image.open(os.path.join(SRC, "Crimson Veins Beneath the Road.png")).convert("RGB")
# cut the empty black sky above the grass
rows = [y for y in range(im.height) if max(im.getpixel((x, y))[1] for x in range(0, im.width, 16)) > 60]
im = im.crop((0, max(0, rows[0] - 4), im.width, im.height))
w = round(im.width * FLOOR_H / im.height * SC)
im.resize((w, FLOOR_H * SC), Image.LANCZOS).save(os.path.join(OUT, "floor.png"), optimize=True)
manifest["floor"] = True

with open(os.path.join(OUT, "manifest.json"), "w") as fh:
    json.dump(manifest, fh, indent=1)
print(json.dumps(manifest))
