"""Give every in-game sprite a crisp, opaque dark edge (the Watcher excepted).

Usage: python3 tools/crisp_outline.py assets/
Hardens half-transparent edge pixels, then adds a 2 px (at 3x) #1a1124 ring only
where the sprite's edge is not dark already, so existing outlines don't double up.
Safe to run again. New art from process_art.py already comes out this way."""
import os, re, sys
import numpy as np
from PIL import Image
from scipy import ndimage

OUT = sys.argv[1] if len(sys.argv) > 1 else "assets"
DARK = np.array([0x1a, 0x11, 0x24])
SKIP = re.compile(r"^(watcher|backdrop|floor|ui_|logo|hud_light|bg_)")
KEEP = re.compile(r"^(fighter|ranger|rogue|wizard|crow|hound|stalker|flyer|pod|crawl|wisp|plat_|set_|prop_|club|bulb_|crate|pickup_|skate_|vine_|tear|shot_|ranger_shot|wizard_d20|tendril|hud_|obst|stump|spore)")

def crisp(path):
    a = np.array(Image.open(path).convert("RGBA")).astype(np.int16)
    al = a[:, :, 3]; m = al >= 110
    a[:, :, 3] = np.where(m, 255, 0)
    pad = 3
    a = np.pad(a, ((pad, pad), (pad, pad), (0, 0))); m = np.pad(m, pad)
    edge = m & ~ndimage.binary_erosion(m)
    lum = a[:, :, :3].max(axis=2)
    bright = edge & (lum > 75)                       # edge pixels that aren't dark already
    near = ndimage.binary_dilation(bright, iterations=2)
    ring = ndimage.binary_dilation(m, iterations=2) & ~m & near
    a[ring, :3] = DARK; a[ring, 3] = 255
    out = Image.fromarray(a.astype(np.uint8))
    # keep the original canvas size and anchor: crop the padding back off unless the ring needs it
    out = out.crop((pad, pad, out.width - pad, out.height - pad))
    out.save(path, optimize=True)

n = 0
for f in sorted(os.listdir(OUT)):
    if not f.endswith(".png"): continue
    k = f[:-4]
    if SKIP.match(k) or not KEEP.match(k): continue
    crisp(os.path.join(OUT, f)); n += 1
print("crisp edges:", n, "sprites")
