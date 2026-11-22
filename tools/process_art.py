"""Turn raw ChatGPT art into game-ready assets.

Usage:  python3 tools/process_art.py <folder with raw PNGs> assets/

Sprite sheets (recommended): fighter_sheet.png, hound_sheet.png, plat_car_sheet.png,
hud_sheet.png ... one image per set, laid out as ART_PROMPTS.md describes. The
frames are cut out on the empty gaps and saved under their own keys.

Every raw file is named after its key (see ART_PROMPTS.md), e.g.
`run1.png`, `ranger_attack.png`, `set_school_dark.png`, `ui_button.png`.
The script crops each image to its visible pixels, scales it to its in-game
size (3 device pixels per game pixel, like the canvas), adds a readability
outline to gameplay sprites, and writes assets/<key>.png. Sizes and offsets
are merged into assets/manifest.json, so you can deliver art in batches.
Unknown file names are listed at the end and skipped.
"""
import json, os, re, sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

SC = 3
SRC, OUT = sys.argv[1], sys.argv[2]
MAN = os.path.join(OUT, "manifest.json")
manifest = json.load(open(MAN)) if os.path.exists(MAN) else {}
if isinstance(manifest, list):
    manifest = {k: True for k in manifest}

def q(v): return round(v * SC) / SC

# Names the art may arrive under -> the game's key
ALIASES = {"ranger_bullet": "ranger_shot", "rogue_bullet": "rogue_shot", "wizard_bullet": "wizard_d20"}
for _p in ("tree", "lamp", "mailbox", "hedge", "phonebooth", "hydrant"):
    ALIASES["set_" + _p] = "prop_" + _p; ALIASES["set_" + _p + "_dark"] = "prop_" + _p + "_dark"

def key_out_black(im, limit=16):
    """Images without transparency: make the background touching the border
    transparent. Handles a black fill, and a white or grey checkerboard
    (the fake 'transparent' pattern image generators sometimes paint in)."""
    a = np.array(im.convert("RGBA"))
    rgb = a[:, :, :3].astype(int)
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    light = np.median(border.max(axis=1)) > 170
    if light:   # white / light-grey checkerboard: bright and colourless
        sat = rgb.max(axis=2) - rgb.min(axis=2)
        dark = (rgb.min(axis=2) >= 150) & (sat <= 18)
    else:
        dark = rgb.max(axis=2) <= limit
    h, w = dark.shape
    seen = np.zeros_like(dark)
    dq = deque([(y, x) for x in range(w) for y in (0, h - 1) if dark[y, x]] +
               [(y, x) for y in range(h) for x in (0, w - 1) if dark[y, x]])
    for y, x in dq: seen[y, x] = True
    while dq:
        y, x = dq.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and dark[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; dq.append((ny, nx))
    a[seen, 3] = 0
    return Image.fromarray(a)

def key_out_flat(im, tol=70):
    """A flat background colour (magenta #FF00FF is what the sheet prompts ask
    for): flood-fill everything connected to the border that is close to the
    border's colour, then drop the pink fringe that anti-aliasing leaves."""
    a = np.array(im.convert("RGBA")); rgb = a[:, :, :3].astype(int)
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    if (np.abs(border - bg).sum(axis=1) < tol).mean() < 0.8: return None   # not one flat colour
    if bg.max() <= 16 or (bg.min() >= 150 and bg.max() - bg.min() <= 18): return None  # black / white: old path
    near = np.abs(rgb - bg).sum(axis=2) < tol
    h, w = near.shape; seen = np.zeros_like(near)
    dq = deque([(y, x) for x in range(w) for y in (0, h - 1) if near[y, x]] + [(y, x) for y in range(h) for x in (0, w - 1) if near[y, x]])
    for y, x in dq: seen[y, x] = True
    while dq:
        y, x = dq.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and near[ny, nx] and not seen[ny, nx]: seen[ny, nx] = True; dq.append((ny, nx))
    seen |= np.abs(rgb - bg).sum(axis=2) < 45   # background trapped between legs / under an arm
    a[seen, 3] = 0
    # fringe: half-blended background pixels hugging the cut-out edge
    edge = np.array(Image.fromarray((seen * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 0
    fr = edge & ~seen & (np.abs(rgb - bg).sum(axis=2) < tol * 2.2)
    if bg[0] > 180 and bg[2] > 180 and bg[1] < 90:  # magenta: also anything strongly magenta-tinted on the edge
        fr |= edge & ~seen & (rgb[:, :, 0] > 150) & (rgb[:, :, 2] > 150) & (rgb[:, :, 1] < np.minimum(rgb[:, :, 0], rgb[:, :, 2]) * 0.55)
    a[fr, 3] = 0
    return Image.fromarray(a)

def load(path, crop=True):
    raw = Image.open(path)
    im = raw.convert("RGBA")
    if "A" not in raw.getbands() or im.split()[3].getextrema()[0] == 255:
        im = key_out_flat(im) or key_out_black(im)
    if not crop: return im
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

# Frames whose pose is much shorter/taller than standing (game px, sprite height)
FRAME_H = {"ranger_block": 17, "ranger_run2": 23, "ranger_jump": 20, "fighter_idle": 23, "fighter_jump": 22}

# key -> handler
def player(key, im):
    frame = re.sub(r"\d+$", "", key.split("_")[-1])   # run3 -> run
    if frame == "roll":
        w, h = by_h(im, 14); write(key, im, w, h, DARK); manifest[key] = [w, h, 0, 0]; return
    w, h = by_h(im, FRAME_H.get(key, 22))
    write(key, im, w, h, DARK)
    manifest[key] = [w, h, q(6 - body_x(im) * w / im.width), 0]

ENEMY = {  # base: (size by 'h' or 'w', value, hit_w, hit_h, on_ground, outline)
    "crow": ("h", 18, 12, 7, False, LIGHT), "crawl": ("w", 26, 16, 10, True, RIM),
    "wisp": ("h", 18, 10, 7, False, RIM), "pod": ("h", 18, 12, 12, True, RIM),
    "stalker": ("h", 30, 14, 24, True, RIM),
}
# new-style enemy frames: <enemy>_<state><n>, e.g. hound_run3, stalker_attack2
ENEMY2 = {"crow": "crow", "hound": "crawl", "flyer": "wisp", "pod": "pod", "stalker": "stalker"}
def enemy2(key, im):
    name = key.split("_")[0]
    by, v, hw, hh, ground, line = ENEMY[ENEMY2[name]]
    w, h = by_h(im, v) if by == "h" else by_w(im, v)
    ox = hw / 2 - body_x(im) * w / im.width          # body centred on the hitbox
    oy = 0 if ground else (h - hh) / 2
    write(key, im, w, h, line); manifest[key] = [w, h, q(ox), q(oy)]

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

SET_H = {"set_house": 42, "set_houses": 40, "set_school": 50, "set_police": 46, "set_store": 46,
         "set_arcade": 46, "set_diner": 38, "set_gas": 46, "set_camper": 30, "prop_tree": 54, "prop_lamp": 46,
         "prop_mailbox": 14, "prop_hedge": 12, "prop_phonebooth": 30, "prop_hydrant": 11}
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
    "hud_heart_full": (9, 8), "hud_heart_empty": (9, 8), "hud_light": (7, 10), "hud_d20": (26, 24), "ui_d20": (48, 48),
    "hud_warning": (11, 13), "hud_revive": (9, 9), "shot_spore": (6, 6), "ranger_shot": (12, 6), "wizard_d20": (10, 8),
    "ui_logo": (520, 170),
}
ICON32 = re.compile(r"^ui_(class_\w+|touch_\w+|stat_\w+|up_\w+|lock|light|medal_[123])$")

def handle(key, get, path):
    """Process one image as <key>; get() returns the cropped sprite. False = unknown key."""
    frame_key = re.sub(r"^(%s)_" % "|".join(CLASSES), "", key)
    if re.match(r"^(idle|run|jump|attack|block|roll|skate|die)\d?$", frame_key) and (frame_key != key or key in ("idle", "run1", "run2", "jump", "attack", "roll")):
        player(key, get())
    elif re.match(r"^(crow|hound|flyer|pod|stalker)_(idle|fly|run|walk|jump|attack)\d$", key): enemy2(key, get())
    elif re.match(r"^plat_(dumpster|car|cop|van|pickup|bus)(_dark)?$", key):  # street objects to jump on
        im = get(); kind = key.split("_")[1]
        w, h = by_h(im, {"dumpster": 18, "car": 21, "cop": 24, "van": 27, "pickup": 23, "bus": 33}[kind])
        write(key, im, w, h, DARK if not key.endswith("_dark") else RIM); manifest[key] = [w, h]
    elif key == "pickup_dice":
        fit_box(key, get(), 12, 12); manifest[key] = True
    elif key in ("pickup_skate", "skate_board"):
        fit_box(key, get(), *((18, 10) if key == "pickup_skate" else (16, 5))); manifest[key] = True
    elif key in ("watcher_body", "watcher_head"):
        im = get(); w, h = by_h(im, 72 if key == "watcher_body" else 34)
        write(key, im, w, h); manifest[key] = [w, h]
    elif re.match(r"^(crow|crawl|wisp|pod|stalker)[12]$", key): enemy(key, get())
    elif key in OBST: obstacle(key, get())
    elif re.match(r"^bulb_(red|green|blue|yellow|orange|pink|gold)$", key):
        fit_box(key, get(), 6, 9); manifest[key] = True
    elif key.replace("_dark", "") in SET_H: scenery(key, get())
    elif key in ("club", "club_dark"): club(key, get())
    elif key == "backdrop_top": opaque(key, path, 105)
    elif key == "backdrop_bottom": opaque(key, path, 104)
    elif key == "floor": opaque(key, path, 16, crop_black=True)
    elif key in UI_EXACT: fit_box(key, get(), *UI_EXACT[key], stretch=True); manifest[key] = True
    elif key in UI_FIT: fit_box(key, get(), *UI_FIT[key]); manifest[key] = True
    elif ICON32.match(key): fit_box(key, get(), 32, 32); manifest[key] = True
    else: return False
    return True

# ---------------- sprite sheets ----------------
# One image per character / creature / object set, as described in ART_PROMPTS.md:
# every row is one animation (or a row of items), frames left to right, with
# empty space between them. Frames are found by those gaps, not by a fixed grid.
def _runs(mask, gap, minlen=1):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]: j += 1
            out.append([i, j]); i = j
        else: i += 1
    merged = []
    for r in out:   # bridge small gaps (a detached bat tip, a raised hand)
        if merged and r[0] - merged[-1][1] < gap: merged[-1][1] = r[1]
        else: merged.append(r)
    return [r for r in merged if r[1] - r[0] >= minlen]

def slice_sheet(path, drop_short=0.35):
    im = load(path, crop=False); A = np.array(im)[:, :, 3] > 40
    H, W = A.shape
    rows = _runs(A.any(axis=1), max(4, int(H * 0.012)), max(3, int(H * 0.01)))
    if rows:  # stray text lines / specks are much shorter than real rows
        med = sorted(r[1] - r[0] for r in rows)[len(rows) // 2]
        rows = [r for r in rows if r[1] - r[0] >= med * drop_short]
    out = []
    for y0, y1 in rows:
        band = A[y0:y1]
        cols = _runs(band.any(axis=0), max(4, int(W * 0.01)), 2)
        if len(cols) > 1:  # fold slivers (motion lines, dust) into their nearest neighbour
            med = sorted(c[1] - c[0] for c in cols)[len(cols) // 2]
            i = 0
            while i < len(cols) and len(cols) > 1:
                if cols[i][1] - cols[i][0] < med * 0.25:  # a sliver: part of a frame if it's close, a stray speck if not
                    gl = cols[i][0] - cols[i - 1][1] if i > 0 else 1e9
                    gr = cols[i + 1][0] - cols[i][1] if i < len(cols) - 1 else 1e9
                    if min(gl, gr) <= med * 0.3:
                        if gl <= gr: cols[i - 1][1] = cols[i][1]
                        else: cols[i + 1][0] = cols[i][0]
                    cols.pop(i)
                else: i += 1
        row = []
        for x0, x1 in cols:
            part = im.crop((x0, y0, x1, y1)); bb = part.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox()
            if bb: row.append(part.crop(bb))
        if row: out.append(row)
    return out

PLAYER_ROWS = [("idle", 2), ("run", 4), ("jump", 2), ("roll", 4), ("attack", 3), ("die", 4), ("skate", 2)]
ENEMY_ROWS = {"crow": [("fly", 4), ("attack", 2)], "hound": [("run", 4), ("jump", 2), ("attack", 2)],
              "stalker": [("walk", 4), ("attack", 3)], "flyer": [("fly", 4), ("attack", 2)], "pod": [("idle", 2), ("attack", 2)]}
ITEM_SHEETS = {  # sheet name -> keys in reading order (left to right, top to bottom)
    **{"plat_" + k: ["plat_" + k, "plat_" + k + "_dark"] for k in ("dumpster", "car", "cop", "van", "pickup", "bus")},
    "watcher": ["watcher_body", "watcher_head"],
    "projectiles": ["shot_spore", "ranger_shot", "wizard_d20"],
    "pickups": ["crate", "crate_dark", "pickup_dice", "pickup_skate", "skate_board"],
    "bulbs": ["bulb_red", "bulb_green", "bulb_blue", "bulb_yellow", "bulb_orange", "bulb_pink", "bulb_gold"],
    "hud": ["hud_heart_full", "hud_heart_empty", "hud_light", "hud_revive", "hud_warning", "hud_dread_frame", "hud_dread_fill"],
    "upgrade_icons": ["ui_up_" + k for k in ("heart", "reach", "battery", "magnet", "greed", "skate", "djump", "revive")],
    "class_icons": ["ui_class_fighter", "ui_class_ranger", "ui_class_rogue", "ui_class_wizard", "ui_lock", "ui_d20"],
    "stat_icons": ["ui_stat_" + k for k in ("str", "dex", "con", "int", "wis", "cha")],
    "touch_buttons": ["ui_touch_roll", "ui_touch_jump", "ui_touch_attack", "ui_touch_flip"],
    "medals": ["ui_medal_1", "ui_medal_2", "ui_medal_3"],
    "ui_frames": ["ui_button", "ui_button_primary", "ui_row", "ui_panel", "ui_sheet", "ui_box"],
}
SHEET_RE = re.compile(r"^(.+?)[_-]?(sprite)?sheet$")

def sheet_player(cls, rows):
    """One scale for the whole sheet (the run row is 22 game px tall), so a
    crouched jump or a roll keeps its real size next to the run frames."""
    run = rows[1] if len(rows) > 1 else rows[0]
    s = 22 / sorted(f.height for f in run)[len(run) // 2]
    keys = []
    for (state, n), row in zip(PLAYER_ROWS, rows):
        if len(row) != n: print(f"  note: {cls} {state}: expected {n} frames, found {len(row)}")
        for i, f in enumerate(row):
            key = f"{cls}_{state}{i + 1}"; w, h = q(f.width * s), q(f.height * s)
            write(key, f, w, h, DARK)
            manifest[key] = [w, h, 0, 0] if state == "roll" else [w, h, q(6 - body_x(f) * s), 0]
            keys.append(key)
    if len(rows) != len(PLAYER_ROWS): print(f"  note: {cls}: expected {len(PLAYER_ROWS)} rows, found {len(rows)}")
    return keys

def sheet_enemy(name, rows): return sheet_enemy_rows(name, rows, ENEMY_ROWS[name])
def sheet_enemy_rows(name, rows, layout):
    by, v, hw, hh, ground, line = ENEMY[ENEMY2[name]]
    first = rows[0]; mid = sorted(first, key=lambda f: f.width * f.height)[len(first) // 2]
    s = v / (mid.height if by == "h" else mid.width)
    keys = []
    for (state, n), row in zip(layout, rows):
        if len(row) != n: print(f"  note: {name} {state}: expected {n} frames, found {len(row)}")
        for i, f in enumerate(row):
            key = f"{name}_{state}{i + 1}"; w, h = q(f.width * s), q(f.height * s)
            write(key, f, w, h, line)
            manifest[key] = [w, h, q(hw / 2 - body_x(f) * s), 0 if ground else q((h - hh) / 2)]
            keys.append(key)
    return keys

STRIP_RE = re.compile(r"^([a-z]+)_([a-z]+)[_-]strip$")
STRIP_H = {"roll": 14, "jump": 21, "die": 20}   # median frame height (game px) for a player strip
def strip(name, state, path):
    """Fallback: one animation per image (e.g. fighter_run_strip.png), frames left to right."""
    frames = [f for row in slice_sheet(path, 0.3) for f in row]
    med = sorted(f.height for f in frames)[len(frames) // 2]
    if name in CLASSES:
        s = STRIP_H.get(state, 22) / med; keys = []
        for i, f in enumerate(frames):
            key = f"{name}_{state}{i + 1}"; w, h = q(f.width * s), q(f.height * s)
            write(key, f, w, h, DARK); manifest[key] = [w, h, 0, 0] if state == "roll" else [w, h, q(6 - body_x(f) * s), 0]
            keys.append(key)
        return keys
    return sheet_enemy_rows(name, [frames], [(state, len(frames))])

done, skipped = [], []
files = sorted((os.path.join(r, f), f) for r, _, fs in os.walk(SRC) for f in fs)
for full, f in files:
    if not f.lower().endswith(".png"): continue
    key, path = f[:-4].lower(), os.path.join(SRC, f)
    key = ALIASES.get(key, key); path = full
    if key.endswith("_ref") or key in CLASSES: continue  # reference sheets are only for ChatGPT
    if key == "ui_medals":  # gold, silver, bronze in one image: split on the gaps
        im = load(path); a = np.array(im)[:, :, 3] > 40; cols = a.any(axis=0)
        runs, x = [], 0
        while x < len(cols):
            if cols[x]:
                st = x
                while x < len(cols) and cols[x]: x += 1
                if x - st > 20: runs.append((st, x))
            x += 1
        for i, (x0, x1) in enumerate(runs[:3]):
            part = im.crop((x0, 0, x1, im.height)); part = part.crop(part.getbbox())
            fit_box(f"ui_medal_{i + 1}", part, 32, 32); manifest[f"ui_medal_{i + 1}"] = True; done.append(f"ui_medal_{i + 1}")
        continue
    ms = STRIP_RE.match(key)
    if ms and (ms.group(1) in CLASSES or ms.group(1) in ENEMY_ROWS):
        try: done += strip(ms.group(1), ms.group(2), path)
        except Exception as e: skipped.append(f"{f} ({e})")
        continue
    m = SHEET_RE.match(key)
    if m and (m.group(1) in CLASSES or m.group(1) in ENEMY_ROWS or m.group(1) in ITEM_SHEETS):
        name = m.group(1)
        try:
            if name in CLASSES:
                rows = slice_sheet(path, 0.3); done += sheet_player(name, rows)
            elif name in ENEMY_ROWS:
                rows = slice_sheet(path); done += sheet_enemy(name, rows)
            elif name in ITEM_SHEETS:
                items = [f for row in slice_sheet(path, 0.12) for f in row]; want = ITEM_SHEETS[name]
                if len(items) != len(want): print(f"  note: {name}: expected {len(want)} items, found {len(items)}")
                for k, f in zip(want, items):
                    if handle(k, lambda f=f: f, None): done.append(k)
                    else: skipped.append(f"{f} -> {k}")
            else: skipped.append(f); continue
        except Exception as e:
            skipped.append(f"{f} ({e})")
        continue
    try:
        if handle(key, lambda: load(path), path): done.append(key)
        else: skipped.append(f)
    except Exception as e:
        skipped.append(f"{f} ({e})")

# pod2 is aligned to pod1: if both arrived together, redo pod2 now that pod1 exists
if "pod2" in done and os.path.exists(os.path.join(SRC, "pod2.png")): enemy("pod2", load(os.path.join(SRC, "pod2.png")))

json.dump(manifest, open(MAN, "w"), indent=1, sort_keys=True)
print(f"processed {len(done)}: {', '.join(done)}")
if skipped: print(f"skipped {len(skipped)} (unknown name?): {', '.join(skipped)}")
