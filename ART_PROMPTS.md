# The Upside Down — sprite-sheet prompts

One prompt per sheet. Each sheet holds a set of animation frames (or items) of one subject, so ChatGPT draws them together and keeps them consistent. The art processor cuts the sheets into frames by itself.

**Why the players are split in 4:** ChatGPT makes one image of about 1500 × 1000 px. With 26 frames on it, each frame gets only ~200 px and loses detail. Two or three rows per image keeps every frame large.

## How to deliver

1. **Save each result under the sheet's file name**, e.g. `fighter_sheet_idle_run.png`, `hound_sheet.png`, `plat_car_sheet.png`. Lowercase, no spaces. Keep ChatGPT's full-size PNG.
2. **Attach a reference** for detail: your earlier single-frame art of that character (e.g. the old detailed `fighter_run1.png`). The prompts say "match the attached reference's level of detail". If a result looks simpler than the reference, reply: *"Same sheet, but with the detail of the reference: more shading, larger sprites."*
3. **Magenta background:** the prompts ask for flat magenta (#FF00FF) instead of transparency. ChatGPT gets that right far more often than real transparency, and the processor removes it. A real transparent background works too.
4. **Check before you send:** count the rows and frames against the prompt. A missing or merged frame shifts everything after it. Small differences in size or spacing don't matter: frames are found by the gaps between them and scaled together.
5. Zip the sheets (subfolders are fine) and send them.

**If ChatGPT keeps failing on a full sheet**, ask for one row at a time instead: *"Same character, only Row 2 – RUN, 4 frames in one row"*. Save it as a **strip**: `<name>_<animation>_strip.png`, e.g. `fighter_run_strip.png`, `fighter_die_strip.png`, `hound_attack_strip.png`. (Use the animation names in lowercase: idle, run, jump, roll, attack, die, skate, fly, walk.)

**Useful follow-ups in ChatGPT:**
- *"Strict side view: the camera sees the character from the side. Redraw frames 1 and 4 of the death row in profile, rotated only in the picture plane."*
- *"Keep everything identical, but leave more empty magenta space between the frames."*
- *"Remove all text and labels. Keep the sprites exactly the same."*
- *"Row 4 has 3 frames, it needs 4. Redraw the sheet with 4 frames in row 4."*

**Facing:** players face **right**, enemies face **left**. The game mirrors everything in the Upside Down, so draw every sprite upright.

**A single full sheet (`fighter_sheet.png`, 7 rows) and single frames still work too.** The old one-prompt-per-frame list is in `ART_PROMPTS_frames.md`, and frame files named like `fighter_run3.png` are still accepted.

---

## 1. Players (4 characters × 4 sheets)

Each character is split over **4 sheets**, matching the Fighter sheets you made. Save them as `<class>_sheet_idle_run.png`, `<class>_sheet_jump_attack.png`, `<class>_sheet_roll_skate.png` and `<class>_sheet_die.png`. Make the idle + run sheet first, then attach it (plus your best Fighter sheet, for the level of detail) as the reference for the other three.

| Sheet | Row 1 | Row 2 | Row 3 |
|---|---|---|---|
| `_sheet_idle_run` | idle (2: stand, bounce) | run (3) | run (3 more) |
| `_sheet_jump_attack` | jump (2) | attack while running (3) | |
| `_sheet_roll_skate` | roll (4) | skate (2) + board breaks (2) | kickflip on the board (4) |
| `_sheet_die` | hit and fall (3) | slide to a stop (4) | |

The skateboard is drawn **into** the skate, crash and kickflip frames. In the game: skate frames while riding, the kickflip when you jump on the board, the crash frames when the board breaks, then a roll.

### Fighter

**Idle + run → `fighter_sheet_idle_run.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the jacket, its lens facing forward, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – IDLE (2 frames): a bouncy idle in profile: 1 standing relaxed, weapon lowered; 2 BOUNCE: knees bent, the whole body dipped down a little, ready to move (like a boxer bouncing on the spot).

Row 2 – RUN, first half (3 frames): 1 contact: front leg reaching forward, heel down; 2 passing: legs together under the body, body lowest; 3 push-off: back leg pushing, body rising.

Row 3 – RUN, second half (3 frames): the same three poses with the OTHER leg forward: 4 contact; 5 passing; 6 airborne: both feet off the ground, body highest. Arms swing opposite to the legs. Rows 2 and 3 together loop as one smooth 6-frame run cycle.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Jump + attack → `fighter_sheet_jump_attack.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the jacket, its lens facing forward, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – JUMP (2 frames): 1 rising: knees tucked up, arms up; 2 falling: legs reaching down, arms out for balance.

Row 2 – ATTACK (3 frames): the legs keep RUNNING in every frame (never standing still): 1 the bat raised back over the shoulder (wind-up); 2 the bat swung level in front at full reach, a white slash arc touching the bat; 3 the bat follows through low, shield arm forward.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Roll, skateboard and kickflip → `fighter_sheet_roll_skate.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the jacket, its lens facing forward, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – ROLL (4 frames): curled into a tight ball rolling forward (to the right), seen from the side; the ball turns a quarter turn further in each frame (0°, 90°, 180°, 270°). The ball is about 60% of the standing height.

Row 2 – SKATE (2 frames) then CRASH (2 frames), 4 frames in one row. DRAW THE SKATEBOARD in these frames: a worn 1980s wooden skateboard with a red deck and yellow wheels, under the feet, seen from the side. SKATE: 1 riding: knees bent, arms out for balance; 2 pushing: leaning forward, one fist pumped, big grin, clothes blown back. CRASH (the board breaks): 3 the board snaps in two under the feet with a crack and wood splinters, the kid stumbling forward, arms flung out, shocked face; 4 the kid pitching forward off the broken board, about to tuck into a roll, the two board halves left behind.

Row 3 – KICKFLIP (4 frames), WITH THE SKATEBOARD: a jump on the board seen from the side: 1 ollie: crouched, popping the tail, board tilting up; 2 in the air, knees tucked, the board flipping under the feet (seen on its edge, wheels showing); 3 highest point, the board spun upside down, wheels up, under the feet; 4 catching the board with both feet, wheels down again, knees bent for the landing.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Death → `fighter_sheet_die.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the jacket, its lens facing forward, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – DEATH, hit and fall (3 frames): 1 hit: knocked forward off the feet, body bent, arms flung out, eyes squeezed shut, the weapon flying loose; 2 falling forward, body diving towards the ground, arms reaching out; 3 belly-flopping onto the ground, a small puff of dust touching the body.

Row 2 – DEATH, slide to a stop (4 frames): lying face down on the ground, sliding forward: 1 sliding on the belly, face grimacing, dust behind the feet; 2 still sliding, slowing down, head lowering; 3 almost stopped, arms limp; 4 lying still, face down, eyes closed, knocked out.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Ranger

*Locked in the game for now: only the Fighter is playable. Make these once the Fighter is done.*

**Idle + run → `ranger_sheet_idle_run.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest strap of the vest, its lens facing forward, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – IDLE (2 frames): a bouncy idle in profile: 1 standing relaxed, weapon lowered; 2 BOUNCE: knees bent, the whole body dipped down a little, ready to move (like a boxer bouncing on the spot).

Row 2 – RUN, first half (3 frames): 1 contact: front leg reaching forward, heel down; 2 passing: legs together under the body, body lowest; 3 push-off: back leg pushing, body rising.

Row 3 – RUN, second half (3 frames): the same three poses with the OTHER leg forward: 4 contact; 5 passing; 6 airborne: both feet off the ground, body highest. Arms swing opposite to the legs. Rows 2 and 3 together loop as one smooth 6-frame run cycle.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Jump + attack → `ranger_sheet_jump_attack.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest strap of the vest, its lens facing forward, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – JUMP (2 frames): 1 rising: knees tucked up, arms up; 2 falling: legs reaching down, arms out for balance.

Row 2 – ATTACK (3 frames): the legs keep RUNNING in every frame (never standing still): 1 pulling the slingshot band back at eye level; 2 releasing: arm straight, band snapping forward, a small blue marble just leaving the pouch (touching it); 3 slingshot arm lowering.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Roll, skateboard and kickflip → `ranger_sheet_roll_skate.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest strap of the vest, its lens facing forward, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – ROLL (4 frames): curled into a tight ball rolling forward (to the right), seen from the side; the ball turns a quarter turn further in each frame (0°, 90°, 180°, 270°). The ball is about 60% of the standing height.

Row 2 – SKATE (2 frames) then CRASH (2 frames), 4 frames in one row. DRAW THE SKATEBOARD in these frames: a worn 1980s wooden skateboard with a red deck and yellow wheels, under the feet, seen from the side. SKATE: 1 riding: knees bent, arms out for balance; 2 pushing: leaning forward, one fist pumped, big grin, clothes blown back. CRASH (the board breaks): 3 the board snaps in two under the feet with a crack and wood splinters, the kid stumbling forward, arms flung out, shocked face; 4 the kid pitching forward off the broken board, about to tuck into a roll, the two board halves left behind.

Row 3 – KICKFLIP (4 frames), WITH THE SKATEBOARD: a jump on the board seen from the side: 1 ollie: crouched, popping the tail, board tilting up; 2 in the air, knees tucked, the board flipping under the feet (seen on its edge, wheels showing); 3 highest point, the board spun upside down, wheels up, under the feet; 4 catching the board with both feet, wheels down again, knees bent for the landing.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Death → `ranger_sheet_die.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest strap of the vest, its lens facing forward, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – DEATH, hit and fall (3 frames): 1 hit: knocked forward off the feet, body bent, arms flung out, eyes squeezed shut, the weapon flying loose; 2 falling forward, body diving towards the ground, arms reaching out; 3 belly-flopping onto the ground, a small puff of dust touching the body.

Row 2 – DEATH, slide to a stop (4 frames): lying face down on the ground, sliding forward: 1 sliding on the belly, face grimacing, dust behind the feet; 2 still sliding, slowing down, head lowering; 3 almost stopped, arms limp; 4 lying still, face down, eyes closed, knocked out.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Rogue

*Locked in the game for now: only the Fighter is playable. Make these once the Fighter is done.*

**Idle + run → `rogue_sheet_idle_run.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the belt with its antenna up, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the hoodie, its lens facing forward, black jeans, beat-up canvas high-tops, fingerless gloves, sly grin. Fights with fast jabs of the gloved fists. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – IDLE (2 frames): a bouncy idle in profile: 1 standing relaxed, weapon lowered; 2 BOUNCE: knees bent, the whole body dipped down a little, ready to move (like a boxer bouncing on the spot).

Row 2 – RUN, first half (3 frames): 1 contact: front leg reaching forward, heel down; 2 passing: legs together under the body, body lowest; 3 push-off: back leg pushing, body rising.

Row 3 – RUN, second half (3 frames): the same three poses with the OTHER leg forward: 4 contact; 5 passing; 6 airborne: both feet off the ground, body highest. Arms swing opposite to the legs. Rows 2 and 3 together loop as one smooth 6-frame run cycle.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Jump + attack → `rogue_sheet_jump_attack.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the belt with its antenna up, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the hoodie, its lens facing forward, black jeans, beat-up canvas high-tops, fingerless gloves, sly grin. Fights with fast jabs of the gloved fists. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – JUMP (2 frames): 1 rising: knees tucked up, arms up; 2 falling: legs reaching down, arms out for balance.

Row 2 – ATTACK (3 frames): the legs keep RUNNING in every frame (never standing still): 1 low fast stride, the right fist drawn back at the hip; 2 lunge, a fast jab with the fist fully forward while the chest clip lamp flares with a bright white strobe burst (touching the lamp); 3 pulling the fist back, the last white sparks fading at the lamp.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Roll, skateboard and kickflip → `rogue_sheet_roll_skate.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the belt with its antenna up, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the hoodie, its lens facing forward, black jeans, beat-up canvas high-tops, fingerless gloves, sly grin. Fights with fast jabs of the gloved fists. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – ROLL (4 frames): curled into a tight ball rolling forward (to the right), seen from the side; the ball turns a quarter turn further in each frame (0°, 90°, 180°, 270°). The ball is about 60% of the standing height.

Row 2 – SKATE (2 frames) then CRASH (2 frames), 4 frames in one row. DRAW THE SKATEBOARD in these frames: a worn 1980s wooden skateboard with a red deck and yellow wheels, under the feet, seen from the side. SKATE: 1 riding: knees bent, arms out for balance; 2 pushing: leaning forward, one fist pumped, big grin, clothes blown back. CRASH (the board breaks): 3 the board snaps in two under the feet with a crack and wood splinters, the kid stumbling forward, arms flung out, shocked face; 4 the kid pitching forward off the broken board, about to tuck into a roll, the two board halves left behind.

Row 3 – KICKFLIP (4 frames), WITH THE SKATEBOARD: a jump on the board seen from the side: 1 ollie: crouched, popping the tail, board tilting up; 2 in the air, knees tucked, the board flipping under the feet (seen on its edge, wheels showing); 3 highest point, the board spun upside down, wheels up, under the feet; 4 catching the board with both feet, wheels down again, knees bent for the landing.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Death → `rogue_sheet_die.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the belt with its antenna up, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the hoodie, its lens facing forward, black jeans, beat-up canvas high-tops, fingerless gloves, sly grin. Fights with fast jabs of the gloved fists. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – DEATH, hit and fall (3 frames): 1 hit: knocked forward off the feet, body bent, arms flung out, eyes squeezed shut, the weapon flying loose; 2 falling forward, body diving towards the ground, arms reaching out; 3 belly-flopping onto the ground, a small puff of dust touching the body.

Row 2 – DEATH, slide to a stop (4 frames): lying face down on the ground, sliding forward: 1 sliding on the belly, face grimacing, dust behind the feet; 2 still sliding, slowing down, head lowering; 3 almost stopped, arms limp; 4 lying still, face down, eyes closed, knocked out.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Wizard

*Locked in the game for now: only the Fighter is playable. Make these once the Fighter is done.*

**Idle + run → `wizard_sheet_idle_run.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the sweater (visible under the cape), its lens facing forward, a homemade firework wand: a cardboard tube painted with stars and tinfoil, a small bundle of bottle rockets tucked in the belt, a cloth pouch of RPG dice on the belt. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – IDLE (2 frames): a bouncy idle in profile: 1 standing relaxed, weapon lowered; 2 BOUNCE: knees bent, the whole body dipped down a little, ready to move (like a boxer bouncing on the spot).

Row 2 – RUN, first half (3 frames): 1 contact: front leg reaching forward, heel down; 2 passing: legs together under the body, body lowest; 3 push-off: back leg pushing, body rising.

Row 3 – RUN, second half (3 frames): the same three poses with the OTHER leg forward: 4 contact; 5 passing; 6 airborne: both feet off the ground, body highest. Arms swing opposite to the legs. Rows 2 and 3 together loop as one smooth 6-frame run cycle.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Jump + attack → `wizard_sheet_jump_attack.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the sweater (visible under the cape), its lens facing forward, a homemade firework wand: a cardboard tube painted with stars and tinfoil, a small bundle of bottle rockets tucked in the belt, a cloth pouch of RPG dice on the belt. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – JUMP (2 frames): 1 rising: knees tucked up, arms up; 2 falling: legs reaching down, arms out for balance.

Row 2 – ATTACK (3 frames): the legs keep RUNNING in every frame (never standing still): 1 the firework wand raised, a crackling fuse spark at its tip, cape flowing behind; 2 the wand pointed forward, a small bottle-rocket firework blasting out of its tip with an orange-yellow flame and sparks (touching the tip); 3 the wand lowering, a little puff of grey smoke at its tip, cape billowing.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Roll, skateboard and kickflip → `wizard_sheet_roll_skate.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the sweater (visible under the cape), its lens facing forward, a homemade firework wand: a cardboard tube painted with stars and tinfoil, a small bundle of bottle rockets tucked in the belt, a cloth pouch of RPG dice on the belt. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 3 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – ROLL (4 frames): curled into a tight ball rolling forward (to the right), seen from the side; the ball turns a quarter turn further in each frame (0°, 90°, 180°, 270°). The ball is about 60% of the standing height.

Row 2 – SKATE (2 frames) then CRASH (2 frames), 4 frames in one row. DRAW THE SKATEBOARD in these frames: a worn 1980s wooden skateboard with a red deck and yellow wheels, under the feet, seen from the side. SKATE: 1 riding: knees bent, arms out for balance; 2 pushing: leaning forward, one fist pumped, big grin, clothes blown back. CRASH (the board breaks): 3 the board snaps in two under the feet with a crack and wood splinters, the kid stumbling forward, arms flung out, shocked face; 4 the kid pitching forward off the broken board, about to tuck into a roll, the two board halves left behind.

Row 3 – KICKFLIP (4 frames), WITH THE SKATEBOARD: a jump on the board seen from the side: 1 ollie: crouched, popping the tail, board tilting up; 2 in the air, knees tucked, the board flipping under the feet (seen on its edge, wheels showing); 3 highest point, the board spun upside down, wheels up, under the feet; 4 catching the board with both feet, wheels down again, knees bent for the landing.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

**Death → `wizard_sheet_die.png`**

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a small square orange clip-on lamp (about matchbox size, a square glowing lens on the front, like a pocket clip light) clipped to the chest of the sweater (visible under the cape), its lens facing forward, a homemade firework wand: a cardboard tube painted with stars and tinfoil, a small bundle of bottle rockets tucked in the belt, a cloth pouch of RPG dice on the belt. Match the attached reference exactly: same character, outfit, colours and proportions.

CAMERA (important): strict side view, like a classic 2D platformer. The camera looks at the character from the side at body height: face in profile, one eye visible, facing RIGHT. Never a front view, never a 3/4 view, never seen from above or below. In jumping, rolling, tumbling and falling poses the body only rotates within the flat picture plane, like a paper cut-out spinning on the screen; it never turns towards or away from the camera.

DETAIL (important): draw every frame LARGE, the character about 300–350 px tall, filling its cell. Rich shading with 3–4 tones per colour, highlights and shadows, fabric folds and seams, readable face and hands, detailed shoes, texture on the props. Match the attached reference's level of detail exactly. Do not simplify or shrink the sprites to make them fit.

LAYOUT (very important): 2 rows, frames read left to right. Every ROW is one animation (or two, where it says so). Every frame shows the SAME character at the SAME size; feet on one baseline within each row. Leave wide empty space between all frames and between the rows: nothing touches or overlaps the next frame.

Row 1 – DEATH, hit and fall (3 frames): 1 hit: knocked forward off the feet, body bent, arms flung out, eyes squeezed shut, the weapon flying loose; 2 falling forward, body diving towards the ground, arms reaching out; 3 belly-flopping onto the ground, a small puff of dust touching the body.

Row 2 – DEATH, slide to a stop (4 frames): lying face down on the ground, sliding forward: 1 sliding on the belly, face grimacing, dust behind the feet; 2 still sliding, slowing down, head lowering; 3 almost stopped, arms limp; 4 lying still, face down, eyes closed, knocked out.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no glow or haze around the sprites, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines, dust) must touch the body, the weapon or the board, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

---

## 2. Enemies (5 sheets)

### Crow → `crow_sheet.png` (3 rows, 9 frames)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a sickly black crow with one glowing white eye, ragged feathers, a yellow beak. Original design. Match the attached reference. Side view, facing LEFT in every frame.

CAMERA: strict side view (profile), like a classic 2D platformer: the creature seen from the side at body height, facing LEFT. Never a front view, 3/4 view or top view; poses only rotate within the flat picture plane.

DETAIL: draw every frame large (about 300–400 px wide), rich shading with 3–4 tones per colour, highlights, texture on skin, fur, feathers and claws. Do not simplify.

LAYOUT (very important): a grid of 3 rows × 4 columns, square image. Every ROW is one animation, frames read left to right. If a row has fewer than 4 frames, leave the rest of that row empty. Every frame shows the SAME creature at the SAME size, proportions, colours and pixel size, feet on one baseline within each row. Leave wide empty space between all frames and between rows: nothing touches or overlaps the next frame.

Row 1 – FLY (4 frames): wing cycle: 1 wings fully up, 2 wings level, 3 wings fully down, 4 wings level.
Row 2 – ATTACK (2 frames): 1 diving forward, wings swept back, beak open, talons forward; 2 snapping, beak wide open, wings flared.
Row 3 – IDLE (3 frames): perched on the ground, standing on its feet: 1 neutral; 2 BOUNCE: legs bent, body dipped down, feathers ruffled; 3 head raised, chest puffed up.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Hound (Upside Down) → `hound_sheet.png` (4 rows, 11 frames)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original lean, hairless four-legged predator from a dark parallel world: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Side view, facing LEFT in every frame.

CAMERA: strict side view (profile), like a classic 2D platformer: the creature seen from the side at body height, facing LEFT. Never a front view, 3/4 view or top view; poses only rotate within the flat picture plane.

DETAIL: draw every frame large (about 300–400 px wide), rich shading with 3–4 tones per colour, highlights, texture on skin, fur, feathers and claws. Do not simplify.

LAYOUT (very important): a grid of 4 rows × 4 columns, square image. Every ROW is one animation, frames read left to right. If a row has fewer than 4 frames, leave the rest of that row empty. Every frame shows the SAME creature at the SAME size, proportions, colours and pixel size, feet on one baseline within each row. Leave wide empty space between all frames and between rows: nothing touches or overlaps the next frame.

Row 1 – RUN (4 frames): gallop: 1 front legs reaching far forward, back legs stretched behind; 2 legs gathering under the body; 3 back legs pushing off; 4 all legs tucked, airborne.
Row 2 – JUMP (2 frames): pounce: 1 leaping up and forward, front claws reaching out, jaws wide open; 2 coming down, claws first.
Row 3 – ATTACK (2 frames): 1 braking hard, head pulled back, jaws opening; 2 lunging, jaws snapping shut.
Row 4 – IDLE (3 frames): standing on all fours: 1 neutral; 2 BOUNCE: legs bent, body crouched low, ready to pounce; 3 head raised, sniffing, ribs expanded.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Stalker (Upside Down) → `stalker_sheet.png` (3 rows, 10 frames)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original tall, gaunt, hunched humanoid creature from a dark parallel world: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Very tall: about TWICE the height of a 12-year-old kid. Original design, not copied from any show, film or game. Side view, facing LEFT in every frame.

CAMERA: strict side view (profile), like a classic 2D platformer: the creature seen from the side at body height, facing LEFT. Never a front view, 3/4 view or top view; poses only rotate within the flat picture plane.

DETAIL: draw every frame large (about 300–400 px wide), rich shading with 3–4 tones per colour, highlights, texture on skin, fur, feathers and claws. Do not simplify.

LAYOUT (very important): a grid of 3 rows × 4 columns, square image. Every ROW is one animation, frames read left to right. If a row has fewer than 4 frames, leave the rest of that row empty. Every frame shows the SAME creature at the SAME size, proportions, colours and pixel size, feet on one baseline within each row. Leave wide empty space between all frames and between rows: nothing touches or overlaps the next frame.

Row 1 – WALK (4 frames): a slow walk cycle: 1 left leg forward, right arm swinging forward; 2 legs passing; 3 right leg forward, left arm forward; 4 legs passing.
Row 2 – ATTACK (3 frames): 1 rearing up, one long arm raised high, claws spread; 2 the arm slashing down and forward, white claw-slash lines touching the claws; 3 follow-through, arm low, body hunched.
Row 3 – IDLE (3 frames): standing hunched: 1 neutral, long arms hanging; 2 BOUNCE: knees bent, body sinking, arms swaying; 3 straightening up, head and antlers raised.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Flyer (Upside Down) → `flyer_sheet.png` (3 rows, 9 frames)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original small flying creature from a dark parallel world: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Side view, facing LEFT in every frame.

CAMERA: strict side view (profile), like a classic 2D platformer: the creature seen from the side at body height, facing LEFT. Never a front view, 3/4 view or top view; poses only rotate within the flat picture plane.

DETAIL: draw every frame large (about 300–400 px wide), rich shading with 3–4 tones per colour, highlights, texture on skin, fur, feathers and claws. Do not simplify.

LAYOUT (very important): a grid of 3 rows × 4 columns, square image. Every ROW is one animation, frames read left to right. If a row has fewer than 4 frames, leave the rest of that row empty. Every frame shows the SAME creature at the SAME size, proportions, colours and pixel size, feet on one baseline within each row. Leave wide empty space between all frames and between rows: nothing touches or overlaps the next frame.

Row 1 – FLY (4 frames): 1 wings fully up, 2 wings level, 3 wings fully down, 4 wings level.
Row 2 – ATTACK (2 frames): 1 diving forward, wings folded back, tail barb raised; 2 tail barb whipping forward.
Row 3 – IDLE (3 frames): hovering in place: 1 wings level; 2 BOUNCE: body dipped down, wings raised; 3 body lifted, wings pushed down.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Spore pod (Upside Down) → `pod_sheet.png` (2 rows, 5 frames)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a pulsing fleshy spore pod rooted in the ground, crimson and deep red, short root tendrils at the base, two small glowing eyes. Original design. Match the attached reference. Side view, facing LEFT in every frame.

CAMERA: strict side view (profile), like a classic 2D platformer: the creature seen from the side at body height, facing LEFT. Never a front view, 3/4 view or top view; poses only rotate within the flat picture plane.

DETAIL: draw every frame large (about 300–400 px wide), rich shading with 3–4 tones per colour, highlights, texture on skin, fur, feathers and claws. Do not simplify.

LAYOUT (very important): a grid of 2 rows × 4 columns, landscape image. Every ROW is one animation, frames read left to right. If a row has fewer than 4 frames, leave the rest of that row empty. Every frame shows the SAME creature at the SAME size, proportions, colours and pixel size, feet on one baseline within each row. Leave wide empty space between all frames and between rows: nothing touches or overlaps the next frame.

Row 1 – IDLE (3 frames): 1 neutral, mouth closed; 2 BOUNCE: squashed down and wider; 3 stretched up taller and thinner, mouth closed.
Row 2 – ATTACK (2 frames): 1 swelling up, mouth starting to open, glowing pink inside; 2 mouth wide open, a glowing pink spore just leaving the mouth (touching it).

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

---

## 3. Street objects you can jump on (6 sheets)

Each sheet: the normal version on top, its Upside Down version below. The game reads the roof line straight from the art, so keep the top edge clean (no antennas or loose bits sticking up).

### Dumpster → `plat_dumpster_sheet.png`

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a green metal street dumpster with a closed flat lid, a bit dented, the long side facing the viewer. Flat side view, no perspective (no visible roof or top surface, no 3/4 angle), wheels or base at the bottom of each item. Rich detail: 3–4 shades per colour, chrome highlights, dents, rust, readable windows.

LAYOUT (very important): 2 items stacked vertically in a landscape image. TOP: the normal version, clean and lived-in. BOTTOM: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, a dull red glow in the windows, rust and spores. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Car → `plat_car_sheet.png`

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a boxy 1980s American sedan, faded red paint, chrome bumpers, the FRONT of the car on the LEFT. Flat side view, no perspective (no visible roof or top surface, no 3/4 angle), wheels or base at the bottom of each item. Rich detail: 3–4 shades per colour, chrome highlights, dents, rust, readable windows.

LAYOUT (very important): 2 items stacked vertically in a landscape image. TOP: the normal version, clean and lived-in. BOTTOM: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, a dull red glow in the windows, rust and spores. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Police car → `plat_cop_sheet.png`

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a 1980s small-town police car, white with a dark stripe, a light bar on the roof, the FRONT on the LEFT. Flat side view, no perspective (no visible roof or top surface, no 3/4 angle), wheels or base at the bottom of each item. Rich detail: 3–4 shades per colour, chrome highlights, dents, rust, readable windows.

LAYOUT (very important): 2 items stacked vertically in a landscape image. TOP: the normal version, clean and lived-in. BOTTOM: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, a dull red glow in the windows, rust and spores. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Van → `plat_van_sheet.png`

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a 1980s cream-coloured passenger van with side windows, the FRONT on the LEFT. Flat side view, no perspective (no visible roof or top surface, no 3/4 angle), wheels or base at the bottom of each item. Rich detail: 3–4 shades per colour, chrome highlights, dents, rust, readable windows.

LAYOUT (very important): 2 items stacked vertically in a landscape image. TOP: the normal version, clean and lived-in. BOTTOM: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, a dull red glow in the windows, rust and spores. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Pickup truck → `plat_pickup_sheet.png`

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a 1980s blue pickup truck with an open bed at the back, the FRONT on the LEFT. Flat side view, no perspective (no visible roof or top surface, no 3/4 angle), wheels or base at the bottom of each item. Rich detail: 3–4 shades per colour, chrome highlights, dents, rust, readable windows.

LAYOUT (very important): 2 items stacked vertically in a landscape image. TOP: the normal version, clean and lived-in. BOTTOM: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, a dull red glow in the windows, rust and spores. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### School bus → `plat_bus_sheet.png`

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: a long yellow 1980s school bus with a row of windows, the FRONT on the LEFT. Flat side view, no perspective (no visible roof or top surface, no 3/4 angle), wheels or base at the bottom of each item. Rich detail: 3–4 shades per colour, chrome highlights, dents, rust, readable windows.

LAYOUT (very important): 2 items stacked vertically in a landscape image. TOP: the normal version, clean and lived-in. BOTTOM: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, a dull red glow in the windows, rust and spores. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

---

## 4. Pickups, lights and projectiles (3 sheets)

### Pickups → `pickups_sheet.png` (5 items)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS, front/side view, all drawn at a similar small scale:

LAYOUT (very important): 2 rows in a landscape image. ROW 1, left to right: (1) a small wooden supply crate with rope handles and a Christmas-light cable poking out; (2) the same crate rotten and overgrown with black vines and a red glow (dark parallel world version); (3) a small square wooden crate with a big glossy red twenty-sided die (d20) painted on the front, a faint red glow seeping from the gaps. ROW 2, left to right: (4) a red skateboard with a yellow lightning bolt on the deck, seen from the side and slightly tilted, with a rainbow sparkle glow around it (a power-up); (5) the same skateboard, plain, flat side view, wheels down, no glow. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Christmas lights → `bulbs_sheet.png` (7 items)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: old-fashioned 1980s Christmas tree light bulbs (C7 shape), each with a small dark socket on top, glowing, seen from the side. All the same size and shape, only the colour differs.

LAYOUT (very important): 2 rows in a landscape image. ROW 1, left to right: red, green, blue, yellow. ROW 2, left to right: orange, pink, gold (gold is brighter, with a tiny white sparkle touching it). Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Projectiles → `projectiles_sheet.png` (3 items)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: tiny, simple, bold projectiles flying to the RIGHT, each with a short trail to the LEFT that touches it.

LAYOUT (very important): 1 row in a landscape image, left to right: (1) a glowing pink spore ball (spat by the spore pod); (2) a glowing blue marble (the Ranger's slingshot shot); (3) a small bottle-rocket firework flying to the RIGHT: a red-and-white striped paper rocket with a pointed cap, a thin stick behind it and an orange-yellow flame with sparks at its tail (the Wizard's firework). Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

---

## 5. The Watcher, background creature (1 sheet)

### The Watcher → `watcher_sheet.png` (2 items)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECT: an original colossal creature from a dark parallel world, seen from far away as a towering silhouette, front view. Almost black (#14060c) with a thin dull-crimson rim light, very little detail, smoky edges made of pixel clusters. Original design, not copied from any show, film or game.

LAYOUT (very important): 2 items side by side in a landscape image. LEFT (big, about 2/3 of the image height): the BODY without a head: twisted black roots and drifting storm smoke, two very long branch-like arms with twig claws reaching out to the sides, the bottom fading into roots; the neck ends flat and centred at the top. RIGHT (small, about 1/3 of the image height): the HEAD on its own: a long narrow skull crowned with huge branching black antlers like dead trees, two tiny glowing red eyes, a short neck stump at the bottom. Leave wide empty space between all items: nothing touches or overlaps another item. The smoke must stay attached to the body.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

---

## 6. HUD and UI (7 sheets)

Flat front view for everything in this section. The UI uses dark violet (#160d22) panels, gold (#ffd866) highlights and a red (#ff3d57) accent.

### In-game HUD → `hud_sheet.png` (7 items)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: small in-game HUD icons and a bar, pixel-art UI, flat front view.

LAYOUT (very important): 2 rows in a landscape image. ROW 1, left to right, all the same small size: (1) a full red pixel heart; (2) an empty heart: only the dark outline, hollow dark-violet inside; (3) a small glowing Christmas light bulb icon; (4) a teal heart with a small white plus sign and a wind swirl (an extra life); (5) a red warning sign: a red rounded rectangle with a white exclamation mark. ROW 2: (6) a long, thin, EMPTY horizontal bar frame: dark violet border with gold corner studs, hollow dark inside, about 8 times wider than tall; (7) below it, a long thin glowing bar fill: crimson to coral-red gradient made of pixel bands, the same width as the frame's inside, about 18 times wider than tall. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Upgrade icons → `upgrade_icons_sheet.png` (8 icons)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: 8 square shop icons for upgrades, each a symbol on a dark violet rounded tile with a thin gold edge, all tiles the same size.

LAYOUT (very important): 2 rows × 4 in a landscape image. ROW 1: (1) Extra heart: a red heart with a plus; (2) Longer bat: a wooden baseball bat with a stretch arrow; (3) Flashlight battery: a yellow 1980s battery with a lightning bolt; (4) Light magnet: a red horseshoe magnet pulling a Christmas bulb. ROW 2: (5) Dark greed: a crimson eye inside a gold coin; (6) Skateboard: a red skateboard with a yellow lightning bolt; (7) Double jump: two stacked white up-chevrons with a puff of air; (8) Second wind: a teal heart with a wind swirl. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Class icons → `class_icons_sheet.png` (6 icons)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: square emblem icons on dark violet rounded tiles with a thin gold edge, all tiles the same size.

LAYOUT (very important): 2 rows in a landscape image. ROW 1, left to right: (1) Fighter: a crossed baseball bat and dented trash-can lid; (2) Ranger: a wooden Y-slingshot with a blue marble; (3) Rogue: a 1980s walkie-talkie and a small square clip-on lamp; (4) Wizard: a cardboard cone hat with tinfoil stars and a stick wand. ROW 2, left to right: (5) a closed gold padlock, no tile, on its own; (6) a big red twenty-sided die seen face-on, the front face left EMPTY (no number: the game prints the number on it), no tile. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Ability icons → `stat_icons_sheet.png` (6 icons)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: 6 small square ability icons for a D&D-style character sheet, simple bold symbols in gold and cream on dark violet rounded tiles, all the same size.

LAYOUT (very important): 1 row in a landscape image, left to right: (1) STR: a flexed arm; (2) DEX: a winged sneaker; (3) CON: a heart on a shield; (4) INT: an open spell book; (5) WIS: an eye with a candle flame; (6) CHA: a sparkling star. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Touch buttons → `touch_buttons_sheet.png` (4 buttons)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: 4 round on-screen buttons for a phone game: dark violet circles with a thick gold rim and a cream symbol, all the same size.

LAYOUT (very important): 1 row in a landscape image, left to right: (1) ROLL: a curled arrow rolling forward and down; (2) JUMP: a bold arrow pointing up; (3) ATTACK: a baseball bat with a white slash arc; (4) FLIP: two arrows pointing in opposite directions, up and down, through a horizontal line. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Leaderboard medals → `medals_sheet.png` (3 medals)

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: 3 round medals hanging from short ribbons, each with a twenty-sided die embossed in the centre.

LAYOUT (very important): 1 row in a landscape image, left to right: (1) gold, red ribbon; (2) silver, blue ribbon; (3) bronze, green ribbon. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

### Menu frames → `ui_frames_sheet.png` (6 frames)

These stretch to fit any size, so each one needs an even border all round and a plain, flat centre.

```
Create ONE image: a pixel-art sprite sheet. Detailed 16-bit pixel art (late SNES / arcade quality) for a 2D side-scrolling endless runner: crisp hard-edged pixels, bold saturated colours, a dark 1-pixel outline (#1a1124) around every sprite, 1980s small-town horror mood.

SUBJECTS: pixel-art menu frames for a 1980s D&D-club themed game menu. Each is a rectangle with a decorative border of even thickness all the way round and a plain flat-colour centre (no pattern, no text in the centre).

LAYOUT (very important): 2 rows in a landscape image. ROW 1, left to right: (1) a button: dark violet (#2b1a3d) with a 2-pixel gold border and small corner rivets, 3 times wider than tall; (2) a primary button: crimson (#c8263f) with a gold border, same shape; (3) a list row: a long thin dark-violet strip with a thin gold underline, 6 times wider than tall. ROW 2, left to right: (4) a panel: a square dark-violet panel (#160d22) with an ornate gold-and-wood border; (5) a character-sheet frame: a square aged-parchment panel with a dark wood border and small corner ornaments; (6) a small square stat box: dark violet with a thin violet-grey border. Leave wide empty space between all items: nothing touches or overlaps another item.

BACKGROUND: one flat, solid, pure magenta colour (#FF00FF) everywhere behind and between the sprites. No gradient, no floor, no ground shadows, no checkerboard, no scenery.

DO NOT DRAW: any text, letters, numbers, labels, row titles, arrows, grid lines, cell borders or frames around the sprites. Effects (sparks, slash lines, motion lines) must touch the body or the weapon, never float on their own. Sharp hard pixel edges, no anti-aliasing, no blur.
```

---

## Checklist

| Sheet | Frames / items |
|---|---|
| `<class>_sheet_idle_run`, `_jump_attack`, `_roll_skate`, `_die` for fighter, ranger, rogue, wizard | 4 × 26 |
| `crow_sheet` 9 · `hound_sheet` 11 · `stalker_sheet` 10 · `flyer_sheet` 9 · `pod_sheet` 5 | 44 |
| `plat_dumpster_sheet`, `plat_car_sheet`, `plat_cop_sheet`, `plat_van_sheet`, `plat_pickup_sheet`, `plat_bus_sheet` | 6 × 2 |
| `pickups_sheet` 5 · `bulbs_sheet` 7 · `projectiles_sheet` 3 | 15 |
| `watcher_sheet` | 2 |
| `hud_sheet` 7 · `upgrade_icons_sheet` 8 · `class_icons_sheet` 6 · `stat_icons_sheet` 6 · `touch_buttons_sheet` 4 · `medals_sheet` 3 · `ui_frames_sheet` 6 | 40 |
| **38 prompts** | **197** |

Your logo, the scenery, the backdrops and the floor aren't here: you already have them.
