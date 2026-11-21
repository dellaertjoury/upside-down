# The Upside Down — ChatGPT art prompts

The game already runs with built-in placeholder pixel art. Each prompt below
makes one replacement PNG. Save it in `assets/` as `<key>.png` and add the key
to `assets/manifest.json`. That's all, no code changes.

```json
{
  "run1": [24, 32],
  "run2": [24, 32],
  "bg_top": true
}
```

`[w, h]` is the size the art is drawn at in the game's 400 × 225 pixel world.
Use `true` to keep the default size. The art stays anchored to the floor and
centred on the hitbox, so you can draw it bigger than the placeholder.

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
2. **ChatGPT renders big images.** Shrink each result to its target size with
   *nearest neighbour* (Photoshop: Image Size → Nearest Neighbor; free tool:
   lospec.com/pixel-art-scaler, or Aseprite). Never use smooth resizing.
3. If the background isn't transparent, ask: "Remove the background, return a
   transparent PNG."
4. **Facing:** the player faces **right**. Enemies face **left**.
   (Hellfire Club building: the door is about a third of the way in from the left.)
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

### 6.1 `floor` (tileable strip, e.g. 64 × 20 → drawn 10 px tall)
> [Style block] A seamless horizontally tileable side-view strip of ground. Top
> 40%: green grass edge over grey asphalt. Bottom 60%: dark soil turning into
> black roots with glowing crimson veins. Must tile left-to-right with no seam.
> Not transparent.

### 6.2 `bg_top` (normal world, 800 × 216, drawn 108 px tall)
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

## 8. Later: more classes

When we unlock Ranger, Rogue and Wizard, reuse prompt 2.1 with a new
description, then the same frame prompts. Ideas: Ranger = slingshot kid,
Rogue = hoodie and walkie-talkie, Wizard = cape made from a bedsheet.
