# Draws the flat, front-facing Dice Crate (assets/pickup_dice.png, 36x36 = 12x12 game px).
# The pickups sheet has a 3/4-view crate; the game uses this flat one instead (process_art.py skips it).
from PIL import Image, ImageDraw
S=36; im=Image.new("RGBA",(S,S),(0,0,0,0)); d=ImageDraw.Draw(im)
OUT="#1a1124"; W1="#8a5a30"; W2="#6b4222"; W3="#a8743a"; W4="#c48a4a"
# flat front-facing crate: dark outline, plank frame, plank panel
d.rectangle([0,2,35,35],fill=OUT)
d.rectangle([2,4,33,33],fill=W1)
# inner panel with vertical planks
d.rectangle([6,8,29,29],fill=W3)
for x in (11,17,23): d.line([x,8,x,29],fill=W2)
# frame highlights / shadows
d.line([2,4,33,4],fill=W4); d.line([2,33,33,33],fill=W2)
d.line([6,8,29,8],fill=W2)
# corner nails
for (x,y) in [(3,5),(31,5),(3,31),(31,31)]: d.rectangle([x,y,x+1,y+1],fill="#d8c9b0")
# red d20 emblem (flat hexagon with the triangle face)
cx,cy,r=18,19,9
hexpts=[(cx,cy-r),(cx+8,cy-4.5),(cx+8,cy+4.5),(cx,cy+r),(cx-8,cy+4.5),(cx-8,cy-4.5)]
d.polygon([(x+ (1 if x>cx else -1 if x<cx else 0), y+(1 if y>cy else -1 if y<cy else 0)) for x,y in hexpts],fill=OUT)
d.polygon(hexpts,fill="#c81e3a")
tri=[(cx,cy-5),(cx+5,cy+3),(cx-5,cy+3)]
d.polygon(tri,fill="#ff5a6e")
d.line([tri[0],tri[1],tri[2],tri[0]],fill="#8a0f24")
d.point([(cx-1,cy-2),(cx,cy-3)],fill="#ffd0dc")
# lid bar on top
d.rectangle([0,0,35,4],fill=OUT); d.rectangle([2,1,33,3],fill=W2); d.line([2,1,33,1],fill=W4)
import os; im.save(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "pickup_dice.png"))
