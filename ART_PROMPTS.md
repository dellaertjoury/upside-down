# The Upside Down — complete art list (v2)

Everything the game can show, in one list, so you can redo it all and deliver
it in one go. **128 images: 124 used in the game + 4 reference sheets.**
Anything you skip keeps its built-in placeholder, so you can also deliver in parts.

## How to deliver

1. **One PNG per key.** Name each file exactly after its key, for example
   `fighter_run1.png`, `set_school_dark.png`, `ui_button.png`. Lowercase, no spaces.
2. **Keep ChatGPT's full-size image.** Don't resize; the game's processor
   (`tools/process_art.py`) crops, scales and outlines everything itself.
3. **Transparent background** for everything except the 3 opaque images
   marked *opaque* (backdrops and floor).
4. **One subject per image,** centred, with empty space around it. No sprite
   sheets (the dice strip in section 6 is the one exception).
5. Put all files in one folder, zip it, and send it. Files with unknown names
   are reported, not used, so nothing breaks.

**Work order:** make each reference sheet first (marked ★), then upload it with
every prompt that says *"use the attached reference"*. That keeps characters
and buildings consistent.

---

## Style blocks

Paste the matching block at the start of every prompt.

**[SPRITE]** characters, enemies, obstacles, lights:
> 16-bit pixel art, crisp hard-edged pixels, no anti-aliasing, no blur. Bold,
> saturated colours and a dark 1-pixel outline (#1a1124) so it stands out
> against a background. Pure side view for a 2D side-scrolling runner. 1980s
> small-town horror mood. Palette: violet #1a1124 #2b1a3d, teal #4a8a8a, lamp
> gold #ffd866, orange #e7743a, blood red #c8413b #ff3d57, crimson #7a1f3d
> #b0305a, bone white #ece6d6. Original design, not copied from any show, film
> or game. Output: one PNG, fully transparent background, subject centred,
> no text, no frame, no ground shadow.

**[SCENERY]** backdrops, buildings, props (this keeps the background calm):
> 16-bit pixel art, crisp pixels, no anti-aliasing. **Background art: muted,
> desaturated colours, low contrast, soft and simple shapes, few small
> details, no strong highlights, no pure black or pure white.** It must sit
> quietly behind brightly coloured characters. Flat side view, no perspective,
> 1980s American small town at dusk. Original design.

**[UI]** menus and HUD:
> Pixel-art game UI element, crisp pixels, no anti-aliasing, flat front view,
> no perspective, no drop shadow, no text unless asked. Retro 1980s arcade and
> tabletop-RPG feel. Palette: deep violet #1a1124 #2b1a3d, lamp gold #ffd866,
> blood red #b8283f, teal #4a8a8a, ivory #ece6d6. Transparent outside the shape.

---

## 1. Characters (4 classes × 6 frames + 4 reference sheets + 2 projectiles)

All four kids must be the **same height and pixel scale**. Upload the
Fighter's `run1` too when making the other classes' frames.

### ★ Reference sheets (not used in the game, needed for consistency)

| Key | Prompt ([SPRITE] block first) |
|---|---|
| `fighter_ref` ★ | Character turnaround sheet of an original 12-year-old kid, a tabletop-RPG nerd, side view facing right: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat, a dented trash-can lid strapped to one arm as a shield. Three poses in a row: standing, running, swinging the bat. |
| `ranger_ref` ★ | Same scale as the attached Fighter. Original 12-year-old kid ranger, side view facing right: freckles, sandy hair under a faded green bucket hat, olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a wooden Y-slingshot, a pouch of marbles on the belt, a skateboard strapped to the backpack. Three poses: standing, running, aiming. |
| `rogue_ref` ★ | Same scale as the attached Fighter. Original 12-year-old kid rogue, side view facing right: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small flashlight. Sly grin. Three poses: standing, running, striking. |
| `wizard_ref` ★ | Same scale as the attached Fighter. Original 12-year-old kid wizard, side view facing right: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Proud expression. Three poses: standing, running, casting. |

### Frames: make these 6 for each class

Replace `<class>` with `fighter`, `ranger`, `rogue` or `wizard` (24 files).
Start each prompt with: *[SPRITE] Use the attached reference. Same character,
same palette, same pixel scale. Facing right.*

| Key | Prompt |
|---|---|
| `<class>_idle` | Standing relaxed in a doorway pose, weight on one leg, ready to run. |
| `<class>_run1` | Running, frame A: front leg forward, back leg pushing off, arms pumping. |
| `<class>_run2` | Running, frame B: legs passing under the body mid-stride. Same height as frame A. |
| `<class>_jump` | Mid-jump, knees tucked up, one arm raised. |
| `<class>_roll` | Curled into a tight ball mid-somersault, round silhouette that still reads when rotated. Square image. |
| `<class>_attack` | See the class line below. |

| Class | `_attack` |
|---|---|
| Fighter | Swinging the baseball bat forward at chest height, bat fully extended to the right, white motion-line pixels. |
| Ranger | Aiming the slingshot to the right, band pulled back to the cheek. |
| Rogue | Quick lunge, flashlight thrust forward with a bright white strobe flash at the tip. |
| Wizard | Wand thrust forward, a glowing violet twenty-sided die flying from its tip. |

### Projectiles

| Key | Prompt ([SPRITE]) |
|---|---|
| `ranger_shot` | A single glowing blue marble with a short motion trail to the left. Tiny. |
| `wizard_d20` | A small glowing violet twenty-sided die with a sparkle trail to the left. Tiny. |

---

## 2. Enemies (9)

Enemies face **left**, toward the player. Two frames each; frame 2 uses frame 1 as the attached reference.

| Key | Prompt ([SPRITE]) |
|---|---|
| `crow1` | A sickly black crow with one glowing white eye flying left, wings up. Ragged feathers, yellow beak. |
| `crow2` | Same crow as attached, wings down. |
| `crawl1` | An original low four-legged creature from a dark parallel world, facing left: hunched purple-grey hide, bony spines along the back, beetle-like head, glowing red eyes, small white teeth, thin clawed legs. Walking pose A. |
| `crawl2` | Same creature as attached, walking pose B (legs swapped). |
| `wisp1` | A small floating spore ghost facing left: puffy violet body, two red eyes, ragged tentacle tail hanging below, faint crimson glow. Tail curled. |
| `wisp2` | Same wisp as attached, tail stretched. |
| `pod1` | A pulsing fleshy spore pod rooted in the ground, crimson and magenta, two small glowing eyes, mouth closed. |
| `pod2` | Same pod as attached, mouth open, spitting a glowing pink spore to the left. |
| `shot_spore` | A tiny glowing pink spore ball with a short trail to the left. |

---

## 3. Obstacles (3)

Upside Down obstacles are drawn **upright**, standing on the ground. The game flips them under the floor.

| Key | Prompt ([SPRITE]) |
|---|---|
| `trash` | A dented metal garbage can, lid slightly askew. |
| `stump` | A rotten tree stump wrapped in dark crimson veins with glowing red cracks. |
| `tendril` | A very tall, narrow bundle of dark organic vines hanging from above, pulsing crimson tips at the bottom. Tall thin image (about 1:5). |

---

## 4. Christmas lights: the points (9)

The run's currency. Single bulbs hang on strings, and crates are full of them.
Smash a crate with a hit to spill the lights.

| Key | Prompt ([SPRITE]) |
|---|---|
| `bulb_red` | One old-fashioned 1980s Christmas-light bulb (C7 shape) hanging straight down from a small dark green socket, glowing **red**, a white highlight pixel, soft glow. Tall narrow image. |
| `bulb_green` | Same bulb as attached, glowing **green**. |
| `bulb_blue` | Same bulb as attached, glowing **blue**. |
| `bulb_yellow` | Same bulb as attached, glowing **yellow**. |
| `bulb_orange` | Same bulb as attached, glowing **orange**. |
| `bulb_pink` | Same bulb as attached, glowing **pink**. |
| `bulb_gold` | Same bulb as attached, but **gold** with tiny white sparkles around it (the rare one, worth 5). |
| `crate` | A small wooden shipping crate, slats nailed shut, warm multicoloured Christmas-light glow leaking out between the slats, a tangle of green light-cord hanging from one corner. |
| `crate_dark` | Same crate as attached, but rotten for a dark parallel world: damp purple wood, crimson veins, the lights inside glowing dimly red. |

---

## 5. Environment (35)

**Why this fixes the busy background:** the backdrop is now just sky and a
soft distant silhouette. The street is built from separate pieces that the
game places with lots of empty space: a building only every 2–4 blank
stretches. Every piece uses the **[SCENERY]** block (muted, low contrast).

### Backdrops and floor (3, *opaque*)

| Key | Prompt ([SCENERY]) |
|---|---|
| `backdrop_top` | *Opaque.* A wide, seamless, horizontally tileable dusk sky over a small town: teal sky fading to warm peach at the horizon, a few soft clouds, a low hazy sun, and along the bottom only a soft, low silhouette of distant trees and rooftops in muted blue-grey. **No buildings in front, no street, no details in the lower third.** The bottom edge is the horizon. Left and right edges must match. 3:1. |
| `backdrop_bottom` | *Opaque.* The same sky as attached but in a rotten mirror dimension: deep crimson and dark plum, faint red lightning far away, floating ash, a soft dark silhouette of dead trees along the bottom. Calm and dim, low contrast, no details in the lower third. Tileable, 3:1. |
| `floor` | *Opaque.* A seamless, horizontally tileable side-view strip of ground, 4:1. Top 40%: a thin green grass edge over grey asphalt. Bottom 60%: dark soil turning into black roots with glowing crimson veins. No sky above the grass. |

### Hellfire Club (2): the start of every run

| Key | Prompt ([SCENERY], but this one may be a bit brighter: it's the hub) |
|---|---|
| `club` ★ | A small two-storey red-brick 1980s building where a tabletop gaming club meets at night. **Open double door exactly in the centre**, spilling warm light onto stone steps, a red awning over it. Warm-lit windows, one with kids around a table. A sign above the door reads "HELLFIRE CLUB" in plain blocky red neon letters, no logo. A small paper poster of a twenty-sided die by the door. Ground line at the bottom edge. |
| `club_dark` | The exact building as attached, same size and outline, rotten in a dark mirror dimension: dark purple and crimson bricks, dull red windows, black vines from the roof, dead cracked sign. |

### Buildings (18): one every few blank stretches

Make the normal version first (★), then the `_dark` twin with *"use the
attached reference: the exact same building, same size and outline, rotten
in a dark mirror dimension: dark purple and crimson, dull red windows, black
vines, broken sign"*. Every building: **one standalone building, transparent
background, no street, no sidewalk, no neighbours, ground line at the bottom edge.**

| Key | Prompt ([SCENERY]) |
|---|---|
| `set_house` ★ / `set_house_dark` | A modest one-storey wooden family house with a gabled roof, porch, two windows and a door. |
| `set_houses` ★ / `set_houses_dark` | Two small neighbouring houses side by side with a little gap, different siding colours. |
| `set_school` ★ / `set_school_dark` | A long two-storey brick high school with a flat roof, rows of windows, a double-door entrance, a flagpole, and a plain sign reading "HIGH SCHOOL". Wide image. |
| `set_police` ★ / `set_police_dark` | A small single-storey concrete police station with a plain sign reading "POLICE", a blue lamp by the door, a few windows. |
| `set_store` ★ / `set_store_dark` | A small-town general store with a striped awning, a big shop window and a plain sign reading "GENERAL STORE". |
| `set_arcade` ★ / `set_arcade_dark` | A small 1980s video arcade with a neon sign reading "ARCADE", glass front with the glow of arcade cabinets inside. |
| `set_diner` ★ / `set_diner_dark` | A low chrome roadside diner with a strip of windows and a plain sign reading "DINER". Wide image. |
| `set_gas` ★ / `set_gas_dark` | A small gas station: a flat canopy on two pillars over two old pumps, a tall sign pole reading "GAS". |
| `set_camper` ★ / `set_camper_dark` | A small 1970s camper trailer on blocks, with a couple of bikes leaning against it. Wide image. |

### Props (12): dotted along the blank stretches

Same rules as the buildings: normal version ★ first, then `_dark` with the same twin prompt. Small, simple, transparent background.

| Key | Prompt ([SCENERY]) |
|---|---|
| `prop_tree` ★ / `prop_tree_dark` | One round leafy street tree. (Dark: bare twisted tree with vines.) |
| `prop_lamp` ★ / `prop_lamp_dark` | One tall thin street lamp with a soft warm bulb. |
| `prop_mailbox` ★ / `prop_mailbox_dark` | One curbside mailbox on a wooden post. |
| `prop_hedge` ★ / `prop_hedge_dark` | One low trimmed hedge, wide and short. |
| `prop_phonebooth` ★ / `prop_phonebooth_dark` | One 1980s outdoor phone booth. |
| `prop_hydrant` ★ / `prop_hydrant_dark` | One fire hydrant. |

---

## 6. Menu UI (34)

**Frames stretch with 9-slice scaling:** the corners stay sharp and the
middle stretches. So every frame needs **evenly thick borders and a
completely flat, empty centre.** The exact ratios matter:

| Key | Prompt ([UI]) |
|---|---|
| `ui_logo` | A wide game logo reading "THE UPSIDE DOWN" in chunky retro arcade letters: "THE UPSIDE" in warm lamp-gold with a dark outline and orange shading; "DOWN" underneath, flipped upside down, glowing blood red with dark crimson vines. A thin crack line between the words. About 3:1. |
| `ui_button` | A rectangular button frame, **exactly 3:1, border thickness exactly 1/4 of the height**: violet #2b1a3d face, lighter bevel top-left, darker bevel bottom-right, dark outline, tiny rivets in the corners. Flat empty centre. |
| `ui_button_primary` | Same frame as attached, blood red #b8283f with a pink top bevel, gold rivets. |
| `ui_panel` | A **square** panel frame, **border exactly 1/6 of the width**: dark wood with brass corner caps and a thin gold inner line, flat very dark violet centre. For the hub and the run-over screen. |
| `ui_sheet` | A **square** frame for a tabletop-RPG character sheet, **border exactly 1/6 of the width**: aged parchment border with ink doodles of dice and swords in the corners, a flat dark violet centre. |
| `ui_box` | A small **square** box frame, **border exactly 1/6 of the width**: dark violet border with a thin teal inner line, flat dark centre. For ability scores and upgrade rows. |
| `ui_row` | A leaderboard row frame, **exactly 3:1, border exactly 1/4 of the height**: thin gold line on dark violet, flat centre. |
| `ui_dice` | A horizontal strip of **six identical square six-sided dice faces** seen straight on, showing 1 to 6 pips in order left to right, ivory faces, dark pips, rounded pixel corners, evenly spaced. **Exactly 6:1.** |
| `ui_light` | Icon: one glowing red Christmas-light bulb, the currency symbol. Square. |
| `ui_lock` | Icon: a small iron padlock. Square. |
| `ui_medal_1` / `ui_medal_2` / `ui_medal_3` | Icon: a round medal on a ribbon, gold / silver / bronze, with a tiny d20 engraved. Square. |
| `ui_class_fighter` | Icon: a wooden baseball bat crossed with a trash-can lid on a dark violet circle. |
| `ui_class_ranger` | Icon: a wooden slingshot with a blue marble on a dark violet circle. |
| `ui_class_rogue` | Icon: a chunky walkie-talkie in front of a hood shape on a dark violet circle. |
| `ui_class_wizard` | Icon: a cardboard wizard hat with tinfoil stars and a small glowing d20 on a dark violet circle. |
| `ui_stat_str` | Icon: a flexed arm. Small, bold, gold on transparent. |
| `ui_stat_dex` | Icon: a winged sneaker. Same style as attached. |
| `ui_stat_con` | Icon: a heart with a bandage. Same style. |
| `ui_stat_int` | Icon: an open spellbook. Same style. |
| `ui_stat_wis` | Icon: an eye inside a flashlight beam. Same style. |
| `ui_stat_cha` | Icon: a smiling theatre mask. Same style. |
| `ui_up_heart` | Upgrade icon: a red heart with a plus. Square, on a dark violet rounded tile. |
| `ui_up_reach` | Upgrade icon: a long baseball bat with an arrow. Same tile style as attached. |
| `ui_up_battery` | Upgrade icon: a flashlight battery with a lightning bolt. Same style. |
| `ui_up_magnet` | Upgrade icon: a horseshoe magnet pulling a Christmas-light bulb. Same style. |
| `ui_up_greed` | Upgrade icon: a red-glowing bulb with dark vines. Same style. |
| `ui_up_djump` | Upgrade icon: a sneaker with two upward arrows. Same style. |
| `ui_up_revive` | Upgrade icon: a heart with angel wings. Same style. |
| `ui_touch_jump` | Phone button icon: a chunky up arrow, white with gold outline. |
| `ui_touch_roll` | Phone button icon: a curved arrow circling a ball. Same style. |
| `ui_touch_attack` | Phone button icon: a bat mid-swing with motion lines. Same style. |
| `ui_touch_flip` | Phone button icon: two curved arrows, gold above a line and red below it. Same style. |

---

## 7. In-game HUD (8)

Drawn very small, so keep shapes **bold and simple**: strong outline, 3–4 colours.

| Key | Prompt ([UI]) |
|---|---|
| `hud_heart_full` | A tiny heart, blood red with a pink highlight pixel, thick dark outline. |
| `hud_heart_empty` | Same heart as attached, empty: dark violet inside. |
| `hud_light` | A tiny Christmas-light bulb, glowing, bold outline (the light counter). |
| `hud_revive` | A tiny teal heart with small wings (the Second Wind token). |
| `hud_dread_frame` | A long thin gauge frame like a flashlight battery, **about 7.5:1**: dark metal casing, a small nub on the right, **inside completely empty and transparent.** |
| `hud_dread_fill` | A long thin bar of glowing crimson liquid with darker veins and a pink top edge, **about 17:1**, filling the image edge to edge (not transparent). |
| `hud_d20` | A badge for the start-of-run dice roll: dark violet rounded square, gold outline, faint twenty-sided-die silhouette; **the centre stays dark and empty** (the game prints the number). Square. |
| `hud_warning` | A tiny yellow warning triangle with a dark exclamation mark. |

---

## Checklist

| Section | Files |
|---|---|
| 1. Characters | 4 reference sheets + 24 frames + 2 projectiles |
| 2. Enemies | 9 |
| 3. Obstacles | 3 |
| 4. Christmas lights | 9 |
| 5. Environment | 3 + 2 + 18 + 12 = 35 |
| 6. Menu UI | 34 |
| 7. HUD | 8 |
| **Total** | **128 (124 in the game)** |

Ranger, Rogue and Wizard are still locked in the game. Their art goes in now
and shows on the character sheet as soon as each class is unlocked.
