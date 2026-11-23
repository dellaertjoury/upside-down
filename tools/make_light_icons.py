# The light icons in the HUD (hud_light) and the menus (ui_light) are the game's own bulb sprites,
# hanging the right way up (socket on top). The HUD sheet's bulb was drawn upside down, so
# process_art.py skips those two keys; run this after importing new bulb art.
import os
from PIL import Image
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
def fit(src, W, H, out):
    im = Image.open(os.path.join(A, src)).convert("RGBA"); im = im.crop(im.getbbox())
    s = min(W / im.width, H / im.height)
    r = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.NEAREST if s >= 1 else Image.LANCZOS)
    c = Image.new("RGBA", (W, H), (0, 0, 0, 0)); c.paste(r, ((W - r.width) // 2, (H - r.height) // 2), r)
    c.save(os.path.join(A, out), optimize=True)
fit("bulb_yellow.png", 21, 30, "hud_light.png")
fit("bulb_red.png", 96, 96, "ui_light.png")
