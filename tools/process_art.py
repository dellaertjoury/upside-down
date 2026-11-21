"""Turn raw ChatGPT art into game-ready assets.

Usage:  python3 tools/process_art.py <folder with raw PNGs> assets/

Every raw file is named after its key (see ART_PROMPTS.md), e.g.
`run1.png`, `ranger_attack.png`, `set_school_dark.png`, `ui_button.png`.
The script crops each image to its visible pixels, scales it to its in-game
size (3 device pixels per game pixel, like the canvas), adds a readability
outline to gameplay sprites, and writes assets/<key>.png. Sizes and offsets
are merged into assets/manifest.json, so you can deliver art in batches.
Unknown file names are listed at the end and skipped.
"""
import json, os, re, sys
from PIL import Image, ImageFilter

SC = 3
SRC, OUT = sys.argv[1], sys.argv[2]
MAN = os.path.join(OUT, "manifest.json")
manifest = json.load(open(MAN)) if os.path.exists(MAN) else {}
if isinstance(manifest, list):
    manifest = {k: True for k in manifest}

def q(v): return round(v * SC) / SC

def load(path):
    im = Image.open(path).convert("RGBA")
    a = im.split()[3].point(lambda v: 255 if v > 40 else 0)
    box = a.getbbox() or (0, 0, im.width, im.height)
    return im.crop(box)

def outline(img, color, px=2):
    pad = Image.new("RGBA", (img.width + px * 2, img.height + px * 2), (0, 0, 0, 0)); pad.paste(img, (px, px))
    a = pad.split()[3].point(lambda v: 255 if v > 90 else 0).filter(ImageFilter.MaxFilter(px * 2 + 1))
    edge = Image.new("RGBA", pad.size, color); edge.putalpha(a.point(lambda v: 200 if v else 0))
    edge.alpha_composite(pad)
    return edge.crop((px, px, px + img.width, px + img.height))

def body_x(im):
    """Median x of opaque pixels in the body band (ignores bat/shield tips)."""
    a = im.split()[3]; xs = []
    for y in range(int(im.height * .35), int(im.height * .75), 3):
        for x in range(0, im.width, 2):
            if a.getpixel((x, y)) > 40: xs.append(x)
    xs.sort(); return xs[len(xs) // 2] if xs else im.width / 2

def write(key, im, w, h, line=None):
    out = im.resize((max(1, round(w * SC)), max(1, round(h * SC))), Image.LANCZOS)
    if line: out = outline(out, line)
    out.save(os.path.join(OUT, key + ".png"), optimize=True)

def by_h(im, h): return q(im.width * h / im.height), q(h)
def by_w(im, w): return q(w), q(im.height * w / im.width)

def fit_box(key, im, bw, bh, stretch=False):
    """UI/HUD: exact canvas size; icons keep aspect, centred."""
    W, H = round(bw * SC), round(bh * SC)
    if stretch: im.resize((W, H), Image.LANCZOS).save(os.path.join(OUT, key + ".png"), optimize=True); return
    s = min(W / im.width, H / im.height)
    r = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0)); c.paste(r, ((W - r.width) // 2, (H - r.height) // 2), r)
    c.save(os.path.join(OUT, key + ".png"), optimize=True)

DARK, LIGHT, RIM = "#1a1124", "#f3e9dc", "#ff9fb4"
CLASSES = ("fighter", "ranger", "rogue", "wizard")

# key -> handler
def player(key, im):
    frame = key.split("_")[-1]
    if frame == "roll":
        w, h = by_h(im, 14); write(key, im, w, h, DARK); manifest[key] = [w, h, 0, 0]; return
    w, h = by_h(im, 20 if frame == "jump" else 22)
    write(key, im, w, h, DARK)
    manifest[key] = [w, h, q(6 - body_x(im) * w / im.width), 0]

ENEMY = {  # base: (size by 'h' or 'w', value, hit_w, hit_h, on_ground, outline)
    "crow": ("h", 18, 12, 7, False, LIGHT), "crawl": ("w", 26, 16, 10, True, RIM),
    "wisp": ("h", 18, 10, 7, False, RIM), "pod": ("h", 18, 12, 12, True, RIM),
}
def enemy(key, im):
    base, frame = key[:-1], key[-1]
    by, v, hw, hh, ground, line = ENEMY[base]
    w, h = by_h(im, v) if by == "h" else by_w(im, v)
    ox = (hw - w) / 2
    if base == "pod" and frame == "2":     # spit sticks out left: right-align with frame 1
        f1 = manifest.get("pod1"); ox = (f1[2] + f1[0] - w) if f1 else ox
    oy = 0 if ground else (h - hh) / 2
    if base == "wisp": oy = h - hh - 3     # head = hitbox, tentacles hang below
    write(key, im, w, h, line); manifest[key] = [w, h, q(ox), q(oy)]

OBST = {  # key: (w or None, h, hit_w, stretch)
    "cone": (None, 13, 9, 0), "trash": (None, 18, 11, 0), "fence": (None, 21, 18, 0),
    "crate": (None, 16, 14, 0), "crate_dark": (None, 16, 14, 0), "stump": (None, 14, 12, 0),
    "billboard": (24, 96, 22, 1), "barricade": (16, 105, 14, 1), "tendril": (18, 95, 14, 1), "rift": (16, 104, 14, 1),
}
def obstacle(key, im):
    fw, fh, hw, stretch = OBST[key]
    w, h = (q(fw), q(fh)) if stretch else by_h(im, fh)
    write(key, im, w, h, None if stretch else (RIM if key in ("stump", "crate_dark") else DARK))
    manifest[key] = [w, h, q((hw - w) / 2), 0]

SET_H = {"set_house": 40, "set_houses": 40, "set_school": 58, "set_police": 50, "set_store": 46,
         "set_arcade": 48, "set_diner": 40, "set_gas": 48, "prop_tree": 52, "prop_lamp": 44,
         "prop_mailbox": 13, "prop_hedge": 12, "prop_phonebooth": 30, "prop_hydrant": 10}
def scenery(key, im):
    w, h = by_h(im, SET_H[key.replace("_dark", "")]); write(key, im, w, h); manifest[key] = [w, h]

def club(key, im):
    w, h = by_h(im, 96); write(key, im, w, h); manifest[key] = [w, h, q(-w / 2), 0]  # door centred

def opaque(key, path, h, crop_black=False):
    im = Image.open(path).convert("RGB")
    if crop_black:
        rows = [y for y in range(im.height) if max(im.getpixel((x, y))[1] for x in range(0, im.width, 16)) > 60]
        if rows: im = im.crop((0, max(0, rows[0] - 4), im.width, im.height))
    im.resize((round(im.width * h / im.height * SC), h * SC), Image.LANCZOS).save(os.path.join(OUT, key + ".png"), optimize=True)
    manifest[key] = True

UI_EXACT = {  # 9-slice frames and bars: stretched to an exact size (game px)
    "ui_button": (48, 16), "ui_button_primary": (48, 16), "ui_panel": (48, 48), "ui_sheet": (48, 48),
    "ui_box": (24, 24), "ui_row": (48, 16), "ui_dice": (96, 16),
    "hud_dread_frame": (76, 10), "hud_dread_fill": (70, 4),
}
UI_FIT = {  # icons: fit inside a box, keep aspect
    "hud_heart_full": (9, 8), "hud_heart_empty": (9, 8), "hud_light": (7, 10), "hud_d20": (26, 24),
    "hud_warning": (11, 13), "hud_revive": (9, 9), "shot_spore": (6, 6), "ranger_shot": (6, 6), "wizard_d20": (8, 8),
    "ui_logo": (520, 170),
}
ICON32 = re.compile(r"^ui_(class_\w+|touch_\w+|stat_\w+|up_\w+|lock|light|medal_[123])$")

done, skipped = [], []
for f in sorted(os.listdir(SRC)):
    if not f.lower().endswith(".png"): continue
    key, path = f[:-4].lower(), os.path.join(SRC, f)
    if key.endswith("_ref"): continue  # reference sheets are only for ChatGPT
    frame_key = re.sub(r"^(%s)_" % "|".join(CLASSES), "", key)
    try:
        if frame_key in ("idle", "run1", "run2", "jump", "attack", "block", "roll"): player(key, load(path))
        elif re.match(r"^(crow|crawl|wisp|pod)[12]$", key): enemy(key, load(path))
        elif key in OBST: obstacle(key, load(path))
        elif re.match(r"^bulb_(red|green|blue|yellow|orange|pink|gold)$", key):
            fit_box(key, load(path), 6, 9); manifest[key] = True
        elif key.replace("_dark", "") in SET_H: scenery(key, load(path))
        elif key in ("club", "club_dark"): club(key, load(path))
        elif key == "backdrop_top": opaque(key, path, 105)
        elif key == "backdrop_bottom": opaque(key, path, 104)
        elif key == "floor": opaque(key, path, 16, crop_black=True)
        elif key in UI_EXACT: fit_box(key, load(path), *UI_EXACT[key], stretch=True); manifest[key] = True
        elif key in UI_FIT: fit_box(key, load(path), *UI_FIT[key]); manifest[key] = True
        elif ICON32.match(key): fit_box(key, load(path), 32, 32); manifest[key] = True
        else: skipped.append(f); continue
        done.append(key)
    except Exception as e:
        skipped.append(f"{f} ({e})")

# pod2 is aligned to pod1: if both arrived together, redo pod2 now that pod1 exists
if "pod2" in done and os.path.exists(os.path.join(SRC, "pod2.png")): enemy("pod2", load(os.path.join(SRC, "pod2.png")))

json.dump(manifest, open(MAN, "w"), indent=1, sort_keys=True)
print(f"processed {len(done)}: {', '.join(done)}")
if skipped: print(f"skipped {len(skipped)} (unknown name?): {', '.join(skipped)}")
