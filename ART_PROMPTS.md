# The Upside Down — ChatGPT art prompts

## How art gets into the game

1. Generate an image with a prompt below. Keep ChatGPT's full-size PNG; no
   need to resize it yourself.
2. **Name the file after its key** (for example `ranger_run1.png`), drop it in
   a folder, and send the folder, as you did with the first batch.
3. `tools/process_art.py` crops each image, scales it to its in-game size (3
   device pixels per game pixel), adds a readability outline to sprites, and
   writes `assets/<key>.png` plus `assets/manifest.json`. Anything without art
   keeps its built-in placeholder.

### Status

| Done (in the game) | Still placeholder |
|---|---|
| Player: idle, run1, run2, jump, roll, attack, block | Obstacles: cone, trash, fence, billboard, barricade, stump, tendril, rift |
| Enemies: crow, crawler, wisp, pod (2 frames each) | Pickups and spore shot (section 10) |
| Hellfire Club + rotten twin, both backgrounds, floor | Menu UI (section 9), HUD (section 10), other classes (section 8) |

---

## 1. Style block (paste this at the start of every prompt)

> **Style:** 16-bit pixel art, crisp hard-edged pixels, no anti-aliasing, no
> blur, no gradients except dithering. Dark 1px outline (#1a1124) around every
> sprite. Isometric-free, pure side view (2D platformer). Moody 1980s small-town
> horror mood, like a retro arcade game. Limited palette: deep violet #1a1124,
> #2b1a3d, teal stone #4a8a8a / #2d5c5e, warm lamp gold #ffd866, torch orange
> #e7743a, blood red #c8413b / #ff3d57, crimson vein #7a1f3d / #b0305a, bone
> white #ece6d6. Original design: do not copy any existing show, film or game
> character.
>
> **Output:** a single PNG on a fully transparent background, the subject
> centred, nothing else in the image, no text, no frame, no shadow on the
> ground.

### Tips for consistent results

1. **Generate the character sheet first** (prompt 2.1). For every later frame,
   upload that image to ChatGPT and say "same character, same palette, same
   pixel size".
2. **Keep one subject per image,** centred, with empty space around it. Sprite
   sheets with several poses in one image are harder to cut cleanly.
3. If the background isn't transparent, ask: "Remove the background, return a
   transparent PNG."
4. **Facing:** the player faces **right**. Enemies face **left**.
5. **Upside Down art is drawn upright,** standing on the ground like normal.
   The game flips it under the floor for you.

---

## 2. Player — your adventurer

Target size: **24 × 32 px** per frame (manifest `[24, 32]`). Roll is **24 × 24**.

Note: the in-game hair and jacket colour pickers only recolour the built-in
placeholder sprite. PNG art replaces it with one fixed look.

### 2.1 Character sheet (reference only, not used in game)
> [Style block] Character turnaround sheet for an original 12-year-old kid hero,
> a tabletop-RPG nerd, side view facing right: messy brown hair, red zip-up jacket over a
> striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the
> jacket, a dented wooden baseball bat on the back, a dented trash-can lid
> strapped to one arm as a shield. Show 3 poses in a row:
> standing, running, swinging the bat. Same scale for each pose. Transparent
> background.

### 2.2 `run1` and `run2`
> [Style block] Use the attached reference. Side-view running cycle frame,
> facing right. Frame A: left leg forward, right leg back, arms pumping. Make a
> second image, Frame B: legs passing under the body (mid-stride). Same size,
> same feet position on the ground. Bat stays on the back. Transparent background.

### 2.3 `jump`
> [Style block] Use the attached reference. Jumping pose, facing right,
> knees tucked up, one fist raised, jacket flapping, determined face.
> Transparent background.

### 2.4 `roll` (24 × 24)
> [Style block] Use the attached reference. The kid, curled into a tight ball
> mid-somersault, seen from the side, red jacket and brown hair visible, round
> silhouette that still reads when rotated. Square image. Transparent background.

### 2.5 `attack`
> [Style block] Use the attached reference. The kid, mid bat-swing, facing
> right, both hands on a wooden baseball bat swung forward at chest height, the
> bat fully extended to the right, motion-line pixels behind it. Feet planted.
> Transparent background.

### 2.6 `block`
> [Style block] Use the attached reference. The kid braced in a defensive
> stance facing right, holding a dented metal trash-can lid up in front of the
> chest like a shield, knees bent, feet planted. Transparent background.

---

## 3. Enemies (face left, two frames each)

### 3.1 `crow1`, `crow2` — normal world flyer · `[24, 16]`
> [Style block] A sickly black crow with one glowing white eye, flying left.
> Frame 1 wings up, frame 2 wings down (make two images). Ragged feathers,
> yellow beak. Transparent background.

### 3.2 `crawl1`, `crawl2` — Upside Down ground beast · `[32, 20]`
> [Style block] An original low quadruped creature from a dark parallel
> dimension, facing left: hunched purple-grey hide, a ridge of bony spines along
> its back, glowing red eyes, small white teeth, thin clawed legs. Give it
> a beetle-like head of your own design. Frame 1 and frame 2 of a scuttling walk (two images). Transparent
> background.

### 3.3 `wisp1`, `wisp2` — Upside Down flyer · `[20, 16]`
> [Style block] A small floating spore-ghost creature, facing left: puffy
> violet body, two red eyes, ragged tentacle tail, faint crimson glow. Frame 1
> tail curled, frame 2 tail stretched (two images). Transparent background.

### 3.4 `pod1`, `pod2` — Upside Down turret · `[20, 20]`
> [Style block] A pulsing fleshy spore pod rooted in the ground, crimson and
> magenta, two small glowing eyes. Frame 1 closed, frame 2 with its mouth open
> spitting a glowing pink spore to the left (two images). Transparent background.

---

## 4. Obstacles — normal world (drawn standing on the ground)

| Key | Size `[w, h]` | Prompt (after the style block) |
|---|---|---|
| `cone` | `[12, 14]` | An orange traffic cone with two white reflective stripes. |
| `trash` | `[14, 20]` | A dented metal garbage can with its lid slightly askew. |
| `fence` | `[24, 24]` | A short section of white picket fence, 4 pickets, a little weathered. |
| `billboard` | `[26, 100]` | A tall hanging warning sign: a red-and-white "LOW CLEARANCE" board dangling from two chains that go up out of frame. The board sits at the bottom of a tall narrow image; the top is just chains. |
| `barricade` | `[16, 108]` | A tall, narrow wall of stacked red-and-white striped road barricades and plywood, with a blinking amber warning light on top. Very tall and thin. |

## 5. Obstacles — the Upside Down (draw upright; the game flips them)

| Key | Size `[w, h]` | Prompt (after the style block) |
|---|---|---|
| `stump` | `[16, 14]` | A rotten tree stump wrapped in dark crimson veins, glowing faint red cracks. |
| `tendril` | `[18, 96]` | A tall bundle of dark organic vines hanging from above, writhing, pulsing crimson tips at the bottom. Tall narrow image. |
| `rift` | `[16, 107]` | A tall, narrow wall of black stone split by a glowing red crack of energy, red particles drifting from it. |

---

## 6. The Hellfire Club (start of every run)

Draw it in your own style. Don't copy the show's club logo: the sign is the
name in plain letters, and the emblem is a simple d20.

### 6.0 `club` (160 × 96 in game, e.g. 640 × 384 source)
> [Style block] Side view of a small two-storey red-brick 1980s building, a
> tabletop gaming club meeting at night. Flat roof, four warm-lit windows (one
> with kids' silhouettes around a table), an open double door in the centre
> spilling yellow light onto stone steps, a red awning over the door. A
> rectangular sign above reads "HELLFIRE CLUB" in plain blocky red neon
> letters, no logo. A paper poster by the door with a simple twenty-sided dice
> drawing. The ground line is the very bottom edge. Transparent sky.

### 6.0b `club_dark` (same size, drawn upright, flipped in game)
> [Style block] The exact same building as the attached image, but rotten in
> a dark mirror dimension: bricks dark purple and crimson, windows glowing dull
> red, black vines crawling down from the roof, the neon sign dead and cracked.
> Transparent sky.

## 7. Floor, backgrounds

### 6.1 `floor` (tileable strip, e.g. 64 × 20 → drawn 16 px tall)
> [Style block] A seamless horizontally tileable side-view strip of ground. Top
> 40%: green grass edge over grey asphalt. Bottom 60%: dark soil turning into
> black roots with glowing crimson veins. Must tile left-to-right with no seam.
> Not transparent.

### 6.2 `bg_top` (normal world, 800 × 216, drawn 105 px tall)
> [Style block] A wide, seamless, horizontally tileable side-view background
> for a 2D runner: a quiet 1980s American suburban street at dusk. Teal sky
> fading to warm orange at the horizon, low sun, a row of wooden houses with
> warm lit windows, street lamps glowing gold, round trees, power lines. The
> ground line is the very bottom edge of the image. No characters, no text.
> Left and right edges must match. Not transparent.

### 6.3 `bg_bottom` (the Upside Down, 800 × 216, drawn upright, flipped in game)
> [Style block] The same suburban street as the attached image, but in a dark
> rotten mirror dimension: deep crimson and black sky, red lightning in the
> distance, the houses decayed and wrapped in black vines, windows glowing dull
> red, dead leafless trees, floating ash and spores in the air. The ground line
> is the very bottom edge of the image. Seamlessly tileable left-to-right. No
> characters, no text. Not transparent.

---

## 8. Classes: Ranger, Rogue, Wizard

Same pipeline as the Fighter. Start with the class's reference sheet (8.x.1),
then upload it with each frame prompt: "Use the attached reference. Same
character, same palette, same pixel size, same proportions as the Fighter."
Upload the Fighter's run frame too, so all four kids match in size.

Keys use the class as a prefix: `ranger_run1`, `rogue_block`, `wizard_attack`
and so on. The frames are the same seven as the Fighter: `idle`, `run1`,
`run2`, `jump`, `roll`, `attack`, `block`. The classes are still locked in
the game; when we unlock one, its art plugs in by these names.

### 8.1 Ranger: the slingshot kid (DEX +2, WIS +1)

**8.1.1 Reference sheet**
> [Style block] Character turnaround sheet for an original 12-year-old kid
> ranger, side view facing right: freckles, short sandy hair under a faded
> green bucket hat, an olive army-surplus vest with bulging pockets over a
> yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a wooden
> Y-slingshot in the right hand, a pouch of marbles on the belt, a skateboard
> strapped to the backpack. Show standing, running and aiming poses in a row.
> Transparent background.

| Key | Frame prompt (after the style block + "use the attached reference") |
|---|---|
| `ranger_idle` | Standing relaxed, facing right, slingshot hanging from one hand. |
| `ranger_run1` / `ranger_run2` | Running cycle facing right, frame A legs apart, frame B legs passing (two images). |
| `ranger_jump` | Jumping, knees tucked, bucket hat lifting off the head, slingshot raised. |
| `ranger_roll` | Curled in a tight somersault ball, hat clutched to the chest, round silhouette. Square image. |
| `ranger_attack` | Aiming the slingshot forward to the right, band pulled back to the cheek, about to fire. |
| `ranger_block` | Holding the skateboard deck up in front of the body like a shield, crouched. |
| `ranger_shot` | A single glowing blue marble with a short motion trail to the left. Tiny, centred. |

### 8.2 Rogue: hoodie and walkie-talkie (DEX +2, CHA +1)

**8.2.1 Reference sheet**
> [Style block] Character turnaround sheet for an original 12-year-old kid
> rogue, side view facing right: dark grey zip hoodie with the hood up, messy
> black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with
> its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a
> small flashlight in the right hand. Sly grin. Show standing, running and
> striking poses in a row. Transparent background.

| Key | Frame prompt (after the style block + "use the attached reference") |
|---|---|
| `rogue_idle` | Leaning forward slightly, facing right, flashlight held low, ready to bolt. |
| `rogue_run1` / `rogue_run2` | Low, fast sprint facing right, frame A and frame B (two images). |
| `rogue_jump` | Agile leap, body almost horizontal, one hand reaching forward. |
| `rogue_roll` | Tight forward roll, hood over the head, walkie-talkie antenna sticking out. Square image. |
| `rogue_attack` | Quick lunge to the right, flashlight thrust forward with a bright white strobe flash burst at the tip. |
| `rogue_block` | Dodging backwards in a crouch, hoodie pulled tight, walkie-talkie raised with a crackle of yellow static sparks. |

### 8.3 Wizard: bedsheet cape (INT +2, WIS +1)

**8.3.1 Reference sheet**
> [Style block] Character turnaround sheet for an original 12-year-old kid
> wizard, side view facing right: a cape made from a striped bedsheet tied at
> the neck, a cone hat made from cardboard with tinfoil stars, round glasses,
> curly red hair, a knitted sweater, a toy wand made from a painted stick, a
> cloth pouch of RPG dice on the belt. Proud expression. Show standing, running
> and casting poses in a row. Transparent background.

| Key | Frame prompt (after the style block + "use the attached reference") |
|---|---|
| `wizard_idle` | Standing proudly, facing right, wand raised a little, cape draped. |
| `wizard_run1` / `wizard_run2` | Running facing right, holding the hat on with one hand, cape flowing behind, frame A and frame B (two images). |
| `wizard_jump` | Jumping with the cape spread wide like wings, wand pointed up. |
| `wizard_roll` | Rolled into a ball wrapped in the bedsheet cape, hat tip poking out. Square image. |
| `wizard_attack` | Casting to the right, wand thrust forward, a glowing twenty-sided die flying from its tip. |
| `wizard_block` | Cape swept in front of the body, glowing violet rune circle shield in front of the cape. |
| `wizard_d20` | A glowing violet twenty-sided die projectile with a sparkle trail to the left. Tiny, centred. |

---

## 9. Menu UI

The menu is HTML, styled with these images. Frames are stretched with
**9-slice** scaling: the corners stay sharp and the middle stretches. So frames
must have **evenly thick borders and a plain, flat centre** (no text, no icons).

Add this to the style block for every UI prompt:
> Flat front view, no perspective, no drop shadow, crisp pixel edges, fully
> transparent outside the shape.

| Key | Used for | Prompt |
|---|---|---|
| `ui_logo` | Title on the hub screen | A wide pixel-art game logo reading "THE UPSIDE DOWN" in chunky retro arcade letters. "THE UPSIDE" in warm lamp-gold with a dark outline and orange drop-shading; the word "DOWN" underneath, flipped upside down, in glowing blood red with dark crimson vines growing from it. A thin horizontal crack line between the two words, gold above and red below. Transparent background. |
| `ui_button` | Every normal button | A wide rectangular pixel-art button frame, 3:1 ratio. Deep violet #2b1a3d face, a 1-pixel lighter bevel on the top and left, darker bevel bottom and right, a thick dark #1a1124 outline, small metal rivets in the four corners. The centre is completely flat and empty. |
| `ui_button_primary` | "Start run" and other main buttons | The same button frame as the attached image, but blood red #b8283f with a pink #ff6b7f top bevel and dark red bottom bevel, rivets in gold. |
| `ui_panel` | Hub card, character sheet, run-over stats | A square pixel-art panel frame, like the edge of a well-used tabletop RPG character sheet mounted in a dark wooden board: thick dark-wood border with brass corner caps, a thin gold inner line, and a flat, very dark violet centre at 85% opacity. Centre completely empty. |
| `ui_box` | Ability scores, upgrade rows | A small square pixel-art box frame: 2-pixel dark violet border, a thin teal #4a8a8a inner line, flat dark centre. Simple, so it can repeat many times on one screen. |
| `ui_dice` | Dice on the character sheet | A horizontal strip of six square six-sided dice faces seen straight on, showing 1, 2, 3, 4, 5, 6 pips in order from left to right, ivory #ece6d6 faces with rounded pixel corners, dark pips, all six exactly the same size and evenly spaced. |
| `ui_class_fighter` | Class buttons (32 × 32 icon) | A square pixel-art icon of a dented wooden baseball bat crossed with a trash-can lid, on a dark violet circle. |
| `ui_class_ranger` | Class icon | A square pixel-art icon of a wooden Y-slingshot with a blue marble, on a dark violet circle. |
| `ui_class_rogue` | Class icon | A square pixel-art icon of a chunky 1980s walkie-talkie with its antenna up and a hood shape behind it, on a dark violet circle. |
| `ui_class_wizard` | Class icon | A square pixel-art icon of a cardboard wizard hat with tinfoil stars and a small glowing d20, on a dark violet circle. |
| `ui_touch_jump` | Phone buttons (32 × 32 icons) | A square pixel-art icon: a chunky white arrow pointing up, gold outline. |
| `ui_touch_roll` | Phone button | A square pixel-art icon: a white curved arrow circling around a small ball, gold outline. |
| `ui_touch_attack` | Phone button | A square pixel-art icon: a wooden baseball bat mid-swing with white motion lines. |
| `ui_touch_block` | Phone button | A square pixel-art icon: a dented metal trash-can lid shield. |
| `ui_touch_flip` | Phone button | A square pixel-art icon: two curved arrows, one gold above a horizontal line and one red below it, showing a flip through a floor. |

---

## 10. In-game HUD, pickups, projectiles

These are drawn on the game canvas at small sizes, so keep shapes **bold and
simple**: a strong outline and 3–4 colours read better than fine detail.

| Key | Game size | Prompt |
|---|---|---|
| `hud_heart_full` | 9 × 8 | A tiny pixel-art heart, blood red #ff3d57 with a pink highlight pixel, thick dark outline. |
| `hud_heart_empty` | 9 × 8 | The same heart as the attached image, but empty: dark violet #3a2550 inside, same outline. |
| `hud_shard` | 7 × 9 | A tiny glowing gold crystal shard, diamond-shaped, pale yellow highlight, dark outline. |
| `hud_dread_frame` | 76 × 10 | A long thin horizontal pixel-art gauge frame, like a flashlight battery: dark metal casing, a tiny battery nub on the right end, the inside completely empty and transparent. |
| `hud_dread_fill` | 70 × 4 | A long thin horizontal bar of glowing crimson liquid with darker veins and a bright pink top edge. Fills the whole image edge to edge, not transparent. |
| `hud_d20` | 26 × 24 | A pixel-art badge for a dice roll: a dark violet rounded square with a gold outline and a faint twenty-sided-die silhouette in the background. The centre stays dark and empty; the game prints the number on top. |
| `hud_warning` | 11 × 13 | A tiny pixel-art warning sign: a yellow rounded triangle with a dark exclamation mark. |
| `pickup_spark` | 8 × 10 | A tiny floating gold crystal shard with a soft glow, normal-world collectible. |
| `pickup_spore` | 8 × 10 | A tiny floating pink-red glowing spore with little wisps, Upside Down collectible. |
| `shot_spore` | 6 × 6 | A tiny glowing pink spore projectile ball with a short trail to the left. |
